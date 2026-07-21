import { ManifestRequest } from '../gen/messages_pb';
import { getExportsImports } from './get_exports_imports';
import { testContext } from './testctx';
import { EXPORTS_MANIFEST_JSON, SIMPLE_EXPORTS_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('GetExportsImports', () => {
  it('flattens a subpath exports map, one entry per subpath, target re-serialized as JSON', () => {
    const result = getExportsImports(testContext, mkReq(EXPORTS_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    const entries = result.getExportsList();
    expect(entries.length).toBe(3);

    const root = entries.find((e) => e.getSubpath() === '.');
    expect(JSON.parse(root!.getTargetJson())).toEqual({
      import: './dist/index.mjs',
      require: './dist/index.cjs',
    });

    const feature = entries.find((e) => e.getSubpath() === './feature');
    expect(JSON.parse(feature!.getTargetJson())).toBe('./dist/feature.js');

    const imports = result.getImportsList();
    expect(imports.length).toBe(1);
    expect(imports[0].getSubpath()).toBe('#internal');
    expect(JSON.parse(imports[0].getTargetJson())).toBe('./src/internal.js');
  });

  it('exposes the raw whole-field JSON alongside the flattened form', () => {
    const result = getExportsImports(testContext, mkReq(EXPORTS_MANIFEST_JSON));
    const raw = JSON.parse(result.getExportsRawJson());
    expect(raw['.']).toEqual({ import: './dist/index.mjs', require: './dist/index.cjs' });
  });

  it('treats a legacy single-string exports value as one entry under subpath "."', () => {
    const result = getExportsImports(testContext, mkReq(SIMPLE_EXPORTS_MANIFEST_JSON));
    const entries = result.getExportsList();
    expect(entries.length).toBe(1);
    expect(entries[0].getSubpath()).toBe('.');
    expect(JSON.parse(entries[0].getTargetJson())).toBe('./index.js');
  });

  it('returns empty lists and empty raw JSON (not an error) when exports/imports are absent', () => {
    const result = getExportsImports(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getExportsList()).toEqual([]);
    expect(result.getImportsList()).toEqual([]);
    expect(result.getExportsRawJson()).toBe('');
    expect(result.getImportsRawJson()).toBe('');
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = getExportsImports(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
