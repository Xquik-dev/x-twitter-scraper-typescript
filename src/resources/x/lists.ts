// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * X data lookups (subscription required)
 */
export class Lists extends APIResource {
  /**
   * Get list followers
   *
   * @example
   * ```ts
   * const response = await client.x.lists.retrieveFollowers(
   *   'id',
   * );
   * ```
   */
  retrieveFollowers(
    id: string,
    query: ListRetrieveFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListRetrieveFollowersResponse> {
    return this._client.get(path`/x/lists/${id}/followers`, { query, ...options });
  }

  /**
   * Get list members
   *
   * @example
   * ```ts
   * const response = await client.x.lists.retrieveMembers('id');
   * ```
   */
  retrieveMembers(
    id: string,
    query: ListRetrieveMembersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListRetrieveMembersResponse> {
    return this._client.get(path`/x/lists/${id}/members`, { query, ...options });
  }

  /**
   * Get list tweets
   *
   * @example
   * ```ts
   * const response = await client.x.lists.retrieveTweets('id');
   * ```
   */
  retrieveTweets(
    id: string,
    query: ListRetrieveTweetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListRetrieveTweetsResponse> {
    return this._client.get(path`/x/lists/${id}/tweets`, { query, ...options });
  }
}

/**
 * Paginated list of user profiles with cursor-based navigation.
 */
export interface ListRetrieveFollowersResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<ListRetrieveFollowersResponse.User>;
}

export namespace ListRetrieveFollowersResponse {
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
export interface ListRetrieveMembersResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<ListRetrieveMembersResponse.User>;
}

export namespace ListRetrieveMembersResponse {
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
export interface ListRetrieveTweetsResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<ListRetrieveTweetsResponse.Tweet>;
}

export namespace ListRetrieveTweetsResponse {
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

export interface ListRetrieveFollowersParams {
  /**
   * Pagination cursor for list followers
   */
  cursor?: string;
}

export interface ListRetrieveMembersParams {
  /**
   * Pagination cursor for list members
   */
  cursor?: string;
}

export interface ListRetrieveTweetsParams {
  /**
   * Pagination cursor for list tweets
   */
  cursor?: string;

  /**
   * Include replies (default false)
   */
  includeReplies?: boolean;

  /**
   * Unix timestamp - filter after
   */
  sinceTime?: string;

  /**
   * Unix timestamp - filter before
   */
  untilTime?: string;
}

export declare namespace Lists {
  export {
    type ListRetrieveFollowersResponse as ListRetrieveFollowersResponse,
    type ListRetrieveMembersResponse as ListRetrieveMembersResponse,
    type ListRetrieveTweetsResponse as ListRetrieveTweetsResponse,
    type ListRetrieveFollowersParams as ListRetrieveFollowersParams,
    type ListRetrieveMembersParams as ListRetrieveMembersParams,
    type ListRetrieveTweetsParams as ListRetrieveTweetsParams,
  };
}
