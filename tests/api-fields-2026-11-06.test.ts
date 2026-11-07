// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

type WriteAction = XTwitterScraper.X.WriteActionRetrieveResponse;

describe('API fields added on 2026-11-06', () => {
  test('bookmark, block and mute return the write record', () => {
    expectTypeOf<XTwitterScraper.X.Tweets.BookmarkCreateResponse>().toEqualTypeOf<WriteAction>();
    expectTypeOf<XTwitterScraper.X.Tweets.BookmarkDeleteResponse>().toEqualTypeOf<WriteAction>();
    expectTypeOf<XTwitterScraper.X.Users.BlockCreateResponse>().toEqualTypeOf<WriteAction>();
    expectTypeOf<XTwitterScraper.X.Users.BlockDeleteResponse>().toEqualTypeOf<WriteAction>();
    expectTypeOf<XTwitterScraper.X.Users.MuteCreateResponse>().toEqualTypeOf<WriteAction>();
    expectTypeOf<XTwitterScraper.X.Users.MuteDeleteResponse>().toEqualTypeOf<WriteAction>();
  });

  test('every write record names the 6 new actions', () => {
    type Added = 'bookmark' | 'unbookmark' | 'block' | 'unblock' | 'mute' | 'unmute';

    expectTypeOf<Added>().toExtend<WriteAction['action']>();
    expectTypeOf<Added>().toExtend<XTwitterScraper.X.Tweets.LikeCreateResponse['action']>();
    expectTypeOf<Added>().toExtend<XTwitterScraper.X.Users.FollowCreateResponse['action']>();
    expectTypeOf<Added>().toExtend<XTwitterScraper.X.DmSendResponse['action']>();
  });

  test('MonitorFollow says why a removed account is back', () => {
    expectTypeOf<XTwitterScraper.MonitorFollow['followKind']>().toEqualTypeOf<
      'refollow' | 'return' | undefined
    >();
  });

  test('media download items carry the poster and MP4 sizes', () => {
    type Item = XTwitterScraper.X.MediaDownloadResponse.Item;

    expectTypeOf<Item['posterUrl']>().toEqualTypeOf<string | null>();
    expectTypeOf<Item['qualities']>().toEqualTypeOf<
      Array<{ bitrate: number; height: number; url: string; width: number }>
    >();
  });

  test('flat extraction results carry the quoted media', () => {
    expectTypeOf<XTwitterScraper.ExtractionRetrieveResponse.Result['quotedMedia']>().toEqualTypeOf<
      Array<XTwitterScraper.TweetMedia> | undefined
    >();
  });

  test('flat extraction results carry the sensitive flags and the quoted post', () => {
    type Result = XTwitterScraper.ExtractionRetrieveResponse.Result;

    expectTypeOf<Result['possiblySensitive']>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<Result['quotedPossiblySensitive']>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<NonNullable<Result['quotedPost']>['text']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<NonNullable<NonNullable<Result['quotedPost']>['author']>['userName']>().toEqualTypeOf<
      string | undefined
    >();
  });

  test('a post monitor returns the author affiliate and starts paused on request', () => {
    type Affiliate = NonNullable<XTwitterScraper.Monitors.PostMonitor['authorAffiliate']>;

    expectTypeOf<Affiliate['badgeUrl']>().toEqualTypeOf<string>();
    expectTypeOf<Affiliate['description']>().toEqualTypeOf<string>();
    expectTypeOf<Affiliate['url']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<XTwitterScraper.Monitors.PostCreateParams['isActive']>().toEqualTypeOf<
      boolean | undefined
    >();
  });

  test('an article says which counts X did not send', () => {
    type Article = XTwitterScraper.X.XGetArticleResponse['article'];

    expectTypeOf<'viewCount'>().toExtend<NonNullable<Article['unknownCounts']>[number]>();
  });

  test('an extraction row says when its author deleted the post', () => {
    type Row = XTwitterScraper.ExtractionRetrieveResponse.Result;

    expectTypeOf<Row['isDeleted']>().toEqualTypeOf<boolean | undefined>();
  });

  test('user insights and shadowban reads take limit', () => {
    expectTypeOf<XTwitterScraper.X.UserRetrieveInsightsParams['limit']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<XTwitterScraper.X.UserRetrieveShadowbanParams['limit']>().toEqualTypeOf<
      number | undefined
    >();
  });

  test('every extraction tool type takes user_affiliates', () => {
    expectTypeOf<'user_affiliates'>().toExtend<XTwitterScraper.ExtractionJob['toolType']>();
    expectTypeOf<'user_affiliates'>().toExtend<
      NonNullable<XTwitterScraper.ExtractionListParams['toolType']>
    >();
    expectTypeOf<'user_affiliates'>().toExtend<XTwitterScraper.ExtractionEstimateCostParams['toolType']>();
    expectTypeOf<'user_affiliates'>().toExtend<XTwitterScraper.ExtractionRunParams['toolType']>();
  });

  test('a tweet search can run without q', () => {
    expectTypeOf<{ fromUser: string }>().toExtend<XTwitterScraper.X.TweetSearchParams>();
  });
});
