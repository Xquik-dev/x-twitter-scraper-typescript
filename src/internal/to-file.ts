// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { type BlobPart, getName, makeFile } from './uploads';
import { isAsyncIterable } from './shims';
import type { FilePropertyBag } from './builtin-types';
import { checkFileSupport } from './uploads';
import { readProperty, readString } from './utils/globals';
import { arrayBufferBytes } from './utils/bytes';
import { isNonEmptyString, isPresent } from './utils/values';

type BlobLikePart = string | ArrayBuffer | ArrayBufferView | BlobLike | DataView;

interface BlobLike {
  readonly size: number;
  readonly type: string;
  text(): Promise<string>;
  slice(start?: number, end?: number): BlobLike;
}

const isBlobLike = (value: unknown): value is BlobLike & { arrayBuffer(): Promise<ArrayBuffer> } =>
  typeof value === 'object' &&
  value !== null &&
  'size' in value &&
  typeof value.size === 'number' &&
  'type' in value &&
  typeof value.type === 'string' &&
  'text' in value &&
  typeof value.text === 'function' &&
  'slice' in value &&
  typeof value.slice === 'function' &&
  'arrayBuffer' in value &&
  typeof value.arrayBuffer === 'function';

interface FileLike extends BlobLike {
  readonly lastModified: number;
  readonly name?: string | undefined;
}

const isFileLike = (value: unknown): value is FileLike & { arrayBuffer(): Promise<ArrayBuffer> } =>
  typeof value === 'object' &&
  value !== null &&
  'name' in value &&
  typeof value.name === 'string' &&
  'lastModified' in value &&
  typeof value.lastModified === 'number' &&
  isBlobLike(value);

export interface ResponseLike {
  url: string;
  blob(): Promise<BlobLike>;
}

const isResponseLike = (value: unknown): value is ResponseLike =>
  typeof value === 'object' &&
  value !== null &&
  'url' in value &&
  typeof value.url === 'string' &&
  'blob' in value &&
  typeof value.blob === 'function';

export type ToFileInput =
  FileLike | ResponseLike | Exclude<BlobLikePart, string> | AsyncIterable<BlobLikePart>;

/**
 * Helper for creating a {@link File} to pass to an SDK upload method from a variety of different data formats
 * @param value the raw content of the file. Can be an {@link Uploadable}, BlobLikePart, or AsyncIterable of BlobLikeParts
 * @param {string=} name the name of the file. If omitted, toFile will try to determine a file name from bits if possible
 * @param {Object=} options additional properties
 * @param {string=} options.type the MIME type of the content
 * @param {number=} options.lastModified the last modified timestamp
 * @returns a {@link File} with the given properties
 */
export async function toFile(
  value: ToFileInput | PromiseLike<ToFileInput>,
  name?: string | null,
  options?: FilePropertyBag,
): Promise<File> {
  checkFileSupport();

  const input = await value;

  if (isFileLike(input)) {
    if (input instanceof File) {
      return input;
    }
    return makeFile([await input.arrayBuffer()], input.name);
  }

  if (isResponseLike(input)) {
    const blob = await input.blob();
    const fileName = isNonEmptyString(name) ? name : new URL(input.url).pathname.split(/[\\/]/).pop();

    return makeFile(await getBytes(blob), fileName, options);
  }

  const parts = await getBytes(input);

  return makeFile(parts, isNonEmptyString(name) ? name : getName(input), options);
}

async function getBytes(value: unknown): Promise<Array<BlobPart>> {
  const parts: Array<BlobPart> = [];
  if (typeof value === 'string' || value instanceof ArrayBuffer) {
    parts.push(value);
  } else if (ArrayBuffer.isView(value)) {
    parts.push(arrayBufferBytes(value));
  } else if (isBlobLike(value)) {
    parts.push(value instanceof Blob ? value : await value.arrayBuffer());
  } else if (isAsyncIterable(value)) {
    for await (const chunk of value) {
      parts.push(...(await getBytes(chunk)));
    }
  } else {
    const constructor =
      !isPresent(value) ? undefined : readString(readProperty(Object(value), 'constructor'), 'name');
    throw new Error(
      `Unexpected data type: ${typeof value}${
        isNonEmptyString(constructor) ? `; constructor: ${constructor}` : ''
      }${propsForError(value)}`,
    );
  }

  return parts;
}

function propsForError(value: unknown): string {
  if (typeof value !== 'object' || value === null) return '';
  const props = Object.getOwnPropertyNames(value);
  return `; props: [${props.map((p) => `"${p}"`).join(', ')}]`;
}
