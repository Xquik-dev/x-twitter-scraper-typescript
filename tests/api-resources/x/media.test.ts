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

describe('resource media', () => {
  test('download', async () => {
    const responsePromise = client.x.media.download({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('upload: only required params', async () => {
    const responsePromise = client.x.media.upload({
      account: '@elonmusk',
      url: 'https://example.com/image.png',
      'Idempotency-Key': 'Idempotency-Key',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('upload: required and optional params', async () => {
    const response = await client.x.media.upload({
      account: '@elonmusk',
      url: 'https://example.com/image.png',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });

  test('upload: sends a file as multipart form data', async () => {
    const { client: fixture, sent } = fixtureClient({});

    await fixture.x.media.upload({
      account: '@elonmusk',
      file: new File(['binary-content'], 'clip.mp4', { type: 'video/mp4' }),
      is_long_video: true,
      'Idempotency-Key': 'Idempotency-Key',
    });

    const form = await sent[0]!.formData();
    expect(sent[0]?.headers.get('content-type')).toMatch(/^multipart\/form-data; boundary=/);
    expect(form.get('account')).toBe('@elonmusk');
    expect(form.get('is_long_video')).toBe('true');
    expect((form.get('file') as File).name).toBe('clip.mp4');
    expect(await (form.get('file') as File).text()).toBe('binary-content');
  });
});
