const nativeFetch = globalThis.fetch;
const mockOrigin = 'http://127.0.0.1:4010';

function abortedRequestError(): DOMException {
  return new DOMException('This operation was aborted', 'AbortError');
}

async function resourceMockFetch(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
): Promise<Response> {
  const request = new Request(input, init);
  const url = new URL(request.url);
  if (url.origin !== mockOrigin) {
    return nativeFetch(input, init);
  }
  if (request.signal.aborted) {
    throw abortedRequestError();
  }
  if (url.pathname === '/_stainless_unknown_path') {
    return Response.json({ error: { message: 'Not found', type: 'not_found' } }, { status: 404 });
  }
  return Response.json({});
}

globalThis.fetch = resourceMockFetch;
