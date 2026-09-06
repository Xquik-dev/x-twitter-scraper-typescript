// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { fromBase64, toBase64 } from 'x-twitter-scraper/internal/utils/base64';

describe.each(['Buffer', 'atob'])('with %s', (mode) => {
  let originalBuffer: BufferConstructor;
  beforeAll(() => {
    if (mode === 'atob') {
      originalBuffer = globalThis.Buffer;
      // @ts-expect-error Can't assign undefined to BufferConstructor
      delete globalThis.Buffer;
    }
  });
  afterAll(() => {
    if (mode === 'atob') {
      globalThis.Buffer = originalBuffer;
    }
  });
  const cases: [Uint8Array, string][] = [
    [new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]), 'aGVsbG8gd29ybGQ='],
    [new Uint8Array([]), ''],
    [
      new Uint8Array([
        229, 102, 215, 230, 65, 22, 46, 87, 243, 176, 99, 99, 31, 174, 8, 242, 83, 142, 169, 64, 122, 123,
        193, 71,
      ]),
      '5WbX5kEWLlfzsGNjH64I8lOOqUB6e8FH',
    ],
    [new Uint8Array([226, 156, 147]), '4pyT'],
  ];

  test('toBase64', () => {
    expect.assertions(7);
    expect(toBase64('hello world')).toBe('aGVsbG8gd29ybGQ=');
    expect(toBase64('✓')).toBe('4pyT');
    expect(toBase64(undefined)).toBe('');
    for (const [bytes, encoded] of cases) expect(toBase64(bytes)).toBe(encoded);
  });

  test('fromBase64', () => {
    expect.assertions(4);
    for (const [bytes, encoded] of cases) expect(fromBase64(encoded)).toEqual(bytes);
  });
});
