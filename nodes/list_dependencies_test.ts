import { ManifestRequest } from '../gen/messages_pb';
import { listDependencies } from './list_dependencies';
import { testContext } from './testctx';
import { RICH_MANIFEST, RICH_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('ListDependencies', () => {
  it('lists every dependency across all four sections, tagged with its section (hand-verified count)', () => {
    const result = listDependencies(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    const deps = result.getDepsList();
    const expectedTotal =
      Object.keys(RICH_MANIFEST.dependencies).length +
      Object.keys(RICH_MANIFEST.devDependencies).length +
      Object.keys(RICH_MANIFEST.peerDependencies).length +
      Object.keys(RICH_MANIFEST.optionalDependencies).length;
    expect(deps.length).toBe(expectedTotal);

    const lodash = deps.find((d) => d.getName() === 'lodash');
    expect(lodash?.getSection()).toBe('dependencies');
    expect(lodash?.getRawSpec()).toBe('^4.17.21');

    const ts = deps.find((d) => d.getName() === 'typescript');
    expect(ts?.getSection()).toBe('devDependencies');

    const react = deps.find((d) => d.getName() === 'react');
    expect(react?.getSection()).toBe('peerDependencies');

    const fsevents = deps.find((d) => d.getName() === 'fsevents');
    expect(fsevents?.getSection()).toBe('optionalDependencies');
  });

  it('returns an empty list (not an error) for a manifest with no dependency sections', () => {
    const result = listDependencies(testContext, mkReq(JSON.stringify({ name: 'x', version: '1.0.0' })));
    expect(result.getError()).toBeUndefined();
    expect(result.getDepsList()).toEqual([]);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = listDependencies(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });

  it('drops a non-string dependency value rather than crashing', () => {
    const bad = JSON.stringify({ name: 'x', version: '1.0.0', dependencies: { good: '^1.0.0', bad: 42 } });
    const result = listDependencies(testContext, mkReq(bad));
    expect(result.getError()).toBeUndefined();
    const names = result.getDepsList().map((d) => d.getName());
    expect(names).toEqual(['good']);
  });
});
