// Shared realistic package.json fixtures for node tests. Not a test file
// itself (jest's testMatch is nodes/**/*_test.ts).

// A realistic, sizeable manifest exercising most fields at once: a mix of
// dependency-specifier kinds (registry range, exact version, git+https,
// github shorthand, file:, workspace:), peerDependenciesMeta, scripts,
// engines, bin (object form), workspaces (array form), repository as an
// object, bugs as an object, and an explicit ESM type.
export const RICH_MANIFEST = {
  name: '@acme/widgets',
  version: '2.3.1',
  description: 'Turns raw widgets into polished widgets.',
  main: './dist/index.js',
  module: './dist/index.mjs',
  types: './dist/index.d.ts',
  license: 'MIT',
  private: false,
  type: 'module',
  dependencies: {
    lodash: '^4.17.21',
    'left-pad': '1.3.0',
    'my-fork': 'git+https://github.com/acme/my-fork.git#v2.0.0',
    'gh-pkg': 'github:acme/gh-pkg#main',
    'local-lib': 'file:../local-lib',
  },
  devDependencies: {
    typescript: '^5.4.0',
    jest: '^29.7.0',
  },
  peerDependencies: {
    react: '>=17.0.0',
    'react-dom': '>=17.0.0',
  },
  peerDependenciesMeta: {
    'react-dom': { optional: true },
  },
  optionalDependencies: {
    fsevents: '^2.3.3',
  },
  scripts: {
    build: 'tsc',
    test: 'jest',
    lint: 'eslint .',
  },
  engines: {
    node: '>=18',
    npm: '>=9',
  },
  bin: {
    widgets: './bin/widgets.js',
  },
  workspaces: ['packages/*', 'tools/*'],
  repository: {
    type: 'git',
    url: 'https://github.com/acme/widgets.git',
    directory: 'packages/widgets',
  },
  bugs: {
    url: 'https://github.com/acme/widgets/issues',
    email: 'bugs@acme.example',
  },
  homepage: 'https://widgets.acme.example',
  files: ['dist', 'README.md'],
};

export const RICH_MANIFEST_JSON = JSON.stringify(RICH_MANIFEST);

// A minimal manifest: only the fields every package.json realistically
// has, nothing else -- exercises the "field absent" zero-value paths.
export const MINIMAL_MANIFEST_JSON = JSON.stringify({ name: 'tiny-pkg', version: '0.0.1' });

// A manifest using the legacy/shorthand forms ParseManifest and friends
// must also accept: license object form, bin single-string shorthand,
// workspaces object form, repository shorthand string, typings (not
// types), no explicit "type" (implicit CommonJS).
export const LEGACY_FORMS_MANIFEST_JSON = JSON.stringify({
  name: 'legacy-pkg',
  version: '1.0.0',
  license: { type: 'ISC', url: 'https://opensource.org/licenses/ISC' },
  typings: './index.d.ts',
  bin: './cli.js',
  workspaces: { packages: ['packages/*'], nohoist: ['**/react'] },
  repository: 'acme/legacy-pkg',
  bugs: 'https://github.com/acme/legacy-pkg/issues',
});

export const EXPORTS_MANIFEST_JSON = JSON.stringify({
  name: 'exports-pkg',
  version: '1.0.0',
  exports: {
    '.': {
      import: './dist/index.mjs',
      require: './dist/index.cjs',
    },
    './feature': './dist/feature.js',
    './package.json': './package.json',
  },
  imports: {
    '#internal': './src/internal.js',
  },
});

// Legacy single-string exports form (no subpaths at all).
export const SIMPLE_EXPORTS_MANIFEST_JSON = JSON.stringify({
  name: 'simple-exports-pkg',
  version: '1.0.0',
  exports: './index.js',
});

export const NOT_JSON = '{ this is not json ';
export const JSON_ARRAY = '[1, 2, 3]';
export const JSON_STRING = '"just a string"';
