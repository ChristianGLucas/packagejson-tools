import { ManifestRequest, ManifestSummary } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { asBool, asString, parseManifestJson, PjNodeError } from './helpers';

/**
 * Parse a package.json into its normalized top-level summary: name,
 * version, description, main/module/types entry points, license, and the
 * private flag. Fields absent from the source come back at their zero
 * value, which is not itself an error — only malformed JSON sets `error`.
 */
export function parseManifest(ax: AxiomContext, input: ManifestRequest): ManifestSummary {
  const result = new ManifestSummary();
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

  result.setName(asString(manifest.name));
  result.setVersion(asString(manifest.version));
  result.setDescription(asString(manifest.description));
  result.setMain(asString(manifest.main));
  result.setModule(asString(manifest.module));
  // "types" wins over the older "typings" alias when both are present.
  const types = asString(manifest.types) || asString(manifest.typings);
  result.setTypes(types);
  // license may be a plain SPDX string, or the deprecated
  // { "type": "...", "url": "..." } object form.
  const rawLicense = manifest.license;
  if (typeof rawLicense === 'string') {
    result.setLicense(rawLicense);
  } else if (rawLicense !== null && typeof rawLicense === 'object' && !Array.isArray(rawLicense)) {
    result.setLicense(asString((rawLicense as Record<string, unknown>).type));
  }
  result.setPrivate(asBool(manifest.private));
  return result;
}
