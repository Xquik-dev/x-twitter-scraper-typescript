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

type FetchRequestInit = NonNullable<OverloadedParameters<typeof fetch>[1]>;

export type MergedRequestInit = NotAny<FetchRequestInit> &
  Partial<Record<'body' | 'headers' | 'method' | 'signal', never>>;
