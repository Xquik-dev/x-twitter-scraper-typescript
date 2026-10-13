// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';

const script = resolve(__dirname, '..', 'bin', 'check-local');

// Stand-ins for the tools that install, lint, build and reach other systems. Each one passes.
const passes = '#!/bin/sh\n';

// Stands in for the CodeQL CLI. The analysis writes the SARIF file that the test names.
const fakeCodeql = `#!/bin/sh
for argument in "$@"; do
  case "$argument" in
    --output=*) cp "$FAKE_CODEQL_SARIF" "\${argument#--output=}" ;;
  esac
done
`;

const extractionDiagnostic = 'js/diagnostics/extraction-errors';

type Unread = { file: string; line: number };

// A SARIF file in the shape CodeQL 2.27 writes for a scan without results. "unread" lists the files
// CodeQL could not parse, and "diagnostics" names the diagnostic queries that ran.
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

// Runs bin/check-local in a throwaway project. Stand-ins replace every check but CodeQL, and the fake
// CodeQL writes the given SARIF file. Git, jq and Node are real.
const checkLocal = (codeqlSarif: string) => {
  const root = mkdtempSync(join(tmpdir(), 'check-local-'));
  try {
    const write = (path: string, content: string, mode = 0o755) => {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
      chmodSync(join(root, path), mode);
    };
    mkdirSync(join(root, 'project', 'bin'), { recursive: true });
    copyFileSync(script, join(root, 'project', 'bin', 'check-local'));
    for (const tool of ['pnpm', 'uv', 'uvx']) write(join('tools', tool), passes);
    write(join('tools', 'codeql'), fakeCodeql);
    for (const check of ['lint', 'check-reproducible']) write(join('project', 'scripts', check), passes);
    write(join('project', 'scripts', 'test'), '#!/bin/sh\necho "Tests:       2 passed, 2 total"\n');
    write(join('project', 'scripts', 'utils', 'check-audit.cjs'), 'console.log("Audit passed.");\n', 0o644);
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
      '==> Passed install, REUSE, audit, lint & types, reproducible build, 2 tests, CodeQL\n',
    );
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
