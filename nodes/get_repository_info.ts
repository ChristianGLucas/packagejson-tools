import { ManifestRequest, RepositoryInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { asObject, asString, parseManifestJson, PjNodeError } from './helpers';

// hosted-git-info ships no type declarations; strict/noImplicitAny is off
// for this project, so this comes through as an untyped require (the same
// module npm-package-arg itself depends on for git-host recognition).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const hostedGitInfo = require('hosted-git-info');

// Normalize a repository/bugs URL-ish string (a shorthand like "user/repo",
// "github:user/repo", or a full git/https URL) to a plain https browse
// URL when it names a host hosted-git-info recognizes (GitHub, GitLab,
// Bitbucket, Gist); otherwise returned unchanged (still a best-effort
// string, e.g. a private git server URL this package has no special
// knowledge of).
function normalizeRepoUrl(raw: string): string {
  if (!raw) return '';
  try {
    const info = hostedGitInfo.fromUrl(raw);
    if (info) return info.browse();
  } catch {
    // fall through to raw
  }
  return raw;
}

function normalizeBugsUrl(raw: string): string {
  if (!raw) return '';
  try {
    const info = hostedGitInfo.fromUrl(raw);
    if (info) return info.bugs();
  } catch {
    // fall through to raw
  }
  return raw;
}

/**
 * Extract and normalize the `repository`, `bugs`, and `homepage` fields —
 * including npm's shorthand forms ("user/repo", "github:user/repo", a bare
 * bugs URL string) — into plain URL strings.
 */
export function getRepositoryInfo(ax: AxiomContext, input: ManifestRequest): RepositoryInfo {
  const result = new RepositoryInfo();
  let manifest;
  try {
    manifest = parseManifestJson(input.getManifestJson());
  } catch (e) {
    if (e instanceof PjNodeError) {
      result.setError(e.proto);
      return result;
    }
    throw e;
  }

  const rawRepo = manifest.repository;
  if (typeof rawRepo === 'string') {
    result.setRepositoryUrl(normalizeRepoUrl(rawRepo));
  } else if (rawRepo !== null && typeof rawRepo === 'object' && !Array.isArray(rawRepo)) {
    const repoObj = asObject(rawRepo);
    result.setRepositoryUrl(normalizeRepoUrl(asString(repoObj.url)));
    result.setRepositoryType(asString(repoObj.type));
    result.setRepositoryDirectory(asString(repoObj.directory));
  }

  const rawBugs = manifest.bugs;
  if (typeof rawBugs === 'string') {
    result.setBugsUrl(normalizeBugsUrl(rawBugs));
  } else if (rawBugs !== null && typeof rawBugs === 'object' && !Array.isArray(rawBugs)) {
    const bugsObj = asObject(rawBugs);
    result.setBugsUrl(asString(bugsObj.url));
    result.setBugsEmail(asString(bugsObj.email));
  }

  result.setHomepage(asString(manifest.homepage));
  return result;
}
