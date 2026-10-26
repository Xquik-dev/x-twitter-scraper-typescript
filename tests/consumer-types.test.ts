// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repository = resolve(__dirname, '..');
const script = join(repository, 'scripts', 'utils', 'check-consumer-types.ts');
const dist = join(repository, 'dist');

type PackageJson = { exports: { '.': { types: string; require: { types: string } } } };

const checkCopy = (change: (directory: string) => void) => {
  const directory = mkdtempSync(join(tmpdir(), 'consumer-types-'));
  try {
    cpSync(dist, join(directory, 'package'), { recursive: true });
    mkdirSync(join(directory, 'tmp'));
    change(join(directory, 'package'));
    const result = spawnSync(process.execPath, [script, join(directory, 'package')], {
      encoding: 'utf8',
      env: { ...process.env, TMPDIR: join(directory, 'tmp') },
    });
    return {
      status: result.status,
      output: result.stdout + result.stderr,
      failures: (result.stdout + result.stderr)
        .split('\n')
        .filter((line) => line.startsWith('Consumer types failed')),
      leftovers: readdirSync(join(directory, 'tmp')),
    };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
};

const editPackageJson = (directory: string, edit: (packageJson: PackageJson) => void) => {
  const file = join(directory, 'package.json');
  const packageJson = JSON.parse(readFileSync(file, 'utf8')) as PackageJson;
  edit(packageJson);
  writeFileSync(file, JSON.stringify(packageJson, null, 2));
};

const failed = (mode: string) => [
  `Consumer types failed for ${mode} under tsc.`,
  `Consumer types failed for ${mode} under tsc6.`,
];

describe('scripts/utils/check-consumer-types.ts', () => {
  beforeAll(() => {
    if (!existsSync(join(dist, 'package.json'))) {
      throw new Error('dist is missing. Run pnpm build, then run the tests again.');
    }
  });

  it('passes for the built package under every resolution mode and both compilers', () => {
    const result = checkCopy(() => undefined);

    expect(result.failures).toEqual([]);
    expect(result.status).toBe(0);
    expect(result.output).toContain(
      'Consumer types passed for CommonJS with node16, ES modules with nodenext and bundler under tsc and tsc6.',
    );
  }, 60_000);

  it.each([
    [
      'the import types condition names the CommonJS declarations',
      (directory: string) =>
        editPackageJson(directory, (packageJson) => {
          packageJson.exports['.'].types = './index.d.ts';
        }),
      failed('ES modules with nodenext'),
    ],
    [
      'the require types condition names the ES module declarations',
      (directory: string) =>
        editPackageJson(directory, (packageJson) => {
          packageJson.exports['.'].require.types = './index.d.mts';
        }),
      failed('CommonJS with node16'),
    ],
    [
      'client.d.mts is missing',
      (directory: string) => rmSync(join(directory, 'client.d.mts')),
      [...failed('ES modules with nodenext'), ...failed('bundler')],
    ],
    [
      'client.d.mts is empty',
      (directory: string) => writeFileSync(join(directory, 'client.d.mts'), ''),
      [...failed('ES modules with nodenext'), ...failed('bundler')],
    ],
    [
      'client.d.ts is missing',
      (directory: string) => rmSync(join(directory, 'client.d.ts')),
      failed('CommonJS with node16'),
    ],
  ])(
    'fails when %s',
    (_name, change, expected) => {
      const result = checkCopy(change);

      expect(result.failures).toEqual(expected);
      expect(result.status).toBe(1);
      expect(result.leftovers).toEqual([]);
    },
    60_000,
  );

  it.each(['SIGTERM', 'SIGINT', 'SIGHUP'] as const)(
    'handles %s before allocating its workspace',
    (signal) => {
      const directory = mkdtempSync(join(tmpdir(), 'consumer-types-'));
      const temp = join(directory, 'tmp');
      const preload = join(directory, 'interrupt.cjs');
      mkdirSync(temp);
      try {
        writeFileSync(
          preload,
          `const fs = require('node:fs');
const mkdtempSync = fs.mkdtempSync;
fs.mkdtempSync = (...args) => {
  process.emit('${signal}');
  return mkdtempSync(...args);
};
`,
        );
        const result = spawnSync(process.execPath, ['--require', preload, script, dist], {
          encoding: 'utf8',
          env: { ...process.env, TMPDIR: temp },
          timeout: 30_000,
        });

        expect(result.stderr).toBe('');
        expect(result.status).toBeNull();
        expect(result.signal).toBe(signal);
        expect(readdirSync(temp)).toEqual([]);
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    },
    60_000,
  );

  it.each(['SIGTERM', 'SIGINT', 'SIGHUP'] as const)(
    'removes its workspace when %s stops it mid-run',
    async (signal) => {
      const directory = mkdtempSync(join(tmpdir(), 'consumer-types-'));
      const temp = join(directory, 'tmp');
      mkdirSync(temp);
      try {
        const child = spawn(process.execPath, [script, dist], {
          env: { ...process.env, TMPDIR: temp },
          stdio: 'ignore',
        });
        const exited = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve) =>
          child.on('exit', (code, stopSignal) => resolve({ code, signal: stopSignal })),
        );
        const deadline = Date.now() + 30_000;
        while (readdirSync(temp).length === 0 && Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
        child.kill(signal);

        expect(await exited).toEqual({ code: null, signal });
        expect(readdirSync(temp)).toEqual([]);
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    },
    60_000,
  );
});
