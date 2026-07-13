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
    return this._client.get(path`/x/lists/${id}/followers`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
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
    return this._client.get(path`/x/lists/${id}/members`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
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
    return this._client.get(path`/x/lists/${id}/tweets`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }
}

export interface ListRetrieveFollowersParams {
  /**
   * Pagination cursor for list followers
   */
  cursor?: string;

  /**
   * Maximum user profiles requested from this page (20-200, default 200). The
   * response can contain fewer profiles because the source returned fewer or
   * remaining credits cover fewer results. Keep requesting next_cursor while
   * has_next_page is true. The deprecated limit and count aliases remain accepted.
   */
  pageSize?: number;
}

export interface ListRetrieveMembersParams {
  /**
   * Pagination cursor for list members
   */
  cursor?: string;

  /**
   * Members per page (20-200, default 20)
   */
  pageSize?: number;
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
   * Maximum items requested from this page (1-100, default 20). The response can
   * contain fewer items because the source returned fewer, filters removed items, or
   * remaining credits cover fewer results. Keep requesting next_cursor while
   * has_next_page is true, even when a page is empty. The deprecated limit and count
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
