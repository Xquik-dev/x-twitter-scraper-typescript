// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Trending topics and hashtags by region
 */
export class Trends extends APIResource {
  /**
   * Returns current regional trends through the compatibility route. Each request
   * costs 1 credit, however many trends it returns.
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
     * Promotion ID for this trend, or null when organic.
     */
    promotedContent?: string | null;

    query?: string;

    rank?: number;

    /**
     * Estimated post volume for this trend.
     */
    tweetVolume?: number | null;

    /**
     * Search URL associated with this trend.
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
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * The WOEID of any place X lists trends for (1=Worldwide, 23424977=US,
   * 23424975=UK, 23424969=Turkey). List places with GET /x/trends/locations.
   */
  woeid?: number;
}

export declare namespace Trends {
  export { type TrendListResponse as TrendListResponse, type TrendListParams as TrendListParams };
}
