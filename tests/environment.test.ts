import { readEnv } from 'x-twitter-scraper/internal/utils/env';
import { isRunningInBrowser } from 'x-twitter-scraper/internal/detect-platform';

describe('environment variables', () => {
  const originalProcess = Object.getOwnPropertyDescriptor(globalThis, 'process');
  const originalDeno = Object.getOwnPropertyDescriptor(globalThis, 'Deno');
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const originalValue = process.env['XQUIK_TEST_VALUE'];

  afterEach(() => {
    if (originalProcess) {
      Object.defineProperty(globalThis, 'process', originalProcess);
    }
    if (originalDeno) {
      Object.defineProperty(globalThis, 'Deno', originalDeno);
    } else {
      Reflect.deleteProperty(globalThis, 'Deno');
    }
    if (originalWindow) {
      Object.defineProperty(globalThis, 'window', originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, 'window');
    }
    if (originalNavigator) {
      Object.defineProperty(globalThis, 'navigator', originalNavigator);
    } else {
      Reflect.deleteProperty(globalThis, 'navigator');
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
});
