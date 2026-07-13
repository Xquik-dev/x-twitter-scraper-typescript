// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as Shared from '../../shared';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X Community info, members, and tweets
 */
export class Tweets extends APIResource {
  /**
   * Requires a Community ID and keyword query.
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.communities.tweets.list({
   *     communityId: '321669910225',
   *     q: 'q',
   *   });
   * ```
   */
  list(query: TweetListParams, options?: RequestOptions): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/communities/tweets', { query, ...options });
  }

  /**
   * List tweets posted in a community
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.communities.tweets.listByCommunity('id');
   * ```
   */
  listByCommunity(
    id: string,
    query: TweetListByCommunityParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/communities/${id}/tweets`, { query, ...options });
  }
}

export interface TweetListParams {
  /**
   * Numeric ID of the community to search
   */
  communityId: string;

  /**
   * Keyword query within the selected community
   */
  q: string;

  /**
   * Pagination cursor for community results
   */
  cursor?: string;

  /**
   * Maximum items requested from this page (1-100, default 20). The response can
   * contain fewer items because the source returned fewer, filters removed items, or
   * the available usage balance covers fewer results. Keep requesting next_cursor while
   * has_next_page is true, even when a page is empty. The deprecated limit and count
   * aliases remain accepted.
   */
  pageSize?: number;

  /**
   * Sort order for community results (Latest or Top)
   */
  queryType?: 'Latest' | 'Top';
}

export interface TweetListByCommunityParams {
  /**
   * Pagination cursor for community tweets
   */
  cursor?: string;

  /**
   * Maximum items requested from this page (1-100, default 20). The response can
   * contain fewer items because the source returned fewer, filters removed items, or
   * the available usage balance covers fewer results. Keep requesting next_cursor while
   * has_next_page is true, even when a page is empty. The deprecated limit and count
   * aliases remain accepted.
   */
  pageSize?: number;
}

export declare namespace Tweets {
  export {
    type TweetListParams as TweetListParams,
    type TweetListByCommunityParams as TweetListByCommunityParams,
  };
}
