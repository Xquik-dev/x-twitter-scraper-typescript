// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

export type Fetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

type _RequestInit = RequestInit;

type _Response = Response;

type _RequestInfo = Request | URL | string;

type _HeadersInit = RequestInit['headers'];

type _BodyInit = RequestInit['body'];

type _Array<T> = Array<T>;

type _Record<K extends keyof any, T> = Record<K, T>;

export type {
  _Array as Array,
  _BodyInit as BodyInit,
  _HeadersInit as HeadersInit,
  _Record as Record,
  _RequestInfo as RequestInfo,
  _RequestInit as RequestInit,
  _Response as Response,
};

type EndingType = 'native' | 'transparent';

/**
 * A copy of the builtin `BlobPropertyBag` type as it isn't fully supported in certain
 * environments and attempting to reference the global version will error.
 *
 * https://github.com/microsoft/TypeScript/blob/49ad1a3917a0ea57f5ff248159256e12bb1cb705/src/lib/dom.generated.d.ts#L154
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob#options
 */
export interface BlobPropertyBag {
  endings?: EndingType;
  type?: string;
}

/**
 * A copy of the builtin `FilePropertyBag` type as it isn't fully supported in certain
 * environments and attempting to reference the global version will error.
 *
 * https://github.com/microsoft/TypeScript/blob/49ad1a3917a0ea57f5ff248159256e12bb1cb705/src/lib/dom.generated.d.ts#L503
 * https://developer.mozilla.org/en-US/docs/Web/API/File/File#options
 */
export interface FilePropertyBag extends BlobPropertyBag {
  lastModified?: number;
}
