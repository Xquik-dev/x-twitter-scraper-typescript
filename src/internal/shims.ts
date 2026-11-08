// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type { Fetch } from './builtin-types';
import type { ReadableStream } from './shim-types';
import { readProperty } from './utils/globals';

export function getDefaultFetch(): Fetch {
  if (typeof fetch !== 'undefined') {
    return fetch;
  }

  throw new Error(
    '`fetch` is not defined as a global; Either pass `fetch` to the client, `new XTwitterScraper({ fetch })` or polyfill the global, `globalThis.fetch = fetch`',
  );
}

type ReadableStreamSource<R> = {
  start?: (controller: ReadableStreamDefaultController<R>) => void | PromiseLike<void>;
  pull?: (controller: ReadableStreamDefaultController<R>) => void | PromiseLike<void>;
  cancel?: (reason?: unknown) => void | PromiseLike<void>;
};

export function makeReadableStream<R>(source: ReadableStreamSource<R> = {}): ReadableStream<R> {
  if (typeof globalThis.ReadableStream === 'undefined') {
    throw new Error(
      '`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`',
    );
  }

  return new globalThis.ReadableStream<R>(source);
}

export const isAsyncIterable = (value: unknown): value is AsyncIterable<unknown, unknown, undefined> =>
  typeof value === 'object' &&
  value !== null &&
  typeof readProperty(value, Symbol.asyncIterator) === 'function';

export const isIterable = (value: object): value is Iterable<unknown, unknown, undefined> =>
  typeof readProperty(value, Symbol.iterator) === 'function';

export async function* uint8ArrayChunks(
  iterable: Iterable<unknown, unknown, undefined> | AsyncIterable<unknown, unknown, undefined>,
): AsyncGenerator<Uint8Array, void, undefined> {
  for await (const chunk of iterable) {
    if (!(chunk instanceof Uint8Array)) {
      throw new TypeError(
        `Expected every chunk of a streamed body to be a Uint8Array but got ${typeof chunk}`,
      );
    }
    yield chunk;
  }
}

export function ReadableStreamFrom<T>(
  iterable: Iterable<T, unknown, undefined> | AsyncIterable<T, unknown, undefined>,
): ReadableStream<T> {
  const iter: AsyncIterator<T, unknown, undefined> | Iterator<T, unknown, undefined> =
    Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();

  return makeReadableStream<T>({
    start() {},
    async pull(controller) {
      const result = await iter.next();
      if (result.done === true) {
        controller.close();
      } else {
        controller.enqueue(result.value);
      }
    },
    async cancel() {
      await iter.return?.();
    },
  });
}

type StreamReader<T> = {
  read(): Promise<{ done: false; value: T } | { done: true; value?: T | undefined }>;
  cancel(): Promise<unknown>;
  releaseLock(): void;
};

type ReaderSource<T> = { getReader(): StreamReader<T> };

const isReaderSource = (value: object): value is ReaderSource<unknown> =>
  typeof readProperty(value, 'getReader') === 'function';

/**
 * This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
 */
export function ReadableStreamToAsyncIterable<T>(
  stream: AsyncIterable<T, unknown, undefined>,
): AsyncIterable<T, unknown, undefined>;
export function ReadableStreamToAsyncIterable<T>(
  stream: ReaderSource<T>,
): AsyncIterableIterator<T, undefined, undefined>;
export function ReadableStreamToAsyncIterable<T>(
  stream: AsyncIterable<T, unknown, undefined> | ReaderSource<T>,
): AsyncIterable<T, unknown, undefined> {
  if (Symbol.asyncIterator in stream) return stream;

  const reader = stream.getReader();
  const iterator: AsyncIterableIterator<T, undefined, undefined> = {
    async next() {
      try {
        const result = await reader.read();
        if (result.done) {
          reader.releaseLock();
          return { done: true, value: undefined };
        }
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
      return iterator;
    },
  };
  return iterator;
}

/**
 * Cancels a ReadableStream we don't need to consume.
 * See https://undici.nodejs.org/#/?id=garbage-collection
 */
export async function CancelReadableStream(stream: unknown): Promise<void> {
  if (stream === null || typeof stream !== 'object') return;

  if (isAsyncIterable(stream)) {
    await stream[Symbol.asyncIterator]().return?.();
    return;
  }

  if (!isReaderSource(stream)) {
    throw new TypeError('stream.getReader is not a function');
  }
  const reader = stream.getReader();
  const cancelPromise = reader.cancel();
  reader.releaseLock();
  await cancelPromise;
}
