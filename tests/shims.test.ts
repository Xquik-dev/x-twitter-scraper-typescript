import {
  CancelReadableStream,
  getDefaultFetch,
  makeReadableStream,
  ReadableStreamFrom,
  ReadableStreamToAsyncIterable,
} from 'x-twitter-scraper/internal/shims';

describe('runtime shims', () => {
  const originalFetch = Object.getOwnPropertyDescriptor(globalThis, 'fetch');
  const originalReadableStream = Object.getOwnPropertyDescriptor(globalThis, 'ReadableStream');

  afterEach(() => {
    if (originalFetch) {
      Object.defineProperty(globalThis, 'fetch', originalFetch);
    }
    if (originalReadableStream) {
      Object.defineProperty(globalThis, 'ReadableStream', originalReadableStream);
    }
  });

  test('returns fetch and reports a missing implementation', () => {
    expect.assertions(2);

    expect(getDefaultFetch()).toBe(globalThis.fetch);
    Reflect.deleteProperty(globalThis, 'fetch');
    expect(() => getDefaultFetch()).toThrow('`fetch` is not defined as a global');
  });

  test('creates readable streams and reports unsupported runtimes', async () => {
    expect.assertions(4);

    const stream = makeReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([1]));
        controller.close();
      },
    });
    const reader = stream.getReader();
    expect(await reader.read()).toEqual({ done: false, value: new Uint8Array([1]) });
    expect(await reader.read()).toEqual({ done: true, value: undefined });
    expect(stream).toBeInstanceOf(ReadableStream);

    Reflect.deleteProperty(globalThis, 'ReadableStream');
    expect(() => makeReadableStream()).toThrow('`ReadableStream` is not defined as a global');
  });

  test('converts synchronous and asynchronous iterables to streams', async () => {
    expect.assertions(6);

    const syncReader = ReadableStreamFrom(['a', 'b']).getReader();
    expect(await syncReader.read()).toEqual({ done: false, value: 'a' });
    expect(await syncReader.read()).toEqual({ done: false, value: 'b' });
    expect(await syncReader.read()).toEqual({ done: true, value: undefined });

    async function* values(): AsyncGenerator<string> {
      yield 'c';
      yield 'd';
    }

    const asyncReader = ReadableStreamFrom(values()).getReader();
    expect(await asyncReader.read()).toEqual({ done: false, value: 'c' });
    expect(await asyncReader.read()).toEqual({ done: false, value: 'd' });
    expect(await asyncReader.read()).toEqual({ done: true, value: undefined });
  });

  test('adapts readers without native async iteration', async () => {
    expect.assertions(9);

    const nativeStream = new ReadableStream();
    expect(ReadableStreamToAsyncIterable(nativeStream)).toBe(nativeStream);

    let reads = 0;
    let releases = 0;
    const iterable = ReadableStreamToAsyncIterable<string>({
      getReader: () => ({
        read: async () => {
          reads += 1;
          return reads === 1 ? { done: false, value: 'value' } : { done: true, value: undefined };
        },
        cancel: async () => undefined,
        releaseLock: () => {
          releases += 1;
        },
      }),
    });

    expect(await iterable.next()).toEqual({ done: false, value: 'value' });
    expect(await iterable.next()).toEqual({ done: true, value: undefined });
    expect(releases).toBe(1);
    expect(iterable[Symbol.asyncIterator]()).toBe(iterable);

    const returned = await iterable.return?.();
    expect(returned).toEqual({ done: true, value: undefined });
    expect(releases).toBe(2);

    let errorReleaseCount = 0;
    const failing = ReadableStreamToAsyncIterable({
      getReader: () => ({
        read: async () => {
          throw new Error('read failed');
        },
        cancel: async () => undefined,
        releaseLock: () => {
          errorReleaseCount += 1;
        },
      }),
    });
    await expect(failing.next()).rejects.toThrow('read failed');
    expect(errorReleaseCount).toBe(1);
  });

  test('cancels supported stream shapes', async () => {
    expect.assertions(7);

    await expect(CancelReadableStream(null)).resolves.toBeUndefined();
    await expect(CancelReadableStream('value')).resolves.toBeUndefined();

    let iteratorReturns = 0;
    await expect(
      CancelReadableStream({
        [Symbol.asyncIterator]: () => ({
          next: async () => ({ done: true, value: undefined }),
          return: async () => {
            iteratorReturns += 1;
            return { done: true, value: undefined };
          },
        }),
      }),
    ).resolves.toBeUndefined();
    expect(iteratorReturns).toBe(1);

    let cancels = 0;
    let releases = 0;
    await expect(
      CancelReadableStream({
        getReader: () => ({
          cancel: async () => {
            cancels += 1;
          },
          releaseLock: () => {
            releases += 1;
          },
        }),
      }),
    ).resolves.toBeUndefined();
    expect(cancels).toBe(1);
    expect(releases).toBe(1);
  });
});
