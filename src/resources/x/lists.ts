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
    type ListRetrieveFollowersParams as ListRetrieveFollowersParams,
    type ListRetrieveMembersParams as ListRetrieveMembersParams,
    type ListRetrieveTweetsParams as ListRetrieveTweetsParams,
  };
}
