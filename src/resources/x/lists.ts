// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * X List followers, members, and tweets
 */
export class Lists extends APIResource {
  /**
   * List followers of an X List
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.lists.retrieveFollowers('id');
   * ```
   */
  retrieveFollowers(
    id: string,
    query: ListRetrieveFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/lists/${id}/followers`, { query, ...options });
  }

  /**
   * List members of an X List
   *
   * @example
   * ```ts
   * const paginatedUsers = await client.x.lists.retrieveMembers(
   *   'id',
   * );
   * ```
   */
  retrieveMembers(
    id: string,
    query: ListRetrieveMembersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/lists/${id}/members`, { query, ...options });
  }

  /**
   * List tweets from an X List
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.lists.retrieveTweets(
   *   'id',
   * );
   * ```
   */
  retrieveTweets(
    id: string,
    query: ListRetrieveTweetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/lists/${id}/tweets`, { query, ...options });
  }
}

export interface ListRetrieveFollowersParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Pagination cursor for list followers
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

export interface ListRetrieveMembersParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Pagination cursor for list members
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
   * Members per page (20-200, default 20)
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
   * Maximum page items (1-100, default 20). Source, filters, or credits can reduce
   * results. Continue while has_next_page is true. Deprecated limit and count
   * aliases remain accepted.
   */
  pageSize?: number;

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
    type ListRetrieveFollowersParams as ListRetrieveFollowersParams,
    type ListRetrieveMembersParams as ListRetrieveMembersParams,
    type ListRetrieveTweetsParams as ListRetrieveTweetsParams,
  };
}
