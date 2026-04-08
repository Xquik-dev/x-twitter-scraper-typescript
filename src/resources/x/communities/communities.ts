// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JoinAPI from './join';
import {
  Join,
  JoinCreateParams,
  JoinCreateResponse,
  JoinDeleteAllParams,
  JoinDeleteAllResponse,
} from './join';
import * as TweetsAPI from './tweets';
import { TweetListParams, TweetListResponse, Tweets } from './tweets';
import { APIPromise } from '../../../core/api-promise';
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
   *   description: 'A community for Tesla enthusiasts',
   * });
   * ```
   */
  create(body: CommunityCreateParams, options?: RequestOptions): APIPromise<CommunityCreateResponse> {
    return this._client.post('/x/communities', { body, ...options });
  }

  /**
   * Delete community
   *
   * @example
   * ```ts
   * const community = await client.x.communities.delete('id', {
   *   account: '@elonmusk',
   *   community_name: 'Tesla Fans',
   * });
   * ```
   */
  delete(
    id: string,
    body: CommunityDeleteParams,
    options?: RequestOptions,
  ): APIPromise<CommunityDeleteResponse> {
    return this._client.delete(path`/x/communities/${id}`, { body, ...options });
  }

  /**
   * Get community details
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
   * Get community members
   *
   * @example
   * ```ts
   * const response = await client.x.communities.retrieveMembers(
   *   'id',
   * );
   * ```
   */
  retrieveMembers(
    id: string,
    query: CommunityRetrieveMembersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CommunityRetrieveMembersResponse> {
    return this._client.get(path`/x/communities/${id}/members`, { query, ...options });
  }

  /**
   * Get community moderators
   *
   * @example
   * ```ts
   * const response =
   *   await client.x.communities.retrieveModerators('id');
   * ```
   */
  retrieveModerators(
    id: string,
    query: CommunityRetrieveModeratorsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CommunityRetrieveModeratorsResponse> {
    return this._client.get(path`/x/communities/${id}/moderators`, { query, ...options });
  }

  /**
   * Search tweets across communities
   *
   * @example
   * ```ts
   * const response = await client.x.communities.retrieveSearch({
   *   q: 'q',
   * });
   * ```
   */
  retrieveSearch(
    query: CommunityRetrieveSearchParams,
    options?: RequestOptions,
  ): APIPromise<CommunityRetrieveSearchResponse> {
    return this._client.get('/x/communities/search', { query, ...options });
  }
}

/**
 * Result of a community join or leave action.
 */
export interface CommunityActionResult {
  communityId: string;

  communityName: string;

  success: true;
}

export interface CommunityCreateResponse {
  communityId: string;

  success: true;

  communityName?: string;
}

export interface CommunityDeleteResponse {
  success: true;
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

    /**
     * About text for the community
     */
    description?: string;

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
     * Community rules
     */
    rules?: Array<Community.Rule>;
  }

  export namespace Community {
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

/**
 * Paginated list of user profiles with cursor-based navigation.
 */
export interface CommunityRetrieveMembersResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<CommunityRetrieveMembersResponse.User>;
}

export namespace CommunityRetrieveMembersResponse {
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
export interface CommunityRetrieveModeratorsResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<CommunityRetrieveModeratorsResponse.User>;
}

export namespace CommunityRetrieveModeratorsResponse {
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
export interface CommunityRetrieveSearchResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<CommunityRetrieveSearchResponse.Tweet>;
}

export namespace CommunityRetrieveSearchResponse {
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

export interface CommunityCreateParams {
  /**
   * X account (@username or ID) creating the community
   */
  account: string;

  /**
   * Community name
   */
  name: string;

  /**
   * Community description
   */
  description?: string;
}

export interface CommunityDeleteParams {
  /**
   * X account (@username or ID) deleting the community
   */
  account: string;

  /**
   * Community name for confirmation
   */
  community_name: string;
}

export interface CommunityRetrieveMembersParams {
  /**
   * Pagination cursor
   */
  cursor?: string;
}

export interface CommunityRetrieveModeratorsParams {
  /**
   * Pagination cursor for community moderators
   */
  cursor?: string;
}

export interface CommunityRetrieveSearchParams {
  /**
   * Search query
   */
  q: string;

  /**
   * Pagination cursor for community search
   */
  cursor?: string;

  /**
   * Sort order (Latest or Top)
   */
  queryType?: string;
}

Communities.Join = Join;
Communities.Tweets = Tweets;

export declare namespace Communities {
  export {
    type CommunityActionResult as CommunityActionResult,
    type CommunityCreateResponse as CommunityCreateResponse,
    type CommunityDeleteResponse as CommunityDeleteResponse,
    type CommunityRetrieveInfoResponse as CommunityRetrieveInfoResponse,
    type CommunityRetrieveMembersResponse as CommunityRetrieveMembersResponse,
    type CommunityRetrieveModeratorsResponse as CommunityRetrieveModeratorsResponse,
    type CommunityRetrieveSearchResponse as CommunityRetrieveSearchResponse,
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
    type TweetListResponse as TweetListResponse,
    type TweetListParams as TweetListParams,
  };
}
