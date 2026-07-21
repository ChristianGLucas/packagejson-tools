import { ManifestRequest } from '../gen/messages_pb';
import { getWorkspaces } from './get_workspaces';
import { testContext } from './testctx';
import { RICH_MANIFEST_JSON, LEGACY_FORMS_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('GetWorkspaces', () => {
  it('extracts the array form of workspaces and flags the manifest as a monorepo', () => {
    const result = getWorkspaces(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getGlobsList()).toEqual(['packages/*', 'tools/*']);
    expect(result.getIsMonorepo()).toBe(true);
  });

  it("extracts the object form's `packages` array", () => {
    const result = getWorkspaces(testContext, mkReq(LEGACY_FORMS_MANIFEST_JSON));
    expect(result.getGlobsList()).toEqual(['packages/*']);
    expect(result.getIsMonorepo()).toBe(true);
  });

  it('is not a monorepo (and has no globs) when workspaces is absent', () => {
    const result = getWorkspaces(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getIsMonorepo()).toBe(false);
    expect(result.getGlobsList()).toEqual([]);
  });

  it('is a monorepo even with an empty workspaces array (field present, no globs)', () => {
    const manifest = JSON.stringify({ name: 'x', version: '1.0.0', workspaces: [] });
    const result = getWorkspaces(testContext, mkReq(manifest));
    expect(result.getIsMonorepo()).toBe(true);
    expect(result.getGlobsList()).toEqual([]);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = getWorkspaces(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
