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

describe('resource communityNotes', () => {
  test('listContributorDeletedNotes', async () => {
    const responsePromise = client.x.communityNotes.listContributorDeletedNotes('alias');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listContributorDeletedNotes: request options and params are passed correctly', async () => {
    await expect(
      client.x.communityNotes.listContributorDeletedNotes(
        'alias',
        {
          cursor: 'cursor',
          fields: 'id,text,author.username',
          omit: 'entities,media',
          pageSize: 1,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('listContributorNotes', async () => {
    const responsePromise = client.x.communityNotes.listContributorNotes('alias');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listContributorNotes: request options and params are passed correctly', async () => {
    await expect(
      client.x.communityNotes.listContributorNotes(
        'alias',
        {
          cursor: 'cursor',
          fields: 'id,text,author.username',
          omit: 'entities,media',
          pageSize: 1,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('retrieveContributor', async () => {
    const responsePromise = client.x.communityNotes.retrieveContributor('alias');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieveContributor: request options and params are passed correctly', async () => {
    await expect(
      client.x.communityNotes.retrieveContributor(
        'alias',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('listContributorDeletedNotes: requests the page and returns the deleted notes', async () => {
    const example: XTwitterScraper.X.CommunityNoteListContributorDeletedNotesResponse = {
      notes: [
        {
          id: '2078950499982696756',
          createdAt: '2026-07-19T21:09:58.885Z',
          ratingStatus: 'CurrentlyRatedNotHelpful',
          notHelpfulTags: ['MissingKeyPoints', 'Incorrect'],
          decidedBy: 'CoreModel (v1.1)',
          fullyVisibleModel: true,
          abovePcrhThreshold: false,
          appealStatus: 'NotAppealed',
          deleted: true,
          tombstone: 'This note has been deleted',
          isApiAuthor: false,
          isMediaNote: false,
          mediaNoteMatchCount: 0,
          isUrlNote: false,
        },
      ],
      has_next_page: false,
      next_cursor: '',
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.X.CommunityNoteListContributorDeletedNotesResponse =
      await fixture.x.communityNotes.listContributorDeletedNotes('ardent-beach-friarbird', {
        cursor: '-1767098234260',
        pageSize: 10,
      });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/community-notes/contributors/ardent-beach-friarbird/deleted-notes?cursor=-1767098234260&pageSize=10',
    ]);
    expect(response).toEqual(example);
    expect(response.notes[0]?.tombstone).toBe('This note has been deleted');
  });

  test('listContributorNotes: requests the page and returns the notes with their posts', async () => {
    const example: XTwitterScraper.X.CommunityNoteListContributorNotesResponse = {
      notes: [
        {
          id: '2026375778254868976',
          createdAt: '2026-02-24T19:16:48.435Z',
          language: 'en',
          classification: 'MisinformedOrPotentiallyMisleading',
          contributor: {
            alias: 'ardent-beach-friarbird',
            notesCount: { currentlyRatedHelpful: 1, currentlyRatedNotHelpful: 2 },
            ratingsCount: {
              successful: { total: 49 },
              unsuccessful: { helpfulCount: 15, notHelpfulCount: 4 },
            },
          },
          text: "Since this is a wall of text article and the headline doesn't say, this quick-to-read context is necessary:\n\nDiscord is STILL rolling out Age Verification methods, just delayed to the second half of 2026 per the very own article in this post.\n\nhttps://discord.com/blog/getting-global-age-assurance-right-what-we-got-wrong-and-whats-changing",
          entities: [
            { fromIndex: 244, toIndex: 340, ref: { type: 'TimelineUrl', url: 'https://t.co/7fJbcLrO1k' } },
          ],
          ratingStatus: 'CurrentlyRatedHelpful',
          helpfulTags: ['ImportantContext', 'Clear'],
          decidedBy: 'CoreModel (v1.1)',
          fullyVisibleModel: true,
          abovePcrhThreshold: false,
          appealStatus: 'NotAppealed',
          deleted: false,
          isApiAuthor: false,
          isMediaNote: false,
          mediaNoteMatchCount: 0,
          isUrlNote: false,
          isTranslatable: false,
          timeToHelpfulFromNoteMs: 132890587,
          timeToHelpfulFromPostMs: 136815576,
          postId: '2026359315657805939',
          post: {
            id: '2026359315657805939',
            text: 'Getting Global Age Assurance Right: What We Got Wrong and What’s Changing. \n\nRead the update: https://t.co/h7aRGmN7xW',
            createdAt: 'Tue Feb 24 18:11:23 +0000 2026',
            retweetCount: 542,
            replyCount: 4197,
            likeCount: 3990,
            quoteCount: 1122,
            viewCount: 7038435,
            bookmarkCount: 1472,
            lang: 'en',
            url: 'https://x.com/discord/status/2026359315657805939',
            author: { id: '3065618342', username: 'discord', name: 'Discord', verifiedType: 'Business' },
          },
        },
      ],
      has_next_page: true,
      next_cursor: '-1767098234260',
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.X.CommunityNoteListContributorNotesResponse =
      await fixture.x.communityNotes.listContributorNotes('ardent-beach-friarbird', { pageSize: 10 });

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/community-notes/contributors/ardent-beach-friarbird/notes?pageSize=10',
    ]);
    expect(response).toEqual(example);
    expect(response.notes[0]?.post?.author?.username).toBe('discord');
  });

  test('retrieveContributor: requests the alias and returns the contributor counts', async () => {
    const example: XTwitterScraper.X.CommunityNoteRetrieveContributorResponse = {
      contributor: {
        alias: 'ardent-beach-friarbird',
        deletedNotesCount: 0,
        isApiContributor: false,
        isTopWriter: false,
        notesCount: {
          awaitingMoreRatings: 18,
          currentlyRatedHelpful: 1,
          currentlyRatedNotHelpful: 2,
          updatedAt: '2026-10-12T22:18:40.096Z',
        },
        ratingsCount: {
          awaitingMoreRatings: 703,
          ratedAfterDecision: 154,
          successful: { helpfulCount: 27, notHelpfulCount: 22, total: 49 },
          unsuccessful: { helpfulCount: 15, notHelpfulCount: 4 },
          updatedAt: '2026-10-12T22:50:13.228Z',
        },
      },
    };
    const { client: fixture, requests } = fixtureClient(example);

    const response: XTwitterScraper.X.CommunityNoteRetrieveContributorResponse =
      await fixture.x.communityNotes.retrieveContributor('x.com/i/communitynotes/u/ardent-beach-friarbird');

    expect(requests).toEqual([
      'GET https://xquik.test/api/v1/x/community-notes/contributors/x.com%2Fi%2Fcommunitynotes%2Fu%2Fardent-beach-friarbird',
    ]);
    expect(response).toEqual(example);
    expect(response.contributor.ratingsCount?.successful?.total).toBe(49);
  });
});
