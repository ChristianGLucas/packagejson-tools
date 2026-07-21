import { ManifestRequest, PeerDependencyList, PeerDependencyEntry } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { asObject, asStringMap, parseManifestJson, PjNodeError } from './helpers';

/**
 * Extract the `peerDependencies` section, each entry annotated with its
 * `peerDependenciesMeta.<name>.optional` flag (false when the manifest
 * declares no meta entry for that name — npm's own default), so an
 * optional peer is distinguishable from a required one without a second
 * lookup.
 */
export function getPeerDependencies(ax: AxiomContext, input: ManifestRequest): PeerDependencyList {
  const result = new PeerDependencyList();
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

  const peers = asStringMap(manifest.peerDependencies);
  const meta = asObject(manifest.peerDependenciesMeta);
  const entries = Object.entries(peers).map(([name, rawSpec]) => {
    const pe = new PeerDependencyEntry();
    pe.setName(name);
    pe.setRawSpec(rawSpec);
    const entryMeta = asObject(meta[name]);
    pe.setOptional(entryMeta.optional === true);
    return pe;
  });
  result.setPeersList(entries);
  return result;
}
