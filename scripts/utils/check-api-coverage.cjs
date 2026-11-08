// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const {
  CheckError,
  comparable,
  exclusionsFile,
  readBasePath,
  readConfiguredSpec,
  readExclusions,
  runCheck,
  specOperations,
} = require('./api-spec.cjs');

const root = path.resolve(process.argv[2] ?? path.join(__dirname, '..', '..'));
const clientMember = /this\._client\s*(?:\?\.|\.|\[)/g;
const requestCall =
  /this\._client\.(get|post|put|patch|delete)\(\s*(?:'([^'\\]*)'|path`((?:[^`$\\]|\$\{[^{}`]*\})*)`)\s*[,)]/y;
const blockComment = /\/\*[\s\S]*?\*\//g;

/** @type {(source: string) => string} */
const withoutBlockComments = (source) =>
  source.replace(blockComment, (comment) => comment.replace(/[^\n]/g, ''));

/** @type {(directory: string) => string[]} */
const sourceFiles = (directory) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(file);
      return entry.name.endsWith('.ts') ? [file] : [];
    });

/** @type {() => string[]} */
const sdkOperations = () => {
  const basePath = readBasePath(root);
  return sourceFiles(path.join(root, 'src', 'resources')).flatMap((file) => {
    const source = withoutBlockComments(fs.readFileSync(file, 'utf8'));
    return [...source.matchAll(clientMember)].map(({ index }) => {
      requestCall.lastIndex = index;
      const call = requestCall.exec(source);
      if (call === null) {
        const line = source.slice(0, index).split('\n').length;
        throw new CheckError(
          `Could not read the method or path of the request at ${path.relative(root, file)} line ${String(line)}. Write it as this._client.get('/path') or this._client.get(path\`/path/\${id}\`).`,
        );
      }
      const [, method = '', quoted, template = ''] = call;
      const requestPath = quoted ?? template.replace(/\$\{[^{}`]*\}/g, '{}');
      return `${method.toUpperCase()} ${basePath}${requestPath}`;
    });
  });
};

/** @type {() => Promise<string>} */
const coverage = async () => {
  const exclusions = readExclusions(root);
  const sdk = new Set(sdkOperations().map(comparable));
  const operations = specOperations(await readConfiguredSpec());
  const inSpec = new Set(operations.map(({ key }) => key));
  const excluded = new Set(exclusions.map(comparable));

  const missing = operations
    .filter(({ key }) => !sdk.has(key) && !excluded.has(key))
    .map(
      ({ id, operationId }) =>
        `${id}${typeof operationId === 'string' && operationId !== '' ? ` (${operationId})` : ''} is in the API but not in the SDK.`,
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

  if (missing.length > 0 || stale.length > 0) {
    const next =
      missing.length > 0 ?
        `Add each operation above to the SDK, or list it in ${exclusionsFile} with a reason.`
      : `Remove each operation above from ${exclusionsFile}.`;
    throw new CheckError([...missing, ...stale, next].join('\n'));
  }
  const covered = operations.filter(({ key }) => sdk.has(key)).length;
  return `The SDK covers ${String(covered)} of ${String(operations.length)} API operations, and ${exclusionsFile} lists the other ${String(operations.length - covered)}.`;
};

runCheck(coverage);
