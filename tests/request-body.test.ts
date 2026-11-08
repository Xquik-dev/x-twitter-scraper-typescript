// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper, { BadRequestError } from 'x-twitter-scraper';
import { asyncValues } from './async-values';

const sentBytes = async (body: unknown): Promise<number[]> => {
  let sent: Request | undefined;
  const client = new XTwitterScraper({
    apiKey: 'My API Key',
    bearerToken: null,
    baseURL: 'https://xquik.test/api/v1',
    fetch: (input, init) => {
      sent = new Request(input, init);
      return Promise.resolve(Response.json({}));
    },
  });
  await client.post('/upload', { body, headers: { 'content-type': 'application/octet-stream' } });
  if (sent === undefined) throw new Error('Expected the client to send a request');
  return [...new Uint8Array(await sent.arrayBuffer())];
};

describe('request bodies', () => {
  test('a DataView body sends the bytes it views', async () => {
    const bytes = new Uint8Array([1, 2, 3, 4]);
    expect(await sentBytes(new DataView(bytes.buffer, 1, 2))).toEqual([2, 3]);
  });

  test('a body over shared memory sends its bytes', async () => {
    const shared = new Uint8Array(new SharedArrayBuffer(3));
    shared.set([7, 8, 9]);
    expect(await sentBytes(shared)).toEqual([7, 8, 9]);
  });

  test('a generator body streams its Uint8Array chunks', async () => {
    function* chunks(): Generator<Uint8Array> {
      yield new Uint8Array([1, 2]);
      yield new Uint8Array([3]);
    }
    expect(await sentBytes(chunks())).toEqual([1, 2, 3]);
  });

  test('a streamed body with a chunk that is not a Uint8Array fails with a TypeError', async () => {
    await expect(sentBytes(asyncValues<unknown>([new Uint8Array([1]), 'two']))).rejects.toThrow(TypeError);
  });
});

describe('error bodies', () => {
  test('an error whose JSON body is null carries no error body', async () => {
    const client = new XTwitterScraper({
      apiKey: 'My API Key',
      bearerToken: null,
      baseURL: 'https://xquik.test/api/v1',
      maxRetries: 0,
      fetch: () =>
        Promise.resolve(
          new Response('null', { status: 400, headers: { 'content-type': 'application/json' } }),
        ),
    });

    const error = await client.get('/account').then(
      () => undefined,
      (reason: unknown) => reason,
    );

    expect(error).toBeInstanceOf(BadRequestError);
    expect(error).toHaveProperty('error', undefined);
    expect(error).toHaveProperty('message', '400 null');
  });
});
