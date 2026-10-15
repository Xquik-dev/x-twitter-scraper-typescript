// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const {
  CheckError,
  comparable,
  httpMethods,
  readBasePath,
  readConfiguredSpec,
  readExclusions,
  readGroups,
  runCheck,
  specOperations,
} = require('./api-spec.cjs');
const { compareOperation } = require('./shapes.cjs');
const { SpecShapes } = require('./spec-shapes.cjs');
const { sdkShapes } = require('./sdk-shapes.cjs');

const root = path.resolve(process.argv[2] ?? path.join(__dirname, '..', '..'));
const acceptedFile = 'accepted-field-differences.json';
const differencePattern = new RegExp(
  `^(${httpMethods.join('|').toUpperCase()}) /\\S* (request|response) (missing|extra|enum|required|nullable) \\S+$`,
);

const fields = async () => {
  const accepted = readGroups(root, acceptedFile, {
    field: 'differences',
    noun: 'difference',
    entryPattern: differencePattern,
    entryHint:
      'needs a method, a path, request or response, a kind and a field, such as GET /api/v1/events response missing events[].data.followedAt',
    key: comparable,
  });
  const excluded = new Set(readExclusions(root).map(comparable));
  const spec = await readConfiguredSpec();
  const sdk = sdkShapes(root, readBasePath(root));
  const shapes = new SpecShapes(spec);

  const operations = specOperations(spec).filter(({ key }) => !excluded.has(key));
  const unread = operations.filter(({ key }) => !sdk.ops[key]);
  if (unread.length) {
    throw new CheckError(
      [
        ...unread.map(({ id }) => `${id} has no SDK method the field check can read.`),
        'Write each operation above as a class method that calls this._client, or list it in excluded-operations.json.',
      ].join('\n'),
    );
  }

  const found = operations.flatMap(({ id, key, pathItem, operation }) =>
    compareOperation(shapes.operation(pathItem, operation), sdk.ops[key], sdk.defs).map(
      ({ side, kind, path: field }) => `${id} ${side} ${kind} ${field}`,
    ),
  );
  const acceptedKeys = new Set(accepted.map(comparable));
  const foundKeys = new Set(found.map(comparable));
  const differences = found.filter((difference) => !acceptedKeys.has(comparable(difference)));
  const stale = accepted
    .filter((difference) => !foundKeys.has(comparable(difference)))
    .map((difference) => `${acceptedFile} lists ${difference}, which the check no longer finds. Remove it.`);
  if (differences.length || stale.length) {
    const next =
      differences.length ?
        `Fix each field above in the SDK, or list it in ${acceptedFile} with a reason.`
      : `Remove each difference above from ${acceptedFile}.`;
    throw new CheckError([...differences, ...stale, next].join('\n'));
  }
  const count = accepted.length;
  const plural = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;
  return `The SDK's fields match the API for ${plural(operations.length, 'operation')}, and ${acceptedFile} lists ${plural(count, 'accepted difference')}.`;
};

runCheck(fields);
