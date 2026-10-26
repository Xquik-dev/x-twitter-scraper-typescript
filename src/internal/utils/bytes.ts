// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { runtime } from '../runtime';

export function concatBytes(buffers: Uint8Array[]): Uint8Array {
  let length = 0;
  for (const buffer of buffers) {
    length += buffer.length;
  }
  const output = new Uint8Array(length);
  let index = 0;
  for (const buffer of buffers) {
    output.set(buffer, index);
    index += buffer.length;
  }

  return output;
}

let encodeUTF8_: ((str: string) => Uint8Array) | undefined;
export function encodeUTF8(str: string): Uint8Array {
  if (!encodeUTF8_) {
    const Encoder = runtime.TextEncoder;
    if (!Encoder) throw new TypeError('`TextEncoder` is not defined as a global');
    const encoder = new Encoder();
    encodeUTF8_ = (input) => encoder.encode(input);
  }
  return encodeUTF8_(str);
}

let decodeUTF8_: ((bytes: Uint8Array) => string) | undefined;
export function decodeUTF8(bytes: Uint8Array): string {
  if (!decodeUTF8_) {
    const Decoder = runtime.TextDecoder;
    if (!Decoder) throw new TypeError('`TextDecoder` is not defined as a global');
    const decoder = new Decoder();
    decodeUTF8_ = (input) => decoder.decode(input);
  }
  return decodeUTF8_(bytes);
}
