import { ManifestRequest, ScriptMap } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { asStringMap, parseManifestJson, PjNodeError } from './helpers';

/**
 * List every entry in the manifest's `scripts` field as a name -> command
 * map, verbatim.
 */
export function listScripts(ax: AxiomContext, input: ManifestRequest): ScriptMap {
  const result = new ScriptMap();
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

  const scripts = asStringMap(manifest.scripts);
  const map = result.getScriptsMap();
  for (const [name, cmd] of Object.entries(scripts)) map.set(name, cmd);
  return result;
}
