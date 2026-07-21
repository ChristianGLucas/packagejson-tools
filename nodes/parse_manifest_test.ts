import { ManifestRequest } from '../gen/messages_pb';
import { parseManifest } from './parse_manifest';
import { testContext } from './testctx';
import { RICH_MANIFEST, RICH_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, LEGACY_FORMS_MANIFEST_JSON, NOT_JSON, JSON_ARRAY } from './fixtures';
import { MAX_BYTES } from './helpers';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('ParseManifest', () => {
  it('extracts the top-level summary fields (hand-verified against the fixture object)', () => {
    const result = parseManifest(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getName()).toBe(RICH_MANIFEST.name);
    expect(result.getVersion()).toBe(RICH_MANIFEST.version);
    expect(result.getDescription()).toBe(RICH_MANIFEST.description);
    expect(result.getMain()).toBe(RICH_MANIFEST.main);
    expect(result.getModule()).toBe(RICH_MANIFEST.module);
    expect(result.getTypes()).toBe(RICH_MANIFEST.types);
    expect(result.getLicense()).toBe('MIT');
    expect(result.getPrivate()).toBe(false);
  });

  it('falls back to "typings" when "types" is absent, and renders a license object to its type', () => {
    const result = parseManifest(testContext, mkReq(LEGACY_FORMS_MANIFEST_JSON));
    expect(result.getTypes()).toBe('./index.d.ts');
    expect(result.getLicense()).toBe('ISC');
  });

  it('returns zero-value fields (not an error) for a minimal manifest', () => {
    const result = parseManifest(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getName()).toBe('tiny-pkg');
    expect(result.getDescription()).toBe('');
    expect(result.getMain()).toBe('');
    expect(result.getPrivate()).toBe(false);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = parseManifest(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });

  it('reports INVALID_JSON when the top-level JSON value is not an object', () => {
    const result = parseManifest(testContext, mkReq(JSON_ARRAY));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });

  it('reports TOO_LARGE for an oversized manifest instead of parsing it', () => {
    const huge = JSON.stringify({ name: 'x', version: '1.0.0', description: 'a'.repeat(MAX_BYTES + 1) });
    const result = parseManifest(testContext, mkReq(huge));
    expect(result.getError()?.getCode()).toBe('TOO_LARGE');
  });

  it('is deterministic: same input twice yields identical output', () => {
    const r1 = parseManifest(testContext, mkReq(RICH_MANIFEST_JSON));
    const r2 = parseManifest(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(r1.getName()).toBe(r2.getName());
    expect(r1.getVersion()).toBe(r2.getVersion());
  });
});
