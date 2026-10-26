// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type Compiler = { readonly name: string; readonly bin: string };
type Mode = {
  readonly name: string;
  readonly type: string;
  readonly module: string;
  readonly moduleResolution: string;
};
type Compiled = { readonly status: number | null; readonly output: string };

const repository = path.resolve(import.meta.dirname, '..', '..');
const packageDirectory = path.resolve(process.argv[2] ?? path.join(repository, 'dist'));

const compilers: readonly Compiler[] = [
  { name: 'tsc', bin: path.join(repository, 'node_modules', '@typescript', 'native', 'bin', 'tsc') },
  { name: 'tsc6', bin: path.join(repository, 'node_modules', 'typescript', 'bin', 'tsc6') },
];

const modes: readonly Mode[] = [
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

const sentenceList = (names: readonly string[]) =>
  names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : (names[0] ?? '');

const writeProject = (project: string, mode: Mode) => {
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

const running = new Set<ChildProcess>();

const compile = (compiler: Compiler, project: string, workspace: string) =>
  new Promise<Compiled>((resolve, reject) => {
    const child = spawn(process.execPath, [compiler.bin, '--project', project, '--pretty', 'false'], {
      env: { ...process.env, TMPDIR: workspace },
    });
    running.add(child);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk: unknown) => (stdout += String(chunk)));
    child.stderr.on('data', (chunk: unknown) => (stderr += String(chunk)));
    child.on('error', reject);
    child.on('close', (status) => {
      running.delete(child);
      resolve({ status, output: `${stdout}${stderr}`.trimEnd() });
    });
  });

const main = async () => {
  if (!fs.existsSync(path.join(packageDirectory, 'package.json'))) {
    console.error(`${packageDirectory} has no package.json. Run pnpm build first.`);
    process.exit(1);
  }
  let workspace: string | undefined;
  const removeWorkspace = () => {
    if (workspace) fs.rmSync(workspace, { recursive: true, force: true });
  };
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) {
    process.on(signal, () => {
      for (const child of running) child.kill(signal);
      removeWorkspace();
      process.removeAllListeners(signal);
      process.kill(process.pid, signal);
    });
  }
  workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'xquik-typescript-consumer-types-'));
  const failures: string[] = [];
  try {
    for (const mode of modes) {
      const project = path.join(workspace, mode.name.replace(/\W+/g, '-'));
      writeProject(project, mode);
      for (const compiler of compilers) {
        const { status, output } = await compile(compiler, project, workspace);
        if (status !== 0) {
          failures.push(
            `${output}\nConsumer types failed for ${mode.name} under ${compiler.name}.`.trimStart(),
          );
        }
      }
    }
  } finally {
    removeWorkspace();
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

await main();
