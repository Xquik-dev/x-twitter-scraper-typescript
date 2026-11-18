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

const SEVERITIES = ['info', 'low', 'moderate', 'high', 'critical'] as const;
type Advisory = {
  findings: unknown[];
  github_advisory_id?: string;
  module_name: string;
  patched_versions?: string | null;
  severity: string;
};
type Report = { advisories: Record<string, Advisory>; metadata: { vulnerabilities: Record<string, number> } };

const advisory = (
  id: string,
  name: string,
  versions: string[],
  patched: string | null,
  severity = 'high',
): Advisory => ({
  findings: versions.map((version) => ({ paths: [`.>vitest>vite>${name}`], version })),
  github_advisory_id: id,
  module_name: name,
  patched_versions: patched,
  severity,
});

const audited = (advisories: Advisory[]): Report => ({
  advisories: Object.fromEntries(advisories.map((entry, index) => [String(index + 1), entry])),
  metadata: {
    vulnerabilities: Object.fromEntries(
      SEVERITIES.map((severity) => [
        severity,
        advisories.filter((entry) => entry.severity === severity).length,
      ]),
    ),
  },
});

const report = (id: string, name: string, version: string, patched: string | null): Report =>
  audited([advisory(id, name, [version], patched)]);

const PICOMATCH_ADVISORY = advisory('GHSA-fc5q-39xc-vjpf', 'picomatch', ['4.0.7'], null);
const PICOMATCH = audited([PICOMATCH_ADVISORY]);
const NO_COUNTS = { critical: 0, high: 0, info: 0, low: 0, moderate: 0 };
const UNREAD = 'The audit report fails, since';

describe('verify-audit', () => {
  test('fails GHSA-fc5q-39xc-vjpf on picomatch 4.0.7, since no exception lists it', () => {
    expect(policy.verify(PICOMATCH, exceptions, ROUND).failures).toBe(1);
  });

  test('passes a report with no advisories', () => {
    expect(
      policy.verify({ advisories: {}, metadata: { vulnerabilities: NO_COUNTS } }, exceptions, ROUND),
    ).toEqual({ failures: 0, lines: [] });
  });

  test('reads an advisory pnpm counts once across every version it finds', () => {
    const minimist = audited([
      advisory('GHSA-vh95-rmgr-6w4m', 'minimist', ['1.2.0', '1.2.2'], '>=1.2.3', 'moderate'),
      advisory('GHSA-xvch-5gv4-984h', 'minimist', ['1.2.0', '1.2.2', '1.2.5'], '>=1.2.6', 'critical'),
    ]);
    expect(policy.verify(minimist, exceptions, ROUND)).toEqual({
      failures: 5,
      lines: [
        'GHSA-vh95-rmgr-6w4m (moderate) on minimist 1.2.0 fails. Upgrade, override or replace that package.',
        'GHSA-vh95-rmgr-6w4m (moderate) on minimist 1.2.2 fails. Upgrade, override or replace that package.',
        'GHSA-xvch-5gv4-984h (critical) on minimist 1.2.0 fails. Upgrade, override or replace that package.',
        'GHSA-xvch-5gv4-984h (critical) on minimist 1.2.2 fails. Upgrade, override or replace that package.',
        'GHSA-xvch-5gv4-984h (critical) on minimist 1.2.5 fails. Upgrade, override or replace that package.',
      ],
    });
  });

  const unnamed: Advisory = { ...PICOMATCH_ADVISORY };
  delete unnamed.github_advisory_id;
  const unpatched: Advisory = { ...PICOMATCH_ADVISORY };
  delete unpatched.patched_versions;
  test.each([
    ['that is no object', null, "it isn't an object with advisories & metadata.vulnerabilities"],
    [
      'that is an error',
      { error: { code: 'ERR_PNPM_AUDIT_BAD_RESPONSE' } },
      "it isn't an object with advisories & metadata.vulnerabilities",
    ],
    [
      'with no advisories',
      { metadata: { vulnerabilities: { ...NO_COUNTS, high: 1 } } },
      "it isn't an object with advisories & metadata.vulnerabilities",
    ],
    [
      'with no severity counts',
      { advisories: { '1': PICOMATCH_ADVISORY } },
      "it isn't an object with advisories & metadata.vulnerabilities",
    ],
    [
      'whose advisory lists no finding',
      audited([{ ...PICOMATCH_ADVISORY, findings: [] }]),
      'advisory 1 lists no finding with a version',
    ],
    [
      'whose finding has no version',
      audited([{ ...PICOMATCH_ADVISORY, findings: [{ paths: ['.>vitest>picomatch'] }] }]),
      'advisory 1 lists no finding with a version',
    ],
    [
      'whose advisory has no GHSA ID',
      audited([unnamed]),
      'advisory 1 lacks its GHSA ID, package, severity or patched versions',
    ],
    [
      'whose advisory has no patched versions',
      audited([unpatched]),
      'advisory 1 lacks its GHSA ID, package, severity or patched versions',
    ],
    [
      'that counts more advisories than it holds',
      { advisories: { '1': PICOMATCH_ADVISORY }, metadata: { vulnerabilities: { ...NO_COUNTS, high: 2 } } },
      'metadata.vulnerabilities.high counts 2 advisories & the report holds 1',
    ],
    [
      'that holds an advisory its counts leave out',
      { advisories: { '1': PICOMATCH_ADVISORY }, metadata: { vulnerabilities: NO_COUNTS } },
      'metadata.vulnerabilities.high counts 0 advisories & the report holds 1',
    ],
    [
      'with a severity it has no count for',
      audited([{ ...PICOMATCH_ADVISORY, severity: 'severe' }]),
      'metadata.vulnerabilities.severe counts undefined advisories & the report holds 1',
    ],
  ])('fails a report %s, naming why', (_name, unread, problem) => {
    const verified = policy.verify(unread, exceptions, ROUND);
    expect(verified.failures).toBeGreaterThan(0);
    expect(verified.lines).toContain(`${UNREAD} ${problem}.`);
  });

  test('fails a report whenever its severity counts miss what it holds', () => {
    const drawn = fc.record({
      severity: fc.constantFrom(...SEVERITIES),
      versions: fc.uniqueArray(fc.constantFrom('1.0.0', '1.0.1', '2.0.0'), { minLength: 1 }),
    });
    fc.assert(
      fc.property(
        fc.array(drawn, { maxLength: 6 }),
        fc.constantFrom(...SEVERITIES),
        fc.integer({ max: 3, min: 1 }),
        (entries, off, by) => {
          const advisories = entries.map(({ severity, versions }, index) =>
            advisory(`GHSA-${index}`, 'left', versions, null, severity),
          );
          const exact = audited(advisories);
          const counts = exact.metadata.vulnerabilities;
          const counted = policy.verify(exact, [], ROUND);
          const miscounted = policy.verify(
            { ...exact, metadata: { vulnerabilities: { ...counts, [off]: (counts[off] ?? 0) + by } } },
            [],
            ROUND,
          );
          const versions = entries.reduce((total, entry) => total + entry.versions.length, 0);
          return (
            counted.failures === versions &&
            !counted.lines.some((line) => line.startsWith(UNREAD)) &&
            miscounted.lines.some((line) => line.startsWith(UNREAD))
          );
        },
      ),
      { seed: 20_261_118 },
    );
  });

  test('keeps each exception to 14 days, on the version the lockfile installs, with its patch registered', () => {
    const workspace = readFileSync(resolve(root, 'pnpm-workspace.yaml'), 'utf8');
    const lock = readFileSync(resolve(root, 'pnpm-lock.yaml'), 'utf8');
    expect(
      exceptions.map((exception) => [
        Date.parse(exception.expires) - Date.parse(exception.added) <=
          policy.MAX_EXCEPTION_DAYS * policy.DAY_MS,
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

const probe = (
  patterns: string[],
  input: string,
): Array<{ matched: boolean; ms: number; source: string }> => {
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
