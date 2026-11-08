// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

/** @type {(value: import('./types').JsonValue | undefined) => import('./types').JsonObject | undefined} */
const asObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? value : undefined;

module.exports = { asObject };
