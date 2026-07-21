import { ManifestRequest } from '../gen/messages_pb';
import { detectModuleType } from './detect_module_type';
import { testContext } from './testctx';
import { RICH_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('DetectModuleType', () => {
  it('detects ESM when "type": "module" is set explicitly', () => {
    // RICH_MANIFEST_JSON has "type": "module".
    const result = detectModuleType(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getModuleType()).toBe('module');
    expect(result.getExplicit()).toBe(true);
  });

  it('detects CommonJS explicitly when "type": "commonjs" is set', () => {
    const manifest = JSON.stringify({ name: 'x', version: '1.0.0', type: 'commonjs' });
    const result = detectModuleType(testContext, mkReq(manifest));
    expect(result.getModuleType()).toBe('commonjs');
    expect(result.getExplicit()).toBe(true);
  });

  it('defaults to CommonJS, marked NOT explicit, when "type" is absent (Node\'s own default)', () => {
    const result = detectModuleType(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getModuleType()).toBe('commonjs');
    expect(result.getExplicit()).toBe(false);
  });

  it('falls back to the implicit CommonJS default for an unrecognized "type" value', () => {
    const manifest = JSON.stringify({ name: 'x', version: '1.0.0', type: 'bogus' });
    const result = detectModuleType(testContext, mkReq(manifest));
    expect(result.getModuleType()).toBe('commonjs');
    expect(result.getExplicit()).toBe(false);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = detectModuleType(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
