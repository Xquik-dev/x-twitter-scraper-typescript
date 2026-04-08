// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Tweet composition, drafts, writing styles & radar
 */
export class Styles extends APIResource {
  /**
   * Get cached style profile
   *
   * @example
   * ```ts
   * const styleProfile = await client.styles.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<StyleProfile> {
    return this._client.get(path`/styles/${id}`, options);
  }

  /**
   * Save style profile with custom tweets
   *
   * @example
   * ```ts
   * const styleProfile = await client.styles.update('id', {
   *   label: 'Professional Voice',
   *   tweets: [
   *     {
   *       text: 'Excited to share our latest research findings.',
   *     },
   *   ],
   * });
   * ```
   */
  update(id: string, body: StyleUpdateParams, options?: RequestOptions): APIPromise<StyleProfile> {
    return this._client.put(path`/styles/${id}`, { body, ...options });
  }

  /**
   * List cached style profiles
   *
   * @example
   * ```ts
   * const styles = await client.styles.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<StyleListResponse> {
    return this._client.get('/styles', options);
  }

  /**
   * Delete a style profile
   *
   * @example
   * ```ts
   * await client.styles.delete('id');
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/styles/${id}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Analyze writing style from recent tweets
   *
   * @example
   * ```ts
   * const styleProfile = await client.styles.analyze({
   *   username: 'elonmusk',
   * });
   * ```
   */
  analyze(body: StyleAnalyzeParams, options?: RequestOptions): APIPromise<StyleProfile> {
    return this._client.post('/styles', { body, ...options });
  }

  /**
   * Compare two style profiles
   *
   * @example
   * ```ts
   * const response = await client.styles.compare({
   *   username1: 'username1',
   *   username2: 'username2',
   * });
   * ```
   */
  compare(query: StyleCompareParams, options?: RequestOptions): APIPromise<StyleCompareResponse> {
    return this._client.get('/styles/compare', { query, ...options });
  }

  /**
   * Get engagement metrics for style tweets
   *
   * @example
   * ```ts
   * const response = await client.styles.getPerformance('id');
   * ```
   */
  getPerformance(id: string, options?: RequestOptions): APIPromise<StyleGetPerformanceResponse> {
    return this._client.get(path`/styles/${id}/performance`, options);
  }
}

/**
 * Full style profile with sampled tweets used for tone analysis.
 */
export interface StyleProfile {
  fetchedAt: string;

  isOwnAccount: boolean;

  tweetCount: number;

  tweets: Array<StyleProfile.Tweet>;

  xUsername: string;
}

export namespace StyleProfile {
  export interface Tweet {
    id: string;

    text: string;

    authorUsername?: string;

    createdAt?: string;
  }
}

/**
 * Style profile summary with tweet count and ownership flag.
 */
export interface StyleProfileSummary {
  fetchedAt: string;

  isOwnAccount: boolean;

  tweetCount: number;

  xUsername: string;
}

export interface StyleListResponse {
  styles: Array<StyleProfileSummary>;
}

export interface StyleCompareResponse {
  /**
   * Full style profile with sampled tweets used for tone analysis.
   */
  style1: StyleProfile;

  /**
   * Full style profile with sampled tweets used for tone analysis.
   */
  style2: StyleProfile;
}

export interface StyleGetPerformanceResponse {
  tweetCount: number;

  tweets: Array<StyleGetPerformanceResponse.Tweet>;

  xUsername: string;
}

export namespace StyleGetPerformanceResponse {
  export interface Tweet {
    id: string;

    text: string;

    createdAt?: string;

    likeCount?: number;

    replyCount?: number;

    retweetCount?: number;

    viewCount?: number;
  }
}

export interface StyleUpdateParams {
  /**
   * Display label for the style
   */
  label: string;

  /**
   * Array of tweet objects
   */
  tweets: Array<StyleUpdateParams.Tweet>;
}

export namespace StyleUpdateParams {
  export interface Tweet {
    text: string;
  }
}

export interface StyleAnalyzeParams {
  /**
   * X username to analyze
   */
  username: string;
}

export interface StyleCompareParams {
  /**
   * First username to compare
   */
  username1: string;

  /**
   * Second username to compare
   */
  username2: string;
}

export declare namespace Styles {
  export {
    type StyleProfile as StyleProfile,
    type StyleProfileSummary as StyleProfileSummary,
    type StyleListResponse as StyleListResponse,
    type StyleCompareResponse as StyleCompareResponse,
    type StyleGetPerformanceResponse as StyleGetPerformanceResponse,
    type StyleUpdateParams as StyleUpdateParams,
    type StyleAnalyzeParams as StyleAnalyzeParams,
    type StyleCompareParams as StyleCompareParams,
  };
}
