// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * X data lookups (subscription required)
 */
export class Lists extends APIResource {
  /**
   * Get list followers
   */
  retrieveFollowers(
    id: string,
    query: ListRetrieveFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.get(path`/x/lists/${id}/followers`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get list members
   */
  retrieveMembers(
    id: string,
    query: ListRetrieveMembersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.get(path`/x/lists/${id}/members`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get list tweets
   */
  retrieveTweets(
    id: string,
    query: ListRetrieveTweetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.get(path`/x/lists/${id}/tweets`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface ListRetrieveFollowersParams {
  /**
   * Pagination cursor
   */
  cursor?: string;
}

export interface ListRetrieveMembersParams {
  /**
   * Pagination cursor
   */
  cursor?: string;
}

export interface ListRetrieveTweetsParams {
  /**
   * Pagination cursor
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
