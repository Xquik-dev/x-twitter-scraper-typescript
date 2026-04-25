// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * AI tweet composition, drafts, writing styles, and radar
 */
export class Radar extends APIResource {
  /**
   * Get trending topics from curated sources
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
   * Internal numeric identifier (stringified bigint).
   */
  id: string;

  category: 'general' | 'tech' | 'dev' | 'science' | 'culture' | 'politics' | 'business' | 'entertainment';

  createdAt: string;

  language: string;

  /**
   * Source-specific fields. Shape varies per source:
   *
   * - reddit: { subreddit: string, author: string }
   * - github: { starsToday: number }
   * - hacker_news: { points: number, numberComments: number }
   * - google_trends: { approxTraffic: number }
   * - polymarket: { volume24hr: number }
   * - wikipedia: { views: number }
   * - trustmrr: { mrr, growthPercent, last30Days, total, customers,
   *   activeSubscriptions, onSale, xHandle?, category?, askingPrice?, country?,
   *   growthMrrPercent?, multiple?, paymentProvider?, rank? }
   */
  metadata: { [key: string]: unknown };

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

  imageUrl?: string;

  url?: string;
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
   * Cursor for pagination (from prior response nextCursor).
   */
  after?: string;

  /**
   * Filter by category.
   */
  category?: 'general' | 'tech' | 'dev' | 'science' | 'culture' | 'politics' | 'business' | 'entertainment';

  /**
   * Lookback window in hours (1-168, default 24).
   */
  hours?: number;

  /**
   * Number of items to return (1-100, default 50).
   */
  limit?: number;

  /**
   * Region filter (us, global, etc.)
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
