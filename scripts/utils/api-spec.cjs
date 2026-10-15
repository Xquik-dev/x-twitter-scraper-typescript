// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');

const publicSpec = 'https://xquik.com/openapi.json';
const httpMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
const baseUrlConstant = /^const DEFAULT_BASE_URL = '([^']+)';$/m;

class CheckError extends Error {}

const urlPath = (url) => new URL(url, 'http://localhost').pathname.replace(/\/$/, '');

const comparable = (operation) => operation.replace(/\{[^}]*\}/g, '{}');

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
    throw new CheckError(
      `Could not read the API spec from ${source}. Check network access, or set XQUIK_OPENAPI_SPEC to a local copy of ${publicSpec}.`,
    );
  }
};

const readConfiguredSpec = () => readSpec(process.env['XQUIK_OPENAPI_SPEC'] || publicSpec);

const specOperations = (spec) =>
  Object.entries(spec.paths).flatMap(([pathKey, pathItem]) =>
    httpMethods
      .filter((method) => typeof pathItem?.[method] === 'object' && pathItem[method] !== null)
      .map((method) => {
        const operation = pathItem[method];
        const servers = operation.servers ?? pathItem.servers ?? spec.servers ?? [];
        const serverPath = servers[0]?.url ? urlPath(servers[0].url) : '';
        const id = `${method.toUpperCase()} ${serverPath}${pathKey}`;
        return { id, key: comparable(id), operationId: operation.operationId, pathItem, operation };
      }),
  );

const readBasePath = (root) => {
  const client = fs.readFileSync(path.join(root, 'src', 'client.ts'), 'utf8');
  const baseUrl = client.match(baseUrlConstant)?.[1];
  if (!baseUrl) {
    throw new CheckError(
      "Could not read the default base URL from src/client.ts. Define const DEFAULT_BASE_URL = '<url>' in src/client.ts.",
    );
  }
  return urlPath(baseUrl);
};

const groupProblem = (groups, field, entryPattern, entryHint, key) => {
  if (!Array.isArray(groups)) return 'It must hold a list of groups';
  const seen = new Set();
  for (const [index, group] of groups.entries()) {
    const name = `Group ${index + 1}`;
    if (typeof group !== 'object' || group === null || Array.isArray(group)) {
      return `${name} is not an object`;
    }
    const extra = Object.keys(group).filter((name) => name !== 'reason' && name !== field);
    if (extra.length) return `${name} has the unknown field ${extra[0]}`;
    if (typeof group.reason !== 'string' || !group.reason.trim()) return `${name} needs a reason`;
    if (!Array.isArray(group[field]) || !group[field].length) {
      return `${name} needs at least 1 ${field === 'operations' ? 'operation' : 'difference'}`;
    }
    for (const entry of group[field]) {
      if (typeof entry !== 'string' || !entryPattern.test(entry)) {
        return `${name} lists ${JSON.stringify(entry)}, which ${entryHint}`;
      }
      if (seen.has(key(entry))) return `It lists ${entry} more than once`;
      seen.add(key(entry));
    }
  }
  return undefined;
};

const readGroups = (root, file, { field, entryPattern, entryHint, key }) => {
  const invalid = (problem) => new CheckError(`${file} is not valid. ${problem}.`);
  let text;
  try {
    text = fs.readFileSync(path.join(root, file), 'utf8');
  } catch (error) {
    throw invalid(
      error.code === 'ENOENT' ? 'The repository root has no such file' : `It cannot be read (${error.code})`,
    );
  }
  let groups;
  try {
    groups = JSON.parse(text);
  } catch (error) {
    const position = error.message.match(/at position (\d+)/)?.[1];
    throw invalid(`It is not JSON${position ? ` near position ${position}` : ''}`);
  }
  const problem = groupProblem(groups, field, entryPattern, entryHint, key);
  if (problem) throw invalid(problem);
  return groups.flatMap((group) => group[field]);
};

const runCheck = async (check) => {
  try {
    process.stdout.write(`${await check()}\n`);
  } catch (error) {
    if (!(error instanceof CheckError)) throw error;
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
};

module.exports = {
  CheckError,
  comparable,
  httpMethods,
  readBasePath,
  readConfiguredSpec,
  readGroups,
  runCheck,
  specOperations,
  urlPath,
};
