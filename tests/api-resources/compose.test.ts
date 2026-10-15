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

describe('resource compose', () => {
  test('create: only required params', async () => {
    const responsePromise = client.compose.create({ step: 'compose', topic: 'PostgreSQL query planning' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await client.compose.create({
      step: 'compose',
      topic: 'PostgreSQL query planning',
      goal: 'engagement',
      styleUsername: 'example_user',
    });
  });

  test('create: returns the multiplier text the API sends now', async () => {
    const example: XTwitterScraper.ComposeCreateResponse.ComposePrepareResult = {
      contentRules: [{ rule: 'Lead with the claim.' }],
      engagementMultipliers: [{ action: 'Reply', multiplier: 'Source default. Production value can vary.' }],
      engagementVelocity: 'The first hour decides reach.',
      followUpQuestions: ['Who is the audience?'],
      intentUrl: 'https://x.com/intent/tweet?text=PostgreSQL%2018%20reduced%20query%20latency',
      nextStep: 'Answer the questions, then refine the draft.',
      radarRecommendations: [],
      scorerWeights: [],
      source: 'xai/x-algorithm',
      topPenalties: [],
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.ComposeCreateResponse = await fixture.compose.create({
      step: 'compose',
      topic: 'PostgreSQL query planning',
    });

    expect(requests).toEqual(['POST https://xquik.test/api/v1/compose']);
    expect(response).toEqual(example);
  });
});
