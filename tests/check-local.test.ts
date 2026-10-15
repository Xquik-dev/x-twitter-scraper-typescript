// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';

const script = resolve(__dirname, '..', 'bin', 'check-local');

const passes = '#!/bin/sh\n';

const fakeCodeql = `#!/bin/sh
for argument in "$@"; do
  case "$argument" in
    --output=*) cp "$FAKE_CODEQL_SARIF" "\${argument#--output=}" ;;
  esac
done
`;

const extractionDiagnostic = 'js/diagnostics/extraction-errors';

type Unread = { file: string; line: number };

const sarif = ({
  unread = [],
  diagnostics = [extractionDiagnostic],
}: {
  unread?: Unread[];
  diagnostics?: string[];
}) =>
  JSON.stringify({
    runs: [
      {
        tool: { driver: { name: 'CodeQL', notifications: diagnostics.map((id) => ({ id })) } },
        invocations: [
          {
            toolExecutionNotifications: unread.map(({ file, line }) => ({
              locations: [
                {
                  physicalLocation: {
                    artifactLocation: { uri: file, uriBaseId: '%SRCROOT%' },
                    region: { startLine: line },
                  },
                },
              ],
              message: { text: `Extraction failed in ${file} with error Error: Unexpected token` },
              level: 'error',
              descriptor: { id: extractionDiagnostic },
            })),
            executionSuccessful: true,
          },
        ],
        results: [],
      },
    ],
  });

const coverageCheck = (exitCode: number, line: string) =>
  `process.${exitCode === 0 ? 'stdout' : 'stderr'}.write(${JSON.stringify(`${line}\n`)});\nprocess.exitCode = ${exitCode};\n`;

const covered = coverageCheck(
  0,
  'The SDK covers 180 of 186 API operations, and excluded-operations.json lists the other 6.',
);

const checkLocal = (codeqlSarif: string, pnpm = passes, apiCoverage = covered) => {
  const root = mkdtempSync(join(tmpdir(), 'check-local-'));
  try {
    const write = (path: string, content: string, mode = 0o755) => {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
      chmodSync(join(root, path), mode);
    };
    mkdirSync(join(root, 'project', 'bin'), { recursive: true });
    copyFileSync(script, join(root, 'project', 'bin', 'check-local'));
    for (const tool of ['uv', 'uvx']) write(join('tools', tool), passes);
    write(join('tools', 'pnpm'), pnpm);
    write(join('tools', 'codeql'), fakeCodeql);
    for (const check of ['lint', 'check-reproducible']) write(join('project', 'scripts', check), passes);
    write(join('project', 'scripts', 'test'), '#!/bin/sh\necho "Tests:       2 passed, 2 total"\n');
    write(join('project', 'scripts', 'utils', 'check-audit.cjs'), 'console.log("Audit passed.");\n', 0o644);
    write(join('project', 'scripts', 'utils', 'check-api-coverage.cjs'), apiCoverage, 0o644);
    write('codeql.sarif', codeqlSarif, 0o644);
    const result = spawnSync(join(root, 'project', 'bin', 'check-local'), ['--no-status'], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${join(root, 'tools')}${delimiter}${process.env['PATH'] ?? ''}`,
        FAKE_CODEQL_SARIF: join(root, 'codeql.sarif'),
      },
    });
    return { status: result.status, stdout: result.stdout, stderr: result.stderr };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

describe('bin/check-local', () => {
  it('passes when CodeQL read every file and found no result', () => {
    const result = checkLocal(sarif({}));

    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      '==> API coverage\n' +
        'The SDK covers 180 of 186 API operations, and excluded-operations.json lists the other 6.\n' +
        '==> Install dependencies\n',
    );
    expect(result.stdout).toContain(
      '==> Passed API coverage, install, REUSE, audit, lint & types, reproducible build, 2 tests, CodeQL\n',
    );
  });

  it('stops before installing when the SDK lags the API', () => {
    const result = checkLocal(
      sarif({}),
      passes,
      coverageCheck(1, 'GET /api/v1/x/trends/history (getXTrendsHistory) is in the API but not in the SDK.'),
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toBe(
      'GET /api/v1/x/trends/history (getXTrendsHistory) is in the API but not in the SDK.\n' +
        'Check failed at API coverage. Fix what the check reported above, then run bin/check-local again.\n',
    );
    expect(result.stdout).not.toContain('==> Install dependencies');
  });

  it('stops with the upgrade step when pnpm cannot start the pinned pnpm', () => {
    const oldPnpm = `#!/bin/sh
if [ "$1" = "--version" ]; then
  echo " ERROR  Failed to switch pnpm to v12.10.1." >&2
  exit 1
fi
`;

    const result = checkLocal(sarif({}), oldPnpm);

    expect(result.status).toBe(1);
    expect(result.stderr).toBe(
      ' ERROR  Failed to switch pnpm to v12.10.1.\n' +
        'Check failed because pnpm could not start the pnpm version that package.json pins. Upgrade pnpm to 11.28.4 or newer, then run bin/check-local again.\n',
    );
    expect(result.stdout).not.toContain('==> Install dependencies');
  });

  it('fails and names each file that CodeQL could not parse', () => {
    const result = checkLocal(
      sarif({
        unread: [
          { file: 'src/client.ts', line: 12 },
          { file: 'src/core/error.ts', line: 3 },
        ],
      }),
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toBe(
      'CodeQL could not parse src/client.ts at line 12 and src/core/error.ts at line 3, so the scan is incomplete. Rewrite that syntax so CodeQL parses it, then run bin/check-local again.\n' +
        'Check failed at Run CodeQL. Fix what CodeQL reported above, then run bin/check-local again.\n',
    );
  });

  it('fails when the scan ran without the extraction diagnostic', () => {
    const result = checkLocal(sarif({ diagnostics: ['js/diagnostics/successfully-extracted-files'] }));

    expect(result.status).toBe(1);
    expect(result.stderr).toBe(
      'The CodeQL scan lacks js/diagnostics/extraction-errors, so it cannot show that it read every file. Make the suite in bin/check-local run that diagnostic query.\n' +
        'Check failed at Run CodeQL. Fix what CodeQL reported above, then run bin/check-local again.\n',
    );
  });
});
