// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type { Fetch } from './builtin-types';
import type { ReadableStream } from './shim-types';
import { runtime } from './runtime';
import { encodeUTF8 } from './utils/bytes';

export function getDefaultFetch(): Fetch {
  if (typeof fetch !== 'undefined') {
    return fetch;
  }

  throw new Error(
    '`fetch` is not defined as a global; Either pass `fetch` to the client, `new XTwitterScraper({ fetch })` or polyfill the global, `globalThis.fetch = fetch`',
  );
}

type StreamController<R> = {
  close(): void;
  enqueue(chunk: R): void;
  error(reason?: unknown): void;
};

export type StreamSource<R> = {
  start?(controller: StreamController<R>): void | Promise<void>;
  pull?(controller: StreamController<R>): void | Promise<void>;
  cancel?(reason?: unknown): void | Promise<void>;
};

export function makeReadableStream<R>(source: StreamSource<R>): ReadableStream<R> {
  const Constructor = runtime.ReadableStream;
  if (typeof Constructor === 'undefined') {
    throw new Error(
      '`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`',
    );
  }

  return new Constructor<R>(source);
}

export const isAsyncIterable = (value: unknown): value is AsyncIterable<unknown, unknown, undefined> =>
  typeof value === 'object' &&
  value !== null &&
  Symbol.asyncIterator in value &&
  typeof value[Symbol.asyncIterator] === 'function';

export const isIteratorObject = (value: unknown): value is Iterable<unknown, unknown, undefined> =>
  typeof value === 'object' &&
  value !== null &&
  Symbol.iterator in value &&
  typeof value[Symbol.iterator] === 'function' &&
  'next' in value &&
  typeof value.next === 'function';

export async function* byteChunks(
  chunks: AsyncIterable<unknown, unknown, undefined> | Iterable<unknown, unknown, undefined>,
): AsyncGenerator<Uint8Array, void, undefined> {
  for await (const chunk of chunks) yield toBytes(chunk);
}

export function toBytes(chunk: unknown): Uint8Array {
  if (chunk instanceof Uint8Array) return chunk;
  if (typeof chunk === 'string') return encodeUTF8(chunk);
  if (chunk instanceof ArrayBuffer) return new Uint8Array(chunk);
  if (ArrayBuffer.isView(chunk)) return new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
  throw new TypeError(`Expected a string or bytes in the stream but got ${typeof chunk}`);
}

export const toByteStream = (stream: ReadableStream<unknown>): ReadableStream<Uint8Array> =>
  stream.pipeThrough(
    new TransformStream<unknown, Uint8Array>({
      transform(chunk, controller) {
        controller.enqueue(toBytes(chunk));
      },
    }),
  );

export function ReadableStreamFrom<T>(
  iterable: Iterable<T, unknown, undefined> | AsyncIterable<T, unknown, undefined>,
): ReadableStream<T> {
  let iter: AsyncIterator<T, unknown, undefined> | Iterator<T, unknown, undefined> =
    Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();

  return makeReadableStream<T>({
    start() {},
    async pull(controller) {
      const result = await iter.next();
      if (result.done) {
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

type StreamReadResult<T> = { done: true; value?: undefined } | { done: false; value: T };

export type StreamReader<T> = {
  read(): Promise<StreamReadResult<T>>;
  releaseLock(): void;
  cancel(): Promise<void>;
};

export type ReadableSource<T> = AsyncIterable<T, undefined, undefined> | { getReader(): StreamReader<T> };

/**
 * This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
 */
export function ReadableStreamToAsyncIterable<T>(stream: ReadableSource<T>): AsyncIterable<T, undefined, undefined> {
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
        return { done: false, value: result.value };
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

const isCancellableReader = (value: unknown): value is { getReader(): StreamReader<unknown> } =>
  typeof value === 'object' && value !== null && 'getReader' in value && typeof value.getReader === 'function';

/**
 * Cancels a ReadableStream we don't need to consume.
 * See https://undici.nodejs.org/#/?id=garbage-collection
 */
export async function CancelReadableStream(stream: unknown): Promise<void> {
  if (stream === null || typeof stream !== 'object') return;

  if (Symbol.asyncIterator in stream) {
    const iterate = stream[Symbol.asyncIterator];
    if (typeof iterate === 'function') {
      const iterator: unknown = iterate.call(stream);
      if (typeof iterator === 'object' && iterator !== null && 'return' in iterator) {
        const finish = iterator.return;
        if (typeof finish === 'function') await finish.call(iterator);
      }
    }
    return;
  }

  if (!isCancellableReader(stream)) return;
  const reader = stream.getReader();
  const cancelPromise = reader.cancel();
  reader.releaseLock();
  await cancelPromise;
}
