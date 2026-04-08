// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

/**
 * X data lookups (subscription required)
 */
export class Tweets extends APIResource {
  /**
   * Search tweets across all communities
   *
   * @example
   * ```ts
   * const tweets = await client.x.communities.tweets.list({
   *   q: 'q',
   * });
   * ```
   */
  list(query: TweetListParams, options?: RequestOptions): APIPromise<TweetListResponse> {
    return this._client.get('/x/communities/tweets', { query, ...options });
  }
}

/**
 * Paginated list of tweets with cursor-based navigation.
 */
export interface TweetListResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<TweetListResponse.Tweet>;
}

export namespace TweetListResponse {
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

export declare namespace Tweets {
  export { type TweetListResponse as TweetListResponse, type TweetListParams as TweetListParams };
}
