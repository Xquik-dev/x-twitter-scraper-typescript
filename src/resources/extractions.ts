// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Saved or bulk data extraction (23 tool types)
 */
export class Extractions extends APIResource {
  /**
   * Returns status and up to 1,000 results. Follow nextCursor when hasMore is true.
   *
   * @example
   * ```ts
   * const extraction = await client.extractions.retrieve(
   *   'L3NjAbCdEfGh',
   * );
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
   * Returns extraction jobs with status and result counts.
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
   * Cancels an active extraction without charging or saving rows.
   *
   * @example
   * ```ts
   * const response = await client.extractions.cancel(
   *   'L3NjAbCdEfGh',
   * );
   * ```
   */
  cancel(id: string, options?: RequestOptions): APIPromise<ExtractionCancelResponse> {
    return this._client.delete(path`/extractions/${id}`, options);
  }

  /**
   * Estimates extraction cost without creating a job.
   *
   * @example
   * ```ts
   * const response = await client.extractions.estimateCost({
   *   toolType: 'follower_explorer',
   *   bioContains: 'space, astronomy',
   *   businessEmailOnly: true,
   *   emailDomains: 'nasa.gov',
   *   enrichProfiles: true,
   *   hasEmail: true,
   *   hasLocation: true,
   *   hasWebsite: true,
   *   locationContains: 'Houston',
   *   maxFollowers: 1000000,
   *   maxFollowing: 5000,
   *   maxPosts: 100000,
   *   minAccountAgeDays: 365,
   *   minFollowers: 1000,
   *   minFollowing: 10,
   *   minPosts: 100,
   *   resultsLimit: 500,
   *   targetUsername: 'NASA',
   *   usernameContains: 'space',
   *   verifiedType: 'Business',
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
   * Downloads completed extraction results in the requested format. JSON rows also
   * keep each result's nested `enrichmentData`, as `GET /extractions/{id}` returns
   * it.
   *
   * @example
   * ```ts
   * const response = await client.extractions.exportResults(
   *   'L3NjAbCdEfGh',
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
   * Starts one single-target or multi-target extraction. Follow waitUrl, then page
   * statusUrl after completion.
   *
   * @example
   * ```ts
   * const response = await client.extractions.run({
   *   toolType: 'follower_explorer',
   *   bioContains: 'space, astronomy',
   *   businessEmailOnly: true,
   *   emailDomains: 'nasa.gov',
   *   enrichProfiles: true,
   *   hasEmail: true,
   *   hasLocation: true,
   *   hasWebsite: true,
   *   locationContains: 'Houston',
   *   maxFollowers: 1000000,
   *   maxFollowing: 5000,
   *   maxPosts: 100000,
   *   minAccountAgeDays: 365,
   *   minFollowers: 1000,
   *   minFollowing: 10,
   *   minPosts: 100,
   *   resultsLimit: 500,
   *   targetUsername: 'NASA',
   *   usernameContains: 'space',
   *   verifiedType: 'Business',
   * });
   * ```
   */
  run(params: ExtractionRunParams, options?: RequestOptions): APIPromise<ExtractionRunResponse> {
    const { dry_run, 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post('/extractions', {
      query: { dry_run },
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
 * Extraction job tracking status, tool type, and result count.
 */
export interface ExtractionJob {
  id: string;

  createdAt: string;

  status: 'pending' | 'running' | 'canceled' | 'completed' | 'failed';

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
   * Whole number from 0.
   */
  totalResults: number;

  completedAt?: string;

  /**
   * Why a terminal job stopped.
   */
  completionReason?:
    | 'budget_limited'
    | 'canceled'
    | 'deadline_reached'
    | 'failed'
    | 'pagination_safety_limit'
    | 'partial_failure'
    | 'requested_limit_reached'
    | 'source_exhausted';

  /**
   * Result limit after affordability checks.
   */
  effectiveResultsLimit?: number;

  /**
   * Safe error code for a failed job.
   */
  errorMessage?: string;

  /**
   * Requested result limit.
   */
  resultsLimit?: number;
}

export interface ExtractionRetrieveResponse {
  hasMore: boolean;

  /**
   * Extraction job tracking status, tool type, and result count.
   */
  job: ExtractionJob;

  pollAfterMs: number;

  results: Array<ExtractionRetrieveResponse.Result>;

  waitUrl: string;

  nextCursor?: string;
}

export namespace ExtractionRetrieveResponse {
  /**
   * Represents a public row across supported extraction modes.
   */
  export interface Result {
    id: string;

    createdAt: string;

    xUserId: string;

    /**
     * Whole number from 0.
     */
    bookmarkCount?: number;

    /**
     * First email the account publishes on its profile, with outputPreset=flat.
     * Default nested output uses enrichmentData.user.email, beside
     * enrichmentData.user.contactInfo. Absent when the profile publishes none.
     */
    email?: string;

    /**
     * Public metadata whose fields are defined by X.
     */
    enrichmentData?: { [key: string]: unknown };

    /**
     * Whole number from 0.
     */
    likeCount?: number;

    /**
     * Attached media with outputPreset=flat. Default nested output uses
     * enrichmentData.tweet.media.
     */
    media?: Array<Shared.TweetMedia>;

    /**
     * Whole number from 0.
     */
    quoteCount?: number;

    /**
     * Whole number from 0.
     */
    replyCount?: number;

    /**
     * Whole number from 0.
     */
    retweetCount?: number;

    tweetCreatedAt?: string;

    tweetId?: string;

    tweetText?: string;

    tweetUrl?: string;

    /**
     * Badge type X shows on the account, with outputPreset=flat. Business is the gold
     * badge of a verified organization. Government is the grey badge of a government
     * or multilateral account. Blue is the badge of X Premium. Default nested output
     * uses enrichmentData.user.verifiedType. Absent when the account has none of these
     * badges.
     */
    verifiedType?: string;

    /**
     * Whole number from 0.
     */
    viewCount?: number;

    xDisplayName?: string;

    /**
     * Followers of the account. Absent when X sends no count, as for the hosts &
     * speakers of a Space, and never 0 in its place.
     */
    xFollowersCount?: number;

    xProfileImageUrl?: string;

    xUsername?: string;

    xVerified?: boolean;

    [k: string]: unknown;
  }
}

export interface ExtractionListResponse {
  extractions: Array<ExtractionJob>;

  hasMore: boolean;

  nextCursor?: string;
}

export interface ExtractionCancelResponse {
  id: string;

  status: 'canceled';
}

/**
 * Free conservative cost estimate. Post estimates use the supported cap & refuse a
 * protected profile. It never creates a job or charges.
 */
export interface ExtractionEstimateCostResponse {
  /**
   * Whether the balance covers the full estimate.
   */
  allowed: boolean;

  creditsAvailable: string;

  creditsRequired: string;

  /**
   * Credit calculation row count, not source availability.
   */
  estimatedResults: number;

  source:
    | 'followers'
    | 'following'
    | 'collection'
    | 'likeCount'
    | 'paginationCap'
    | 'quoteCount'
    | 'replyCount'
    | 'resultsLimit'
    | 'retweetCount'
    | 'unknown';

  /**
   * Resolved X user ID from count-based profile estimates.
   */
  resolvedXUserId?: string;
}

/**
 * Free conservative cost estimate. Post estimates use the supported cap & refuse a
 * protected profile. It never creates a job or charges.
 */
export type ExtractionRunResponse = ExtractionRunResponse.ExtractionEstimate | ExtractionRunResponse.Accepted;

export namespace ExtractionRunResponse {
  /**
   * Free conservative cost estimate. Post estimates use the supported cap & refuse a
   * protected profile. It never creates a job or charges.
   */
  export interface ExtractionEstimate {
    /**
     * Whether the balance covers the full estimate.
     */
    allowed: boolean;

    creditsAvailable: string;

    creditsRequired: string;

    /**
     * Credit calculation row count, not source availability.
     */
    estimatedResults: number;

    source:
      | 'followers'
      | 'following'
      | 'collection'
      | 'likeCount'
      | 'paginationCap'
      | 'quoteCount'
      | 'replyCount'
      | 'resultsLimit'
      | 'retweetCount'
      | 'unknown';

    /**
     * Resolved X user ID from count-based profile estimates.
     */
    resolvedXUserId?: string;
  }

  export interface Accepted {
    id: string;

    pollAfterMs: number;

    status: 'pending' | 'running' | 'canceled' | 'completed' | 'failed';

    statusUrl: string;

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

    waitUrl: string;
  }
}

export interface ExtractionRetrieveParams {
  /**
   * Previous nextCursor. The after alias also works. Offset pagination is not
   * supported.
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
   * Maximum results per page (1-1000, default 100).
   */
  limit?: number;

  /**
   * Use compact for core fields and tweet counts, full for nested enrichment, or raw
   * for a source copy.
   */
  outputMode?: 'compact' | 'full' | 'raw';

  /**
   * Keep enrichment nested or merge it into each result.
   */
  outputPreset?: 'nested' | 'flat';

  /**
   * Wait up to this many seconds when the job is active.
   */
  wait?: number;
}

export interface ExtractionListParams {
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

  /**
   * Filter by job status
   */
  status?: 'pending' | 'running' | 'canceled' | 'completed' | 'failed';

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
   * Any matching term or phrase (tweet_search_extractor).
   */
  anyWords?: string;

  /**
   * Match any bio term, ignoring case. Separate terms with commas or lines.
   */
  bioContains?: string;

  /**
   * Return only Blue-verified Tweet authors. On a tool that returns users, return
   * only profiles X marks as blue verified.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Geo bounding box, e.g. -74.1 40.6 -73.9 40.8 (tweet_search_extractor)
   */
  boundingBox?: string;

  /**
   * Require an email the profile publishes outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Require Tweet cards whose name matches this value.
   */
  cardName?: string;

  /**
   * Matching cashtags (tweet_search_extractor).
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
   * Require an email at one of these domains. Separate domains with commas.
   * Subdomains match.
   */
  emailDomains?: string;

  /**
   * Add each user's full profile to follower_explorer, following_explorer,
   * verified_follower_explorer, people_search & repost_extractor rows. Jobs take
   * longer.
   */
  enrichProfiles?: boolean;

  /**
   * Exact phrase to match (tweet_search_extractor)
   */
  exactPhrase?: string;

  /**
   * Exclude replies from the source author.
   */
  excludeOriginalAuthor?: boolean;

  /**
   * X search ignores excludeSource, so an extraction with it returns unfiltered
   * rows. Its answers carry `Deprecation` & `Sunset` headers. From 2027-01-15 an
   * extraction with it answers 424 `search_unavailable` & charges nothing.
   */
  excludeSource?: string;

  /**
   * Excluded terms or phrases (tweet_search_extractor).
   */
  excludeWords?: string;

  /**
   * Filter by author username (tweet_search_extractor)
   */
  fromUser?: string;

  /**
   * X search no longer supports geocode. An extraction with it answers 424
   * `search_unavailable` & charges nothing.
   */
  geocode?: string;

  /**
   * Require an email the profile publishes.
   */
  hasEmail?: boolean;

  /**
   * Matching hashtags (tweet_search_extractor).
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
   * Tweet or Community search language.
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
   * Require Tweet IDs at or below this ID.
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
   * Tweet or Community search media.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Mentions this username (tweet_search_extractor).
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
   * Tweet or Community search minimum likes.
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
   * Tweet or Community search minimum replies.
   */
  minReplies?: number;

  /**
   * Tweet or Community search minimum reposts.
   */
  minRetweets?: number;

  /**
   * Tweet or Community search minimum views.
   */
  minViews?: number;

  /**
   * Tweet or Community search native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * Restrict Tweet search to this place name.
   */
  near?: string;

  /**
   * X search no longer supports filter:news. An extraction with news true answers
   * 424 `search_unavailable` & charges nothing.
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
   * Use Top for engagement. The relevance alias maps to Top.
   */
  queryType?: 'Latest' | 'Top' | 'Both' | 'relevance';

  /**
   * Choose whether tweet search includes, excludes, or isolates quotes.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID (tweet_search_extractor)
   */
  quotesOfTweetId?: string;

  /**
   * Profile relations processed within one job. Protected profiles are skipped & the
   * job ends with partial_failure.
   */
  relationTargets?: Array<ExtractionEstimateCostParams.RelationTarget>;

  /**
   * Choose whether tweet search includes, excludes, or isolates replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Maximum unique results to emit. Billing follows emitted results, not this upper
   * bound.
   */
  resultsLimit?: number;

  /**
   * Choose whether tweet search includes, excludes, or isolates reposts.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID (tweet_search_extractor)
   */
  retweetsOfTweetId?: string;

  /**
   * Apply safe-search filtering to Tweet results.
   */
  safe?: boolean;

  /**
   * Reply depth scope.
   */
  scope?: 'all' | 'direct' | 'nested';

  /**
   * Search queries processed as one collection job. Each follows the rules of
   * searchQuery, its structured fields & 512-character limit included.
   */
  searchQueries?: Array<string>;

  /**
   * Required for tweet_search_extractor, people_search & community_search.
   * tweet_search_extractor adds the structured search fields, such as fromUser &
   * minFaves, to this query. X searches up to 512 characters. A longer tweet or
   * people search answers 400, counted with the added fields.
   */
  searchQuery?: string;

  /**
   * Tweet or Community search start date.
   */
  sinceDate?: string;

  /**
   * Require Tweet IDs above this ID.
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
   * X search no longer supports source. An extraction with it answers 424
   * `search_unavailable` & charges nothing.
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
   * Mixed targets auto-routed within one job. Use tweet, replies, quotes, thread, or
   * profile_media kinds to collect attached media. Protected profiles are skipped &
   * the job ends with partial_failure.
   */
  targets?: Array<string | ExtractionEstimateCostParams.UnionMember1>;

  /**
   * Required for space_explorer. X names a Space's hosts & speakers without counts
   * or bio, so Xquik reads each one's profile. Rows carry it, & profile filters such
   * as minFollowers check it.
   */
  targetSpaceId?: string;

  targetTweetId?: string;

  /**
   * Tweet IDs processed as one collection job.
   */
  targetTweetIds?: Array<string>;

  targetUsername?: string;

  /**
   * Usernames processed concurrently in one job. With tweet_search_extractor, each
   * username collects posts. Post & media jobs skip a protected profile & end with
   * partial_failure.
   */
  targetUsernames?: Array<string>;

  /**
   * Replies to this username (tweet_search_extractor).
   */
  toUser?: string;

  /**
   * Tweet or Community search end date.
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
   * Tweet or Community search verified authors.
   */
  verifiedOnly?: boolean;

  /**
   * Exact profile verification type.
   */
  verifiedType?: string;

  /**
   * X search no longer supports within. An extraction with it answers 424
   * `search_unavailable` & charges nothing. Use near alone.
   */
  within?: string;

  /**
   * Restrict Tweets to this recent time window.
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
   * Require an email outside free webmail, such as Gmail, in the row's Email column.
   */
  businessEmailOnly?: boolean;

  /**
   * Require the row's email at one of these domains. Separate domains with commas.
   * Subdomains match.
   */
  emailDomains?: string;

  /**
   * Require a non-empty description.
   */
  hasDescription?: boolean;

  /**
   * Require an email in the row's Email column.
   */
  hasEmail?: boolean;

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
   * Include results on or after this date, from 00:00 UTC. An ISO 8601 time starts
   * at that instant. Results without a post date are left out. An empty value sets
   * no filter.
   */
  sinceDate?: string;

  /**
   * Include results on or before this date, inclusive, through 23:59:59 UTC. An ISO
   * 8601 time ends at that instant. Results without a post date are left out. An
   * empty value sets no filter.
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
   * Body param: Any matching term or phrase (tweet_search_extractor).
   */
  anyWords?: string;

  /**
   * Body param: Match any bio term, ignoring case. Separate terms with commas or
   * lines.
   */
  bioContains?: string;

  /**
   * Body param: Return only Blue-verified Tweet authors. On a tool that returns
   * users, return only profiles X marks as blue verified.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Body param: Geo bounding box, e.g. -74.1 40.6 -73.9 40.8
   * (tweet_search_extractor)
   */
  boundingBox?: string;

  /**
   * Body param: Require an email the profile publishes outside free webmail, such as
   * Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Body param: Require Tweet cards whose name matches this value.
   */
  cardName?: string;

  /**
   * Body param: Matching cashtags (tweet_search_extractor).
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
   * Body param: Require an email at one of these domains. Separate domains with
   * commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Body param: Add each user's full profile to follower_explorer,
   * following_explorer, verified_follower_explorer, people_search & repost_extractor
   * rows. Jobs take longer.
   */
  enrichProfiles?: boolean;

  /**
   * Body param: Exact phrase to match (tweet_search_extractor)
   */
  exactPhrase?: string;

  /**
   * Body param: Exclude replies from the source author.
   */
  excludeOriginalAuthor?: boolean;

  /**
   * Body param: X search ignores excludeSource, so an extraction with it returns
   * unfiltered rows. Its answers carry `Deprecation` & `Sunset` headers. From
   * 2027-01-15 an extraction with it answers 424 `search_unavailable` & charges
   * nothing.
   */
  excludeSource?: string;

  /**
   * Body param: Excluded terms or phrases (tweet_search_extractor).
   */
  excludeWords?: string;

  /**
   * Body param: Filter by author username (tweet_search_extractor)
   */
  fromUser?: string;

  /**
   * Body param: X search no longer supports geocode. An extraction with it answers
   * 424 `search_unavailable` & charges nothing.
   */
  geocode?: string;

  /**
   * Body param: Require an email the profile publishes.
   */
  hasEmail?: boolean;

  /**
   * Body param: Matching hashtags (tweet_search_extractor).
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
   * Body param: Tweet or Community search language.
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
   * Body param: Require Tweet IDs at or below this ID.
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
   * Body param: Tweet or Community search media.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Body param: Mentions this username (tweet_search_extractor).
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
   * Body param: Tweet or Community search minimum likes.
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
   * Body param: Tweet or Community search minimum replies.
   */
  minReplies?: number;

  /**
   * Body param: Tweet or Community search minimum reposts.
   */
  minRetweets?: number;

  /**
   * Body param: Tweet or Community search minimum views.
   */
  minViews?: number;

  /**
   * Body param: Tweet or Community search native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * Body param: Restrict Tweet search to this place name.
   */
  near?: string;

  /**
   * Body param: X search no longer supports filter:news. An extraction with news
   * true answers 424 `search_unavailable` & charges nothing.
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
   * Body param: Use Top for engagement. The relevance alias maps to Top.
   */
  queryType?: 'Latest' | 'Top' | 'Both' | 'relevance';

  /**
   * Body param: Choose whether tweet search includes, excludes, or isolates quotes.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Body param: Only quotes of this tweet ID (tweet_search_extractor)
   */
  quotesOfTweetId?: string;

  /**
   * Body param: Profile relations processed within one job. Protected profiles are
   * skipped & the job ends with partial_failure.
   */
  relationTargets?: Array<ExtractionRunParams.RelationTarget>;

  /**
   * Body param: Choose whether tweet search includes, excludes, or isolates replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Body param: Maximum unique results to emit. Billing follows emitted results, not
   * this upper bound.
   */
  resultsLimit?: number;

  /**
   * Body param: Choose whether tweet search includes, excludes, or isolates reposts.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Body param: Only retweets of this tweet ID (tweet_search_extractor)
   */
  retweetsOfTweetId?: string;

  /**
   * Body param: Apply safe-search filtering to Tweet results.
   */
  safe?: boolean;

  /**
   * Body param: Reply depth scope.
   */
  scope?: 'all' | 'direct' | 'nested';

  /**
   * Body param: Search queries processed as one collection job. Each follows the
   * rules of searchQuery, its structured fields & 512-character limit included.
   */
  searchQueries?: Array<string>;

  /**
   * Body param: Required for tweet_search_extractor, people_search &
   * community_search. tweet_search_extractor adds the structured search fields, such
   * as fromUser & minFaves, to this query. X searches up to 512 characters. A longer
   * tweet or people search answers 400, counted with the added fields.
   */
  searchQuery?: string;

  /**
   * Body param: Tweet or Community search start date.
   */
  sinceDate?: string;

  /**
   * Body param: Require Tweet IDs above this ID.
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
   * Body param: X search no longer supports source. An extraction with it answers
   * 424 `search_unavailable` & charges nothing.
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
   * Body param: Mixed targets auto-routed within one job. Use tweet, replies,
   * quotes, thread, or profile_media kinds to collect attached media. Protected
   * profiles are skipped & the job ends with partial_failure.
   */
  targets?: Array<string | ExtractionRunParams.UnionMember1>;

  /**
   * Body param: Required for space_explorer. X names a Space's hosts & speakers
   * without counts or bio, so Xquik reads each one's profile. Rows carry it, &
   * profile filters such as minFollowers check it.
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
   * Body param: Usernames processed concurrently in one job. With
   * tweet_search_extractor, each username collects posts. Post & media jobs skip a
   * protected profile & end with partial_failure.
   */
  targetUsernames?: Array<string>;

  /**
   * Body param: Replies to this username (tweet_search_extractor).
   */
  toUser?: string;

  /**
   * Body param: Tweet or Community search end date.
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
   * Body param: Tweet or Community search verified authors.
   */
  verifiedOnly?: boolean;

  /**
   * Body param: Exact profile verification type.
   */
  verifiedType?: string;

  /**
   * Body param: X search no longer supports within. An extraction with it answers
   * 424 `search_unavailable` & charges nothing. Use near alone.
   */
  within?: string;

  /**
   * Body param: Restrict Tweets to this recent time window.
   */
  withinTime?: string;

  /**
   * Header param: Generate 1 unique value per intended request. Reuse it only to
   * retry the same request. Exact retries return the original result & charge
   * nothing.
   */
  'Idempotency-Key'?: string;
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
    type ExtractionCancelResponse as ExtractionCancelResponse,
    type ExtractionEstimateCostResponse as ExtractionEstimateCostResponse,
    type ExtractionRunResponse as ExtractionRunResponse,
    type ExtractionRetrieveParams as ExtractionRetrieveParams,
    type ExtractionListParams as ExtractionListParams,
    type ExtractionEstimateCostParams as ExtractionEstimateCostParams,
    type ExtractionExportResultsParams as ExtractionExportResultsParams,
    type ExtractionRunParams as ExtractionRunParams,
  };
}
