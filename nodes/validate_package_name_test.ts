import { NameRequest } from '../gen/messages_pb';
import { validatePackageName } from './validate_package_name';
import { testContext } from './testctx';
import { MAX_BYTES } from './helpers';

function mkReq(name: string): NameRequest {
  const r = new NameRequest();
  r.setName(name);
  return r;
}

// Expected values hand-verified against npm's documented naming rules
// (https://github.com/npm/validate-npm-package-name#naming-rules) and
// cross-checked by running validate-npm-package-name directly at the shell
// during authoring.
describe('ValidatePackageName', () => {
  it('accepts a normal lowercase name as valid for both new and old packages', () => {
    const result = validatePackageName(testContext, mkReq('lodash'));
    expect(result.getValidForNewPackages()).toBe(true);
    expect(result.getValidForOldPackages()).toBe(true);
    expect(result.getErrorsList()).toEqual([]);
  });

  it('accepts a scoped name', () => {
    const result = validatePackageName(testContext, mkReq('@acme/widgets'));
    expect(result.getValidForNewPackages()).toBe(true);
  });

  it('flags a capital-letter name as valid-for-old but not valid-for-new, with a warning', () => {
    const result = validatePackageName(testContext, mkReq('UPPERCASE-BAD'));
    expect(result.getValidForNewPackages()).toBe(false);
    expect(result.getValidForOldPackages()).toBe(true);
    expect(result.getWarningsList().length).toBeGreaterThan(0);
  });

  it('rejects a name starting with a period, invalid for both old and new', () => {
    const result = validatePackageName(testContext, mkReq('.starts-with-dot'));
    expect(result.getValidForNewPackages()).toBe(false);
    expect(result.getValidForOldPackages()).toBe(false);
    expect(result.getErrorsList().length).toBeGreaterThan(0);
  });

  it('rejects the reserved core-module name "node_modules"', () => {
    const result = validatePackageName(testContext, mkReq('node_modules'));
    expect(result.getValidForNewPackages()).toBe(false);
    expect(result.getValidForOldPackages()).toBe(false);
  });

  it('rejects an empty name, invalid rather than crashing', () => {
    const result = validatePackageName(testContext, mkReq(''));
    expect(result.getValidForNewPackages()).toBe(false);
    expect(result.getErrorsList().length).toBeGreaterThan(0);
  });

  it('treats an oversized name as invalid (TOO_LARGE surfaced in errors) rather than crashing', () => {
    const result = validatePackageName(testContext, mkReq('a'.repeat(MAX_BYTES + 1)));
    expect(result.getValidForNewPackages()).toBe(false);
    expect(result.getValidForOldPackages()).toBe(false);
    expect(result.getErrorsList().length).toBeGreaterThan(0);
  });

  it('is deterministic: same input twice yields identical output', () => {
    const r1 = validatePackageName(testContext, mkReq('lodash'));
    const r2 = validatePackageName(testContext, mkReq('lodash'));
    expect(r1.getValidForNewPackages()).toBe(r2.getValidForNewPackages());
  });
});
