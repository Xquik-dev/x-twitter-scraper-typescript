// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const { asObject, parseJson } = require('./json.cjs');

const report = parseJson(fs.readFileSync('.attw.json', 'utf-8'));
fs.unlinkSync('.attw.json');
const found = asObject(asObject(report)?.['problems']);
if (found === undefined) {
  process.stdout.write(
    'The attw report has no problems list, so attw checked no types.\n' + JSON.stringify(report) + '\n',
  );
  process.exitCode = 1;
} else {
  const problems = Object.values(found).flatMap((list) =>
    Array.isArray(list) ? list
    : list === undefined ? []
    : [list],
  );
  if (problems.length > 0) {
    process.stdout.write('The types are wrong!\n' + JSON.stringify(problems, null, 2) + '\n');
    process.exitCode = 1;
  } else {
    process.stdout.write('Types ok!\n');
  }
}
