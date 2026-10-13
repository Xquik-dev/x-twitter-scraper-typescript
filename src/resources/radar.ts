// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * AI tweet composition, drafts, writing styles, and radar
 */
export class Radar extends APIResource {
  /**
   * Returns current topics and sources for writing research.
   */
  retrieveTrendingTopics(
    query: RadarRetrieveTrendingTopicsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<RadarRetrieveTrendingTopicsResponse> {
    return this._client.get('/radar', { query, ...options });
  }
}

/**
 * Trending topic with score, category, source, region, language, and
 * source-specific metadata.
 */
export interface RadarItem {
  /**
   * Radar item identifier.
   */
  id: string;

  category: 'general' | 'tech' | 'dev' | 'science' | 'culture' | 'politics' | 'business' | 'entertainment';

  createdAt: string;

  /**
   * BCP-47 language code. und means the source did not identify a language.
   */
  language: string;

  /**
   * Source fields vary:
   * - reddit: { author, authorId?, subreddit, subredditId?, subredditSubscribers?,
   *   sourceFormat, score?, upvoteRatio?, estimatedUpvotes?, estimatedDownvotes?,
   *   numberComments?, numberCrossposts?, selftext?, contentUrl?, domain?,
   *   postHint?, linkFlairText?, distinguished?, totalAwardsReceived?, viewCount?,
   *   editedAt?, galleryImageUrls?, redditVideo?, archived?, contestMode?,
   *   isCrosspostable?, isMeta?, isNsfw?, isOriginalContent?, isRobotIndexable?,
   *   isSelf?, isSpoiler?, isVideo?, locked?, stickied? }.
   * - github: { starsToday }
   * - hacker_news: { points, numberComments }
   * - google_trends: { approxTraffic }
   * - polymarket: { volume24hr }
   * - wikipedia: { views }
   * - trustmrr: { mrr, growthPercent, last30Days, total, customers,
   *   activeSubscriptions, onSale, xHandle?, category?, askingPrice?, country?,
   *   foundedDate?, googleSearchImpressionsLast30Days?, growthMrrPercent?,
   *   multiple?, paymentProvider?, profitMarginLast30Days?, rank?,
   *   revenuePerVisitor?, targetAudience?, visitorsLast30Days? } Reddit score is
   *   public net. Vote estimates use its fuzzed ratio. Comments are omitted. Startup
   *   xHandle omits @. rank is its growth rank.
   */
  metadata: RadarItem.Metadata;

  publishedAt: string;

  region: string;

  score: number;

  source: 'github' | 'google_trends' | 'hacker_news' | 'polymarket' | 'reddit' | 'trustmrr' | 'wikipedia';

  /**
   * Source-specific identifier used for deduplication.
   */
  sourceId: string;

  title: string;

  description?: string;

  /**
   * Source image. Startup growth items return the logo here.
   */
  imageUrl?: string;

  url?: string;
}

export namespace RadarItem {
  /**
   * Source fields vary:
   * - reddit: { author, authorId?, subreddit, subredditId?, subredditSubscribers?,
   *   sourceFormat, score?, upvoteRatio?, estimatedUpvotes?, estimatedDownvotes?,
   *   numberComments?, numberCrossposts?, selftext?, contentUrl?, domain?,
   *   postHint?, linkFlairText?, distinguished?, totalAwardsReceived?, viewCount?,
   *   editedAt?, galleryImageUrls?, redditVideo?, archived?, contestMode?,
   *   isCrosspostable?, isMeta?, isNsfw?, isOriginalContent?, isRobotIndexable?,
   *   isSelf?, isSpoiler?, isVideo?, locked?, stickied? }.
   * - github: { starsToday }
   * - hacker_news: { points, numberComments }
   * - google_trends: { approxTraffic }
   * - polymarket: { volume24hr }
   * - wikipedia: { views }
   * - trustmrr: { mrr, growthPercent, last30Days, total, customers,
   *   activeSubscriptions, onSale, xHandle?, category?, askingPrice?, country?,
   *   foundedDate?, googleSearchImpressionsLast30Days?, growthMrrPercent?,
   *   multiple?, paymentProvider?, profitMarginLast30Days?, rank?,
   *   revenuePerVisitor?, targetAudience?, visitorsLast30Days? } Reddit score is
   *   public net. Vote estimates use its fuzzed ratio. Comments are omitted. Startup
   *   xHandle omits @. rank is its growth rank.
   */
  export interface Metadata {
    author?: string;

    contentUrl?: string;

    /**
     * Whole number from 0.
     */
    estimatedDownvotes?: number;

    /**
     * Whole number from 0.
     */
    estimatedUpvotes?: number;

    /**
     * Whole number from 0.
     */
    numberComments?: number;

    score?: number;

    selftext?: string;

    /**
     * Current items use html. json and rss are retained for legacy rows.
     */
    sourceFormat?: 'html' | 'json' | 'rss';

    subreddit?: string;

    upvoteRatio?: number;

    [k: string]: unknown;
  }
}

export interface RadarRetrieveTrendingTopicsResponse {
  hasMore: boolean;

  items: Array<RadarItem>;

  /**
   * Opaque cursor for the next page (present only when hasMore is true).
   */
  nextCursor?: string;
}

export interface RadarRetrieveTrendingTopicsParams {
  /**
   * Cursor for pagination, from the prior response's nextCursor. A cursor the radar
   * can't read gets 400 `invalid_input`.
   */
  after?: string;

  /**
   * Filter by category.
   */
  category?: 'general' | 'tech' | 'dev' | 'science' | 'culture' | 'politics' | 'business' | 'entertainment';

  /**
   * Lookback window in hours (1-72, default 6).
   */
  hours?: number;

  /**
   * Number of items to return (1-100, default 50).
   */
  limit?: number;

  /**
   * Region filter. Use `global` or a region code such as `US`, `GB`, `TR`, or `ES`.
   */
  region?: string;

  /**
   * Source filter. One of: github, google_trends, hacker_news, polymarket, reddit,
   * trustmrr, wikipedia
   */
  source?: 'github' | 'google_trends' | 'hacker_news' | 'polymarket' | 'reddit' | 'trustmrr' | 'wikipedia';
}

export declare namespace Radar {
  export {
    type RadarItem as RadarItem,
    type RadarRetrieveTrendingTopicsResponse as RadarRetrieveTrendingTopicsResponse,
    type RadarRetrieveTrendingTopicsParams as RadarRetrieveTrendingTopicsParams,
  };
}
