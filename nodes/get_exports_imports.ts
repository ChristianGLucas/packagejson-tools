import { ManifestRequest, ExportsImportsResult, ExportsEntry } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseManifestJson, PjNodeError } from './helpers';

// Flatten an exports/imports field into one ExportsEntry per top-level
// subpath. `subpathPrefix` is the sentinel Node.js requires subpath keys to
// start with for that field: "." for `exports` (e.g. ".", "./feature") and
// "#" for `imports` (e.g. "#internal") -- the two fields use DIFFERENT
// prefixes, so this cannot be a single hardcoded check (an earlier version
// of this function checked "." for both and silently mis-flattened every
// `imports` map, caught by this node's own test). A field can be:
//   - absent -> no entries.
//   - a plain string / array / conditional object with no subpath-prefixed
//     keys (the legacy single-target or root-conditional form) -> one
//     entry under subpath ".". `imports` has no such legacy form in the
//     Node.js spec (every key must start with "#"), but this still
//     degrades safely to a single "." entry if it were ever malformed.
//   - an object whose keys all start with the subpath prefix -> one entry
//     per key, target re-serialized as JSON text (a target can itself be a
//     nested conditional object or an array of fallbacks).
function flatten(value: unknown, subpathPrefix: string): ExportsEntry[] {
  if (value === undefined) return [];
  const isSubpathMap =
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value as Record<string, unknown>).every((k) => k.startsWith(subpathPrefix));

  if (isSubpathMap) {
    return Object.entries(value as Record<string, unknown>).map(([subpath, target]) => {
      const e = new ExportsEntry();
      e.setSubpath(subpath);
      e.setTargetJson(JSON.stringify(target));
      return e;
    });
  }
  const e = new ExportsEntry();
  e.setSubpath('.');
  e.setTargetJson(JSON.stringify(value));
  return [e];
}

/**
 * Extract the modern `exports` and `imports` entry-point maps. Flattened
 * to a per-subpath list (each entry's nested/conditional target
 * re-serialized as JSON text, since a target can be a string, a
 * conditional object, or an array of fallbacks) plus the raw JSON of each
 * whole field for a caller that wants it unflattened.
 */
export function getExportsImports(ax: AxiomContext, input: ManifestRequest): ExportsImportsResult {
  const result = new ExportsImportsResult();
  let manifest;
  try {
    manifest = parseManifestJson(input.getManifestJson());
  } catch (e) {
    if (e instanceof PjNodeError) {
      result.setError(e.proto);
      return result;
    }
    throw e;
  }

  result.setExportsList(flatten(manifest.exports, '.'));
  result.setImportsList(flatten(manifest.imports, '#'));
  result.setExportsRawJson(manifest.exports !== undefined ? JSON.stringify(manifest.exports) : '');
  result.setImportsRawJson(manifest.imports !== undefined ? JSON.stringify(manifest.imports) : '');
  return result;
}
