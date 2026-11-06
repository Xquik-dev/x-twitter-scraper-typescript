// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { readProperty } from './utils/globals';

export function isAbortError(err: unknown) {
  return (
    typeof err === 'object' &&
    err !== null &&
    (('name' in err && err.name === 'AbortError') ||
      ('message' in err && String(err.message).includes('FetchRequestCanceledException')))
  );
}

export const describeValue = (value: unknown): string | undefined => {
  switch (typeof value) {
    case 'undefined':
      return undefined;
    case 'string':
      return value;
    case 'number':
    case 'boolean':
    case 'bigint':
    case 'symbol':
      return String(value);
    case 'object':
      return value === null ? 'null' : Object.prototype.toString.call(value);
    case 'function':
      return Function.prototype.toString.call(value);
  }
};

const orUndefined = <T>(make: () => T): T | undefined => {
  try {
    return make();
  } catch {
    return undefined;
  }
};

const copyErrorLike = (err: object): Error | undefined => {
  if (Object.prototype.toString.call(err) !== '[object Error]') return undefined;
  const cause = readProperty(err, 'cause');
  const stack = readProperty(err, 'stack');
  const name = readProperty(err, 'name');
  const error = new Error(describeValue(readProperty(err, 'message')), Boolean(cause) ? { cause } : {});
  if (typeof stack === 'string' && stack !== '') error.stack = stack;
  if (Boolean(cause) && !Boolean(error.cause)) error.cause = cause;
  if (typeof name === 'string' && name !== '') error.name = name;
  return error;
};

export const castToError = (err: unknown): Error => {
  if (err instanceof Error) return err;
  if (typeof err === 'object' && err !== null) {
    const copied = orUndefined(() => copyErrorLike(err));
    if (copied !== undefined) return copied;
    const serialized = orUndefined(() => new Error(JSON.stringify(err)));
    if (serialized !== undefined) return serialized;
  }
  return new Error(describeValue(err));
};
