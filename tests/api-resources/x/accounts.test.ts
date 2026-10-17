// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../../fixture-client';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource accounts', () => {
  test('create: only required params', async () => {
    const responsePromise = client.x.accounts.create({
      email: 'account@example.invalid',
      password: '<ACCOUNT_PASSWORD>',
      totp_secret: '<TOTP_SECRET>',
      username: 'your_x_username',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await client.x.accounts.create({
      email: 'account@example.invalid',
      password: '<ACCOUNT_PASSWORD>',
      totp_secret: '<TOTP_SECRET>',
      username: 'your_x_username',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.x.accounts.retrieve('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list', async () => {
    const responsePromise = client.x.accounts.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: request options and params are passed correctly', async () => {
    await expect(
      client.x.accounts.list({ cursor: 'cursor', limit: 1 }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('delete', async () => {
    const responsePromise = client.x.accounts.delete('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('bulkRetry', async () => {
    const responsePromise = client.x.accounts.bulkRetry();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('bulkRetry sends accountIds in the JSON body', async () => {
    const { client: fixture, requests, sent } = fixtureClient({ cleared: 2 });

    await fixture.x.accounts.bulkRetry({ accountIds: ['1', 'xacct_2'] });

    expect(requests).toEqual(['POST https://xquik.test/api/v1/x/accounts/bulk-retry']);
    expect(await sent[0]!.json()).toEqual({ accountIds: ['1', 'xacct_2'] });
  });

  test('bulkRetry omits accountIds when no params are provided', async () => {
    const { client: fixture, requests, sent } = fixtureClient({ cleared: 2 });

    await fixture.x.accounts.bulkRetry();

    expect(requests).toEqual(['POST https://xquik.test/api/v1/x/accounts/bulk-retry']);
    expect(await sent[0]!.json()).toEqual({});
  });

  test('reauth: only required params', async () => {
    const responsePromise = client.x.accounts.reauth('id', { password: '<ACCOUNT_PASSWORD>' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('reauth: required and optional params', async () => {
    const response = await client.x.accounts.reauth('id', {
      password: '<ACCOUNT_PASSWORD>',
      email: 'account@example.invalid',
      totp_secret: '<TOTP_SECRET>',
    });
  });
});
