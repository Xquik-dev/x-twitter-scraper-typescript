// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper, { toFile } from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource profile', () => {
  // Mock server tests are disabled
  test.skip('update: only required params', async () => {
    const responsePromise = client.x.profile.update({ account: 'account' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('update: required and optional params', async () => {
    const response = await client.x.profile.update({
      account: 'account',
      description: 'description',
      location: 'location',
      name: 'name',
      url: 'url',
    });
  });

  // Mock server tests are disabled
  test.skip('updateAvatar: only required params', async () => {
    const responsePromise = client.x.profile.updateAvatar({
      account: 'account',
      file: await toFile(Buffer.from('Example data'), 'README.md'),
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('updateAvatar: required and optional params', async () => {
    const response = await client.x.profile.updateAvatar({
      account: 'account',
      file: await toFile(Buffer.from('Example data'), 'README.md'),
    });
  });

  // Mock server tests are disabled
  test.skip('updateBanner: only required params', async () => {
    const responsePromise = client.x.profile.updateBanner({
      account: 'account',
      file: await toFile(Buffer.from('Example data'), 'README.md'),
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('updateBanner: required and optional params', async () => {
    const response = await client.x.profile.updateBanner({
      account: 'account',
      file: await toFile(Buffer.from('Example data'), 'README.md'),
    });
  });
});
