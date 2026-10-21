// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

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
import * as MediaAPI from './media';
import { Media, MediaListParams } from './media';
import * as TweetsAPI from './tweets';
import { TweetListByCommunityParams, TweetListParams, Tweets } from './tweets';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Communities extends APIResource {
  join: JoinAPI.Join = new JoinAPI.Join(this._client);
  tweets: TweetsAPI.Tweets = new TweetsAPI.Tweets(this._client);
  media: MediaAPI.Media = new MediaAPI.Media(this._client);

  /**
   * Creates an X Community through a connected account.
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
   * Deletes an owned X Community through a connected account.
   *
   * @example
   * ```ts
   * const community = await client.x.communities.delete(
   *   '1500000000000000000',
   *   {
   *     account: '@elonmusk',
   *     community_name: 'Tesla Fans',
   *     'Idempotency-Key': 'Idempotency-Key',
   *   },
   * );
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
   * Returns the communities X finds for a keyword, in X's order. Each community
   * costs 1 credit. To search the tweets in Communities, use /x/communities/search.
   *
   * @example
   * ```ts
   * const communityPage = await client.x.communities.find({
   *   q: 'q',
   * });
   * ```
   */
  find(query: CommunityFindParams, options?: RequestOptions): APIPromise<Shared.CommunityPage> {
    return this._client.get('/x/communities/find', { query, ...options });
  }

  /**
   * Returns the communities X ranks highest under a topic or subtopic. Name it by
   * topicId or by topic name from /x/communities/topics. Each community costs 1
   * credit. A missing or unknown topic returns invalid_community_topic & lists the
   * topic names.
   *
   * @example
   * ```ts
   * const communityPage =
   *   await client.x.communities.listPopular();
   * ```
   */
  listPopular(
    query: CommunityListPopularParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.CommunityPage> {
    return this._client.get('/x/communities/popular', { query, ...options });
  }

  /**
   * Returns the communities X suggests, with their full public fields. X picks them
   * per request, so 2 calls can differ. If X suggests none, Xquik asks up to 2 more
   * times. An empty list is free. Each community costs 1 credit.
   *
   * @example
   * ```ts
   * const response = await client.x.communities.listSuggested();
   * ```
   */
  listSuggested(
    query: CommunityListSuggestedParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CommunityListSuggestedResponse> {
    return this._client.get('/x/communities/suggested', { query, ...options });
  }

  /**
   * Returns the community topics with their subtopics. Pass an ID as topicId, or a
   * name as topic, to /x/communities/popular. Each top-level topic costs 1 credit,
   * its subtopics included.
   *
   * @example
   * ```ts
   * const response = await client.x.communities.listTopics();
   * ```
   */
  listTopics(
    query: CommunityListTopicsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CommunityListTopicsResponse> {
    return this._client.get('/x/communities/topics', { query, ...options });
  }

  /**
   * Returns community activity for X's latest period. Includes likes, new members,
   * posts, replies & unique posters. Each metric has a count and a changePercent.
   * Each request costs 1 credit.
   *
   * @example
   * ```ts
   * const communityAnalytics =
   *   await client.x.communities.retrieveAnalytics('id');
   * ```
   */
  retrieveAnalytics(
    id: string,
    query: CommunityRetrieveAnalyticsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CommunityAnalytics> {
    return this._client.get(path`/x/communities/${id}/analytics`, { query, ...options });
  }

  /**
   * Returns one community's public identity, rules, join question, search tags,
   * membership counts, and the profiles of its creator, admin and previewed members.
   *
   * @example
   * ```ts
   * const response = await client.x.communities.retrieveInfo(
   *   'id',
   * );
   * ```
   */
  retrieveInfo(
    id: string,
    query: CommunityRetrieveInfoParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CommunityRetrieveInfoResponse> {
    return this._client.get(path`/x/communities/${id}/info`, { query, ...options });
  }

  /**
   * Returns public member profiles for one community.
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
   * Returns public moderator profiles for one community.
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
   * Returns one tweet page, not community records. Add communityId to search 1
   * Community, or leave it out to search every Community. To find communities by
   * keyword, use /x/communities/find.
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.communities.retrieveSearch({ q: 'q' });
   * ```
   */
  retrieveSearch(
    query: CommunityRetrieveSearchParams,
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/communities/search', { query, ...options });
  }

  /**
   * Finds a community's members by name or username, as the search box on X's
   * members page does. X checks up to 10 accounts that match, & the answer holds the
   * members among them, each with its role. Each member costs 1 credit. An answer
   * without members is free.
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.communities.searchMembers('id', {
   *     q: 'q',
   *   });
   * ```
   */
  searchMembers(
    id: string,
    query: CommunitySearchMembersParams,
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/communities/${id}/members/search`, { query, ...options });
  }
}

/**
 * Community activity & growth for X's latest period.
 */
export interface CommunityAnalytics {
  /**
   * The community ID from your request.
   */
  id: string;

  /**
   * The period's activity, each metric with its count and changePercent. likes
   * counts likes on community posts and newMembers the accounts that joined. posts
   * counts the community posts and replies the replies to them. uniquePosters counts
   * the distinct accounts that posted.
   */
  metrics: CommunityAnalytics.Metrics;

  /**
   * The end of X's latest period, in UTC.
   */
  periodEndsAt: string;
}

export namespace CommunityAnalytics {
  /**
   * The period's activity, each metric with its count and changePercent. likes
   * counts likes on community posts and newMembers the accounts that joined. posts
   * counts the community posts and replies the replies to them. uniquePosters counts
   * the distinct accounts that posted.
   */
  export interface Metrics {
    /**
     * A community metric for X's latest period & its percent change.
     */
    likes: CommunityAnalyticsMetric;

    /**
     * A community metric for X's latest period & its percent change.
     */
    newMembers: CommunityAnalyticsMetric;

    /**
     * A community metric for X's latest period & its percent change.
     */
    posts: CommunityAnalyticsMetric;

    /**
     * A community metric for X's latest period & its percent change.
     */
    replies: CommunityAnalyticsMetric;

    /**
     * A community metric for X's latest period & its percent change.
     */
    uniquePosters: CommunityAnalyticsMetric;
  }
}

/**
 * A community metric for X's latest period & its percent change.
 */
export interface CommunityAnalyticsMetric {
  /**
   * Change in percent from the same figure 1 day earlier. Values stay unrounded.
   */
  changePercent: number;

  /**
   * Total for this metric during X's latest period.
   */
  count: number;
}

/**
 * Durable write record. Poll statusUrl until terminal is true. Reusing its
 * Idempotency-Key returns this record. Create another action only when safeToRetry
 * is true.
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
 * Durable write record. Poll statusUrl until terminal is true. Reusing its
 * Idempotency-Key returns this record. Create another action only when safeToRetry
 * is true.
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

export interface CommunityListSuggestedResponse {
  /**
   * Suggested communities in X's order
   */
  communities: Array<Shared.Community>;

  /**
   * Communities returned & charged
   */
  count: number;

  /**
   * What to do next. Present only when X suggests none.
   */
  message?: string;
}

export interface CommunityListTopicsResponse {
  /**
   * Top-level topics returned & charged
   */
  count: number;

  /**
   * Topics in X's order
   */
  topics: Array<Shared.CommunityTopic>;

  /**
   * What to do next. Present only when X lists no topic.
   */
  message?: string;
}

export interface CommunityRetrieveInfoResponse {
  /**
   * Public X Community, as every Community read returns it.
   */
  community: Shared.Community;
}

export interface CommunityCreateParams {
  /**
   * Body param: X account (@username or ID) creating the community
   */
  account: string;

  /**
   * Body param: Community name, 1 to 100 characters, as X takes it
   */
  name: string;

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
   * Header param: Use one unique value per intended write. Reuse it only for an
   * identical retry. A matching retry returns the first answer again, with
   * idempotent: true added. It keeps the first status, body & Retry-After. It sends
   * nothing to X & charges nothing. While the first request runs, a retry returns
   * 202 & the action. Different input returns 409. Protection lasts at least 90
   * days.
   */
  'Idempotency-Key': string;
}

export interface CommunityFindParams {
  /**
   * Keyword to find communities by, such as ai. Alias query.
   */
  q: string;

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

export interface CommunityListPopularParams {
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

  /**
   * Topic or subtopic name in any case, such as technology. Send this or topicId.
   */
  topic?: string;

  /**
   * Topic or subtopic ID from /x/communities/topics, such as 301. Wins over topic.
   */
  topicId?: string;
}

export interface CommunityListSuggestedParams {
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
   * Maximum communities to return. Omit it for every suggestion. Credits can return
   * fewer. Aliases pageSize, count, max_results, maxItems, max_items & per_page.
   */
  limit?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface CommunityListTopicsParams {
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
   * Maximum topics to return. Omit it for every topic. Credits can return fewer.
   * Aliases pageSize, count, max_results, maxItems, max_items & per_page.
   */
  limit?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface CommunityRetrieveAnalyticsParams {
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

export interface CommunityRetrieveInfoParams {
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

export interface CommunityRetrieveMembersParams {
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
   * Maximum user profiles per page (1-200, default 20).
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

export interface CommunityRetrieveModeratorsParams {
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

export interface CommunityRetrieveSearchParams {
  /**
   * Search query
   */
  q: string;

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
   * Numeric ID of the Community whose posts to search. Leave it out to search posts
   * across every Community.
   */
  communityId?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Pagination cursor for community search. Also read as next_cursor, next_token,
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
   * Sort order (Latest or Top)
   */
  queryType?: 'Latest' | 'Top';

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

export interface CommunitySearchMembersParams {
  /**
   * Name or username to find members by, such as marckohlbrugge. A leading @ is
   * dropped. Alias query.
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

Communities.Join = Join;
Communities.Tweets = Tweets;
Communities.Media = Media;

export declare namespace Communities {
  export {
    type CommunityAnalytics as CommunityAnalytics,
    type CommunityAnalyticsMetric as CommunityAnalyticsMetric,
    type CommunityCreateResponse as CommunityCreateResponse,
    type CommunityDeleteResponse as CommunityDeleteResponse,
    type CommunityListSuggestedResponse as CommunityListSuggestedResponse,
    type CommunityListTopicsResponse as CommunityListTopicsResponse,
    type CommunityRetrieveInfoResponse as CommunityRetrieveInfoResponse,
    type CommunityCreateParams as CommunityCreateParams,
    type CommunityDeleteParams as CommunityDeleteParams,
    type CommunityFindParams as CommunityFindParams,
    type CommunityListPopularParams as CommunityListPopularParams,
    type CommunityListSuggestedParams as CommunityListSuggestedParams,
    type CommunityListTopicsParams as CommunityListTopicsParams,
    type CommunityRetrieveAnalyticsParams as CommunityRetrieveAnalyticsParams,
    type CommunityRetrieveInfoParams as CommunityRetrieveInfoParams,
    type CommunityRetrieveMembersParams as CommunityRetrieveMembersParams,
    type CommunityRetrieveModeratorsParams as CommunityRetrieveModeratorsParams,
    type CommunityRetrieveSearchParams as CommunityRetrieveSearchParams,
    type CommunitySearchMembersParams as CommunitySearchMembersParams,
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

  export { Media as Media, type MediaListParams as MediaListParams };
}
