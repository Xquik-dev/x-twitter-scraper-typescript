// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { _iterSSEMessages, Stream } from 'x-twitter-scraper/core/streaming';

function sseResponse(chunks: Array<string | Uint8Array>, init?: ResponseInit): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(typeof chunk === 'string' ? encoder.encode(chunk) : chunk);
      }
      controller.close();
    },
  });
  return new Response(body, { headers: { 'content-type': 'text/event-stream' }, ...init });
}

async function collect<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of iterable) items.push(item);
  return items;
}

describe('_iterSSEMessages', () => {
  test('basic', async () => {
    const events = await collect(
      _iterSSEMessages(
        sseResponse(['event: completion\n', 'data: {"foo":true}\n', '\n']),
        new AbortController(),
      ),
    );
    expect(events).toEqual([
      { event: 'completion', data: '{"foo":true}', raw: ['event: completion', 'data: {"foo":true}'] },
    ]);
  });

  test('data missing', async () => {
    const events = await collect(
      _iterSSEMessages(sseResponse(['event: ping\n', '\n']), new AbortController()),
    );
    expect(events).toEqual([{ event: 'ping', data: '', raw: ['event: ping'] }]);
  });

  test('multiple data lines', async () => {
    const events = await collect(
      _iterSSEMessages(
        sseResponse([
          'event: ping\n',
          'data: {\n',
          'data: "foo":\n',
          'data: \n',
          'data:\n',
          'data: true}\n',
          '\n\n',
        ]),
        new AbortController(),
      ),
    );
    expect(events).toHaveLength(1);
    expect(events[0]!.event).toBe('ping');
    expect(JSON.parse(events[0]!.data)).toEqual({ foo: true });
  });

  test('ids, comments and unknown fields are ignored', async () => {
    const events = await collect(
      _iterSSEMessages(
        sseResponse([': keep-alive\n\n', 'id: 42\nevent: tweet.new\nretry\ndata:{"id":"42"}\n\n']),
        new AbortController(),
      ),
    );
    expect(events.map(({ event, data }) => ({ event, data }))).toEqual([
      { event: 'tweet.new', data: '{"id":"42"}' },
    ]);
  });

  test('special new line characters', async () => {
    const events = await collect(
      _iterSSEMessages(
        sseResponse([
          'data: {"content":"culpa "}\r\n\r\n',
          'data: {"content":" "}\r\r',
          'data: {"content":"foo"}\n\n',
        ]),
        new AbortController(),
      ),
    );
    expect(events.map((e) => JSON.parse(e.data))).toEqual([
      { content: 'culpa ' },
      { content: ' ' },
      { content: 'foo' },
    ]);
  });

  test('event split across chunks and multi-byte characters', async () => {
    const bytes = new TextEncoder().encode('data: {"content":"известни"}\n\n');
    const events = await collect(
      _iterSSEMessages(
        sseResponse([bytes.slice(0, 20), bytes.slice(20, 23), bytes.slice(23)]),
        new AbortController(),
      ),
    );
    expect(events.map((e) => JSON.parse(e.data))).toEqual([{ content: 'известни' }]);
  });

  test('an unterminated final event is dropped', async () => {
    const events = await collect(_iterSSEMessages(sseResponse(['data: {"a":1}\n']), new AbortController()));
    expect(events).toEqual([]);
  });

  test('a response without a body aborts and throws', async () => {
    const controller = new AbortController();
    await expect(collect(_iterSSEMessages(new Response(null), controller))).rejects.toThrow(
      'Attempted to iterate over a response with no body',
    );
    expect(controller.signal.aborted).toBe(true);
  });

  test('React Native gets a fetch hint', async () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
    Object.defineProperty(globalThis, 'navigator', { value: { product: 'ReactNative' }, configurable: true });
    try {
      await expect(collect(_iterSSEMessages(new Response(null), new AbortController()))).rejects.toThrow(
        'expo/fetch',
      );
    } finally {
      if (original) Object.defineProperty(globalThis, 'navigator', original);
      else delete (globalThis as { navigator?: unknown }).navigator;
    }
  });
});

describe('Stream', () => {
  test('yields each event with data as JSON', async () => {
    const stream = Stream.fromSSEResponse<{ id: string }>(
      sseResponse([
        ': comment\n\n',
        'event: tweet.new\ndata: {"id":"1"}\n\n',
        'event: ping\n\n',
        'event: profile.name.changed\ndata: {"id":"2"}\n\n',
      ]),
      new AbortController(),
    );
    expect(await collect(stream)).toEqual([{ id: '1' }, { id: '2' }]);
  });

  test('throws on invalid JSON', async () => {
    const errors: unknown[] = [];
    const client = new XTwitterScraper({
      apiKey: 'My API Key',
      logger: { error: (...args: unknown[]) => errors.push(args), warn() {}, info() {}, debug() {} },
    });
    const stream = Stream.fromSSEResponse(
      sseResponse(['data: {not json}\n\n']),
      new AbortController(),
      client,
    );
    await expect(collect(stream)).rejects.toThrow(SyntaxError);
    expect(errors).toHaveLength(2);
  });

  test('cannot be iterated twice', async () => {
    const stream = Stream.fromSSEResponse(sseResponse(['data: {"a":1}\n\n']), new AbortController());
    await collect(stream);
    await expect(collect(stream)).rejects.toThrow('Cannot iterate over a consumed stream');
  });

  test('breaking out of the loop aborts the request', async () => {
    const controller = new AbortController();
    const stream = Stream.fromSSEResponse(
      sseResponse(['data: {"a":1}\n\n', 'data: {"a":2}\n\n']),
      controller,
    );
    for await (const item of stream) {
      expect(item).toEqual({ a: 1 });
      break;
    }
    expect(controller.signal.aborted).toBe(true);
  });

  test('an aborted read ends the stream without an error', async () => {
    const controller = new AbortController();
    const body = new ReadableStream<Uint8Array>({
      pull(ctrl) {
        ctrl.error(new DOMException('This operation was aborted', 'AbortError'));
      },
    });
    const stream = Stream.fromSSEResponse(new Response(body), controller);
    expect(await collect(stream)).toEqual([]);
  });

  test('tee gives both copies every item', async () => {
    const stream = Stream.fromSSEResponse(
      sseResponse(['data: {"a":1}\n\n', 'data: {"a":2}\n\n']),
      new AbortController(),
    );
    const [left, right] = stream.tee();
    expect(await collect(left)).toEqual([{ a: 1 }, { a: 2 }]);
    expect(await collect(right)).toEqual([{ a: 1 }, { a: 2 }]);
  });

  test('round trips through a ReadableStream', async () => {
    const stream = Stream.fromSSEResponse(
      sseResponse(['data: {"a":1}\n\n', 'data: {"a":2}\n\n']),
      new AbortController(),
    );
    const copy = Stream.fromReadableStream(stream.toReadableStream(), new AbortController());
    expect(await collect(copy)).toEqual([{ a: 1 }, { a: 2 }]);
    await expect(collect(copy)).rejects.toThrow('Cannot iterate over a consumed stream');
  });

  test('a ReadableStream copy reports a source error', async () => {
    const stream = Stream.fromSSEResponse(sseResponse(['data: {broken\n\n']), new AbortController());
    const readable = stream.toReadableStream();
    await expect(collect(Stream.fromReadableStream(readable, new AbortController()))).rejects.toThrow(
      SyntaxError,
    );
  });

  test('cancelling a ReadableStream copy stops the source', async () => {
    const controller = new AbortController();
    const stream = Stream.fromSSEResponse(
      sseResponse(['data: {"a":1}\n\n', 'data: {"a":2}\n\n']),
      controller,
    );
    const reader = stream.toReadableStream().getReader();
    await reader.read();
    await reader.cancel();
    expect(controller.signal.aborted).toBe(true);
  });

  test('breaking out of a ReadableStream copy aborts it', async () => {
    const controller = new AbortController();
    const lines = new ReadableStream<Uint8Array>({
      start(ctrl) {
        ctrl.enqueue(new TextEncoder().encode('{"a":1}\n{"a":2}\n'));
        ctrl.close();
      },
    });
    const stream = Stream.fromReadableStream(lines, controller);
    for await (const item of stream) {
      expect(item).toEqual({ a: 1 });
      break;
    }
    expect(controller.signal.aborted).toBe(true);
  });

  test('an aborted ReadableStream copy ends without an error', async () => {
    const lines = new ReadableStream<Uint8Array>({
      pull(ctrl) {
        ctrl.error(new DOMException('This operation was aborted', 'AbortError'));
      },
    });
    expect(await collect(Stream.fromReadableStream(lines, new AbortController()))).toEqual([]);
  });
});

describe('events.stream', () => {
  function streamingClient(requests: Request[], chunks: string[]): XTwitterScraper {
    return new XTwitterScraper({
      apiKey: 'My API Key',
      baseURL: 'https://example.com/api/v1',
      fetch: async (input, init) => {
        requests.push(new Request(input, init));
        return sseResponse(chunks);
      },
    });
  }

  test('sends an event-stream request and yields each event', async () => {
    const requests: Request[] = [];
    const client = streamingClient(requests, [
      ': idle\n\n',
      'id: 42\nevent: tweet.new\ndata: {"id":"42","type":"tweet.new","monitorId":"7","monitorType":"account","occurredAt":"2025-01-15T12:00:00.000Z","data":{}}\n\n',
    ]);

    const stream = await client.events.stream();
    const events = await collect(stream);

    expect(events).toEqual([
      {
        id: '42',
        type: 'tweet.new',
        monitorId: '7',
        monitorType: 'account',
        occurredAt: '2025-01-15T12:00:00.000Z',
        data: {},
      },
    ]);
    expect(requests).toHaveLength(1);
    expect(requests[0]!.method).toBe('GET');
    expect(requests[0]!.url).toBe('https://example.com/api/v1/events/stream');
    expect(requests[0]!.headers.get('accept')).toBe('text/event-stream');
    expect(requests[0]!.headers.has('last-event-id')).toBe(false);
  });

  test('resumes after the last event ID', async () => {
    const requests: Request[] = [];
    const client = streamingClient(requests, []);

    const stream = await client.events.stream({ 'Last-Event-ID': '42' });

    expect(await collect(stream)).toEqual([]);
    expect(requests[0]!.headers.get('last-event-id')).toBe('42');
  });
});
