// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from '../../../fixture-client';

const client = new XTwitterScraper({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource tweets', () => {
  test('create: only required params', async () => {
    const responsePromise = client.x.tweets.create({
      account: '@elonmusk',
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

  test('create: required and optional params', async () => {
    const response = await client.x.tweets.create({
      account: '@elonmusk',
      'Idempotency-Key': 'Idempotency-Key',
      community_id: '1500000000000000000',
      is_note_tweet: false,
      media: ['https://example.com/video.mp4'],
      reply_to_tweet_id: '1880000000000000000',
      text: 'Just launched our new feature!',
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.x.tweets.retrieve('id');
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
      client.x.tweets.retrieve(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('list: only required params', async () => {
    const responsePromise = client.x.tweets.list({ ids: 'ids' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: required and optional params', async () => {
    const response = await client.x.tweets.list({
      ids: 'ids',
      fields: 'id,text,author.username',
      omit: 'entities,media',
    });
  });

  test('delete: only required params', async () => {
    const responsePromise = client.x.tweets.delete('id', {
      account: '@elonmusk',
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

  test('delete: required and optional params', async () => {
    const response = await client.x.tweets.delete('id', {
      account: '@elonmusk',
      'Idempotency-Key': 'Idempotency-Key',
    });
  });

  test('checkRepost: only required params', async () => {
    const responsePromise = client.x.tweets.checkRepost('id', { user: 'nasa' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('checkRepost: required and optional params', async () => {
    const response = await client.x.tweets.checkRepost('id', {
      user: 'nasa',
      fields: 'id,text,author.username',
      omit: 'entities,media',
    });
  });

  test('embed', async () => {
    const responsePromise = client.x.tweets.embed('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('embed: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.embed(
        'id',
        {
          fields: 'id,text,author.username',
          hideMedia: true,
          hideThread: true,
          omit: 'entities,media',
          omitScript: true,
          theme: 'light',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getFavoriters', async () => {
    const responsePromise = client.x.tweets.getFavoriters('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getFavoriters: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.getFavoriters(
        'id',
        {
          bioContains: 'bioContains',
          blueVerifiedOnly: true,
          businessEmailOnly: true,
          cursor: 'cursor',
          emailDomains: 'acme.com,stanford.edu',
          fields: 'id,text,author.username',
          hasEmail: true,
          hasLocation: true,
          hasWebsite: true,
          locationContains: 'locationContains',
          maxFollowers: 0,
          maxFollowing: 0,
          maxStatuses: 0,
          minAccountAgeDays: 0,
          minFollowers: 0,
          minFollowing: 0,
          minStatuses: 0,
          omit: 'entities,media',
          pageSize: 1,
          usernameContains: 'usernameContains',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getHiddenReplies', async () => {
    const responsePromise = client.x.tweets.getHiddenReplies('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getHiddenReplies: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.getHiddenReplies(
        'id',
        {
          anyWords: 'anyWords',
          blueVerifiedOnly: true,
          cashtags: 'cashtags',
          conversationId: 'conversationId',
          cursor: 'cursor',
          exactPhrase: 'exactPhrase',
          excludeWords: 'excludeWords',
          fields: 'id,text,author.username',
          fromUser: 'fromUser',
          hashtags: 'hashtags',
          inReplyToTweetId: 'inReplyToTweetId',
          language: 'language',
          maxFaves: 0,
          maxId: 'maxId',
          maxQuotes: 0,
          maxReplies: 0,
          maxRetweets: 0,
          mediaType: 'images',
          mentioning: 'mentioning',
          minBookmarks: 0,
          minLikes: 0,
          minQuotes: 0,
          minReplies: 0,
          minRetweets: 0,
          minViews: 0,
          nativeRetweets: true,
          omit: 'entities,media',
          pageSize: 1,
          quotes: 'include',
          quotesOfTweetId: 'quotesOfTweetId',
          replies: 'include',
          retweets: 'include',
          retweetsOfTweetId: 'retweetsOfTweetId',
          sinceDate: '2019-12-27',
          sinceId: 'sinceId',
          toUser: 'toUser',
          untilDate: '2019-12-27',
          url: 'url',
          verifiedOnly: true,
          withinTime: '7d',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getInsights', async () => {
    const responsePromise = client.x.tweets.getInsights('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getInsights: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.getInsights(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getQuotes', async () => {
    const responsePromise = client.x.tweets.getQuotes('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getQuotes: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.getQuotes(
        'id',
        {
          advancedQuery: 'advancedQuery',
          anyWords: 'anyWords',
          blueVerifiedOnly: true,
          boundingBox: 'boundingBox',
          cardName: 'cardName',
          cashtags: 'cashtags',
          conversationId: 'conversationId',
          cursor: 'cursor',
          exactPhrase: 'exactPhrase',
          excludeSource: 'excludeSource',
          excludeWords: 'excludeWords',
          fields: 'id,text,author.username',
          fromUser: 'fromUser',
          geocode: 'geocode',
          hashtags: 'hashtags',
          includeReplies: true,
          inReplyToTweetId: 'inReplyToTweetId',
          keywords: 'keywords',
          language: 'language',
          listId: 'listId',
          maxFaves: 0,
          maxId: 'maxId',
          maxQuotes: 0,
          maxReplies: 0,
          maxRetweets: 0,
          mediaType: 'images',
          mentioning: 'mentioning',
          minBookmarks: 0,
          minLikes: 0,
          minQuotes: 0,
          minReplies: 0,
          minRetweets: 0,
          minViews: 0,
          mode: 'standard',
          nativeRetweets: true,
          near: 'near',
          news: true,
          omit: 'entities,media',
          pageSize: 1,
          place: 'place',
          placeCountry: 'placeCountry',
          pointRadius: 'pointRadius',
          queryType: 'Latest',
          quotes: 'include',
          quotesOfTweetId: 'quotesOfTweetId',
          replies: 'include',
          retweets: 'include',
          retweetsOfTweetId: 'retweetsOfTweetId',
          safe: true,
          sinceDate: '2019-12-27',
          sinceId: 'sinceId',
          sinceTime: 'sinceTime',
          source: 'source',
          toUser: 'toUser',
          untilDate: '2019-12-27',
          untilTime: 'untilTime',
          url: 'url',
          verifiedOnly: true,
          within: 'within',
          withinTime: '7d',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getReplies', async () => {
    const responsePromise = client.x.tweets.getReplies('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getReplies: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.getReplies(
        'id',
        {
          after: 'after',
          anyWords: 'anyWords',
          blueVerifiedOnly: true,
          cashtags: 'cashtags',
          conversationId: 'conversationId',
          cursor: 'cursor',
          exactPhrase: 'exactPhrase',
          excludeOriginalAuthor: true,
          excludeWords: 'excludeWords',
          fields: 'id,text,author.username',
          fromUser: 'fromUser',
          hashtags: 'hashtags',
          hasMediaOnly: true,
          includeHidden: true,
          includeOriginalPost: true,
          inReplyToTweetId: 'inReplyToTweetId',
          language: 'language',
          limit: 1,
          maxDepth: 1,
          maxFaves: 0,
          maxId: 'maxId',
          maxQuotes: 0,
          maxReplies: 0,
          maxRetweets: 0,
          mediaType: 'images',
          mentioning: 'mentioning',
          minBookmarks: 0,
          minLikes: 0,
          minQuotes: 0,
          minReplies: 0,
          minRetweets: 0,
          minViews: 0,
          mode: 'standard',
          nativeRetweets: true,
          omit: 'entities,media',
          pageSize: 1,
          quotes: 'include',
          quotesOfTweetId: 'quotesOfTweetId',
          replies: 'include',
          retweets: 'include',
          retweetsOfTweetId: 'retweetsOfTweetId',
          scope: 'all',
          sinceDate: '2019-12-27',
          sinceId: 'sinceId',
          sinceTime: 'sinceTime',
          sort: 'relevance',
          toUser: 'toUser',
          untilDate: '2019-12-27',
          untilTime: 'untilTime',
          url: 'url',
          verifiedOnly: true,
          withinTime: '7d',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getRetweeterIds', async () => {
    const responsePromise = client.x.tweets.getRetweeterIds('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getRetweeterIds: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.getRetweeterIds(
        'id',
        { cursor: 'cursor', pageSize: 1 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getRetweeters', async () => {
    const responsePromise = client.x.tweets.getRetweeters('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getRetweeters: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.getRetweeters(
        'id',
        {
          bioContains: 'bioContains',
          blueVerifiedOnly: true,
          businessEmailOnly: true,
          cursor: 'cursor',
          emailDomains: 'acme.com,stanford.edu',
          enrichProfiles: true,
          fields: 'id,text,author.username',
          hasEmail: true,
          hasLocation: true,
          hasWebsite: true,
          includeRetweetTimestamp: true,
          locationContains: 'locationContains',
          maxFollowers: 0,
          maxFollowing: 0,
          maxStatuses: 0,
          minAccountAgeDays: 0,
          minFollowers: 0,
          minFollowing: 0,
          minStatuses: 0,
          omit: 'entities,media',
          pageSize: 1,
          usernameContains: 'usernameContains',
          verifiedOnly: true,
          verifiedType: 'verifiedType',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getSubtitles', async () => {
    const responsePromise = client.x.tweets.getSubtitles('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getSubtitles: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.getSubtitles(
        'id',
        { fields: 'id,text,author.username', omit: 'entities,media' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('getThread', async () => {
    const responsePromise = client.x.tweets.getThread('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('getThread: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.getThread(
        'id',
        {
          anyWords: 'anyWords',
          blueVerifiedOnly: true,
          cashtags: 'cashtags',
          conversationId: 'conversationId',
          cursor: 'cursor',
          exactPhrase: 'exactPhrase',
          excludeWords: 'excludeWords',
          fields: 'id,text,author.username',
          fromUser: 'fromUser',
          hashtags: 'hashtags',
          inReplyToTweetId: 'inReplyToTweetId',
          language: 'language',
          maxFaves: 0,
          maxId: 'maxId',
          maxQuotes: 0,
          maxReplies: 0,
          maxRetweets: 0,
          mediaType: 'images',
          mentioning: 'mentioning',
          minBookmarks: 0,
          minLikes: 0,
          minQuotes: 0,
          minReplies: 0,
          minRetweets: 0,
          minViews: 0,
          nativeRetweets: true,
          omit: 'entities,media',
          pageSize: 1,
          quotes: 'include',
          quotesOfTweetId: 'quotesOfTweetId',
          replies: 'include',
          retweets: 'include',
          retweetsOfTweetId: 'retweetsOfTweetId',
          sinceDate: '2019-12-27',
          sinceId: 'sinceId',
          toUser: 'toUser',
          untilDate: '2019-12-27',
          url: 'url',
          verifiedOnly: true,
          withinTime: '7d',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('listTop', async () => {
    const responsePromise = client.x.tweets.listTop();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listTop: request options and params are passed correctly', async () => {
    await expect(
      client.x.tweets.listTop(
        {
          country: 'US',
          cursor: 'cursor',
          fields: 'id,text,author.username',
          language: 'en',
          metric: 'likes',
          omit: 'entities,media',
          pageSize: 1,
          window: 'day',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(XTwitterScraper.NotFoundError);
  });

  test('resolveLinks: only required params', async () => {
    const responsePromise = client.x.tweets.resolveLinks({ urls: 'https://t.co/Xe1nm2pkSX' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('resolveLinks: required and optional params', async () => {
    const response = await client.x.tweets.resolveLinks({
      urls: 'https://t.co/Xe1nm2pkSX',
      fields: 'id,text,author.username',
      omit: 'entities,media',
    });
  });

  test('search: only required params', async () => {
    const responsePromise = client.x.tweets.search({ q: 'q' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('search: required and optional params', async () => {
    const response = await client.x.tweets.search({
      q: 'q',
      advancedQuery: 'advancedQuery',
      anyWords: 'anyWords',
      blueVerifiedOnly: true,
      boundingBox: 'boundingBox',
      cardName: 'cardName',
      cashtags: 'cashtags',
      conversationId: 'conversationId',
      cursor: 'cursor',
      exactPhrase: 'exactPhrase',
      excludeSource: 'excludeSource',
      excludeWords: 'excludeWords',
      fields: 'id,text,author.username',
      fromUser: 'fromUser',
      geocode: 'geocode',
      hashtags: 'hashtags',
      inReplyToTweetId: 'inReplyToTweetId',
      keywords: 'keywords',
      language: 'language',
      limit: 1,
      listId: 'listId',
      maxFaves: 0,
      maxId: 'maxId',
      maxQuotes: 0,
      maxReplies: 0,
      maxRetweets: 0,
      mediaType: 'images',
      mentioning: 'mentioning',
      minBookmarks: 0,
      minLikes: 0,
      minQuotes: 0,
      minReplies: 0,
      minRetweets: 0,
      minViews: 0,
      mode: 'standard',
      nativeRetweets: true,
      near: 'near',
      news: true,
      omit: 'entities,media',
      place: 'place',
      placeCountry: 'placeCountry',
      pointRadius: 'pointRadius',
      queryType: 'queryType',
      quotes: 'include',
      quotesOfTweetId: 'quotesOfTweetId',
      replies: 'include',
      retweets: 'include',
      retweetsOfTweetId: 'retweetsOfTweetId',
      safe: true,
      sinceDate: '2019-12-27',
      sinceId: 'sinceId',
      sinceTime: 'sinceTime',
      source: 'source',
      toUser: 'toUser',
      untilDate: '2019-12-27',
      untilTime: 'untilTime',
      url: 'url',
      verifiedOnly: true,
      within: 'within',
      withinTime: '7d',
    });
  });

  test('translate: only required params', async () => {
    const responsePromise = client.x.tweets.translate('id', { language: 'tr' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('translate: required and optional params', async () => {
    const response = await client.x.tweets.translate('id', {
      language: 'tr',
      fields: 'id,text,author.username',
      omit: 'entities,media',
    });
  });

  test('getReplies: returns the time before which X shows only part of the replies', async () => {
    const example: XTwitterScraper.X.TweetGetRepliesResponse = {
      tweets: [],
      has_next_page: false,
      next_cursor: '',
      partialBefore: '2026-10-06T00:00:00.000Z',
    };
    const { client: fixture } = fixtureClient(example);

    const response: XTwitterScraper.X.TweetGetRepliesResponse = await fixture.x.tweets.getReplies('1');

    expect(response).toEqual(example);
  });

  test('getReplies: returns every embedded retweeted post field', async () => {
    const example: XTwitterScraper.X.TweetGetRepliesResponse = {
      tweets: [
        {
          id: '1',
          bookmarkCount: 0,
          likeCount: 0,
          quoteCount: 0,
          replyCount: 0,
          retweetCount: 0,
          text: 'RT @NASA Just launched!',
          viewCount: 0,
          retweeted_tweet: {
            id: '1234567890',
            bookmarkCount: 2,
            likeCount: 42,
            quoteCount: 1,
            replyCount: 3,
            retweetCount: 5,
            text: 'Just launched!',
            viewCount: 1500,
            article: { id: 'article-1', title: 'Launch update', previewText: 'Just launched!' },
            author: {
              id: '11348282',
              name: 'NASA',
              username: 'NASA',
              followers: 92376187,
              isBlueVerified: true,
              profilePictureOriginal: 'https://pbs.twimg.com/profile_images/1321163587679784960/0ZxKlEKB.jpg',
              identityVerification: { isIdentityVerified: false, verifiedSinceMsec: '1249674830941' },
            },
            authorUnavailable: { reason: 'NotFound', message: 'This account no longer exists.' },
            card: { name: 'summary', url: 'https://www.nasa.gov/' },
            cashtagAttachments: [{ cashtag: '$TSLA', candleSize: '5m', timeframe: '1D' }],
            communityId: '1500000000000000000',
            communityName: 'Build in Public',
            communityNote: { id: 'note-1', title: 'Readers added context' },
            contentDisclosure: {
              advertising: { isPaidPromotion: false },
              aiGenerated: { hasAiGeneratedMedia: false },
            },
            conversationControl: {
              allowedCountryCodes: ['TR'],
              inviteViaMention: true,
              mode: 'country_of_origin',
              ownerId: '1902917852849385472',
              ownerUsername: 'NASA',
              policy: 'by_invitation',
            },
            conversationId: '1234567890',
            coordinates: { coordinates: [-80.65, 28.58], type: 'Point' },
            createdAt: '2025-01-15T12:00:00Z',
            displayTextRange: [0, 14],
            edit: { editTweetIds: ['1234567890'], editableUntilMsecs: '1790204843000' },
            entities: {
              hashtags: [{ text: 'Artemis', indices: [0, 7] }],
              urls: [{ expanded_url: 'https://www.nasa.gov/', url: 'https://t.co/example' }],
              user_mentions: [{ id_str: '11348282', name: 'NASA', screen_name: 'NASA' }],
            },
            exclusiveContent: { creatorUserName: 'NASA', subscribeUrl: 'https://x.com/NASA/subscribe' },
            geo: { coordinates: [28.58, -80.65], type: 'Point' },
            grokShareAttachment: { conversationId: 'grok-1' },
            grokTranslatedPost: { text: 'Translation', lang: 'en' },
            hasCommunityNotes: true,
            inReplyToId: '1234567889',
            inReplyToUserId: '9876543210',
            inReplyToUsername: 'example_user',
            interstitial: { displayType: 'NonCompliant', text: { text: 'Public interest notice' } },
            isLimitedReply: true,
            isNoteTweet: true,
            isPinned: false,
            isQuoteStatus: true,
            isReply: true,
            isRetweet: false,
            isTranslatable: true,
            jetfuelAttachment: { id: 'attachment-1' },
            lang: 'en',
            limitedActions: [{ action: 'Reply', prompt: { ctaType: 'SeeConversation' } }],
            media: [
              {
                mediaUrl: 'https://pbs.twimg.com/media/HS7wh0rXMAA61bq.jpg',
                type: 'photo',
                url: 'https://t.co/QQGjcE6KKq',
                height: 1125,
                width: 2000,
              },
            ],
            noteTweet: {
              text: 'Complete launch update',
              richtextTags: [{ fromIndex: 0, toIndex: 8, types: ['Bold'] }],
            },
            parentTweet: { id: 'parent-1', custom: { preserved: true } },
            place: { id: 'place-1', country: 'United States', name: 'Kennedy Space Center' },
            possiblySensitive: false,
            postCta: { text: 'Read more' },
            previousCounts: {
              bookmarkCount: 1,
              likeCount: 40,
              quoteCount: 0,
              replyCount: 2,
              retweetCount: 4,
            },
            quoted_tweet: { id: 'quote-1', custom: ['preserved'] },
            quotedTweetId: 'quote-1',
            quotedTweetPermalink: {
              displayUrl: 'x.com/NASA/status/quote-1',
              expandedUrl: 'https://x.com/NASA/status/quote-1',
              url: 'https://t.co/quote',
            },
            quotedTweetUnavailable: { reason: 'Suspended' },
            reactionContext: {
              reactedToPostId: 'reaction-1',
              reactedToUser: { id: '11348282', name: 'NASA', username: 'NASA' },
            },
            retweeted_tweet: { id: 'retweet-1', custom: 'preserved' },
            retweetedAt: '2026-09-11T20:24:45.000Z',
            scopes: { followers: false },
            source: '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>',
            sportsContext: { gameId: 'game-1', scheduledAtMs: '1790204843000' },
            subscriberBadge: { creatorId: '11348282' },
            textHighlights: [{ startIndex: 5, endIndex: 13 }],
            tombstone: { type: 'Unavailable', text: { text: 'Post unavailable' } },
            type: 'tweet',
            unavailableAuthorId: '9876543210',
            unmentionedUserIds: ['9876543210'],
            url: 'https://x.com/example_user/status/1234567890',
            viewState: 'EnabledWithCount',
          },
        },
      ],
      has_next_page: false,
      next_cursor: '',
    };
    const { client: fixture } = fixtureClient(example);

    const response: XTwitterScraper.X.TweetGetRepliesResponse = await fixture.x.tweets.getReplies('1');
    const retweeted = response.tweets[0]?.retweeted_tweet;
    const createdAt: string | undefined = retweeted?.createdAt;
    const isReply: boolean | undefined = retweeted?.isReply;
    const retweetedAt: string | null | undefined = retweeted?.retweetedAt;

    expect(response).toEqual(example);
    expect(retweeted?.id).toBe('1234567890');
    expect(retweeted?.likeCount).toBe(42);
    expect(createdAt).toBe('2025-01-15T12:00:00Z');
    expect(isReply).toBe(true);
    expect(retweetedAt).toBe('2026-09-11T20:24:45.000Z');
    expect(retweeted?.article?.title).toBe('Launch update');
    expect(retweeted?.author?.username).toBe('NASA');
    expect(retweeted?.author?.identityVerification?.verifiedSinceMsec).toBe('1249674830941');
    expect(retweeted?.conversationControl?.allowedCountryCodes).toEqual(['TR']);
    expect(retweeted?.entities?.hashtags?.[0]?.text).toBe('Artemis');
    expect(retweeted?.media?.[0]?.width).toBe(2000);
    expect(retweeted?.noteTweet?.richtextTags?.[0]?.types).toEqual(['Bold']);
    expect(retweeted?.parentTweet?.['custom']).toEqual({ preserved: true });
    expect(retweeted?.quoted_tweet?.['custom']).toEqual(['preserved']);
    expect(retweeted?.retweeted_tweet?.['custom']).toBe('preserved');
  });

  test('retrieve: returns the account a tombstone mentions', async () => {
    const example: XTwitterScraper.X.TweetRetrieveResponse = {
      tweet: {
        id: '1',
        text: '',
        bookmarkCount: 0,
        likeCount: 0,
        quoteCount: 0,
        replyCount: 0,
        retweetCount: 0,
        viewCount: 0,
        tombstone: {
          text: {
            text: 'This post is from an account that no longer exists.',
            entities: [
              {
                fromIndex: 0,
                toIndex: 4,
                ref: { type: 'TimelineMention', screenName: 'xquikcom', text: 'xquikcom' },
              },
            ],
          },
        },
      },
    };
    const { client: fixture } = fixtureClient(example);

    const response: XTwitterScraper.X.TweetRetrieveResponse = await fixture.x.tweets.retrieve('1');

    expect(response).toEqual(example);
  });
});
