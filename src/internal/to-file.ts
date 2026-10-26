// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { BlobPart, getName, makeFile, isAsyncIterable } from './uploads';
import type { FilePropertyBag } from './builtin-types';
import { checkFileSupport } from './uploads';

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
  name?: string | null | undefined,
  options?: FilePropertyBag | undefined,
): Promise<File> {
  checkFileSupport();

  value = await value;

  if (isFileLike(value)) {
    if (value instanceof File) {
      return value;
    }
    return makeFile([await value.arrayBuffer()], value.name);
  }

  if (isResponseLike(value)) {
    const blob = await value.blob();
    name ||= new URL(value.url).pathname.split(/[\\/]/).pop();

    return makeFile(await getBytes(blob), name, options);
  }

  const parts = await getBytes(value);

  name ||= getName(value);

  if (!options?.type) {
    const type = parts.find((part) => typeof part === 'object' && 'type' in part && part.type);
    if (typeof type === 'string') {
      options = { ...options, type };
    }
  }

  return makeFile(parts, name, options);
}

async function getBytes(value: unknown): Promise<Array<BlobPart>> {
  let parts: Array<BlobPart> = [];
  if (typeof value === 'string' || ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
    parts.push(value);
  } else if (isBlobLike(value)) {
    parts.push(value instanceof Blob ? value : await value.arrayBuffer());
  } else if (isAsyncIterable(value)) {
    for await (const chunk of value) {
      parts.push(...(await getBytes(chunk)));
    }
  } else {
    const constructor = typeof value === 'object' && value !== null ? value.constructor?.name : undefined;
    throw new Error(
      `Unexpected data type: ${typeof value}${
        constructor ? `; constructor: ${constructor}` : ''
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
