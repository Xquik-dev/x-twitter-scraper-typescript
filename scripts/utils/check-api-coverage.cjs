// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
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

const root = path.resolve(process.argv[2] ?? path.join(__dirname, '..', '..'));
const exclusionsFile = 'excluded-operations.json';
const operationPattern = new RegExp(`^(${httpMethods.join('|').toUpperCase()}) (/\\S*)$`);
const clientMember = /this\._client\s*(?:\?\.|\.|\[)/g;
const requestCall =
  /this\._client\.(get|post|put|patch|delete)\(\s*(?:'([^'\\]*)'|path`((?:[^`$\\]|\$\{[^{}`]*\})*)`)\s*[,)]/y;
const blockComment = /\/\*[\s\S]*?\*\//g;

const withoutBlockComments = (source) =>
  source.replace(blockComment, (comment) => comment.replace(/[^\n]/g, ''));

const sourceFiles = (directory) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(file);
      return entry.name.endsWith('.ts') ? [file] : [];
    });

const sdkOperations = () => {
  const basePath = readBasePath(root);
  return sourceFiles(path.join(root, 'src', 'resources')).flatMap((file) => {
    const source = withoutBlockComments(fs.readFileSync(file, 'utf8'));
    return [...source.matchAll(clientMember)].map(({ index }) => {
      requestCall.lastIndex = index;
      const call = requestCall.exec(source);
      if (!call) {
        const line = source.slice(0, index).split('\n').length;
        throw new CheckError(
          `Could not read the method or path of the request at ${path.relative(root, file)} line ${line}. Write it as this._client.get('/path') or this._client.get(path\`/path/\${id}\`).`,
        );
      }
      const requestPath = call[2] ?? call[3].replace(/\$\{[^{}`]*\}/g, '{}');
      return `${call[1].toUpperCase()} ${basePath}${requestPath}`;
    });
  });
};

const coverage = async () => {
  const exclusions = readGroups(root, exclusionsFile, {
    field: 'operations',
    entryPattern: operationPattern,
    entryHint: 'needs an upper case method and a path, such as GET /api/v1/x/trends',
    key: comparable,
  });
  const sdk = new Set(sdkOperations().map(comparable));
  const operations = specOperations(await readConfiguredSpec());
  const inSpec = new Set(operations.map(({ key }) => key));
  const excluded = new Set(exclusions.map(comparable));

  const missing = operations
    .filter(({ key }) => !sdk.has(key) && !excluded.has(key))
    .map(
      ({ id, operationId }) =>
        `${id}${operationId ? ` (${operationId})` : ''} is in the API but not in the SDK.`,
    );
  const stale = exclusions.flatMap((operation) => {
    if (!inSpec.has(comparable(operation))) {
      return [`${exclusionsFile} lists ${operation}, which the API no longer has. Remove it.`];
    }
    if (sdk.has(comparable(operation))) {
      return [`${exclusionsFile} lists ${operation}, which the SDK already implements. Remove it.`];
    }
    return [];
  });

  if (missing.length || stale.length) {
    const next =
      missing.length ?
        `Add each operation above to the SDK, or list it in ${exclusionsFile} with a reason.`
      : `Remove each operation above from ${exclusionsFile}.`;
    throw new CheckError([...missing, ...stale, next].join('\n'));
  }
  const covered = operations.filter(({ key }) => sdk.has(key)).length;
  return `The SDK covers ${covered} of ${operations.length} API operations, and ${exclusionsFile} lists the other ${operations.length - covered}.`;
};

runCheck(coverage);
