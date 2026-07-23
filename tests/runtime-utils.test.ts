import {
  coerceBoolean,
  coerceFloat,
  coerceInteger,
  ensurePresent,
  hasOwn,
  isAbsoluteURL,
  isArray,
  isEmptyObj,
  isObj,
  isReadonlyArray,
  maybeCoerceBoolean,
  maybeCoerceFloat,
  maybeCoerceInteger,
  maybeObj,
  safeJSON,
  validatePositiveInteger,
} from 'x-twitter-scraper/internal/utils/values';
import { concatBytes, decodeUTF8, encodeUTF8 } from 'x-twitter-scraper/internal/utils/bytes';

describe('runtime value utilities', () => {
  test('classifies values and object ownership', () => {
    expect.assertions(16);

    const value = { answer: 42 };
    const inherited = Object.create({ answer: 42 }) as object;

    expect(isAbsoluteURL('https://xquik.com/api/v1')).toBe(true);
    expect(isAbsoluteURL('/api/v1')).toBe(false);
    expect(isArray([])).toBe(true);
    expect(isReadonlyArray([])).toBe(true);
    expect(isArray({})).toBe(false);
    expect(maybeObj('value')).toEqual({});
    expect(maybeObj(null)).toEqual({});
    expect(maybeObj(value)).toBe(value);
    expect(isEmptyObj(null)).toBe(true);
    expect(isEmptyObj({})).toBe(true);
    expect(isEmptyObj(value)).toBe(false);
    expect(hasOwn(value, 'answer')).toBe(true);
    expect(hasOwn(inherited, 'answer')).toBe(false);
    expect(isObj(value)).toBe(true);
    expect(isObj([])).toBe(false);
    expect(isObj(null)).toBe(false);
  });

  test('validates and coerces supported scalar values', () => {
    expect.assertions(25);

    expect(ensurePresent('value')).toBe('value');
    expect(() => ensurePresent(null)).toThrow('Expected a value to be given');
    expect(() => ensurePresent(undefined)).toThrow('Expected a value to be given');
    expect(validatePositiveInteger('count', 2)).toBe(2);
    expect(() => validatePositiveInteger('count', 1.5)).toThrow('count must be an integer');
    expect(() => validatePositiveInteger('count', '2')).toThrow('count must be an integer');
    expect(() => validatePositiveInteger('count', -1)).toThrow('count must be a positive integer');
    expect(coerceInteger(1.6)).toBe(2);
    expect(coerceInteger('12')).toBe(12);
    expect(() => coerceInteger({})).toThrow('Could not coerce');
    expect(coerceFloat(1.5)).toBe(1.5);
    expect(coerceFloat('1.5')).toBe(1.5);
    expect(() => coerceFloat({})).toThrow('Could not coerce');
    expect(coerceBoolean(true)).toBe(true);
    expect(coerceBoolean('true')).toBe(true);
    expect(coerceBoolean('false')).toBe(false);
    expect(coerceBoolean(0)).toBe(false);
    expect(maybeCoerceInteger(null)).toBeUndefined();
    expect(maybeCoerceInteger('3')).toBe(3);
    expect(maybeCoerceFloat(undefined)).toBeUndefined();
    expect(maybeCoerceFloat('3.5')).toBe(3.5);
    expect(maybeCoerceBoolean(null)).toBeUndefined();
    expect(maybeCoerceBoolean('true')).toBe(true);
    expect(safeJSON('{"ok":true}')).toEqual({ ok: true });
    expect(safeJSON('{')).toBeUndefined();
  });
});

describe('runtime byte utilities', () => {
  test('combines bytes and caches UTF-8 codecs', () => {
    expect.assertions(6);

    expect(concatBytes([])).toEqual(new Uint8Array());
    expect(concatBytes([new Uint8Array([1, 2]), new Uint8Array([3])])).toEqual(new Uint8Array([1, 2, 3]));
    expect(encodeUTF8('✓')).toEqual(new Uint8Array([226, 156, 147]));
    expect(encodeUTF8('ok')).toEqual(new Uint8Array([111, 107]));
    expect(decodeUTF8(new Uint8Array([226, 156, 147]))).toBe('✓');
    expect(decodeUTF8(new Uint8Array([111, 107]))).toBe('ok');
  });
});

describe('UUID generation', () => {
  const originalCrypto = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  const originalRandom = Math.random;

  afterEach(() => {
    if (originalCrypto) {
      Object.defineProperty(globalThis, 'crypto', originalCrypto);
    } else {
      Reflect.deleteProperty(globalThis, 'crypto');
    }
    Math.random = originalRandom;
  });

  test('uses native randomUUID when available', () => {
    expect.assertions(2);

    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: { randomUUID: () => '00000000-0000-4000-8000-000000000001' },
    });

    jest.isolateModules(() => {
      const { uuid4 } = require('x-twitter-scraper/internal/utils/uuid') as {
        uuid4: () => string;
      };
      expect(uuid4()).toBe('00000000-0000-4000-8000-000000000001');
      expect(uuid4()).toBe('00000000-0000-4000-8000-000000000001');
    });
  });

  test('uses cryptographic random bytes without randomUUID', () => {
    expect.assertions(1);

    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {
        getRandomValues: (bytes: Uint8Array) => {
          bytes[0] = 0;
          return bytes;
        },
      },
    });

    jest.isolateModules(() => {
      const { uuid4 } = require('x-twitter-scraper/internal/utils/uuid') as {
        uuid4: () => string;
      };
      expect(uuid4()).toBe('10000000-1000-4000-8000-100000000000');
    });
  });

  test('falls back to Math.random without Web Crypto', () => {
    expect.assertions(1);

    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
    Math.random = () => 0;

    jest.isolateModules(() => {
      const { uuid4 } = require('x-twitter-scraper/internal/utils/uuid') as {
        uuid4: () => string;
      };
      expect(uuid4()).toBe('10000000-1000-4000-8000-100000000000');
    });
  });
});
