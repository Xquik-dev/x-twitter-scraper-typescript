// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { XTwitterScraperError } from './error';
import type { ReadableStream } from '../internal/shim-types';
import { makeReadableStream } from '../internal/shims';
import { findDoubleNewlineIndex, LineDecoder } from '../internal/decoders/line';
import { ReadableStreamToAsyncIterable } from '../internal/shims';
import { isAbortError } from '../internal/errors';
import { encodeUTF8 } from '../internal/utils/bytes';
import { loggerFor } from '../internal/utils/log';
import { readGlobal, readProperty } from '../internal/utils/globals';
import type { XTwitterScraper } from '../client';

type Bytes = string | ArrayBuffer | Uint8Array | null | undefined;

export type ServerSentEvent = {
  event: string | null;
  data: string;
  raw: string[];
};

export class Stream<Item> implements AsyncIterable<Item, unknown, undefined> {
  controller: AbortController;
  readonly #client: XTwitterScraper | undefined;

  constructor(
    private readonly iterator: () => AsyncIterator<Item, unknown, undefined>,
    controller: AbortController,
    client?: XTwitterScraper,
  ) {
    this.controller = controller;
    this.#client = client;
  }

  static fromSSEResponse<Item>(
    response: Response,
    controller: AbortController,
    client?: XTwitterScraper,
  ): Stream<Item> {
    let consumed = false;
    const logger = client !== undefined ? loggerFor(client) : console;

    async function* iterator(): AsyncIterator<Item, void, undefined> {
      if (consumed) {
        throw new XTwitterScraperError(
          'Cannot iterate over a consumed stream, use `.tee()` to split the stream.',
        );
      }
      consumed = true;
      let done = false;
      try {
        for await (const sse of _iterSSEMessages(response, controller)) {
          if (sse.data === '') continue;

          try {
            yield JSON.parse(sse.data);
          } catch (e) {
            logger.error(`Could not parse message into JSON:`, sse.data);
            logger.error(`From chunk:`, sse.raw);
            throw e;
          }
        }
        done = true;
      } catch (e) {
        if (isAbortError(e)) return;
        throw e;
      } finally {
        if (!done) controller.abort();
      }
    }

    return new Stream(iterator, controller, client);
  }

  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream<Item>(
    readableStream: ReadableStream<Bytes>,
    controller: AbortController,
    client?: XTwitterScraper,
  ): Stream<Item> {
    let consumed = false;

    async function* iterLines(): AsyncGenerator<string, void, unknown> {
      const lineDecoder = new LineDecoder();

      const iter = ReadableStreamToAsyncIterable<Bytes>(readableStream);
      for await (const chunk of iter) {
        for (const line of lineDecoder.decode(chunk)) {
          yield line;
        }
      }

      for (const line of lineDecoder.flush()) {
        yield line;
      }
    }

    async function* iterator(): AsyncIterator<Item, void, undefined> {
      if (consumed) {
        throw new XTwitterScraperError(
          'Cannot iterate over a consumed stream, use `.tee()` to split the stream.',
        );
      }
      consumed = true;
      let done = false;
      try {
        for await (const line of iterLines()) {
          if (line !== '') yield JSON.parse(line);
        }
        done = true;
      } catch (e) {
        if (isAbortError(e)) return;
        throw e;
      } finally {
        if (!done) controller.abort();
      }
    }

    return new Stream(iterator, controller, client);
  }

  [Symbol.asyncIterator](): AsyncIterator<Item, unknown, undefined> {
    return this.iterator();
  }

  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee(): [Stream<Item>, Stream<Item>] {
    const left: Array<Promise<IteratorResult<Item, unknown>>> = [];
    const right: Array<Promise<IteratorResult<Item, unknown>>> = [];
    const iterator = this.iterator();

    const teeIterator = (
      queue: Array<Promise<IteratorResult<Item, unknown>>>,
      other: Array<Promise<IteratorResult<Item, unknown>>>,
    ): AsyncIterator<Item, unknown, undefined> => {
      return {
        next: () => {
          const queued = queue.shift();
          if (queued !== undefined) return queued;
          const result = iterator.next();
          other.push(result);
          return result;
        },
      };
    };

    return [
      new Stream(() => teeIterator(left, right), this.controller, this.#client),
      new Stream(() => teeIterator(right, left), this.controller, this.#client),
    ];
  }

  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream(): ReadableStream<Uint8Array> {
    const iter = this[Symbol.asyncIterator]();

    return makeReadableStream<Uint8Array>({
      async pull(ctrl) {
        try {
          const result = await iter.next();
          if (result.done === true) {
            ctrl.close();
            return;
          }

          const bytes = encodeUTF8(JSON.stringify(result.value) + '\n');

          ctrl.enqueue(bytes);
        } catch (err) {
          ctrl.error(err);
        }
      },
      async cancel() {
        await iter.return?.();
      },
    });
  }
}

export async function* _iterSSEMessages(
  response: Response,
  controller: AbortController,
): AsyncGenerator<ServerSentEvent, void, unknown> {
  const { body }: { body: ReadableStream<Bytes> | null } = response;
  if (body === null) {
    controller.abort();
    if (readProperty(readGlobal('navigator'), 'product') === 'ReactNative') {
      throw new XTwitterScraperError(
        `The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`,
      );
    }
    throw new XTwitterScraperError(`Attempted to iterate over a response with no body`);
  }

  const sseDecoder = new SSEDecoder();
  const lineDecoder = new LineDecoder();

  const iter = ReadableStreamToAsyncIterable<Bytes>(body);
  for await (const sseChunk of iterSSEChunks(iter)) {
    for (const line of lineDecoder.decode(sseChunk)) {
      const sse = sseDecoder.decode(line);
      if (sse !== null) yield sse;
    }
  }

  for (const line of lineDecoder.flush()) {
    const sse = sseDecoder.decode(line);
    if (sse !== null) yield sse;
  }
}

async function* iterSSEChunks(
  iterator: AsyncIterable<Bytes, unknown, undefined>,
): AsyncGenerator<Uint8Array, void, undefined> {
  let data = new Uint8Array();

  for await (const chunk of iterator) {
    if (chunk === null || chunk === undefined) {
      continue;
    }

    const binaryChunk =
      chunk instanceof ArrayBuffer ? new Uint8Array(chunk)
      : typeof chunk === 'string' ? encodeUTF8(chunk)
      : chunk;

    const newData = new Uint8Array(data.length + binaryChunk.length);
    newData.set(data);
    newData.set(binaryChunk, data.length);
    data = newData;

    let patternIndex: number;
    while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
      yield data.slice(0, patternIndex);
      data = data.slice(patternIndex);
    }
  }

  if (data.length > 0) {
    yield data;
  }
}

class SSEDecoder {
  private data: string[];
  private event: string | null;
  private chunks: string[];

  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }

  decode(rawLine: string) {
    const line = rawLine.endsWith('\r') ? rawLine.substring(0, rawLine.length - 1) : rawLine;

    if (line === '') {
      if ((this.event === null || this.event === '') && this.data.length === 0) return null;

      const sse: ServerSentEvent = {
        event: this.event,
        data: this.data.join('\n'),
        raw: this.chunks,
      };

      this.event = null;
      this.data = [];
      this.chunks = [];

      return sse;
    }

    this.chunks.push(line);

    if (line.startsWith(':')) {
      return null;
    }

    const [fieldname, , rawValue] = partition(line, ':');
    const value = rawValue.startsWith(' ') ? rawValue.substring(1) : rawValue;

    if (fieldname === 'event') {
      this.event = value;
    } else if (fieldname === 'data') {
      this.data.push(value);
    }

    return null;
  }
}

function partition(str: string, delimiter: string): [string, string, string] {
  const index = str.indexOf(delimiter);
  if (index !== -1) {
    return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
  }

  return [str, '', ''];
}
