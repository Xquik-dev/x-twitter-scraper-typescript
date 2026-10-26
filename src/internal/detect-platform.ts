// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { VERSION } from '../version';
import { runtime } from './runtime';
import { objectTag } from './utils/values';

export const isRunningInBrowser = () => {
  return (
    typeof runtime.window !== 'undefined' &&
    typeof runtime.window.document !== 'undefined' &&
    typeof runtime.navigator !== 'undefined'
  );
};

type DetectedPlatform = 'deno' | 'node' | 'edge' | 'unknown';

function getDetectedPlatform(): DetectedPlatform {
  if (typeof runtime.Deno !== 'undefined' && runtime.Deno.build != null) {
    return 'deno';
  }
  if (typeof runtime.EdgeRuntime !== 'undefined') {
    return 'edge';
  }
  if (
    objectTag(typeof runtime.process !== 'undefined' ? runtime.process : 0) === '[object process]'
  ) {
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
  const { Deno, EdgeRuntime, process } = runtime;
  if (detectedPlatform === 'deno' && Deno?.build) {
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': VERSION,
      'X-Stainless-OS': normalizePlatform(Deno.build.os),
      'X-Stainless-Arch': normalizeArch(Deno.build.arch),
      'X-Stainless-Runtime': 'deno',
      'X-Stainless-Runtime-Version':
        typeof Deno.version === 'string' ? Deno.version : (Deno.version?.deno ?? 'unknown'),
    };
  }
  if (typeof EdgeRuntime !== 'undefined') {
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': VERSION,
      'X-Stainless-OS': 'Unknown',
      'X-Stainless-Arch': `other:${String(EdgeRuntime)}`,
      'X-Stainless-Runtime': 'edge',
      'X-Stainless-Runtime-Version': String(process?.version),
    };
  }
  if (detectedPlatform === 'node') {
    return {
      'X-Stainless-Lang': 'js',
      'X-Stainless-Package-Version': VERSION,
      'X-Stainless-OS': normalizePlatform(process?.platform ?? 'unknown'),
      'X-Stainless-Arch': normalizeArch(process?.arch ?? 'unknown'),
      'X-Stainless-Runtime': 'node',
      'X-Stainless-Runtime-Version': process?.version ?? 'unknown',
    };
  }

  const browserInfo = getBrowserInfo();
  if (browserInfo) {
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
  const userAgent = runtime.navigator?.userAgent;
  if (userAgent === undefined) {
    return null;
  }

  const browserPatterns = [
    { key: 'edge' as const, pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'ie' as const, pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'ie' as const, pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'chrome' as const, pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'firefox' as const, pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: 'safari' as const, pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ },
  ];

  for (const { key, pattern } of browserPatterns) {
    const match = pattern.exec(userAgent);
    if (match) {
      const major = match[1] || 0;
      const minor = match[2] || 0;
      const patch = match[3] || 0;

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
  if (arch) return `other:${arch}`;
  return 'unknown';
};

const normalizePlatform = (platform: string): PlatformName => {
  platform = platform.toLowerCase();

  if (platform.includes('ios')) return 'iOS';
  if (platform === 'android') return 'Android';
  if (platform === 'darwin') return 'MacOS';
  if (platform === 'win32') return 'Windows';
  if (platform === 'freebsd') return 'FreeBSD';
  if (platform === 'openbsd') return 'OpenBSD';
  if (platform === 'linux') return 'Linux';
  if (platform) return `Other:${platform}`;
  return 'Unknown';
};

let _platformHeaders: { 'X-Xquik-SDK': 'js' } & PlatformProperties;
export const getPlatformHeaders = () => {
  return (_platformHeaders ??= { 'X-Xquik-SDK': 'js', ...getPlatformProperties() });
};
