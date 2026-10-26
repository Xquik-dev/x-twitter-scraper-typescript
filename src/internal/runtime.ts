// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

type RuntimeProcess = {
  readonly env?: Readonly<Record<string, string | undefined>> | undefined;
  readonly version?: string | undefined;
  readonly versions?: { readonly node?: string | undefined } | undefined;
  readonly platform?: string | undefined;
  readonly arch?: string | undefined;
};

type RuntimeDeno = {
  readonly env?: { readonly get?: ((name: string) => string | undefined) | undefined } | undefined;
  readonly build?: { readonly os: string; readonly arch: string } | undefined;
  readonly version?: string | { readonly deno?: string | undefined } | undefined;
};

type RuntimeCrypto = {
  readonly randomUUID?: (() => string) | undefined;
  getRandomValues(array: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer>;
};

type RuntimeBuffer = {
  from(data: Uint8Array): Uint8Array & { toString(encoding: 'base64'): string };
  from(data: string, encoding: 'base64'): Uint8Array;
};

type RuntimeGlobals = {
  readonly process?: RuntimeProcess | undefined;
  readonly Deno?: RuntimeDeno | undefined;
  readonly EdgeRuntime?: unknown;
  readonly window?: { readonly document?: unknown } | undefined;
  readonly navigator?: { readonly userAgent?: string | undefined; readonly product?: string | undefined } | undefined;
  readonly crypto?: RuntimeCrypto | undefined;
  readonly Buffer?: RuntimeBuffer | undefined;
  readonly TextEncoder?: (new () => { encode(input: string): Uint8Array }) | undefined;
  readonly TextDecoder?: (new () => { decode(input: Uint8Array): string }) | undefined;
  readonly ReadableStream?: typeof globalThis.ReadableStream | undefined;
  readonly Blob?: typeof globalThis.Blob | undefined;
};

export const runtime: RuntimeGlobals = globalThis;

export const isReadableStream = (value: unknown): value is globalThis.ReadableStream<unknown> =>
  runtime.ReadableStream !== undefined && value instanceof runtime.ReadableStream;
