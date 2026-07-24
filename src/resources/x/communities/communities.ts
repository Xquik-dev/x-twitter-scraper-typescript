// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as Shared from '../../shared';
import * as JoinAPI from './join';
import {
  Join,
  JoinCreateParams,
  JoinCreateResponse,
  JoinDeleteAllParams,
  JoinDeleteAllResponse,
} from './join';
import * as TweetsAPI from './tweets';
import { TweetListByCommunityParams, TweetListParams, Tweets } from './tweets';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Communities extends APIResource {
  join: JoinAPI.Join = new JoinAPI.Join(this._client);
  tweets: TweetsAPI.Tweets = new TweetsAPI.Tweets(this._client);

  /**
   * Create community
   *
   * @example
   * ```ts
   * const community = await client.x.communities.create({
   *   account: '@elonmusk',
   *   name: 'Example Name',
   *   'Idempotency-Key': 'Idempotency-Key',
   *   description: 'A community for Tesla enthusiasts',
   * });
   * ```
   */
  create(params: CommunityCreateParams, options?: RequestOptions): APIPromise<CommunityCreateResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post('/x/communities', {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
    });
  }

  /**
   * Delete community
   *
   * @example
   * ```ts
   * const community = await client.x.communities.delete('id', {
   *   account: '@elonmusk',
   *   community_name: 'Tesla Fans',
   *   'Idempotency-Key': 'Idempotency-Key',
   * });
   * ```
   */
  delete(
    id: string,
    params: CommunityDeleteParams,
    options?: RequestOptions,
  ): APIPromise<CommunityDeleteResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.delete(path`/x/communities/${id}`, {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
    });
  }

  /**
   * Get community name, description and member count
   *
   * @example
   * ```ts
   * const response = await client.x.communities.retrieveInfo(
   *   'id',
   * );
   * ```
   */
  retrieveInfo(id: string, options?: RequestOptions): APIPromise<CommunityRetrieveInfoResponse> {
    return this._client.get(path`/x/communities/${id}/info`, options);
  }

  /**
   * List members of a community
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.communities.retrieveMembers('id');
   * ```
   */
  retrieveMembers(
    id: string,
    query: CommunityRetrieveMembersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/communities/${id}/members`, { query, ...options });
  }

  /**
   * List moderators of a community
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.communities.retrieveModerators('id');
   * ```
   */
  retrieveModerators(
    id: string,
    query: CommunityRetrieveModeratorsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/communities/${id}/moderators`, { query, ...options });
  }

  /**
   * Returns tweets, not community records. Requires a Community ID.
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.communities.retrieveSearch({
   *     communityId: '321669910225',
   *     q: 'q',
   *   });
   * ```
   */
  retrieveSearch(
    query: CommunityRetrieveSearchParams,
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/communities/search', { query, ...options });
  }
}

/**
 * Durable write lifecycle record. Poll statusUrl until terminal is true. Reusing
 * the original Idempotency-Key returns this same record. Submit a new write only
 * when safeToRetry is true, using a new key.
 */
export interface CommunityCreateResponse {
  id: string;

  /**
   * Connected account selected for the write.
   */
  account: CommunityCreateResponse.Account | null;

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
  billing: CommunityCreateResponse.Billing;

  charged: boolean;

  chargedCredits: string;

  /**
   * Exact follow-up an API client or agent should perform.
   */
  nextAction: CommunityCreateResponse.NextAction | null;

  object: 'x_write_action';

  pollAfterMs: number | null;

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  request: CommunityCreateResponse.Request;

  /**
   * Confirmed result produced by the write, when available.
   */
  result: CommunityCreateResponse.Result | null;

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
  target: CommunityCreateResponse.Target | null;

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

export namespace CommunityCreateResponse {
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
 * Durable write lifecycle record. Poll statusUrl until terminal is true. Reusing
 * the original Idempotency-Key returns this same record. Submit a new write only
 * when safeToRetry is true, using a new key.
 */
export interface CommunityDeleteResponse {
  id: string;

  /**
   * Connected account selected for the write.
   */
  account: CommunityDeleteResponse.Account | null;

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
  billing: CommunityDeleteResponse.Billing;

  charged: boolean;

  chargedCredits: string;

  /**
   * Exact follow-up an API client or agent should perform.
   */
  nextAction: CommunityDeleteResponse.NextAction | null;

  object: 'x_write_action';

  pollAfterMs: number | null;

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  request: CommunityDeleteResponse.Request;

  /**
   * Confirmed result produced by the write, when available.
   */
  result: CommunityDeleteResponse.Result | null;

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
  target: CommunityDeleteResponse.Target | null;

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

export namespace CommunityDeleteResponse {
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

export interface CommunityRetrieveInfoResponse {
  /**
   * Community info object
   */
  community: CommunityRetrieveInfoResponse.Community;
}

export namespace CommunityRetrieveInfoResponse {
  /**
   * Community info object
   */
  export interface Community {
    /**
     * Unique community identifier
     */
    id: string;

    /**
     * Community banner image URL
     */
    banner_url?: string;

    /**
     * Community creation timestamp
     */
    created_at?: string;

    creator?: Community.Creator;

    /**
     * About text for the community
     */
    description?: string;

    /**
     * Invitation policy
     */
    invites_policy?: string;

    /**
     * Whether the authenticated viewer is a member
     */
    is_member?: boolean;

    /**
     * Whether the community is marked sensitive
     */
    is_nsfw?: boolean;

    /**
     * Join policy (open or restricted)
     */
    join_policy?: string;

    /**
     * Total member count
     */
    member_count?: number;

    /**
     * Total moderator count
     */
    moderator_count?: number;

    /**
     * Display name of the community
     */
    name?: string;

    /**
     * Primary topic
     */
    primary_topic?: Community.PrimaryTopic;

    /**
     * Authenticated viewer's community role
     */
    role?: string;

    /**
     * Community rules
     */
    rules?: Array<Community.Rule>;
  }

  export namespace Community {
    export interface Creator {
      id: string;

      username: string;

      verified: boolean;

      name?: string;
    }

    /**
     * Primary topic
     */
    export interface PrimaryTopic {
      id?: string;

      name?: string;
    }

    export interface Rule {
      id?: string;

      description?: string;

      name?: string;
    }
  }
}

export interface CommunityCreateParams {
  /**
   * Body param: X account (@username or ID) creating the community
   */
  account: string;

  /**
   * Body param: Community name
   */
  name: string;

  /**
   * Header param: Generate one unique value for each intended write. Reuse it only
   * when retrying the exact same account, action, target, and payload. A reused key
   * returns the original action. Reusing it with different input returns 409. Replay
   * protection remains active for at least 90 days.
   */
  'Idempotency-Key': string;

  /**
   * Body param: Community description
   */
  description?: string;
}

export interface CommunityDeleteParams {
  /**
   * Body param: X account (@username or ID) deleting the community
   */
  account: string;

  /**
   * Body param: Community name for confirmation
   */
  community_name: string;

  /**
   * Header param: Generate one unique value for each intended write. Reuse it only
   * when retrying the exact same account, action, target, and payload. A reused key
   * returns the original action. Reusing it with different input returns 409. Replay
   * protection remains active for at least 90 days.
   */
  'Idempotency-Key': string;
}

export interface CommunityRetrieveMembersParams {
  /**
   * Pagination cursor
   */
  cursor?: string;

  /**
   * Items per page (20-200, default 20). This is an upper bound for paid
   * authenticated calls: available usage balance can reduce the returned page size, and
   * zero affordable results returns 402 insufficient_credits.
   */
  pageSize?: number;
}

export interface CommunityRetrieveModeratorsParams {
  /**
   * Pagination cursor for community moderators
   */
  cursor?: string;
}

export interface CommunityRetrieveSearchParams {
  /**
   * Numeric ID of the community whose posts to search
   */
  communityId: string;

  /**
   * Search query
   */
  q: string;

  /**
   * Pagination cursor for community search
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

  /**
   * Sort order (Latest or Top)
   */
  queryType?: 'Latest' | 'Top';
}

Communities.Join = Join;
Communities.Tweets = Tweets;

export declare namespace Communities {
  export {
    type CommunityCreateResponse as CommunityCreateResponse,
    type CommunityDeleteResponse as CommunityDeleteResponse,
    type CommunityRetrieveInfoResponse as CommunityRetrieveInfoResponse,
    type CommunityCreateParams as CommunityCreateParams,
    type CommunityDeleteParams as CommunityDeleteParams,
    type CommunityRetrieveMembersParams as CommunityRetrieveMembersParams,
    type CommunityRetrieveModeratorsParams as CommunityRetrieveModeratorsParams,
    type CommunityRetrieveSearchParams as CommunityRetrieveSearchParams,
  };

  export {
    Join as Join,
    type JoinCreateResponse as JoinCreateResponse,
    type JoinDeleteAllResponse as JoinDeleteAllResponse,
    type JoinCreateParams as JoinCreateParams,
    type JoinDeleteAllParams as JoinDeleteAllParams,
  };

  export {
    Tweets as Tweets,
    type TweetListParams as TweetListParams,
    type TweetListByCommunityParams as TweetListByCommunityParams,
  };
}
