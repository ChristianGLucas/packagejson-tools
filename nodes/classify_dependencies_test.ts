import { ManifestRequest } from '../gen/messages_pb';
import { classifyDependencies } from './classify_dependencies';
import { testContext } from './testctx';
import { RICH_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

function countsToMap(result: ReturnType<typeof classifyDependencies>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of result.getCountsList()) out[c.getType()] = c.getCount();
  return out;
}

describe('ClassifyDependencies', () => {
  it('classifies every dependency across all four sections by npm-package-arg type (hand-verified per-entry)', () => {
    // RICH_MANIFEST's dependencies: lodash=range, left-pad=version,
    // my-fork=git (git+https), gh-pkg=git (github:), local-lib=directory
    // (file:). devDependencies: typescript/jest=range (2 more range).
    // peerDependencies: react/react-dom=range (>= is a range, 2 more
    // range). optionalDependencies: fsevents=range (1 more range).
    const result = classifyDependencies(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    const counts = countsToMap(result);
    expect(counts.range).toBe(6); // lodash, typescript, jest, react, react-dom, fsevents
    expect(counts.version).toBe(1); // left-pad
    expect(counts.git).toBe(2); // my-fork, gh-pkg
    expect(counts.directory).toBe(1); // local-lib
    expect(result.getTotal()).toBe(10);
    expect(result.getUnparseableList()).toEqual([]);
  });

  it('buckets an unparseable spec in `unparseable` rather than failing the whole node', () => {
    const bad = JSON.stringify({
      name: 'x',
      version: '1.0.0',
      dependencies: { good: '^1.0.0', 'bad name here': '1.0.0' },
    });
    const result = classifyDependencies(testContext, mkReq(bad));
    expect(result.getError()).toBeUndefined();
    expect(result.getTotal()).toBe(2);
    expect(result.getUnparseableList().length).toBe(1);
    expect(result.getUnparseableList()[0].getName()).toBe('bad name here');
    // The good entry is still classified correctly.
    const counts = countsToMap(result);
    expect(counts.range).toBe(1);
  });

  it('returns all-zero counts (not an error) for a manifest with no dependencies', () => {
    const result = classifyDependencies(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getTotal()).toBe(0);
    expect(result.getCountsList()).toEqual([]);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = classifyDependencies(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
