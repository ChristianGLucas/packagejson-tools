import { ManifestRequest, FilesList } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { asStringArray, parseManifestJson, PjNodeError } from './helpers';

/**
 * Extract the `files` publish-allowlist field verbatim, in source order.
 * Empty means no allowlist restriction (everything not .npmignore'd
 * publishes), not "publish nothing".
 */
export function getFilesAllowlist(ax: AxiomContext, input: ManifestRequest): FilesList {
  const result = new FilesList();
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

  result.setFilesList(asStringArray(manifest.files));
  return result;
}
