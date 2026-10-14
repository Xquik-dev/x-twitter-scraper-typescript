// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

type NeverToAny<T> = T extends never ? any : T;

/** @ts-ignore */
type _DOMReadableStream<R = any> = globalThis.ReadableStream<R>;

/** @ts-ignore */
type _NodeReadableStream<R = any> = import('stream/web').ReadableStream<R>;

type _ConditionalNodeReadableStream<R = any> =
  typeof globalThis extends { ReadableStream: any } ? never : _NodeReadableStream<R>;

type _ReadableStream<R = any> = NeverToAny<
  | ([0] extends [1 & _DOMReadableStream<R>] ? never : _DOMReadableStream<R>)
  | ([0] extends [1 & _ConditionalNodeReadableStream<R>] ? never : _ConditionalNodeReadableStream<R>)
>;

export type { _ReadableStream as ReadableStream };
