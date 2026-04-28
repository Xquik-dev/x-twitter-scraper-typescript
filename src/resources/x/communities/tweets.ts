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
   * List tweets across all communities
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.communities.tweets.list({ q: 'q' });
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
   * Search query for cross-community tweets
   */
  q: string;

  /**
   * Pagination cursor for cross-community results
   */
  cursor?: string;

  /**
   * Sort order for cross-community results (Latest or Top)
   */
  queryType?: string;
}

export interface TweetListByCommunityParams {
  /**
   * Pagination cursor for community tweets
   */
  cursor?: string;
}

export declare namespace Tweets {
  export {
    type TweetListParams as TweetListParams,
    type TweetListByCommunityParams as TweetListByCommunityParams,
  };
}
