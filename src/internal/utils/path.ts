// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { XTwitterScraperError } from '../../core/error';
import { objectTag, readProperty } from './globals';
import { isPresent } from './values';

/**
 * Percent-encode everything that isn't safe to have in a path without encoding safe chars.
 *
 * Taken from https://datatracker.ietf.org/doc/html/rfc3986#section-3.3:
 * > unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
 * > sub-delims  = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
 * > pchar       = unreserved / pct-encoded / sub-delims / ":" / "@"
 */
export function encodeURIPath(str: string) {
  return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}

const realmObjectToString = (value: object): unknown => {
  const hasOwnProperty = readProperty(value, 'hasOwnProperty');
  if (typeof hasOwnProperty !== 'function') return undefined;
  const functionPrototype = Reflect.getPrototypeOf(hasOwnProperty);
  return readProperty(
    functionPrototype === null ? null : Reflect.getPrototypeOf(functionPrototype),
    'toString',
  );
};

export const createPathTagFunction = (pathEncoder = encodeURIPath) =>
  function path(statics: readonly string[], ...params: readonly unknown[]): string {
    if (statics.length === 1) return statics[0] ?? '';

    let postPath = false;
    const invalidSegments: { start: number; length: number; error: string }[] = [];
    const path = statics.reduce((previousValue, currentValue, index) => {
      if (/[?#]/.test(currentValue)) {
        postPath = true;
      }
      const value = params[index];
      let encoded = (postPath ? encodeURIComponent : pathEncoder)(String(value));
      if (
        index !== params.length &&
        (!isPresent(value) ||
          (typeof value === 'object' && readProperty(value, 'toString') === realmObjectToString(value)))
      ) {
        encoded = isPresent(value) ? objectTag(value) : String(value);
        invalidSegments.push({
          start: previousValue.length + currentValue.length,
          length: encoded.length,
          error: `Value of type ${objectTag(value).slice(8, -1)} is not a valid path parameter`,
        });
      }
      return previousValue + currentValue + (index === params.length ? '' : encoded);
    }, '');

    const [pathOnly = ''] = path.split(/[?#]/, 1);
    const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
    let match: RegExpExecArray | null;

    while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) {
      invalidSegments.push({
        start: match.index,
        length: match[0].length,
        error: `Value "${match[0]}" can't be safely passed as a path parameter`,
      });
    }

    invalidSegments.sort((a, b) => a.start - b.start);

    if (invalidSegments.length > 0) {
      let lastEnd = 0;
      const underline = invalidSegments.reduce((acc, segment) => {
        const spaces = ' '.repeat(segment.start - lastEnd);
        const arrows = '^'.repeat(segment.length);
        lastEnd = segment.start + segment.length;
        return acc + spaces + arrows;
      }, '');

      throw new XTwitterScraperError(
        `Path parameters result in path with invalid segments:\n${invalidSegments
          .map((e) => e.error)
          .join('\n')}\n${path}\n${underline}`,
      );
    }

    return path;
  };

export const path = /* @__PURE__ */ createPathTagFunction(encodeURIPath);
