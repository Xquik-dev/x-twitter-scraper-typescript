// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { readEnv } from 'x-twitter-scraper/internal/utils/env';
import { isRunningInBrowser } from 'x-twitter-scraper/internal/detect-platform';

describe('environment variables', () => {
  const originals = ['process', 'Deno', 'EdgeRuntime', 'window', 'navigator'].map(
    (name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)] as const,
  );
  const originalValue = process.env['XQUIK_TEST_VALUE'];

  afterEach(() => {
    for (const [name, descriptor] of originals) {
      if (descriptor) {
        Object.defineProperty(globalThis, name, descriptor);
      } else {
        Reflect.deleteProperty(globalThis, name);
      }
    }
    if (originalValue === undefined) {
      delete process.env['XQUIK_TEST_VALUE'];
    } else {
      process.env['XQUIK_TEST_VALUE'] = originalValue;
    }
  });

  test('reads and trims Node.js variables', () => {
    expect.assertions(2);

    process.env['XQUIK_TEST_VALUE'] = ' value ';
    expect(readEnv('XQUIK_TEST_VALUE')).toBe('value');

    process.env['XQUIK_TEST_VALUE'] = ' ';
    expect(readEnv('XQUIK_TEST_VALUE')).toBeUndefined();
  });

  test('reads and trims Deno variables', () => {
    expect.assertions(2);

    Object.defineProperty(globalThis, 'process', { configurable: true, value: undefined });
    Object.defineProperty(globalThis, 'Deno', {
      configurable: true,
      value: {
        env: {
          get: (name: string) => (name === 'XQUIK_TEST_VALUE' ? ' deno ' : undefined),
        },
      },
    });

    expect(readEnv('XQUIK_TEST_VALUE')).toBe('deno');
    expect(readEnv('MISSING')).toBeUndefined();
  });

  test('returns undefined when no environment API exists', () => {
    expect.assertions(1);

    Object.defineProperty(globalThis, 'process', { configurable: true, value: undefined });
    Object.defineProperty(globalThis, 'Deno', { configurable: true, value: undefined });
    expect(readEnv('XQUIK_TEST_VALUE')).toBeUndefined();
  });

  test('detects browser globals', () => {
    expect.assertions(2);

    expect(isRunningInBrowser()).toBe(false);
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { document: {} },
    });
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} });
    expect(isRunningInBrowser()).toBe(true);
  });

  const freshPlatformHeaders = async () => {
    vi.resetModules();
    const { getPlatformHeaders } = await import('x-twitter-scraper/internal/detect-platform');
    return getPlatformHeaders;
  };

  test('reports the Node.js platform', async () => {
    expect.assertions(4);

    const getPlatformHeaders = await freshPlatformHeaders();
    const headers = getPlatformHeaders();

    expect(headers['X-Stainless-Runtime']).toBe('node');
    expect(headers['X-Stainless-Runtime-Version']).toBe(process.version);
    expect(headers['X-Stainless-OS']).not.toBe('Unknown');
    expect(headers['X-Stainless-Arch']).not.toBe('unknown');
  });

  test('reports the Deno platform', async () => {
    expect.assertions(1);

    const getPlatformHeaders = await freshPlatformHeaders();
    Object.defineProperty(globalThis, 'Deno', {
      configurable: true,
      value: { build: { os: 'darwin', arch: 'aarch64' }, version: { deno: '2.1.0' } },
    });

    expect(getPlatformHeaders()).toMatchObject({
      'X-Stainless-OS': 'MacOS',
      'X-Stainless-Arch': 'arm64',
      'X-Stainless-Runtime': 'deno',
      'X-Stainless-Runtime-Version': '2.1.0',
    });
  });

  test('reports an edge runtime without a process version', async () => {
    expect.assertions(1);

    const getPlatformHeaders = await freshPlatformHeaders();
    const runtimeProcess = process;
    Object.defineProperty(globalThis, 'EdgeRuntime', { configurable: true, value: 'edge-runtime' });
    Object.defineProperty(globalThis, 'process', { configurable: true, value: undefined });
    const headers = getPlatformHeaders();
    Object.defineProperty(globalThis, 'process', { configurable: true, value: runtimeProcess });

    expect(headers).toMatchObject({
      'X-Stainless-Arch': 'other:edge-runtime',
      'X-Stainless-Runtime': 'edge',
      'X-Stainless-Runtime-Version': 'unknown',
    });
  });
});
