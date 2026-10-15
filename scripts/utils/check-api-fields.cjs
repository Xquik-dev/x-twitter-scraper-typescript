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
  readGroups,
  runCheck,
  specOperations,
} = require('./api-spec.cjs');
const { SpecShapes, compareOperation } = require('./api-shapes.cjs');
const { sdkShapes } = require('./sdk-shapes.cjs');

const root = path.resolve(process.argv[2] ?? path.join(__dirname, '..', '..'));
const acceptedFile = 'accepted-field-differences.json';
const differencePattern = new RegExp(
  `^(${httpMethods.join('|').toUpperCase()}) /\\S* (request|response) (missing|extra|enum|required|nullable) \\S+$`,
);

const fields = async () => {
  const accepted = readGroups(root, acceptedFile, {
    field: 'differences',
    entryPattern: differencePattern,
    entryHint:
      'needs a method, a path, request or response, a kind and a field, such as GET /api/v1/events response missing events[].data.followedAt',
    key: comparable,
  });
  const spec = await readConfiguredSpec();
  const sdk = sdkShapes(root, readBasePath(root));
  const shapes = new SpecShapes(spec);

  const found = [];
  let compared = 0;
  for (const { id, key, pathItem, operation } of specOperations(spec)) {
    const sdkOp = sdk.ops[key];
    if (!sdkOp) continue;
    compared += 1;
    for (const { side, kind, path: field } of compareOperation(
      shapes.operation(pathItem, operation),
      sdkOp,
      sdk.defs,
    )) {
      found.push(`${id} ${side} ${kind} ${field}`);
    }
  }

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
  return `The SDK's fields match the API for ${compared} operations, and ${acceptedFile} lists ${count} accepted difference${count === 1 ? '' : 's'}.`;
};

runCheck(fields);
