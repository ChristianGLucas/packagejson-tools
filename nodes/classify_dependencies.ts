import {
  ManifestRequest,
  DependencyClassification,
  ClassificationCount,
  DependencyEntry,
} from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { allDependencyEntries, parseManifestJson, parseSpec, PjNodeError } from './helpers';

/**
 * Classify every dependency across all four sections by npm-package-arg
 * type (registry version/range/tag, git, file, directory, remote tarball,
 * alias, workspace) and return per-type counts — a one-call
 * supply-chain-composition summary, e.g. "12 registry, 2 git, 1 file, 0
 * workspace". A dependency whose raw_spec itself fails to parse is listed
 * in `unparseable` rather than failing the whole node.
 */
export function classifyDependencies(ax: AxiomContext, input: ManifestRequest): DependencyClassification {
  const result = new DependencyClassification();
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

  const entries = allDependencyEntries(manifest);
  const counts = new Map<string, number>();
  const unparseable: DependencyEntry[] = [];

  for (const entry of entries) {
    const parsed = parseSpec(entry.name, entry.rawSpec);
    if (parsed.status === 'error') {
      const pe = new DependencyEntry();
      pe.setSection(entry.section);
      pe.setName(entry.name);
      pe.setRawSpec(entry.rawSpec);
      unparseable.push(pe);
      continue;
    }
    counts.set(parsed.value.type, (counts.get(parsed.value.type) ?? 0) + 1);
  }

  const countsList = Array.from(counts.entries()).map(([type, count]) => {
    const c = new ClassificationCount();
    c.setType(type);
    c.setCount(count);
    return c;
  });
  result.setCountsList(countsList);
  result.setTotal(entries.length);
  result.setUnparseableList(unparseable);
  return result;
}
