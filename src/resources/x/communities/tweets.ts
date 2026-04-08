// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as Shared from '../../shared';
import { PaginatedTweetsCursorPage } from '../../shared';
import { CursorPage, type CursorPageParams, PagePromise } from '../../../core/pagination';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X data lookups (subscription required)
 */
export class Tweets extends APIResource {
  /**
   * Search tweets across all communities
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const paginatedTweets of client.x.communities.tweets.list(
   *   { q: 'q' },
   * )) {
   *   // ...
   * }
   * ```
   */
  list(
    query: TweetListParams,
    options?: RequestOptions,
  ): PagePromise<PaginatedTweetsCursorPage, Shared.PaginatedTweets> {
    return this._client.getAPIList('/x/communities/tweets', CursorPage<Shared.PaginatedTweets>, {
      query,
      ...options,
    });
  }

  /**
   * Get community tweets
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const paginatedTweets of client.x.communities.tweets.listByCommunity(
   *   'id',
   * )) {
   *   // ...
   * }
   * ```
   */
  listByCommunity(
    id: string,
    query: TweetListByCommunityParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<PaginatedTweetsCursorPage, Shared.PaginatedTweets> {
    return this._client.getAPIList(path`/x/communities/${id}/tweets`, CursorPage<Shared.PaginatedTweets>, {
      query,
      ...options,
    });
  }
}

export interface TweetListParams extends CursorPageParams {
  /**
   * Search query for cross-community tweets
   */
  q: string;

  /**
   * Sort order for cross-community results (Latest or Top)
   */
  queryType?: string;
}

export interface TweetListByCommunityParams extends CursorPageParams {}

export declare namespace Tweets {
  export {
    type TweetListParams as TweetListParams,
    type TweetListByCommunityParams as TweetListByCommunityParams,
  };
}

export { type PaginatedTweetsCursorPage };
