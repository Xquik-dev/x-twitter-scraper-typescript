// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

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

export function arrayBufferBytes(view: ArrayBufferView): Uint8Array<ArrayBuffer> {
  return view.buffer instanceof ArrayBuffer ?
      new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
    : new Uint8Array(view.buffer, view.byteOffset, view.byteLength).slice();
}

let encodeUTF8_: ((str: string) => Uint8Array) | undefined;
export function encodeUTF8(str: string) {
  if (!encodeUTF8_) {
    const encoder = new globalThis.TextEncoder();
    encodeUTF8_ = encoder.encode.bind(encoder);
  }
  return encodeUTF8_(str);
}

let decodeUTF8_: ((bytes: Uint8Array) => string) | undefined;
export function decodeUTF8(bytes: Uint8Array) {
  if (!decodeUTF8_) {
    const decoder = new globalThis.TextDecoder();
    decodeUTF8_ = decoder.decode.bind(decoder);
  }
  return decodeUTF8_(bytes);
}
