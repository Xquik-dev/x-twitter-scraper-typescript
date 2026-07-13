// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Bulk data extraction (23 tool types)
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
   *   { format: 'csv' },
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  exportResults(
    id: string,
    query: ExtractionExportResultsParams,
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
    | 'favoriters'
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
    | 'user_likes'
    | 'user_media'
    | 'verified_follower_explorer';

  totalResults: number;

  completedAt?: string;
}

export interface ExtractionRetrieveResponse {
  hasMore: boolean;

  /**
   * Extraction job metadata - shape varies by tool type (JSON)
   */
  job: { [key: string]: unknown };

  results: Array<{ [key: string]: unknown }>;

  nextCursor?: string;
}

export interface ExtractionListResponse {
  extractions: Array<ExtractionJob>;

  hasMore: boolean;

  nextCursor?: string;
}

export interface ExtractionEstimateCostResponse {
  allowed: boolean;

  creditsAvailable: string;

  creditsRequired: string;

  estimatedResults: number;

  source:
    | 'followers'
    | 'following'
    | 'paginationCap'
    | 'posts'
    | 'quoteCount'
    | 'replyCount'
    | 'resultsLimit'
    | 'retweetCount'
    | 'unknown';

  resolvedXUserId?: string;
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
    | 'favoriters'
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
    | 'user_likes'
    | 'user_media'
    | 'verified_follower_explorer';
}

export interface ExtractionRetrieveParams {
  /**
   * Cursor for keyset pagination from prior response next_cursor
   */
  cursor?: string;

  /**
   * Maximum number of results to return (1-1000, default 100)
   */
  limit?: number;
}

export interface ExtractionListParams {
  /**
   * Cursor for keyset pagination from prior response next_cursor
   */
  cursor?: string;

  /**
   * Maximum number of items to return (1-100, default 50). For paid per-result
   * endpoints, the returned count may be lower when remaining credits cannot cover
   * the requested page. If zero paid results are affordable, the endpoint returns
   * 402 insufficient_credits.
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
    | 'favoriters'
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
    | 'user_likes'
    | 'user_media'
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
    | 'favoriters'
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
    | 'user_likes'
    | 'user_media'
    | 'verified_follower_explorer';

  /**
   * Raw advanced query string appended to the estimate (tweet_search_extractor)
   */
  advancedQuery?: string;

  /**
   * Alternative words or quoted phrases for estimated results. Separate with spaces,
   * commas, or lines.
   */
  anyWords?: string;

  /**
   * Geo bounding box used for estimation, e.g. -74.1 40.6 -73.9 40.8
   * (tweet_search_extractor)
   */
  boundingBox?: string;

  /**
   * Cashtags applied to the estimate, separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter used for estimation (tweet_search_extractor)
   */
  conversationId?: string;

  /**
   * Exact phrase filter for search estimation
   */
  exactPhrase?: string;

  /**
   * Words or quoted phrases excluded from estimated results. Separate with spaces,
   * commas, or lines.
   */
  excludeWords?: string;

  /**
   * Estimate only tweets from this author username (tweet_search_extractor)
   */
  fromUser?: string;

  /**
   * Hashtags applied to the estimate, separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Estimate only replies to this tweet ID (tweet_search_extractor)
   */
  inReplyToTweetId?: string;

  /**
   * Language code used for estimate filtering (tweet_search_extractor)
   */
  language?: string;

  /**
   * Estimate search results within this list ID (tweet_search_extractor)
   */
  listId?: string;

  /**
   * Media type used for estimate filtering (tweet_search_extractor)
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Estimate tweets mentioning this username (tweet_search_extractor)
   */
  mentioning?: string;

  /**
   * Minimum likes threshold for estimated results (tweet_search_extractor)
   */
  minFaves?: number;

  /**
   * Minimum quote count threshold for estimated results (tweet_search_extractor)
   */
  minQuotes?: number;

  /**
   * Minimum replies threshold for estimated results (tweet_search_extractor)
   */
  minReplies?: number;

  /**
   * Minimum retweets threshold for estimated results (tweet_search_extractor)
   */
  minRetweets?: number;

  /**
   * Estimate search results within this place ID (tweet_search_extractor)
   */
  place?: string;

  /**
   * Estimate search results within this country code (tweet_search_extractor)
   */
  placeCountry?: string;

  /**
   * Geo point radius used for estimation, e.g. -73.99 40.73 25mi
   * (tweet_search_extractor)
   */
  pointRadius?: string;

  /**
   * Quote mode used for estimation (tweet_search_extractor)
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Estimate only quotes of this tweet ID (tweet_search_extractor)
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode used for estimation (tweet_search_extractor)
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Maximum number of results to estimate. When set, the estimate caps projected
   * results to this value.
   */
  resultsLimit?: number;

  /**
   * Retweet mode used for estimation (tweet_search_extractor)
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Estimate only retweets of this tweet ID (tweet_search_extractor)
   */
  retweetsOfTweetId?: string;

  /**
   * Required for tweet_search_extractor & community_search.
   */
  searchQuery?: string;

  /**
   * Estimate start date in YYYY-MM-DD format (tweet_search_extractor)
   */
  sinceDate?: string;

  /**
   * Required for community_post_extractor & community_search.
   */
  targetCommunityId?: string;

  /**
   * Required for list_follower_explorer, list_member_extractor &
   * list_post_extractor.
   */
  targetListId?: string;

  /**
   * Required for space_explorer.
   */
  targetSpaceId?: string;

  targetTweetId?: string;

  targetUsername?: string;

  /**
   * Estimate replies sent to this username (tweet_search_extractor)
   */
  toUser?: string;

  /**
   * Estimate end date in YYYY-MM-DD format (tweet_search_extractor)
   */
  untilDate?: string;

  /**
   * URL substring or domain filter used for estimation (tweet_search_extractor)
   */
  url?: string;

  /**
   * Estimate only verified authors (tweet_search_extractor)
   */
  verifiedOnly?: boolean;
}

export interface ExtractionExportResultsParams {
  /**
   * Export file format
   */
  format: 'csv' | 'json' | 'md' | 'md-document' | 'pdf' | 'txt' | 'xlsx';
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
    | 'favoriters'
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
    | 'user_likes'
    | 'user_media'
    | 'verified_follower_explorer';

  /**
   * Raw advanced search query appended as-is (tweet_search_extractor)
   */
  advancedQuery?: string;

  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines. (tweet_search_extractor)
   */
  anyWords?: string;

  /**
   * Geo bounding box, e.g. -74.1 40.6 -73.9 40.8 (tweet_search_extractor)
   */
  boundingBox?: string;

  /**
   * Cashtags separated by spaces, commas, or lines. (tweet_search_extractor)
   */
  cashtags?: string;

  /**
   * Conversation ID filter (tweet_search_extractor)
   */
  conversationId?: string;

  /**
   * Exact phrase to match (tweet_search_extractor)
   */
  exactPhrase?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   * (tweet_search_extractor)
   */
  excludeWords?: string;

  /**
   * Filter by author username (tweet_search_extractor)
   */
  fromUser?: string;

  /**
   * Hashtags separated by spaces, commas, or lines. (tweet_search_extractor)
   */
  hashtags?: string;

  /**
   * Only replies to this tweet ID (tweet_search_extractor)
   */
  inReplyToTweetId?: string;

  /**
   * Language code filter (tweet_search_extractor)
   */
  language?: string;

  /**
   * Search within a list ID (tweet_search_extractor)
   */
  listId?: string;

  /**
   * Media type filter (tweet_search_extractor)
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username (tweet_search_extractor)
   */
  mentioning?: string;

  /**
   * Minimum likes threshold (tweet_search_extractor)
   */
  minFaves?: number;

  /**
   * Minimum quote count threshold (tweet_search_extractor)
   */
  minQuotes?: number;

  /**
   * Minimum replies threshold (tweet_search_extractor)
   */
  minReplies?: number;

  /**
   * Minimum retweets threshold (tweet_search_extractor)
   */
  minRetweets?: number;

  /**
   * Search within a place ID (tweet_search_extractor)
   */
  place?: string;

  /**
   * Search within a country code (tweet_search_extractor)
   */
  placeCountry?: string;

  /**
   * Geo point radius, e.g. -73.99 40.73 25mi (tweet_search_extractor)
   */
  pointRadius?: string;

  /**
   * Quote mode (tweet_search_extractor)
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID (tweet_search_extractor)
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode (tweet_search_extractor)
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Maximum number of results to extract. When set, the extraction stops after
   * reaching this limit.
   */
  resultsLimit?: number;

  /**
   * Retweet mode (tweet_search_extractor)
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID (tweet_search_extractor)
   */
  retweetsOfTweetId?: string;

  /**
   * Required for tweet_search_extractor & community_search.
   */
  searchQuery?: string;

  /**
   * Start date YYYY-MM-DD (tweet_search_extractor)
   */
  sinceDate?: string;

  /**
   * Required for community_post_extractor & community_search.
   */
  targetCommunityId?: string;

  /**
   * Required for list_follower_explorer, list_member_extractor &
   * list_post_extractor.
   */
  targetListId?: string;

  /**
   * Required for space_explorer.
   */
  targetSpaceId?: string;

  targetTweetId?: string;

  targetUsername?: string;

  /**
   * Filter replies sent to a username (tweet_search_extractor)
   */
  toUser?: string;

  /**
   * End date YYYY-MM-DD (tweet_search_extractor)
   */
  untilDate?: string;

  /**
   * URL substring or domain filter (tweet_search_extractor)
   */
  url?: string;

  /**
   * Only verified authors (tweet_search_extractor)
   */
  verifiedOnly?: boolean;
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
