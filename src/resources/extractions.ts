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
  run(params: ExtractionRunParams, options?: RequestOptions): APIPromise<ExtractionRunResponse> {
    const { dry_run, ...body } = params;
    return this._client.post('/extractions', { query: { dry_run }, body, ...options });
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
    | 'collection'
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
  allowed: boolean;

  creditsAvailable: string;

  creditsRequired: string;

  estimatedResults: number;

  source: string;

  resolvedXUserId?: string;
}

export interface ExtractionRetrieveParams {
  /**
   * Previous nextCursor.
   */
  cursor?: string;

  /**
   * Preserve source keys or convert result field names.
   */
  fieldStyle?: 'source' | 'camelCase' | 'snake_case';

  /**
   * Use outputMode=raw instead.
   */
  includeRaw?: boolean;

  /**
   * Maximum number of results to return (1-1000, default 100)
   */
  limit?: number;

  /**
   * Select compact, full, or raw-compatible result fields.
   */
  outputMode?: 'compact' | 'full' | 'raw';

  /**
   * Keep enrichment nested or merge it into each result.
   */
  outputPreset?: 'nested' | 'flat';
}

export interface ExtractionListParams {
  /**
   * Previous nextCursor.
   */
  cursor?: string;

  /**
   * Maximum number of items to return (1-100, default 50). For paid per-result
   * endpoints, the returned count may be lower when available usage balance cannot cover
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
   * Raw advanced search query appended as-is (tweet_search_extractor)
   */
  advancedQuery?: string;

  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines. (tweet_search_extractor)
   */
  anyWords?: string;

  /**
   * Bio terms separated by commas or lines.
   */
  bioContains?: string;

  /**
   * Return only Blue-verified Tweet authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Geo bounding box, e.g. -74.1 40.6 -73.9 40.8 (tweet_search_extractor)
   */
  boundingBox?: string;

  /**
   * Match the Tweet card name.
   */
  cardName?: string;

  /**
   * Cashtags separated by spaces, commas, or lines. (tweet_search_extractor)
   */
  cashtags?: string;

  /**
   * Reply collection strategy.
   */
  collectionStrategy?: 'auto' | 'complete' | 'direct' | 'search' | 'thread';

  /**
   * Conversation ID filter (tweet_search_extractor)
   */
  conversationId?: string;

  /**
   * Merge duplicate results across collection targets.
   */
  dedupeAcrossTargets?: boolean;

  /**
   * Keep target duplicates, first rows, or merged overlap.
   */
  dedupeMode?: 'none' | 'first' | 'merge';

  /**
   * Exact phrase to match (tweet_search_extractor)
   */
  exactPhrase?: string;

  /**
   * Exclude replies from the source author.
   */
  excludeOriginalAuthor?: boolean;

  /**
   * Exclude a source application.
   */
  excludeSource?: string;

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
   * Match latitude, longitude, and radius.
   */
  geocode?: string;

  /**
   * Hashtags separated by spaces, commas, or lines. (tweet_search_extractor)
   */
  hashtags?: string;

  /**
   * Require a profile location.
   */
  hasLocation?: boolean;

  /**
   * Return only replies with media.
   */
  hasMediaOnly?: boolean;

  /**
   * Require a profile website.
   */
  hasWebsite?: boolean;

  /**
   * Include the source post in reply results.
   */
  includeOriginalPost?: boolean;

  /**
   * Add matching search terms to collection metadata.
   */
  includeSearchTerms?: boolean;

  /**
   * Add source target metadata to each result.
   */
  includeTargetMetadata?: boolean;

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
   * Required profile location text.
   */
  locationContains?: string;

  /**
   * Maximum nested reply depth.
   */
  maxDepth?: number;

  /**
   * Maximum follower count for profile results.
   */
  maxFollowers?: number;

  /**
   * Maximum following count for profile results.
   */
  maxFollowing?: number;

  /**
   * Return Tweets older than this Tweet ID.
   */
  maxId?: string;

  /**
   * Maximum results collected for each target.
   */
  maxItemsPerTarget?: number;

  /**
   * Maximum Tweet like count.
   */
  maxLikes?: number;

  /**
   * Reply pages collected for each target.
   */
  maxPagesPerTarget?: number;

  /**
   * Maximum post count for profile results.
   */
  maxPosts?: number;

  /**
   * Maximum Tweet quote count.
   */
  maxQuotes?: number;

  /**
   * Maximum Tweet reply count.
   */
  maxReplies?: number;

  /**
   * Maximum Tweet repost count.
   */
  maxRetweets?: number;

  /**
   * Media type filter (tweet_search_extractor)
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username (tweet_search_extractor)
   */
  mentioning?: string;

  /**
   * Minimum profile age in days.
   */
  minAccountAgeDays?: number;

  /**
   * Minimum Tweet bookmark count.
   */
  minBookmarks?: number;

  /**
   * Minimum likes threshold (tweet_search_extractor)
   */
  minFaves?: number;

  /**
   * Minimum follower count for profile results.
   */
  minFollowers?: number;

  /**
   * Minimum following count for profile results.
   */
  minFollowing?: number;

  /**
   * Minimum post count for profile results.
   */
  minPosts?: number;

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
   * Minimum Tweet view count.
   */
  minViews?: number;

  /**
   * Only return native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * Match a place name.
   */
  near?: string;

  /**
   * Only return news results.
   */
  news?: boolean;

  /**
   * Shortcut for dedupeMode=merge.
   */
  overlapMode?: boolean;

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
   * Search ranking applied to every query.
   */
  queryType?: 'Latest' | 'Top' | 'Both';

  /**
   * Quote mode (tweet_search_extractor)
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID (tweet_search_extractor)
   */
  quotesOfTweetId?: string;

  /**
   * Profile relations processed within one job.
   */
  relationTargets?: Array<ExtractionEstimateCostParams.RelationTarget>;

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
   * Enable the safe-search filter.
   */
  safe?: boolean;

  /**
   * Reply depth scope.
   */
  scope?: 'all' | 'direct' | 'nested';

  /**
   * Search queries processed as one collection job.
   */
  searchQueries?: Array<string>;

  /**
   * Required for tweet_search_extractor & community_search.
   */
  searchQuery?: string;

  /**
   * Start date YYYY-MM-DD (tweet_search_extractor)
   */
  sinceDate?: string;

  /**
   * Return Tweets newer than this Tweet ID.
   */
  sinceId?: string;

  /**
   * Reply start time as ISO 8601 or Unix seconds.
   */
  sinceTime?: string | number;

  /**
   * Reply result order.
   */
  sort?: 'relevance' | 'latest' | 'oldest' | 'likes';

  /**
   * Match the source application.
   */
  source?: string;

  /**
   * Resume one reply target from this cursor.
   */
  startCursor?: string;

  /**
   * Required for community_post_extractor & community_search.
   */
  targetCommunityId?: string;

  /**
   * Community IDs processed as one collection job.
   */
  targetCommunityIds?: Array<string>;

  /**
   * Required for list_follower_explorer, list_member_extractor &
   * list_post_extractor.
   */
  targetListId?: string;

  /**
   * List IDs processed as one collection job.
   */
  targetListIds?: Array<string>;

  /**
   * Mixed targets auto-routed within one job.
   */
  targets?: Array<string | ExtractionEstimateCostParams.UnionMember1>;

  /**
   * Required for space_explorer.
   */
  targetSpaceId?: string;

  targetTweetId?: string;

  /**
   * Tweet IDs processed as one collection job.
   */
  targetTweetIds?: Array<string>;

  targetUsername?: string;

  /**
   * Usernames processed as one collection job.
   */
  targetUsernames?: Array<string>;

  /**
   * Filter replies sent to a username (tweet_search_extractor)
   */
  toUser?: string;

  /**
   * End date YYYY-MM-DD (tweet_search_extractor)
   */
  untilDate?: string;

  /**
   * Reply end time as ISO 8601 or Unix seconds.
   */
  untilTime?: string | number;

  /**
   * URL substring or domain filter (tweet_search_extractor)
   */
  url?: string;

  /**
   * Required username text.
   */
  usernameContains?: string;

  /**
   * Only verified authors (tweet_search_extractor)
   */
  verifiedOnly?: boolean;

  /**
   * Exact profile verification type.
   */
  verifiedType?: string;

  /**
   * Set the radius for the near filter.
   */
  within?: string;

  /**
   * Match Tweets inside a recent time window.
   */
  withinTime?: string;
}

export namespace ExtractionEstimateCostParams {
  /**
   * One target and relation in a mixed profile collection.
   */
  export interface RelationTarget {
    relation:
      | 'community_members'
      | 'followers'
      | 'following'
      | 'list_followers'
      | 'list_members'
      | 'verified_followers';

    value: string;
  }

  export interface UnionMember1 {
    kind:
      | 'favoriters'
      | 'list'
      | 'profile'
      | 'profile_likes'
      | 'profile_media'
      | 'profile_replies'
      | 'quotes'
      | 'replies'
      | 'retweeters'
      | 'search'
      | 'thread'
      | 'tweet';

    value: string;
  }
}

export interface ExtractionExportResultsParams {
  /**
   * Export file format
   */
  format: 'csv' | 'json' | 'md' | 'md-document' | 'pdf' | 'txt' | 'xlsx';

  /**
   * Require a non-empty description.
   */
  hasDescription?: boolean;

  /**
   * Require a non-empty location.
   */
  hasLocation?: boolean;

  /**
   * Require media.
   */
  hasMedia?: boolean;

  /**
   * Filter by language code.
   */
  lang?: string;

  /**
   * Maximum follower count.
   */
  maxFollowers?: number;

  /**
   * Maximum following count.
   */
  maxFollowing?: number;

  /**
   * Maximum post count.
   */
  maxPosts?: number;

  /**
   * Minimum follower count.
   */
  minFollowers?: number;

  /**
   * Minimum following count.
   */
  minFollowing?: number;

  /**
   * Minimum like count.
   */
  minLikes?: number;

  /**
   * Minimum post count.
   */
  minPosts?: number;

  /**
   * Minimum reply count.
   */
  minReplies?: number;

  /**
   * Minimum repost count.
   */
  minRetweets?: number;

  /**
   * Minimum view count.
   */
  minViews?: number;

  /**
   * Search exported result text.
   */
  search?: string;

  /**
   * Include results on or after this date.
   */
  sinceDate?: string;

  /**
   * Include results on or before this date.
   */
  untilDate?: string;

  /**
   * Filter by verified status.
   */
  verified?: boolean;
}

export interface ExtractionRunParams {
  /**
   * Body param: Identifier for the extraction tool used to run a job.
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
   * Query param: Estimate cost without creating an extraction.
   */
  dry_run?: boolean;

  /**
   * Body param: Raw advanced search query appended as-is (tweet_search_extractor)
   */
  advancedQuery?: string;

  /**
   * Body param: Words or quoted phrases where any one can match. Separate with
   * spaces, commas, or lines. (tweet_search_extractor)
   */
  anyWords?: string;

  /**
   * Body param: Bio terms separated by commas or lines.
   */
  bioContains?: string;

  /**
   * Body param: Return only Blue-verified Tweet authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Body param: Geo bounding box, e.g. -74.1 40.6 -73.9 40.8
   * (tweet_search_extractor)
   */
  boundingBox?: string;

  /**
   * Body param: Match the Tweet card name.
   */
  cardName?: string;

  /**
   * Body param: Cashtags separated by spaces, commas, or lines.
   * (tweet_search_extractor)
   */
  cashtags?: string;

  /**
   * Body param: Reply collection strategy.
   */
  collectionStrategy?: 'auto' | 'complete' | 'direct' | 'search' | 'thread';

  /**
   * Body param: Conversation ID filter (tweet_search_extractor)
   */
  conversationId?: string;

  /**
   * Body param: Merge duplicate results across collection targets.
   */
  dedupeAcrossTargets?: boolean;

  /**
   * Body param: Keep target duplicates, first rows, or merged overlap.
   */
  dedupeMode?: 'none' | 'first' | 'merge';

  /**
   * Body param: Exact phrase to match (tweet_search_extractor)
   */
  exactPhrase?: string;

  /**
   * Body param: Exclude replies from the source author.
   */
  excludeOriginalAuthor?: boolean;

  /**
   * Body param: Exclude a source application.
   */
  excludeSource?: string;

  /**
   * Body param: Words or quoted phrases to exclude. Separate with spaces, commas, or
   * lines. (tweet_search_extractor)
   */
  excludeWords?: string;

  /**
   * Body param: Filter by author username (tweet_search_extractor)
   */
  fromUser?: string;

  /**
   * Body param: Match latitude, longitude, and radius.
   */
  geocode?: string;

  /**
   * Body param: Hashtags separated by spaces, commas, or lines.
   * (tweet_search_extractor)
   */
  hashtags?: string;

  /**
   * Body param: Require a profile location.
   */
  hasLocation?: boolean;

  /**
   * Body param: Return only replies with media.
   */
  hasMediaOnly?: boolean;

  /**
   * Body param: Require a profile website.
   */
  hasWebsite?: boolean;

  /**
   * Body param: Include the source post in reply results.
   */
  includeOriginalPost?: boolean;

  /**
   * Body param: Add matching search terms to collection metadata.
   */
  includeSearchTerms?: boolean;

  /**
   * Body param: Add source target metadata to each result.
   */
  includeTargetMetadata?: boolean;

  /**
   * Body param: Only replies to this tweet ID (tweet_search_extractor)
   */
  inReplyToTweetId?: string;

  /**
   * Body param: Language code filter (tweet_search_extractor)
   */
  language?: string;

  /**
   * Body param: Search within a list ID (tweet_search_extractor)
   */
  listId?: string;

  /**
   * Body param: Required profile location text.
   */
  locationContains?: string;

  /**
   * Body param: Maximum nested reply depth.
   */
  maxDepth?: number;

  /**
   * Body param: Maximum follower count for profile results.
   */
  maxFollowers?: number;

  /**
   * Body param: Maximum following count for profile results.
   */
  maxFollowing?: number;

  /**
   * Body param: Return Tweets older than this Tweet ID.
   */
  maxId?: string;

  /**
   * Body param: Maximum results collected for each target.
   */
  maxItemsPerTarget?: number;

  /**
   * Body param: Maximum Tweet like count.
   */
  maxLikes?: number;

  /**
   * Body param: Reply pages collected for each target.
   */
  maxPagesPerTarget?: number;

  /**
   * Body param: Maximum post count for profile results.
   */
  maxPosts?: number;

  /**
   * Body param: Maximum Tweet quote count.
   */
  maxQuotes?: number;

  /**
   * Body param: Maximum Tweet reply count.
   */
  maxReplies?: number;

  /**
   * Body param: Maximum Tweet repost count.
   */
  maxRetweets?: number;

  /**
   * Body param: Media type filter (tweet_search_extractor)
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Body param: Filter tweets mentioning a username (tweet_search_extractor)
   */
  mentioning?: string;

  /**
   * Body param: Minimum profile age in days.
   */
  minAccountAgeDays?: number;

  /**
   * Body param: Minimum Tweet bookmark count.
   */
  minBookmarks?: number;

  /**
   * Body param: Minimum likes threshold (tweet_search_extractor)
   */
  minFaves?: number;

  /**
   * Body param: Minimum follower count for profile results.
   */
  minFollowers?: number;

  /**
   * Body param: Minimum following count for profile results.
   */
  minFollowing?: number;

  /**
   * Body param: Minimum post count for profile results.
   */
  minPosts?: number;

  /**
   * Body param: Minimum quote count threshold (tweet_search_extractor)
   */
  minQuotes?: number;

  /**
   * Body param: Minimum replies threshold (tweet_search_extractor)
   */
  minReplies?: number;

  /**
   * Body param: Minimum retweets threshold (tweet_search_extractor)
   */
  minRetweets?: number;

  /**
   * Body param: Minimum Tweet view count.
   */
  minViews?: number;

  /**
   * Body param: Only return native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * Body param: Match a place name.
   */
  near?: string;

  /**
   * Body param: Only return news results.
   */
  news?: boolean;

  /**
   * Body param: Shortcut for dedupeMode=merge.
   */
  overlapMode?: boolean;

  /**
   * Body param: Search within a place ID (tweet_search_extractor)
   */
  place?: string;

  /**
   * Body param: Search within a country code (tweet_search_extractor)
   */
  placeCountry?: string;

  /**
   * Body param: Geo point radius, e.g. -73.99 40.73 25mi (tweet_search_extractor)
   */
  pointRadius?: string;

  /**
   * Body param: Search ranking applied to every query.
   */
  queryType?: 'Latest' | 'Top' | 'Both';

  /**
   * Body param: Quote mode (tweet_search_extractor)
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Body param: Only quotes of this tweet ID (tweet_search_extractor)
   */
  quotesOfTweetId?: string;

  /**
   * Body param: Profile relations processed within one job.
   */
  relationTargets?: Array<ExtractionRunParams.RelationTarget>;

  /**
   * Body param: Reply mode (tweet_search_extractor)
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Body param: Maximum number of results to extract. When set, the extraction stops
   * after reaching this limit.
   */
  resultsLimit?: number;

  /**
   * Body param: Retweet mode (tweet_search_extractor)
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Body param: Only retweets of this tweet ID (tweet_search_extractor)
   */
  retweetsOfTweetId?: string;

  /**
   * Body param: Enable the safe-search filter.
   */
  safe?: boolean;

  /**
   * Body param: Reply depth scope.
   */
  scope?: 'all' | 'direct' | 'nested';

  /**
   * Body param: Search queries processed as one collection job.
   */
  searchQueries?: Array<string>;

  /**
   * Body param: Required for tweet_search_extractor & community_search.
   */
  searchQuery?: string;

  /**
   * Body param: Start date YYYY-MM-DD (tweet_search_extractor)
   */
  sinceDate?: string;

  /**
   * Body param: Return Tweets newer than this Tweet ID.
   */
  sinceId?: string;

  /**
   * Body param: Reply start time as ISO 8601 or Unix seconds.
   */
  sinceTime?: string | number;

  /**
   * Body param: Reply result order.
   */
  sort?: 'relevance' | 'latest' | 'oldest' | 'likes';

  /**
   * Body param: Match the source application.
   */
  source?: string;

  /**
   * Body param: Resume one reply target from this cursor.
   */
  startCursor?: string;

  /**
   * Body param: Required for community_post_extractor & community_search.
   */
  targetCommunityId?: string;

  /**
   * Body param: Community IDs processed as one collection job.
   */
  targetCommunityIds?: Array<string>;

  /**
   * Body param: Required for list_follower_explorer, list_member_extractor &
   * list_post_extractor.
   */
  targetListId?: string;

  /**
   * Body param: List IDs processed as one collection job.
   */
  targetListIds?: Array<string>;

  /**
   * Body param: Mixed targets auto-routed within one job.
   */
  targets?: Array<string | ExtractionRunParams.UnionMember1>;

  /**
   * Body param: Required for space_explorer.
   */
  targetSpaceId?: string;

  /**
   * Body param
   */
  targetTweetId?: string;

  /**
   * Body param: Tweet IDs processed as one collection job.
   */
  targetTweetIds?: Array<string>;

  /**
   * Body param
   */
  targetUsername?: string;

  /**
   * Body param: Usernames processed as one collection job.
   */
  targetUsernames?: Array<string>;

  /**
   * Body param: Filter replies sent to a username (tweet_search_extractor)
   */
  toUser?: string;

  /**
   * Body param: End date YYYY-MM-DD (tweet_search_extractor)
   */
  untilDate?: string;

  /**
   * Body param: Reply end time as ISO 8601 or Unix seconds.
   */
  untilTime?: string | number;

  /**
   * Body param: URL substring or domain filter (tweet_search_extractor)
   */
  url?: string;

  /**
   * Body param: Required username text.
   */
  usernameContains?: string;

  /**
   * Body param: Only verified authors (tweet_search_extractor)
   */
  verifiedOnly?: boolean;

  /**
   * Body param: Exact profile verification type.
   */
  verifiedType?: string;

  /**
   * Body param: Set the radius for the near filter.
   */
  within?: string;

  /**
   * Body param: Match Tweets inside a recent time window.
   */
  withinTime?: string;
}

export namespace ExtractionRunParams {
  /**
   * One target and relation in a mixed profile collection.
   */
  export interface RelationTarget {
    relation:
      | 'community_members'
      | 'followers'
      | 'following'
      | 'list_followers'
      | 'list_members'
      | 'verified_followers';

    value: string;
  }

  export interface UnionMember1 {
    kind:
      | 'favoriters'
      | 'list'
      | 'profile'
      | 'profile_likes'
      | 'profile_media'
      | 'profile_replies'
      | 'quotes'
      | 'replies'
      | 'retweeters'
      | 'search'
      | 'thread'
      | 'tweet';

    value: string;
  }
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
