// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource tickets', () => {
  test('create: only required params', async () => {
    const responsePromise = client.support.tickets.create({
      body: 'I am unable to connect my X account. Please help.',
      subject: 'Cannot connect X account',
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
    const response = await client.support.tickets.create({
      body: 'I am unable to connect my X account. Please help.',
      subject: 'Cannot connect X account',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.support.tickets.retrieve('tkt_a1b2c3d4e5f6a1b2c3d4e5f6');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('update: only required params', async () => {
    const responsePromise = client.support.tickets.update('tkt_a1b2c3d4e5f6a1b2c3d4e5f6', {
      status: 'resolved',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('update: required and optional params', async () => {
    const response = await client.support.tickets.update('tkt_a1b2c3d4e5f6a1b2c3d4e5f6', {
      status: 'resolved',
    });
  });

  test('list', async () => {
    const responsePromise = client.support.tickets.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('reply: only required params', async () => {
    const responsePromise = client.support.tickets.reply('tkt_a1b2c3d4e5f6a1b2c3d4e5f6', {
      body: 'Thank you for the update.',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('reply: required and optional params', async () => {
    const response = await client.support.tickets.reply('tkt_a1b2c3d4e5f6a1b2c3d4e5f6', {
      body: 'Thank you for the update.',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });
});
