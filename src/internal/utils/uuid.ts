// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { runtime } from '../runtime';

/**
 * https://stackoverflow.com/a/2117523
 */
export let uuid4 = function (): string {
  const { crypto } = runtime;
  const randomUUID = crypto?.randomUUID;
  if (crypto && randomUUID) {
    uuid4 = randomUUID.bind(crypto);
    return randomUUID.call(crypto);
  }
  const u8 = new Uint8Array(1);
  const randomByte =
    crypto ? () => crypto.getRandomValues(u8)[0] ?? 0 : () => (Math.random() * 0xff) & 0xff;
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (+c ^ (randomByte() & (15 >> (+c / 4)))).toString(16),
  );
};
