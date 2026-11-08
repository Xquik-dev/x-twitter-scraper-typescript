// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

/** @type {(value: import('./types').JsonValue | undefined) => import('./types').JsonObject | undefined} */
const asObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? value : undefined;

/**
 * @param {unknown} value
 * @returns {value is import('./types').JsonValue}
 */
function isJsonValue(value) {
  if (
    value === null ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string'
  ) {
    return true;
  }
  if (Array.isArray(value)) return value.every(isJsonValue);
  return typeof value === 'object' && Object.values(value).every(isJsonValue);
}

/** @type {(text: string) => import('./types').JsonValue} */
const parseJson = (text) => {
  /** @type {unknown} */
  const value = JSON.parse(text);
  if (!isJsonValue(value)) throw new TypeError('JSON.parse returned a value that is not JSON');
  return value;
};

module.exports = { asObject, parseJson };
