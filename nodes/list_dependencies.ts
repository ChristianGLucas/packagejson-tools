import { ManifestRequest, DependencyList, DependencyEntry } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { allDependencyEntries, parseManifestJson, PjNodeError } from './helpers';

/**
 * List every dependency declared anywhere in the manifest — dependencies,
 * devDependencies, peerDependencies, and optionalDependencies — each
 * tagged with which section it came from plus its raw (unparsed) specifier
 * string. Use ParseDependencySpec on any entry's raw_spec to decompose it
 * further.
 */
export function listDependencies(ax: AxiomContext, input: ManifestRequest): DependencyList {
  const result = new DependencyList();
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

  const entries = allDependencyEntries(manifest).map((d) => {
    const pe = new DependencyEntry();
    pe.setSection(d.section);
    pe.setName(d.name);
    pe.setRawSpec(d.rawSpec);
    return pe;
  });
  result.setDepsList(entries);
  return result;
}
