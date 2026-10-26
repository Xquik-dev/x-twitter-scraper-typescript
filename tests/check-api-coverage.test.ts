// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const script = resolve(__dirname, '..', 'scripts', 'utils', 'check-api-coverage.ts');

type Exclusions = Array<Record<string, unknown>> | Record<string, unknown>;

type Case = {
  spec?: string | object;
  source?: string;
  exclusions?: string | Exclusions | null;
  exclusionsAsDirectory?: boolean;
  resources?: Record<string, string>;
  client?: string;
};

const askExcluded: Exclusions = [{ reason: 'Lives outside the SDK base URL.', operations: ['GET /ask'] }];

const publicSpec = {
  servers: [{ url: 'https://xquik.com' }],
  paths: {
    '/api/v1/x/trends': { get: { operationId: 'getXTrends' } },
    '/api/v1/x/tweets/{id}': { get: { operationId: 'getTweet' }, delete: { operationId: 'deleteTweet' } },
    '/ask': { servers: [{ url: 'https://xquik.com' }], get: { operationId: 'searchXquikDocumentation' } },
  },
};

const resources = {
  'trends.ts': "    return this._client.get('/x/trends', { query, ...options });\n",
  'x/tweets.ts':
    '    return this._client.get(path`/x/tweets/${tweetID}`, { query, ...options });\n' +
    '    return this._client.delete(path`/x/tweets/${id}`, {\n      body,\n    });\n',
};

const runCheck = ({
  spec = publicSpec,
  source,
  exclusions = askExcluded,
  exclusionsAsDirectory = false,
  resources: files = resources,
  client = "const DEFAULT_BASE_URL = 'https://xquik.com/api/v1';\n",
}: Case = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'check-api-coverage-'));
  try {
    const write = (file: string, content: string) => {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      writeFileSync(join(root, file), content);
    };
    write('openapi.json', typeof spec === 'string' ? spec : JSON.stringify(spec));
    if (exclusionsAsDirectory) {
      mkdirSync(join(root, 'excluded-operations.json'));
    } else if (exclusions !== null) {
      write(
        'excluded-operations.json',
        typeof exclusions === 'string' ? exclusions : JSON.stringify(exclusions),
      );
    }
    write(join('src', 'client.ts'), client);
    for (const [file, content] of Object.entries(files)) write(join('src', 'resources', file), content);
    const result = spawnSync(process.execPath, [script, root], {
      encoding: 'utf8',
      env: { ...process.env, XQUIK_OPENAPI_SPEC: source ?? join(root, 'openapi.json') },
    });
    return { status: result.status, stdout: result.stdout, stderr: result.stderr, root };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

describe('scripts/utils/check-api-coverage.ts', () => {
  it('passes when the SDK implements or excludes every operation', () => {
    const result = runCheck();

    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(
      'The SDK covers 3 of 4 API operations, and excluded-operations.json lists the other 1.\n',
    );
    expect(result.status).toBe(0);
  });

  it('matches path parameters by position, whatever their names', () => {
    const result = runCheck({
      spec: {
        servers: [{ url: 'https://xquik.com' }],
        paths: {
          '/api/v1/x/users/{userId}/lists/{listId}': { get: { operationId: 'getUserList' } },
          '/api/v1/x/users/{userId}': { delete: { operationId: 'deleteUser' } },
        },
      },
      exclusions: [{ reason: 'Removes an account.', operations: ['DELETE /api/v1/x/users/{id}'] }],
      resources: { 'users.ts': '    return this._client.get(path`/x/users/${id}/lists/${list}`);\n' },
    });

    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(
      'The SDK covers 1 of 2 API operations, and excluded-operations.json lists the other 1.\n',
    );
    expect(result.status).toBe(0);
  });

  it('reads each operation under its own server, then its path server, then the root server', () => {
    const result = runCheck({
      spec: {
        servers: [{ url: 'https://xquik.com/api/v1/' }],
        paths: {
          '/x/trends': { get: { operationId: 'getXTrends' } },
          '/tweets/{id}': {
            servers: [{ url: 'https://xquik.com/elsewhere' }],
            get: { operationId: 'getTweet', servers: [{ url: 'https://xquik.com/api/v1/x/' }] },
            delete: { operationId: 'deleteTweet', servers: [{ url: '/api/v1/x' }] },
          },
          '/ask': {
            servers: [{ url: 'https://xquik.com' }],
            get: { operationId: 'searchXquikDocumentation' },
          },
        },
      },
    });

    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(
      'The SDK covers 3 of 4 API operations, and excluded-operations.json lists the other 1.\n',
    );
    expect(result.status).toBe(0);
  });

  it('fails and names each operation the SDK neither implements nor excludes', () => {
    const result = runCheck({
      spec: {
        ...publicSpec,
        paths: {
          ...publicSpec.paths,
          '/api/v1/x/trends/history': { get: { operationId: 'getXTrendsHistory' } },
          '/api/v1/x/news/{id}/versions': { get: {} },
        },
      },
    });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(
      'GET /api/v1/x/trends/history (getXTrendsHistory) is in the API but not in the SDK.\n' +
        'GET /api/v1/x/news/{id}/versions is in the API but not in the SDK.\n' +
        'Add each operation above to the SDK, or list it in excluded-operations.json with a reason.\n',
    );
    expect(result.status).toBe(1);
  });

  it.each([
    [
      'the API no longer has',
      'GET /api/v1/old',
      'excluded-operations.json lists GET /api/v1/old, which the API no longer has. Remove it.\n',
    ],
    [
      'the SDK already implements',
      'GET /api/v1/x/trends',
      'excluded-operations.json lists GET /api/v1/x/trends, which the SDK already implements. Remove it.\n',
    ],
  ])('fails on an exclusion %s', (_, operation, line) => {
    const result = runCheck({
      exclusions: [{ reason: 'Lives outside the SDK base URL.', operations: ['GET /ask', operation] }],
    });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(`${line}Remove each operation above from excluded-operations.json.\n`);
    expect(result.status).toBe(1);
  });

  it('lists stale exclusions under the missing operations', () => {
    const result = runCheck({
      spec: { ...publicSpec, paths: { ...publicSpec.paths, '/api/v1/x/hashflags': { get: {} } } },
      exclusions: [{ reason: 'Gone.', operations: ['GET /ask', 'GET /api/v1/old'] }],
    });

    expect(result.stderr).toBe(
      'GET /api/v1/x/hashflags is in the API but not in the SDK.\n' +
        'excluded-operations.json lists GET /api/v1/old, which the API no longer has. Remove it.\n' +
        'Add each operation above to the SDK, or list it in excluded-operations.json with a reason.\n',
    );
    expect(result.status).toBe(1);
  });

  it.each<[string, string | Exclusions | null, string]>([
    ['is missing', null, 'The repository root has no such file'],
    ['is not JSON', '[{"reason": "x" "operations": []}]', 'It is not JSON near position 16'],
    ['is not a list', { reason: 'x', operations: ['GET /ask'] }, 'It must hold a list of groups'],
    ['has a group without a reason', [{ reason: ' ', operations: ['GET /ask'] }], 'Group 1 needs a reason'],
    [
      'has a group without operations',
      [{ reason: 'x', operations: [] }],
      'Group 1 needs at least 1 operation',
    ],
    [
      'has an unknown field',
      [{ reason: 'x', operations: ['GET /ask'], note: 'y' }],
      'Group 1 has the unknown field note',
    ],
    [
      'lists an operation without a method',
      [{ reason: 'x', operations: ['/ask'] }],
      'Group 1 lists "/ask", which needs an upper case method and a path, such as GET /api/v1/x/trends',
    ],
    [
      'lists an operation twice',
      [
        { reason: 'x', operations: ['GET /ask'] },
        { reason: 'y', operations: ['DELETE /api/v1/x/tweets/{id}', 'GET /ask'] },
      ],
      'It lists GET /ask more than once',
    ],
  ])('fails when excluded-operations.json %s', (_, exclusions, problem) => {
    const result = runCheck({ exclusions });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(`excluded-operations.json is not valid. ${problem}.\n`);
    expect(result.status).toBe(1);
  });

  it('names the read error when excluded-operations.json cannot be read', () => {
    const result = runCheck({ exclusionsAsDirectory: true });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('excluded-operations.json is not valid. It cannot be read (EISDIR).\n');
    expect(result.status).toBe(1);
  });

  it('fails with the next step when the spec URL does not answer', () => {
    const result = runCheck({ source: 'http://127.0.0.1:1/openapi.json' });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(
      'Could not read the API spec from http://127.0.0.1:1/openapi.json. Check network access, or set XQUIK_OPENAPI_SPEC to a local copy of https://xquik.com/openapi.json.\n',
    );
    expect(result.status).toBe(1);
  });

  it.each([
    ['is not JSON', '{"paths": '],
    ['has no paths', '{"openapi": "3.1.0"}'],
  ])('fails with the next step when the spec %s', (_, spec) => {
    const { root, ...result } = runCheck({ spec });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(
      `Could not read the API spec from ${join(root, 'openapi.json')}. Check network access, or set XQUIK_OPENAPI_SPEC to a local copy of https://xquik.com/openapi.json.\n`,
    );
    expect(result.status).toBe(1);
  });

  it.each([
    [
      'a variable path',
      "import { path } from '../../internal/utils/path';\n\n    return this._client.post(route, {});\n",
      3,
    ],
    ['a request method', "\n    return this._client.request({ method: 'get', path: '/x/search' });\n", 2],
    [
      'a path template with an added part',
      "    return this._client.get(path`/x/tweets/${id}` + '/likes');\n",
      1,
    ],
    ['a path string with an added part', "\n\n\n    return this._client.get('/x/users' + `/${id}`);\n", 4],
    [
      'a request after a block comment',
      '/**\n * Lists media.\n */\n    return this._client.get(route);\n',
      4,
    ],
  ])('names the file and line of a request with %s', (_, content, line) => {
    const result = runCheck({ resources: { ...resources, 'x/media.ts': content } });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(
      `Could not read the method or path of the request at src/resources/x/media.ts line ${line}. Write it as this._client.get('/path') or this._client.get(path\`/path/\${id}\`).\n`,
    );
    expect(result.status).toBe(1);
  });

  it('ignores a request that only a comment mentions', () => {
    const result = runCheck({
      spec: {
        ...publicSpec,
        paths: { ...publicSpec.paths, '/api/v1/x/lists': { get: { operationId: 'listLists' } } },
      },
      resources: { ...resources, 'x/lists.ts': "/**\n * Calls this._client.get('/x/lists').\n */\n" },
    });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(
      'GET /api/v1/x/lists (listLists) is in the API but not in the SDK.\n' +
        'Add each operation above to the SDK, or list it in excluded-operations.json with a reason.\n',
    );
    expect(result.status).toBe(1);
  });

  it('fails when src/client.ts has no default base URL constant', () => {
    const result = runCheck({ client: "const baseURL = 'https://xquik.com/api/v1';\n" });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(
      "Could not read the default base URL from src/client.ts. Define const DEFAULT_BASE_URL = '<url>' in src/client.ts.\n",
    );
    expect(result.status).toBe(1);
  });
});
