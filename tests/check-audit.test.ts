// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';

const script = resolve(__dirname, '..', 'scripts', 'utils', 'check-audit.cjs');
const dayInMs = 24 * 60 * 60 * 1000;
const day = (offset: number): string => new Date(Date.now() + offset * dayInMs).toISOString().slice(0, 10);

type Advisory = {
  github_advisory_id: string;
  module_name: string;
  severity: string;
  patched_versions: string;
  findings: { paths: string[] }[];
};

type Exception = { advisory: string; path: string; reason: string; recheck: string };

type Registry = Record<string, unknown>;

type Case = {
  advisories?: Advisory[];
  exceptions?: Exception[];
  registry?: Registry;
};

const advisory = (overrides: Partial<Advisory>): Advisory => ({
  github_advisory_id: 'GHSA-aaaa-bbbb-cccc',
  module_name: 'leftpad',
  severity: 'moderate',
  patched_versions: '>=2.0.0',
  findings: [{ paths: ['.>jest>leftpad'] }],
  ...overrides,
});

const listed = (overrides: Partial<Exception> = {}): Exception => ({
  advisory: 'GHSA-aaaa-bbbb-cccc',
  path: 'jest > leftpad',
  reason: 'test-time only',
  recheck: day(10),
  ...overrides,
});

const fixPublished: Registry = {
  'leftpad@>=2.0.0 version': '2.0.0',
  'leftpad time': { '2.0.0': new Date(Date.now() - 365 * dayInMs).toISOString() },
};

const fixTooNew: Registry = {
  'leftpad@>=2.0.0 version': '2.0.0',
  'leftpad time': { '2.0.0': new Date(Date.now() - 60 * 60 * 1000).toISOString() },
};

const fakePnpm = `#!/usr/bin/env node
process.stdout.write(require('fs').readFileSync(process.env.FAKE_AUDIT_REPORT, 'utf8'));
process.exit(1);
`;

const fakeNpm = `#!/usr/bin/env node
const registry = JSON.parse(require('fs').readFileSync(process.env.FAKE_REGISTRY, 'utf8'));
const key = process.argv.slice(3, 5).join(' ');
if (key in registry) {
  process.stdout.write(JSON.stringify(registry[key]));
} else {
  process.stdout.write(JSON.stringify({ error: { code: 'E404' } }));
  process.exit(1);
}
`;

const runAudit = ({ advisories = [], exceptions, registry = {} }: Case) => {
  const root = mkdtempSync(join(tmpdir(), 'check-audit-'));
  try {
    const bin = join(root, 'bin');
    mkdirSync(bin);
    for (const [name, source] of [
      ['pnpm', fakePnpm],
      ['npm', fakeNpm],
    ] as const) {
      writeFileSync(join(bin, name), source);
      chmodSync(join(bin, name), 0o755);
    }
    writeFileSync(
      join(root, 'package.json'),
      JSON.stringify({ dependencies: { shipped: '1.0.0' }, devDependencies: { jest: '30.0.0' } }),
    );
    writeFileSync(join(root, 'pnpm-workspace.yaml'), 'minimumReleaseAge: 10080\n');
    if (exceptions) writeFileSync(join(root, 'audit-exceptions.json'), JSON.stringify({ exceptions }));
    const report = join(root, 'audit.json');
    writeFileSync(
      report,
      JSON.stringify({ advisories: Object.fromEntries(advisories.map((a, index) => [index, a])) }),
    );
    const registryFile = join(root, 'registry.json');
    writeFileSync(registryFile, JSON.stringify(registry));
    const result = spawnSync(process.execPath, [script, root], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${bin}${delimiter}${process.env['PATH'] ?? ''}`,
        FAKE_AUDIT_REPORT: report,
        FAKE_REGISTRY: registryFile,
      },
    });
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

describe('scripts/utils/check-audit.cjs', () => {
  it('passes when pnpm audit reports nothing', () => {
    expect(runAudit({})).toEqual({ status: 0, output: 'Audit passed.\n' });
  });

  it('fails on a low finding in a shipped dependency, even when it is listed', () => {
    const result = runAudit({
      advisories: [advisory({ severity: 'low', findings: [{ paths: ['.>shipped>leftpad'] }] })],
      exceptions: [listed({ path: 'shipped > leftpad' })],
    });
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'Blocked. GHSA-aaaa-bbbb-cccc leftpad (low) reaches the shipped dependency path shipped > leftpad. Upgrade it.',
    );
  });

  it.each(['low', 'moderate', 'high', 'critical'])(
    'fails on a %s development finding that has an installable fix',
    (severity) => {
      const result = runAudit({ advisories: [advisory({ severity })], registry: fixPublished });
      expect(result.status).toBe(1);
      expect(result.output).toContain(
        `Blocked. GHSA-aaaa-bbbb-cccc leftpad (${severity}) has an installable fix (>=2.0.0). Upgrade or override it.`,
      );
    },
  );

  it.each(['low', 'moderate', 'high', 'critical'])(
    'fails on an unfixable %s development finding that nobody reviewed',
    (severity) => {
      const result = runAudit({ advisories: [advisory({ severity })] });
      expect(result.status).toBe(1);
      expect(result.output).toContain(
        `Blocked. GHSA-aaaa-bbbb-cccc leftpad (${severity}) has no fix and 1 unlisted path(s), such as jest > leftpad. ` +
          'Review each one and list it in audit-exceptions.json.',
      );
    },
  );

  it('passes an unfixable development finding that is listed, and names it', () => {
    const exception = listed();
    expect(runAudit({ advisories: [advisory({})], exceptions: [exception] })).toEqual({
      status: 0,
      output:
        `Accepted the reviewed exception for GHSA-aaaa-bbbb-cccc leftpad (moderate) via jest > leftpad. ` +
        `It is test-time only. Recheck by ${exception.recheck}.\n` +
        'Audit passed with 1 reviewed exception.\n',
    });
  });

  it('treats a fix younger than the minimum release age as not installable yet', () => {
    const result = runAudit({ advisories: [advisory({})], exceptions: [listed()], registry: fixTooNew });
    expect(result.status).toBe(0);
    expect(result.output).toContain('Audit passed with 1 reviewed exception.');
  });

  it('blocks a listed finding again once its fix is installable', () => {
    const result = runAudit({ advisories: [advisory({})], exceptions: [listed()], registry: fixPublished });
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'has an installable fix (>=2.0.0). Upgrade or override it, then remove its audit-exceptions.json entry.',
    );
  });

  it('blocks a listed finding again on its recheck date', () => {
    const today = day(0);
    const result = runAudit({ advisories: [advisory({})], exceptions: [listed({ recheck: today })] });
    expect(result.status).toBe(1);
    expect(result.output).toContain(`exception for jest > leftpad expired on ${today}. Recheck it.`);
  });

  it('refuses a recheck date more than 30 days out', () => {
    const result = runAudit({ advisories: [advisory({})], exceptions: [listed({ recheck: day(31) })] });
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      `exception recheck ${day(31)} is too far out. Use ${day(30)} or earlier.`,
    );
  });

  it('refuses an exception without a reviewed reason', () => {
    const result = runAudit({
      advisories: [advisory({})],
      exceptions: [listed({ reason: 'not important' })],
    });
    expect(result.status).toBe(1);
    expect(result.output).toContain('audit-exceptions.json entry 1 needs a "reason" of');
  });

  it('covers only the listed path of a finding with 2 paths', () => {
    const result = runAudit({
      advisories: [advisory({ findings: [{ paths: ['.>jest>leftpad', '.>eslint>leftpad'] }] })],
      exceptions: [listed()],
    });
    expect(result.status).toBe(1);
    expect(result.output).toContain('has no fix and 1 unlisted path(s), such as eslint > leftpad.');
  });
});
