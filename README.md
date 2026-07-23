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

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/packagejson-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/packagejson-tools/ParseManifest --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/packagejson-tools/0.1.0/ParseManifest \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/packagejson-tools/ParseManifest`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

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
