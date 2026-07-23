import { runInNewContext } from 'node:vm';

import {
  APIConnectionError,
  APIConnectionTimeoutError,
  APIError,
  APIUserAbortError,
  AuthenticationError,
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  PermissionDeniedError,
  RateLimitError,
  UnprocessableEntityError,
} from 'x-twitter-scraper/core/error';
import { castToError, isAbortError } from 'x-twitter-scraper/internal/errors';

describe('runtime errors', () => {
  test('detects supported abort errors', () => {
    expect.assertions(6);

    expect(isAbortError(new DOMException('aborted', 'AbortError'))).toBe(true);
    expect(isAbortError({ name: 'AbortError' })).toBe(true);
    expect(isAbortError({ message: 'FetchRequestCanceledException: aborted' })).toBe(true);
    expect(isAbortError({ name: 'OtherError', message: 'failed' })).toBe(false);
    expect(isAbortError(null)).toBe(false);
    expect(isAbortError('AbortError')).toBe(false);
  });

  test('normalizes local, cross-realm, and non-error values', () => {
    expect.assertions(9);

    const local = new Error('local');
    const remote = runInNewContext(
      "Object.assign(new Error('remote'), { name: 'RemoteError', cause: new Error('cause') })",
    ) as Error & { cause: Error };
    const cyclic: Record<string, unknown> = {};
    cyclic['self'] = cyclic;

    expect(castToError(local)).toBe(local);

    const normalizedRemote = castToError(remote);
    expect(normalizedRemote).not.toBe(remote);
    expect(normalizedRemote.message).toBe('remote');
    expect(normalizedRemote.name).toBe('RemoteError');
    expect((normalizedRemote as Error & { cause?: Error }).cause?.message).toBe('cause');

    expect(castToError({ code: 'bad' }).message).toBe('{"code":"bad"}');
    expect(castToError(cyclic).message).toBe('[object Object]');
    expect(castToError('failure').message).toBe('failure');
    expect(castToError(42).message).toBe('42');
  });
});

describe('API errors', () => {
  test('maps HTTP statuses to typed errors', () => {
    expect.assertions(18);

    const headers = new Headers();
    const cases = [
      [400, BadRequestError],
      [401, AuthenticationError],
      [403, PermissionDeniedError],
      [404, NotFoundError],
      [409, ConflictError],
      [422, UnprocessableEntityError],
      [429, RateLimitError],
      [500, InternalServerError],
      [418, APIError],
    ] as const;

    for (const [status, ErrorClass] of cases) {
      const error = APIError.generate(status, { message: 'failure' }, undefined, headers);
      expect(error).toBeInstanceOf(ErrorClass);
      expect(error.status).toBe(status);
    }
  });

  test('builds useful messages for every response shape', () => {
    expect.assertions(6);

    const headers = new Headers();
    expect(new APIError(400, { message: 'bad' }, undefined, headers).message).toBe('400 bad');
    expect(new APIError(400, { message: { detail: 'bad' } }, undefined, headers).message).toBe(
      '400 {"detail":"bad"}',
    );
    expect(new APIError(400, { code: 'bad' }, undefined, headers).message).toBe('400 {"code":"bad"}');
    expect(new APIError(400, undefined, undefined, headers).message).toBe('400 status code (no body)');
    expect(new APIError(undefined, undefined, 'failure', undefined).message).toBe('failure');
    expect(new APIError(undefined, undefined, undefined, undefined).message).toBe('(no status code or body)');
  });

  test('creates connection and cancellation errors', () => {
    expect.assertions(10);

    const generated = APIError.generate(undefined, { reason: 'offline' }, 'request failed', undefined);
    expect(generated).toBeInstanceOf(APIConnectionError);
    expect((generated as APIConnectionError & { cause?: Error }).cause?.message).toBe('{"reason":"offline"}');

    expect(new APIUserAbortError().message).toBe('Request was aborted.');
    expect(new APIUserAbortError({ message: 'stopped' }).message).toBe('stopped');

    const cause = new Error('offline');
    const connection = new APIConnectionError({ cause });
    expect(connection.message).toBe('Connection error.');
    expect((connection as APIConnectionError & { cause?: Error }).cause).toBe(cause);
    expect(new APIConnectionError({ message: 'network failed' }).message).toBe('network failed');

    expect(new APIConnectionTimeoutError().message).toBe('Request timed out.');
    expect(new APIConnectionTimeoutError({ message: 'slow' }).message).toBe('slow');
    expect(new APIConnectionError({})).toBeInstanceOf(APIError);
  });
});
