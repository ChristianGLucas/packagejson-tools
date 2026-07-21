import { ManifestRequest, DependencyMap } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { asStringMap, parseManifestJson, PjNodeError } from './helpers';

/**
 * Extract just the runtime `dependencies` section as a name -> raw
 * specifier map — the packages this manifest requires at runtime, without
 * dev/peer/optional noise.
 */
export function getDependencies(ax: AxiomContext, input: ManifestRequest): DependencyMap {
  const result = new DependencyMap();
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

  const deps = asStringMap(manifest.dependencies);
  const map = result.getDependenciesMap();
  for (const [name, spec] of Object.entries(deps)) map.set(name, spec);
  return result;
}
