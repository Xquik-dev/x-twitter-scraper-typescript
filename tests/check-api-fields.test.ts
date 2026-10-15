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
};

const makeSpec = ({
  response = responseProperties,
  required = ['id', 'text', 'author'],
  open = false,
  author = { username: { type: 'string' }, name: { type: ['string', 'null'] } },
  statuses = ['queued'],
  query = [{ name: 'fields', in: 'query', schema: { type: 'string' } }],
}: SpecOptions = {}): object => ({
  servers: [{ url: 'https://xquik.com' }],
  paths: {
    '/api/v1/x/tweets/{tweetId}': {
      get: {
        parameters: [{ name: 'tweetId', in: 'path', required: true, schema: { type: 'string' } }, ...query],
        responses: {
          '200': {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required,
                  properties: response,
                  ...(open ? { additionalProperties: true } : {}),
                },
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
          { type: 'object', required: ['status'], properties: { status: { type: 'string', const: 'sent' } } },
        ],
      },
    },
  },
});

const runCheck = ({ spec: source = makeSpec(), accepted = [], resource = tweets }: Case = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'check-api-fields-'));
  try {
    const write = (file: string, content: string) => {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      writeFileSync(join(root, file), content);
    };
    for (const [file, content] of Object.entries(core)) write(file, content);
    write('src/resources/tweets.ts', resource);
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

describe('scripts/utils/check-api-fields.cjs', () => {
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
});
