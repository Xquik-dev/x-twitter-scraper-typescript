// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type PackageManifest = {
  bugs: {
    url: string;
  };
  keywords: string[];
  pi: {
    image: string;
    skills: string[];
  };
};

const packageRoot = resolve(__dirname, '..');

const manifest = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8')) as PackageManifest;

describe('package metadata', () => {
  test('preserves support and removed resource contracts', () => {
    expect.assertions(2);
    expect(manifest.bugs.url).toBe('https://github.com/Xquik-dev/x-twitter-scraper-typescript/issues');
    expect(existsSync(resolve(packageRoot, 'src/resources/integrations'))).toBe(false);
  });

  test('declares the packaged Skills', () => {
    expect.assertions(7);
    expect(manifest.keywords).toContain('pi-package');
    expect(manifest.pi.skills).toEqual(['./skills']);
    expect(manifest.pi.image).toBe(
      'https://raw.githubusercontent.com/Xquik-dev/x-twitter-scraper-typescript/main/assets/pi-package.png',
    );
    expect(existsSync(resolve(packageRoot, 'skills/x-twitter-scraper/SKILL.md'))).toBe(true);
    expect(existsSync(resolve(packageRoot, 'skills/xquik-social-research/SKILL.md'))).toBe(true);
    expect(existsSync(resolve(packageRoot, 'skills/x-twitter-scraper/LICENSE'))).toBe(true);
    expect(existsSync(resolve(packageRoot, 'assets/pi-package.png'))).toBe(true);
  });
});
