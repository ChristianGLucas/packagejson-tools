import { ManifestRequest } from '../gen/messages_pb';
import { getDependencies } from './get_dependencies';
import { testContext } from './testctx';
import { RICH_MANIFEST, RICH_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('GetDependencies', () => {
  it('extracts only the runtime dependencies section, verbatim (hand-verified against the fixture)', () => {
    const result = getDependencies(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    const map = result.getDependenciesMap();
    expect(map.get('lodash')).toBe('^4.17.21');
    expect(map.get('left-pad')).toBe('1.3.0');
    expect(map.get('local-lib')).toBe('file:../local-lib');
    expect(map.getLength()).toBe(Object.keys(RICH_MANIFEST.dependencies).length);
    // devDependencies/peerDependencies must NOT leak into this map.
    expect(map.get('typescript')).toBeUndefined();
    expect(map.get('react')).toBeUndefined();
  });

  it('returns an empty map (not an error) when dependencies is absent', () => {
    const result = getDependencies(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getDependenciesMap().getLength()).toBe(0);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = getDependencies(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
