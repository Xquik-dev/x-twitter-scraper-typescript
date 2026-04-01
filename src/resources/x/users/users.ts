// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
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

/**
 * X data lookups (subscription required)
 */
export class Users extends APIResource {
  follow: FollowAPI.Follow = new FollowAPI.Follow(this._client);

  /**
   * Look up X user
   */
  retrieve(username: string, options?: RequestOptions): APIPromise<UserRetrieveResponse> {
    return this._client.get(path`/x/users/${username}`, options);
  }

  /**
   * Get multiple users by IDs
   */
  retrieveBatch(query: UserRetrieveBatchParams, options?: RequestOptions): APIPromise<void> {
    return this._client.get('/x/users/batch', {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get user followers
   */
  retrieveFollowers(
    id: string,
    query: UserRetrieveFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.get(path`/x/users/${id}/followers`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get followers you know for a user
   */
  retrieveFollowersYouKnow(
    id: string,
    query: UserRetrieveFollowersYouKnowParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveFollowersYouKnowResponse> {
    return this._client.get(path`/x/users/${id}/followers-you-know`, { query, ...options });
  }

  /**
   * Get users this user follows
   */
  retrieveFollowing(
    id: string,
    query: UserRetrieveFollowingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.get(path`/x/users/${id}/following`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get tweets liked by a user
   */
  retrieveLikes(
    id: string,
    query: UserRetrieveLikesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveLikesResponse> {
    return this._client.get(path`/x/users/${id}/likes`, { query, ...options });
  }

  /**
   * Get media tweets by a user
   */
  retrieveMedia(
    id: string,
    query: UserRetrieveMediaParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveMediaResponse> {
    return this._client.get(path`/x/users/${id}/media`, { query, ...options });
  }

  /**
   * Get tweets mentioning a user
   */
  retrieveMentions(
    id: string,
    query: UserRetrieveMentionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.get(path`/x/users/${id}/mentions`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Search users by name or username
   */
  retrieveSearch(query: UserRetrieveSearchParams, options?: RequestOptions): APIPromise<void> {
    return this._client.get('/x/users/search', {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get recent tweets by a user
   */
  retrieveTweets(
    id: string,
    query: UserRetrieveTweetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveTweetsResponse> {
    return this._client.get(path`/x/users/${id}/tweets`, { query, ...options });
  }

  /**
   * Get verified followers
   */
  retrieveVerifiedFollowers(
    id: string,
    query: UserRetrieveVerifiedFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.get(path`/x/users/${id}/verified-followers`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface UserProfile {
  id: string;

  name: string;

  username: string;

  createdAt?: string;

  description?: string;

  followers?: number;

  following?: number;

  location?: string;

  profilePicture?: string;

  statusesCount?: number;

  verified?: boolean;
}

export interface UserRetrieveResponse {
  id: string;

  name: string;

  username: string;

  createdAt?: string;

  description?: string;

  followers?: number;

  following?: number;

  location?: string;

  profilePicture?: string;

  statusesCount?: number;

  verified?: boolean;
}

export interface UserRetrieveFollowersYouKnowResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UserRetrieveFollowersYouKnowResponse.User>;
}

export namespace UserRetrieveFollowersYouKnowResponse {
  export interface User {
    id: string;

    name: string;

    username: string;

    createdAt?: string;

    description?: string;

    followers?: number;

    following?: number;

    location?: string;

    profilePicture?: string;

    statusesCount?: number;

    verified?: boolean;
  }
}

export interface UserRetrieveLikesResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<UserRetrieveLikesResponse.Tweet>;
}

export namespace UserRetrieveLikesResponse {
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

    likeCount?: number;

    quoteCount?: number;

    replyCount?: number;

    retweetCount?: number;

    viewCount?: number;
  }

  export namespace Tweet {
    export interface Author {
      id: string;

      name: string;

      username: string;

      verified?: boolean;
    }
  }
}

export interface UserRetrieveMediaResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<UserRetrieveMediaResponse.Tweet>;
}

export namespace UserRetrieveMediaResponse {
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

    likeCount?: number;

    quoteCount?: number;

    replyCount?: number;

    retweetCount?: number;

    viewCount?: number;
  }

  export namespace Tweet {
    export interface Author {
      id: string;

      name: string;

      username: string;

      verified?: boolean;
    }
  }
}

export interface UserRetrieveTweetsResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<UserRetrieveTweetsResponse.Tweet>;
}

export namespace UserRetrieveTweetsResponse {
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

    likeCount?: number;

    quoteCount?: number;

    replyCount?: number;

    retweetCount?: number;

    viewCount?: number;
  }

  export namespace Tweet {
    export interface Author {
      id: string;

      name: string;

      username: string;

      verified?: boolean;
    }
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
   * Pagination cursor
   */
  cursor?: string;

  /**
   * Items per page (20-200, default 200)
   */
  pageSize?: number;
}

export interface UserRetrieveFollowersYouKnowParams {
  /**
   * Pagination cursor from previous response
   */
  cursor?: string;
}

export interface UserRetrieveFollowingParams {
  /**
   * Pagination cursor
   */
  cursor?: string;

  /**
   * Items per page (20-200, default 200)
   */
  pageSize?: number;
}

export interface UserRetrieveLikesParams {
  /**
   * Pagination cursor from previous response
   */
  cursor?: string;
}

export interface UserRetrieveMediaParams {
  /**
   * Pagination cursor from previous response
   */
  cursor?: string;
}

export interface UserRetrieveMentionsParams {
  /**
   * Pagination cursor
   */
  cursor?: string;

  /**
   * Unix timestamp - filter after
   */
  sinceTime?: string;

  /**
   * Unix timestamp - filter before
   */
  untilTime?: string;
}

export interface UserRetrieveSearchParams {
  /**
   * Search query
   */
  q: string;

  /**
   * Pagination cursor
   */
  cursor?: string;
}

export interface UserRetrieveTweetsParams {
  /**
   * Pagination cursor from previous response
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
   * Pagination cursor
   */
  cursor?: string;
}

Users.Follow = Follow;

export declare namespace Users {
  export {
    type UserProfile as UserProfile,
    type UserRetrieveResponse as UserRetrieveResponse,
    type UserRetrieveFollowersYouKnowResponse as UserRetrieveFollowersYouKnowResponse,
    type UserRetrieveLikesResponse as UserRetrieveLikesResponse,
    type UserRetrieveMediaResponse as UserRetrieveMediaResponse,
    type UserRetrieveTweetsResponse as UserRetrieveTweetsResponse,
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
