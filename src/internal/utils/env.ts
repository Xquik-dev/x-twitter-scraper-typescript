// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { readGlobal, readProperty, readString } from './globals';

export const readEnv = (env: string): string | undefined => {
  const process = readGlobal('process');
  if (typeof process !== 'undefined') {
    const value = readString(readProperty(process, 'env'), env)?.trim();
    return value === '' ? undefined : value;
  }
  const deno = readGlobal('Deno');
  if (typeof deno !== 'undefined') {
    const denoEnv = readProperty(deno, 'env');
    const get = readProperty(denoEnv, 'get');
    if (typeof get !== 'function') return undefined;
    const value: unknown = Reflect.apply(get, denoEnv, [env]);
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }
  return undefined;
};
