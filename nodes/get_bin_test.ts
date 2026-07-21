import { ManifestRequest } from '../gen/messages_pb';
import { getBin } from './get_bin';
import { testContext } from './testctx';
import { RICH_MANIFEST_JSON, LEGACY_FORMS_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('GetBin', () => {
  it('extracts the object form of bin, verbatim', () => {
    const result = getBin(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getBinMap().get('widgets')).toBe('./bin/widgets.js');
    expect(result.getBinMap().getLength()).toBe(1);
  });

  it('normalizes the single-string shorthand to {<package name>: path}', () => {
    // LEGACY_FORMS_MANIFEST_JSON: name="legacy-pkg", bin="./cli.js".
    const result = getBin(testContext, mkReq(LEGACY_FORMS_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    const map = result.getBinMap();
    expect(map.getLength()).toBe(1);
    expect(map.get('legacy-pkg')).toBe('./cli.js');
  });

  it('strips the scope when naming the shorthand command for a scoped package', () => {
    const manifest = JSON.stringify({ name: '@acme/cli-tool', version: '1.0.0', bin: './run.js' });
    const result = getBin(testContext, mkReq(manifest));
    expect(result.getBinMap().get('cli-tool')).toBe('./run.js');
  });

  it('returns an empty map (not an error) when bin is absent', () => {
    const result = getBin(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getBinMap().getLength()).toBe(0);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = getBin(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
