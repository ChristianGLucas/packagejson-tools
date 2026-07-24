// Shared parsing logic for all packagejson-tools nodes. Every node file is a
// thin wrapper: decode proto input -> call a helper -> encode proto output.
// Keeping the manifest-reading and npm-package-arg-calling logic here (once)
// is what keeps every node's error handling consistent. Payload size is the
// platform's job, not this package's — no node here imposes a byte-size cap.

import npa = require('npm-package-arg');
import validateName = require('validate-npm-package-name');
import { Error as PjError } from '../gen/messages_pb';

// Fixed synthetic base directory passed to every npm-package-arg call that
// might resolve a relative file:/directory specifier. Without an explicit
// "where", npm-package-arg resolves relative paths against this process's
// real CWD — environment-dependent, not a pure function of the input. A
// fixed base makes fetch_spec a deterministic function of the input alone.
export const FIXED_WHERE = '/package';

export function mkError(code: string, message: string): PjError {
  const e = new PjError();
  e.setCode(code);
  e.setMessage(message);
  return e;
}

export function invalidJsonError(detail: string): PjError {
  return mkError('INVALID_JSON', `manifest_json is not valid JSON: ${detail}`);
}

// A helper's own thrown failure, carrying a ready-made Error proto. Node
// bodies catch this and place it in the output's `error` field rather than
// letting it propagate as an uncaught exception.
export class PjNodeError extends Error {
  proto: PjError;
  constructor(proto: PjError) {
    super(proto.getMessage());
    this.proto = proto;
  }
}

export function fail(code: string, message: string): never {
  throw new PjNodeError(mkError(code, message));
}

// A package.json's shape is unknown/untrusted JSON — every field access
// below defends against the value being absent or the wrong type, rather
// than assuming a well-formed manifest.
export type Manifest = Record<string, unknown>;

// Parse manifest_json, defended against: INVALID_JSON on a JSON syntax
// error, and a rejection when the top-level value parses but is not a JSON
// object (a package.json must be one).
export function parseManifestJson(text: string): Manifest {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (e) {
    throw new PjNodeError(invalidJsonError((e as Error).message));
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new PjNodeError(
      invalidJsonError('top-level value is not a JSON object'),
    );
  }
  return value as Manifest;
}

export function asString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

export function asBool(v: unknown): boolean {
  return typeof v === 'boolean' ? v : false;
}

export function asObject(v: unknown): Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

export function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string');
}

// A "string map" field (dependencies, devDependencies, scripts, engines,
// ...): a JSON object whose own values are coerced to strings (non-string
// values, e.g. a stray number, are dropped rather than crashing the node —
// package.json is untrusted, caller-supplied text).
export function asStringMap(v: unknown): Record<string, string> {
  const obj = asObject(v);
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(obj)) {
    if (typeof val === 'string') out[k] = val;
  }
  return out;
}

const DEP_SECTIONS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
] as const;
export type DepSection = (typeof DEP_SECTIONS)[number];
export { DEP_SECTIONS };

export interface DepEntry {
  section: DepSection;
  name: string;
  rawSpec: string;
}

// All dependencies across the four sections, in fixed section order and
// each section's own JSON object key order.
export function allDependencyEntries(manifest: Manifest): DepEntry[] {
  const out: DepEntry[] = [];
  for (const section of DEP_SECTIONS) {
    const map = asStringMap(manifest[section]);
    for (const [name, rawSpec] of Object.entries(map)) {
      out.push({ section, name, rawSpec });
    }
  }
  return out;
}

// ── npm-package-arg wrapper ──────────────────────────────────────────────

export interface ParsedSpec {
  type: string;
  name: string;
  raw: string;
  fetchSpec: string;
  gitCommittish: string;
  gitRange: string;
  hosted: boolean;
  hostType: string;
  registry: boolean;
  scope: string;
  subSpec: string;
}

// npm-package-arg does not understand the "workspace:" protocol (pnpm/Yarn
// workspaces syntax, e.g. "workspace:*", "workspace:^") and throws on it.
// Detect and classify it directly rather than letting that throw surface as
// an unparseable entry — a workspace: specifier is well-formed, just not
// npm-package-arg's vocabulary.
function isWorkspaceProtocol(spec: string): boolean {
  return spec.trim().startsWith('workspace:');
}

// Parse one dependency specifier. Returns { status: 'ok', value } on
// success or { status: 'error', message } on failure — never throws — so
// callers can decide per-entry whether a parse failure is fatal
// (ParseDependencySpec) or just gets bucketed as "unparseable"
// (ClassifyDependencies).
//
// NOTE: the discriminant is deliberately a STRING literal ('ok'/'error'),
// not a boolean. This project's tsconfig has `strict: false`
// (strictNullChecks off, the axiom TypeScript scaffold default), and under
// that setting TypeScript's control-flow analysis does NOT narrow a
// boolean-literal discriminant (`{ ok: true } | { ok: false }`) on
// `if (!x.ok)` / `if (x.ok) {} else {}` — verified directly: the same
// union narrows correctly with a string discriminant but leaves the
// full union type (and a "property does not exist" error on the unique
// field) with a boolean one. String discriminant, always, in this file.
export function parseSpec(
  name: string,
  spec: string,
): { status: 'ok'; value: ParsedSpec } | { status: 'error'; message: string } {
  if (isWorkspaceProtocol(spec)) {
    const raw = name ? `${name}@${spec}` : spec;
    return {
      status: 'ok',
      value: {
        type: 'workspace',
        name: name || '',
        raw,
        fetchSpec: '',
        gitCommittish: '',
        gitRange: '',
        hosted: false,
        hostType: '',
        registry: false,
        scope: '',
        subSpec: '',
      },
    };
  }
  try {
    const r = name ? npa.resolve(name, spec, FIXED_WHERE) : npa(spec, FIXED_WHERE);
    const subSpec = r.type === 'alias' ? (r as npa.AliasResult).subSpec.raw : '';
    return {
      status: 'ok',
      value: {
        type: r.type ?? '',
        name: r.name ?? '',
        raw: r.raw ?? '',
        fetchSpec: r.fetchSpec ?? '',
        gitCommittish: r.gitCommittish ?? '',
        gitRange: r.gitRange ?? '',
        hosted: !!r.hosted,
        hostType: r.hosted?.type ?? '',
        registry: !!r.registry,
        scope: r.scope ?? '',
        subSpec,
      },
    };
  } catch (e) {
    return { status: 'error', message: (e as Error).message };
  }
}

export function toClassifiedName(v: validateName.Results): {
  validForNewPackages: boolean;
  validForOldPackages: boolean;
  errors: string[];
  warnings: string[];
} {
  return {
    validForNewPackages: v.validForNewPackages,
    validForOldPackages: v.validForOldPackages,
    errors: v.errors ?? [],
    warnings: v.warnings ?? [],
  };
}

export function validatePackageName(name: string) {
  return toClassifiedName(validateName(name));
}
