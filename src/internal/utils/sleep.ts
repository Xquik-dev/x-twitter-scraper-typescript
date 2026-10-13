// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
