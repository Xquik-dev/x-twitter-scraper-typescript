// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

export const formFile = (entry: ReturnType<FormData['get']>): File => {
  if (entry instanceof File) return entry;
  throw new Error(`Expected a File in the form but got ${typeof entry}`);
};
