// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Bulk data extraction (20 tool types)
 */
export class Extractions extends APIResource {
  /**
   * Get extraction results
   *
   * @example
   * ```ts
   * const extraction = await client.extractions.retrieve('id');
   * ```
   */
  retrieve(
    id: string,
    query: ExtractionRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ExtractionRetrieveResponse> {
    return this._client.get(path`/extractions/${id}`, { query, ...options });
  }

  /**
   * List extraction jobs
   *
   * @example
   * ```ts
   * const extractions = await client.extractions.list();
   * ```
   */
  list(
    query: ExtractionListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ExtractionListResponse> {
    return this._client.get('/extractions', { query, ...options });
  }

  /**
   * Estimate extraction cost
   *
   * @example
   * ```ts
   * const response = await client.extractions.estimateCost({
   *   toolType: 'follower_explorer',
   *   targetUsername: 'elonmusk',
   * });
   * ```
   */
  estimateCost(
    body: ExtractionEstimateCostParams,
    options?: RequestOptions,
  ): APIPromise<ExtractionEstimateCostResponse> {
    return this._client.post('/extractions/estimate', { body, ...options });
  }

  /**
   * Export extraction results
   *
   * @example
   * ```ts
   * const response = await client.extractions.exportResults(
   *   'id',
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  exportResults(
    id: string,
    query: ExtractionExportResultsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Response> {
    return this._client.get(path`/extractions/${id}/export`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: 'application/octet-stream' }, options?.headers]),
      __binaryResponse: true,
    });
  }

  /**
   * Run extraction
   *
   * @example
   * ```ts
   * const response = await client.extractions.run({
   *   toolType: 'follower_explorer',
   *   targetUsername: 'elonmusk',
   * });
   * ```
   */
  run(body: ExtractionRunParams, options?: RequestOptions): APIPromise<ExtractionRunResponse> {
    return this._client.post('/extractions', { body, ...options });
  }
}

/**
 * Extraction job tracking status, tool type, and result count.
 */
export interface ExtractionJob {
  id: string;

  createdAt: string;

  status: 'running' | 'completed' | 'failed';

  /**
   * Identifier for the extraction tool used to run a job.
   */
  toolType:
    | 'article_extractor'
    | 'community_extractor'
    | 'community_moderator_explorer'
    | 'community_post_extractor'
    | 'community_search'
    | 'follower_explorer'
    | 'following_explorer'
    | 'list_follower_explorer'
    | 'list_member_extractor'
    | 'list_post_extractor'
    | 'mention_extractor'
    | 'people_search'
    | 'post_extractor'
    | 'quote_extractor'
    | 'reply_extractor'
    | 'repost_extractor'
    | 'space_explorer'
    | 'thread_extractor'
    | 'tweet_search_extractor'
    | 'verified_follower_explorer';

  totalResults: number;

  completedAt?: string;
}

export interface ExtractionRetrieveResponse {
  hasMore: boolean;

  /**
   * Extraction job metadata — shape varies by tool type (JSON)
   */
  job: { [key: string]: unknown };

  results: Array<{ [key: string]: unknown }>;

  nextCursor?: string;
}

export interface ExtractionListResponse {
  extractions: Array<ExtractionListResponse.Extraction>;

  hasMore: boolean;

  nextCursor?: string;
}

export namespace ExtractionListResponse {
  /**
   * Extraction job tracking status, tool type, and result count.
   */
  export interface Extraction {
    id: string;

    createdAt: string;

    status: 'running' | 'completed' | 'failed';

    /**
     * Identifier for the extraction tool used to run a job.
     */
    toolType:
      | 'article_extractor'
      | 'community_extractor'
      | 'community_moderator_explorer'
      | 'community_post_extractor'
      | 'community_search'
      | 'follower_explorer'
      | 'following_explorer'
      | 'list_follower_explorer'
      | 'list_member_extractor'
      | 'list_post_extractor'
      | 'mention_extractor'
      | 'people_search'
      | 'post_extractor'
      | 'quote_extractor'
      | 'reply_extractor'
      | 'repost_extractor'
      | 'space_explorer'
      | 'thread_extractor'
      | 'tweet_search_extractor'
      | 'verified_follower_explorer';

    totalResults: number;

    completedAt?: string;
  }
}

export interface ExtractionEstimateCostResponse {
  allowed: boolean;

  estimatedResults: number;

  projectedPercent: number;

  source: string;

  usagePercent: number;
}

export interface ExtractionRunResponse {
  id: string;

  status: 'running';

  /**
   * Identifier for the extraction tool used to run a job.
   */
  toolType:
    | 'article_extractor'
    | 'community_extractor'
    | 'community_moderator_explorer'
    | 'community_post_extractor'
    | 'community_search'
    | 'follower_explorer'
    | 'following_explorer'
    | 'list_follower_explorer'
    | 'list_member_extractor'
    | 'list_post_extractor'
    | 'mention_extractor'
    | 'people_search'
    | 'post_extractor'
    | 'quote_extractor'
    | 'reply_extractor'
    | 'repost_extractor'
    | 'space_explorer'
    | 'thread_extractor'
    | 'tweet_search_extractor'
    | 'verified_follower_explorer';
}

export interface ExtractionRetrieveParams {
  /**
   * Cursor for keyset pagination
   */
  after?: string;

  /**
   * Maximum number of results to return (1-1000, default 100)
   */
  limit?: number;
}

export interface ExtractionListParams {
  /**
   * Cursor for keyset pagination
   */
  after?: string;

  /**
   * Maximum number of items to return (1-100, default 50)
   */
  limit?: number;

  /**
   * Filter by job status
   */
  status?: 'running' | 'completed' | 'failed';

  /**
   * Filter by extraction tool type
   */
  toolType?:
    | 'article_extractor'
    | 'community_extractor'
    | 'community_moderator_explorer'
    | 'community_post_extractor'
    | 'community_search'
    | 'follower_explorer'
    | 'following_explorer'
    | 'list_follower_explorer'
    | 'list_member_extractor'
    | 'list_post_extractor'
    | 'mention_extractor'
    | 'people_search'
    | 'post_extractor'
    | 'quote_extractor'
    | 'reply_extractor'
    | 'repost_extractor'
    | 'space_explorer'
    | 'thread_extractor'
    | 'tweet_search_extractor'
    | 'verified_follower_explorer';
}

export interface ExtractionEstimateCostParams {
  /**
   * Identifier for the extraction tool used to run a job.
   */
  toolType:
    | 'article_extractor'
    | 'community_extractor'
    | 'community_moderator_explorer'
    | 'community_post_extractor'
    | 'community_search'
    | 'follower_explorer'
    | 'following_explorer'
    | 'list_follower_explorer'
    | 'list_member_extractor'
    | 'list_post_extractor'
    | 'mention_extractor'
    | 'people_search'
    | 'post_extractor'
    | 'quote_extractor'
    | 'reply_extractor'
    | 'repost_extractor'
    | 'space_explorer'
    | 'thread_extractor'
    | 'tweet_search_extractor'
    | 'verified_follower_explorer';

  /**
   * Raw advanced query string appended to the estimate (tweet_search_extractor)
   */
  advancedQuery?: string;

  /**
   * Exact phrase filter for search estimation
   */
  exactPhrase?: string;

  /**
   * Words excluded from estimated search results
   */
  excludeWords?: string;

  searchQuery?: string;

  targetCommunityId?: string;

  targetListId?: string;

  targetSpaceId?: string;

  targetTweetId?: string;

  targetUsername?: string;
}

export interface ExtractionExportResultsParams {
  /**
   * Export file format
   */
  format?: 'csv' | 'json' | 'md' | 'md-document' | 'pdf' | 'txt' | 'xlsx';
}

export interface ExtractionRunParams {
  /**
   * Identifier for the extraction tool used to run a job.
   */
  toolType:
    | 'article_extractor'
    | 'community_extractor'
    | 'community_moderator_explorer'
    | 'community_post_extractor'
    | 'community_search'
    | 'follower_explorer'
    | 'following_explorer'
    | 'list_follower_explorer'
    | 'list_member_extractor'
    | 'list_post_extractor'
    | 'mention_extractor'
    | 'people_search'
    | 'post_extractor'
    | 'quote_extractor'
    | 'reply_extractor'
    | 'repost_extractor'
    | 'space_explorer'
    | 'thread_extractor'
    | 'tweet_search_extractor'
    | 'verified_follower_explorer';

  /**
   * Raw advanced search query appended as-is (tweet_search_extractor)
   */
  advancedQuery?: string;

  /**
   * Exact phrase to match (tweet_search_extractor)
   */
  exactPhrase?: string;

  /**
   * Words to exclude from results (tweet_search_extractor)
   */
  excludeWords?: string;

  searchQuery?: string;

  targetCommunityId?: string;

  targetListId?: string;

  targetSpaceId?: string;

  targetTweetId?: string;

  targetUsername?: string;
}

export declare namespace Extractions {
  export {
    type ExtractionJob as ExtractionJob,
    type ExtractionRetrieveResponse as ExtractionRetrieveResponse,
    type ExtractionListResponse as ExtractionListResponse,
    type ExtractionEstimateCostResponse as ExtractionEstimateCostResponse,
    type ExtractionRunResponse as ExtractionRunResponse,
    type ExtractionRetrieveParams as ExtractionRetrieveParams,
    type ExtractionListParams as ExtractionListParams,
    type ExtractionEstimateCostParams as ExtractionEstimateCostParams,
    type ExtractionExportResultsParams as ExtractionExportResultsParams,
    type ExtractionRunParams as ExtractionRunParams,
  };
}
