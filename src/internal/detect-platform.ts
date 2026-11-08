// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { VERSION } from '../version';
import { objectTag, readGlobal, readProperty, readString } from './utils/globals';
import { isPresent } from './utils/values';

export const isRunningInBrowser = () => {
  const window = readGlobal('window');
  return (
    typeof window !== 'undefined' &&
    typeof readProperty(window, 'document') !== 'undefined' &&
    typeof readGlobal('navigator') !== 'undefined'
  );
};

type DetectedPlatform = 'deno' | 'node' | 'edge' | 'unknown';

function getDetectedPlatform(): DetectedPlatform {
  if (isPresent(readProperty(readGlobal('Deno'), 'build'))) {
    return 'deno';
  }
  if (typeof readGlobal('EdgeRuntime') !== 'undefined') {
    return 'edge';
  }
  if (objectTag(readGlobal('process')) === '[object process]') {
    return 'node';
  }
  return 'unknown';
}

type Arch = 'x32' | 'x64' | 'arm' | 'arm64' | `other:${string}` | 'unknown';
type PlatformName =
  'MacOS' | 'Linux' | 'Windows' | 'FreeBSD' | 'OpenBSD' | 'iOS' | 'Android' | `Other:${string}` | 'Unknown';
type Browser = 'ie' | 'edge' | 'chrome' | 'firefox' | 'safari';
type PlatformProperties = {
  'X-Stainless-Lang': 'js';
  'X-Stainless-Package-Version': string;
  'X-Stainless-OS': PlatformName;
  'X-Stainless-Arch': Arch;
  'X-Stainless-Runtime': 'node' | 'deno' | 'edge' | `browser:${Browser}` | 'unknown';
  'X-Stainless-Runtime-Version': string;
};
const getPlatformProperties = (): PlatformProperties => {
  const detectedPlatform = getDetectedPlatform();
  const process = readGlobal('process');
  if (detectedPlatform === 'deno') {
    const deno = readGlobal('Deno');
    const build = readProperty(deno, 'build');
    const version = readProperty(deno, 'version');
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': VERSION,
      'X-Stainless-OS': normalizePlatform(readString(build, 'os') ?? 'unknown'),
      'X-Stainless-Arch': normalizeArch(readString(build, 'arch') ?? 'unknown'),
      'X-Stainless-Runtime': 'deno',
      'X-Stainless-Runtime-Version':
        typeof version === 'string' ? version : (readString(version, 'deno') ?? 'unknown'),
    };
  }
  if (detectedPlatform === 'edge') {
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': VERSION,
      'X-Stainless-OS': 'Unknown',
      'X-Stainless-Arch': `other:${String(readGlobal('EdgeRuntime'))}`,
      'X-Stainless-Runtime': 'edge',
      'X-Stainless-Runtime-Version': readString(process, 'version') ?? 'unknown',
    };
  }
  if (detectedPlatform === 'node') {
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': VERSION,
      'X-Stainless-OS': normalizePlatform(readString(process, 'platform') ?? 'unknown'),
      'X-Stainless-Arch': normalizeArch(readString(process, 'arch') ?? 'unknown'),
      'X-Stainless-Runtime': 'node',
      'X-Stainless-Runtime-Version': readString(process, 'version') ?? 'unknown',
    };
  }

  const browserInfo = getBrowserInfo();
  if (browserInfo !== null) {
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': VERSION,
      'X-Stainless-OS': 'Unknown',
      'X-Stainless-Arch': 'unknown',
      'X-Stainless-Runtime': `browser:${browserInfo.browser}`,
      'X-Stainless-Runtime-Version': browserInfo.version,
    };
  }

  return {
    'X-Stainless-Lang': 'js',
    'X-Stainless-Package-Version': VERSION,
    'X-Stainless-OS': 'Unknown',
    'X-Stainless-Arch': 'unknown',
    'X-Stainless-Runtime': 'unknown',
    'X-Stainless-Runtime-Version': 'unknown',
  };
};

type BrowserInfo = {
  browser: Browser;
  version: string;
};

// Note: modified from https://github.com/JS-DevTools/host-environment/blob/b1ab79ecde37db5d6e163c050e54fe7d287d7c92/src/isomorphic.browser.ts
function getBrowserInfo(): BrowserInfo | null {
  const userAgent = readString(readGlobal('navigator'), 'userAgent');
  if (userAgent === undefined) {
    return null;
  }

  const browserPatterns = [
    { key: 'edge' as const, pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'ie' as const, pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'ie' as const, pattern: /Trident(?:.*rv:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'chrome' as const, pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'firefox' as const, pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'safari' as const, pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ },
  ];

  for (const { key, pattern } of browserPatterns) {
    const match = pattern.exec(userAgent);
    if (match !== null) {
      const major = match[1] ?? '0';
      const minor = match[2] ?? '0';
      const patch = match[3] ?? '0';

      return { browser: key, version: `${major}.${minor}.${patch}` };
    }
  }

  return null;
}

const normalizeArch = (arch: string): Arch => {
  if (arch === 'x32') return 'x32';
  if (arch === 'x86_64' || arch === 'x64') return 'x64';
  if (arch === 'arm') return 'arm';
  if (arch === 'aarch64' || arch === 'arm64') return 'arm64';
  if (arch !== '') return `other:${arch}`;
  return 'unknown';
};

const normalizePlatform = (rawPlatform: string): PlatformName => {
  const platform = rawPlatform.toLowerCase();

  if (platform.includes('ios')) return 'iOS';
  if (platform === 'android') return 'Android';
  if (platform === 'darwin') return 'MacOS';
  if (platform === 'win32') return 'Windows';
  if (platform === 'freebsd') return 'FreeBSD';
  if (platform === 'openbsd') return 'OpenBSD';
  if (platform === 'linux') return 'Linux';
  if (platform !== '') return `Other:${platform}`;
  return 'Unknown';
};

let _platformHeaders: ({ 'X-Xquik-SDK': 'js' } & PlatformProperties) | undefined;
export const getPlatformHeaders = () => {
  return (_platformHeaders ??= { 'X-Xquik-SDK': 'js', ...getPlatformProperties() });
};
