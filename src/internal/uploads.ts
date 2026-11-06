// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type { RequestOptions } from './request-options';
import type { FilePropertyBag, Fetch } from './builtin-types';
import type { XTwitterScraper } from '../client';
import { isAsyncIterable, ReadableStreamFrom, uint8ArrayChunks } from './shims';
import { readGlobal, readProperty, readString } from './utils/globals';

export type BlobPart = string | ArrayBuffer | Uint8Array<ArrayBuffer> | Blob;
type FsReadStream = AsyncIterable<Uint8Array> & { path: string | { toString(): string } };

// https://github.com/oven-sh/bun/issues/5980
interface BunFile extends Blob {
  readonly name?: string | undefined;
}

export const checkFileSupport = () => {
  if (typeof File === 'undefined') {
    const nodeVersion = readString(readProperty(readGlobal('process'), 'versions'), 'node');
    const isOldNode = nodeVersion !== undefined && parseInt(nodeVersion, 10) < 20;
    throw new Error(
      '`File` is not defined as a global, which is required for file uploads.' +
        (isOldNode ?
          " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`."
        : ''),
    );
  }
};

/**
 * Typically, this is a native "File" class.
 *
 * We provide the {@link toFile} utility to convert a variety of objects
 * into the File class.
 *
 * For convenience, you can also pass a fetch Response, or in Node,
 * the result of fs.createReadStream().
 */
export type Uploadable = File | Response | FsReadStream | BunFile;

export function makeFile(
  fileBits: BlobPart[],
  fileName: string | undefined,
  options?: FilePropertyBag,
): File {
  checkFileSupport();
  return new File(fileBits, fileName ?? 'unknown_file', options);
}

export function getName(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  for (const key of ['name', 'url', 'filename', 'path']) {
    const field = readProperty(value, key);
    if (field) return String(field).split(/[\\/]/).pop() || undefined;
  }
  return undefined;
}

export const maybeMultipartFormRequestOptions = async (
  opts: RequestOptions,
  fetch: XTwitterScraper | Fetch,
): Promise<RequestOptions> => {
  if (!hasUploadableValue(opts.body)) return opts;

  return { ...opts, body: await createForm(opts.body, fetch) };
};

type MultipartFormRequestOptions = Omit<RequestOptions, 'body'> & { body: unknown };

export const multipartFormRequestOptions = async (
  opts: MultipartFormRequestOptions,
  fetch: XTwitterScraper | Fetch,
): Promise<RequestOptions> => {
  return { ...opts, body: await createForm(opts.body, fetch) };
};

const supportsFormDataMap = /* @__PURE__ */ new WeakMap<Fetch, Promise<boolean>>();

const isFetch = (value: unknown): value is Fetch => typeof value === 'function';

const isResponseClass = (value: unknown): value is typeof Response => typeof value === 'function';

function fetchOf(fetchObject: XTwitterScraper | Fetch): Fetch {
  if (isFetch(fetchObject)) return fetchObject;
  const clientFetch: unknown = Reflect.get(fetchObject, 'fetch');
  if (isFetch(clientFetch)) return clientFetch;
  throw new TypeError('The client has no fetch function to send file uploads with.');
}

function supportsFormData(fetchObject: XTwitterScraper | Fetch): Promise<boolean> {
  const fetch = fetchOf(fetchObject);
  const cached = supportsFormDataMap.get(fetch);
  if (cached) return cached;
  const promise = (async () => {
    try {
      const FetchResponse = 'Response' in fetch ? fetch.Response : (await fetch('data:,')).constructor;
      if (!isResponseClass(FetchResponse)) return true;
      const data = new FormData();
      if (data.toString() === (await new FetchResponse(data).text())) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  })();
  supportsFormDataMap.set(fetch, promise);
  return promise;
}

export const createForm = async <T = Record<string, unknown>>(
  body: T | undefined,
  fetch: XTwitterScraper | Fetch,
): Promise<FormData> => {
  if (!(await supportsFormData(fetch))) {
    throw new TypeError(
      'The provided fetch function does not support file uploads with the current global FormData class.',
    );
  }
  const form = new FormData();
  await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
  return form;
};

const isNamedBlob = (value: unknown) => value instanceof Blob && 'name' in value;

const isUploadable = (value: unknown) =>
  typeof value === 'object' &&
  value !== null &&
  (value instanceof Response || isAsyncIterable(value) || isNamedBlob(value));

const hasUploadableValue = (value: unknown): boolean => {
  if (isUploadable(value)) return true;
  if (Array.isArray(value)) return value.some(hasUploadableValue);
  if (value && typeof value === 'object') {
    for (const k in value) {
      if (hasUploadableValue(readProperty(value, k))) return true;
    }
  }
  return false;
};

const addFormValue = async (form: FormData, key: string, value: unknown): Promise<void> => {
  if (value === undefined) return;
  if (value == null) {
    throw new TypeError(
      `Received null for "${key}"; to pass null in FormData, you must use the string 'null'`,
    );
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    form.append(key, String(value));
  } else if (value instanceof Response) {
    form.append(key, makeFile([await value.blob()], getName(value)));
  } else if (isAsyncIterable(value)) {
    form.append(
      key,
      makeFile([await new Response(ReadableStreamFrom(uint8ArrayChunks(value))).blob()], getName(value)),
    );
  } else if (isNamedBlob(value)) {
    form.append(key, value, getName(value));
  } else if (Array.isArray(value)) {
    await Promise.all(value.map((entry) => addFormValue(form, key, entry)));
  } else if (typeof value === 'object') {
    await Promise.all(
      Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)),
    );
  } else {
    throw new TypeError(
      `Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`,
    );
  }
};
