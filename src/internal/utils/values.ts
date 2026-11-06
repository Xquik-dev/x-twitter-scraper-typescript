// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { XTwitterScraperError } from '../../core/error';

// https://url.spec.whatwg.org/#url-scheme-string
const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;

export const isAbsoluteURL = (url: string): boolean => {
  return startsWithSchemeRegexp.test(url);
};

export let isArray = (val: unknown): val is unknown[] => ((isArray = Array.isArray), isArray(val));
export const isReadonlyArray: (val: unknown) => val is readonly unknown[] = isArray;

export const isPresent = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined;

export const isNonEmptyString = (value: string | null | undefined): value is string =>
  isPresent(value) && value !== '';

export function maybeObj(x: unknown): object {
  if (typeof x !== 'object') {
    return {};
  }

  return x ?? {};
}

export function isEmptyObj(obj: object | null | undefined): boolean {
  if (!isPresent(obj)) return true;
  for (const _k in obj) return false;
  return true;
}

export function hasOwn<T extends object = object>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isObj(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export const ensurePresent = <T>(value: T | null | undefined): T => {
  if (!isPresent(value)) {
    throw new XTwitterScraperError(`Expected a value to be given but received ${String(value)} instead.`);
  }

  return value;
};

export const validatePositiveInteger = (name: string, n: unknown): number => {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new XTwitterScraperError(`${name} must be an integer`);
  }
  if (n < 0) {
    throw new XTwitterScraperError(`${name} must be a positive integer`);
  }
  return n;
};

export const coerceInteger = (value: unknown): number => {
  if (typeof value === 'number') return Math.round(value);
  if (typeof value === 'string') return parseInt(value, 10);

  throw new XTwitterScraperError(`Could not coerce ${String(value)} (type: ${typeof value}) into a number`);
};

export const coerceFloat = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);

  throw new XTwitterScraperError(`Could not coerce ${String(value)} (type: ${typeof value}) into a number`);
};

export const coerceBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return Boolean(value);
};

export const maybeCoerceInteger = (value: unknown): number | undefined => {
  if (!isPresent(value)) {
    return undefined;
  }
  return coerceInteger(value);
};

export const maybeCoerceFloat = (value: unknown): number | undefined => {
  if (!isPresent(value)) {
    return undefined;
  }
  return coerceFloat(value);
};

export const maybeCoerceBoolean = (value: unknown): boolean | undefined => {
  if (!isPresent(value)) {
    return undefined;
  }
  return coerceBoolean(value);
};

export const safeJSON = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};
