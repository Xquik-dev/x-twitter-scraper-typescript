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

    query?: string;

    rank?: number;
  }
}

export interface TrendListParams {
  /**
   * Number of trending topics to return (1-50, default 30)
   */
  count?: number;

  /**
   * Region WOEID (1=Worldwide, 23424977=US, 23424975=UK, 23424969=Turkey)
   */
  woeid?: number;
}

export declare namespace Trends {
  export { type TrendListResponse as TrendListResponse, type TrendListParams as TrendListParams };
}
