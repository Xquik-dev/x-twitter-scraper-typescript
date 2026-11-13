// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../../core/resource';
import * as Shared from '../../shared';
import * as BlockAPI from './block';
import {
  Block,
  BlockCreateParams,
  BlockCreateResponse,
  BlockDeleteParams,
  BlockDeleteResponse,
} from './block';
import * as FollowAPI from './follow';
import {
  Follow,
  FollowCreateParams,
  FollowCreateResponse,
  FollowDeleteAllParams,
  FollowDeleteAllResponse,
} from './follow';
import * as MuteAPI from './mute';
import { Mute, MuteCreateParams, MuteCreateResponse, MuteDeleteParams, MuteDeleteResponse } from './mute';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Users extends APIResource {
  block: BlockAPI.Block = new BlockAPI.Block(this._client);
  follow: FollowAPI.Follow = new FollowAPI.Follow(this._client);
  mute: MuteAPI.Mute = new MuteAPI.Mute(this._client);

  /**
   * Returns one public profile with counts and verification details.
   *
   * @example
   * ```ts
   * const userProfile = await client.x.users.retrieve('id');
   * ```
   */
  retrieve(
    id: string,
    query: UserRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.UserProfile> {
    return this._client.get(path`/x/users/${id}`, { query, ...options });
  }

  /**
   * Removes a follower from a connected X account.
   *
   * @example
   * ```ts
   * const response = await client.x.users.removeFollower('id', {
   *   account: '@elonmusk',
   *   'Idempotency-Key': 'Idempotency-Key',
   * });
   * ```
   */
  removeFollower(
    id: string,
    params: UserRemoveFollowerParams,
    options?: RequestOptions,
  ): APIPromise<UserRemoveFollowerResponse> {
    const { 'Idempotency-Key': idempotencyKey, Prefer: prefer, ...body } = params;
    return this._client.post(path`/x/users/${id}/remove-follower`, {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey, Prefer: prefer }, options?.headers]),
    });
  }

  /**
   * Returns the accounts an organization lists as its affiliates, in X's order. An
   * account without affiliates returns an empty list.
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.users.retrieveAffiliates('id');
   * ```
   */
  retrieveAffiliates(
    id: string,
    query: UserRetrieveAffiliatesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/affiliates`, { query, ...options });
  }

  /**
   * Returns the posts on the user's Articles tab, newest first. Each post's
   * `article` holds the Article's ID, title, preview, cover & dates. Read the full
   * text with GET /x/articles/{tweetId}.
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.users.retrieveArticles('id');
   * ```
   */
  retrieveArticles(
    id: string,
    query: UserRetrieveArticlesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/articles`, { query, ...options });
  }

  /**
   * Returns public profiles for up to 100 user IDs, usernames or profile links. Send
   * ids or usernames, not both. Each returned profile costs 1 credit.
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveBatch();
   * ```
   */
  retrieveBatch(
    query: UserRetrieveBatchParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveBatchResponse> {
    return this._client.get('/x/users/batch', { query, ...options });
  }

  /**
   * Returns the newest posts of up to 20 users, named by user ID, username or
   * profile link, in the order named. Send ids or usernames, not both. Each post
   * costs 1 credit. A user in unavailable_ids or unprocessed_ids costs nothing.
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveBatchTweets();
   * ```
   */
  retrieveBatchTweets(
    query: UserRetrieveBatchTweetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveBatchTweetsResponse> {
    return this._client.get('/x/users/batch/tweets', { query, ...options });
  }

  /**
   * Reads the newest followers of a public account & returns a follower audit. It
   * gives each follower 1 class with its score & signals, then adds coverage, a
   * quality score, signal counts, arrival bands, join cohorts, countries, top
   * followers & the account's engagement. Each follower read costs 1 credit, and the
   * engagement adds 1 credit. Signals come from public profiles, so a real person
   * can match. Older followers may differ from the newest ones.
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveFollowerAudit(
   *   'id',
   * );
   * ```
   */
  retrieveFollowerAudit(
    id: string,
    query: UserRetrieveFollowerAuditParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveFollowerAuditResponse> {
    return this._client.get(path`/x/users/${id}/follower-audit`, { query, ...options });
  }

  /**
   * Returns the user IDs of the selected user's followers, newest first, up to 5,000
   * a page. Use it when you need IDs only. Each ID costs 1 credit.
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveFollowerIds(
   *   'id',
   * );
   * ```
   */
  retrieveFollowerIds(
    id: string,
    query: UserRetrieveFollowerIDsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUserIds> {
    return this._client.get(path`/x/users/${id}/follower-ids`, { query, ...options });
  }

  /**
   * Returns public follower profiles for the selected user, newest first. x.com puts
   * some promoted followers first; Xquik doesn't.
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveFollowers(
   *   'id',
   * );
   * ```
   */
  retrieveFollowers(
    id: string,
    query: UserRetrieveFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveFollowersResponse> {
    return this._client.get(path`/x/users/${id}/followers`, { query, ...options });
  }

  /**
   * Mutuals your X account sees, else 424 `account_required`.
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.users.retrieveFollowersYouKnow('id');
   * ```
   */
  retrieveFollowersYouKnow(
    id: string,
    query: UserRetrieveFollowersYouKnowParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/followers-you-know`, { query, ...options });
  }

  /**
   * Returns public profiles followed by the selected user.
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveFollowing(
   *   'id',
   * );
   * ```
   */
  retrieveFollowing(
    id: string,
    query: UserRetrieveFollowingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveFollowingResponse> {
    return this._client.get(path`/x/users/${id}/following`, { query, ...options });
  }

  /**
   * Returns the user IDs of the accounts the selected user follows, newest first, up
   * to 5,000 a page. Use it when you need IDs only. Each ID costs 1 credit.
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveFollowingIds(
   *   'id',
   * );
   * ```
   */
  retrieveFollowingIds(
    id: string,
    query: UserRetrieveFollowingIDsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUserIds> {
    return this._client.get(path`/x/users/${id}/following-ids`, { query, ...options });
  }

  /**
   * Returns the posts on the user's Highlights tab, in X's order. An account without
   * highlights returns an empty list.
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.users.retrieveHighlights('id');
   * ```
   */
  retrieveHighlights(
    id: string,
    query: UserRetrieveHighlightsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/highlights`, { query, ...options });
  }

  /**
   * Returns engagement insights for one profile: engagement rate, averages per post
   * and posting rate, from its counts and its most recent posts. It reads 20 posts unless limit names another number. Reposts and the pinned
   * post stay out of the averages. Each report costs 1 credit, whatever it reads.
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveInsights(
   *   'id',
   * );
   * ```
   */
  retrieveInsights(
    id: string,
    query: UserRetrieveInsightsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveInsightsResponse> {
    return this._client.get(path`/x/users/${id}/insights`, { query, ...options });
  }

  /**
   * Your X account's likes, else 424 `account_required`. Others' likes get 424
   * `likes_unavailable`.
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.users.retrieveLikes(
   *   'id',
   * );
   * ```
   */
  retrieveLikes(
    id: string,
    query: UserRetrieveLikesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/likes`, { query, ...options });
  }

  /**
   * Returns the public X Lists that include the selected user, as the profile's List
   * memberships page shows them. Each List costs 1 credit. A protected account
   * answers 403.
   *
   * @example
   * ```ts
   * const response =
   *   await client.x.users.retrieveListMemberships('id');
   * ```
   */
  retrieveListMemberships(
    id: string,
    query: UserRetrieveListMembershipsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedLists> {
    return this._client.get(path`/x/users/${id}/list-memberships`, { query, ...options });
  }

  /**
   * Returns the public X Lists the selected user created, in X's order, as the
   * profile's Lists tab shows them. Each List costs 1 credit. A protected account
   * answers 403.
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveLists('id');
   * ```
   */
  retrieveLists(
    id: string,
    query: UserRetrieveListsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedLists> {
    return this._client.get(path`/x/users/${id}/lists`, { query, ...options });
  }

  /**
   * Says whether one user is broadcasting live video on X right now, with their
   * latest broadcast, live or ended. Each check costs 1 credit.
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveLive('id');
   * ```
   */
  retrieveLive(
    id: string,
    query: UserRetrieveLiveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveLiveResponse> {
    return this._client.get(path`/x/users/${id}/live`, { query, ...options });
  }

  /**
   * Returns public media posts from the selected user.
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.users.retrieveMedia(
   *   'id',
   * );
   * ```
   */
  retrieveMedia(
    id: string,
    query: UserRetrieveMediaParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.FilterablePaginatedTweets> {
    return this._client.get(path`/x/users/${id}/media`, { query, ...options });
  }

  /**
   * Returns public posts mentioning the selected user.
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.users.retrieveMentions('id');
   * ```
   */
  retrieveMentions(
    id: string,
    query: UserRetrieveMentionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/mentions`, { query, ...options });
  }

  /**
   * Returns target-authored posts & replies, without other authors' context. Omit
   * mode for automatic maximum coverage. Pass next_cursor unchanged; unprefixed
   * cursors are legacy. It never opens with the pinned tweet.
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.users.retrieveReplies('id');
   * ```
   */
  retrieveReplies(
    id: string,
    query: UserRetrieveRepliesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.FilterablePaginatedTweets> {
    return this._client.get(path`/x/users/${id}/replies`, { query, ...options });
  }

  /**
   * Returns public profiles matching a name or username.
   *
   * @example
   * ```ts
   * const paginatedUsers = await client.x.users.retrieveSearch({
   *   q: 'q',
   * });
   * ```
   */
  retrieveSearch(
    query: UserRetrieveSearchParams,
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get('/x/users/search', { query, ...options });
  }

  /**
   * Checks 1 X account for a search ban, a search suggestion ban & reply
   * deboosting. It also says if the account is active, protected or suspended. Each
   * profile, post, suggestion & reply in the answer costs 1 credit.
   *
   * @example
   * ```ts
   * const shadowbanReport = await client.x.users.retrieveShadowban(
   *   'id',
   * );
   * ```
   */
  retrieveShadowban(
    id: string,
    query: UserRetrieveShadowbanParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ShadowbanReport> {
    return this._client.get(path`/x/users/${id}/shadowban`, { query, ...options });
  }

  /**
   * Returns the public accounts X lists as similar to the selected user, in X's
   * order. X can list slightly different accounts on each call. Each account costs 1
   * credit.
   *
   * @example
   * ```ts
   * const paginatedUsers = await client.x.users.retrieveSimilar(
   *   'id',
   * );
   * ```
   */
  retrieveSimilar(
    id: string,
    query: UserRetrieveSimilarParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/similar`, { query, ...options });
  }

  /**
   * Returns the creators the selected user subscribes to, in X's order. An account
   * that hides its subscriptions returns an empty list.
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.users.retrieveSubscriptions('id');
   * ```
   */
  retrieveSubscriptions(
    id: string,
    query: UserRetrieveSubscriptionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/subscriptions`, { query, ...options });
  }

  /**
   * For the newest posts of 2 to 20 users, use getBatchUserTweets. For more, use
   * createExtraction with tweet_search_extractor & targetUsernames. Omit mode for
   * automatic maximum coverage. Pass next_cursor unchanged; unprefixed cursors are
   * legacy. The first page opens with the pinned tweet, flagged isPinned, unless
   * replies are included. Rows stay newest first. x.com's Posts tab groups
   * self-threads & hides reposts; retweets=exclude drops reposts.
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.users.retrieveTweets(
   *   'id',
   * );
   * ```
   */
  retrieveTweets(
    id: string,
    query: UserRetrieveTweetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.FilterablePaginatedTweets> {
    return this._client.get(path`/x/users/${id}/tweets`, { query, ...options });
  }

  /**
   * Returns verified public profiles following the selected user.
   *
   * @example
   * ```ts
   * const response =
   *   await client.x.users.retrieveVerifiedFollowers('id');
   * ```
   */
  retrieveVerifiedFollowers(
    id: string,
    query: UserRetrieveVerifiedFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveVerifiedFollowersResponse> {
    return this._client.get(path`/x/users/${id}/verified-followers`, { query, ...options });
  }

  /**
   * Returns X's own translation of one profile's bio into the language you pick,
   * with the links, mentions, and tags X places in the translated text. A profile
   * without a bio returns translation null & a message, free of charge.
   *
   * @example
   * ```ts
   * const response = await client.x.users.translateBio('id', {
   *   language: 'es',
   * });
   * ```
   */
  translateBio(
    id: string,
    query: UserTranslateBioParams,
    options?: RequestOptions,
  ): APIPromise<UserTranslateBioResponse> {
    return this._client.get(path`/x/users/${id}/translation`, { query, ...options });
  }
}

/**
 * Durable write record. Poll statusUrl until terminal is true. Reusing its
 * Idempotency-Key returns this record. Create another action only when safeToRetry
 * is true.
 */
export interface UserRemoveFollowerResponse {
  id: string;

  /**
   * Connected account selected for the write.
   */
  account: UserRemoveFollowerResponse.Account | null;

  action:
    | 'create_tweet'
    | 'delete_tweet'
    | 'like'
    | 'unlike'
    | 'retweet'
    | 'unretweet'
    | 'bookmark'
    | 'unbookmark'
    | 'follow'
    | 'unfollow'
    | 'block'
    | 'unblock'
    | 'mute'
    | 'unmute'
    | 'remove_follower'
    | 'send_dm'
    | 'delete_dm'
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
  billing: UserRemoveFollowerResponse.Billing;

  charged: boolean;

  chargedCredits: string;

  /**
   * Exact follow-up an API client or agent should perform.
   */
  nextAction: UserRemoveFollowerResponse.NextAction | null;

  object: 'x_write_action';

  pollAfterMs: number | null;

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  request: UserRemoveFollowerResponse.Request;

  /**
   * Confirmed result produced by the write, when available.
   */
  result: UserRemoveFollowerResponse.Result | null;

  /**
   * True only when a new attempt can reasonably succeed.
   */
  retryable: boolean;

  /**
   * True only when X did not get the write and a new idempotency key may be used.
   */
  safeToRetry: boolean;

  sendDispatched: boolean;

  status: 'accepted' | 'dispatching' | 'pending_confirmation' | 'success' | 'failed' | 'expired';

  statusUrl: string;

  success: boolean;

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  target: UserRemoveFollowerResponse.Target | null;

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

  /**
   * True when this answers a retry of an earlier request with the same
   * Idempotency-Key.
   */
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

export namespace UserRemoveFollowerResponse {
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

    /**
     * Milliseconds to wait before you poll or retry.
     */
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
 * Batch lookup preserves first-seen order and ignores duplicates. The ID lists
 * name the requested IDs or usernames. A profile link is named by its username.
 */
export interface UserRetrieveBatchResponse {
  /**
   * Processed IDs that failed to load, in first-seen request order. They cost
   * nothing. Retry them.
   */
  failed_ids: Array<string>;

  /**
   * Batch lookups never paginate.
   */
  has_next_page: false;

  /**
   * Empty because batch lookups never paginate.
   */
  next_cursor: string;

  /**
   * Number of requested IDs included in the lookup.
   */
  processed_count: number;

  /**
   * Number of unique IDs requested.
   */
  requested_count: number;

  /**
   * Number of user profiles returned and charged.
   */
  returned_count: number;

  /**
   * Processed IDs with no profile on X, in first-seen request order.
   */
  unavailable_ids: Array<string>;

  /**
   * Requested IDs skipped because available credits limited processing. Retry these
   * IDs after adding credits.
   */
  unprocessed_ids: Array<string>;

  users: Array<Shared.UserProfile>;

  /**
   * Profiles rejected by the requested filters.
   */
  filtered_count?: number;
}

/**
 * Each user's newest posts, in the order the users were named, with the pinned
 * post first. The ID lists name the requested IDs or usernames. A profile link is
 * named by its username.
 */
export interface UserRetrieveBatchTweetsResponse {
  /**
   * Always false. The answer holds every post in 1 page.
   */
  has_next_page: false;

  /**
   * Always empty. The answer holds every post in 1 page.
   */
  next_cursor: string;

  tweets: Array<Shared.SearchTweet>;

  /**
   * Users with no account on X or with protected posts, in first-seen request order.
   * They cost nothing.
   */
  unavailable_ids: Array<string>;

  /**
   * Users the call did not read, in first-seen request order. Their read failed, the
   * call ran out of time or credits ran out. They cost nothing. Send them again.
   */
  unprocessed_ids: Array<string>;
}

export interface UserRetrieveFollowerAuditResponse {
  /**
   * Report on the followers read. Classes rest on public profile signals, so they
   * say what a profile looks like, never who runs it.
   */
  audit: FollowerAudit;
}

/**
 * Report on the followers read. Classes rest on public profile signals, so they say
 * what a profile looks like, never who runs it.
 */
export interface FollowerAudit {
  /**
   * The audited account's engagement insights.
   */
  account: UserRetrieveInsightsResponse.Insights;

  /**
   * Likely fake share by position in the newest-first list.
   */
  arrivalBands: Array<FollowerAudit.ArrivalBand>;

  /**
   * How many followers fall in each class.
   */
  classes: Array<FollowerAudit.Class>;

  /**
   * Followers who joined X in the same UTC week.
   */
  cohorts: Array<FollowerAudit.Cohort>;

  /**
   * How many of the account's followers the audit read.
   */
  coverage: FollowerAudit.Coverage;

  /**
   * Each follower the audit read, newest first.
   */
  followers: Array<AuditedFollower>;

  /**
   * How many followers share each profile language.
   */
  languages: Array<FollowerValueCount>;

  /**
   * How many followers share each profile place.
   */
  places: Array<FollowerValueCount>;

  /**
   * The audit's grade & score for the followers read.
   */
  quality: FollowerAudit.Quality;

  /**
   * How many followers match each signal & the points it adds.
   */
  signals: Array<FollowerAudit.Signal>;

  /**
   * The followers the audit ranks highest.
   */
  topFollowers: Array<AuditedFollower>;

  /**
   * How many followers are verified.
   */
  verified: FollowerAudit.Verified;
}

export namespace FollowerAudit {
  export interface ArrivalBand {
    /**
     * Whole number from 0.
     */
    count: number;

    /**
     * Whole number from 0.
     */
    from: number;

    percent: number;

    /**
     * Whole number from 0.
     */
    read: number;

    /**
     * Whole number from 0.
     */
    to: number;
  }

  export interface Class {
    /**
     * What 1 follower looks like from its public profile.
     */
    class: FollowerClass;

    /**
     * Whole number from 0.
     */
    count: number;

    percent: number;
  }

  export interface Cohort {
    /**
     * Whole number from 0.
     */
    count: number;

    /**
     * Followers in the cohort the audit classes as likelyFake. Whole number from 0.
     */
    likelyFake: number;

    percent: number;

    /**
     * Start of the UTC week, in milliseconds since the Unix epoch.
     */
    weekStartMs: number;
  }

  export interface Coverage {
    percent: number;

    /**
     * Whole number from 0.
     */
    read: number;

    /**
     * Whole number from 0.
     */
    total: number;
  }

  export interface Quality {
    grade: 'A' | 'B' | 'C' | 'D' | 'F';

    /**
     * Whole number from 0 to 100.
     */
    score: number;
  }

  export interface Signal {
    /**
     * Whole number from 0.
     */
    count: number;

    id: string;

    percent: number;

    /**
     * Whole number from 0.
     */
    points: number;
  }

  export interface Verified {
    /**
     * Whole number from 0.
     */
    count: number;

    percent: number;
  }
}

/**
 * 1 follower the audit read, with its class, score & signals.
 */
export interface AuditedFollower {
  id: string;

  /**
   * What 1 follower looks like from its public profile.
   */
  class: FollowerClass;

  /**
   * Whole number from 0.
   */
  followers: number;

  /**
   * Whole number from 0.
   */
  following: number;

  /**
   * Whole number from 0.
   */
  likes: number;

  name: string;

  /**
   * The follower's place in the newest-first list. Whole number from 0.
   */
  position: number;

  /**
   * Whole number from 0.
   */
  posts: number;

  /**
   * Whole number from 0.
   */
  score: number;

  signals: Array<string>;

  userName: string;

  /**
   * When the follower joined X, in milliseconds since the Unix epoch.
   */
  joinedAtMs?: number;

  /**
   * Account that runs an automated follower, when X names it.
   */
  owner?: string;

  pictureUrl?: string;
}

/**
 * What 1 follower looks like from its public profile.
 */
export type FollowerClass = 'automated' | 'inactive' | 'likelyFake' | 'likelyReal' | 'tooNew';

/**
 * How many followers share 1 value, such as a language or place.
 */
export interface FollowerValueCount {
  /**
   * Whole number from 0.
   */
  count: number;

  percent: number;

  value: string;
}

export type UserRetrieveFollowerIDsResponse = Shared.PaginatedUserIds;

/**
 * A standard or terminal maximum-coverage relationship page.
 */
export type UserRetrieveFollowersResponse =
  Shared.UserListPage | UserRetrieveFollowersResponse.UserListCoverageResponse;

export namespace UserRetrieveFollowersResponse {
  /**
   * Terminal relationship coverage response with diagnostics.
   */
  export interface UserListCoverageResponse extends Omit<
    Shared.PaginatedUsers,
    'has_next_page' | 'next_cursor'
  > {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    diagnostic: UserListCoverageResponse.Diagnostic;

    has_next_page: false;

    next_cursor: '';
  }

  export namespace UserListCoverageResponse {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    export interface Diagnostic {
      /**
       * True after all active strategies exhaust their sources. An empty read of the
       * whole search window also ends its time slices.
       */
      complete: boolean;

      /**
       * Whole number from 0.
       */
      cursorFailureCount: number;

      deadlineReached: boolean;

      /**
       * Whole number from 0.
       */
      duplicateCount: number;

      /**
       * Whole number from 0.
       */
      failedStrategyCount: number;

      /**
       * Whole number from 0.
       */
      malformedCount: number;

      /**
       * Whole number from 0.
       */
      pagesFetched: number;

      /**
       * True when credits or the requested limit reduce output.
       */
      responseTruncated: boolean;

      resultLimitReached: boolean;

      returnedUsers: number;

      /**
       * Whole number from 0.
       */
      stalledStrategyCount: number;

      strategies: Array<Diagnostic.Strategy>;

      strategyCount: number;

      uniqueUsers: number;
    }

    export namespace Diagnostic {
      /**
       * Result counts and stop reason for one relationship strategy.
       */
      export interface Strategy {
        /**
         * Whole number from 0.
         */
        duplicateCount: number;

        /**
         * Whole number from 0.
         */
        pagesFetched: number;

        /**
         * Reason a coverage strategy stopped.
         */
        stopReason:
          'cursor_failure' | 'deadline' | 'exhausted' | 'failed' | 'page_limit' | 'result_limit' | 'stalled';

        strategy: number;

        /**
         * Whole number from 0.
         */
        uniqueAdded: number;
      }
    }
  }
}

/**
 * A standard or terminal maximum-coverage relationship page.
 */
export type UserRetrieveFollowingResponse =
  Shared.UserListPage | UserRetrieveFollowingResponse.UserListCoverageResponse;

export namespace UserRetrieveFollowingResponse {
  /**
   * Terminal relationship coverage response with diagnostics.
   */
  export interface UserListCoverageResponse extends Omit<
    Shared.PaginatedUsers,
    'has_next_page' | 'next_cursor'
  > {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    diagnostic: UserListCoverageResponse.Diagnostic;

    has_next_page: false;

    next_cursor: '';
  }

  export namespace UserListCoverageResponse {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    export interface Diagnostic {
      /**
       * True after all active strategies exhaust their sources. An empty read of the
       * whole search window also ends its time slices.
       */
      complete: boolean;

      /**
       * Whole number from 0.
       */
      cursorFailureCount: number;

      deadlineReached: boolean;

      /**
       * Whole number from 0.
       */
      duplicateCount: number;

      /**
       * Whole number from 0.
       */
      failedStrategyCount: number;

      /**
       * Whole number from 0.
       */
      malformedCount: number;

      /**
       * Whole number from 0.
       */
      pagesFetched: number;

      /**
       * True when credits or the requested limit reduce output.
       */
      responseTruncated: boolean;

      resultLimitReached: boolean;

      returnedUsers: number;

      /**
       * Whole number from 0.
       */
      stalledStrategyCount: number;

      strategies: Array<Diagnostic.Strategy>;

      strategyCount: number;

      uniqueUsers: number;
    }

    export namespace Diagnostic {
      /**
       * Result counts and stop reason for one relationship strategy.
       */
      export interface Strategy {
        /**
         * Whole number from 0.
         */
        duplicateCount: number;

        /**
         * Whole number from 0.
         */
        pagesFetched: number;

        /**
         * Reason a coverage strategy stopped.
         */
        stopReason:
          'cursor_failure' | 'deadline' | 'exhausted' | 'failed' | 'page_limit' | 'result_limit' | 'stalled';

        strategy: number;

        /**
         * Whole number from 0.
         */
        uniqueAdded: number;
      }
    }
  }
}

export type UserRetrieveFollowingIDsResponse = Shared.PaginatedUserIds;

export interface UserRetrieveInsightsResponse {
  /**
   * Engagement insights of one profile. Engagements are likes, replies, reposts and
   * quotes. A rate is null when nothing divides it, such as a profile without posts
   * of its own.
   */
  insights: UserRetrieveInsightsResponse.Insights;

  /**
   * Says why the report has counts only.
   */
  message?: string;
}

export namespace UserRetrieveInsightsResponse {
  /**
   * Engagement insights of one profile. Engagements are likes, replies, reposts and
   * quotes. A rate is null when nothing divides it, such as a profile without posts
   * of its own.
   */
  export interface Insights {
    /**
     * Whole days since the account joined X.
     */
    accountAgeDays: number | null;

    /**
     * Each count per post of the sample. Null without posts.
     */
    averages: Insights.Averages | null;

    /**
     * Engagements as a percent of views across the sample.
     */
    engagementPerView: number | null;

    /**
     * Average engagements per post, as a percent of followers.
     */
    engagementRate: number | null;

    /**
     * Followers.
     */
    followers: number;

    /**
     * Accounts the user follows.
     */
    following: number;

    /**
     * Middle view count of the sample, so 1 viral post moves it less than the
     * average. Null without posts.
     */
    medianViews: number | null;

    /**
     * Posts the user has made.
     */
    posts: number;

    /**
     * Sampled posts per day, from the oldest one until now.
     */
    postsPerDay: number | null;

    /**
     * True when only the account's followers see its posts. The report then has its
     * counts only.
     */
    postsPrivate: boolean;

    /**
     * The recent posts the averages read.
     */
    sample: Insights.Sample;

    /**
     * The sampled post with the most engagements.
     */
    topPostId: string | null;

    /**
     * ID of the profile the insights describe.
     */
    userId: string;

    /**
     * Username of that profile.
     */
    userName: string;
  }

  export namespace Insights {
    /**
     * Each count per post of the sample. Null without posts.
     */
    export interface Averages {
      /**
       * Bookmarks.
       */
      bookmarks: number;

      /**
       * Likes, replies, reposts and quotes per post.
       */
      engagements: number;

      /**
       * Likes.
       */
      likes: number;

      /**
       * Quotes.
       */
      quotes: number;

      /**
       * Replies.
       */
      replies: number;

      /**
       * Reposts.
       */
      reposts: number;

      /**
       * Views.
       */
      views: number;
    }

    /**
     * The recent posts the averages read.
     */
    export interface Sample {
      /**
       * When the newest of them went up.
       */
      newestAt: string | null;

      /**
       * When the oldest of them went up.
       */
      oldestAt: string | null;

      /**
       * Posts the averages used. Reposts and the pinned post stay out, so this can be
       * lower than `read`.
       */
      posts: number;

      /**
       * Posts read, reposts and the pinned post included.
       */
      read: number;
    }
  }
}

export type UserRetrieveListMembershipsResponse = Shared.PaginatedLists;

export namespace UserRetrieveListMembershipsResponse {
  export type List = Shared.XList;

  export namespace List {
    export type CustomBanner = Shared.XListBanner;

    export namespace CustomBanner {
      export type Palette = Shared.XListBanner.Palette;

      export namespace Palette {
        export type Rgb = Shared.XListBanner.Palette.Rgb;
      }

      export type SalientRect = Shared.XListBanner.SalientRect;
    }

    export type DefaultBanner = Shared.XListBanner;

    export namespace DefaultBanner {
      export type Palette = Shared.XListBanner.Palette;

      export namespace Palette {
        export type Rgb = Shared.XListBanner.Palette.Rgb;
      }

      export type SalientRect = Shared.XListBanner.SalientRect;
    }
  }
}

export type UserRetrieveListsResponse = Shared.PaginatedLists;

export namespace UserRetrieveListsResponse {
  export type List = Shared.XList;

  export namespace List {
    export type CustomBanner = Shared.XListBanner;

    export namespace CustomBanner {
      export type Palette = Shared.XListBanner.Palette;

      export namespace Palette {
        export type Rgb = Shared.XListBanner.Palette.Rgb;
      }

      export type SalientRect = Shared.XListBanner.SalientRect;
    }

    export type DefaultBanner = Shared.XListBanner;

    export namespace DefaultBanner {
      export type Palette = Shared.XListBanner.Palette;

      export namespace Palette {
        export type Rgb = Shared.XListBanner.Palette.Rgb;
      }

      export type SalientRect = Shared.XListBanner.SalientRect;
    }
  }
}

/**
 * Says whether X limits 1 account in search, search suggestions, reply threads or
 * its timeline. Each check holds a verdict, its reason & the evidence it read.
 * Evidence is null for a check that couldn't read the account.
 */
export interface ShadowbanReport {
  /**
   * Whether the account is active, protected or suspended.
   */
  account: 'active' | 'protected' | 'suspended';

  /**
   * When the check ran.
   */
  checkedAt: string;

  /**
   * The 9 checks, each with a verdict, a reason & evidence.
   */
  checks: ShadowbanReport.Checks;

  /**
   * `suspended` means X suspended the account. `limited` means at least 1 check
   * failed. `clear` means search & suggestions passed with no fail. `unclear` means
   * neither of those.
   */
  overall: 'clear' | 'limited' | 'unclear' | 'suspended';

  /**
   * ID of the account. Null for a suspended account asked for by username.
   */
  userId: string | null;

  /**
   * Username of the account. Null for a suspended account asked for by ID.
   */
  username: string | null;
}

export namespace ShadowbanReport {
  /**
   * The 9 checks, each with a verdict, a reason & evidence.
   */
  export interface Checks {
    /**
     * Passes an active or protected account & fails a suspended one.
     */
    account: Checks.Account;

    /**
     * Compares the newest 5 of the account's own posts older than 24 hours with its
     * earlier posts, by the median of likes, replies, reposts & quotes. `typical`
     * passes at 25% or more. A drop alone proves nothing, so `low` can't tell.
     */
    engagement: Checks.Engagement;

    /**
     * Opens the threads of up to 3 recent replies to other accounts. `in_thread`
     * passes. X ranks replies for each viewer, so `more_replies` can't tell.
     */
    replies: Checks.Replies;

    /**
     * Reads the same reply threads as `replies`. `replies_show` passes when any
     * checked reply shows. X ranks replies for each viewer, so `replies_missing`
     * can't tell.
     */
    replyLock: Checks.ReplyLock;

    /**
     * Looks for the account's recent posts in X search, sorted by Latest. `listed`
     * passes & `missing` fails.
     */
    search: Checks.Search;

    /**
     * Reads X's sensitive flag on the profile. `not_flagged` passes & `flagged`
     * fails.
     */
    sensitive: Checks.Sensitive;

    /**
     * Looks for the account among the accounts X suggests for its username.
     * `suggested` passes & `not_suggested` fails.
     */
    suggestion: Checks.Suggestion;

    /**
     * Looks for the account's posts on its profile timeline. `visible` passes &
     * `hidden` fails.
     */
    timeline: Checks.Timeline;

    /**
     * Reads the countries where X withholds the account. `none` passes & `countries`
     * fails.
     */
    withheld: Checks.Withheld;
  }

  export namespace Checks {
    /**
     * Passes an active or protected account & fails a suspended one.
     */
    export interface Account {
      /**
       * Where to see the account on X.
       */
      evidence: Account.Evidence;

      /**
       * State of the account on X.
       */
      reason: 'active' | 'protected' | 'suspended';

      verdict: ShadowbanVerdict;
    }

    export namespace Account {
      /**
       * Where to see the account on X.
       */
      export interface Evidence {
        /**
         * Profile of the account on X.
         */
        profileUrl: string;
      }
    }

    /**
     * Compares the newest 5 of the account's own posts older than 24 hours with its
     * earlier posts, by the median of likes, replies, reposts & quotes. `typical`
     * passes at 25% or more. A drop alone proves nothing, so `low` can't tell.
     */
    export interface Engagement {
      /**
       * The 2 medians & how many posts each one covers.
       */
      evidence: Engagement.Evidence | null;

      /**
       * `too_few_posts` means fewer than 8 posts to compare, or earlier posts with no
       * engagement.
       */
      reason: 'typical' | 'low' | 'too_few_posts' | 'unavailable' | 'protected' | 'suspended';

      verdict: ShadowbanVerdict;
    }

    export namespace Engagement {
      /**
       * The 2 medians & how many posts each one covers.
       */
      export interface Evidence {
        /**
         * Median engagement of the earlier posts.
         */
        earlierMedian: number;

        /**
         * Posts in the earlier group.
         */
        earlierPosts: number;

        /**
         * Median engagement of the newest posts.
         */
        newestMedian: number;

        /**
         * Posts in the newest group, up to 5.
         */
        newestPosts: number;
      }
    }

    /**
     * Opens the threads of up to 3 recent replies to other accounts. `in_thread`
     * passes. X ranks replies for each viewer, so `more_replies` can't tell.
     */
    export interface Replies {
      /**
       * Each reply it opened & where it showed.
       */
      evidence: Replies.Evidence | null;

      /**
       * `more_replies` means X put a reply behind its hidden replies prompt.
       * `not_found` means no reply showed on the pages the check read.
       */
      reason:
        | 'in_thread'
        | 'more_replies'
        | 'no_recent_replies'
        | 'not_found'
        | 'unavailable'
        | 'protected'
        | 'suspended';

      verdict: ShadowbanVerdict;
    }

    export namespace Replies {
      /**
       * Each reply it opened & where it showed.
       */
      export interface Evidence {
        /**
         * Up to 3 replies, newest first.
         */
        replies: Array<Evidence.Reply>;
      }

      export namespace Evidence {
        export interface Reply {
          /**
           * ID of the post it replies to.
           */
          parentId: string;

          /**
           * The thread of that post on X.
           */
          parentUrl: string;

          /**
           * `thread` means the reply shows in the thread. `more_replies` means it shows
           * only behind X's hidden replies prompt.
           */
          placement: 'thread' | 'more_replies' | 'not_found';

          /**
           * ID of the reply.
           */
          replyId: string;

          /**
           * The reply on X.
           */
          replyUrl: string;
        }
      }
    }

    /**
     * Reads the same reply threads as `replies`. `replies_show` passes when any
     * checked reply shows. X ranks replies for each viewer, so `replies_missing`
     * can't tell.
     */
    export interface ReplyLock {
      /**
       * How many replies it opened & how many showed.
       */
      evidence: ReplyLock.Evidence | null;

      /**
       * `replies_show` means X showed at least 1 checked reply. `replies_missing` means
       * it showed none on the pages read.
       */
      reason:
        'replies_show' | 'replies_missing' | 'no_recent_replies' | 'unavailable' | 'protected' | 'suspended';

      verdict: ShadowbanVerdict;
    }

    export namespace ReplyLock {
      /**
       * How many replies it opened & how many showed.
       */
      export interface Evidence {
        /**
         * Replies it looked for, up to 3.
         */
        checkedReplies: number;

        /**
         * Replies that showed in their thread.
         */
        shownReplies: number;
      }
    }

    /**
     * Looks for the account's recent posts in X search, sorted by Latest. `listed`
     * passes & `missing` fails.
     */
    export interface Search {
      /**
       * The search & the posts it looked for.
       */
      evidence: Search.Evidence | null;

      /**
       * `listed` means search shows its posts & `missing` means it shows none.
       * `no_recent_posts` means the account has no recent post to look for.
       */
      reason: 'listed' | 'missing' | 'no_recent_posts' | 'unavailable' | 'protected' | 'suspended';

      verdict: ShadowbanVerdict;
    }

    export namespace Search {
      /**
       * The search & the posts it looked for.
       */
      export interface Evidence {
        /**
         * Up to 5 posts of the account that search showed.
         */
        foundPostIds: Array<string>;

        /**
         * The search it ran.
         */
        query: string;

        /**
         * Up to 5 recent posts of the account.
         */
        recentPostIds: Array<string>;

        /**
         * The same search on X, sorted by Latest.
         */
        searchUrl: string;
      }
    }

    /**
     * Reads X's sensitive flag on the profile. `not_flagged` passes & `flagged`
     * fails.
     */
    export interface Sensitive {
      /**
       * Always null, since the reason holds the answer.
       */
      evidence: null;

      /**
       * `unknown` means X left the flag out of the profile.
       */
      reason: 'not_flagged' | 'flagged' | 'unknown' | 'suspended';

      verdict: ShadowbanVerdict;
    }

    /**
     * Looks for the account among the accounts X suggests for its username.
     * `suggested` passes & `not_suggested` fails.
     */
    export interface Suggestion {
      /**
       * The username searched & the accounts X suggested.
       */
      evidence: Suggestion.Evidence | null;

      /**
       * `suggested` means X suggests the account for its username.
       */
      reason: 'suggested' | 'not_suggested' | 'unavailable' | 'suspended';

      verdict: ShadowbanVerdict;
    }

    export namespace Suggestion {
      /**
       * The username searched & the accounts X suggested.
       */
      export interface Evidence {
        /**
         * The username it typed.
         */
        query: string;

        /**
         * Up to 10 accounts X suggested, in its order.
         */
        suggestedUsernames: Array<string>;
      }
    }

    /**
     * Looks for the account's posts on its profile timeline. `visible` passes &
     * `hidden` fails.
     */
    export interface Timeline {
      /**
       * The post count on the profile & the posts read.
       */
      evidence: Timeline.Evidence | null;

      /**
       * `visible` means the timeline shows posts. `hidden` means X counts posts but
       * shows none. `no_posts` means the account has none to show.
       */
      reason: 'visible' | 'hidden' | 'no_posts' | 'unavailable' | 'protected' | 'suspended';

      verdict: ShadowbanVerdict;
    }

    export namespace Timeline {
      /**
       * The post count on the profile & the posts read.
       */
      export interface Evidence {
        /**
         * Posts X counts on the profile.
         */
        postCount: number | null;

        /**
         * Posts the timeline read returned, up to 20.
         */
        timelinePosts: number;
      }
    }

    /**
     * Reads the countries where X withholds the account. `none` passes & `countries`
     * fails.
     */
    export interface Withheld {
      /**
       * The countries X lists.
       */
      evidence: Withheld.Evidence | null;

      /**
       * `countries` means X lists at least 1 country.
       */
      reason: 'none' | 'countries' | 'suspended';

      verdict: ShadowbanVerdict;
    }

    export namespace Withheld {
      /**
       * The countries X lists.
       */
      export interface Evidence {
        /**
         * Country codes as X gives them.
         */
        countries: Array<string>;
      }
    }
  }
}

/**
 * Pass means X shows the account there, and fail means it doesn't. Unknown means
 * the check had nothing to test or X didn't answer.
 */
export type ShadowbanVerdict = 'pass' | 'fail' | 'unknown';

/**
 * Says whether a user broadcasts live video on X now. `broadcast` is their latest
 * broadcast, live or ended, and null when X shows none.
 */
export interface UserRetrieveLiveResponse {
  /**
   * Latest broadcast, live or ended. Null when X shows none.
   */
  broadcast: Shared.Broadcast | null;

  /**
   * True while the user's latest broadcast is running.
   */
  live: boolean;

  /**
   * ID of the user.
   */
  userId: string;

  /**
   * Username of the user.
   */
  userName: string;
}

export namespace UserRetrieveLiveResponse {
  export type Broadcast = Shared.Broadcast;

  export namespace Broadcast {
    export type PeriscopeUser = Shared.Broadcast.PeriscopeUser;
  }
}

/**
 * A standard or terminal maximum-coverage relationship page.
 */
export type UserRetrieveVerifiedFollowersResponse =
  Shared.UserListPage | UserRetrieveVerifiedFollowersResponse.UserListCoverageResponse;

export namespace UserRetrieveVerifiedFollowersResponse {
  /**
   * Terminal relationship coverage response with diagnostics.
   */
  export interface UserListCoverageResponse extends Omit<
    Shared.PaginatedUsers,
    'has_next_page' | 'next_cursor'
  > {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    diagnostic: UserListCoverageResponse.Diagnostic;

    has_next_page: false;

    next_cursor: '';
  }

  export namespace UserListCoverageResponse {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    export interface Diagnostic {
      /**
       * True after all active strategies exhaust their sources. An empty read of the
       * whole search window also ends its time slices.
       */
      complete: boolean;

      /**
       * Whole number from 0.
       */
      cursorFailureCount: number;

      deadlineReached: boolean;

      /**
       * Whole number from 0.
       */
      duplicateCount: number;

      /**
       * Whole number from 0.
       */
      failedStrategyCount: number;

      /**
       * Whole number from 0.
       */
      malformedCount: number;

      /**
       * Whole number from 0.
       */
      pagesFetched: number;

      /**
       * True when credits or the requested limit reduce output.
       */
      responseTruncated: boolean;

      resultLimitReached: boolean;

      returnedUsers: number;

      /**
       * Whole number from 0.
       */
      stalledStrategyCount: number;

      strategies: Array<Diagnostic.Strategy>;

      strategyCount: number;

      uniqueUsers: number;
    }

    export namespace Diagnostic {
      /**
       * Result counts and stop reason for one relationship strategy.
       */
      export interface Strategy {
        /**
         * Whole number from 0.
         */
        duplicateCount: number;

        /**
         * Whole number from 0.
         */
        pagesFetched: number;

        /**
         * Reason a coverage strategy stopped.
         */
        stopReason:
          'cursor_failure' | 'deadline' | 'exhausted' | 'failed' | 'page_limit' | 'result_limit' | 'stalled';

        strategy: number;

        /**
         * Whole number from 0.
         */
        uniqueAdded: number;
      }
    }
  }
}

export interface UserTranslateBioResponse {
  /**
   * Null when the profile has no bio.
   */
  translation: UserTranslateBioResponse.Translation | null;

  /**
   * Says why translation is null.
   */
  message?: string;
}

export namespace UserTranslateBioResponse {
  /**
   * Holds X's translation of one profile's bio into the requested language.
   * `entities` holds the links, mentions, and tags with their offsets in the
   * translated text, and is empty when the text has none.
   */
  export interface Translation {
    /**
     * Lists hashtags, symbols, links, and mentions from tweet text.
     */
    entities: Translation.Entities;

    /**
     * Language code of the translated bio, in lower case.
     */
    language: string;

    /**
     * Translated bio.
     */
    text: string;

    /**
     * ID of the account whose bio X translated.
     */
    userId: string;

    /**
     * Username of that account.
     */
    userName: string;

    /**
     * Language code X detects in the bio, when it names one.
     */
    sourceLanguage?: string;
  }

  export namespace Translation {
    /**
     * Lists hashtags, symbols, links, and mentions from tweet text.
     */
    export interface Entities {
      hashtags?: Array<Entities.Hashtag>;

      smarttags?: Array<Entities.Smarttag>;

      symbols?: Array<Entities.Symbol>;

      timestamps?: Array<Entities.Timestamp>;

      urls?: Array<Entities.URL>;

      user_mentions?: Array<Entities.UserMention>;
    }

    export namespace Entities {
      /**
       * Provides hashtag text and source offsets within a tweet.
       */
      export interface Hashtag {
        text: string;

        indices?: Array<number>;

        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        tag?: Hashtag.Tag;
      }

      export namespace Hashtag {
        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        export interface Tag {
          /**
           * X's ID for the SmartTag.
           */
          id?: string;

          info?: Tag.Info;
        }

        export namespace Tag {
          export interface Info {
            info?: Info.Info;
          }

          export namespace Info {
            export interface Info {
              /**
               * Whether X marks the SmartTag active.
               */
              active?: boolean;

              name?: string;

              ticker?: string;
            }
          }
        }
      }

      /**
       * Indexed smart-tag, cashtag, or video timestamp metadata.
       */
      export interface Smarttag {
        indices?: Array<number>;

        seconds?: number;

        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        tag?: Smarttag.Tag;

        text?: string;
      }

      export namespace Smarttag {
        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        export interface Tag {
          /**
           * X's ID for the SmartTag.
           */
          id?: string;

          info?: Tag.Info;
        }

        export namespace Tag {
          export interface Info {
            info?: Info.Info;
          }

          export namespace Info {
            export interface Info {
              /**
               * Whether X marks the SmartTag active.
               */
              active?: boolean;

              name?: string;

              ticker?: string;
            }
          }
        }
      }

      /**
       * Indexed smart-tag, cashtag, or video timestamp metadata.
       */
      export interface Symbol {
        indices?: Array<number>;

        seconds?: number;

        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        tag?: Symbol.Tag;

        text?: string;
      }

      export namespace Symbol {
        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        export interface Tag {
          /**
           * X's ID for the SmartTag.
           */
          id?: string;

          info?: Tag.Info;
        }

        export namespace Tag {
          export interface Info {
            info?: Info.Info;
          }

          export namespace Info {
            export interface Info {
              /**
               * Whether X marks the SmartTag active.
               */
              active?: boolean;

              name?: string;

              ticker?: string;
            }
          }
        }
      }

      /**
       * Indexed smart-tag, cashtag, or video timestamp metadata.
       */
      export interface Timestamp {
        indices?: Array<number>;

        seconds?: number;

        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        tag?: Timestamp.Tag;

        text?: string;
      }

      export namespace Timestamp {
        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        export interface Tag {
          /**
           * X's ID for the SmartTag.
           */
          id?: string;

          info?: Tag.Info;
        }

        export namespace Tag {
          export interface Info {
            info?: Info.Info;
          }

          export namespace Info {
            export interface Info {
              /**
               * Whether X marks the SmartTag active.
               */
              active?: boolean;

              name?: string;

              ticker?: string;
            }
          }
        }
      }

      /**
       * Provides shortened, display, and expanded URLs from tweet text.
       */
      export interface URL {
        display_url?: string;

        expanded_url?: string;

        indices?: Array<number>;

        url?: string;
      }

      /**
       * Provides profile identity and source offsets for a mention.
       */
      export interface UserMention {
        screen_name: string;

        id_str?: string;

        indices?: Array<number>;

        name?: string;
      }
    }
  }
}

export interface UserRetrieveParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface UserRemoveFollowerParams {
  /**
   * Body param: X account identifier (@username or account ID)
   */
  account: string;

  /**
   * Header param: Use one unique value per intended write. Reuse it only for an
   * identical retry. A matching retry returns the first answer again, with
   * idempotent: true added. It keeps the first status, body & Retry-After. It sends
   * nothing to X & charges nothing. While the first request runs, a retry returns
   * 202 & the action. Different input returns 409. Protection lasts at least 90
   * days.
   */
  'Idempotency-Key': string;

  /**
   * Header param: A long write answers 202 with a status link, then lands on X.
   * `wait=<seconds>` asks for the answer within that many seconds, up to 85. If
   * the write is still running then, the API answers 202 with Location. Poll
   * Location until `terminal` is true, and don't send the write again.
   */
  Prefer?: string;
}

export interface UserRetrieveAffiliatesParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

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
   * Profiles may follow at most this many accounts.
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
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Profiles to request from this page (1-200, default 200). Source, filters or
   * credits can return fewer. Follow next_cursor for more pages. Aliases: limit,
   * count, max_results, maxItems, max_items & per_page.
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

export interface UserRetrieveArticlesParams {
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
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

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
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
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
   * Filter media. Aliases: has_video, has_media.
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
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

  /**
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
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

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface UserRetrieveBatchParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

  /**
   * Only return profiles with a location.
   */
  hasLocation?: boolean;

  /**
   * Only return profiles with a website.
   */
  hasWebsite?: boolean;

  /**
   * Comma-separated numeric user IDs (1-100 values). Duplicate IDs are ignored while
   * preserving first-seen order.
   */
  ids?: string;

  /**
   * Match a location substring, ignoring case.
   */
  locationContains?: string;

  /**
   * Maximum follower count. Missing counts pass this maximum.
   */
  maxFollowers?: number;

  /**
   * Profiles may follow at most this many accounts.
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
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Match a username substring, ignoring case.
   */
  usernameContains?: string;

  /**
   * Comma-separated X usernames, with or without @, or profile links such as
   * x.com/nasa (1-100 values), in place of ids. A name in another case is the same
   * account.
   */
  usernames?: string;

  /**
   * Only return verified profiles.
   */
  verifiedOnly?: boolean;

  /**
   * Match the verification type exactly, ignoring case.
   */
  verifiedType?: string;
}

export interface UserRetrieveBatchTweetsParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Comma-separated numeric user IDs (1-20 values). Duplicate IDs are ignored while
   * preserving first-seen order.
   */
  ids?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Posts per user (1-20, default 20). Credits can return fewer. Aliases: limit,
   * count, max_results, maxItems, max_items & per_page.
   */
  pageSize?: number;

  /**
   * Comma-separated X usernames, with or without @, or profile links such as
   * x.com/nasa (1-20 values), in place of ids. A name in another case is the same
   * account.
   */
  usernames?: string;
}

export interface UserRetrieveFollowerAuditParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Most followers to read, newest first. Left out, a read takes up to 200 and a low
   * balance reads fewer. A very long read returns what it finished, & coverage shows
   * how many. Its aliases are pageSize, count, max_results, maxItems, max_items &
   * per_page.
   */
  limit?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface UserRetrieveFollowerIDsParams {
  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * User IDs to request from this page (1-5000, default 5000). Credits can return
   * fewer. Follow next_cursor for more pages. Aliases: limit, count, max_results,
   * maxItems, max_items & per_page.
   */
  pageSize?: number;
}

export interface UserRetrieveFollowersParams {
  /**
   * Legacy cursor alias. Prefer cursor.
   */
  after?: string;

  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Cursor from the previous response. Existing unprefixed cursors keep legacy
   * standard behavior. Pages can be empty before more rows; follow next_cursor. Also
   * read as next_cursor, next_token, pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Add each row's full profile, as GET /x/users/{id} returns it. Pages take several
   * seconds longer.
   */
  enrichProfiles?: boolean;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

  /**
   * Only return profiles with a location.
   */
  hasLocation?: boolean;

  /**
   * Only return profiles with a website.
   */
  hasWebsite?: boolean;

  /**
   * Legacy page-size alias outside coverage mode. Coverage accepts 1-10000. Prefer
   * pageSize.
   */
  limit?: number;

  /**
   * Match a location substring, ignoring case.
   */
  locationContains?: string;

  /**
   * Maximum follower count. Missing counts pass this maximum.
   */
  maxFollowers?: number;

  /**
   * Profiles may follow at most this many accounts.
   */
  maxFollowing?: number;

  /**
   * Most profiles 1 request reads, kept or dropped by the filters. A filter that
   * keeps few profiles reads up to 65 s a request without it. The request then
   * answers the profiles it kept, the count it dropped & the cursor to read on. Each
   * request of a cursor may send its own value. Automatic mode only.
   */
  maxScan?: number;

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
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Omit mode for resumable maximum coverage. Standard keeps legacy pagination.
   * Coverage returns diagnostics once and rejects cursors.
   */
  mode?: 'standard' | 'coverage';

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Up to 300 user profiles in automatic mode, 200 in standard. Sources can return
   * fewer. Follow next_cursor for more pages. Aliases: limit, count, max_results,
   * maxItems, max_items & per_page.
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

export interface UserRetrieveFollowersYouKnowParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

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
   * Profiles may follow at most this many accounts.
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
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Profiles to request from this page (1-200, default 200). Source, filters or
   * credits can return fewer. Follow next_cursor for more pages. Aliases: limit,
   * count, max_results, maxItems, max_items & per_page.
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

export interface UserRetrieveFollowingParams {
  /**
   * Legacy cursor alias. Prefer cursor.
   */
  after?: string;

  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Cursor from the previous response. Existing unprefixed cursors keep legacy
   * standard behavior. Pages can be empty before more rows; follow next_cursor. Also
   * read as next_cursor, next_token, pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Add each row's full profile, as GET /x/users/{id} returns it. Pages take several
   * seconds longer.
   */
  enrichProfiles?: boolean;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

  /**
   * Only return profiles with a location.
   */
  hasLocation?: boolean;

  /**
   * Only return profiles with a website.
   */
  hasWebsite?: boolean;

  /**
   * Legacy page-size alias outside coverage mode. Coverage accepts 1-10000. Prefer
   * pageSize.
   */
  limit?: number;

  /**
   * Match a location substring, ignoring case.
   */
  locationContains?: string;

  /**
   * Maximum follower count. Missing counts pass this maximum.
   */
  maxFollowers?: number;

  /**
   * Profiles may follow at most this many accounts.
   */
  maxFollowing?: number;

  /**
   * Most profiles 1 request reads, kept or dropped by the filters. A filter that
   * keeps few profiles reads up to 65 s a request without it. The request then
   * answers the profiles it kept, the count it dropped & the cursor to read on. Each
   * request of a cursor may send its own value. Automatic mode only.
   */
  maxScan?: number;

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
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Omit mode for resumable maximum coverage. Standard keeps legacy pagination.
   * Coverage returns diagnostics once and rejects cursors.
   */
  mode?: 'standard' | 'coverage';

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Up to 300 user profiles in automatic mode, 200 in standard. Sources can return
   * fewer. Follow next_cursor for more pages. Aliases: limit, count, max_results,
   * maxItems, max_items & per_page.
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

export interface UserRetrieveFollowingIDsParams {
  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * User IDs to request from this page (1-5000, default 5000). Credits can return
   * fewer. Follow next_cursor for more pages. Aliases: limit, count, max_results,
   * maxItems, max_items & per_page.
   */
  pageSize?: number;
}

export interface UserRetrieveHighlightsParams {
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
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

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
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
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
   * Filter media. Aliases: has_video, has_media.
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
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

  /**
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
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

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface UserRetrieveInsightsParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Recent posts to read for the averages and rates. The read stops at this count,
   * at the end of the timeline or after about 40 seconds, and `sample.posts` says
   * how many it read.
   */
  limit?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface UserRetrieveLikesParams {
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
   * @deprecated The API ignores this filter on this route. Remove it.
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
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
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
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
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
   * Filter media. Aliases: has_video, has_media.
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
   * @deprecated Use minLikes instead. The API still reads minFaves.
   */
  minFaves?: number;

  /**
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  near?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  news?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

  /**
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  safe?: boolean;

  /**
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  source?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
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

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  within?: string;

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface UserRetrieveListMembershipsParams {
  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;
}

export interface UserRetrieveListsParams {
  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;
}

export interface UserRetrieveLiveParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface UserRetrieveMediaParams {
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
   * @deprecated The API ignores this filter on this route. Remove it.
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
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  geocode?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Keep only posts whose photos show this. Send charts, screenshots, product_photos,
   * memes or people, or describe it in words, such as a rocket. AI-powered analysis
   * checks posts with photos X doesn't mark sensitive & keeps scores of 0.5 or more.
   * Other posts stay out at no charge. Each kept post costs 2 credits, the AI analysis
   * price, instead of the read price, & a post the filter drops costs nothing.
   * imageFilter states the cutoff & counts.
   */
  imageShows?: string;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
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
   * Filter media. Aliases: has_video, has_media.
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
   * @deprecated Use minLikes instead. The API still reads minFaves.
   */
  minFaves?: number;

  /**
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  near?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  news?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

  /**
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  safe?: boolean;

  /**
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  source?: string;

  /**
   * Keep only posts about this topic. AI-powered analysis asks "Is this post about
   * <topic>?" of each post & keeps scores of 0.5 or more. It reads post text & safe
   * photos. Each kept post costs 2 credits, the AI analysis price, instead of the read
   * price, & a post the filter drops costs nothing. limit counts checked posts, & only
   * kept posts come back. topicFilter states the cutoff & counts.
   */
  topic?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
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

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  within?: string;

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface UserRetrieveMentionsParams {
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
   * @deprecated The API ignores this filter on this route. Remove it.
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
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
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
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
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
   * Filter media. Aliases: has_video, has_media.
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
   * @deprecated Use minLikes instead. The API still reads minFaves.
   */
  minFaves?: number;

  /**
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  near?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  news?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * With replies=exclude, also leaves out replies to the author's own posts, so the
   * search skips every reply.
   */
  ownThreads?: 'exclude';

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

  /**
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  safe?: boolean;

  /**
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * Inclusive ISO bound for Tweet creation time, such as 2026-09-25T19:20:41Z. Unix
   * seconds also work. A time without an offset is UTC.
   */
  sinceTime?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  source?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
   */
  untilDate?: string;

  /**
   * Exclusive ISO bound for Tweet creation time. Unix seconds also work. A time
   * without an offset is UTC.
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
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  within?: string;

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface UserRetrieveRepliesParams {
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
   * Keep only Tweets with this card type, such as poll2choice_text_only. Tweet
   * search checks each Tweet's card.
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
   * Cursor from the previous response. Existing unprefixed cursors keep legacy
   * standard behavior. Pages can be empty before more rows; follow next_cursor. Also
   * read as next_cursor, next_token, pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * X search no longer supports excludeSource. A Tweet search with it answers 424 &
   * charges nothing.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * X search no longer supports geocode. A Tweet search with it answers 424 &
   * charges nothing.
   */
  geocode?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Keep only posts whose photos show this. Send charts, screenshots, product_photos,
   * memes or people, or describe it in words, such as a rocket. AI-powered analysis
   * checks posts with photos X doesn't mark sensitive & keeps scores of 0.5 or more.
   * Other posts stay out at no charge. Each kept post costs 2 credits, the AI analysis
   * price, instead of the read price, & a post the filter drops costs nothing.
   * imageFilter states the cutoff & counts.
   */
  imageShows?: string;

  /**
   * Include each reply's parent tweet as parentTweet on the reply. A reply whose
   * parent X does not return comes without it. Search-only filters such as keywords
   * do not apply with it.
   */
  includeParentTweet?: boolean;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Words the Tweets must match, in X search syntax.
   */
  keywords?: string;

  /**
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Search within a list ID.
   */
  listId?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
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
   * Filter media. Aliases: has_video, has_media.
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
   * @deprecated Use minLikes instead. The API still reads minFaves.
   */
  minFaves?: number;

  /**
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * Optional legacy pagination override. Search-only filters such as keywords apply
   * only without it.
   */
  mode?: 'standard';

  /**
   * Only return native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * Match a place name.
   */
  near?: string;

  /**
   * X no longer searches filter:news.
   */
  news?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Automatic pages accept 1-300 Tweets, standard pages 1-100. Default 20. Follow
   * next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

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
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
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
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * Inclusive ISO bound for Tweet creation time, such as 2026-09-25T19:20:41Z. Unix
   * seconds also work. A time without an offset is UTC.
   */
  sinceTime?: string;

  /**
   * X search no longer supports source. A Tweet search with it answers 424 & charges
   * nothing.
   */
  source?: string;

  /**
   * Keep only posts about this topic. AI-powered analysis asks "Is this post about
   * <topic>?" of each post & keeps scores of 0.5 or more. It reads post text & safe
   * photos. Each kept post costs 2 credits, the AI analysis price, instead of the read
   * price, & a post the filter drops costs nothing. limit counts checked posts, & only
   * kept posts come back. topicFilter states the cutoff & counts.
   */
  topic?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
   */
  untilDate?: string;

  /**
   * Exclusive ISO bound for Tweet creation time. Unix seconds also work. A time
   * without an offset is UTC.
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
   * X search no longer supports within. A Tweet search with it answers 424 & charges
   * nothing. Use near alone.
   */
  within?: string;

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface UserRetrieveSearchParams {
  /**
   * User search query
   */
  q: string;

  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Add each row's full profile, as GET /x/users/{id} returns it. Pages take several
   * seconds longer.
   */
  enrichProfiles?: boolean;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

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
   * Profiles may follow at most this many accounts.
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
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
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

export interface UserRetrieveShadowbanParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Recent posts to read for the timeline, engagement & reply checks. The read stops
   * at this count, at the end of the timeline or after about 40 seconds.
   */
  limit?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface UserRetrieveSimilarParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

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
   * Profiles may follow at most this many accounts.
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
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Profiles to request from this page (1-200, default 200). Source, filters or
   * credits can return fewer. Follow next_cursor for more pages. Aliases: limit,
   * count, max_results, maxItems, max_items & per_page.
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

export interface UserRetrieveSubscriptionsParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

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
   * Profiles may follow at most this many accounts.
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
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Profiles to request from this page (1-200, default 200). Source, filters or
   * credits can return fewer. Follow next_cursor for more pages. Aliases: limit,
   * count, max_results, maxItems, max_items & per_page.
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

export interface UserRetrieveTweetsParams {
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
   * Keep only Tweets with this card type, such as poll2choice_text_only. Tweet
   * search checks each Tweet's card.
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
   * Cursor from the previous response. Existing unprefixed cursors keep legacy
   * standard behavior. Pages can be empty before more rows; follow next_cursor. Also
   * read as next_cursor, next_token, pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * X search no longer supports excludeSource. A Tweet search with it answers 424 &
   * charges nothing.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * X search no longer supports geocode. A Tweet search with it answers 424 &
   * charges nothing.
   */
  geocode?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Keep only posts whose photos show this. Send charts, screenshots, product_photos,
   * memes or people, or describe it in words, such as a rocket. AI-powered analysis
   * checks posts with photos X doesn't mark sensitive & keeps scores of 0.5 or more.
   * Other posts stay out at no charge. Each kept post costs 2 credits, the AI analysis
   * price, instead of the read price, & a post the filter drops costs nothing.
   * imageFilter states the cutoff & counts.
   */
  imageShows?: string;

  /**
   * Include each reply's parent tweet as parentTweet on the reply. A reply whose
   * parent X does not return comes without it. Search-only filters such as keywords
   * do not apply with it.
   */
  includeParentTweet?: boolean;

  /**
   * Include reply tweets unless replies specifies another mode.
   */
  includeReplies?: boolean;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Words the Tweets must match, in X search syntax.
   */
  keywords?: string;

  /**
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Search within a list ID.
   */
  listId?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
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
   * Filter media. Aliases: has_video, has_media.
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
   * @deprecated Use minLikes instead. The API still reads minFaves.
   */
  minFaves?: number;

  /**
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * Optional legacy pagination override. Search-only filters such as keywords apply
   * only without it.
   */
  mode?: 'standard';

  /**
   * Only return native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * Match a place name.
   */
  near?: string;

  /**
   * X no longer searches filter:news.
   */
  news?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Automatic pages accept 1-300 Tweets, standard pages 1-100. Default 20. Follow
   * next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

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
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
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
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * Inclusive ISO bound for Tweet creation time, such as 2026-09-25T19:20:41Z. Unix
   * seconds also work. A time without an offset is UTC.
   */
  sinceTime?: string;

  /**
   * X search no longer supports source. A Tweet search with it answers 424 & charges
   * nothing.
   */
  source?: string;

  /**
   * Keep only posts about this topic. AI-powered analysis asks "Is this post about
   * <topic>?" of each post & keeps scores of 0.5 or more. It reads post text & safe
   * photos. Each kept post costs 2 credits, the AI analysis price, instead of the read
   * price, & a post the filter drops costs nothing. limit counts checked posts, & only
   * kept posts come back. topicFilter states the cutoff & counts.
   */
  topic?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
   */
  untilDate?: string;

  /**
   * Exclusive ISO bound for Tweet creation time. Unix seconds also work. A time
   * without an offset is UTC.
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
   * X search no longer supports within. A Tweet search with it answers 424 & charges
   * nothing. Use near alone.
   */
  within?: string;

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface UserRetrieveVerifiedFollowersParams {
  /**
   * Legacy cursor alias. Prefer cursor.
   */
  after?: string;

  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Cursor from the previous response. Existing unprefixed cursors keep legacy
   * standard behavior. Pages can be empty before more rows; follow next_cursor. Also
   * read as next_cursor, next_token, pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Add each row's full profile, as GET /x/users/{id} returns it. Pages take several
   * seconds longer.
   */
  enrichProfiles?: boolean;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

  /**
   * Only return profiles with a location.
   */
  hasLocation?: boolean;

  /**
   * Only return profiles with a website.
   */
  hasWebsite?: boolean;

  /**
   * Legacy page-size alias outside coverage mode. Coverage accepts 1-10000. Prefer
   * pageSize.
   */
  limit?: number;

  /**
   * Match a location substring, ignoring case.
   */
  locationContains?: string;

  /**
   * Maximum follower count. Missing counts pass this maximum.
   */
  maxFollowers?: number;

  /**
   * Profiles may follow at most this many accounts.
   */
  maxFollowing?: number;

  /**
   * Most profiles 1 request reads, kept or dropped by the filters. A filter that
   * keeps few profiles reads up to 65 s a request without it. The request then
   * answers the profiles it kept, the count it dropped & the cursor to read on. Each
   * request of a cursor may send its own value. Automatic mode only.
   */
  maxScan?: number;

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
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Omit mode for resumable maximum coverage. Standard keeps legacy pagination.
   * Coverage returns diagnostics once and rejects cursors.
   */
  mode?: 'standard' | 'coverage';

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Up to 300 user profiles in automatic mode, 200 in standard. Sources can return
   * fewer. Follow next_cursor for more pages. Aliases: limit, count, max_results,
   * maxItems, max_items & per_page.
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

export interface UserTranslateBioParams {
  /**
   * Language code to translate into, such as `es`, `tr`, `pt-br`, or `zh-tw`. Upper
   * and lower case both work.
   */
  language: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

Users.Block = Block;
Users.Follow = Follow;
Users.Mute = Mute;

export declare namespace Users {
  export {
    type UserRemoveFollowerResponse as UserRemoveFollowerResponse,
    type UserRetrieveBatchResponse as UserRetrieveBatchResponse,
    type UserRetrieveBatchTweetsResponse as UserRetrieveBatchTweetsResponse,
    type UserRetrieveFollowerAuditResponse as UserRetrieveFollowerAuditResponse,
    type FollowerAudit as FollowerAudit,
    type AuditedFollower as AuditedFollower,
    type FollowerClass as FollowerClass,
    type FollowerValueCount as FollowerValueCount,
    type UserRetrieveFollowerIDsResponse as UserRetrieveFollowerIDsResponse,
    type UserRetrieveFollowersResponse as UserRetrieveFollowersResponse,
    type UserRetrieveFollowingResponse as UserRetrieveFollowingResponse,
    type UserRetrieveFollowingIDsResponse as UserRetrieveFollowingIDsResponse,
    type UserRetrieveInsightsResponse as UserRetrieveInsightsResponse,
    type UserRetrieveListMembershipsResponse as UserRetrieveListMembershipsResponse,
    type UserRetrieveListsResponse as UserRetrieveListsResponse,
    type UserRetrieveLiveResponse as UserRetrieveLiveResponse,
    type ShadowbanReport as ShadowbanReport,
    type ShadowbanVerdict as ShadowbanVerdict,
    type UserRetrieveVerifiedFollowersResponse as UserRetrieveVerifiedFollowersResponse,
    type UserTranslateBioResponse as UserTranslateBioResponse,
    type UserRetrieveParams as UserRetrieveParams,
    type UserRemoveFollowerParams as UserRemoveFollowerParams,
    type UserRetrieveAffiliatesParams as UserRetrieveAffiliatesParams,
    type UserRetrieveArticlesParams as UserRetrieveArticlesParams,
    type UserRetrieveBatchParams as UserRetrieveBatchParams,
    type UserRetrieveBatchTweetsParams as UserRetrieveBatchTweetsParams,
    type UserRetrieveFollowerAuditParams as UserRetrieveFollowerAuditParams,
    type UserRetrieveFollowerIDsParams as UserRetrieveFollowerIDsParams,
    type UserRetrieveFollowersParams as UserRetrieveFollowersParams,
    type UserRetrieveFollowersYouKnowParams as UserRetrieveFollowersYouKnowParams,
    type UserRetrieveFollowingParams as UserRetrieveFollowingParams,
    type UserRetrieveFollowingIDsParams as UserRetrieveFollowingIDsParams,
    type UserRetrieveHighlightsParams as UserRetrieveHighlightsParams,
    type UserRetrieveInsightsParams as UserRetrieveInsightsParams,
    type UserRetrieveLikesParams as UserRetrieveLikesParams,
    type UserRetrieveListMembershipsParams as UserRetrieveListMembershipsParams,
    type UserRetrieveListsParams as UserRetrieveListsParams,
    type UserRetrieveLiveParams as UserRetrieveLiveParams,
    type UserRetrieveMediaParams as UserRetrieveMediaParams,
    type UserRetrieveMentionsParams as UserRetrieveMentionsParams,
    type UserRetrieveRepliesParams as UserRetrieveRepliesParams,
    type UserRetrieveSearchParams as UserRetrieveSearchParams,
    type UserRetrieveShadowbanParams as UserRetrieveShadowbanParams,
    type UserRetrieveSimilarParams as UserRetrieveSimilarParams,
    type UserRetrieveSubscriptionsParams as UserRetrieveSubscriptionsParams,
    type UserRetrieveTweetsParams as UserRetrieveTweetsParams,
    type UserRetrieveVerifiedFollowersParams as UserRetrieveVerifiedFollowersParams,
    type UserTranslateBioParams as UserTranslateBioParams,
  };

  export {
    Block as Block,
    type BlockCreateResponse as BlockCreateResponse,
    type BlockDeleteResponse as BlockDeleteResponse,
    type BlockCreateParams as BlockCreateParams,
    type BlockDeleteParams as BlockDeleteParams,
  };

  export {
    Follow as Follow,
    type FollowCreateResponse as FollowCreateResponse,
    type FollowDeleteAllResponse as FollowDeleteAllResponse,
    type FollowCreateParams as FollowCreateParams,
    type FollowDeleteAllParams as FollowDeleteAllParams,
  };

  export {
    Mute as Mute,
    type MuteCreateResponse as MuteCreateResponse,
    type MuteDeleteResponse as MuteDeleteResponse,
    type MuteCreateParams as MuteCreateParams,
    type MuteDeleteParams as MuteDeleteParams,
  };
}
