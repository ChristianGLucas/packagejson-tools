import { NameRequest, NameValidationResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { validatePackageName as validate } from './helpers';

/**
 * Validate a string as an npm package name via validate-npm-package-name,
 * npm's own validator — reporting whether it is valid for new publishes,
 * valid for (grandfathered) old packages, and the specific
 * errors/warnings for each.
 */
export function validatePackageName(ax: AxiomContext, input: NameRequest): NameValidationResult {
  const result = new NameValidationResult();
  const name = input.getName();
  const v = validate(name);
  result.setValidForNewPackages(v.validForNewPackages);
  result.setValidForOldPackages(v.validForOldPackages);
  result.setErrorsList(v.errors);
  result.setWarningsList(v.warnings);
  return result;
}
