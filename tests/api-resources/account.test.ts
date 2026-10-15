// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../fixture-client';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource account', () => {
  test('retrieve', async () => {
    const responsePromise = client.account.retrieve();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('setXUsername: only required params', async () => {
    const responsePromise = client.account.setXUsername({ username: 'elonmusk' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('setXUsername: required and optional params', async () => {
    const response = await client.account.setXUsername({ username: 'elonmusk' });
  });

  test('updateLocale: only required params', async () => {
    const responsePromise = client.account.updateLocale({ locale: 'en' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('updateLocale: required and optional params', async () => {
    const response = await client.account.updateLocale({ locale: 'en' });
  });

  test('updateLocale: returns the fields the route did not read', async () => {
    const example: XTwitterScraper.AccountUpdateLocaleResponse = {
      success: true,
      ignoredFields: ['timezone'],
    };
    const { client: fixture } = fixtureClient(example);

    const response: XTwitterScraper.AccountUpdateLocaleResponse = await fixture.account.updateLocale({
      locale: 'en',
    });

    expect(response).toEqual(example);
  });
});
