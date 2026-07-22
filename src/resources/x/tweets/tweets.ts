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
   * Returns visible replies. For an unfiltered first page, Xquik compares a terminal
   * page with the post's reported reply count. If the page is visibly incomplete,
   * the endpoint returns 424 `replies_incomplete` instead of presenting partial
   * coverage as complete. Use tweet search with a `conversation_id:{id}` query as
   * the broader fallback.
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.getReplies(
   *   'id',
   * );
   * ```
   */
  getReplies(
    id: string,
    query: TweetGetRepliesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
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
   * Search tweets by query, Tweet ID, X status URL, or account date window
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.search({
   *   q: 'q',
   * });
   * ```
   */
  search(query: TweetSearchParams, options?: RequestOptions): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/tweets/search', { query, ...options });
  }
}

/**
 * Tweet author profile. The lookup route always includes follower count and
 * verification state. Other profile fields appear when available.
 */
export interface TweetAuthor extends Shared.UserProfile {}

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
   * Tweet author profile. The lookup route always includes follower count and
   * verification state. Other profile fields appear when available.
   */
  author?: TweetAuthor;

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

  /**
   * Tweet language code
   */
  lang?: string;

  /**
   * Attached media items, omitted when the tweet has no media
   */
  media?: Array<Shared.TweetMedia>;

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
   * Pagination cursor for favoriters
   */
  cursor?: string;

  /**
   * Maximum user profiles requested from this page (20-200, default 200). The
   * response can contain fewer profiles because the source returned fewer or
   * the available usage balance covers fewer results. Keep requesting next_cursor while
   * has_next_page is true. The deprecated limit and count aliases remain accepted.
   */
  pageSize?: number;
}

export interface TweetGetQuotesParams {
  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

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
   * Filter by media type.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum likes threshold.
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
   * Maximum items requested from this page (1-100, default 20). The response can
   * contain fewer items because the source returned fewer, filters removed items, or
   * the available usage balance covers fewer results. Keep requesting next_cursor while
   * has_next_page is true, even when a page is empty. The deprecated limit and count
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
   * Unix timestamp - return quotes posted after this time
   */
  sinceTime?: string;

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
}

export interface TweetGetRepliesParams {
  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Pagination cursor for tweet replies
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
   * Filter by media type.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum likes threshold.
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
   * Maximum items requested from this page (1-100, default 20). The response can
   * contain fewer items because the source returned fewer, filters removed items, or
   * the available usage balance covers fewer results. Keep requesting next_cursor while
   * has_next_page is true, even when a page is empty. The deprecated limit and count
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
   * Unix timestamp - return replies posted after this time
   */
  sinceTime?: string;

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
}

export interface TweetGetRetweetersParams {
  /**
   * Pagination cursor for retweeters
   */
  cursor?: string;

  /**
   * Maximum user profiles requested from this page (20-200, default 200). The
   * response can contain fewer profiles because the source returned fewer or
   * the available usage balance covers fewer results. Keep requesting next_cursor while
   * has_next_page is true. The deprecated limit and count aliases remain accepted.
   */
  pageSize?: number;
}

export interface TweetGetThreadParams {
  /**
   * Pagination cursor for thread tweets
   */
  cursor?: string;

  /**
   * Maximum items requested from this page (1-100, default 20). The response can
   * contain fewer items because the source returned fewer, filters removed items, or
   * the available usage balance covers fewer results. Keep requesting next_cursor while
   * has_next_page is true, even when a page is empty. The deprecated limit and count
   * aliases remain accepted.
   */
  pageSize?: number;
}

export interface TweetSearchParams {
  /**
   * Search query (keywords,
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
   * Geo bounding box, e.g. -74.1 40.6 -73.9 40.8.
   */
  boundingBox?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Pagination cursor from previous response
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
   * Max tweets to return (server paginates internally). Omit for single page (~20).
   * This is an upper bound for paid authenticated calls: available usage balance can
   * reduce the returned page size, and zero affordable results returns 402
   * insufficient_credits.
   */
  limit?: number;

  /**
   * Search within a list ID.
   */
  listId?: string;

  /**
   * Filter by media type.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum likes threshold.
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
   * Start date in YYYY-MM-DD format.
   */
  sinceDate?: string;

  /**
   * ISO 8601 timestamp - only return tweets after this time
   */
  sinceTime?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * ISO 8601 timestamp - only return tweets before this time
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
