// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as Shared from '../../shared';
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
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Tweets extends APIResource {
  like: LikeAPI.Like = new LikeAPI.Like(this._client);
  retweet: RetweetAPI.Retweet = new RetweetAPI.Retweet(this._client);

  /**
   * Create tweet
   *
   * @example
   * ```ts
   * const tweet = await client.x.tweets.create({
   *   account: '@elonmusk',
   *   text: 'Just launched our new feature!',
   * });
   * ```
   */
  create(body: TweetCreateParams, options?: RequestOptions): APIPromise<TweetCreateResponse> {
    return this._client.post('/x/tweets', { body, ...options });
  }

  /**
   * Look up tweet
   *
   * @example
   * ```ts
   * const tweet = await client.x.tweets.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<TweetRetrieveResponse> {
    return this._client.get(path`/x/tweets/${id}`, options);
  }

  /**
   * Get multiple tweets by IDs
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.list({
   *   ids: 'ids',
   * });
   * ```
   */
  list(query: TweetListParams, options?: RequestOptions): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/tweets', { query, ...options });
  }

  /**
   * Delete tweet
   *
   * @example
   * ```ts
   * const tweet = await client.x.tweets.delete('id', {
   *   account: '@elonmusk',
   * });
   * ```
   */
  delete(id: string, body: TweetDeleteParams, options?: RequestOptions): APIPromise<TweetDeleteResponse> {
    return this._client.delete(path`/x/tweets/${id}`, { body, ...options });
  }

  /**
   * Get users who liked a tweet
   *
   * @example
   * ```ts
   * const paginatedUsers = await client.x.tweets.getFavoriters(
   *   'id',
   * );
   * ```
   */
  getFavoriters(
    id: string,
    query: TweetGetFavoritersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/tweets/${id}/favoriters`, { query, ...options });
  }

  /**
   * Get quote tweets of a tweet
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.getQuotes(
   *   'id',
   * );
   * ```
   */
  getQuotes(
    id: string,
    query: TweetGetQuotesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/tweets/${id}/quotes`, { query, ...options });
  }

  /**
   * Get replies to a tweet
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.getReplies(
   *   'id',
   * );
   * ```
   */
  getReplies(
    id: string,
    query: TweetGetRepliesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/tweets/${id}/replies`, { query, ...options });
  }

  /**
   * Get users who retweeted a tweet
   *
   * @example
   * ```ts
   * const paginatedUsers = await client.x.tweets.getRetweeters(
   *   'id',
   * );
   * ```
   */
  getRetweeters(
    id: string,
    query: TweetGetRetweetersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/tweets/${id}/retweeters`, { query, ...options });
  }

  /**
   * Get thread context for a tweet
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.getThread(
   *   'id',
   * );
   * ```
   */
  getThread(
    id: string,
    query: TweetGetThreadParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/tweets/${id}/thread`, { query, ...options });
  }

  /**
   * Search tweets
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.search({
   *   q: 'q',
   * });
   * ```
   */
  search(query: TweetSearchParams, options?: RequestOptions): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/tweets/search', { query, ...options });
  }
}

/**
 * Tweet returned from search results with inline author info.
 */
export interface SearchTweet {
  id: string;

  text: string;

  author?: SearchTweet.Author;

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

export namespace SearchTweet {
  export interface Author {
    id: string;

    name: string;

    username: string;

    verified?: boolean;
  }
}

/**
 * Author of a tweet with follower count and verification status.
 */
export interface TweetAuthor {
  id: string;

  followers: number;

  username: string;

  verified: boolean;

  profilePicture?: string;
}

/**
 * Full tweet with text, engagement metrics, media, and metadata.
 */
export interface TweetDetail {
  id: string;

  bookmarkCount: number;

  likeCount: number;

  quoteCount: number;

  replyCount: number;

  retweetCount: number;

  text: string;

  viewCount: number;

  /**
   * ID of the root tweet in the conversation thread
   */
  conversationId?: string;

  createdAt?: string;

  /**
   * Parsed entities from the tweet text (URLs, mentions, hashtags, media)
   */
  entities?: { [key: string]: unknown };

  /**
   * Whether this is a Note Tweet (long-form post, up to 25,000 characters)
   */
  isNoteTweet?: boolean;

  /**
   * Whether this tweet quotes another tweet
   */
  isQuoteStatus?: boolean;

  /**
   * Whether this tweet is a reply to another tweet
   */
  isReply?: boolean;

  /**
   * Attached media items, omitted when the tweet has no media
   */
  media?: Array<TweetDetail.Media>;

  /**
   * The quoted tweet object, present when isQuoteStatus is true
   */
  quoted_tweet?: { [key: string]: unknown };

  /**
   * Client application used to post this tweet
   */
  source?: string;
}

export namespace TweetDetail {
  export interface Media {
    mediaUrl?: string;

    type?: 'photo' | 'video' | 'animated_gif';

    url?: string;
  }
}

export interface TweetCreateResponse {
  success: true;

  tweetId: string;
}

export interface TweetRetrieveResponse {
  /**
   * Full tweet with text, engagement metrics, media, and metadata.
   */
  tweet: TweetDetail;

  /**
   * Author of a tweet with follower count and verification status.
   */
  author?: TweetAuthor;
}

export interface TweetDeleteResponse {
  success: true;
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
   * X account identifier (@username or account ID)
   */
  account: string;
}

export interface TweetGetFavoritersParams {
  /**
   * Pagination cursor for favoriters
   */
  cursor?: string;
}

export interface TweetGetQuotesParams {
  /**
   * Pagination cursor for quote tweets
   */
  cursor?: string;

  /**
   * Include reply quotes (default false)
   */
  includeReplies?: boolean;

  /**
   * Unix timestamp - return quotes posted after this time
   */
  sinceTime?: string;

  /**
   * Unix timestamp - return quotes posted before this time
   */
  untilTime?: string;
}

export interface TweetGetRepliesParams {
  /**
   * Pagination cursor for tweet replies
   */
  cursor?: string;

  /**
   * Unix timestamp - return replies posted after this time
   */
  sinceTime?: string;

  /**
   * Unix timestamp - return replies posted before this time
   */
  untilTime?: string;
}

export interface TweetGetRetweetersParams {
  /**
   * Pagination cursor for retweeters
   */
  cursor?: string;
}

export interface TweetGetThreadParams {
  /**
   * Pagination cursor for thread tweets
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
   * Max tweets to return (server paginates internally). Omit for single page (~20).
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
