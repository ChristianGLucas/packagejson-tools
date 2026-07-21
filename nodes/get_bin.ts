import { ManifestRequest, BinMap } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { asString, asStringMap, parseManifestJson, PjNodeError } from './helpers';

/**
 * Extract the declared `bin` field, normalized to a command-name -> path
 * map even when the manifest used npm's single-string shorthand
 * (equivalent to naming one command after the package's own name).
 */
export function getBin(ax: AxiomContext, input: ManifestRequest): BinMap {
  const result = new BinMap();
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

  const map = result.getBinMap();
  const rawBin = manifest.bin;
  if (typeof rawBin === 'string') {
    // Shorthand: "bin": "./cli.js" means one command, named after the
    // package's own (possibly scoped) name -- npm strips the scope.
    const pkgName = asString(manifest.name);
    const cmdName = pkgName.includes('/') ? pkgName.split('/').pop()! : pkgName;
    if (cmdName) map.set(cmdName, rawBin);
  } else {
    const bin = asStringMap(rawBin);
    for (const [cmd, path] of Object.entries(bin)) map.set(cmd, path);
  }
  return result;
}
