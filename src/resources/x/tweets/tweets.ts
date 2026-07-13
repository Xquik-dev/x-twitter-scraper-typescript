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
   * Get tweet with full text, author, metrics and media
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
   * List users who liked a tweet
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
   * List quote tweets of a tweet
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
   * List replies to a tweet
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
   * List users who retweeted a tweet
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
   * Get full conversation thread for a tweet
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
   * Search tweets by query, Tweet ID, X status URL, or account date window
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
 * Tweet author profile. The lookup route always includes follower count and
 * verification state. Other profile fields appear when available.
 */
export interface TweetAuthor extends Shared.UserProfile {
  followers: number;

  verified: boolean;
}

/**
 * Full tweet with text, engagement metrics, media, and metadata. A zero metric can
 * mean X did not report the count.
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
   * Tweet author profile. The lookup route always includes follower count and
   * verification state. Other profile fields appear when available.
   */
  author?: TweetAuthor;

  /**
   * Content disclosure metadata shown by X when a tweet is labeled as paid
   * partnership content or AI-generated media.
   */
  contentDisclosure?: Shared.ContentDisclosure;

  /**
   * ID of the root tweet in the conversation thread
   */
  conversationId?: string;

  createdAt?: string;

  /**
   * Start and end offsets for rendered tweet text
   */
  displayTextRange?: Array<number>;

  /**
   * Parsed entities from the tweet text (URLs, mentions, hashtags, media)
   */
  entities?: { [key: string]: unknown };

  /**
   * Tweet ID being replied to
   */
  inReplyToId?: string;

  /**
   * User ID being replied to
   */
  inReplyToUserId?: string;

  /**
   * Username being replied to
   */
  inReplyToUsername?: string;

  /**
   * Whether replies are limited for this tweet
   */
  isLimitedReply?: boolean;

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
   * Tweet language code
   */
  lang?: string;

  /**
   * Attached media items, omitted when the tweet has no media
   */
  media?: Array<Shared.TweetMedia>;

  /**
   * Quoted or retweeted tweet context. Every object includes id, text, and
   * engagement metrics. A zero metric can mean X did not report the count. Author,
   * media, and conversation fields appear when available.
   */
  quoted_tweet?: Shared.EmbeddedTweet;

  /**
   * Quoted or retweeted tweet context. Every object includes id, text, and
   * engagement metrics. A zero metric can mean X did not report the count. Author,
   * media, and conversation fields appear when available.
   */
  retweeted_tweet?: Shared.EmbeddedTweet;

  /**
   * Client application used to post this tweet
   */
  source?: string;

  /**
   * Tweet result type
   */
  type?: string;

  /**
   * Tweet permalink URL
   */
  url?: string;
}

export interface TweetCreateResponse {
  charged: boolean;

  /**
   * Credits charged for this tweet. Text-only tweets and replies cost 30 credits;
   * attached media adds 2 credits per started MB.
   */
  chargedCredits: string;

  success: true;

  tweetId: string;

  writeActionId?: string;
}

export interface TweetRetrieveResponse {
  /**
   * Full tweet with text, engagement metrics, media, and metadata. A zero metric can
   * mean X did not report the count.
   */
  tweet: TweetDetail;

  /**
   * Tweet author profile. The lookup route always includes follower count and
   * verification state. Other profile fields appear when available.
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

  attachment_url?: string;

  community_id?: string;

  is_note_tweet?: boolean;

  /**
   * Array of public media URLs to attach. Supports up to 4 images or exactly 1 MP4
   * video up to 100 MB. Each URL must be publicly reachable. Attached media adds 2
   * credits per started MB across all files.
   */
  media?: Array<string>;

  reply_to_tweet_id?: string;

  /**
   * Tweet text (optional when media is provided)
   */
  text?: string;
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

  /**
   * Maximum user profiles requested from this page (20-200, default 200). The
   * response can contain fewer profiles because the source returned fewer or
   * remaining credits cover fewer results. Keep requesting next_cursor while
   * has_next_page is true. The deprecated limit and count aliases remain accepted.
   */
  pageSize?: number;
}

export interface TweetGetQuotesParams {
  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Pagination cursor for quote tweets
   */
  cursor?: string;

  /**
   * Exact phrase to match.
   */
  exactPhrase?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Include reply quotes (default false)
   */
  includeReplies?: boolean;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Language code filter, e.g. en or tr.
   */
  language?: string;

  /**
   * Filter by media type.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum likes threshold.
   */
  minFaves?: number;

  /**
   * Minimum quote count threshold.
   */
  minQuotes?: number;

  /**
   * Minimum replies threshold.
   */
  minReplies?: number;

  /**
   * Minimum retweets threshold.
   */
  minRetweets?: number;

  /**
   * Maximum items requested from this page (1-100, default 20). The response can
   * contain fewer items because the source returned fewer, filters removed items, or
   * remaining credits cover fewer results. Keep requesting next_cursor while
   * has_next_page is true, even when a page is empty. The deprecated limit and count
   * aliases remain accepted.
   */
  pageSize?: number;

  /**
   * Quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Retweet mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Start date in YYYY-MM-DD format.
   */
  sinceDate?: string;

  /**
   * Unix timestamp - return quotes posted after this time
   */
  sinceTime?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * Unix timestamp - return quotes posted before this time
   */
  untilTime?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;
}

export interface TweetGetRepliesParams {
  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Pagination cursor for tweet replies
   */
  cursor?: string;

  /**
   * Exact phrase to match.
   */
  exactPhrase?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Language code filter, e.g. en or tr.
   */
  language?: string;

  /**
   * Filter by media type.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum likes threshold.
   */
  minFaves?: number;

  /**
   * Minimum quote count threshold.
   */
  minQuotes?: number;

  /**
   * Minimum replies threshold.
   */
  minReplies?: number;

  /**
   * Minimum retweets threshold.
   */
  minRetweets?: number;

  /**
   * Maximum items requested from this page (1-100, default 20). The response can
   * contain fewer items because the source returned fewer, filters removed items, or
   * remaining credits cover fewer results. Keep requesting next_cursor while
   * has_next_page is true, even when a page is empty. The deprecated limit and count
   * aliases remain accepted.
   */
  pageSize?: number;

  /**
   * Quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Retweet mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Start date in YYYY-MM-DD format.
   */
  sinceDate?: string;

  /**
   * Unix timestamp - return replies posted after this time
   */
  sinceTime?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * Unix timestamp - return replies posted before this time
   */
  untilTime?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;
}

export interface TweetGetRetweetersParams {
  /**
   * Pagination cursor for retweeters
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

export interface TweetGetThreadParams {
  /**
   * Pagination cursor for thread tweets
   */
  cursor?: string;

  /**
   * Maximum items requested from this page (1-100, default 20). The response can
   * contain fewer items because the source returned fewer, filters removed items, or
   * remaining credits cover fewer results. Keep requesting next_cursor while
   * has_next_page is true, even when a page is empty. The deprecated limit and count
   * aliases remain accepted.
   */
  pageSize?: number;
}

export interface TweetSearchParams {
  /**
   * Search query (keywords,
   */
  q: string;

  /**
   * Raw advanced search query appended as-is.
   */
  advancedQuery?: string;

  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Geo bounding box, e.g. -74.1 40.6 -73.9 40.8.
   */
  boundingBox?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Pagination cursor from previous response
   */
  cursor?: string;

  /**
   * Exact phrase to match.
   */
  exactPhrase?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Language code filter, e.g. en or tr.
   */
  language?: string;

  /**
   * Max tweets to return (server paginates internally). Omit for single page (~20).
   * This is an upper bound for paid authenticated calls: remaining credits can
   * reduce the returned page size, and zero affordable results returns 402
   * insufficient_credits.
   */
  limit?: number;

  /**
   * Search within a list ID.
   */
  listId?: string;

  /**
   * Filter by media type.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum likes threshold.
   */
  minFaves?: number;

  /**
   * Minimum quote count threshold.
   */
  minQuotes?: number;

  /**
   * Minimum replies threshold.
   */
  minReplies?: number;

  /**
   * Minimum retweets threshold.
   */
  minRetweets?: number;

  /**
   * Search within a place ID.
   */
  place?: string;

  /**
   * Search within a country code.
   */
  placeCountry?: string;

  /**
   * Geo point radius, e.g. -73.99 40.73 25mi.
   */
  pointRadius?: string;

  /**
   * Sort order - Latest (chronological) or Top (engagement-ranked)
   */
  queryType?: 'Latest' | 'Top';

  /**
   * Quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Retweet mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Start date in YYYY-MM-DD format.
   */
  sinceDate?: string;

  /**
   * ISO 8601 timestamp - only return tweets after this time
   */
  sinceTime?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * ISO 8601 timestamp - only return tweets before this time
   */
  untilTime?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;
}

Tweets.Like = Like;
Tweets.Retweet = Retweet;

export declare namespace Tweets {
  export {
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
