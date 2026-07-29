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
   * Source-specific fields. Shape varies per source:
   *
   * - reddit: { author, authorId?, subreddit, subredditId?, subredditSubscribers?,
   *   sourceFormat, score?, upvoteRatio?, estimatedUpvotes?, estimatedDownvotes?,
   *   numberComments?, numberCrossposts?, selftext?, contentUrl?, domain?,
   *   postHint?, linkFlairText?, distinguished?, totalAwardsReceived?, viewCount?,
   *   editedAt?, galleryImageUrls?, redditVideo?, archived?, contestMode?,
   *   isCrosspostable?, isMeta?, isNsfw?, isOriginalContent?, isRobotIndexable?,
   *   isSelf?, isSpoiler?, isVideo?, locked?, stickied? }. `score` is Reddit's
   *   public net score. Exact public upvote and downvote counts are not available.
   *   Estimated counts derive from the public score and upvote ratio, which Reddit
   *   may fuzz. Comment bodies are not included. Current items combine public
   *   listing discovery with server-rendered post data and use `sourceFormat: html`;
   *   `json` and `rss` remain for legacy rows.
   * - github: { starsToday: number }
   * - hacker_news: { points: number, numberComments: number }
   * - google_trends: { approxTraffic: number }
   * - polymarket: { volume24hr: number }
   * - wikipedia: { views: number }
   * - trustmrr: { mrr, growthPercent, last30Days, total, customers,
   *   activeSubscriptions, onSale, xHandle?, category?, askingPrice?, country?,
   *   foundedDate?, googleSearchImpressionsLast30Days?, growthMrrPercent?,
   *   multiple?, paymentProvider?, profitMarginLast30Days?, rank?,
   *   revenuePerVisitor?, targetAudience?, visitorsLast30Days? } For the startup
   *   growth source, xHandle is the founder's X username without @. The rank field
   *   is the source's revenue rank. Result order represents reported 30-day
   *   revenue-growth rank.
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
   * Source-specific fields. Shape varies per source:
   *
   * - reddit: { author, authorId?, subreddit, subredditId?, subredditSubscribers?,
   *   sourceFormat, score?, upvoteRatio?, estimatedUpvotes?, estimatedDownvotes?,
   *   numberComments?, numberCrossposts?, selftext?, contentUrl?, domain?,
   *   postHint?, linkFlairText?, distinguished?, totalAwardsReceived?, viewCount?,
   *   editedAt?, galleryImageUrls?, redditVideo?, archived?, contestMode?,
   *   isCrosspostable?, isMeta?, isNsfw?, isOriginalContent?, isRobotIndexable?,
   *   isSelf?, isSpoiler?, isVideo?, locked?, stickied? }. `score` is Reddit's
   *   public net score. Exact public upvote and downvote counts are not available.
   *   Estimated counts derive from the public score and upvote ratio, which Reddit
   *   may fuzz. Comment bodies are not included. Current items combine public
   *   listing discovery with server-rendered post data and use `sourceFormat: html`;
   *   `json` and `rss` remain for legacy rows.
   * - github: { starsToday: number }
   * - hacker_news: { points: number, numberComments: number }
   * - google_trends: { approxTraffic: number }
   * - polymarket: { volume24hr: number }
   * - wikipedia: { views: number }
   * - trustmrr: { mrr, growthPercent, last30Days, total, customers,
   *   activeSubscriptions, onSale, xHandle?, category?, askingPrice?, country?,
   *   foundedDate?, googleSearchImpressionsLast30Days?, growthMrrPercent?,
   *   multiple?, paymentProvider?, profitMarginLast30Days?, rank?,
   *   revenuePerVisitor?, targetAudience?, visitorsLast30Days? } For the startup
   *   growth source, xHandle is the founder's X username without @. The rank field
   *   is the source's revenue rank. Result order represents reported 30-day
   *   revenue-growth rank.
   */
  export interface Metadata {
    author?: string;

    contentUrl?: string;

    estimatedDownvotes?: number;

    estimatedUpvotes?: number;

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
   * Cursor for pagination (from prior response nextCursor).
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
