// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

export const asyncValues = <T>(values: ReadonlyArray<T>): AsyncIterableIterator<T, undefined, undefined> => {
  const iterator = values[Symbol.iterator]();
  const asyncIterator: AsyncIterableIterator<T, undefined, undefined> = {
    next: () => Promise.resolve(iterator.next()),
    [Symbol.asyncIterator]: () => asyncIterator,
  };
  return asyncIterator;
};
