// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { objectTag } from './utils/values';

export function isAbortError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (('name' in err && err.name === 'AbortError') ||
      ('message' in err && String(err.message).includes('FetchRequestCanceledException')))
  );
}

export const castToError = (err: unknown): Error => {
  if (err instanceof Error) return err;
  if (typeof err === 'object' && err !== null) {
    try {
      if (objectTag(err) === '[object Error]') {
        const cause = 'cause' in err ? err.cause : undefined;
        const error = new Error(String('message' in err ? err.message : ''), cause ? { cause } : {});
        const stack = 'stack' in err ? err.stack : undefined;
        if (typeof stack === 'string' && stack) error.stack = stack;
        if (cause && !error.cause) error.cause = cause;
        const name = 'name' in err ? err.name : undefined;
        if (typeof name === 'string' && name) error.name = name;
        return error;
      }
    } catch {}
    try {
      return new Error(JSON.stringify(err));
    } catch {}
  }
  return new Error(String(err));
};
