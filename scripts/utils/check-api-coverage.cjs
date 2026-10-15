// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] ?? path.join(__dirname, '..', '..'));
const publicSpec = 'https://xquik.com/openapi.json';
const exclusionsFile = 'excluded-operations.json';
const httpMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
const operationPattern = new RegExp(`^(${httpMethods.join('|').toUpperCase()}) (/\\S*)$`);
const clientMember = /this\._client\s*(?:\?\.|\.|\[)/g;
const requestCall =
  /this\._client\.(get|post|put|patch|delete)\(\s*(?:'([^'\\]*)'|path`((?:[^`$\\]|\$\{[^{}`]*\})*)`)\s*[,)]/y;
const baseUrlConstant = /^const DEFAULT_BASE_URL = '([^']+)';$/m;
const blockComment = /\/\*[\s\S]*?\*\//g;

class CoverageError extends Error {}

const urlPath = (url) => new URL(url, 'http://localhost').pathname.replace(/\/$/, '');

const comparable = (operation) => operation.replace(/\{[^}]*\}/g, '{}');

const withoutBlockComments = (source) =>
  source.replace(blockComment, (comment) => comment.replace(/[^\n]/g, ''));

const readSpec = async (source) => {
  try {
    const text =
      /^https?:\/\//i.test(source) ?
        await fetch(source, { signal: AbortSignal.timeout(30_000) }).then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.text();
        })
      : fs.readFileSync(source, 'utf8');
    const spec = JSON.parse(text);
    if (typeof spec?.paths !== 'object' || spec.paths === null) throw new Error('no paths');
    return spec;
  } catch {
    throw new CoverageError(
      `Could not read the API spec from ${source}. Check network access, or set XQUIK_OPENAPI_SPEC to a local copy of ${publicSpec}.`,
    );
  }
};

const specOperations = (spec) =>
  Object.entries(spec.paths).flatMap(([pathKey, pathItem]) =>
    httpMethods
      .filter((method) => typeof pathItem?.[method] === 'object' && pathItem[method] !== null)
      .map((method) => {
        const operation = pathItem[method];
        const servers = operation.servers ?? pathItem.servers ?? spec.servers ?? [];
        const serverPath = servers[0]?.url ? urlPath(servers[0].url) : '';
        const id = `${method.toUpperCase()} ${serverPath}${pathKey}`;
        return { id, key: comparable(id), operationId: operation.operationId };
      }),
  );

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
  const client = fs.readFileSync(path.join(root, 'src', 'client.ts'), 'utf8');
  const baseUrl = client.match(baseUrlConstant)?.[1];
  if (!baseUrl) {
    throw new CoverageError(
      "Could not read the default base URL from src/client.ts. Define const DEFAULT_BASE_URL = '<url>' in src/client.ts.",
    );
  }
  const basePath = urlPath(baseUrl);
  return sourceFiles(path.join(root, 'src', 'resources')).flatMap((file) => {
    const source = withoutBlockComments(fs.readFileSync(file, 'utf8'));
    return [...source.matchAll(clientMember)].map(({ index }) => {
      requestCall.lastIndex = index;
      const call = requestCall.exec(source);
      if (!call) {
        const line = source.slice(0, index).split('\n').length;
        throw new CoverageError(
          `Could not read the method or path of the request at ${path.relative(root, file)} line ${line}. Write it as this._client.get('/path') or this._client.get(path\`/path/\${id}\`).`,
        );
      }
      const requestPath = call[2] ?? call[3].replace(/\$\{[^{}`]*\}/g, '{}');
      return `${call[1].toUpperCase()} ${basePath}${requestPath}`;
    });
  });
};

const exclusionProblem = (groups) => {
  if (!Array.isArray(groups)) return 'It must hold a list of groups';
  const seen = new Set();
  for (const [index, group] of groups.entries()) {
    const name = `Group ${index + 1}`;
    if (typeof group !== 'object' || group === null || Array.isArray(group)) {
      return `${name} is not an object`;
    }
    const extra = Object.keys(group).filter((key) => key !== 'reason' && key !== 'operations');
    if (extra.length) return `${name} has the unknown field ${extra[0]}`;
    if (typeof group.reason !== 'string' || !group.reason.trim()) return `${name} needs a reason`;
    if (!Array.isArray(group.operations) || !group.operations.length) {
      return `${name} needs at least 1 operation`;
    }
    for (const operation of group.operations) {
      if (typeof operation !== 'string' || !operationPattern.test(operation)) {
        return `${name} lists ${JSON.stringify(operation)}, which needs an upper case method and a path, such as GET /api/v1/x/trends`;
      }
      if (seen.has(comparable(operation))) return `It lists ${operation} more than once`;
      seen.add(comparable(operation));
    }
  }
  return undefined;
};

const invalidExclusions = (problem) => new CoverageError(`${exclusionsFile} is not valid. ${problem}.`);

const readExclusions = () => {
  let text;
  try {
    text = fs.readFileSync(path.join(root, exclusionsFile), 'utf8');
  } catch (error) {
    throw invalidExclusions(
      error.code === 'ENOENT' ? 'The repository root has no such file' : `It cannot be read (${error.code})`,
    );
  }
  let groups;
  try {
    groups = JSON.parse(text);
  } catch (error) {
    const position = error.message.match(/at position (\d+)/)?.[1];
    throw invalidExclusions(`It is not JSON${position ? ` near position ${position}` : ''}`);
  }
  const problem = exclusionProblem(groups);
  if (problem) throw invalidExclusions(problem);
  return groups.flatMap((group) => group.operations);
};

const coverage = async (source) => {
  const exclusions = readExclusions();
  const sdk = new Set(sdkOperations().map(comparable));
  const operations = specOperations(await readSpec(source));
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
    throw new CoverageError([...missing, ...stale, next].join('\n'));
  }
  const covered = operations.filter(({ key }) => sdk.has(key)).length;
  return `The SDK covers ${covered} of ${operations.length} API operations, and ${exclusionsFile} lists the other ${operations.length - covered}.`;
};

const main = async () => {
  try {
    process.stdout.write(`${await coverage(process.env['XQUIK_OPENAPI_SPEC'] || publicSpec)}\n`);
  } catch (error) {
    if (!(error instanceof CoverageError)) throw error;
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
};

main();
