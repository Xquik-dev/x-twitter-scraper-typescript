// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { runtime } from '../runtime';

export const readEnv = (env: string): string | undefined => {
  const { process, Deno } = runtime;
  if (typeof process !== 'undefined') {
    return process.env?.[env]?.trim() || undefined;
  }
  if (typeof Deno !== 'undefined') {
    return Deno.env?.get?.(env)?.trim() || undefined;
  }
  return undefined;
};
