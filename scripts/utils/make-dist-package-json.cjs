// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const { asObject, parseJson } = require('./json.cjs');

const pkgFile = parseJson(fs.readFileSync(require.resolve('../../package.json'), 'utf8'));
const pkgJson = asObject(pkgFile);
if (pkgJson === undefined) throw new Error('package.json does not hold an object');

/** @type {(value: string) => string} */
const withoutDist = (value) => value.replace(/^\.\/dist\//, './');

/** @type {(m: import('./types').JsonValue | undefined) => import('./types').JsonValue | undefined} */
function withoutDistExports(m) {
  if (typeof m !== 'object' || m === null) return m;
  /** @type {(value: import('./types').JsonValue | undefined) => import('./types').JsonValue | undefined} */
  const rewrite = (value) => (typeof value === 'string' ? withoutDist(value) : withoutDistExports(value));
  if (Array.isArray(m)) return m.map((value) => rewrite(value) ?? null);
  return Object.fromEntries(Object.entries(m).map(([key, value]) => [key, rewrite(value)]));
}
pkgJson['exports'] = withoutDistExports(pkgJson['exports']);

for (const key of ['types', 'main', 'module']) {
  const value = pkgJson[key];
  if (typeof value === 'string') pkgJson[key] = value.replace(/^(\.\/)?dist\//, './');
}

const scripts = asObject(pkgJson['scripts']);
delete pkgJson['devDependencies'];
delete pkgJson['typesVersions'];
delete scripts?.['prepack'];
delete scripts?.['prepublishOnly'];
delete scripts?.['prepare'];

console.log(JSON.stringify(pkgJson, null, 2));
