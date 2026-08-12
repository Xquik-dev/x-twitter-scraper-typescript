// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as Shared from '../../shared';
import * as LikeAPI from './like';
import { Like, LikeCreateParams, LikeCreateResponse, LikeDeleteParams, LikeDeleteResponse } from './like';
import * as RetweetAPI from './retweet';
import {
  Retweet,
  RetweetCreateParams,
  RetweetCreateResponse,
  RetweetDeleteParams,
  RetweetDeleteResponse,
} from './retweet';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Tweets extends APIResource {
  like: LikeAPI.Like = new LikeAPI.Like(this._client);
  retweet: RetweetAPI.Retweet = new RetweetAPI.Retweet(this._client);

  /**
   * Create tweet
   *
   * @example
   * ```ts
   * const tweet = await client.x.tweets.create({
   *   account: '@elonmusk',
   *   'Idempotency-Key': 'Idempotency-Key',
   *   text: 'Just launched our new feature!',
   * });
   * ```
   */
  create(params: TweetCreateParams, options?: RequestOptions): APIPromise<TweetCreateResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post('/x/tweets', {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
    });
  }

  /**
   * Get tweet with full text, author, metrics and media
   *
   * @example
   * ```ts
   * const tweet = await client.x.tweets.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<TweetRetrieveResponse> {
    return this._client.get(path`/x/tweets/${id}`, options);
  }

  /**
   * Get multiple tweets by IDs
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.list({
   *   ids: 'ids',
   * });
   * ```
   */
  list(query: TweetListParams, options?: RequestOptions): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/tweets', { query, ...options });
  }

  /**
   * Delete tweet
   *
   * @example
   * ```ts
   * const tweet = await client.x.tweets.delete('id', {
   *   account: '@elonmusk',
   *   'Idempotency-Key': 'Idempotency-Key',
   * });
   * ```
   */
  delete(id: string, params: TweetDeleteParams, options?: RequestOptions): APIPromise<TweetDeleteResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.delete(path`/x/tweets/${id}`, {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
    });
  }

  /**
   * Returns liker profiles that X makes visible for the post. X can withhold liker
   * identities even when the post reports likes. In that case this endpoint returns
   * 424 `favoriters_unavailable` instead of a misleading empty success.
   *
   * @example
   * ```ts
   * const paginatedUsers = await client.x.tweets.getFavoriters(
   *   'id',
   * );
   * ```
   */
  getFavoriters(
    id: string,
    query: TweetGetFavoritersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/tweets/${id}/favoriters`, { query, ...options });
  }

  /**
   * List quote tweets of a tweet
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.getQuotes(
   *   'id',
   * );
   * ```
   */
  getQuotes(
    id: string,
    query: TweetGetQuotesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/tweets/${id}/quotes`, { query, ...options });
  }

  /**
   * Returns direct replies. Omit mode for automatic maximum coverage with resumable
   * pagination. Complete mode returns nested replies, diagnostics, and 424 when
   * direct coverage stays below 80%.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.getReplies('id');
   * ```
   */
  getReplies(
    id: string,
    query: TweetGetRepliesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetGetRepliesResponse> {
    return this._client.get(path`/x/tweets/${id}/replies`, { query, ...options });
  }

  /**
   * List users who retweeted a tweet
   *
   * @example
   * ```ts
   * const paginatedUsers = await client.x.tweets.getRetweeters(
   *   'id',
   * );
   * ```
   */
  getRetweeters(
    id: string,
    query: TweetGetRetweetersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/tweets/${id}/retweeters`, { query, ...options });
  }

  /**
   * Get full conversation thread for a tweet
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.getThread(
   *   'id',
   * );
   * ```
   */
  getThread(
    id: string,
    query: TweetGetThreadParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/tweets/${id}/thread`, { query, ...options });
  }

  /**
   * No-mode search maximizes coverage. New cursorless `Latest` sessions return rows
   * newest-first across cursor pages. Existing cursors preserve their established
   * ordering.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.search({ q: 'q' });
   * ```
   */
  search(query: TweetSearchParams, options?: RequestOptions): APIPromise<TweetSearchResponse> {
    return this._client.get('/x/tweets/search', { query, ...options });
  }
}

/**
 * Tweet author profile. The lookup route always includes follower count and
 * verification state. Other profile fields appear when available.
 */
export interface TweetAuthor extends Shared.UserProfile {
  followers: number;

  verified: boolean;
}

/**
 * Full tweet with text, engagement metrics, media, and metadata. A zero metric can
 * mean X did not report the count.
 */
export interface TweetDetail {
  id: string;

  bookmarkCount: number;

  likeCount: number;

  quoteCount: number;

  replyCount: number;

  retweetCount: number;

  text: string;

  viewCount: number;

  /**
   * Article metadata attached to a tweet.
   */
  article?: TweetDetail.Article;

  /**
   * Tweet author profile. The lookup route always includes follower count and
   * verification state. Other profile fields appear when available.
   */
  author?: TweetAuthor;

  /**
   * Public card metadata attached to a tweet.
   */
  card?: TweetDetail.Card;

  /**
   * Community Note presentation metadata returned by X.
   */
  communityNote?: TweetDetail.CommunityNote;

  /**
   * Content disclosure metadata shown by X when a tweet is labeled as paid
   * partnership content or AI-generated media.
   */
  contentDisclosure?: Shared.ContentDisclosure;

  /**
   * ID of the root tweet in the conversation thread
   */
  conversationId?: string;

  createdAt?: string;

  /**
   * Start and end offsets for rendered tweet text
   */
  displayTextRange?: Array<number>;

  /**
   * Edit history metadata returned by X.
   */
  edit?: TweetDetail.Edit;

  /**
   * Parsed entities from the tweet text (URLs, mentions, hashtags, media)
   */
  entities?: { [key: string]: unknown };

  /**
   * Tweet ID being replied to
   */
  inReplyToId?: string;

  /**
   * User ID being replied to
   */
  inReplyToUserId?: string;

  /**
   * Username being replied to
   */
  inReplyToUsername?: string;

  /**
   * Whether replies are limited for this tweet
   */
  isLimitedReply?: boolean;

  /**
   * Whether this is a Note Tweet (long-form post, up to 25,000 characters)
   */
  isNoteTweet?: boolean;

  /**
   * Whether this tweet quotes another tweet
   */
  isQuoteStatus?: boolean;

  /**
   * Whether this tweet is a reply to another tweet
   */
  isReply?: boolean;

  isTranslatable?: boolean;

  /**
   * Tweet language code
   */
  lang?: string;

  /**
   * Attached media items, omitted when the tweet has no media
   */
  media?: Array<Shared.TweetMedia>;

  /**
   * Complete Note Tweet content and rich-text metadata.
   */
  noteTweet?: TweetDetail.NoteTweet;

  /**
   * Public place metadata attached to a tweet.
   */
  place?: TweetDetail.Place;

  possiblySensitive?: boolean;

  /**
   * Engagement counts retained from a prior tweet edit.
   */
  previousCounts?: TweetDetail.PreviousCounts;

  /**
   * Quoted or retweeted tweet context. Every object includes id, text, and
   * engagement metrics. A zero metric can mean X did not report the count. Author,
   * media, and conversation fields appear when available.
   */
  quoted_tweet?: Shared.EmbeddedTweet;

  /**
   * Quoted or retweeted tweet context. Every object includes id, text, and
   * engagement metrics. A zero metric can mean X did not report the count. Author,
   * media, and conversation fields appear when available.
   */
  retweeted_tweet?: Shared.EmbeddedTweet;

  /**
   * Client application used to post this tweet
   */
  source?: string;

  /**
   * Tweet result type
   */
  type?: string;

  /**
   * Tweet permalink URL
   */
  url?: string;

  viewState?: string;
}

export namespace TweetDetail {
  /**
   * Article metadata attached to a tweet.
   */
  export interface Article {
    id?: string;

    coverMediaUrl?: string;

    previewText?: string;

    title?: string;
  }

  /**
   * Public card metadata attached to a tweet.
   */
  export interface Card {
    id?: string;

    bindingValues?: { [key: string]: unknown };

    name?: string;

    url?: string;
  }

  /**
   * Community Note presentation metadata returned by X.
   */
  export interface CommunityNote {
    id?: string;

    destinationUrl?: string;

    footer?: string;

    shortTitle?: string;

    subtitle?: string;

    title?: string;

    visualStyle?: string;
  }

  /**
   * Edit history metadata returned by X.
   */
  export interface Edit {
    editableUntilMsecs?: string;

    editTweetIds?: Array<string>;
  }

  /**
   * Complete Note Tweet content and rich-text metadata.
   */
  export interface NoteTweet {
    text: string;

    id?: string;

    entities?: { [key: string]: unknown };

    isExpandable?: boolean;

    richtextTags?: Array<NoteTweet.RichtextTag>;
  }

  export namespace NoteTweet {
    export interface RichtextTag {
      fromIndex: number;

      toIndex: number;

      types: Array<string>;
    }
  }

  /**
   * Public place metadata attached to a tweet.
   */
  export interface Place {
    id?: string;

    boundingBox?: { [key: string]: unknown };

    country?: string;

    countryCode?: string;

    fullName?: string;

    name?: string;

    placeType?: string;

    url?: string;
  }

  /**
   * Engagement counts retained from a prior tweet edit.
   */
  export interface PreviousCounts {
    bookmarkCount?: number;

    likeCount?: number;

    quoteCount?: number;

    replyCount?: number;

    retweetCount?: number;
  }
}

/**
 * Durable write lifecycle record. Poll statusUrl until terminal is true. Reusing
 * the original Idempotency-Key returns this same record. Submit a new write only
 * when safeToRetry is true, using a new key.
 */
export interface TweetCreateResponse {
  id: string;

  /**
   * Connected account selected for the write.
   */
  account: TweetCreateResponse.Account | null;

  action:
    | 'create_tweet'
    | 'delete_tweet'
    | 'like'
    | 'unlike'
    | 'retweet'
    | 'unretweet'
    | 'follow'
    | 'unfollow'
    | 'remove_follower'
    | 'send_dm'
    | 'upload_media'
    | 'update_profile'
    | 'update_avatar'
    | 'update_banner'
    | 'create_community'
    | 'delete_community'
    | 'join_community'
    | 'leave_community';

  /**
   * plannedCredits is the approved maximum. chargedCredits comes from the settled
   * credit ledger. Pending or failed writes are not charged.
   */
  billing: TweetCreateResponse.Billing;

  charged: boolean;

  chargedCredits: string;

  /**
   * Exact follow-up an API client or agent should perform.
   */
  nextAction: TweetCreateResponse.NextAction | null;

  object: 'x_write_action';

  pollAfterMs: number | null;

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  request: TweetCreateResponse.Request;

  /**
   * Confirmed result produced by the write, when available.
   */
  result: TweetCreateResponse.Result | null;

  /**
   * True only when a new attempt can reasonably succeed.
   */
  retryable: boolean;

  /**
   * True only when no write was dispatched and a new idempotency key may be used.
   */
  safeToRetry: boolean;

  sendDispatched: boolean;

  status: 'accepted' | 'dispatching' | 'pending_confirmation' | 'success' | 'failed' | 'expired';

  statusUrl: string;

  success: boolean;

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  target: TweetCreateResponse.Target | null;

  targetId: string | null;

  terminal: boolean;

  writeActionId: string;

  /**
   * Compatibility field for a confirmed community ID.
   */
  communityId?: string;

  /**
   * Confirmed community name when available.
   */
  communityName?: string;

  completedAt?: string;

  confirmationAttempts?: number;

  confirmationCheckedAt?: string;

  confirmedAt?: string;

  createdAt?: string;

  /**
   * Structured recovery context for a failed write.
   */
  details?: { [key: string]: unknown };

  error?: string;

  /**
   * Deadline for resolving a non-terminal write. This is not the Idempotency-Key
   * retention deadline.
   */
  expiresAt?: string;

  idempotent?: boolean;

  /**
   * Media count, kind, size, and billing details when used.
   */
  media?: { [key: string]: unknown };

  /**
   * Compatibility field for a confirmed media upload ID.
   */
  mediaId?: string;

  /**
   * Public media URL when the upload creates one.
   */
  mediaUrl?: string;

  message?: string;

  /**
   * Compatibility field for a confirmed direct message ID.
   */
  messageId?: string;

  requestHash?: string;

  requestId?: string;

  /**
   * Compatibility result ID for other write actions.
   */
  resultId?: string;

  /**
   * Dispatch timestamp when the write reached execution.
   */
  sendDispatchedAt?: string;

  /**
   * Compatibility field for a confirmed tweet result ID.
   */
  tweetId?: string;

  updatedAt?: string;
}

export namespace TweetCreateResponse {
  /**
   * Connected account selected for the write.
   */
  export interface Account {
    id: string;

    username: string;
  }

  /**
   * plannedCredits is the approved maximum. chargedCredits comes from the settled
   * credit ledger. Pending or failed writes are not charged.
   */
  export interface Billing {
    charged: boolean;

    chargedCredits: string;

    plannedCredits: string;

    status: 'not_charged' | 'pending' | 'charged' | 'charge_failed' | 'refunded';
  }

  /**
   * Exact follow-up an API client or agent should perform.
   */
  export interface NextAction {
    type: 'poll' | 'retry' | 'verify_result' | 'fix_request';

    afterMs?: number;

    requiresNewIdempotencyKey?: boolean;

    url?: string;
  }

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  export interface Request {
    /**
     * Stable hash of account, action, target, and payload.
     */
    hash: string | null;

    /**
     * Exact sanitized payload dispatched for this action.
     */
    payload: { [key: string]: unknown } | null;
  }

  /**
   * Confirmed result produced by the write, when available.
   */
  export interface Result {
    id?: string;

    state?: string;

    type?: 'tweet' | 'direct_message' | 'media' | 'community' | 'state_change';
  }

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  export interface Target {
    id: string;

    type: 'tweet' | 'user' | 'community';
  }
}

export interface TweetRetrieveResponse {
  /**
   * Full tweet with text, engagement metrics, media, and metadata. A zero metric can
   * mean X did not report the count.
   */
  tweet: TweetDetail;

  /**
   * Tweet author profile. The lookup route always includes follower count and
   * verification state. Other profile fields appear when available.
   */
  author?: TweetAuthor;
}

/**
 * Durable write lifecycle record. Poll statusUrl until terminal is true. Reusing
 * the original Idempotency-Key returns this same record. Submit a new write only
 * when safeToRetry is true, using a new key.
 */
export interface TweetDeleteResponse {
  id: string;

  /**
   * Connected account selected for the write.
   */
  account: TweetDeleteResponse.Account | null;

  action:
    | 'create_tweet'
    | 'delete_tweet'
    | 'like'
    | 'unlike'
    | 'retweet'
    | 'unretweet'
    | 'follow'
    | 'unfollow'
    | 'remove_follower'
    | 'send_dm'
    | 'upload_media'
    | 'update_profile'
    | 'update_avatar'
    | 'update_banner'
    | 'create_community'
    | 'delete_community'
    | 'join_community'
    | 'leave_community';

  /**
   * plannedCredits is the approved maximum. chargedCredits comes from the settled
   * credit ledger. Pending or failed writes are not charged.
   */
  billing: TweetDeleteResponse.Billing;

  charged: boolean;

  chargedCredits: string;

  /**
   * Exact follow-up an API client or agent should perform.
   */
  nextAction: TweetDeleteResponse.NextAction | null;

  object: 'x_write_action';

  pollAfterMs: number | null;

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  request: TweetDeleteResponse.Request;

  /**
   * Confirmed result produced by the write, when available.
   */
  result: TweetDeleteResponse.Result | null;

  /**
   * True only when a new attempt can reasonably succeed.
   */
  retryable: boolean;

  /**
   * True only when no write was dispatched and a new idempotency key may be used.
   */
  safeToRetry: boolean;

  sendDispatched: boolean;

  status: 'accepted' | 'dispatching' | 'pending_confirmation' | 'success' | 'failed' | 'expired';

  statusUrl: string;

  success: boolean;

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  target: TweetDeleteResponse.Target | null;

  targetId: string | null;

  terminal: boolean;

  writeActionId: string;

  /**
   * Compatibility field for a confirmed community ID.
   */
  communityId?: string;

  /**
   * Confirmed community name when available.
   */
  communityName?: string;

  completedAt?: string;

  confirmationAttempts?: number;

  confirmationCheckedAt?: string;

  confirmedAt?: string;

  createdAt?: string;

  /**
   * Structured recovery context for a failed write.
   */
  details?: { [key: string]: unknown };

  error?: string;

  /**
   * Deadline for resolving a non-terminal write. This is not the Idempotency-Key
   * retention deadline.
   */
  expiresAt?: string;

  idempotent?: boolean;

  /**
   * Media count, kind, size, and billing details when used.
   */
  media?: { [key: string]: unknown };

  /**
   * Compatibility field for a confirmed media upload ID.
   */
  mediaId?: string;

  /**
   * Public media URL when the upload creates one.
   */
  mediaUrl?: string;

  message?: string;

  /**
   * Compatibility field for a confirmed direct message ID.
   */
  messageId?: string;

  requestHash?: string;

  requestId?: string;

  /**
   * Compatibility result ID for other write actions.
   */
  resultId?: string;

  /**
   * Dispatch timestamp when the write reached execution.
   */
  sendDispatchedAt?: string;

  /**
   * Compatibility field for a confirmed tweet result ID.
   */
  tweetId?: string;

  updatedAt?: string;
}

export namespace TweetDeleteResponse {
  /**
   * Connected account selected for the write.
   */
  export interface Account {
    id: string;

    username: string;
  }

  /**
   * plannedCredits is the approved maximum. chargedCredits comes from the settled
   * credit ledger. Pending or failed writes are not charged.
   */
  export interface Billing {
    charged: boolean;

    chargedCredits: string;

    plannedCredits: string;

    status: 'not_charged' | 'pending' | 'charged' | 'charge_failed' | 'refunded';
  }

  /**
   * Exact follow-up an API client or agent should perform.
   */
  export interface NextAction {
    type: 'poll' | 'retry' | 'verify_result' | 'fix_request';

    afterMs?: number;

    requiresNewIdempotencyKey?: boolean;

    url?: string;
  }

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  export interface Request {
    /**
     * Stable hash of account, action, target, and payload.
     */
    hash: string | null;

    /**
     * Exact sanitized payload dispatched for this action.
     */
    payload: { [key: string]: unknown } | null;
  }

  /**
   * Confirmed result produced by the write, when available.
   */
  export interface Result {
    id?: string;

    state?: string;

    type?: 'tweet' | 'direct_message' | 'media' | 'community' | 'state_change';
  }

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  export interface Target {
    id: string;

    type: 'tweet' | 'user' | 'community';
  }
}

/**
 * Direct reply rows. No-mode requests use resumable automatic coverage. Complete
 * mode also returns nested replies and coverage diagnostics. Keep nested replies
 * separate from direct coverage.
 */
export interface TweetGetRepliesResponse extends Shared.PaginatedTweets {
  /**
   * Evidence for direct-reply coverage and collector behavior.
   */
  diagnostic?: TweetGetRepliesResponse.Diagnostic;

  /**
   * Nested replies. Excluded from direct coverage.
   */
  nested_replies?: Array<Shared.SearchTweet>;
}

export namespace TweetGetRepliesResponse {
  /**
   * Evidence for direct-reply coverage and collector behavior.
   */
  export interface Diagnostic {
    /**
     * Whether coverage met the target without truncation.
     */
    complete: boolean;

    /**
     * Unique direct replies as a percentage of the reported count.
     */
    coveragePercentage: number;

    /**
     * Cursor requests that failed.
     */
    cursorFailures: number;

    /**
     * Duplicate tweet IDs removed across pages and strategies.
     */
    duplicateCount: number;

    /**
     * Empty pages rejected because they did not make progress.
     */
    emptyFalseProgressPages: number;

    /**
     * Malformed response items rejected.
     */
    malformedCount: number;

    /**
     * Expected response modules or fields missing from X.
     */
    missingResponseModulesOrFields: Array<string>;

    /**
     * Unique nested replies kept outside direct coverage.
     */
    nestedReplyCount: number;

    /**
     * Total pages attempted across all strategies.
     */
    pagesAttempted: number;

    /**
     * Recommended next action when coverage is incomplete.
     */
    recommendedFallback: string;

    /**
     * Repeated cursors rejected to prevent loops.
     */
    repeatedCursorCount: number;

    /**
     * Reply count reported on the source post.
     */
    reportedReplyCount: number;

    /**
     * Whether the requested row limit truncated safe results.
     */
    responseTruncated: boolean;

    /**
     * Field-presence counts across the collected direct replies.
     */
    richness: Diagnostic.Richness;

    /**
     * Per-strategy pagination and contribution evidence.
     */
    strategiesAttempted: Array<Diagnostic.StrategiesAttempted>;

    /**
     * Minimum direct replies required for the coverage target.
     */
    targetDirectReplies: number;

    /**
     * Unique replies whose parent ID equals the source post ID.
     */
    uniqueDirectReplies: number;

    /**
     * Tweets rejected because they belonged elsewhere.
     */
    unrelatedCount: number;
  }

  export namespace Diagnostic {
    /**
     * Field-presence counts across the collected direct replies.
     */
    export interface Richness {
      /**
       * Replies with article content.
       */
      article: number;

      /**
       * Replies with author details.
       */
      author: number;

      /**
       * Replies with card metadata.
       */
      card: number;

      /**
       * Replies with community-note data.
       */
      communityNote: number;

      /**
       * Replies with a creation timestamp.
       */
      createdAt: number;

      /**
       * Replies with engagement counts.
       */
      engagementCounts: number;

      /**
       * Replies with entity metadata.
       */
      entities: number;

      /**
       * Replies with a language value.
       */
      language: number;

      /**
       * Replies with media metadata.
       */
      media: number;

      /**
       * Replies with quoted or reposted tweet data.
       */
      quotedOrRepostedTweet: number;

      /**
       * Replies with text.
       */
      text: number;

      /**
       * Total unique direct replies evaluated for richness.
       */
      totalReplies: number;

      /**
       * Replies with a canonical URL.
       */
      url: number;
    }

    export interface StrategiesAttempted {
      name: string;

      newDirectReplies: number;

      newNestedReplies: number;

      pagesAttempted: number;

      stopReason:
        | 'deadline'
        | 'empty_pages'
        | 'error'
        | 'missing_cursor'
        | 'no_next_page'
        | 'page_cap'
        | 'repeated_cursor';
    }
  }
}

/**
 * No-mode search, user Tweet, user reply, and direct reply reads use automatic
 * coverage. Shape, filters, aliases, and billing stay compatible. Unprefixed
 * cursors remain legacy. Follow next_cursor while has_next_page is true. An empty
 * filtered page can still have has_next_page true.
 */
export type TweetSearchResponse = Shared.PaginatedTweets | TweetSearchResponse.TweetSearchCoverageResponse;

export namespace TweetSearchResponse {
  /**
   * No-mode search, user Tweet, user reply, and direct reply reads use automatic
   * coverage. Shape, filters, aliases, and billing stay compatible. Unprefixed
   * cursors remain legacy. Follow next_cursor while has_next_page is true. An empty
   * filtered page can still have has_next_page true.
   */
  export interface TweetSearchCoverageResponse
    extends Omit<Shared.PaginatedTweets, 'has_next_page' | 'next_cursor'> {
    /**
     * Coverage evidence across parallel search strategies.
     */
    diagnostic: TweetSearchCoverageResponse.Diagnostic;

    has_next_page?: false;

    next_cursor?: '';
  }

  export namespace TweetSearchCoverageResponse {
    /**
     * Coverage evidence across parallel search strategies.
     */
    export interface Diagnostic {
      /**
       * True when every strategy exhausted its source.
       */
      complete: boolean;

      cursorFailureCount: number;

      deadlineReached: boolean;

      duplicateCount: number;

      failedStrategyCount: number;

      malformedCount: number;

      pagesFetched: number;

      /**
       * Whether bounded time windows ran in parallel.
       */
      partitioned: boolean;

      /**
       * Whether credits or the requested limit reduced output.
       */
      responseTruncated: boolean;

      resultLimitReached: boolean;

      returnedTweets: number;

      stalledStrategyCount: number;

      strategies: Array<Diagnostic.Strategy>;

      strategyCount: number;

      uniqueTweets: number;
    }

    export namespace Diagnostic {
      export interface Strategy {
        duplicateCount: number;

        pagesFetched: number;

        queryType: 'Latest' | 'Top';

        stopReason:
          | 'cursor_failure'
          | 'deadline'
          | 'exhausted'
          | 'failed'
          | 'page_limit'
          | 'result_limit'
          | 'stalled';

        strategy: number;

        uniqueAdded: number;

        /**
         * Non-overlapping time partition used by one strategy.
         */
        window?: Strategy.Window;
      }

      export namespace Strategy {
        /**
         * Non-overlapping time partition used by one strategy.
         */
        export interface Window {
          sinceTime: string;

          untilTime: string;
        }
      }
    }
  }
}

export interface TweetCreateParams {
  /**
   * Body param: X account (@username or account ID)
   */
  account: string;

  /**
   * Header param: Generate one unique value for each intended write. Reuse it only
   * when retrying the exact same account, action, target, and payload. A reused key
   * returns the original action. Reusing it with different input returns 409. Replay
   * protection remains active for at least 90 days.
   */
  'Idempotency-Key': string;

  /**
   * Body param
   */
  community_id?: string;

  /**
   * Body param
   */
  is_note_tweet?: boolean;

  /**
   * Body param: Array of public media URLs to attach. Supports up to 4 images or
   * exactly 1 MP4 video up to 100 MB. Each URL must be publicly reachable. Attached
   * media adds 2 credits per started MB across all files.
   */
  media?: Array<string>;

  /**
   * Body param
   */
  reply_to_tweet_id?: string;

  /**
   * Body param: Tweet text (optional when media is provided)
   */
  text?: string;
}

export interface TweetListParams {
  /**
   * Comma-separated tweet IDs (max 100)
   */
  ids: string;
}

export interface TweetDeleteParams {
  /**
   * Body param: X account identifier (@username or account ID)
   */
  account: string;

  /**
   * Header param: Generate one unique value for each intended write. Reuse it only
   * when retrying the exact same account, action, target, and payload. A reused key
   * returns the original action. Reusing it with different input returns 409. Replay
   * protection remains active for at least 90 days.
   */
  'Idempotency-Key': string;
}

export interface TweetGetFavoritersParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Pagination cursor for favoriters
   */
  cursor?: string;

  /**
   * Only return profiles with a location.
   */
  hasLocation?: boolean;

  /**
   * Only return profiles with a website.
   */
  hasWebsite?: boolean;

  /**
   * Match a location substring, ignoring case.
   */
  locationContains?: string;

  /**
   * Maximum follower count. Missing counts pass this maximum.
   */
  maxFollowers?: number;

  /**
   * Maximum following count.
   */
  maxFollowing?: number;

  /**
   * Maximum post count. maxPosts is also accepted.
   */
  maxStatuses?: number;

  /**
   * Minimum account age in whole days.
   */
  minAccountAgeDays?: number;

  /**
   * Minimum follower count. Filtering happens before billing.
   */
  minFollowers?: number;

  /**
   * Minimum following count.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Maximum user profiles requested from this page (20-200, default 200). Source,
   * filters, or credits can return fewer profiles. Keep requesting next_cursor while
   * has_next_page is true. Deprecated aliases remain accepted.
   */
  pageSize?: number;

  /**
   * Match a username substring, ignoring case.
   */
  usernameContains?: string;

  /**
   * Only return verified profiles.
   */
  verifiedOnly?: boolean;

  /**
   * Match the verification type exactly, ignoring case.
   */
  verifiedType?: string;
}

export interface TweetGetQuotesParams {
  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Only return tweets from Blue-verified authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Match the Tweet card name.
   */
  cardName?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Pagination cursor for quote tweets
   */
  cursor?: string;

  /**
   * Exact phrase to match.
   */
  exactPhrase?: string;

  /**
   * Exclude a source application.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * Match latitude, longitude, and radius.
   */
  geocode?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Include reply quotes (default false)
   */
  includeReplies?: boolean;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Language code filter, e.g. en or tr.
   */
  language?: string;

  /**
   * Maximum likes threshold. maxLikes is also accepted.
   */
  maxFaves?: number;

  /**
   * Return Tweets older than this Tweet ID.
   */
  maxId?: string;

  /**
   * Maximum quotes threshold.
   */
  maxQuotes?: number;

  /**
   * Maximum replies threshold.
   */
  maxReplies?: number;

  /**
   * Maximum retweets threshold.
   */
  maxRetweets?: number;

  /**
   * Filter by media type.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum bookmark count threshold.
   */
  minBookmarks?: number;

  /**
   * Minimum likes threshold. minLikes is also accepted.
   */
  minFaves?: number;

  /**
   * Minimum quote count threshold.
   */
  minQuotes?: number;

  /**
   * Minimum replies threshold.
   */
  minReplies?: number;

  /**
   * Minimum retweets threshold.
   */
  minRetweets?: number;

  /**
   * Minimum view count threshold.
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
   * Maximum page items (1-100, default 20). Source, filters, or credits can reduce
   * results. Continue while has_next_page is true. Deprecated limit and count
   * aliases remain accepted.
   */
  pageSize?: number;

  /**
   * Quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Retweet mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Enable the safe-search filter.
   */
  safe?: boolean;

  /**
   * Start date in YYYY-MM-DD format.
   */
  sinceDate?: string;

  /**
   * Return Tweets newer than this Tweet ID.
   */
  sinceId?: string;

  /**
   * Unix timestamp - return quotes posted after this time
   */
  sinceTime?: string;

  /**
   * Match the source application.
   */
  source?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * Unix timestamp - return quotes posted before this time
   */
  untilTime?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;

  /**
   * Set the radius for the near filter.
   */
  within?: string;

  /**
   * Match Tweets inside a recent time window.
   */
  withinTime?: string;
}

export interface TweetGetRepliesParams {
  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Only return tweets from Blue-verified authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Match the Tweet card name.
   */
  cardName?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Cursor from the previous response. Xquik cursors resume automatic coverage.
   * Existing unprefixed cursors keep legacy standard behavior.
   */
  cursor?: string;

  /**
   * Exact phrase to match.
   */
  exactPhrase?: string;

  /**
   * Exclude replies written by the source-post author.
   */
  excludeOriginalAuthor?: boolean;

  /**
   * Exclude a source application.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * Match latitude, longitude, and radius.
   */
  geocode?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Only return replies containing media.
   */
  hasMediaOnly?: boolean;

  /**
   * Include the source post and count it toward limit.
   */
  includeOriginalPost?: boolean;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Language code filter, e.g. en or tr.
   */
  language?: string;

  /**
   * With mode=complete, maximum combined direct and nested reply rows (1-25000,
   * default 25000). Automatic pages accept 1-300. Standard pages accept 1-100.
   * Prefer pageSize outside complete mode.
   */
  limit?: number;

  /**
   * Maximum reply depth from the source post.
   */
  maxDepth?: number;

  /**
   * Maximum likes threshold. maxLikes is also accepted.
   */
  maxFaves?: number;

  /**
   * Return Tweets older than this Tweet ID.
   */
  maxId?: string;

  /**
   * Maximum quotes threshold.
   */
  maxQuotes?: number;

  /**
   * Maximum replies threshold.
   */
  maxReplies?: number;

  /**
   * Maximum retweets threshold.
   */
  maxRetweets?: number;

  /**
   * Filter by media type.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum bookmark count threshold.
   */
  minBookmarks?: number;

  /**
   * Minimum likes threshold. minLikes is also accepted.
   */
  minFaves?: number;

  /**
   * Minimum quote count threshold.
   */
  minQuotes?: number;

  /**
   * Minimum replies threshold.
   */
  minReplies?: number;

  /**
   * Minimum retweets threshold.
   */
  minRetweets?: number;

  /**
   * Minimum view count threshold.
   */
  minViews?: number;

  /**
   * Optional advanced override. Omit mode for automatic maximum direct reply
   * coverage with pagination. Standard keeps legacy pagination. Complete returns
   * direct and nested replies with diagnostics, scope, depth, sorting, and
   * original-post controls.
   */
  mode?: 'standard' | 'complete';

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
   * Automatic pages accept 1-300 Tweets. Standard pages keep 1-100. Default 20.
   * Continue while has_next_page is true. Deprecated aliases remain accepted.
   */
  pageSize?: number;

  /**
   * Quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Retweet mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Enable the safe-search filter.
   */
  safe?: boolean;

  /**
   * Select all replies, direct replies, or nested replies.
   */
  scope?: 'all' | 'direct' | 'nested';

  /**
   * Start date in YYYY-MM-DD format.
   */
  sinceDate?: string;

  /**
   * Return Tweets newer than this Tweet ID.
   */
  sinceId?: string;

  /**
   * Unix timestamp - return replies posted after this time
   */
  sinceTime?: string;

  /**
   * Sort the selected replies before applying limit.
   */
  sort?: 'relevance' | 'latest' | 'oldest' | 'likes';

  /**
   * Match the source application.
   */
  source?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * Unix timestamp - return replies posted before this time
   */
  untilTime?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;

  /**
   * Set the radius for the near filter.
   */
  within?: string;

  /**
   * Match Tweets inside a recent time window.
   */
  withinTime?: string;
}

export interface TweetGetRetweetersParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Pagination cursor for retweeters
   */
  cursor?: string;

  /**
   * Only return profiles with a location.
   */
  hasLocation?: boolean;

  /**
   * Only return profiles with a website.
   */
  hasWebsite?: boolean;

  /**
   * Match a location substring, ignoring case.
   */
  locationContains?: string;

  /**
   * Maximum follower count. Missing counts pass this maximum.
   */
  maxFollowers?: number;

  /**
   * Maximum following count.
   */
  maxFollowing?: number;

  /**
   * Maximum post count. maxPosts is also accepted.
   */
  maxStatuses?: number;

  /**
   * Minimum account age in whole days.
   */
  minAccountAgeDays?: number;

  /**
   * Minimum follower count. Filtering happens before billing.
   */
  minFollowers?: number;

  /**
   * Minimum following count.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Maximum user profiles requested from this page (20-200, default 200). Source,
   * filters, or credits can return fewer profiles. Keep requesting next_cursor while
   * has_next_page is true. Deprecated aliases remain accepted.
   */
  pageSize?: number;

  /**
   * Match a username substring, ignoring case.
   */
  usernameContains?: string;

  /**
   * Only return verified profiles.
   */
  verifiedOnly?: boolean;

  /**
   * Match the verification type exactly, ignoring case.
   */
  verifiedType?: string;
}

export interface TweetGetThreadParams {
  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Only return tweets from Blue-verified authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Pagination cursor for thread tweets
   */
  cursor?: string;

  /**
   * Exact phrase to match.
   */
  exactPhrase?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Language code filter, e.g. en or tr.
   */
  language?: string;

  /**
   * Maximum likes threshold. maxLikes is also accepted.
   */
  maxFaves?: number;

  /**
   * Maximum quotes threshold.
   */
  maxQuotes?: number;

  /**
   * Maximum replies threshold.
   */
  maxReplies?: number;

  /**
   * Maximum retweets threshold.
   */
  maxRetweets?: number;

  /**
   * Filter by media type.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum bookmark count threshold.
   */
  minBookmarks?: number;

  /**
   * Minimum likes threshold. minLikes is also accepted.
   */
  minFaves?: number;

  /**
   * Minimum quote count threshold.
   */
  minQuotes?: number;

  /**
   * Minimum replies threshold.
   */
  minReplies?: number;

  /**
   * Minimum retweets threshold.
   */
  minRetweets?: number;

  /**
   * Minimum view count threshold.
   */
  minViews?: number;

  /**
   * Maximum page items (1-100, default 20). Source, filters, or credits can reduce
   * results. Continue while has_next_page is true. Deprecated limit and count
   * aliases remain accepted.
   */
  pageSize?: number;

  /**
   * Quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Retweet mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Start date in YYYY-MM-DD format.
   */
  sinceDate?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;
}

export interface TweetSearchParams {
  /**
   * Query, Tweet ID, or status URL. Valid inline bounds apply per page.
   */
  q: string;

  /**
   * Raw advanced search query appended as-is.
   */
  advancedQuery?: string;

  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Only return tweets from Blue-verified authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Geo bounding box, e.g. -74.1 40.6 -73.9 40.8.
   */
  boundingBox?: string;

  /**
   * Match the Tweet card name.
   */
  cardName?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Cursor from the previous response. Xquik cursors resume automatic coverage.
   * Existing unprefixed cursors keep legacy standard behavior.
   */
  cursor?: string;

  /**
   * Exact phrase to match.
   */
  exactPhrase?: string;

  /**
   * Exclude a source application.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * Match latitude, longitude, and radius.
   */
  geocode?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Language code filter, e.g. en or tr.
   */
  language?: string;

  /**
   * Result upper bound. Omit it for the existing 20-row page size. Explicit coverage
   * defaults to 2000 and allows 10000. For paid requests, remaining credits can
   * reduce results. Zero affordable results returns 402.
   */
  limit?: number;

  /**
   * Search within a list ID.
   */
  listId?: string;

  /**
   * Maximum likes threshold. maxLikes is also accepted.
   */
  maxFaves?: number;

  /**
   * Return Tweets older than this Tweet ID.
   */
  maxId?: string;

  /**
   * Maximum quotes threshold.
   */
  maxQuotes?: number;

  /**
   * Maximum replies threshold.
   */
  maxReplies?: number;

  /**
   * Maximum retweets threshold.
   */
  maxRetweets?: number;

  /**
   * Filter by media type.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum bookmark count threshold.
   */
  minBookmarks?: number;

  /**
   * Minimum likes threshold. minLikes is also accepted.
   */
  minFaves?: number;

  /**
   * Minimum quote count threshold.
   */
  minQuotes?: number;

  /**
   * Minimum replies threshold.
   */
  minReplies?: number;

  /**
   * Minimum retweets threshold.
   */
  minRetweets?: number;

  /**
   * Minimum view count threshold.
   */
  minViews?: number;

  /**
   * Omit mode for resumable maximum coverage. Standard keeps legacy pagination.
   * Coverage returns diagnostics once and rejects cursors.
   */
  mode?: 'standard' | 'coverage';

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
   * Search within a place ID.
   */
  place?: string;

  /**
   * Search within a country code.
   */
  placeCountry?: string;

  /**
   * Geo point radius, e.g. -73.99 40.73 25mi.
   */
  pointRadius?: string;

  /**
   * Sort order - Latest (chronological) or Top (engagement-ranked)
   */
  queryType?: 'Latest' | 'Top';

  /**
   * Quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Retweet mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Enable the safe-search filter.
   */
  safe?: boolean;

  /**
   * Start date in YYYY-MM-DD format.
   */
  sinceDate?: string;

  /**
   * Return Tweets newer than this Tweet ID.
   */
  sinceId?: string;

  /**
   * Inclusive ISO bound.
   */
  sinceTime?: string;

  /**
   * Match the source application.
   */
  source?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * Exclusive ISO bound.
   */
  untilTime?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;

  /**
   * Set the radius for the near filter.
   */
  within?: string;

  /**
   * Match Tweets inside a recent time window.
   */
  withinTime?: string;
}

Tweets.Like = Like;
Tweets.Retweet = Retweet;

export declare namespace Tweets {
  export {
    type TweetAuthor as TweetAuthor,
    type TweetDetail as TweetDetail,
    type TweetCreateResponse as TweetCreateResponse,
    type TweetRetrieveResponse as TweetRetrieveResponse,
    type TweetDeleteResponse as TweetDeleteResponse,
    type TweetGetRepliesResponse as TweetGetRepliesResponse,
    type TweetSearchResponse as TweetSearchResponse,
    type TweetCreateParams as TweetCreateParams,
    type TweetListParams as TweetListParams,
    type TweetDeleteParams as TweetDeleteParams,
    type TweetGetFavoritersParams as TweetGetFavoritersParams,
    type TweetGetQuotesParams as TweetGetQuotesParams,
    type TweetGetRepliesParams as TweetGetRepliesParams,
    type TweetGetRetweetersParams as TweetGetRetweetersParams,
    type TweetGetThreadParams as TweetGetThreadParams,
    type TweetSearchParams as TweetSearchParams,
  };

  export {
    Like as Like,
    type LikeCreateResponse as LikeCreateResponse,
    type LikeDeleteResponse as LikeDeleteResponse,
    type LikeCreateParams as LikeCreateParams,
    type LikeDeleteParams as LikeDeleteParams,
  };

  export {
    Retweet as Retweet,
    type RetweetCreateResponse as RetweetCreateResponse,
    type RetweetDeleteResponse as RetweetDeleteResponse,
    type RetweetCreateParams as RetweetCreateParams,
    type RetweetDeleteParams as RetweetDeleteParams,
  };
}
