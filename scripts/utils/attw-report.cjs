// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const problems = Object.values(JSON.parse(fs.readFileSync('.attw.json', 'utf-8')).problems)
  .flat()
  .filter(
    (problem) =>
      !(
        (problem.kind === 'CJSResolvesToESM' && problem.entrypoint.endsWith('.mjs')) ||
        (problem.kind === 'MissingExportEquals' && problem.implementationFileName.endsWith('/index.js')) ||
        (problem.kind === 'InternalResolutionError' && problem.moduleSpecifier.includes('node_modules'))
      ),
  );
fs.unlinkSync('.attw.json');
if (problems.length) {
  process.stdout.write('The types are wrong!\n' + JSON.stringify(problems, null, 2) + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Types ok!\n');
}
