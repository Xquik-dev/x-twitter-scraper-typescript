import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type PackageManifest = {
  keywords: string[];
  pi: {
    image: string;
    skills: string[];
  };
};

const packageRoot = resolve(__dirname, '..');

describe('Pi package', () => {
  test('declares the packaged Skills', () => {
    expect.assertions(7);
    const manifest = JSON.parse(
      readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
    ) as PackageManifest;

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
