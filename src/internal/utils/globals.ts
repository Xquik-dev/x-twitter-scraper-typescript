// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

export const readGlobal = (name: string): unknown => Reflect.get(globalThis, name);

export const readProperty = (value: unknown, key: PropertyKey): unknown =>
  (typeof value === 'object' && value !== null) || typeof value === 'function' ?
    Reflect.get(value, key)
  : undefined;

export const readString = (value: unknown, key: PropertyKey): string | undefined => {
  const property = readProperty(value, key);
  return typeof property === 'string' ? property : undefined;
};

const plainObject = {};

export const objectTag = (value: unknown): string => plainObject.toString.call(value);
