import { NameRequest, NameValidationResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { isTooLarge, tooLargeError, validatePackageName as validate } from './helpers';

/**
 * Validate a string as an npm package name via validate-npm-package-name,
 * npm's own validator — reporting whether it is valid for new publishes,
 * valid for (grandfathered) old packages, and the specific
 * errors/warnings for each.
 */
export function validatePackageName(ax: AxiomContext, input: NameRequest): NameValidationResult {
  const result = new NameValidationResult();
  const name = input.getName();
  if (isTooLarge(name)) {
    // NameValidationResult has no `error` field (it always produces a
    // verdict); an oversized name is simply invalid on both counts, with
    // the size violation surfaced as its error string.
    result.setValidForNewPackages(false);
    result.setValidForOldPackages(false);
    result.setErrorsList([tooLargeError().getMessage()]);
    return result;
  }

  const v = validate(name);
  result.setValidForNewPackages(v.validForNewPackages);
  result.setValidForOldPackages(v.validForOldPackages);
  result.setErrorsList(v.errors);
  result.setWarningsList(v.warnings);
  return result;
}
