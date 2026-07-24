import { DependencySpecRequest } from '../gen/messages_pb';
import { parseDependencySpec } from './parse_dependency_spec';
import { testContext } from './testctx';

function mkReq(name: string, spec: string): DependencySpecRequest {
  const r = new DependencySpecRequest();
  r.setName(name);
  r.setSpec(spec);
  return r;
}

// Every expected value below is hand-verified against npm's own documented
// dependency-specifier semantics (https://docs.npmjs.com/cli/v10/configuring-npm/package-json#dependencies)
// and cross-checked by running npm-package-arg directly at the shell during
// authoring — not merely re-derived from this node's own code path.
describe('ParseDependencySpec', () => {
  it('classifies a caret range as type=range, registry=true', () => {
    const result = parseDependencySpec(testContext, mkReq('lodash', '^4.17.21'));
    expect(result.getError()).toBeUndefined();
    expect(result.getType()).toBe('range');
    expect(result.getName()).toBe('lodash');
    expect(result.getRegistry()).toBe(true);
    expect(result.getFetchSpec()).toBe('^4.17.21');
    expect(result.getRaw()).toBe('lodash@^4.17.21');
  });

  it('classifies an exact version as type=version', () => {
    const result = parseDependencySpec(testContext, mkReq('left-pad', '1.3.0'));
    expect(result.getType()).toBe('version');
    expect(result.getRegistry()).toBe(true);
  });

  it('classifies a dist-tag as type=tag', () => {
    const result = parseDependencySpec(testContext, mkReq('pkg', 'latest'));
    expect(result.getType()).toBe('tag');
    expect(result.getFetchSpec()).toBe('latest');
  });

  it('classifies an npm: alias, exposing the aliased target in sub_spec', () => {
    const result = parseDependencySpec(testContext, mkReq('foo', 'npm:bar@1.2.3'));
    expect(result.getType()).toBe('alias');
    expect(result.getRegistry()).toBe(true);
    expect(result.getSubSpec()).toBe('bar@1.2.3');
  });

  it('classifies a git+https URL as type=git, hosted, github, with committish', () => {
    const result = parseDependencySpec(testContext, mkReq('pkg', 'git+https://github.com/user/repo.git#v1.0.0'));
    expect(result.getType()).toBe('git');
    expect(result.getHosted()).toBe(true);
    expect(result.getHostType()).toBe('github');
    expect(result.getGitCommittish()).toBe('v1.0.0');
  });

  it('classifies github: shorthand identically to a full git+https URL', () => {
    const result = parseDependencySpec(testContext, mkReq('pkg', 'github:user/repo#branch'));
    expect(result.getType()).toBe('git');
    expect(result.getHosted()).toBe(true);
    expect(result.getHostType()).toBe('github');
    expect(result.getGitCommittish()).toBe('branch');
  });

  it('classifies a non-hosted git URL as type=git, hosted=false', () => {
    const result = parseDependencySpec(testContext, mkReq('pkg', 'git+https://example.com/user/repo.git'));
    expect(result.getType()).toBe('git');
    expect(result.getHosted()).toBe(false);
  });

  it('classifies a remote tarball URL as type=remote', () => {
    const result = parseDependencySpec(testContext, mkReq('pkg', 'https://example.com/pkg-1.0.0.tgz'));
    expect(result.getType()).toBe('remote');
    expect(result.getFetchSpec()).toBe('https://example.com/pkg-1.0.0.tgz');
  });

  it('classifies a file: directory specifier as type=directory with a DETERMINISTIC fetch_spec', () => {
    const r1 = parseDependencySpec(testContext, mkReq('pkg', 'file:../local-lib'));
    const r2 = parseDependencySpec(testContext, mkReq('pkg', 'file:../local-lib'));
    expect(r1.getType()).toBe('directory');
    // Same input -> same fetch_spec, regardless of this process's real CWD
    // (the node pins a fixed base directory rather than resolving against
    // process.cwd(), which would make this non-deterministic).
    expect(r1.getFetchSpec()).toBe(r2.getFetchSpec());
    expect(r1.getFetchSpec()).toBe('/local-lib');
  });

  it('classifies a workspace: protocol specifier directly (npm-package-arg itself does not parse it)', () => {
    const result = parseDependencySpec(testContext, mkReq('sibling-pkg', 'workspace:*'));
    expect(result.getError()).toBeUndefined();
    expect(result.getType()).toBe('workspace');
    expect(result.getName()).toBe('sibling-pkg');
    expect(result.getRaw()).toBe('sibling-pkg@workspace:*');
  });

  it('parses a combined "name@spec" string when name is left empty', () => {
    const result = parseDependencySpec(testContext, mkReq('', 'lodash@^4.17.21'));
    expect(result.getError()).toBeUndefined();
    expect(result.getType()).toBe('range');
    expect(result.getName()).toBe('lodash');
  });

  it('extracts the npm scope for a scoped package', () => {
    const result = parseDependencySpec(testContext, mkReq('@acme/widgets', '^2.0.0'));
    expect(result.getScope()).toBe('@acme');
  });

  it('reports INVALID_ARGUMENT (not a crash) for an unparseable name', () => {
    const result = parseDependencySpec(testContext, mkReq('not a valid name!!', '^1.0.0'));
    expect(result.getError()?.getCode()).toBe('INVALID_ARGUMENT');
  });

  it('reports INVALID_ARGUMENT when both name and spec are empty', () => {
    const result = parseDependencySpec(testContext, mkReq('', ''));
    expect(result.getError()?.getCode()).toBe('INVALID_ARGUMENT');
  });

  it('handles a large spec string without crashing (no payload-length cap)', () => {
    // No payload-length cap is imposed by this node -- the platform bounds
    // that, not the node. A pathological spec still resolves to either a
    // parsed result or a structured INVALID_ARGUMENT error, never a crash.
    const result = parseDependencySpec(testContext, mkReq('pkg', '^'.repeat(50_000)));
    if (result.getError()) {
      expect(result.getError()?.getCode()).toBe('INVALID_ARGUMENT');
    } else {
      expect(result.getType()).toBeTruthy();
    }
  });

  it('is deterministic: same input twice yields the identical result', () => {
    const r1 = parseDependencySpec(testContext, mkReq('lodash', '^4.17.21'));
    const r2 = parseDependencySpec(testContext, mkReq('lodash', '^4.17.21'));
    expect(r1.getType()).toBe(r2.getType());
    expect(r1.getRaw()).toBe(r2.getRaw());
  });
});
