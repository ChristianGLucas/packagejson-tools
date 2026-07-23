# christiangeorgelucas/packagejson-tools

Deterministic parsing, inspection, and dependency-specifier analysis of npm
`package.json` manifests, for the [Axiom](https://axiomide.com) marketplace.

Every node is a pure, stateless, deterministic function: the manifest is
always supplied as JSON text by the caller. No npm registry lookups, no
filesystem access, no wall clock, no randomness. Malformed input never
crashes a node — a bad manifest returns a structured error, and a single bad
dependency spec is reported per-entry, never fatal to the whole manifest.

Wraps two of npm's own reference libraries (both ISC, from the `npm` GitHub
org):

- [`npm-package-arg`](https://github.com/npm/npm-package-arg) — the exact
  parser `npm install` uses to turn a dependency specifier
  (`foo@^1.2.3`, `foo@npm:bar@1`, a git/github/file/tarball URL) into
  structured `{type, name, fetchSpec, gitRange, ...}` form.
- [`validate-npm-package-name`](https://github.com/npm/validate-npm-package-name)
  — npm's own package-name validator.

## Nodes

| Node | What it does |
|---|---|
| `ParseManifest` | Normalized top-level summary: name, version, description, main/module/types, license, private. |
| `ListDependencies` | Every dependency across all four sections, each tagged with its section + raw spec. |
| `GetDependencies` | Just the runtime `dependencies` section, as a name → spec map. |
| `GetDevDependencies` | Just the `devDependencies` section. |
| `GetPeerDependencies` | `peerDependencies`, each entry annotated with its `peerDependenciesMeta.optional` flag. |
| `ParseDependencySpec` | Parse a single dependency specifier via npm-package-arg into structured form (version/range/tag/alias/git/remote/file/directory/workspace). |
| `ClassifyDependencies` | Per-type counts across all dependencies — a one-call supply-chain-composition summary. |
| `ListScripts` | The `scripts` map, verbatim. |
| `GetEngines` | The `engines` map (node/npm version constraints), verbatim. |
| `GetBin` | The `bin` map, normalized even from the single-string shorthand. |
| `GetExportsImports` | The `exports`/`imports` entry-point maps, flattened per subpath. |
| `GetWorkspaces` | Monorepo detection: declared workspace globs (array or object form). |
| `GetRepositoryInfo` | Normalized `repository`/`bugs`/`homepage` URLs, including npm's shorthand forms. |
| `ValidatePackageName` | Validate a string as an npm package name via npm's own validator. |
| `DetectModuleType` | ESM vs CommonJS detection (`"type": "module"` vs Node's implicit default). |
| `GetFilesAllowlist` | The `files` publish-allowlist, verbatim. |
| `DiffManifests` | Diff the dependency sets of two manifests: added/removed/changed. |

## License

MIT. See [LICENSE](./LICENSE).

Built for the Axiom marketplace.
