// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XTwitterScraper from 'x-twitter-scraper';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource credits', () => {
  // Mock server tests are disabled
  test.skip('redirectTopupCheckout: only required params', async () => {
    const responsePromise = client.credits.redirectTopupCheckout({ session_id: 'session_id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('redirectTopupCheckout: required and optional params', async () => {
    const response = await client.credits.redirectTopupCheckout({ session_id: 'session_id' });
  });

  // Mock server tests are disabled
  test.skip('retrieveBalance', async () => {
    const responsePromise = client.credits.retrieveBalance();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieveTopupStatus: only required params', async () => {
    const responsePromise = client.credits.retrieveTopupStatus({ session_id: 'session_id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieveTopupStatus: required and optional params', async () => {
    const response = await client.credits.retrieveTopupStatus({ session_id: 'session_id' });
  });

  // Mock server tests are disabled
  test.skip('topupBalance: only required params', async () => {
    const responsePromise = client.credits.topupBalance({ dollars: 10 });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('topupBalance: required and optional params', async () => {
    const response = await client.credits.topupBalance({ dollars: 10, locale: 'en' });
  });
});
