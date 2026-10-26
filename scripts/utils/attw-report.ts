// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import { field, parseJson, record } from './json.ts';

const ignored = (problem: unknown) => {
  const kind = field(problem, 'kind');
  const text = (key: string) => String(field(problem, key));
  return (
    (kind === 'CJSResolvesToESM' && text('entrypoint').endsWith('.mjs')) ||
    (kind === 'MissingExportEquals' && text('implementationFileName').endsWith('/index.js')) ||
    (kind === 'InternalResolutionError' && text('moduleSpecifier').includes('node_modules'))
  );
};

const problems = Object.values(record(field(parseJson(fs.readFileSync('.attw.json', 'utf-8')), 'problems')))
  .flat()
  .filter((problem) => !ignored(problem));
fs.unlinkSync('.attw.json');
if (problems.length) {
  process.stdout.write('The types are wrong!\n' + JSON.stringify(problems, null, 2) + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Types ok!\n');
}
