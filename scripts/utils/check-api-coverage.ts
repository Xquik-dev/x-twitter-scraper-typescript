// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import path from 'node:path';
import {
  CheckError,
  comparable,
  exclusionsFile,
  readBasePath,
  readConfiguredSpec,
  readExclusions,
  runCheck,
  specOperations,
} from './api-spec.ts';

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, '..', '..'));
const clientMember = /this\._client\s*(?:\?\.|\.|\[)/g;
const requestCall =
  /this\._client\.(get|post|put|patch|delete)\(\s*(?:'([^'\\]*)'|path`((?:[^`$\\]|\$\{[^{}`]*\})*)`)\s*[,)]/y;
const blockComment = /\/\*[\s\S]*?\*\//g;

const withoutBlockComments = (source: string) =>
  source.replace(blockComment, (comment) => comment.replace(/[^\n]/g, ''));

const sourceFiles = (directory: string): string[] =>
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
      const verb = call?.[1];
      const requestPath = call?.[2] ?? call?.[3]?.replace(/\$\{[^{}`]*\}/g, '{}');
      if (verb === undefined || requestPath === undefined) {
        const line = source.slice(0, index).split('\n').length;
        throw new CheckError(
          `Could not read the method or path of the request at ${path.relative(root, file)} line ${line}. Write it as this._client.get('/path') or this._client.get(path\`/path/\${id}\`).`,
        );
      }
      return `${verb.toUpperCase()} ${basePath}${requestPath}`;
    });
  });
};

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

await runCheck(coverage);
