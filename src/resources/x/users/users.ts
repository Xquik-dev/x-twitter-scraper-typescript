// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as FollowAPI from './follow';
import { Follow } from './follow';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X data lookups (subscription required)
 */
export class Users extends APIResource {
  follow: FollowAPI.Follow = new FollowAPI.Follow(this._client);

  /**
   * Get multiple users by IDs
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
   * Get user followers
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
   * Get followers you know for a user
   *
   * @example
   * ```ts
   * const response =
   *   await client.x.users.retrieveFollowersYouKnow('id');
   * ```
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
   * Get tweets liked by a user
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveLikes('id');
   * ```
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
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveMedia('id');
   * ```
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
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveMentions(
   *   'id',
   * );
   * ```
   */
  retrieveMentions(
    id: string,
    query: UserRetrieveMentionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UserRetrieveMentionsResponse> {
    return this._client.get(path`/x/users/${id}/mentions`, { query, ...options });
  }

  /**
   * Search users by name or username
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveSearch({
   *   q: 'q',
   * });
   * ```
   */
  retrieveSearch(
    query: UserRetrieveSearchParams,
    options?: RequestOptions,
  ): APIPromise<UserRetrieveSearchResponse> {
    return this._client.get('/x/users/search', { query, ...options });
  }

  /**
   * Get recent tweets by a user
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveTweets('id');
   * ```
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
 * X user profile with bio, follower counts, and verification status.
 */
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

/**
 * Paginated list of user profiles with cursor-based navigation.
 */
export interface UserRetrieveBatchResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UserRetrieveBatchResponse.User>;
}

export namespace UserRetrieveBatchResponse {
  /**
   * X user profile with bio, follower counts, and verification status.
   */
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

/**
 * Paginated list of user profiles with cursor-based navigation.
 */
export interface UserRetrieveFollowersResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UserRetrieveFollowersResponse.User>;
}

export namespace UserRetrieveFollowersResponse {
  /**
   * X user profile with bio, follower counts, and verification status.
   */
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

/**
 * Paginated list of user profiles with cursor-based navigation.
 */
export interface UserRetrieveFollowersYouKnowResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UserRetrieveFollowersYouKnowResponse.User>;
}

export namespace UserRetrieveFollowersYouKnowResponse {
  /**
   * X user profile with bio, follower counts, and verification status.
   */
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

/**
 * Paginated list of user profiles with cursor-based navigation.
 */
export interface UserRetrieveFollowingResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UserRetrieveFollowingResponse.User>;
}

export namespace UserRetrieveFollowingResponse {
  /**
   * X user profile with bio, follower counts, and verification status.
   */
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

/**
 * Paginated list of tweets with cursor-based navigation.
 */
export interface UserRetrieveLikesResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<UserRetrieveLikesResponse.Tweet>;
}

export namespace UserRetrieveLikesResponse {
  /**
   * Tweet returned from search results with inline author info.
   */
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

    /**
     * True for Note Tweets (long-form content, up to 25,000 characters)
     */
    isNoteTweet?: boolean;

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

/**
 * Paginated list of tweets with cursor-based navigation.
 */
export interface UserRetrieveMediaResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<UserRetrieveMediaResponse.Tweet>;
}

export namespace UserRetrieveMediaResponse {
  /**
   * Tweet returned from search results with inline author info.
   */
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

    /**
     * True for Note Tweets (long-form content, up to 25,000 characters)
     */
    isNoteTweet?: boolean;

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

/**
 * Paginated list of tweets with cursor-based navigation.
 */
export interface UserRetrieveMentionsResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<UserRetrieveMentionsResponse.Tweet>;
}

export namespace UserRetrieveMentionsResponse {
  /**
   * Tweet returned from search results with inline author info.
   */
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

    /**
     * True for Note Tweets (long-form content, up to 25,000 characters)
     */
    isNoteTweet?: boolean;

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

/**
 * Paginated list of user profiles with cursor-based navigation.
 */
export interface UserRetrieveSearchResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UserRetrieveSearchResponse.User>;
}

export namespace UserRetrieveSearchResponse {
  /**
   * X user profile with bio, follower counts, and verification status.
   */
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

/**
 * Paginated list of tweets with cursor-based navigation.
 */
export interface UserRetrieveTweetsResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<UserRetrieveTweetsResponse.Tweet>;
}

export namespace UserRetrieveTweetsResponse {
  /**
   * Tweet returned from search results with inline author info.
   */
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

    /**
     * True for Note Tweets (long-form content, up to 25,000 characters)
     */
    isNoteTweet?: boolean;

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

/**
 * Paginated list of user profiles with cursor-based navigation.
 */
export interface UserRetrieveVerifiedFollowersResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UserRetrieveVerifiedFollowersResponse.User>;
}

export namespace UserRetrieveVerifiedFollowersResponse {
  /**
   * X user profile with bio, follower counts, and verification status.
   */
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
    type UserProfile as UserProfile,
    type UserRetrieveBatchResponse as UserRetrieveBatchResponse,
    type UserRetrieveFollowersResponse as UserRetrieveFollowersResponse,
    type UserRetrieveFollowersYouKnowResponse as UserRetrieveFollowersYouKnowResponse,
    type UserRetrieveFollowingResponse as UserRetrieveFollowingResponse,
    type UserRetrieveLikesResponse as UserRetrieveLikesResponse,
    type UserRetrieveMediaResponse as UserRetrieveMediaResponse,
    type UserRetrieveMentionsResponse as UserRetrieveMentionsResponse,
    type UserRetrieveSearchResponse as UserRetrieveSearchResponse,
    type UserRetrieveTweetsResponse as UserRetrieveTweetsResponse,
    type UserRetrieveVerifiedFollowersResponse as UserRetrieveVerifiedFollowersResponse,
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

  export { Follow as Follow };
}
