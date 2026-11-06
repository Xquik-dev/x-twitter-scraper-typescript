// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const valueAt = (value: unknown, path: ReadonlyArray<string>): unknown =>
  path.reduce<unknown>((current, key) => (isRecord(current) ? current[key] : undefined), value);

export const stringAt = (value: unknown, path: ReadonlyArray<string>): string => {
  const found = valueAt(value, path);
  if (typeof found !== 'string') throw new TypeError(`Expected a string at ${path.join('.')}`);
  return found;
};

export const withValueAt = (value: unknown, path: ReadonlyArray<string>, replacement: unknown): unknown => {
  const [key, ...rest] = path;
  if (key === undefined) return replacement;
  if (!isRecord(value)) throw new TypeError(`Expected an object at ${key}`);
  return { ...value, [key]: withValueAt(value[key], rest, replacement) };
};
