import { ManifestRequest, ModuleTypeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseManifestJson, PjNodeError } from './helpers';

/**
 * Detect whether the package is ESM ("type": "module") or CommonJS
 * (Node's implicit default when `type` is absent), reporting whether the
 * manifest set the field explicitly.
 */
export function detectModuleType(ax: AxiomContext, input: ManifestRequest): ModuleTypeResult {
  const result = new ModuleTypeResult();
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

  const rawType = manifest.type;
  if (rawType === 'module') {
    result.setModuleType('module');
    result.setExplicit(true);
  } else if (rawType === 'commonjs') {
    result.setModuleType('commonjs');
    result.setExplicit(true);
  } else {
    // Absent, or an unrecognized value -- Node itself falls back to
    // CommonJS for anything other than the literal "module".
    result.setModuleType('commonjs');
    result.setExplicit(false);
  }
  return result;
}
