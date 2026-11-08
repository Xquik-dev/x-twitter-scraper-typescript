// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve(__dirname, '..', 'scripts', 'utils', 'attw-report.cjs');

const report = (attw: unknown) => {
  const root = mkdtempSync(join(tmpdir(), 'attw-report-'));
  try {
    writeFileSync(join(root, '.attw.json'), JSON.stringify(attw));
    const result = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
    return { status: result.status, stdout: result.stdout, left: existsSync(join(root, '.attw.json')) };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

describe('scripts/utils/attw-report.cjs', () => {
  test('passes when attw found no problem', () => {
    expect(report({ problems: {} })).toEqual({ status: 0, stdout: 'Types ok!\n', left: false });
  });

  test('fails on each problem attw found', () => {
    const problem = { kind: 'FalseCJS', entrypoint: '.' };
    expect(report({ problems: { FalseCJS: [problem] } })).toEqual({
      status: 1,
      stdout: 'The types are wrong!\n' + JSON.stringify([problem], null, 2) + '\n',
      left: false,
    });
  });

  test('fails when attw found no types to check', () => {
    expect(report({ analysis: { types: false } })).toEqual({
      status: 1,
      stdout:
        'The attw report has no problems list, so attw checked no types.\n{"analysis":{"types":false}}\n',
      left: false,
    });
  });
});
