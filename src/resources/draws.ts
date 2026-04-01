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
   * Get draw details
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<DrawRetrieveResponse> {
    return this._client.get(path`/draws/${id}`, options);
  }

  /**
   * List draws
   */
  list(
    query: DrawListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DrawListResponse> {
    return this._client.get('/draws', { query, ...options });
  }

  /**
   * Export draw data
   */
  export(
    id: string,
    query: DrawExportParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Response> {
    return this._client.get(path`/draws/${id}/export`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: 'application/octet-stream' }, options?.headers]),
      __binaryResponse: true,
    });
  }

  /**
   * Run giveaway draw
   */
  run(body: DrawRunParams, options?: RequestOptions): APIPromise<DrawRunResponse> {
    return this._client.post('/draws', { body, ...options });
  }
}

export interface DrawDetail {
  id: string;

  createdAt: string;

  status: string;

  totalEntries: number;

  tweetAuthorUsername: string;

  tweetId: string;

  tweetLikeCount: number;

  tweetQuoteCount: number;

  tweetReplyCount: number;

  tweetRetweetCount: number;

  tweetText: string;

  tweetUrl: string;

  validEntries: number;

  drawnAt?: string;
}

export interface DrawListItem {
  id: string;

  createdAt: string;

  status: string;

  totalEntries: number;

  tweetUrl: string;

  validEntries: number;

  drawnAt?: string;
}

export interface Winner {
  authorUsername: string;

  isBackup: boolean;

  position: number;

  tweetId: string;
}

export interface DrawRetrieveResponse {
  draw: DrawRetrieveResponse.Draw;

  winners: Array<DrawRetrieveResponse.Winner>;
}

export namespace DrawRetrieveResponse {
  export interface Draw {
    id: string;

    createdAt: string;

    status: string;

    totalEntries: number;

    tweetAuthorUsername: string;

    tweetId: string;

    tweetLikeCount: number;

    tweetQuoteCount: number;

    tweetReplyCount: number;

    tweetRetweetCount: number;

    tweetText: string;

    tweetUrl: string;

    validEntries: number;

    drawnAt?: string;
  }

  export interface Winner {
    authorUsername: string;

    isBackup: boolean;

    position: number;

    tweetId: string;
  }
}

export interface DrawListResponse {
  draws: Array<DrawListResponse.Draw>;

  hasMore: boolean;

  nextCursor?: string;
}

export namespace DrawListResponse {
  export interface Draw {
    id: string;

    createdAt: string;

    status: string;

    totalEntries: number;

    tweetUrl: string;

    validEntries: number;

    drawnAt?: string;
  }
}

export interface DrawRunResponse {
  id: string;

  totalEntries: number;

  tweetId: string;

  validEntries: number;

  winners: Array<DrawRunResponse.Winner>;
}

export namespace DrawRunResponse {
  export interface Winner {
    authorUsername: string;

    isBackup: boolean;

    position: number;

    tweetId: string;
  }
}

export interface DrawListParams {
  /**
   * Cursor for pagination
   */
  after?: string;

  limit?: number;
}

export interface DrawExportParams {
  format?: 'csv' | 'json' | 'md' | 'md-document' | 'pdf' | 'txt' | 'xlsx';

  /**
   * Export winners or all entries
   */
  type?: 'winners' | 'entries';
}

export interface DrawRunParams {
  tweetUrl: string;

  backupCount?: number;

  filterAccountAgeDays?: number;

  filterLanguage?: string;

  filterMinFollowers?: number;

  mustFollowUsername?: string;

  mustRetweet?: boolean;

  requiredHashtags?: Array<string>;

  requiredKeywords?: Array<string>;

  requiredMentions?: Array<string>;

  uniqueAuthorsOnly?: boolean;

  winnerCount?: number;
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
