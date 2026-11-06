// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const asObject = require('./json.cjs').asObject;

/** @type {import('./types').JsonValue} */
const pkgFile = require(process.env['PKG_JSON_PATH'] || '../../package.json');
const pkgJson = asObject(pkgFile);
if (!pkgJson) throw new Error('package.json does not hold an object');

/** @type {(value: string) => string} */
const withoutDist = (value) => value.replace(/^\.\/dist\//, './');

/** @type {(m: import('./types').JsonValue | undefined) => void} */
function processExportMap(m) {
  if (typeof m !== 'object' || m === null) return;
  for (const [key, value] of Object.entries(m)) {
    if (typeof value !== 'string') processExportMap(value);
    else if (Array.isArray(m)) m[Number(key)] = withoutDist(value);
    else m[key] = withoutDist(value);
  }
}
processExportMap(pkgJson['exports']);

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
