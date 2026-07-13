// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as Shared from '../../shared';
import * as FollowAPI from './follow';
import {
  Follow,
  FollowCreateParams,
  FollowCreateResponse,
  FollowDeleteAllParams,
  FollowDeleteAllResponse,
} from './follow';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Users extends APIResource {
  follow: FollowAPI.Follow = new FollowAPI.Follow(this._client);

  /**
   * Get user profile with follower counts and verification
   *
   * @example
   * ```ts
   * const userProfile = await client.x.users.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<Shared.UserProfile> {
    return this._client.get(path`/x/users/${id}`, {
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * Remove follower
   *
   * @example
   * ```ts
   * const response = await client.x.users.removeFollower('id', {
   *   account: '@elonmusk',
   * });
   * ```
   */
  removeFollower(
    id: string,
    body: UserRemoveFollowerParams,
    options?: RequestOptions,
  ): APIPromise<UserRemoveFollowerResponse> {
    return this._client.post(path`/x/users/${id}/remove-follower`, {
      body,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * Look up multiple users by IDs in one call
   *
   * @example
   * ```ts
   * const response = await client.x.users.retrieveBatch({
   *   ids: 'ids',
   * });
   * ```
   */
  retrieveBatch(
    query: UserRetrieveBatchParams,
    options?: RequestOptions,
  ): APIPromise<UserRetrieveBatchResponse> {
    return this._client.get('/x/users/batch', {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * List followers of a user
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.users.retrieveFollowers('id');
   * ```
   */
  retrieveFollowers(
    id: string,
    query: UserRetrieveFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/followers`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * List mutual followers between you and a user
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.users.retrieveFollowersYouKnow('id');
   * ```
   */
  retrieveFollowersYouKnow(
    id: string,
    query: UserRetrieveFollowersYouKnowParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/followers-you-know`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * List accounts a user follows
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.users.retrieveFollowing('id');
   * ```
   */
  retrieveFollowing(
    id: string,
    query: UserRetrieveFollowingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/following`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * List tweets liked by a user
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.users.retrieveLikes(
   *   'id',
   * );
   * ```
   */
  retrieveLikes(
    id: string,
    query: UserRetrieveLikesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/likes`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * List media tweets posted by a user
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.users.retrieveMedia(
   *   'id',
   * );
   * ```
   */
  retrieveMedia(
    id: string,
    query: UserRetrieveMediaParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/media`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * List tweets mentioning a user
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.users.retrieveMentions('id');
   * ```
   */
  retrieveMentions(
    id: string,
    query: UserRetrieveMentionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/mentions`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * Returns the user's timeline with replies included by default.
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.users.retrieveReplies('id');
   * ```
   */
  retrieveReplies(
    id: string,
    query: UserRetrieveRepliesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/replies`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * Search users by name or username
   *
   * @example
   * ```ts
   * const paginatedUsers = await client.x.users.retrieveSearch({
   *   q: 'q',
   * });
   * ```
   */
  retrieveSearch(
    query: UserRetrieveSearchParams,
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get('/x/users/search', {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * List recent tweets posted by a user
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.users.retrieveTweets(
   *   'id',
   * );
   * ```
   */
  retrieveTweets(
    id: string,
    query: UserRetrieveTweetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/users/${id}/tweets`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * List verified followers of a user
   *
   * @example
   * ```ts
   * const paginatedUsers =
   *   await client.x.users.retrieveVerifiedFollowers('id');
   * ```
   */
  retrieveVerifiedFollowers(
    id: string,
    query: UserRetrieveVerifiedFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedUsers> {
    return this._client.get(path`/x/users/${id}/verified-followers`, {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }
}

export interface UserRemoveFollowerResponse {
  success: true;
}

/**
 * Batch user lookup results. Duplicate requested IDs are ignored while preserving
 * first-seen order. unavailable_ids identifies processed IDs with no returned
 * profile. unprocessed_ids identifies IDs skipped when available credits limit
 * processing.
 */
export interface UserRetrieveBatchResponse {
  /**
   * Batch lookups never paginate.
   */
  has_next_page: false;

  /**
   * Empty because batch lookups never paginate.
   */
  next_cursor: string;

  /**
   * Number of requested IDs included in the lookup.
   */
  processed_count: number;

  /**
   * Number of unique IDs requested.
   */
  requested_count: number;

  /**
   * Number of user profiles returned and charged.
   */
  returned_count: number;

  /**
   * Processed IDs with no returned profile, in first-seen request order.
   */
  unavailable_ids: Array<string>;

  /**
   * Requested IDs skipped because available credits limited processing. Retry these
   * IDs after adding credits.
   */
  unprocessed_ids: Array<string>;

  users: Array<Shared.UserProfile>;
}

export interface UserRemoveFollowerParams {
  /**
   * X account identifier (@username or account ID)
   */
  account: string;
}

export interface UserRetrieveBatchParams {
  /**
   * Comma-separated numeric user IDs (1-100 values). Duplicate IDs are ignored while
   * preserving first-seen order.
   */
  ids: string;
}

export interface UserRetrieveFollowersParams {
  /**
   * Legacy cursor alias. Prefer cursor.
   */
  after?: string;

  /**
   * Pagination cursor for followers list
   */
  cursor?: string;

  /**
   * Legacy integer page size alias for following lists. Prefer pageSize.
   */
  limit?: number;

  /**
   * Maximum user profiles requested from this page (20-200, default 200). The
   * response can contain fewer profiles because the source returned fewer or
   * remaining credits cover fewer results. Keep requesting next_cursor while
   * has_next_page is true. The deprecated limit and count aliases remain accepted.
   */
  pageSize?: number;
}

export interface UserRetrieveFollowersYouKnowParams {
  /**
   * Pagination cursor for followers-you-know
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

export interface UserRetrieveFollowingParams {
  /**
   * Legacy cursor alias. Prefer cursor.
   */
  after?: string;

  /**
   * Pagination cursor for following list
   */
  cursor?: string;

  /**
   * Legacy page size alias. Prefer pageSize.
   */
  limit?: number;

  /**
   * Maximum user profiles requested from this page (20-200, default 200). The
   * response can contain fewer profiles because the source returned fewer or
   * remaining credits cover fewer results. Keep requesting next_cursor while
   * has_next_page is true. The deprecated limit and count aliases remain accepted.
   */
  pageSize?: number;
}

export interface UserRetrieveLikesParams {
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
   * Pagination cursor for liked tweets
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
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;
}

export interface UserRetrieveMediaParams {
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
   * Pagination cursor for media tweets
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
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;
}

export interface UserRetrieveMentionsParams {
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
   * Pagination cursor for mentions
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
   * Unix timestamp - return mentions after this time
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
   * Unix timestamp - return mentions before this time
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

export interface UserRetrieveRepliesParams {
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
   * Pagination cursor for user replies
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
   * Include parent tweet for replies
   */
  includeParentTweet?: boolean;

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
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;
}

export interface UserRetrieveSearchParams {
  /**
   * User search query
   */
  q: string;

  /**
   * Pagination cursor for user search
   */
  cursor?: string;
}

export interface UserRetrieveTweetsParams {
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
   * Pagination cursor for user tweets
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
   * Include parent tweet for replies
   */
  includeParentTweet?: boolean;

  /**
   * Include reply tweets
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
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format.
   */
  untilDate?: string;

  /**
   * URL substring or domain filter.
   */
  url?: string;

  /**
   * Only return tweets from verified authors.
   */
  verifiedOnly?: boolean;
}

export interface UserRetrieveVerifiedFollowersParams {
  /**
   * Pagination cursor for verified followers
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

Users.Follow = Follow;

export declare namespace Users {
  export {
    type UserRemoveFollowerResponse as UserRemoveFollowerResponse,
    type UserRetrieveBatchResponse as UserRetrieveBatchResponse,
    type UserRemoveFollowerParams as UserRemoveFollowerParams,
    type UserRetrieveBatchParams as UserRetrieveBatchParams,
    type UserRetrieveFollowersParams as UserRetrieveFollowersParams,
    type UserRetrieveFollowersYouKnowParams as UserRetrieveFollowersYouKnowParams,
    type UserRetrieveFollowingParams as UserRetrieveFollowingParams,
    type UserRetrieveLikesParams as UserRetrieveLikesParams,
    type UserRetrieveMediaParams as UserRetrieveMediaParams,
    type UserRetrieveMentionsParams as UserRetrieveMentionsParams,
    type UserRetrieveRepliesParams as UserRetrieveRepliesParams,
    type UserRetrieveSearchParams as UserRetrieveSearchParams,
    type UserRetrieveTweetsParams as UserRetrieveTweetsParams,
    type UserRetrieveVerifiedFollowersParams as UserRetrieveVerifiedFollowersParams,
  };

  export {
    Follow as Follow,
    type FollowCreateResponse as FollowCreateResponse,
    type FollowDeleteAllResponse as FollowDeleteAllResponse,
    type FollowCreateParams as FollowCreateParams,
    type FollowDeleteAllParams as FollowDeleteAllParams,
  };
}
