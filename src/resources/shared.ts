// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * Error response containing a machine-readable error code.
 */
export interface Error {
  error:
    | 'internal_error'
    | 'invalid_format'
    | 'invalid_id'
    | 'invalid_input'
    | 'invalid_params'
    | 'invalid_tool_type'
    | 'invalid_tweet_id'
    | 'invalid_tweet_url'
    | 'invalid_username'
    | 'insufficient_credits'
    | 'missing_params'
    | 'missing_query'
    | 'monitor_already_exists'
    | 'monitor_limit_reached'
    | 'no_credits'
    | 'no_subscription'
    | 'not_found'
    | 'subscription_inactive'
    | 'tweet_not_found'
    | 'unauthenticated'
    | 'user_not_found'
    | 'webhook_inactive'
    | 'x_api_rate_limited'
    | 'x_api_unavailable'
    | 'x_api_unauthorized';
}

/**
 * Type of monitor event fired when account activity occurs.
 */
export type EventType = 'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote';

/**
 * Paginated list of tweets with cursor-based navigation.
 */
export interface PaginatedTweets {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<SearchTweet>;
}

/**
 * Paginated list of user profiles with cursor-based navigation.
 */
export interface PaginatedUsers {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UserProfile>;
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
 * X user profile with bio, follower counts, and verification status.
 */
export interface UserProfile {
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
