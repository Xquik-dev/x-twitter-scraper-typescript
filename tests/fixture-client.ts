// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

export const fixtureClient = (
  body: object,
): { client: XTwitterScraper; requests: Array<string>; sent: Array<Request> } => {
  const requests: Array<string> = [];
  const sent: Array<Request> = [];
  const client = new XTwitterScraper({
    apiKey: 'My API Key',
    bearerToken: null,
    baseURL: 'https://xquik.test/api/v1',
    fetch: async (input, init) => {
      const request = new Request(input, init);
      if (request.url.startsWith('data:')) return fetch(request);
      requests.push(`${request.method} ${request.url}`);
      sent.push(request);
      return Response.json(body);
    },
  });
  return { client, requests, sent };
};
