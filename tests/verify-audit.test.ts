// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import fc from 'fast-check';

type Finding = { fixed: boolean; id: string; name: string; severity: string; version: string };
type Exception = {
  added: string;
  expires: string;
  exposure: string;
  fix: string;
  id: string;
  package: string;
  patch: string;
  version: string;
};
type Verified = { failures: number; lines: string[] };
type Policy = {
  DAY_MS: number;
  MAX_EXCEPTION_DAYS: number;
  exceptionFor: (finding: Finding, exceptions: Exception[], now: number) => Exception | undefined;
  verify: (report: unknown, exceptions: Exception[], now: number) => Verified;
};

const root = resolve(__dirname, '..');
const policy: Policy = createRequire(__filename)('../scripts/utils/verify-audit.cjs');
const { exceptions }: { exceptions: Exception[] } = JSON.parse(
  readFileSync(resolve(root, 'audit-exceptions.json'), 'utf8'),
);
const ROUND = Date.parse('2026-11-17T21:00:00Z');
const EXPIRY = Date.parse('2026-12-01T20:00:00Z');

const report = (id: string, name: string, version: string, patched: string | null): unknown => ({
  advisories: {
    '1': {
      findings: [{ paths: ['.>vitest>vite>picomatch'], version }],
      github_advisory_id: id,
      module_name: name,
      patched_versions: patched,
      severity: 'high',
    },
  },
});

const PICOMATCH = report('GHSA-fc5q-39xc-vjpf', 'picomatch', '4.0.7', null);

describe('verify-audit', () => {
  test('passes GHSA-fc5q-39xc-vjpf on picomatch 4.0.7 while its patch holds & no fixed release exists', () => {
    expect(policy.verify(PICOMATCH, exceptions, ROUND)).toEqual({
      failures: 0,
      lines: [
        'GHSA-fc5q-39xc-vjpf (high) on picomatch 4.0.7 passes until 2026-12-01T20:00:00Z or its first fixed release, since patches/picomatch@4.0.7.patch applies micromatch/picomatch#237.',
      ],
    });
  });

  test.each([
    ['once its exception expires', PICOMATCH, EXPIRY],
    ['once a fixed release exists', report('GHSA-fc5q-39xc-vjpf', 'picomatch', '4.0.7', '>=4.0.8'), ROUND],
    ['on another picomatch version', report('GHSA-fc5q-39xc-vjpf', 'picomatch', '4.0.6', null), ROUND],
    ['for another advisory on picomatch 4.0.7', report('GHSA-other', 'picomatch', '4.0.7', null), ROUND],
    ['for another package', report('GHSA-fc5q-39xc-vjpf', 'vite', '4.0.7', null), ROUND],
  ])('fails %s', (_name, audited, now) => {
    expect(policy.verify(audited, exceptions, now).failures).toBe(1);
  });

  test('keeps each exception to 14 days, on the version the lockfile installs, with its patch registered', () => {
    const workspace = readFileSync(resolve(root, 'pnpm-workspace.yaml'), 'utf8');
    const lock = readFileSync(resolve(root, 'pnpm-lock.yaml'), 'utf8');
    expect(
      exceptions.map((exception) => [
        Date.parse(exception.expires) - Date.parse(exception.added) <= policy.MAX_EXCEPTION_DAYS * policy.DAY_MS,
        workspace.includes(`${exception.package}@${exception.version}: ${exception.patch}`),
        lock.includes(`  ${exception.package}@${exception.version}(patch_hash=`),
      ]),
    ).toEqual(exceptions.map(() => [true, true, true]));
  });

  test('excuses only the exact advisory, package & version, before expiry & any fixed release', () => {
    const exception: Exception = {
      added: '1970-01-01T00:00:00Z',
      expires: '1970-01-15T00:00:00Z',
      exposure: 'none',
      fix: 'fix',
      id: 'GHSA-a',
      package: 'left',
      patch: 'patches/left@1.0.0.patch',
      version: '1.0.0',
    };
    const finding = fc.record({
      fixed: fc.boolean(),
      id: fc.constantFrom('GHSA-a', 'GHSA-b'),
      name: fc.constantFrom('left', 'right'),
      severity: fc.constant('high'),
      version: fc.constantFrom('1.0.0', '2.0.0'),
    });
    fc.assert(
      fc.property(finding, fc.integer({ max: 28 * policy.DAY_MS, min: 0 }), (drawn, now) => {
        const exact =
          drawn.id === 'GHSA-a' &&
          drawn.name === 'left' &&
          drawn.version === '1.0.0' &&
          !drawn.fixed &&
          now < 14 * policy.DAY_MS;
        return (policy.exceptionFor(drawn, [exception], now) !== undefined) === exact;
      }),
      { seed: 20_261_117 },
    );
  });
});

const PROBE = `
const { createRequire } = require('node:module');
const picomatch = createRequire(require.resolve('vitest/package.json'))('picomatch');
const patterns = JSON.parse(process.env.PICOMATCH_PATTERNS);
const input = process.env.PICOMATCH_INPUT;
process.stdout.write(JSON.stringify(patterns.map((pattern) => {
  const startedAt = performance.now();
  const matched = picomatch.isMatch(input, pattern);
  return { matched, ms: performance.now() - startedAt, source: picomatch.makeRe(pattern).source };
})));
`;

const probe = (patterns: string[], input: string): Array<{ matched: boolean; ms: number; source: string }> => {
  const child = spawnSync(process.execPath, ['-e', PROBE], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PICOMATCH_INPUT: input, PICOMATCH_PATTERNS: JSON.stringify(patterns) },
    timeout: 20_000,
  });
  if (child.status !== 0) throw new Error(`The picomatch probe exited ${child.status}: ${child.stderr}`);
  return JSON.parse(child.stdout);
};

describe('the installed picomatch', () => {
  test('answers the GHSA-fc5q-39xc-vjpf globs at once, with no repeat nested around a star', () => {
    const patterns = ['+(*a)', '*(*a)', '+(*)c', 'x+(*a)', '+(?*a)'];
    expect(
      probe(patterns, `${'a'.repeat(40)}b`).map((answer) => [
        answer.matched,
        answer.ms < 100,
        /\)[*+]/u.test(answer.source),
      ]),
    ).toEqual(patterns.map(() => [false, true, false]));
  });

  test.each([
    ['+(*a)', 'aaa', true],
    ['+(*a)', 'ab', false],
    ['+(a*b)', 'axbayb', true],
    ['+(a*b)', 'axbay', false],
    ['*(*.js)', 'foo.js', true],
    ['*(*.js)', 'foo.ts', false],
  ])('still matches %s against %s as the glob means', (pattern, input, matched) => {
    expect(probe([pattern], input).map((answer) => answer.matched)).toEqual([matched]);
  });
});
