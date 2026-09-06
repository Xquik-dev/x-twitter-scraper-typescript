// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import ts from 'typescript';

type PackageManifest = {
  scripts: { prepare: string };
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
const researchSkill = readFileSync(resolve(packageRoot, 'skills/xquik-social-research/SKILL.md'), 'utf8');
const accountSkill = readFileSync(resolve(packageRoot, 'skills/xquik-account-automation/SKILL.md'), 'utf8');
const skillMetadata = JSON.parse(readFileSync(resolve(skillRoot, 'metadata.json'), 'utf8')) as SkillMetadata;
const mcpSetup = readFileSync(resolve(skillRoot, 'references/mcp-setup.md'), 'utf8');
const mcpTools = readFileSync(resolve(skillRoot, 'references/mcp-tools.md'), 'utf8');
const skillSpectorReport = readFileSync(resolve(skillRoot, 'skillspector-report.md'), 'utf8');
const xApiTypes = readFileSync(resolve(skillRoot, 'references/types-x-api.md'), 'utf8');

describe('package metadata', () => {
  test.each(['tmp', '.tmp', 'node_modules'])('prepare preserves checkouts inside %s', (parent) => {
    expect.assertions(5);
    const directory = mkdtempSync(resolve(tmpdir(), 'sdk-prepare-'));
    const checkout = resolve(directory, parent, 'checkout');
    const files = ['.git', 'src/index.ts', 'tests/example.ts', 'notes.txt'];
    try {
      cpSync(resolve(packageRoot, 'scripts'), resolve(checkout, 'scripts'), { recursive: true });
      for (const file of files) {
        mkdirSync(resolve(checkout, file, '..'), { recursive: true });
        writeFileSync(resolve(checkout, file), file);
      }
      writeFileSync(
        resolve(checkout, 'scripts/build'),
        '#!/bin/sh\nmkdir dist\necho built > dist/index.js\n',
      );
      execFileSync('bash', ['-c', manifest.scripts.prepare], { cwd: checkout, timeout: 5000 });
      expect(readFileSync(resolve(checkout, 'dist/index.js'), 'utf8')).toBe('built\n');
      expect(files.map((file) => readFileSync(resolve(checkout, file), 'utf8'))).toEqual(files);
      mkdirSync(resolve(checkout, 'node_modules'));
      symlinkSync(packageRoot, resolve(checkout, 'node_modules/x-twitter-scraper'), 'junction');
      for (const path of ['', '/core/error', '/core/error.js']) {
        const { resolvedModule } = ts.resolveModuleName(
          `x-twitter-scraper${path}`,
          resolve(checkout, 'index.ts'),
          { moduleResolution: ts.ModuleResolutionKind.Node10 },
          ts.sys,
        );
        expect(resolvedModule?.resolvedFileName).toBe(
          resolve(packageRoot, 'dist', path ? 'core/error.d.ts' : 'index.d.ts'),
        );
      }
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  test('preserves support and removed resource contracts', () => {
    expect.assertions(2);
    expect(manifest.bugs.url).toBe('https://github.com/Xquik-dev/x-twitter-scraper-typescript/issues');
    expect(existsSync(resolve(packageRoot, 'src/resources/integrations'))).toBe(false);
  });

  test('declares the packaged Skills', () => {
    expect.assertions(9);
    expect(manifest.keywords).toContain('pi-package');
    expect(manifest.pi.skills).toEqual(['./skills']);
    expect(manifest.pi.image).toBe(
      'https://raw.githubusercontent.com/Xquik-dev/x-twitter-scraper-typescript/main/assets/pi-package.png',
    );
    expect(existsSync(resolve(packageRoot, 'skills/x-twitter-scraper/SKILL.md'))).toBe(true);
    expect(existsSync(resolve(packageRoot, 'skills/xquik-social-research/SKILL.md'))).toBe(true);
    expect(existsSync(resolve(packageRoot, 'skills/xquik-account-automation/SKILL.md'))).toBe(true);
    expect(existsSync(resolve(packageRoot, 'skills/x-twitter-scraper/LICENSE'))).toBe(true);
    expect(existsSync(resolve(packageRoot, 'skills/xquik-account-automation/LICENSE'))).toBe(true);
    expect(existsSync(resolve(packageRoot, 'assets/pi-package.png'))).toBe(true);
  });

  test('bundles the current MCP Skill contract', () => {
    expect.assertions(14);
    expect(skillMetadata.version).toBe('2.7.0');
    expect(skill).toMatch(/^  version: ['"]2\.7\.0['"]$/mu);
    expect(skill).not.toContain('2.6.1');
    expect(mcpSetup).toContain('Let the client negotiate the current protocol.');
    expect(mcpSetup).toContain('Use live discovery');
    expect(mcpTools).toContain('supports MCP `2026-07-28` through `server/discover`');
    expect(mcpTools).toContain('Code Mode exposes 3 tools');
    expect(mcpTools).toContain('Some clients receive native tools derived');
    expect(mcpTools).not.toContain('`explore`');
    expect(mcpTools).not.toContain('Hosted MCP v2.6.0');
    expect(existsSync(resolve(skillRoot, 'references/types-mcp-search-tweets.md'))).toBe(false);
    expect(skillSpectorReport).toContain('**Scanned:** 2026-08-26');
    expect(skillSpectorReport).toContain('- Findings: 1 non-applicable legal-text match');
    expect(xApiTypes).toContain('author?: TweetAuthor');
  });

  test('keeps each packaged Skill distinct', () => {
    expect.assertions(9);
    expect(skill).toContain('Use `xquik-social-research` for bounded public research.');
    expect(skill).toContain('Use `xquik-account-automation` for private reads or account changes.');
    expect(researchSkill).toMatch(/^name: xquik-social-research$/mu);
    expect(researchSkill).toContain('Do not use this Skill for DMs');
    expect(researchSkill).toContain('<XQUIK_UNTRUSTED_X_CONTENT');
    expect(accountSkill).toMatch(/^name: xquik-account-automation$/mu);
    expect(accountSkill).toContain('Delete or pause only the resource created for that test.');
    expect(accountSkill).toContain('<XQUIK_UNTRUSTED_X_CONTENT');
    expect(skill).toContain('<XQUIK_UNTRUSTED_X_CONTENT');
  });
});
