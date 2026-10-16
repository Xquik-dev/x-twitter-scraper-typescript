// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { leftoverStep, runUntilStarted, waitingStep } from './signal-run';

const script = resolve(__dirname, '..', 'bin', 'release-local');

const release = (variables: Record<string, string>) => {
  const env = { ...process.env, ...variables };
  for (const name of ['NPM_KEYCHAIN_SERVICE', 'NPM_KEYCHAIN_ACCOUNT']) {
    if (!(name in variables)) delete env[name];
  }
  const result = spawnSync(script, [], { encoding: 'utf8', env });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
};

describe('bin/release-local', () => {
  it.each([
    [
      'NPM_KEYCHAIN_SERVICE',
      {},
      'NPM_KEYCHAIN_SERVICE is unset. Set it to the Keychain service that holds the npm token, then run bin/release-local again.\n',
    ],
    [
      'NPM_KEYCHAIN_SERVICE',
      { NPM_KEYCHAIN_SERVICE: '', NPM_KEYCHAIN_ACCOUNT: 'example-account' },
      'NPM_KEYCHAIN_SERVICE is unset. Set it to the Keychain service that holds the npm token, then run bin/release-local again.\n',
    ],
    [
      'NPM_KEYCHAIN_ACCOUNT',
      { NPM_KEYCHAIN_SERVICE: 'example-service' },
      'NPM_KEYCHAIN_ACCOUNT is unset. Set it to the Keychain account that holds the npm token, then run bin/release-local again.\n',
    ],
  ])('stops with 1 line that names %s when it is unset', (_name, variables, message) => {
    expect(release(variables)).toEqual({ status: 1, stdout: '', stderr: message });
  });

  describe('in a copy with fake tools', () => {
    const setUp = (gh: string) => {
      const root = mkdtempSync(join(tmpdir(), 'release-local-'));
      mkdirSync(join(root, 'project', 'bin'), { recursive: true });
      mkdirSync(join(root, 'tools'));
      mkdirSync(join(root, 'tmp'));
      copyFileSync(script, join(root, 'project', 'bin', 'release-local'));
      for (const [tool, content] of [
        ['gh', gh],
        ['npm', '#!/bin/sh\n'],
        ['pnpm', '#!/bin/sh\n'],
        ['security', '#!/bin/sh\n'],
      ] as const) {
        writeFileSync(join(root, 'tools', tool), content);
        chmodSync(join(root, 'tools', tool), 0o755);
      }
      return {
        root,
        temp: join(root, 'tmp'),
        command: join(root, 'project', 'bin', 'release-local'),
        env: {
          ...process.env,
          PATH: `${join(root, 'tools')}${delimiter}${process.env['PATH'] ?? ''}`,
          NPM_KEYCHAIN_SERVICE: 'example-service',
          NPM_KEYCHAIN_ACCOUNT: 'example-account',
          TMPDIR: join(root, 'tmp'),
        },
      };
    };

    it('removes its temp directory and what its steps left in TMPDIR when a step fails', () => {
      const { root, temp, command, env } = setUp(`${leftoverStep}exit 1\n`);
      try {
        const result = spawnSync(command, [], { encoding: 'utf8', env });

        expect(result.stderr).toBe(
          'gh is signed out. Run gh auth login, then run bin/release-local again.\n',
        );
        expect(result.status).toBe(1);
        expect(readdirSync(temp)).toEqual([]);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });

    it.each([
      ['SIGTERM', 143],
      ['SIGINT', 130],
      ['SIGHUP', 129],
    ] as const)('removes its temp directory when %s stops it mid-run', async (signal, code) => {
      const { root, temp, command, env } = setUp(waitingStep);
      try {
        const result = await runUntilStarted(command, [], { env, root, signal });

        expect(result.code).toBe(code);
        expect(readdirSync(temp)).toEqual([]);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });
  });
});
