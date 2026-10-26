// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import { field, isObject, parseJson } from './json.ts';

const ignored = (problem: unknown) => {
  const kind = field(problem, 'kind');
  const text = (key: string) => String(field(problem, key));
  return (
    (kind === 'CJSResolvesToESM' && text('entrypoint').endsWith('.mjs')) ||
    (kind === 'MissingExportEquals' && text('implementationFileName').endsWith('/index.js')) ||
    (kind === 'InternalResolutionError' && text('moduleSpecifier').includes('node_modules'))
  );
};

const report = parseJson(fs.readFileSync('.attw.json', 'utf-8'));
fs.unlinkSync('.attw.json');
const found = field(report, 'problems');
if (!isObject(found)) {
  process.stdout.write(
    'The attw report has no problems list, so attw checked no types.\n' + JSON.stringify(report) + '\n',
  );
  process.exit(1);
}
const problems = Object.values(found)
  .flat()
  .filter((problem) => !ignored(problem));
if (problems.length) {
  process.stdout.write('The types are wrong!\n' + JSON.stringify(problems, null, 2) + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Types ok!\n');
}
