// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type { Fetch } from './builtin-types';
import type { ReadableStream } from './shim-types';

export function getDefaultFetch(): Fetch {
  if (typeof fetch !== 'undefined') {
    return fetch as any;
  }

  throw new Error(
    '`fetch` is not defined as a global; Either pass `fetch` to the client, `new XTwitterScraper({ fetch })` or polyfill the global, `globalThis.fetch = fetch`',
  );
}

type ReadableStreamArgs = ConstructorParameters<typeof ReadableStream>;

export function makeReadableStream(...args: ReadableStreamArgs): ReadableStream {
  const ReadableStream = (globalThis as any).ReadableStream;
  if (typeof ReadableStream === 'undefined') {
    throw new Error(
      '`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`',
    );
  }

  return new ReadableStream(...args);
}

export function ReadableStreamFrom<T>(iterable: Iterable<T> | AsyncIterable<T>): ReadableStream<T> {
  let iter: AsyncIterator<T> | Iterator<T> =
    Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();

  return makeReadableStream({
    start() {},
    async pull(controller: any) {
      const { done, value } = await iter.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    async cancel() {
      await iter.return?.();
    },
  });
}

/**
 * This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
 */
export function ReadableStreamToAsyncIterable<T>(stream: any): AsyncIterableIterator<T> {
  if (stream[Symbol.asyncIterator]) return stream;

  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result?.done) reader.releaseLock();
        return result;
      } catch (e) {
        reader.releaseLock();
        throw e;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: undefined };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

/**
 * Cancels a ReadableStream we don't need to consume.
 * See https://undici.nodejs.org/#/?id=garbage-collection
 */
export async function CancelReadableStream(stream: any): Promise<void> {
  if (stream === null || typeof stream !== 'object') return;

  if (stream[Symbol.asyncIterator]) {
    await stream[Symbol.asyncIterator]().return?.();
    return;
  }

  const reader = stream.getReader();
  const cancelPromise = reader.cancel();
  reader.releaseLock();
  await cancelPromise;
}
