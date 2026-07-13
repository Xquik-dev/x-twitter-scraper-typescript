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

  /**
   * Items per page (20-200, default 20). This is an upper bound for paid
   * authenticated calls: remaining credits can reduce the returned page size, and
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
   * remaining credits cover fewer results. Keep requesting next_cursor while
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
