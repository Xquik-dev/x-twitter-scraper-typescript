// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { readGlobal, readProperty, readString } from './globals';

export const readEnv = (env: string): string | undefined => {
  const process = readGlobal('process');
  if (typeof process !== 'undefined') {
    return readString(readProperty(process, 'env'), env)?.trim() || undefined;
  }
  const deno = readGlobal('Deno');
  if (typeof deno !== 'undefined') {
    const denoEnv = readProperty(deno, 'env');
    const get = readProperty(denoEnv, 'get');
    if (typeof get !== 'function') return undefined;
    const value: unknown = Reflect.apply(get, denoEnv, [env]);
    return typeof value === 'string' ? value.trim() || undefined : undefined;
  }
  return undefined;
};
