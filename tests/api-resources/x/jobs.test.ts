// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import {
  type Job,
  type JobRetrieveResponse,
  type JobSearchResponse,
} from 'x-twitter-scraper/resources/x/jobs';
import { fixtureClient } from '../../fixture-client';

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

  test('retrieve and search return the same Job model', async () => {
    const retrieveExample: JobRetrieveResponse = {
      job: {
        id: '1899202395210649861',
        title: 'Engineer',
        url: 'https://x.com/i/jobs/1899202395210649861',
        applyUrl: 'https://xquik.com/example',
        location: 'United States',
        locationType: 'remote',
        employmentType: 'full_time',
        seniorityLevel: 'lead',
        jobFunction: 'software_engineering',
        formattedSalary: 'Starting at $225K',
        salaryMin: 225000,
        salaryCurrencyCode: 'USD',
        salaryInterval: 'annually',
        featured: true,
        shortDescription: 'Commonware is hiring founding engineers.',
        description: 'What is Commonware? We build open primitives.',
        descriptionMarkdown: '# What is Commonware?',
        account: {
          id: '1812126202804711425',
          username: 'commonwarexyz',
          name: 'commonware',
          verified: true,
          verifiedType: 'Business',
        },
      },
    };
    const searchExample: JobSearchResponse = {
      jobs: [
        {
          id: '1899202395210649861',
          title: 'Engineer',
          url: 'https://x.com/i/jobs/1899202395210649861',
          applyUrl: 'https://xquik.com/example',
          location: 'United States',
          formattedSalary: 'Starting at $225K',
          salaryMin: 225000,
          salaryCurrencyCode: 'USD',
          salaryInterval: 'annually',
          account: {
            id: '1812126202804711425',
            username: 'commonwarexyz',
            name: 'commonware',
            verified: true,
            verifiedType: 'Business',
          },
        },
      ],
      has_next_page: true,
      next_cursor: 'DAACCgACGRElMJcAAA',
    };
    const retrieveFixture = fixtureClient(retrieveExample);
    const searchFixture = fixtureClient(searchExample);

    const retrieved = await retrieveFixture.client.x.jobs.retrieve('1899202395210649861');
    const searched = await searchFixture.client.x.jobs.search({ q: 'engineer' });
    const jobId = (job: Job): string => job.id;
    const jobs: Array<Job> = [retrieved.job, ...searched.jobs];

    expect(jobs.map(jobId)).toEqual(['1899202395210649861', '1899202395210649861']);
    expect(retrieved).toEqual(retrieveExample);
    expect(searched).toEqual(searchExample);
    expect(retrieveFixture.requests).toEqual(['GET https://xquik.test/api/v1/x/jobs/1899202395210649861']);
    expect(searchFixture.requests).toEqual(['GET https://xquik.test/api/v1/x/jobs/search?q=engineer']);
  });
});
