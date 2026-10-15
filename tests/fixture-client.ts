// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

export const fixtureClient = (body: object): { client: XTwitterScraper; requests: Array<string> } => {
  const requests: Array<string> = [];
  const client = new XTwitterScraper({
    apiKey: 'My API Key',
    bearerToken: null,
    baseURL: 'https://xquik.test/api/v1',
    fetch: async (input, init) => {
      const request = new Request(input, init);
      requests.push(`${request.method} ${request.url}`);
      return Response.json(body);
    },
  });
  return { client, requests };
};
