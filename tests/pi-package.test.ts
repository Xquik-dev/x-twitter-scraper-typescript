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

type SkillMetadata = {
  version: string;
};

const packageRoot = resolve(__dirname, '..');

const manifest = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8')) as PackageManifest;
const skillRoot = resolve(packageRoot, 'skills/x-twitter-scraper');
const skill = readFileSync(resolve(skillRoot, 'SKILL.md'), 'utf8');
const skillMetadata = JSON.parse(readFileSync(resolve(skillRoot, 'metadata.json'), 'utf8')) as SkillMetadata;
const mcpSetup = readFileSync(resolve(skillRoot, 'references/mcp-setup.md'), 'utf8');
const mcpTools = readFileSync(resolve(skillRoot, 'references/mcp-tools.md'), 'utf8');
const skillSpectorReport = readFileSync(resolve(skillRoot, 'skillspector-report.md'), 'utf8');
const xApiTypes = readFileSync(resolve(skillRoot, 'references/types-x-api.md'), 'utf8');

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

  test('bundles the current MCP Skill contract', () => {
    expect.assertions(11);
    expect(skillMetadata.version).toBe('2.6.0');
    expect(skill).toMatch(/^version: ['"]2\.6\.0['"]$/mu);
    expect(skill).not.toContain('2.5.6');
    expect(mcpSetup).toContain('Let the client negotiate the current protocol.');
    expect(mcpSetup).toContain('Use live discovery');
    expect(mcpTools).toContain('Let the MCP client negotiate the current protocol');
    expect(mcpTools).toContain('Use `explore` first');
    expect(mcpTools).toContain('credential, checkout, or guest-wallet operations');
    expect(skillSpectorReport).toContain('**Scanned:** 2026-08-20');
    expect(skillSpectorReport).toContain('- Findings: 1 non-applicable legal-text match');
    expect(xApiTypes).toContain('author?: TweetAuthor');
  });
});
