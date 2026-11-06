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

const toErrorMessage = (value: unknown): string | undefined =>
  value === undefined ? undefined : String(value);

export const castToError = (err: unknown): Error => {
  if (err instanceof Error) return err;
  if (typeof err === 'object' && err !== null) {
    try {
      if (Object.prototype.toString.call(err) === '[object Error]') {
        const cause = readProperty(err, 'cause');
        const stack = readProperty(err, 'stack');
        const name = readProperty(err, 'name');
        const error = new Error(toErrorMessage(readProperty(err, 'message')), cause ? { cause } : {});
        if (typeof stack === 'string' && stack) error.stack = stack;
        if (cause && !error.cause) error.cause = cause;
        if (typeof name === 'string' && name) error.name = name;
        return error;
      }
    } catch {}
    try {
      return new Error(JSON.stringify(err));
    } catch {}
  }
  return new Error(toErrorMessage(err));
};
