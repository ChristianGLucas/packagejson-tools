import { ManifestRequest, WorkspaceList } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { asObject, asStringArray, parseManifestJson, PjNodeError } from './helpers';

/**
 * Detect monorepo status: the declared `workspaces` globs (accepting both
 * the array and the {packages: [...]} object form) and whether a
 * `workspaces` field is present at all.
 */
export function getWorkspaces(ax: AxiomContext, input: ManifestRequest): WorkspaceList {
  const result = new WorkspaceList();
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

  const raw = manifest.workspaces;
  result.setIsMonorepo(raw !== undefined);
  if (Array.isArray(raw)) {
    result.setGlobsList(asStringArray(raw));
  } else if (raw !== undefined) {
    // Yarn's object form: { "packages": [...], "nohoist": [...] }.
    const obj = asObject(raw);
    result.setGlobsList(asStringArray(obj.packages));
  }
  return result;
}
