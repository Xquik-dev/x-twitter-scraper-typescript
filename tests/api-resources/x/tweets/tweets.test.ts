// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
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
});
