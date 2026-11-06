// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type XTwitterScraper from 'x-twitter-scraper';
import type { APIPromise } from 'x-twitter-scraper/core/api-promise';
import type { RequestOptions } from 'x-twitter-scraper/internal/request-options';

// The SDK still ships the deprecated create method, and its tests reach it through this type.
type CommunityCreate = {
  create(
    params: XTwitterScraper.X.CommunityCreateParams,
    options?: RequestOptions,
  ): APIPromise<XTwitterScraper.X.CommunityCreateResponse>;
};

export const communityCreate = (client: XTwitterScraper): CommunityCreate => client.x.communities;
