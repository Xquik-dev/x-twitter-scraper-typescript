// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

export type PromiseOrValue<T> = T | Promise<T>;
export type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type FinalizedRequestInit = RequestInit & { headers: Headers };

type NotAny<T> = [0] extends [1 & T] ? never : T;

type OverloadedParameters<T> =
  T extends (
    {
      (...args: infer A): unknown;
      (...args: infer B): unknown;
      (...args: infer C): unknown;
      (...args: infer D): unknown;
    }
  ) ?
    A | B | C | D
  : T extends (
    {
      (...args: infer A): unknown;
      (...args: infer B): unknown;
      (...args: infer C): unknown;
    }
  ) ?
    A | B | C
  : T extends (
    {
      (...args: infer A): unknown;
      (...args: infer B): unknown;
    }
  ) ?
    A | B
  : T extends (...args: infer A) => unknown ? A
  : never;

/** @ts-ignore For users with \@types/bun */
type BunRequestInit = globalThis.FetchRequestInit;
/** @ts-ignore For users who use Deno */
type FetchRequestInit = NonNullable<OverloadedParameters<typeof fetch>[1]>;

type RequestInits = NotAny<BunRequestInit> | NotAny<RequestInit> | NotAny<FetchRequestInit>;

export type MergedRequestInit = RequestInits &
  Partial<Record<'body' | 'headers' | 'method' | 'signal', never>>;
