import { ManifestRequest } from '../gen/messages_pb';
import { getFilesAllowlist } from './get_files_allowlist';
import { testContext } from './testctx';
import { RICH_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('GetFilesAllowlist', () => {
  it('extracts the files allowlist verbatim, in source order', () => {
    // RICH_MANIFEST_JSON: files: ['dist', 'README.md'].
    const result = getFilesAllowlist(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getFilesList()).toEqual(['dist', 'README.md']);
  });

  it('returns an empty list (not an error) when files is absent -- means "no restriction"', () => {
    const result = getFilesAllowlist(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getFilesList()).toEqual([]);
  });

  it('drops a non-string array entry rather than crashing', () => {
    const manifest = JSON.stringify({ name: 'x', version: '1.0.0', files: ['dist', 42, 'README.md'] });
    const result = getFilesAllowlist(testContext, mkReq(manifest));
    expect(result.getError()).toBeUndefined();
    expect(result.getFilesList()).toEqual(['dist', 'README.md']);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = getFilesAllowlist(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
