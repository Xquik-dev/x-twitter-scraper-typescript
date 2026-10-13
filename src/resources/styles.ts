// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * AI tweet composition, drafts, writing styles, and radar
 */
export class Styles extends APIResource {
  /**
   * Returns one cached writing style profile.
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
   * Creates or replaces a style profile from supplied posts.
   *
   * @example
   * ```ts
   * const styleProfile = await client.styles.update('id', {
   *   tweets: [
   *     { text: 'Excited to share our latest research.' },
   *   ],
   *   label: 'Professional Voice',
   * });
   * ```
   */
  update(id: string, body: StyleUpdateParams, options?: RequestOptions): APIPromise<StyleProfile> {
    return this._client.put(path`/styles/${id}`, { body, ...options });
  }

  /**
   * Returns cached writing style profiles for the account.
   *
   * @example
   * ```ts
   * const styles = await client.styles.list();
   * ```
   */
  list(
    query: StyleListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<StyleListResponse> {
    return this._client.get('/styles', { query, ...options });
  }

  /**
   * Permanently removes one cached style profile.
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
   * Builds a writing style profile from recent public posts.
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
   * Compares language and engagement signals across two style profiles.
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
   * Returns engagement metrics for an analyzed public X profile.
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
export interface StyleProfile extends StyleProfileSummary {
  tweets: Array<StyleProfile.Tweet>;
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
  hasMore: boolean;

  styles: Array<StyleProfileSummary>;

  nextCursor?: string;
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

    bookmarkCount?: number;

    likeCount?: number;

    quoteCount?: number;

    replyCount?: number;

    retweetCount?: number;

    viewCount?: number;
  }
}

export interface StyleUpdateParams {
  /**
   * Array of tweet objects
   */
  tweets: Array<StyleUpdateParams.Tweet>;

  /**
   * Optional display label of up to 50 characters. When sent, it must match the path
   * ID, ignoring case and a leading @. When it is left out, the path ID names the
   * style and must fit the same limit.
   */
  label?: string;
}

export namespace StyleUpdateParams {
  export interface Tweet {
    text: string;
  }
}

export interface StyleListParams {
  /**
   * Previous nextCursor. The after alias also works. Offset pagination is not
   * supported.
   */
  cursor?: string;

  /**
   * Maximum items per page: 1 to 200, default 200. Pass nextCursor as cursor for the
   * next page.
   */
  limit?: number;
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
    type StyleListParams as StyleListParams,
    type StyleAnalyzeParams as StyleAnalyzeParams,
    type StyleCompareParams as StyleCompareParams,
  };
}
