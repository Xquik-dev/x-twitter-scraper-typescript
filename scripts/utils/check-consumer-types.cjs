// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// @ts-check

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const repository = path.resolve(__dirname, '..', '..');
const packageDirectory = path.resolve(process.argv[2] ?? path.join(repository, 'dist'));

const compilers = [
  { name: 'tsc', bin: path.join(repository, 'node_modules', '@typescript', 'native', 'bin', 'tsc') },
  { name: 'tsc6', bin: path.join(repository, 'node_modules', 'typescript', 'bin', 'tsc6') },
];

const modes = [
  { name: 'CommonJS with node16', type: 'commonjs', module: 'node16', moduleResolution: 'node16' },
  { name: 'ES modules with nodenext', type: 'module', module: 'nodenext', moduleResolution: 'nodenext' },
  { name: 'bundler', type: 'module', module: 'esnext', moduleResolution: 'bundler' },
];

const program = `import XTwitterScraper, { APIError, XTwitterScraper as NamedClient } from 'x-twitter-scraper';
import type { AccountRetrieveResponse, AccountSetXUsernameParams } from 'x-twitter-scraper/resources/account';

type Assert<T extends true> = T;
type IsNotAny<T> = 0 extends 1 & T ? false : true;
type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

export type Checks = [
  Assert<IsNotAny<XTwitterScraper>>,
  Assert<IsNotAny<NamedClient>>,
  Assert<IsNotAny<typeof APIError>>,
  Assert<IsNotAny<AccountSetXUsernameParams>>,
  Assert<IsNotAny<AccountRetrieveResponse>>,
  Assert<IsEqual<Awaited<ReturnType<XTwitterScraper['account']['retrieve']>>, AccountRetrieveResponse>>,
];

export const params: AccountSetXUsernameParams = { username: 'xquik' };
export const client = new XTwitterScraper({ apiKey: 'key' });
`;

const sentenceList = (names) =>
  names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : (names[0] ?? '');

const writeProject = (project, mode) => {
  fs.mkdirSync(path.join(project, 'node_modules', '@types'), { recursive: true });
  fs.symlinkSync(packageDirectory, path.join(project, 'node_modules', 'x-twitter-scraper'), 'junction');
  fs.symlinkSync(
    path.join(repository, 'node_modules', '@types', 'node'),
    path.join(project, 'node_modules', '@types', 'node'),
    'junction',
  );
  fs.writeFileSync(path.join(project, 'package.json'), JSON.stringify({ private: true, type: mode.type }));
  const compilerOptions = {
    module: mode.module,
    moduleResolution: mode.moduleResolution,
    target: 'es2022',
    strict: true,
    noEmit: true,
    types: ['node'],
  };
  fs.writeFileSync(
    path.join(project, 'tsconfig.json'),
    JSON.stringify({ compilerOptions, files: ['index.ts'] }),
  );
  fs.writeFileSync(path.join(project, 'index.ts'), program);
};

const main = () => {
  if (!fs.existsSync(path.join(packageDirectory, 'package.json'))) {
    console.error(`${packageDirectory} has no package.json. Run pnpm build first.`);
    process.exit(1);
  }
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'consumer-types-'));
  /** @type {string[]} */
  const failures = [];
  try {
    for (const mode of modes) {
      const project = path.join(workspace, mode.name.replace(/\W+/g, '-'));
      writeProject(project, mode);
      for (const compiler of compilers) {
        const result = spawnSync(
          process.execPath,
          [compiler.bin, '--project', project, '--pretty', 'false'],
          {
            encoding: 'utf8',
          },
        );
        if (result.error) throw result.error;
        if (result.status !== 0) {
          const output = `${result.stdout}${result.stderr}`.trimEnd();
          failures.push(
            `${output}\nConsumer types failed for ${mode.name} under ${compiler.name}.`.trimStart(),
          );
        }
      }
    }
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
  if (failures.length > 0) {
    console.error(failures.join('\n'));
    console.error("Fix the package's types or exports, then run the check again.");
    process.exit(1);
  }
  const modeNames = sentenceList(modes.map((mode) => mode.name));
  const compilerNames = sentenceList(compilers.map((compiler) => compiler.name));
  console.log(`Consumer types passed for ${modeNames} under ${compilerNames}.`);
};

main();
