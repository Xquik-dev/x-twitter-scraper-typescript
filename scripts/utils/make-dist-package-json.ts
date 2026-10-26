// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import path from 'node:path';
import { isList, isObject, parseJson, record } from './json.ts';

const pkgJson = record(
  parseJson(fs.readFileSync(path.resolve(import.meta.dirname, '..', '..', 'package.json'), 'utf8')),
);

const withoutDist = (value: unknown): unknown => {
  if (typeof value === 'string') return value.replace(/^\.\/dist\//, './');
  if (isList(value)) return value.map(withoutDist);
  if (!isObject(value)) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]): [string, unknown] => [key, withoutDist(item)]),
  );
};
pkgJson['exports'] = withoutDist(pkgJson['exports']);

for (const key of ['types', 'main', 'module']) {
  const value = pkgJson[key];
  if (typeof value === 'string') pkgJson[key] = value.replace(/^(\.\/)?dist\//, './');
}

const scripts = record(pkgJson['scripts']);
delete pkgJson['devDependencies'];
delete pkgJson['typesVersions'];
delete scripts['prepack'];
delete scripts['prepublishOnly'];
delete scripts['prepare'];

console.log(JSON.stringify(pkgJson, null, 2));
