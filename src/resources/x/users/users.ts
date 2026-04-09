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
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X data lookups (subscription required)
 */
export class Users extends APIResource {
  follow: FollowAPI.Follow = new FollowAPI.Follow(this._client);

  /**
   * Look up X user
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
   * Get multiple users by IDs
   *
   * @example
   * ```ts
   * const paginatedUsers = await client.x.users.retrieveBatch({
   *   ids: 'ids',
   * });
   * ```
   */
  retrieveBatch(query: UserRetrieveBatchParams, options?: RequestOptions): APIPromise<Shared.PaginatedUsers> {
    return this._client.get('/x/users/batch', { query, ...options });
  }

  /**
   * Get user followers
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.users.retrieveFollowers('id');
   * ```
   */
  retrieveFollowers(
    id: string,
    query: UserRetrieveFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/followers`, { query, ...options });
  }

  /**
   * Get followers you know for a user
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
   * Get users this user follows
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.users.retrieveFollowing('id');
   * ```
   */
  retrieveFollowing(
    id: string,
    query: UserRetrieveFollowingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/following`, { query, ...options });
  }

  /**
   * Get tweets liked by a user
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
   * Get media tweets by a user
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
   * Get tweets mentioning a user
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
   * Get recent tweets by a user
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
   * Get verified followers
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.users.retrieveVerifiedFollowers('id');
   * ```
   */
  retrieveVerifiedFollowers(
    id: string,
    query: UserRetrieveVerifiedFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/verified-followers`, { query, ...options });
  }
}

export interface UserRetrieveBatchParams {
  /**
   * Comma-separated user IDs (max 100)
   */
  ids: string;
}

export interface UserRetrieveFollowersParams {
  /**
   * Pagination cursor for followers list
   */
  cursor?: string;

  /**
   * Items per page (20-200, default 200)
   */
  pageSize?: number;
}

export interface UserRetrieveFollowersYouKnowParams {
  /**
   * Pagination cursor for followers-you-know
   */
  cursor?: string;
}

export interface UserRetrieveFollowingParams {
  /**
   * Pagination cursor for following list
   */
  cursor?: string;

  /**
   * Results per page (20-200, default 200)
   */
  pageSize?: number;
}

export interface UserRetrieveLikesParams {
  /**
   * Pagination cursor for liked tweets
   */
  cursor?: string;
}

export interface UserRetrieveMediaParams {
  /**
   * Pagination cursor for media tweets
   */
  cursor?: string;
}

export interface UserRetrieveMentionsParams {
  /**
   * Pagination cursor for mentions
   */
  cursor?: string;

  /**
   * Unix timestamp - return mentions after this time
   */
  sinceTime?: string;

  /**
   * Unix timestamp - return mentions before this time
   */
  untilTime?: string;
}

export interface UserRetrieveSearchParams {
  /**
   * User search query
   */
  q: string;

  /**
   * Pagination cursor for user search
   */
  cursor?: string;
}

export interface UserRetrieveTweetsParams {
  /**
   * Pagination cursor for user tweets
   */
  cursor?: string;

  /**
   * Include parent tweet for replies
   */
  includeParentTweet?: boolean;

  /**
   * Include reply tweets
   */
  includeReplies?: boolean;
}

export interface UserRetrieveVerifiedFollowersParams {
  /**
   * Pagination cursor for verified followers
   */
  cursor?: string;
}

Users.Follow = Follow;

export declare namespace Users {
  export {
    type UserRetrieveBatchParams as UserRetrieveBatchParams,
    type UserRetrieveFollowersParams as UserRetrieveFollowersParams,
    type UserRetrieveFollowersYouKnowParams as UserRetrieveFollowersYouKnowParams,
    type UserRetrieveFollowingParams as UserRetrieveFollowingParams,
    type UserRetrieveLikesParams as UserRetrieveLikesParams,
    type UserRetrieveMediaParams as UserRetrieveMediaParams,
    type UserRetrieveMentionsParams as UserRetrieveMentionsParams,
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
