import { ManifestRequest } from '../gen/messages_pb';
import { getEngines } from './get_engines';
import { testContext } from './testctx';
import { RICH_MANIFEST, RICH_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('GetEngines', () => {
  it('extracts the engines field, verbatim (hand-verified against the fixture)', () => {
    const result = getEngines(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    const map = result.getEnginesMap();
    expect(map.get('node')).toBe('>=18');
    expect(map.get('npm')).toBe('>=9');
    expect(map.getLength()).toBe(Object.keys(RICH_MANIFEST.engines).length);
  });

  it('returns an empty map (not an error) when engines is absent', () => {
    const result = getEngines(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getEnginesMap().getLength()).toBe(0);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = getEngines(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
