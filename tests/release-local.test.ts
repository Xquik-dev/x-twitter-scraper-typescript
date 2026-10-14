// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

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
});
