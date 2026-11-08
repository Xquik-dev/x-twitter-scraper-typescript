// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const { asObject, parseJson } = require('./json.cjs');

const report = asObject(parseJson(fs.readFileSync('.attw.json', 'utf-8')));
const problems = Object.values(asObject(report?.['problems']) ?? {}).flatMap((list) =>
  Array.isArray(list) ? list
  : list === undefined ? []
  : [list],
);
fs.unlinkSync('.attw.json');
if (problems.length > 0) {
  process.stdout.write('The types are wrong!\n' + JSON.stringify(problems, null, 2) + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Types ok!\n');
}
