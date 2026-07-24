import { DependencySpecRequest, DependencySpecResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { mkError, parseSpec } from './helpers';

/**
 * Parse a single dependency specifier via npm-package-arg — the same
 * parser `npm install` itself uses — into structured form: type
 * (version/range/tag/alias/git/remote/file/directory/workspace), resolved
 * name, normalized raw form, fetch_spec, git host/committish/range when
 * applicable, and whether it resolves against the npm registry. This is
 * the node that classifies WHAT KIND of dependency a specifier is. Supply
 * name+spec (as pulled from a manifest's dependency object) or just a
 * combined "name@spec" string in `spec`. A specifier npm-package-arg
 * cannot parse comes back with `error` set rather than throwing.
 */
export function parseDependencySpec(ax: AxiomContext, input: DependencySpecRequest): DependencySpecResult {
  const result = new DependencySpecResult();
  const name = input.getName();
  const spec = input.getSpec();

  if (!name && !spec) {
    result.setError(mkError('INVALID_ARGUMENT', 'at least one of `name` / `spec` must be non-empty'));
    return result;
  }

  // When `name` is empty, `spec` is treated as a combined "name@spec"
  // string; parseSpec's name-less form handles that.
  const parsed = parseSpec(name, spec);
  if (parsed.status === 'error') {
    result.setError(mkError('INVALID_ARGUMENT', parsed.message));
    return result;
  }

  const v = parsed.value;
  result.setType(v.type);
  result.setName(v.name);
  result.setRaw(v.raw);
  result.setFetchSpec(v.fetchSpec);
  result.setGitCommittish(v.gitCommittish);
  result.setGitRange(v.gitRange);
  result.setHosted(v.hosted);
  result.setHostType(v.hostType);
  result.setRegistry(v.registry);
  result.setScope(v.scope);
  result.setSubSpec(v.subSpec);
  return result;
}
