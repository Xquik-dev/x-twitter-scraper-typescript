// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import assert from 'node:assert/strict';
import fc from 'fast-check';
import { stringifyQuery } from 'x-twitter-scraper/internal/utils/query';

const FUZZ_RUNS = 250;
const primitiveQueryValue = fc.oneof(
  fc.string(),
  fc.integer(),
  fc.double({ noNaN: true, noDefaultInfinity: true }),
  fc.boolean(),
  fc.constant(null),
  fc.constant(undefined),
);

describe('stringifyQuery fuzz properties', () => {
  it('round-trips arbitrary primitive query entries', () => {
    expect.assertions(1);
    let completedRuns = 0;

    fc.assert(
      fc.property(fc.dictionary(fc.string(), primitiveQueryValue, { maxKeys: 32 }), (query) => {
        const actual = [...new URLSearchParams(stringifyQuery(query)).entries()];
        const expected = Object.entries(query)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, value === null ? '' : String(value)]);

        assert.equal(JSON.stringify(actual), JSON.stringify(expected));
        completedRuns += 1;
      }),
      { numRuns: FUZZ_RUNS },
    );

    expect(completedRuns).toBe(FUZZ_RUNS);
  });

  it('rejects arbitrary nested query values', () => {
    expect.assertions(1);
    let completedRuns = 0;
    const nestedValue = fc.oneof(
      fc.array(fc.jsonValue(), { maxLength: 16 }),
      fc.dictionary(fc.string(), fc.jsonValue(), { maxKeys: 16 }),
    );

    fc.assert(
      fc.property(nestedValue, (value) => {
        assert.throws(
          () => stringifyQuery({ value }),
          /Cannot stringify type object; Expected string, number, boolean, or null/u,
        );
        completedRuns += 1;
      }),
      { numRuns: FUZZ_RUNS },
    );

    expect(completedRuns).toBe(FUZZ_RUNS);
  });
});
