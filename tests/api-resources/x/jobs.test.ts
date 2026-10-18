// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource jobs', () => {
  test('retrieve', async () => {
    const responsePromise = client.x.jobs.retrieve('1899202395210649861');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve: request options and params are passed correctly', async () => {
    await expect(
      client.x.jobs.retrieve(
        '1899202395210649861',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('listLocations: only required params', async () => {
    const responsePromise = client.x.jobs.listLocations({ q: 'new york' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listLocations: required and optional params', async () => {
    const response = await client.x.jobs.listLocations({
      q: 'new york',
      fields: 'id,text,author.username',
      limit: 5,
      omit: 'entities,media',
    });
  });

  test('search: only required params', async () => {
    const responsePromise = client.x.jobs.search({ q: 'engineer' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('search: required and optional params', async () => {
    const response = await client.x.jobs.search({
      q: 'engineer',
      company: 'SpaceX',
      cursor: 'cursor',
      employmentType: 'full_time',
      fields: 'id,text,author.username',
      location: 'Berlin',
      locationId: '1720462281849397612',
      locationType: 'remote,hybrid',
      omit: 'entities,media',
      pageSize: 1,
      seniority: 'senior,lead',
    });
  });
});
