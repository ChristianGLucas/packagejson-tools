import { ManifestRequest } from '../gen/messages_pb';
import { getRepositoryInfo } from './get_repository_info';
import { testContext } from './testctx';
import { RICH_MANIFEST_JSON, LEGACY_FORMS_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('GetRepositoryInfo', () => {
  it('extracts the object forms of repository and bugs, plus homepage (hand-verified against the fixture)', () => {
    const result = getRepositoryInfo(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getRepositoryUrl()).toBe('https://github.com/acme/widgets');
    expect(result.getRepositoryType()).toBe('git');
    expect(result.getRepositoryDirectory()).toBe('packages/widgets');
    expect(result.getBugsUrl()).toBe('https://github.com/acme/widgets/issues');
    expect(result.getBugsEmail()).toBe('bugs@acme.example');
    expect(result.getHomepage()).toBe('https://widgets.acme.example');
  });

  it('normalizes the "user/repo" shorthand string to a GitHub URL (hosted-git-info, per npm convention)', () => {
    // LEGACY_FORMS_MANIFEST_JSON: repository="acme/legacy-pkg" (GitHub
    // shorthand), bugs is a bare URL string.
    const result = getRepositoryInfo(testContext, mkReq(LEGACY_FORMS_MANIFEST_JSON));
    expect(result.getRepositoryUrl()).toBe('https://github.com/acme/legacy-pkg');
    expect(result.getBugsUrl()).toBe('https://github.com/acme/legacy-pkg/issues');
  });

  it('normalizes a "github:user/repo" shorthand string identically to the bare form', () => {
    const manifest = JSON.stringify({ name: 'x', version: '1.0.0', repository: 'github:acme/other-pkg' });
    const result = getRepositoryInfo(testContext, mkReq(manifest));
    expect(result.getRepositoryUrl()).toBe('https://github.com/acme/other-pkg');
  });

  it('passes through an unrecognized-host URL unchanged (best effort, no known-host normalization)', () => {
    const manifest = JSON.stringify({
      name: 'x',
      version: '1.0.0',
      repository: 'https://git.internal.example.com/team/repo.git',
    });
    const result = getRepositoryInfo(testContext, mkReq(manifest));
    expect(result.getRepositoryUrl()).toBe('https://git.internal.example.com/team/repo.git');
  });

  it('returns all-empty fields (not an error) when repository/bugs/homepage are absent', () => {
    const result = getRepositoryInfo(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getRepositoryUrl()).toBe('');
    expect(result.getBugsUrl()).toBe('');
    expect(result.getHomepage()).toBe('');
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = getRepositoryInfo(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
