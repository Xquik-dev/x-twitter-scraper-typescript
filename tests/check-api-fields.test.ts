// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const script = resolve(__dirname, '..', 'scripts', 'utils', 'check-api-fields.cjs');

type Accepted = Array<Record<string, unknown>> | Record<string, unknown>;

type Case = {
  spec?: string | object;
  accepted?: string | Accepted | null;
  resource?: string;
};

const core = {
  'src/client.ts': "const DEFAULT_BASE_URL = 'https://xquik.com/api/v1';\n",
  'src/core/api-promise.ts': 'export class APIPromise<T> extends Promise<T> {}\n',
  'src/core/resource.ts': 'export class APIResource {\n  protected _client: any;\n}\n',
  'src/internal/utils/path.ts':
    'export const path = (strings: TemplateStringsArray, ...values: Array<string>): string => strings.join(values[0] ?? "");\n',
};

const header = `import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { path } from '../internal/utils/path';
`;

const tweets = `${header}
export class Tweets extends APIResource {
  retrieve(id: string, query: TweetRetrieveParams | null | undefined = {}, options?: object): APIPromise<TweetRetrieveResponse> {
    return this._client.get(path\`/x/tweets/\${id}\`, { query, ...options });
  }

  create(body: TweetCreateParams, options?: object): APIPromise<TweetCreateResponse> {
    return this._client.post('/x/tweets', { body, ...options });
  }
}

export interface TweetRetrieveResponse {
  id: string;
  text: string;
  author: { username: string; name?: string | null };
  lang?: string;
}

export interface TweetRetrieveParams {
  fields?: string;
}

export interface TweetCreateResponse {
  id: string;
  status: 'queued' | 'sent';
}

export interface TweetCreateParams {
  account: string;
  text: string;
}
`;

const responseProperties: Record<string, object> = {
  id: { type: 'string' },
  text: { type: 'string' },
  author: { $ref: '#/components/schemas/Author' },
  lang: { type: 'string' },
};

const { lang: _lang, ...withoutLang } = responseProperties;

type SpecOptions = {
  response?: Record<string, object>;
  required?: Array<string>;
  open?: boolean;
  author?: Record<string, object>;
  statuses?: Array<string>;
  query?: Array<object>;
  requiredLater?: Array<string>;
};

const makeSpec = ({
  response = responseProperties,
  required = ['id', 'text', 'author'],
  open = false,
  author = { username: { type: 'string' }, name: { type: ['string', 'null'] } },
  statuses = ['queued'],
  query = [{ name: 'fields', in: 'query', schema: { type: 'string' } }],
  requiredLater = [],
}: SpecOptions = {}): object => {
  const schema = {
    type: 'object',
    required,
    properties: response,
    ...(open ? { additionalProperties: true } : {}),
  };
  return {
    servers: [{ url: 'https://xquik.com' }],
    paths: {
      '/api/v1/x/tweets/{tweetId}': {
        get: {
          parameters: [{ name: 'tweetId', in: 'path', required: true, schema: { type: 'string' } }, ...query],
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema:
                    requiredLater.length ?
                      { allOf: [schema, { type: 'object', required: requiredLater }] }
                    : schema,
                },
              },
            },
          },
        },
      },
      '/api/v1/x/tweets': {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['account', 'text'],
                  properties: { account: { type: 'string' }, text: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            '201': {
              content: {
                'application/json': {
                  schema: {
                    oneOf: [{ $ref: '#/components/schemas/Queued' }, { $ref: '#/components/schemas/Sent' }],
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Author: { type: 'object', required: ['username'], properties: author },
        Queued: {
          type: 'object',
          required: ['id', 'status'],
          properties: { id: { type: 'string' }, status: { type: 'string', enum: statuses } },
        },
        Sent: {
          allOf: [
            { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
            {
              type: 'object',
              required: ['status'],
              properties: { status: { type: 'string', const: 'sent' } },
            },
          ],
        },
      },
    },
  };
};

const runCheck = ({ spec: source = makeSpec(), accepted = [], resource = tweets }: Case = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'check-api-fields-'));
  try {
    const write = (file: string, content: string) => {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      writeFileSync(join(root, file), content);
    };
    for (const [file, content] of Object.entries(core)) write(file, content);
    write('src/resources/tweets.ts', resource);
    write('excluded-operations.json', '[]');
    write('openapi.json', typeof source === 'string' ? source : JSON.stringify(source));
    if (accepted !== null) {
      write(
        'accepted-field-differences.json',
        typeof accepted === 'string' ? accepted : JSON.stringify(accepted),
      );
    }
    const result = spawnSync(process.execPath, [script, root], {
      encoding: 'utf8',
      env: { ...process.env, XQUIK_OPENAPI_SPEC: join(root, 'openapi.json') },
    });
    return { status: result.status, stdout: result.stdout, stderr: result.stderr, root };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

const next =
  'Fix each field above in the SDK, or list it in accepted-field-differences.json with a reason.\n';

const team = {
  type: 'object',
  required: ['id', 'record'],
  properties: {
    id: { type: 'string' },
    record: { type: ['object', 'null'], properties: { wins: { type: 'integer' } } },
  },
};

const color = { type: 'object', properties: { color: { type: 'string' } } };

const teamsMap = (values: unknown) => ({ type: 'object', additionalProperties: values });

const withTeams = (sdkTeam: string, sdkTeams = '{ [key: string]: Team }'): string =>
  tweets.replace(
    '  lang?: string;\n}',
    `  lang?: string;\n  teams: ${sdkTeams};\n  replies: Array<Team>;\n}\n\nexport interface Team ${sdkTeam}`,
  );

const runTeams = (specTeams: object, sdkTeam: string, sdkTeams?: string) =>
  runCheck({
    spec: makeSpec({
      response: { ...responseProperties, teams: specTeams, replies: { type: 'array', items: team } },
      required: ['id', 'text', 'author', 'teams', 'replies'],
    }),
    resource: withTeams(sdkTeam, sdkTeams),
  });

const matchingTeam = '{ id: string; record: { wins?: number } | null }';

describe('scripts/utils/check-api-fields.cjs', () => {
  it.each<[string, object, string, Array<string>]>([
    [
      'a field the SDK lacks inside map values & array items',
      teamsMap(team),
      '{ id: string }',
      [
        'GET /api/v1/x/tweets/{tweetId} response missing teams{}.record',
        'GET /api/v1/x/tweets/{tweetId} response missing replies[].record',
      ],
    ],
    [
      'an SDK field the spec lacks inside map values & array items',
      teamsMap(team),
      '{ id: string; record: { wins?: number } | null; color: string }',
      [
        'GET /api/v1/x/tweets/{tweetId} response extra teams{}.color',
        'GET /api/v1/x/tweets/{tweetId} response extra replies[].color',
      ],
    ],
    [
      'a field from 1 variant of a union of maps',
      { anyOf: [teamsMap(team), teamsMap({ allOf: [team, color] })] },
      matchingTeam,
      ['GET /api/v1/x/tweets/{tweetId} response missing teams{}.color'],
    ],
    [
      'a field from 1 part of an allOf of maps',
      { allOf: [teamsMap(team), teamsMap(color)] },
      matchingTeam,
      ['GET /api/v1/x/tweets/{tweetId} response missing teams{}.color'],
    ],
  ])('fails on %s', (_name, specTeams, sdkTeam, lines) => {
    const result = runTeams(specTeams, sdkTeam);

    expect(result.stderr).toBe(`${lines.join('\n')}\n${next}`);
    expect(result.status).toBe(1);
  });

  it.each<[string, object, string?]>([
    ['map values & array items match the spec', teamsMap(team)],
    ['the spec map allows any value', teamsMap(true)],
    ['the spec map values are an empty schema', teamsMap({})],
    [
      'the SDK map values are unknown',
      { ...team, additionalProperties: false },
      '{ [key: string]: unknown }',
    ],
  ])('passes when %s', (_name, specTeams, sdkTeams) => {
    const result = runTeams(specTeams, matchingTeam, sdkTeams);

    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
  });

  it('passes when every field, flag and enum matches, whatever the path parameter is called', () => {
    const result = runCheck();

    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(
      "The SDK's fields match the API for 2 operations, and accepted-field-differences.json lists 0 accepted differences.\n",
    );
    expect(result.status).toBe(0);
  });

  it.each<[string, SpecOptions, string]>([
    [
      'a response field the SDK lacks, once at its top position',
      {
        response: {
          ...responseProperties,
          card: { type: 'object', properties: { title: { type: 'string' }, url: { type: 'string' } } },
        },
      },
      'GET /api/v1/x/tweets/{tweetId} response missing card',
    ],
    [
      'a nested response field the SDK lacks',
      {
        author: {
          username: { type: 'string' },
          name: { type: ['string', 'null'] },
          followers: { type: 'integer' },
        },
      },
      'GET /api/v1/x/tweets/{tweetId} response missing author.followers',
    ],
    [
      'an SDK field the spec lacks',
      { response: withoutLang },
      'GET /api/v1/x/tweets/{tweetId} response extra lang',
    ],
    [
      'a query parameter the SDK lacks',
      {
        query: [
          { name: 'fields', in: 'query', schema: { type: 'string' } },
          { name: 'omit', in: 'query', schema: { type: 'string' } },
        ],
      },
      'GET /api/v1/x/tweets/{tweetId} request missing omit',
    ],
    [
      'an enum value the SDK lacks',
      { statuses: ['queued', 'held'] },
      'POST /api/v1/x/tweets response enum status',
    ],
    [
      'a field the spec requires and the SDK leaves optional',
      { required: ['id', 'text', 'author', 'lang'] },
      'GET /api/v1/x/tweets/{tweetId} response required lang',
    ],
    [
      'a field a later allOf part requires and the SDK leaves optional',
      { requiredLater: ['lang'] },
      'GET /api/v1/x/tweets/{tweetId} response required lang',
    ],
    [
      'a field only the SDK makes nullable',
      { author: { username: { type: 'string' }, name: { type: 'string' } } },
      'GET /api/v1/x/tweets/{tweetId} response nullable author.name',
    ],
  ])('fails and names %s', (_, options, line) => {
    const result = runCheck({ spec: makeSpec(options) });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(`${line}\n${next}`);
    expect(result.status).toBe(1);
  });

  it('allows extra SDK fields under an object the spec leaves open', () => {
    const result = runCheck({
      spec: makeSpec({ response: withoutLang, open: true }),
    });

    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
  });

  it('passes an accepted difference and counts it', () => {
    const result = runCheck({
      spec: makeSpec({ response: withoutLang }),
      accepted: [
        {
          reason: 'Kept for older callers.',
          differences: ['GET /api/v1/x/tweets/{tweetId} response extra lang'],
        },
      ],
    });

    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(
      "The SDK's fields match the API for 2 operations, and accepted-field-differences.json lists 1 accepted difference.\n",
    );
    expect(result.status).toBe(0);
  });

  it('fails on an accepted difference the check no longer finds', () => {
    const result = runCheck({
      accepted: [
        {
          reason: 'Kept for older callers.',
          differences: ['GET /api/v1/x/tweets/{tweetId} response extra lang'],
        },
      ],
    });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(
      'accepted-field-differences.json lists GET /api/v1/x/tweets/{tweetId} response extra lang, which the check no longer finds. Remove it.\n' +
        'Remove each difference above from accepted-field-differences.json.\n',
    );
    expect(result.status).toBe(1);
  });

  it.each<[string, string | Accepted | null, string]>([
    ['is missing', null, 'The repository root has no such file'],
    ['is not JSON', '[{"reason": "x" "differences": []}]', 'It is not JSON near position 16'],
    [
      'has a group without a reason',
      [{ reason: '', differences: ['GET /a response extra b'] }],
      'Group 1 needs a reason',
    ],
    [
      'has a group without differences',
      [{ reason: 'x', differences: [] }],
      'Group 1 needs at least 1 difference',
    ],
    [
      'lists a difference without a kind',
      [{ reason: 'x', differences: ['GET /api/v1/x/tweets response lang'] }],
      'Group 1 lists "GET /api/v1/x/tweets response lang", which needs a method, a path, request or response, a kind and a field, such as GET /api/v1/events response missing events[].data.followedAt',
    ],
    [
      'lists a difference twice',
      [
        { reason: 'x', differences: ['GET /a response extra b'] },
        { reason: 'y', differences: ['GET /a response extra b'] },
      ],
      'It lists GET /a response extra b more than once',
    ],
  ])('fails when accepted-field-differences.json %s', (_, accepted, problem) => {
    const result = runCheck({ accepted });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(`accepted-field-differences.json is not valid. ${problem}.\n`);
    expect(result.status).toBe(1);
  });

  it('fails with the next step when the spec cannot be read', () => {
    const { root, ...result } = runCheck({ spec: '{"paths": ' });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(
      `Could not read the API spec from ${join(root, 'openapi.json')}. Check network access, or set XQUIK_OPENAPI_SPEC to a local copy of https://xquik.com/openapi.json.\n`,
    );
    expect(result.status).toBe(1);
  });

  it('names the method, file and line of a request whose fields it cannot read', () => {
    const result = runCheck({
      resource: `${header}
export class Tweets extends APIResource {
  retrieve(route: string): APIPromise<unknown> {
    return this._client.get(route);
  }
}
`,
    });

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(
      'Could not read the fields of retrieve at src/resources/tweets.ts line 6, because its path route is not a string or a path template.\n',
    );
    expect(result.status).toBe(1);
  });

  describe('with 1 operation', () => {
    const operationSpec = (route: string, operation: object, schemas: object = {}): object => ({
      servers: [{ url: 'https://xquik.com' }],
      paths: { [`/api/v1${route}`]: operation },
      components: { schemas },
    });

    const json = (schema: object) => ({ content: { 'application/json': { schema } } });

    const resourceWith = (methods: string, types: string) =>
      `${header}\nexport class Tweets extends APIResource {\n${methods}\n}\n\n${types}\n`;

    const createMethod = `  create(body: TweetCreateParams, options?: object): APIPromise<TweetCreateResponse> {
    return this._client.post('/x/tweets', { body, ...options });
  }`;

    const createBody = {
      requestBody: json({
        type: 'object',
        required: ['account', 'text'],
        properties: {
          account: { type: 'string' },
          text: { type: 'string' },
          quoteTweetId: { type: 'string' },
        },
      }),
    };

    it.each<[string, string, string]>([
      [
        'a body field the SDK lacks',
        'export interface TweetCreateParams {\n  account: string;\n  text: string;\n}',
        'POST /api/v1/x/tweets request missing quoteTweetId',
      ],
      [
        'a body field the spec lacks',
        'export interface TweetCreateParams {\n  account: string;\n  text: string;\n  quoteTweetId?: string;\n  draft?: boolean;\n}',
        'POST /api/v1/x/tweets request extra draft',
      ],
    ])('fails on %s', (_, params, line) => {
      const result = runCheck({
        spec: operationSpec('/x/tweets', {
          post: {
            ...createBody,
            responses: { '201': json({ type: 'object', properties: { id: { type: 'string' } } }) },
          },
        }),
        resource: resourceWith(
          createMethod,
          `${params}\n\nexport interface TweetCreateResponse {\n  id?: string;\n}`,
        ),
      });

      expect(result.stdout).toBe('');
      expect(result.stderr).toBe(`${line}\n${next}`);
      expect(result.status).toBe(1);
    });

    it('merges several 2xx bodies, where a field is required only when every body requires it', () => {
      const result = runCheck({
        spec: operationSpec('/x/tweets', {
          post: {
            ...createBody,
            responses: {
              '200': json({
                type: 'object',
                required: ['id', 'status'],
                properties: { id: { type: 'string' }, status: { type: 'string' } },
              }),
              '202': json({ type: 'object', required: ['id'], properties: { id: { type: 'string' } } }),
            },
          },
        }),
        resource: resourceWith(
          createMethod,
          'export interface TweetCreateParams {\n  account: string;\n  text: string;\n  quoteTweetId?: string;\n}\n\nexport interface TweetCreateResponse {\n  id: string;\n  status: string;\n}',
        ),
      });

      expect(result.stderr).toBe(`POST /api/v1/x/tweets response required status\n${next}`);
      expect(result.status).toBe(1);
    });

    it('intersects the items of an allOf of 2 arrays', () => {
      const result = runCheck({
        spec: operationSpec('/x/tweets', {
          post: {
            ...createBody,
            responses: {
              '201': json({
                type: 'object',
                properties: {
                  tags: {
                    allOf: [
                      { type: 'array', items: { type: 'object', properties: { name: { type: 'string' } } } },
                      { type: 'array', items: { type: 'object', properties: { url: { type: 'string' } } } },
                    ],
                  },
                },
              }),
            },
          },
        }),
        resource: resourceWith(
          createMethod,
          'export interface TweetCreateParams {\n  account: string;\n  text: string;\n  quoteTweetId?: string;\n}\n\nexport interface TweetCreateResponse {\n  tags?: Array<{ name?: string }>;\n}',
        ),
      });

      expect(result.stderr).toBe(`POST /api/v1/x/tweets response missing tags[].url\n${next}`);
      expect(result.status).toBe(1);
    });

    it.each<[string, object, object, string]>([
      ['a free-form object', { meta: { type: 'object' } }, {}, 'meta?: { source?: string };'],
      [
        'a cycle',
        { thread: { $ref: '#/components/schemas/Thread' } },
        { Thread: { type: 'object', properties: { reply: { $ref: '#/components/schemas/Thread' } } } },
        'thread?: { reply?: { reply?: { depth?: number } } };',
      ],
    ])('stops the walk at %s', (_, properties, schemas, field) => {
      const result = runCheck({
        spec: operationSpec(
          '/x/tweets',
          { post: { ...createBody, responses: { '201': json({ type: 'object', properties }) } } },
          schemas,
        ),
        resource: resourceWith(
          createMethod,
          `export interface TweetCreateParams {\n  account: string;\n  text: string;\n  quoteTweetId?: string;\n}\n\nexport interface TweetCreateResponse {\n  ${field}\n}`,
        ),
      });

      expect(result.stderr).toBe('');
      expect(result.stdout).toBe(
        "The SDK's fields match the API for 1 operation, and accepted-field-differences.json lists 0 accepted differences.\n",
      );
      expect(result.status).toBe(0);
    });

    it('drops an SDK parameter that carries a path parameter', () => {
      const result = runCheck({
        spec: operationSpec('/x/tweets/{tweetId}', {
          get: {
            parameters: [
              { name: 'tweetId', in: 'path', required: true, schema: { type: 'string' } },
              { name: 'fields', in: 'query', schema: { type: 'string' } },
            ],
            responses: { '200': json({ type: 'object', properties: { id: { type: 'string' } } }) },
          },
        }),
        resource: resourceWith(
          `  retrieve(query: TweetRetrieveParams): APIPromise<TweetRetrieveResponse> {
    return this._client.get(path\`/x/tweets/\${query.tweetId}\`, { query });
  }`,
          'export interface TweetRetrieveParams {\n  tweetId: string;\n  fields?: string;\n}\n\nexport interface TweetRetrieveResponse {\n  id?: string;\n}',
        ),
      });

      expect(result.stderr).toBe('');
      expect(result.status).toBe(0);
    });

    it('reports a field the SDK types as another kind as missing', () => {
      const result = runCheck({
        spec: operationSpec('/x/tweets', {
          post: {
            ...createBody,
            responses: {
              '201': json({
                type: 'object',
                properties: { author: { type: 'object', properties: { username: { type: 'string' } } } },
              }),
            },
          },
        }),
        resource: resourceWith(
          createMethod,
          'export interface TweetCreateParams {\n  account: string;\n  text: string;\n  quoteTweetId?: string;\n}\n\nexport interface TweetCreateResponse {\n  author?: string;\n}',
        ),
      });

      expect(result.stderr).toBe(`POST /api/v1/x/tweets response missing author\n${next}`);
      expect(result.status).toBe(1);
    });

    it('reports a JSON response the SDK does not type', () => {
      const result = runCheck({
        spec: operationSpec('/x/tweets', {
          post: {
            ...createBody,
            responses: {
              '201': json({
                type: 'object',
                properties: { id: { type: 'string' }, status: { type: 'string' } },
              }),
            },
          },
        }),
        resource: resourceWith(
          `  create(body: TweetCreateParams, options?: object): APIPromise<void> {
    return this._client.post('/x/tweets', { body, ...options });
  }`,
          'export interface TweetCreateParams {\n  account: string;\n  text: string;\n  quoteTweetId?: string;\n}',
        ),
      });

      expect(result.stderr).toBe(
        `POST /api/v1/x/tweets response missing id\nPOST /api/v1/x/tweets response missing status\n${next}`,
      );
      expect(result.status).toBe(1);
    });

    it('reads each instance of a generic type on its own', () => {
      const page = (properties: object) =>
        json({
          type: 'object',
          properties: { data: { type: 'array', items: { type: 'object', properties } } },
        });
      const result = runCheck({
        spec: {
          servers: [{ url: 'https://xquik.com' }],
          paths: {
            '/api/v1/x/users': { get: { responses: { '200': page({ name: { type: 'string' } }) } } },
            '/api/v1/x/tweets': { get: { responses: { '200': page({ text: { type: 'string' } }) } } },
          },
        },
        resource: resourceWith(
          `  users(): APIPromise<Page<User>> {
    return this._client.get('/x/users');
  }

  tweets(): APIPromise<Page<Tweet>> {
    return this._client.get('/x/tweets');
  }`,
          'export interface Page<T> {\n  data?: Array<T>;\n}\n\nexport interface User {\n  name?: string;\n}\n\nexport interface Tweet {\n  text?: string;\n}',
        ),
      });

      expect(result.stderr).toBe('');
      expect(result.status).toBe(0);
    });

    it.each<[string, string, string]>([
      [
        'an arrow property',
        "  create = (body: TweetCreateParams): APIPromise<TweetCreateResponse> => this._client.post('/x/tweets', { body });",
        '/x/tweets',
      ],
      ['a path the spec ends with a slash', createMethod, '/x/tweets/'],
    ])('fails on an operation it cannot read from %s', (_, method, route) => {
      const result = runCheck({
        spec: operationSpec(route, {
          post: {
            ...createBody,
            responses: { '201': json({ type: 'object', properties: { id: { type: 'string' } } }) },
          },
        }),
        resource: resourceWith(
          method,
          'export interface TweetCreateParams {\n  account: string;\n  text: string;\n  quoteTweetId?: string;\n}\n\nexport interface TweetCreateResponse {\n  id?: string;\n}',
        ),
      });

      expect(result.stdout).toBe('');
      expect(result.stderr).toBe(
        `POST /api/v1${route} has no SDK method the field check can read.\n` +
          'Write each operation above as a class method that calls this._client, or list it in excluded-operations.json.\n',
      );
      expect(result.status).toBe(1);
    });

    it('fails on a type the compiler cannot resolve', () => {
      const result = runCheck({
        resource: `import { Author } from './missing';\n${tweets.replace('author: { username: string; name?: string | null };', 'author: Author;')}`,
      });

      expect(result.stdout).toBe('');
      expect(result.stderr).toMatch(
        /^Could not read the SDK's types, because the TypeScript compiler reports Cannot find module '\.\/missing'.* at src\/resources\/tweets\.ts line 1\. Fix the type errors first\.\n$/,
      );
      expect(result.status).toBe(1);
    });

    it('fails on a reference the spec does not define', () => {
      const result = runCheck({
        spec: operationSpec('/x/tweets', {
          post: { ...createBody, responses: { '201': json({ $ref: '#/components/schemas/Creatd' }) } },
        }),
        resource: resourceWith(
          createMethod,
          'export interface TweetCreateParams {\n  account: string;\n  text: string;\n  quoteTweetId?: string;\n}\n\nexport interface TweetCreateResponse {\n  id?: string;\n}',
        ),
      });

      expect(result.stdout).toBe('');
      expect(result.stderr).toBe(
        'Could not resolve #/components/schemas/Creatd in the API spec. Check the spec source.\n',
      );
      expect(result.status).toBe(1);
    });
  });
});
