import { ManifestRequest } from '../gen/messages_pb';
import { getDevDependencies } from './get_dev_dependencies';
import { testContext } from './testctx';
import { RICH_MANIFEST, RICH_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('GetDevDependencies', () => {
  it('extracts only the devDependencies section, verbatim (hand-verified against the fixture)', () => {
    const result = getDevDependencies(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    const map = result.getDependenciesMap();
    expect(map.get('typescript')).toBe('^5.4.0');
    expect(map.get('jest')).toBe('^29.7.0');
    expect(map.getLength()).toBe(Object.keys(RICH_MANIFEST.devDependencies).length);
    // Runtime dependencies must NOT leak into this map.
    expect(map.get('lodash')).toBeUndefined();
  });

  it('returns an empty map (not an error) when devDependencies is absent', () => {
    const result = getDevDependencies(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getDependenciesMap().getLength()).toBe(0);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = getDevDependencies(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
