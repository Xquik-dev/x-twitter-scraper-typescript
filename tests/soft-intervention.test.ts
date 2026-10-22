// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';
import { fixtureClient } from './fixture-client';

const label: XTwitterScraper.SoftIntervention = {
  displayType: 'Fosnr',
  engagementNudge: true,
  text: {
    text: "This Post may violate X's rules against Abuse.",
    rtl: false,
    entities: [
      {
        fromIndex: 0,
        toIndex: 9,
        ref: {
          type: 'TimelineUrl',
          url: 'https://help.x.com/rules-and-policies/public-interest',
          urlType: 'ExternalUrl',
        },
      },
    ],
  },
  url: { url: 'https://help.x.com/rules-and-policies/enforcement-options', urlType: 'ExternalUrl' },
};

const labeledPost = {
  id: '1',
  bookmarkCount: 0,
  likeCount: 0,
  quoteCount: 0,
  replyCount: 0,
  retweetCount: 0,
  text: 'Launch update',
  viewCount: 0,
  softIntervention: label,
};

const labelFields = [
  'Fosnr',
  true,
  "This Post may violate X's rules against Abuse.",
  false,
  0,
  9,
  'TimelineUrl',
  'https://help.x.com/rules-and-policies/public-interest',
  'ExternalUrl',
  'https://help.x.com/rules-and-policies/enforcement-options',
  'ExternalUrl',
];

const readLabel = (soft: XTwitterScraper.SoftIntervention | undefined): Array<unknown> => {
  const entity = soft?.text?.entities?.[0];
  return [
    soft?.displayType,
    soft?.engagementNudge,
    soft?.text?.text,
    soft?.text?.rtl,
    entity?.fromIndex,
    entity?.toIndex,
    entity?.ref?.type,
    entity?.ref?.url,
    entity?.ref?.urlType,
    soft?.url?.url,
    soft?.url?.urlType,
  ];
};

describe('softIntervention', () => {
  test('a post detail returns the label on the post and its parent, quoted and reposted posts', async () => {
    const { client } = fixtureClient({
      tweet: {
        ...labeledPost,
        parentTweet: labeledPost,
        quoted_tweet: labeledPost,
        retweeted_tweet: { ...labeledPost, parentTweet: labeledPost },
      },
    });

    const { tweet } = await client.x.tweets.retrieve('1');

    expect(
      [
        tweet.softIntervention,
        tweet.parentTweet?.softIntervention,
        tweet.quoted_tweet?.softIntervention,
        tweet.retweeted_tweet?.softIntervention,
        tweet.retweeted_tweet?.parentTweet?.softIntervention,
      ].map(readLabel),
    ).toEqual(Array(5).fill(labelFields));
  });

  test('a post page returns the label on each post and its quoted post', async () => {
    const { client } = fixtureClient({
      tweets: [{ ...labeledPost, quoted_tweet: labeledPost }],
      has_next_page: false,
      next_cursor: '',
    });

    const { tweets } = await client.x.lists.retrieveTweets('1');

    expect([tweets[0]?.softIntervention, tweets[0]?.quoted_tweet?.softIntervention].map(readLabel)).toEqual([
      labelFields,
      labelFields,
    ]);
  });

  test('an event detail returns the label on the post and its quoted post', async () => {
    const { client } = fixtureClient({
      id: '42',
      type: 'tweet.new',
      monitorId: '7',
      monitorType: 'account',
      occurredAt: '2025-01-15T12:00:00Z',
      data: { ...labeledPost, quoted_tweet: labeledPost },
    });

    const response = await client.events.retrieve('42');
    const data = response.data as XTwitterScraper.EventDetail.MonitorPost;

    expect([data.softIntervention, data.quoted_tweet?.softIntervention].map(readLabel)).toEqual([
      labelFields,
      labelFields,
    ]);
  });

  test('an event list returns the label on each post and its reposted post', async () => {
    const { client } = fixtureClient({
      events: [
        {
          id: '42',
          type: 'tweet.new',
          monitorId: '7',
          monitorType: 'account',
          occurredAt: '2025-01-15T12:00:00Z',
          data: { ...labeledPost, retweeted_tweet: labeledPost },
        },
      ],
      hasMore: false,
    });

    const response = await client.events.list();
    const data = response.events[0]?.data as XTwitterScraper.Event.MonitorPost;

    expect([data.softIntervention, data.retweeted_tweet?.softIntervention].map(readLabel)).toEqual([
      labelFields,
      labelFields,
    ]);
  });
});
