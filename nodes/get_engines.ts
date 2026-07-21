import { ManifestRequest, EngineMap } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { asStringMap, parseManifestJson, PjNodeError } from './helpers';

/**
 * Extract the declared `engines` field (e.g. {"node": ">=18", "npm":
 * ">=9"}) as a name -> semver-range-string map, verbatim.
 */
export function getEngines(ax: AxiomContext, input: ManifestRequest): EngineMap {
  const result = new EngineMap();
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

  const engines = asStringMap(manifest.engines);
  const map = result.getEnginesMap();
  for (const [name, range] of Object.entries(engines)) map.set(name, range);
  return result;
}
