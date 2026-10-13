// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repository = resolve(__dirname, '..');
const script = join(repository, 'scripts', 'utils', 'check-consumer-types.cjs');
const dist = join(repository, 'dist');

type PackageJson = { exports: { '.': { types: string; require: { types: string } } } };

// Copies the built package, applies 1 change to it, and runs the consumer type check on the copy.
const checkCopy = (change: (directory: string) => void) => {
  const directory = mkdtempSync(join(tmpdir(), 'consumer-types-'));
  try {
    cpSync(dist, join(directory, 'package'), { recursive: true });
    change(join(directory, 'package'));
    const result = spawnSync(process.execPath, [script, join(directory, 'package')], { encoding: 'utf8' });
    return {
      status: result.status,
      output: result.stdout + result.stderr,
      failures: (result.stdout + result.stderr)
        .split('\n')
        .filter((line) => line.startsWith('Consumer types failed')),
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

describe('scripts/utils/check-consumer-types.cjs', () => {
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
    },
    60_000,
  );
});
