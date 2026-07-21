import { ManifestRequest } from '../gen/messages_pb';
import { listScripts } from './list_scripts';
import { testContext } from './testctx';
import { RICH_MANIFEST, RICH_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('ListScripts', () => {
  it('lists every scripts entry, verbatim (hand-verified against the fixture)', () => {
    const result = listScripts(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    const map = result.getScriptsMap();
    expect(map.get('build')).toBe('tsc');
    expect(map.get('test')).toBe('jest');
    expect(map.get('lint')).toBe('eslint .');
    expect(map.getLength()).toBe(Object.keys(RICH_MANIFEST.scripts).length);
  });

  it('returns an empty map (not an error) when scripts is absent', () => {
    const result = listScripts(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getScriptsMap().getLength()).toBe(0);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = listScripts(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
