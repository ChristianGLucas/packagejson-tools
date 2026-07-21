import { ManifestDiffRequest, ManifestDiff, DependencyChange } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { allDependencyEntries, mkError, parseManifestJson, PjNodeError } from './helpers';

function mkChange(section: string, name: string, oldSpec: string, newSpec: string, changeType: string) {
  const c = new DependencyChange();
  c.setSection(section);
  c.setName(name);
  c.setOldSpec(oldSpec);
  c.setNewSpec(newSpec);
  c.setChangeType(changeType);
  return c;
}

/**
 * Diff the dependency sets of two package.json manifests across all four
 * sections: which name/section pairs were added, removed, or changed
 * specifier — useful for reviewing what a dependency-change PR actually
 * touches without reading two raw diffs by eye.
 */
export function diffManifests(ax: AxiomContext, input: ManifestDiffRequest): ManifestDiff {
  const result = new ManifestDiff();
  let manifestA, manifestB;
  try {
    manifestA = parseManifestJson(input.getManifestJsonA());
  } catch (e) {
    if (e instanceof PjNodeError) {
      result.setError(mkError(e.proto.getCode(), `manifest_json_a: ${e.proto.getMessage()}`));
      return result;
    }
    throw e;
  }
  try {
    manifestB = parseManifestJson(input.getManifestJsonB());
  } catch (e) {
    if (e instanceof PjNodeError) {
      result.setError(mkError(e.proto.getCode(), `manifest_json_b: ${e.proto.getMessage()}`));
      return result;
    }
    throw e;
  }

  // Nested by section then name -- never a concatenated string key, since
  // a dependency `name` is untrusted manifest content and must not be
  // parsed back apart from a delimiter it could itself contain.
  type BySection = Map<string, Map<string, string>>;
  const toBySection = (entries: ReturnType<typeof allDependencyEntries>): BySection => {
    const m: BySection = new Map();
    for (const d of entries) {
      if (!m.has(d.section)) m.set(d.section, new Map());
      m.get(d.section)!.set(d.name, d.rawSpec);
    }
    return m;
  };
  const aBySection = toBySection(allDependencyEntries(manifestA));
  const bBySection = toBySection(allDependencyEntries(manifestB));
  const allSections = new Set([...aBySection.keys(), ...bBySection.keys()]);

  const added: DependencyChange[] = [];
  const removed: DependencyChange[] = [];
  const changed: DependencyChange[] = [];

  for (const section of allSections) {
    const aNames = aBySection.get(section) ?? new Map<string, string>();
    const bNames = bBySection.get(section) ?? new Map<string, string>();
    for (const [name, newSpec] of bNames) {
      if (!aNames.has(name)) {
        added.push(mkChange(section, name, '', newSpec, 'added'));
      } else {
        const oldSpec = aNames.get(name)!;
        if (oldSpec !== newSpec) {
          changed.push(mkChange(section, name, oldSpec, newSpec, 'changed'));
        }
      }
    }
    for (const [name, oldSpec] of aNames) {
      if (!bNames.has(name)) {
        removed.push(mkChange(section, name, oldSpec, '', 'removed'));
      }
    }
  }

  result.setAddedList(added);
  result.setRemovedList(removed);
  result.setChangedList(changed);
  return result;
}
