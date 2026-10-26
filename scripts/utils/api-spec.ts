// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import path from 'node:path';
import { field, isList, isObject, parseJson, type JsonObject } from './json.ts';

const publicSpec = 'https://xquik.com/openapi.json';
export const httpMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const;
const baseUrlConstant = /^const DEFAULT_BASE_URL = '([^']+)';$/m;

export class CheckError extends Error {}

export type Spec = JsonObject & { paths: JsonObject };

export type Operation = {
  readonly id: string;
  readonly key: string;
  readonly operationId: unknown;
  readonly pathItem: JsonObject;
  readonly operation: JsonObject;
};

type GroupRules = {
  readonly field: string;
  readonly noun: string;
  readonly entryPattern: RegExp;
  readonly entryHint: string;
  readonly key: (entry: string) => string;
};

const urlPath = (url: string) => new URL(url, 'http://localhost').pathname.replace(/\/$/, '');

export const comparable = (operation: string) => operation.replace(/\{[^}]*\}/g, '{}');

const readSpec = async (source: string): Promise<Spec> => {
  try {
    const text =
      /^https?:\/\//i.test(source) ?
        await fetch(source, { signal: AbortSignal.timeout(30_000) }).then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.text();
        })
      : fs.readFileSync(source, 'utf8');
    const spec = parseJson(text);
    const paths = field(spec, 'paths');
    if (!isObject(spec) || !isObject(paths)) throw new Error('no paths');
    return { ...spec, paths };
  } catch {
    throw new CheckError(
      `Could not read the API spec from ${source}. Check network access, or set XQUIK_OPENAPI_SPEC to a local copy of ${publicSpec}.`,
    );
  }
};

export const readConfiguredSpec = () => readSpec(process.env['XQUIK_OPENAPI_SPEC'] || publicSpec);

export const specOperations = (spec: Spec): Operation[] =>
  Object.entries(spec.paths).flatMap(([pathKey, pathItem]) =>
    httpMethods.flatMap((method) => {
      const operation = field(pathItem, method);
      if (!isObject(pathItem) || !isObject(operation)) return [];
      const servers = operation['servers'] ?? pathItem['servers'] ?? spec['servers'] ?? [];
      const url = field(field(servers, '0'), 'url');
      const serverPath = url ? urlPath(String(url)) : '';
      const id = `${method.toUpperCase()} ${serverPath}${pathKey}`;
      return [{ id, key: comparable(id), operationId: operation['operationId'], pathItem, operation }];
    }),
  );

export const readBasePath = (root: string) => {
  const client = fs.readFileSync(path.join(root, 'src', 'client.ts'), 'utf8');
  const baseUrl = client.match(baseUrlConstant)?.[1];
  if (!baseUrl) {
    throw new CheckError(
      "Could not read the default base URL from src/client.ts. Define const DEFAULT_BASE_URL = '<url>' in src/client.ts.",
    );
  }
  return urlPath(baseUrl);
};

const groupEntries = (
  groups: unknown,
  { field: name, noun, entryPattern, entryHint, key }: GroupRules,
): { readonly problem: string } | { readonly entries: string[] } => {
  if (!isList(groups)) return { problem: 'It must hold a list of groups' };
  const seen = new Set<string>();
  const entries: string[] = [];
  for (const [index, group] of groups.entries()) {
    const label = `Group ${index + 1}`;
    if (!isObject(group) || isList(group)) return { problem: `${label} is not an object` };
    const extra = Object.keys(group).filter((property) => property !== 'reason' && property !== name);
    if (extra.length) return { problem: `${label} has the unknown field ${extra[0]}` };
    const reason = group['reason'];
    if (typeof reason !== 'string' || !reason.trim()) return { problem: `${label} needs a reason` };
    const listed = group[name];
    if (!isList(listed) || !listed.length) return { problem: `${label} needs at least 1 ${noun}` };
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

const errorCode = (error: unknown) => field(error, 'code');

export const readGroups = (root: string, file: string, rules: GroupRules) => {
  const invalid = (problem: string) => new CheckError(`${file} is not valid. ${problem}.`);
  let text: string;
  try {
    text = fs.readFileSync(path.join(root, file), 'utf8');
  } catch (error) {
    throw invalid(
      errorCode(error) === 'ENOENT' ?
        'The repository root has no such file'
      : `It cannot be read (${errorCode(error)})`,
    );
  }
  let groups: unknown;
  try {
    groups = parseJson(text);
  } catch (error) {
    const position = (error instanceof Error ? error.message : '').match(/at position (\d+)/)?.[1];
    throw invalid(`It is not JSON${position ? ` near position ${position}` : ''}`);
  }
  const parsed = groupEntries(groups, rules);
  if ('problem' in parsed) throw invalid(parsed.problem);
  return parsed.entries;
};

export const exclusionsFile = 'excluded-operations.json';

export const readExclusions = (root: string) =>
  readGroups(root, exclusionsFile, {
    field: 'operations',
    noun: 'operation',
    entryPattern: new RegExp(`^(${httpMethods.join('|').toUpperCase()}) (/\\S*)$`),
    entryHint: 'needs an upper case method and a path, such as GET /api/v1/x/trends',
    key: comparable,
  });

export const runCheck = async (check: () => Promise<string>) => {
  try {
    process.stdout.write(`${await check()}\n`);
  } catch (error) {
    if (!(error instanceof CheckError)) throw error;
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
};
