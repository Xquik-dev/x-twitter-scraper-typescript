// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import path from 'node:path';
import { field, parseJson } from './json.ts';

const repository = path.resolve(import.meta.dirname, '..', '..');

const main = () => {
  const pkg = parseJson(fs.readFileSync(path.join(repository, 'package.json'), 'utf8'));
  const version = field(pkg, 'version');
  if (!version) throw 'The version property is not set in the package.json file';
  if (typeof version !== 'string') {
    throw `Unexpected type for the package.json version field; got ${typeof version}, expected string`;
  }

  const versionFile = path.join(repository, 'src', 'version.ts');
  const contents = fs.readFileSync(versionFile, 'utf8');
  const output = contents.replace(/(export const VERSION = ')(.*)(')/g, `$1${version}$3`);
  fs.writeFileSync(versionFile, output);
};

main();
