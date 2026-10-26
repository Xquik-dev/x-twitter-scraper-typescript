// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { type RequestOptions } from './request-options';
import type { FilePropertyBag, Fetch } from './builtin-types';
import type { XTwitterScraper } from '../client';
import { byteChunks, isAsyncIterable, ReadableStreamFrom } from './shims';
import { runtime } from './runtime';
import { isReadonlyArray } from './utils/values';

export type BlobPart = string | ArrayBuffer | ArrayBufferView | Blob | DataView;
type FsReadStream = AsyncIterable<Uint8Array> & { path: string | { toString(): string } };

// https://github.com/oven-sh/bun/issues/5980
interface BunFile extends Blob {
  readonly name?: string | undefined;
}

export const checkFileSupport = () => {
  if (typeof File === 'undefined') {
    const node = runtime.process?.versions?.node;
    const isOldNode = typeof node === 'string' && parseInt(node.split('.')[0] ?? '', 10) < 20;
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

type FilePart = string | ArrayBuffer | Uint8Array<ArrayBuffer> | Blob;

function toFilePart(part: BlobPart): FilePart {
  if (typeof part === 'string' || part instanceof ArrayBuffer || part instanceof Blob) return part;
  const { buffer, byteOffset, byteLength } = part;
  if (buffer instanceof ArrayBuffer) return new Uint8Array(buffer, byteOffset, byteLength);
  return new Uint8Array(buffer, byteOffset, byteLength).slice();
}

export function makeFile(
  fileBits: BlobPart[],
  fileName: string | undefined,
  options?: FilePropertyBag,
): File {
  checkFileSupport();
  return new File(fileBits.map(toFilePart), fileName ?? 'unknown_file', options);
}

const nameFields = ['name', 'url', 'filename', 'path'] as const;

function nameSource(value: unknown): string {
  if (typeof value !== 'object' || value === null) return '';
  for (const key of nameFields) {
    const field: unknown = key in value ? Reflect.get(value, key) : undefined;
    if (field) return String(field);
  }
  return '';
}

export function getName(value: unknown): string | undefined {
  return nameSource(value).split(/[\\/]/).pop() || undefined;
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

async function readText(response: unknown): Promise<unknown> {
  if (typeof response !== 'object' || response === null || !('text' in response)) return undefined;
  const { text } = response;
  if (typeof text !== 'function') return undefined;
  const result: unknown = await text.call(response);
  return result;
}

function supportsFormData(fetchObject: XTwitterScraper | Fetch): Promise<boolean> {
  const fetch: Fetch = typeof fetchObject === 'function' ? fetchObject : fetchObject['fetch'];
  const cached = supportsFormDataMap.get(fetch);
  if (cached) return cached;
  const promise = (async () => {
    try {
      const FetchResponse = 'Response' in fetch ? fetch.Response : (await fetch('data:,')).constructor;
      const data = new FormData();
      const response: unknown =
        typeof FetchResponse === 'function' ? Reflect.construct(FetchResponse, [data]) : undefined;
      return data.toString() !== (await readText(response));
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
  const entries: [string, unknown][] = Object.entries(body || {});
  await Promise.all(entries.map(([key, value]) => addFormValue(form, key, value)));
  return form;
};

const isNamedBlob = (value: unknown) => value instanceof Blob && 'name' in value;

const isUploadable = (value: unknown) =>
  typeof value === 'object' &&
  value !== null &&
  (value instanceof Response || isAsyncIterable(value) || isNamedBlob(value));

const hasUploadableValue = (value: unknown): boolean => {
  if (isUploadable(value)) return true;
  if (isReadonlyArray(value)) return value.some(hasUploadableValue);
  if (value && typeof value === 'object') {
    const values: unknown[] = Object.values(value);
    return values.some(hasUploadableValue);
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
    form.append(key, makeFile([await new Response(ReadableStreamFrom(byteChunks(value))).blob()], getName(value)));
  } else if (isNamedBlob(value)) {
    form.append(key, value, getName(value));
  } else if (isReadonlyArray(value)) {
    await Promise.all(value.map((entry) => addFormValue(form, key, entry)));
  } else if (typeof value === 'object') {
    const entries: [string, unknown][] = Object.entries(value);
    await Promise.all(entries.map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
  } else {
    throw new TypeError(
      `Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`,
    );
  }
};

export { isAsyncIterable };
