// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as Shared from '../../shared';
import * as FollowAPI from './follow';
import {
  Follow,
  FollowCreateParams,
  FollowCreateResponse,
  FollowDeleteAllParams,
  FollowDeleteAllResponse,
} from './follow';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Users extends APIResource {
  follow: FollowAPI.Follow = new FollowAPI.Follow(this._client);

  /**
   * Get user profile with follower counts and verification
   *
   * @example
   * ```ts
   * const userProfile = await client.x.users.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<Shared.UserProfile> {
    return this._client.get(path`/x/users/${id}`, options);
  }

  /**
   * Remove follower
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
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post(path`/x/users/${id}/remove-follower`, {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
    });
  }

  /**
   * Look up multiple users by IDs in one call
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveBatch({
   *   ids: 'ids',
   * });
   * ```
   */
  retrieveBatch(
    query: UserRetrieveBatchParams,
    options?: RequestOptions,
  ): APIPromise<UserRetrieveBatchResponse> {
    return this._client.get('/x/users/batch', { query, ...options });
  }

  /**
   * List followers of a user
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
   * List mutual followers between you and a user
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
   * List accounts a user follows
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
   * List tweets liked by a user
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
   * List media tweets posted by a user
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
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/media`, { query, ...options });
  }

  /**
   * List tweets mentioning a user
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
   * Returns target-authored posts and replies. Omit mode for automatic maximum
   * coverage. Pass next_cursor unchanged. Unprefixed cursors stay legacy. Excludes
   * other-author context.
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
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/replies`, { query, ...options });
  }

  /**
   * Search users by name or username
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
   * Omit mode for automatic maximum coverage. Pass next_cursor unchanged. Unprefixed
   * cursors use legacy pagination. Shape and billing stay the same.
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
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/tweets`, { query, ...options });
  }

  /**
   * List verified followers of a user
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
}

/**
 * Durable write lifecycle record. Poll statusUrl until terminal is true. Reusing
 * the original Idempotency-Key returns this same record. Submit a new write only
 * when safeToRetry is true, using a new key.
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
 * Batch user lookup results. Duplicate requested IDs are ignored while preserving
 * first-seen order. unavailable_ids identifies processed IDs with no returned
 * profile. unprocessed_ids identifies IDs skipped when the available usage balance limited
 * processing.
 */
export interface UserRetrieveBatchResponse {
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
   * Processed IDs with no returned profile, in first-seen request order.
   */
  unavailable_ids: Array<string>;

  /**
   * Requested IDs skipped because the available usage balance limited processing. Retry these
   * IDs after adding balance.
   */
  unprocessed_ids: Array<string>;

  users: Array<Shared.UserProfile>;
}

/**
 * Paginated user profiles. No-mode follower, following, and verified follower
 * requests merge independent views automatically. Response fields, page size,
 * aliases, filters, and per-returned-profile billing stay unchanged. Existing
 * unprefixed cursors retain legacy behavior. Follow next_cursor while
 * has_next_page is true.
 */
export type UserRetrieveFollowersResponse =
  | Shared.PaginatedUsers
  | UserRetrieveFollowersResponse.UserListCoverageResponse;

export namespace UserRetrieveFollowersResponse {
  /**
   * Paginated user profiles. No-mode follower, following, and verified follower
   * requests merge independent views automatically. Response fields, page size,
   * aliases, filters, and per-returned-profile billing stay unchanged. Existing
   * unprefixed cursors retain legacy behavior. Follow next_cursor while
   * has_next_page is true.
   */
  export interface UserListCoverageResponse
    extends Omit<Shared.PaginatedUsers, 'has_next_page' | 'next_cursor'> {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    diagnostic: UserListCoverageResponse.Diagnostic;

    has_next_page?: false;

    next_cursor?: '';
  }

  export namespace UserListCoverageResponse {
    /**
     * Coverage evidence across parallel relationship strategies.
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
       * Whether credits or the requested limit reduced output.
       */
      responseTruncated: boolean;

      resultLimitReached: boolean;

      returnedUsers: number;

      stalledStrategyCount: number;

      strategies: Array<Diagnostic.Strategy>;

      strategyCount: number;

      uniqueUsers: number;
    }

    export namespace Diagnostic {
      export interface Strategy {
        duplicateCount: number;

        pagesFetched: number;

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
      }
    }
  }
}

/**
 * Paginated user profiles. No-mode follower, following, and verified follower
 * requests merge independent views automatically. Response fields, page size,
 * aliases, filters, and per-returned-profile billing stay unchanged. Existing
 * unprefixed cursors retain legacy behavior. Follow next_cursor while
 * has_next_page is true.
 */
export type UserRetrieveFollowingResponse =
  | Shared.PaginatedUsers
  | UserRetrieveFollowingResponse.UserListCoverageResponse;

export namespace UserRetrieveFollowingResponse {
  /**
   * Paginated user profiles. No-mode follower, following, and verified follower
   * requests merge independent views automatically. Response fields, page size,
   * aliases, filters, and per-returned-profile billing stay unchanged. Existing
   * unprefixed cursors retain legacy behavior. Follow next_cursor while
   * has_next_page is true.
   */
  export interface UserListCoverageResponse
    extends Omit<Shared.PaginatedUsers, 'has_next_page' | 'next_cursor'> {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    diagnostic: UserListCoverageResponse.Diagnostic;

    has_next_page?: false;

    next_cursor?: '';
  }

  export namespace UserListCoverageResponse {
    /**
     * Coverage evidence across parallel relationship strategies.
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
       * Whether credits or the requested limit reduced output.
       */
      responseTruncated: boolean;

      resultLimitReached: boolean;

      returnedUsers: number;

      stalledStrategyCount: number;

      strategies: Array<Diagnostic.Strategy>;

      strategyCount: number;

      uniqueUsers: number;
    }

    export namespace Diagnostic {
      export interface Strategy {
        duplicateCount: number;

        pagesFetched: number;

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
      }
    }
  }
}

/**
 * Paginated user profiles. No-mode follower, following, and verified follower
 * requests merge independent views automatically. Response fields, page size,
 * aliases, filters, and per-returned-profile billing stay unchanged. Existing
 * unprefixed cursors retain legacy behavior. Follow next_cursor while
 * has_next_page is true.
 */
export type UserRetrieveVerifiedFollowersResponse =
  | Shared.PaginatedUsers
  | UserRetrieveVerifiedFollowersResponse.UserListCoverageResponse;

export namespace UserRetrieveVerifiedFollowersResponse {
  /**
   * Paginated user profiles. No-mode follower, following, and verified follower
   * requests merge independent views automatically. Response fields, page size,
   * aliases, filters, and per-returned-profile billing stay unchanged. Existing
   * unprefixed cursors retain legacy behavior. Follow next_cursor while
   * has_next_page is true.
   */
  export interface UserListCoverageResponse
    extends Omit<Shared.PaginatedUsers, 'has_next_page' | 'next_cursor'> {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    diagnostic: UserListCoverageResponse.Diagnostic;

    has_next_page?: false;

    next_cursor?: '';
  }

  export namespace UserListCoverageResponse {
    /**
     * Coverage evidence across parallel relationship strategies.
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
       * Whether credits or the requested limit reduced output.
       */
      responseTruncated: boolean;

      resultLimitReached: boolean;

      returnedUsers: number;

      stalledStrategyCount: number;

      strategies: Array<Diagnostic.Strategy>;

      strategyCount: number;

      uniqueUsers: number;
    }

    export namespace Diagnostic {
      export interface Strategy {
        duplicateCount: number;

        pagesFetched: number;

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
      }
    }
  }
}

export interface UserRemoveFollowerParams {
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

export interface UserRetrieveBatchParams {
  /**
   * Comma-separated numeric user IDs (1-100 values). Duplicate IDs are ignored while
   * preserving first-seen order.
   */
  ids: string;
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
   * Cursor from the previous response. Xquik cursors resume automatic coverage.
   * Existing unprefixed cursors keep legacy standard behavior.
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
   * Legacy page-size alias outside explicit coverage mode. Coverage accepts 1-10000.
   * Prefer pageSize.
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
   * Omit mode for resumable maximum coverage. Standard keeps legacy pagination.
   * Coverage returns diagnostics once and rejects cursors.
   */
  mode?: 'standard' | 'coverage';

  /**
   * Maximum user profiles: automatic 300; standard 200. Sources return fewer
   * profiles. Continue with has_next_page.
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
   * Pagination cursor for followers-you-know
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

export interface UserRetrieveFollowingParams {
  /**
   * Deprecated following cursor alias. Prefer cursor.
   */
  after?: string;

  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Cursor from the previous response. Xquik cursors resume automatic coverage.
   * Existing unprefixed cursors keep legacy standard behavior.
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
   * Legacy page-size alias outside explicit coverage mode. Coverage accepts 1-10000.
   * Prefer pageSize.
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
   * Omit mode for resumable maximum coverage. Standard keeps legacy pagination.
   * Coverage returns diagnostics once and rejects cursors.
   */
  mode?: 'standard' | 'coverage';

  /**
   * Maximum user profiles: automatic 300; standard 200. Sources return fewer
   * profiles. Continue with has_next_page.
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
   * Pagination cursor for liked tweets
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
   * Pagination cursor for media tweets
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
   * Pagination cursor for mentions
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
   * Unix timestamp - return mentions after this time
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
   * Unix timestamp - return mentions before this time
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

export interface UserRetrieveRepliesParams {
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
   * Include each reply's parent tweet.
   */
  includeParentTweet?: boolean;

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
   * Start date in YYYY-MM-DD format.
   */
  sinceDate?: string;

  /**
   * Return Tweets newer than this Tweet ID.
   */
  sinceId?: string;

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
   * Pagination cursor for user search
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
   * Include parent tweet for replies
   */
  includeParentTweet?: boolean;

  /**
   * Include reply tweets
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
   * Start date in YYYY-MM-DD format.
   */
  sinceDate?: string;

  /**
   * Return Tweets newer than this Tweet ID.
   */
  sinceId?: string;

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
   * Cursor from the previous response. Xquik cursors resume automatic coverage.
   * Existing unprefixed cursors keep legacy standard behavior.
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
   * Legacy page-size alias outside explicit coverage mode. Coverage accepts 1-10000.
   * Prefer pageSize.
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
   * Omit mode for resumable maximum coverage. Standard keeps legacy pagination.
   * Coverage returns diagnostics once and rejects cursors.
   */
  mode?: 'standard' | 'coverage';

  /**
   * Maximum user profiles: automatic 300; standard 200. Sources return fewer
   * profiles. Continue with has_next_page.
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

Users.Follow = Follow;

export declare namespace Users {
  export {
    type UserRemoveFollowerResponse as UserRemoveFollowerResponse,
    type UserRetrieveBatchResponse as UserRetrieveBatchResponse,
    type UserRetrieveFollowersResponse as UserRetrieveFollowersResponse,
    type UserRetrieveFollowingResponse as UserRetrieveFollowingResponse,
    type UserRetrieveVerifiedFollowersResponse as UserRetrieveVerifiedFollowersResponse,
    type UserRemoveFollowerParams as UserRemoveFollowerParams,
    type UserRetrieveBatchParams as UserRetrieveBatchParams,
    type UserRetrieveFollowersParams as UserRetrieveFollowersParams,
    type UserRetrieveFollowersYouKnowParams as UserRetrieveFollowersYouKnowParams,
    type UserRetrieveFollowingParams as UserRetrieveFollowingParams,
    type UserRetrieveLikesParams as UserRetrieveLikesParams,
    type UserRetrieveMediaParams as UserRetrieveMediaParams,
    type UserRetrieveMentionsParams as UserRetrieveMentionsParams,
    type UserRetrieveRepliesParams as UserRetrieveRepliesParams,
    type UserRetrieveSearchParams as UserRetrieveSearchParams,
    type UserRetrieveTweetsParams as UserRetrieveTweetsParams,
    type UserRetrieveVerifiedFollowersParams as UserRetrieveVerifiedFollowersParams,
  };

  export {
    Follow as Follow,
    type FollowCreateResponse as FollowCreateResponse,
    type FollowDeleteAllResponse as FollowDeleteAllResponse,
    type FollowCreateParams as FollowCreateParams,
    type FollowDeleteAllParams as FollowDeleteAllParams,
  };
}
