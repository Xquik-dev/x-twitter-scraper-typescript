// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Trending topics and hashtags by region
 */
export class Trends extends APIResource {
  /**
   * Get trending hashtags and topics by region (alias)
   */
  list(
    query: TrendListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TrendListResponse> {
    return this._client.get('/trends', { query, ...options });
  }
}

export interface TrendListResponse {
  total: number;

  trends: Array<TrendListResponse.Trend>;

  woeid: number;
}

export namespace TrendListResponse {
  export interface Trend {
    name: string;

    description?: string;

    /**
     * Promotion identifier from X. Null for organic trends.
     */
    promotedContent?: string | null;

    query?: string;

    rank?: number;

    /**
     * Approximate public post volume when X supplies it.
     */
    tweetVolume?: number | null;

    /**
     * X search URL for the trend.
     */
    url?: string;
  }
}

export interface TrendListParams {
  /**
   * Number of trending topics returned (1-50, default 30)
   */
  count?: number;

  /**
   * Region Yahoo WOEID code (1=Worldwide, 23424977=US, 23424975=UK, 23424969=Turkey)
   */
  woeid?: number;
}

export declare namespace Trends {
  export { type TrendListResponse as TrendListResponse, type TrendListParams as TrendListParams };
}
