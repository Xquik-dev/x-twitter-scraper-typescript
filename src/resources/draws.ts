// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Giveaway draws from tweet replies
 */
export class Draws extends APIResource {
  /**
   * Returns draw rules, status, candidates, and selected winners.
   *
   * @example
   * ```ts
   * const draw = await client.draws.retrieve(
   *   'f4bd00a2-7b4e-4e59-8e1b-72e2c9f12345',
   * );
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<DrawRetrieveResponse> {
    return this._client.get(path`/draws/${id}`, options);
  }

  /**
   * Returns giveaway draws owned by the authenticated account.
   *
   * @example
   * ```ts
   * const draws = await client.draws.list();
   * ```
   */
  list(
    query: DrawListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DrawListResponse> {
    return this._client.get('/draws', { query, ...options });
  }

  /**
   * Downloads draw evidence in the requested format.
   *
   * @example
   * ```ts
   * const response = await client.draws.export(
   *   'f4bd00a2-7b4e-4e59-8e1b-72e2c9f12345',
   *   { format: 'csv' },
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  export(id: string, query: DrawExportParams, options?: RequestOptions): APIPromise<Response> {
    return this._client.get(path`/draws/${id}/export`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: 'application/octet-stream' }, options?.headers]),
      __binaryResponse: true,
    });
  }

  /**
   * Checks credits, then draws winners from inspected replies & reposters. Remaining
   * credits cap the candidates.
   *
   * @example
   * ```ts
   * const response = await client.draws.run({
   *   tweetUrl: 'https://x.com/elonmusk/status/1234567890',
   *   backupCount: 2,
   *   filterAccountAgeDays: 30,
   *   filterLanguage: 'en',
   *   filterMinFollowers: 50,
   *   mustFollowUsername: 'elonmusk',
   *   mustRetweet: true,
   *   requiredHashtags: ['#giveaway'],
   *   requiredKeywords: ['entered'],
   *   requiredMentions: ['@elonmusk'],
   *   uniqueAuthorsOnly: true,
   *   winnerCount: 3,
   * });
   * ```
   */
  run(params: DrawRunParams, options?: RequestOptions): APIPromise<DrawRunResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post('/draws', {
      body,
      ...options,
      headers: buildHeaders([
        { ...(idempotencyKey != null ? { 'Idempotency-Key': idempotencyKey } : undefined) },
        options?.headers,
      ]),
    });
  }
}

/**
 * Full giveaway draw with tweet metrics, entries, and timing.
 */
export interface DrawDetail extends DrawListItem {
  tweetAuthorUsername: string;

  tweetId: string;

  /**
   * Whole number from 0.
   */
  tweetLikeCount: number;

  /**
   * Whole number from 0.
   */
  tweetQuoteCount: number;

  /**
   * Whole number from 0.
   */
  tweetReplyCount: number;

  /**
   * Whole number from 0.
   */
  tweetRetweetCount: number;

  tweetText: string;
}

/**
 * Giveaway draw summary with entry counts and status.
 */
export interface DrawListItem {
  /**
   * Draw public ID for detail responses.
   */
  id: string;

  createdAt: string;

  status: string;

  /**
   * Whole number from 0.
   */
  totalEntries: number;

  tweetUrl: string;

  /**
   * Whole number from 0.
   */
  validEntries: number;

  drawnAt?: string;
}

/**
 * Giveaway draw winner with position and backup flag.
 */
export interface Winner {
  authorUsername: string;

  isBackup: boolean;

  position: number;

  tweetId: string;
}

export interface DrawRetrieveResponse {
  /**
   * Full giveaway draw with tweet metrics, entries, and timing.
   */
  draw: DrawDetail;

  winners: Array<Winner>;
}

export interface DrawListResponse {
  draws: Array<DrawListItem>;

  hasMore: boolean;

  nextCursor?: string;
}

export interface DrawRunResponse {
  id: string;

  /**
   * Entries inspected after the credit cap, which can be fewer than the post's
   * replies.
   */
  totalEntries: number;

  tweetId: string;

  /**
   * Inspected entries that passed every filter. A credit cap can leave valid replies
   * uninspected.
   */
  validEntries: number;

  winners: Array<Winner>;
}

export interface DrawListParams {
  /**
   * Previous nextCursor. The after alias also works. Offset pagination is not
   * supported.
   */
  cursor?: string;

  /**
   * Maximum items per page: 1 to 100, default 50. Credits can reduce paid results.
   * With none affordable, it returns 402 insufficient_credits.
   */
  limit?: number;
}

export interface DrawExportParams {
  /**
   * Export output format. PDF entry exports include up to 10,000 rows. Other entry
   * formats include up to 100,000 rows.
   */
  format: 'csv' | 'json' | 'md' | 'md-document' | 'pdf' | 'txt' | 'xlsx';

  /**
   * Export winners or all entries
   */
  type?: 'winners' | 'entries';
}

export interface DrawRunParams {
  /**
   * Body param
   */
  tweetUrl: string;

  /**
   * Body param
   */
  backupCount?: number;

  /**
   * Body param
   */
  filterAccountAgeDays?: number;

  /**
   * Body param
   */
  filterLanguage?: string;

  /**
   * Body param
   */
  filterMinFollowers?: number;

  /**
   * Body param: X username entrants must follow, with or without @
   */
  mustFollowUsername?: string;

  /**
   * Body param
   */
  mustRetweet?: boolean;

  /**
   * Body param
   */
  requiredHashtags?: Array<string>;

  /**
   * Body param
   */
  requiredKeywords?: Array<string>;

  /**
   * Body param
   */
  requiredMentions?: Array<string>;

  /**
   * Body param
   */
  uniqueAuthorsOnly?: boolean;

  /**
   * Body param
   */
  winnerCount?: number;

  /**
   * Header param: Generate 1 unique value per intended request. Reuse it only to
   * retry the same request. Exact retries return the original result & charge
   * nothing.
   */
  'Idempotency-Key'?: string;
}

export declare namespace Draws {
  export {
    type DrawDetail as DrawDetail,
    type DrawListItem as DrawListItem,
    type Winner as Winner,
    type DrawRetrieveResponse as DrawRetrieveResponse,
    type DrawListResponse as DrawListResponse,
    type DrawRunResponse as DrawRunResponse,
    type DrawListParams as DrawListParams,
    type DrawExportParams as DrawExportParams,
    type DrawRunParams as DrawRunParams,
  };
}
