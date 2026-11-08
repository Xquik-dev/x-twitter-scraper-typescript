// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const { asObject, parseJson } = require('./json.cjs');

const publicSpec = 'https://xquik.com/openapi.json';
const httpMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
const baseUrlConstant = /^const DEFAULT_BASE_URL = '([^']+)';$/m;

class CheckError extends Error {}

/**
 * @template T
 * @param {T} value
 * @returns {value is NonNullable<T>}
 */
function isPresent(value) {
  return value !== null && value !== undefined;
}

/** @type {(url: string) => string} */
const urlPath = (url) => new URL(url, 'http://localhost').pathname.replace(/\/$/, '');

/** @type {(operation: string) => string} */
const comparable = (operation) => operation.replace(/\{[^}]*\}/g, '{}');

/** @type {(source: string) => Promise<import('./types').SpecDocument>} */
const readSpec = async (source) => {
  try {
    const text =
      /^https?:\/\//i.test(source) ?
        await fetch(source, { signal: AbortSignal.timeout(30_000) }).then((response) => {
          if (!response.ok) throw new Error(`HTTP ${String(response.status)}`);
          return response.text();
        })
      : fs.readFileSync(source, 'utf8');
    const spec = asObject(parseJson(text));
    const paths = spec?.['paths'];
    if (spec === undefined || typeof paths !== 'object' || paths === null) throw new Error('no paths');
    return { ...spec, paths };
  } catch {
    throw new CheckError(
      `Could not read the API spec from ${source}. Check network access, or set XQUIK_OPENAPI_SPEC to a local copy of ${publicSpec}.`,
    );
  }
};

const readConfiguredSpec = () => {
  const configured = process.env['XQUIK_OPENAPI_SPEC'];
  return readSpec(configured !== undefined && configured !== '' ? configured : publicSpec);
};

/** @type {(spec: import('./types').SpecDocument) => import('./types').SpecEntry[]} */
const specOperations = (spec) =>
  Object.entries(spec.paths).flatMap(([pathKey, value]) => {
    const pathItem = asObject(value);
    if (pathItem === undefined) return [];
    return httpMethods.flatMap((method) => {
      const operation = asObject(pathItem[method]);
      if (operation === undefined) return [];
      const servers = operation['servers'] ?? pathItem['servers'] ?? spec['servers'] ?? [];
      const url = Array.isArray(servers) ? asObject(servers[0])?.['url'] : undefined;
      const serverPath = typeof url === 'string' && url !== '' ? urlPath(url) : '';
      const id = `${method.toUpperCase()} ${serverPath}${pathKey}`;
      return [{ id, key: comparable(id), operationId: operation['operationId'], pathItem, operation }];
    });
  });

/** @type {(root: string) => string} */
const readBasePath = (root) => {
  const client = fs.readFileSync(path.join(root, 'src', 'client.ts'), 'utf8');
  const baseUrl = client.match(baseUrlConstant)?.[1];
  if (baseUrl === undefined || baseUrl === '') {
    throw new CheckError(
      "Could not read the default base URL from src/client.ts. Define const DEFAULT_BASE_URL = '<url>' in src/client.ts.",
    );
  }
  return urlPath(baseUrl);
};

/** @type {(groups: import('./types').JsonValue, rules: import('./types').GroupRules) => { problem: string } | { entries: string[] }} */
const groupEntries = (groups, { field, noun, entryPattern, entryHint, key }) => {
  if (!Array.isArray(groups)) return { problem: 'It must hold a list of groups' };
  /** @type {Set<string>} */
  const seen = new Set();
  /** @type {string[]} */
  const entries = [];
  for (const [index, group] of groups.entries()) {
    const label = `Group ${String(index + 1)}`;
    const object = asObject(group);
    if (object === undefined) return { problem: `${label} is not an object` };
    const extra = Object.keys(object).filter((property) => property !== 'reason' && property !== field);
    if (extra.length > 0) return { problem: `${label} has the unknown field ${String(extra[0])}` };
    const reason = object['reason'];
    if (typeof reason !== 'string' || reason.trim() === '') return { problem: `${label} needs a reason` };
    const listed = object[field];
    if (!Array.isArray(listed) || listed.length === 0) {
      return { problem: `${label} needs at least 1 ${noun}` };
    }
    for (const entry of listed) {
      if (typeof entry !== 'string' || !entryPattern.test(entry)) {
        return { problem: `${label} lists ${JSON.stringify(entry)}, which ${entryHint}` };
      }
      if (seen.has(key(entry))) return { problem: `It lists ${entry} more than once` };
      seen.add(key(entry));
      entries.push(entry);
    }
  }
  return { entries };
};

/** @type {(root: string, file: string, rules: import('./types').GroupRules) => string[]} */
const readGroups = (root, file, rules) => {
  /** @type {(problem: string) => CheckError} */
  const invalid = (problem) => new CheckError(`${file} is not valid. ${problem}.`);
  /** @type {string} */
  let text;
  try {
    text = fs.readFileSync(path.join(root, file), 'utf8');
  } catch (error) {
    const code = error instanceof Error && 'code' in error ? error.code : undefined;
    throw invalid(
      code === 'ENOENT' ? 'The repository root has no such file' : `It cannot be read (${String(code)})`,
    );
  }
  /** @type {import('./types').JsonValue} */
  let groups;
  try {
    groups = parseJson(text);
  } catch (error) {
    const position = error instanceof Error ? error.message.match(/at position (\d+)/)?.[1] : undefined;
    throw invalid(`It is not JSON${position !== undefined ? ` near position ${position}` : ''}`);
  }
  const result = groupEntries(groups, rules);
  if ('problem' in result) throw invalid(result.problem);
  return result.entries;
};

const exclusionsFile = 'excluded-operations.json';

/** @type {(root: string) => string[]} */
const readExclusions = (root) =>
  readGroups(root, exclusionsFile, {
    field: 'operations',
    noun: 'operation',
    entryPattern: new RegExp(`^(${httpMethods.join('|').toUpperCase()}) (/\\S*)$`),
    entryHint: 'needs an upper case method and a path, such as GET /api/v1/x/trends',
    key: comparable,
  });

/** @type {(check: () => Promise<string>) => void} */
const runCheck = (check) => {
  check().then(
    (message) => {
      process.stdout.write(`${message}\n`);
    },
    /** @param {unknown} error */
    (error) => {
      if (!(error instanceof CheckError)) throw error;
      process.stderr.write(`${error.message}\n`);
      process.exitCode = 1;
    },
  );
};

module.exports = {
  CheckError,
  comparable,
  exclusionsFile,
  httpMethods,
  isPresent,
  readBasePath,
  readConfiguredSpec,
  readExclusions,
  readGroups,
  runCheck,
  specOperations,
};
