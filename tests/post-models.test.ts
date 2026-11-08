// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type XTwitterScraper from 'x-twitter-scraper';

declare module 'x-twitter-scraper/resources/shared' {
  interface SearchTweet {
    postFieldProbe?: never;
  }

  namespace SearchTweet {
    interface Article {
      articleFieldProbe?: never;
    }

    interface Card {
      cardFieldProbe?: never;
    }
  }
}

describe('post models', () => {
  test('a field added to SearchTweet reaches every post model', () => {
    type Probe = { postFieldProbe?: never };

    expectTypeOf<Pick<XTwitterScraper.EmbeddedTweet, 'postFieldProbe'>>().toEqualTypeOf<Probe>();
    expectTypeOf<Pick<XTwitterScraper.X.TweetDetail, 'postFieldProbe'>>().toEqualTypeOf<Probe>();
    expectTypeOf<Pick<XTwitterScraper.Event.MonitorPost, 'postFieldProbe'>>().toEqualTypeOf<Probe>();
    expectTypeOf<Pick<XTwitterScraper.EventDetail.MonitorPost, 'postFieldProbe'>>().toEqualTypeOf<Probe>();
    expectTypeOf<
      Pick<XTwitterScraper.Event.MonitorPost.QuotedTweet, 'postFieldProbe'>
    >().toEqualTypeOf<Probe>();
    expectTypeOf<
      Pick<XTwitterScraper.Event.MonitorPost.RetweetedTweet, 'postFieldProbe'>
    >().toEqualTypeOf<Probe>();
  });

  test('a field added to a SearchTweet part reaches that part on every post model', () => {
    type ArticleProbe = { articleFieldProbe?: never };
    type CardProbe = { cardFieldProbe?: never };

    expectTypeOf<
      Pick<XTwitterScraper.X.TweetDetail.Article, 'articleFieldProbe'>
    >().toEqualTypeOf<ArticleProbe>();
    expectTypeOf<
      Pick<XTwitterScraper.Event.MonitorPost.Article, 'articleFieldProbe'>
    >().toEqualTypeOf<ArticleProbe>();
    expectTypeOf<Pick<XTwitterScraper.X.TweetDetail.Card, 'cardFieldProbe'>>().toEqualTypeOf<CardProbe>();
    expectTypeOf<Pick<XTwitterScraper.Event.MonitorPost.Card, 'cardFieldProbe'>>().toEqualTypeOf<CardProbe>();
  });
});
