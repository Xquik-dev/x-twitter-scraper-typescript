// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Tweet composition, drafts, writing styles & radar
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
 * Trending topic with score, category, source, and region.
 */
export interface RadarItem {
  category: string;

  publishedAt: string;

  region: string;

  score: number;

  source: string;

  title: string;

  description?: string;

  imageUrl?: string;

  url?: string;
}

export interface RadarRetrieveTrendingTopicsResponse {
  items: Array<RadarItem>;

  total: number;
}

export interface RadarRetrieveTrendingTopicsParams {
  /**
   * Filter by category (general, tech, dev, etc.)
   */
  category?: string;

  /**
   * Number of items to return
   */
  count?: number;

  /**
   * Lookback window in hours
   */
  hours?: number;

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
