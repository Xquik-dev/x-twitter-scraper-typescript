// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { readGlobal, readProperty } from './globals';

/**
 * https://stackoverflow.com/a/2117523
 */
type RuntimeCrypto = {
  randomUUID?: () => string;
  getRandomValues(array: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer>;
};

const isRuntimeCrypto = (value: unknown): value is RuntimeCrypto =>
  typeof readProperty(value, 'getRandomValues') === 'function';

export let uuid4 = function (): string {
  const runtimeCrypto = readGlobal('crypto');
  const crypto = isRuntimeCrypto(runtimeCrypto) ? runtimeCrypto : undefined;
  if (typeof crypto?.randomUUID === 'function') {
    uuid4 = crypto.randomUUID.bind(crypto);
    return crypto.randomUUID();
  }
  const u8 = new Uint8Array(1);
  const randomByte =
    crypto !== undefined ? () => crypto.getRandomValues(u8)[0] ?? 0 : () => (Math.random() * 0xff) & 0xff;
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (Number(c) ^ (randomByte() & (15 >> (Number(c) / 4)))).toString(16),
  );
};
