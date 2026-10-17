// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { leftoverStep, runUntilStarted, waitingStep } from './signal-run';

const script = resolve(__dirname, '..', 'scripts', 'check-reproducible');

const setUp = (pnpm: string) => {
  const root = mkdtempSync(join(tmpdir(), 'check-reproducible-'));
  mkdirSync(join(root, 'project', 'scripts'), { recursive: true });
  mkdirSync(join(root, 'tools'));
  mkdirSync(join(root, 'tmp'));
  copyFileSync(script, join(root, 'project', 'scripts', 'check-reproducible'));
  copyFileSync(
    resolve(__dirname, '..', 'scripts', 'temp-directory.sh'),
    join(root, 'project', 'scripts', 'temp-directory.sh'),
  );
  writeFileSync(join(root, 'tools', 'pnpm'), pnpm);
  chmodSync(join(root, 'tools', 'pnpm'), 0o755);
  return {
    root,
    temp: join(root, 'tmp'),
    command: join(root, 'project', 'scripts', 'check-reproducible'),
    env: {
      ...process.env,
      PATH: `${join(root, 'tools')}${delimiter}${process.env['PATH'] ?? ''}`,
      TMPDIR: join(root, 'tmp'),
    },
  };
};

describe('scripts/check-reproducible', () => {
  it('removes its temp directory and what the build left in TMPDIR when the build fails', () => {
    const { root, temp, command, env } = setUp(`${leftoverStep}exit 1\n`);
    try {
      const result = spawnSync(command, [], { encoding: 'utf8', env });

      expect(result.status).toBe(1);
      expect(readdirSync(temp)).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each([
    ['SIGTERM', 143],
    ['SIGINT', null],
    ['SIGHUP', 129],
  ] as const)('removes its temp directory when %s stops it mid-run', async (signal, code) => {
    const { root, temp, command, env } = setUp(waitingStep);
    try {
      const result = await runUntilStarted(command, [], { env, root, signal });

      expect(result).toEqual({ code, signal: signal === 'SIGINT' ? signal : null });
      expect(readdirSync(temp)).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('stops its bash parent before the next command when SIGINT reaches the process group', async () => {
    const { root, temp, command, env } = setUp(waitingStep);
    const continued = join(root, 'parent-continued');
    try {
      const result = await runUntilStarted('bash', ['-c', '"$1"\ntouch "$2"\n', 'bash', command, continued], {
        env,
        root,
        signal: 'SIGINT',
        processGroup: true,
      });

      expect(result).toEqual({ code: null, signal: 'SIGINT' });
      expect(existsSync(continued)).toBe(false);
      expect(readdirSync(temp)).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
