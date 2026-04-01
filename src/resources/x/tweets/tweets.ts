// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as LikeAPI from './like';
import { Like, LikeCreateParams, LikeCreateResponse, LikeDeleteParams, LikeDeleteResponse } from './like';
import * as RetweetAPI from './retweet';
import {
  Retweet,
  RetweetCreateParams,
  RetweetCreateResponse,
  RetweetDeleteParams,
  RetweetDeleteResponse,
} from './retweet';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Tweets extends APIResource {
  like: LikeAPI.Like = new LikeAPI.Like(this._client);
  retweet: RetweetAPI.Retweet = new RetweetAPI.Retweet(this._client);

  /**
   * Create tweet
   */
  create(body: TweetCreateParams, options?: RequestOptions): APIPromise<TweetCreateResponse> {
    return this._client.post('/x/tweets', { body, ...options });
  }

  /**
   * Look up tweet
   */
  retrieve(tweetID: string, options?: RequestOptions): APIPromise<TweetRetrieveResponse> {
    return this._client.get(path`/x/tweets/${tweetID}`, options);
  }

  /**
   * Get multiple tweets by IDs
   */
  list(query: TweetListParams, options?: RequestOptions): APIPromise<void> {
    return this._client.get('/x/tweets', {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Delete tweet
   */
  delete(
    tweetID: string,
    body: TweetDeleteParams,
    options?: RequestOptions,
  ): APIPromise<TweetDeleteResponse> {
    return this._client.delete(path`/x/tweets/${tweetID}`, { body, ...options });
  }

  /**
   * Get users who liked a tweet
   */
  getFavoriters(
    id: string,
    query: TweetGetFavoritersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetGetFavoritersResponse> {
    return this._client.get(path`/x/tweets/${id}/favoriters`, { query, ...options });
  }

  /**
   * Get quote tweets of a tweet
   */
  getQuotes(
    id: string,
    query: TweetGetQuotesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetGetQuotesResponse> {
    return this._client.get(path`/x/tweets/${id}/quotes`, { query, ...options });
  }

  /**
   * Get replies to a tweet
   */
  getReplies(
    id: string,
    query: TweetGetRepliesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetGetRepliesResponse> {
    return this._client.get(path`/x/tweets/${id}/replies`, { query, ...options });
  }

  /**
   * Get users who retweeted a tweet
   */
  getRetweeters(
    id: string,
    query: TweetGetRetweetersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetGetRetweetersResponse> {
    return this._client.get(path`/x/tweets/${id}/retweeters`, { query, ...options });
  }

  /**
   * Get thread context for a tweet
   */
  getThread(
    id: string,
    query: TweetGetThreadParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetGetThreadResponse> {
    return this._client.get(path`/x/tweets/${id}/thread`, { query, ...options });
  }

  /**
   * Search tweets
   */
  search(query: TweetSearchParams, options?: RequestOptions): APIPromise<TweetSearchResponse> {
    return this._client.get('/x/tweets/search', { query, ...options });
  }
}

export interface SearchTweet {
  id: string;

  text: string;

  author?: SearchTweet.Author;

  bookmarkCount?: number;

  createdAt?: string;

  likeCount?: number;

  quoteCount?: number;

  replyCount?: number;

  retweetCount?: number;

  viewCount?: number;
}

export namespace SearchTweet {
  export interface Author {
    id: string;

    name: string;

    username: string;

    verified?: boolean;
  }
}

export interface TweetAuthor {
  id: string;

  followers: number;

  username: string;

  verified: boolean;

  profilePicture?: string;
}

export interface TweetDetail {
  id: string;

  bookmarkCount: number;

  likeCount: number;

  quoteCount: number;

  replyCount: number;

  retweetCount: number;

  text: string;

  viewCount: number;

  createdAt?: string;
}

export interface TweetCreateResponse {
  success: true;

  tweetId: string;
}

export interface TweetRetrieveResponse {
  tweet: TweetRetrieveResponse.Tweet;

  author?: TweetRetrieveResponse.Author;
}

export namespace TweetRetrieveResponse {
  export interface Tweet {
    id: string;

    bookmarkCount: number;

    likeCount: number;

    quoteCount: number;

    replyCount: number;

    retweetCount: number;

    text: string;

    viewCount: number;

    createdAt?: string;
  }

  export interface Author {
    id: string;

    followers: number;

    username: string;

    verified: boolean;

    profilePicture?: string;
  }
}

export interface TweetDeleteResponse {
  success: true;
}

export interface TweetGetFavoritersResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<TweetGetFavoritersResponse.User>;
}

export namespace TweetGetFavoritersResponse {
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

export interface TweetGetQuotesResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<TweetGetQuotesResponse.Tweet>;
}

export namespace TweetGetQuotesResponse {
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

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

export interface TweetGetRepliesResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<TweetGetRepliesResponse.Tweet>;
}

export namespace TweetGetRepliesResponse {
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

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

export interface TweetGetRetweetersResponse {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<TweetGetRetweetersResponse.User>;
}

export namespace TweetGetRetweetersResponse {
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

export interface TweetGetThreadResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<TweetGetThreadResponse.Tweet>;
}

export namespace TweetGetThreadResponse {
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

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

export interface TweetSearchResponse {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<TweetSearchResponse.Tweet>;
}

export namespace TweetSearchResponse {
  export interface Tweet {
    id: string;

    text: string;

    author?: Tweet.Author;

    bookmarkCount?: number;

    createdAt?: string;

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

export interface TweetCreateParams {
  /**
   * X account (@username or account ID)
   */
  account: string;

  text: string;

  attachment_url?: string;

  community_id?: string;

  is_note_tweet?: boolean;

  media_ids?: Array<string>;

  reply_to_tweet_id?: string;
}

export interface TweetListParams {
  /**
   * Comma-separated tweet IDs (max 100)
   */
  ids: string;
}

export interface TweetDeleteParams {
  /**
   * X account (@username or account ID)
   */
  account: string;
}

export interface TweetGetFavoritersParams {
  /**
   * Pagination cursor from previous response
   */
  cursor?: string;
}

export interface TweetGetQuotesParams {
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

export interface TweetGetRepliesParams {
  /**
   * Pagination cursor
   */
  cursor?: string;

  /**
   * Unix timestamp - filter after
   */
  sinceTime?: string;

  /**
   * Unix timestamp - filter before
   */
  untilTime?: string;
}

export interface TweetGetRetweetersParams {
  /**
   * Pagination cursor
   */
  cursor?: string;
}

export interface TweetGetThreadParams {
  /**
   * Pagination cursor
   */
  cursor?: string;
}

export interface TweetSearchParams {
  /**
   * Search query (keywords,
   */
  q: string;

  /**
   * Pagination cursor from previous response
   */
  cursor?: string;

  /**
   * Deprecated — use cursor-based pagination instead
   */
  limit?: number;

  /**
   * Sort order — Latest (chronological) or Top (engagement-ranked)
   */
  queryType?: 'Latest' | 'Top';

  /**
   * ISO 8601 timestamp — only return tweets after this time
   */
  sinceTime?: string;

  /**
   * ISO 8601 timestamp — only return tweets before this time
   */
  untilTime?: string;
}

Tweets.Like = Like;
Tweets.Retweet = Retweet;

export declare namespace Tweets {
  export {
    type SearchTweet as SearchTweet,
    type TweetAuthor as TweetAuthor,
    type TweetDetail as TweetDetail,
    type TweetCreateResponse as TweetCreateResponse,
    type TweetRetrieveResponse as TweetRetrieveResponse,
    type TweetDeleteResponse as TweetDeleteResponse,
    type TweetGetFavoritersResponse as TweetGetFavoritersResponse,
    type TweetGetQuotesResponse as TweetGetQuotesResponse,
    type TweetGetRepliesResponse as TweetGetRepliesResponse,
    type TweetGetRetweetersResponse as TweetGetRetweetersResponse,
    type TweetGetThreadResponse as TweetGetThreadResponse,
    type TweetSearchResponse as TweetSearchResponse,
    type TweetCreateParams as TweetCreateParams,
    type TweetListParams as TweetListParams,
    type TweetDeleteParams as TweetDeleteParams,
    type TweetGetFavoritersParams as TweetGetFavoritersParams,
    type TweetGetQuotesParams as TweetGetQuotesParams,
    type TweetGetRepliesParams as TweetGetRepliesParams,
    type TweetGetRetweetersParams as TweetGetRetweetersParams,
    type TweetGetThreadParams as TweetGetThreadParams,
    type TweetSearchParams as TweetSearchParams,
  };

  export {
    Like as Like,
    type LikeCreateResponse as LikeCreateResponse,
    type LikeDeleteResponse as LikeDeleteResponse,
    type LikeCreateParams as LikeCreateParams,
    type LikeDeleteParams as LikeDeleteParams,
  };

  export {
    Retweet as Retweet,
    type RetweetCreateResponse as RetweetCreateResponse,
    type RetweetDeleteResponse as RetweetDeleteResponse,
    type RetweetCreateParams as RetweetCreateParams,
    type RetweetDeleteParams as RetweetDeleteParams,
  };
}
