import { ManifestDiffRequest } from '../gen/messages_pb';
import { diffManifests } from './diff_manifests';
import { testContext } from './testctx';
import { NOT_JSON } from './fixtures';

function mkReq(a: string, b: string): ManifestDiffRequest {
  const r = new ManifestDiffRequest();
  r.setManifestJsonA(a);
  r.setManifestJsonB(b);
  return r;
}

const A = JSON.stringify({
  name: 'x',
  version: '1.0.0',
  dependencies: { lodash: '^4.17.20', removedpkg: '^1.0.0' },
  devDependencies: { jest: '^28.0.0' },
});

const B = JSON.stringify({
  name: 'x',
  version: '1.0.1',
  dependencies: { lodash: '^4.17.21', addedpkg: '^2.0.0' },
  devDependencies: { jest: '^28.0.0' },
});

describe('DiffManifests', () => {
  it('reports added, removed, and changed dependencies across sections (hand-verified)', () => {
    const result = diffManifests(testContext, mkReq(A, B));
    expect(result.getError()).toBeUndefined();

    const added = result.getAddedList();
    expect(added.length).toBe(1);
    expect(added[0].getSection()).toBe('dependencies');
    expect(added[0].getName()).toBe('addedpkg');
    expect(added[0].getOldSpec()).toBe('');
    expect(added[0].getNewSpec()).toBe('^2.0.0');
    expect(added[0].getChangeType()).toBe('added');

    const removed = result.getRemovedList();
    expect(removed.length).toBe(1);
    expect(removed[0].getName()).toBe('removedpkg');
    expect(removed[0].getOldSpec()).toBe('^1.0.0');
    expect(removed[0].getNewSpec()).toBe('');
    expect(removed[0].getChangeType()).toBe('removed');

    const changed = result.getChangedList();
    expect(changed.length).toBe(1);
    expect(changed[0].getName()).toBe('lodash');
    expect(changed[0].getOldSpec()).toBe('^4.17.20');
    expect(changed[0].getNewSpec()).toBe('^4.17.21');
    expect(changed[0].getChangeType()).toBe('changed');

    // jest is identical in both -> not reported anywhere.
    expect([...added, ...removed, ...changed].some((c) => c.getName() === 'jest')).toBe(false);
  });

  it('reports no changes for two identical manifests', () => {
    const result = diffManifests(testContext, mkReq(A, A));
    expect(result.getAddedList()).toEqual([]);
    expect(result.getRemovedList()).toEqual([]);
    expect(result.getChangedList()).toEqual([]);
  });

  it('does not conflate the same package name across two different sections', () => {
    const same1 = JSON.stringify({ name: 'x', version: '1.0.0', dependencies: { foo: '^1.0.0' } });
    const same2 = JSON.stringify({ name: 'x', version: '1.0.0', devDependencies: { foo: '^1.0.0' } });
    const result = diffManifests(testContext, mkReq(same1, same2));
    // foo moved from dependencies to devDependencies: removed from one
    // section, added to the other -- not reported as "changed".
    expect(result.getRemovedList().length).toBe(1);
    expect(result.getRemovedList()[0].getSection()).toBe('dependencies');
    expect(result.getAddedList().length).toBe(1);
    expect(result.getAddedList()[0].getSection()).toBe('devDependencies');
    expect(result.getChangedList()).toEqual([]);
  });

  it('reports INVALID_JSON, naming which side failed, for malformed manifest_json_a', () => {
    const result = diffManifests(testContext, mkReq(NOT_JSON, B));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
    expect(result.getError()?.getMessage()).toContain('manifest_json_a');
  });

  it('reports INVALID_JSON, naming which side failed, for malformed manifest_json_b', () => {
    const result = diffManifests(testContext, mkReq(A, NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
    expect(result.getError()?.getMessage()).toContain('manifest_json_b');
  });
});
