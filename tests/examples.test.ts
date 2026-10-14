// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const repository = resolve(__dirname, '..');
const examples = readdirSync(resolve(repository, 'examples')).filter((file) => file.endsWith('.ts'));

describe('examples', () => {
  it.each(examples)(
    'pnpm tsn -T runs examples/%s',
    (file) => {
      const result = spawnSync('pnpm', ['--silent', 'tsn', '-T', `examples/${file}`], {
        cwd: repository,
        encoding: 'utf8',
      });

      expect(result.stderr).toBe('');
      expect(result.status).toBe(0);
    },
    60_000,
  );
});
