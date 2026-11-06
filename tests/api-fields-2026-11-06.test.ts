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
});
