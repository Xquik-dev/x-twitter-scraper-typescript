// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as TweetsAPI from './x/tweets/tweets';
import * as UsersAPI from './x/users/users';

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
    | 'missing_params'
    | 'missing_query'
    | 'monitor_already_exists'
    | 'monitor_limit_reached'
    | 'no_subscription'
    | 'not_found'
    | 'stream_registration_failed'
    | 'subscription_inactive'
    | 'tweet_not_found'
    | 'unauthenticated'
    | 'usage_limit_reached'
    | 'user_not_found'
    | 'webhook_inactive'
    | 'x_api_rate_limited'
    | 'x_api_unavailable'
    | 'x_api_unauthorized';
}

/**
 * Type of monitor event fired when account activity occurs.
 */
export type EventType =
  | 'tweet.new'
  | 'tweet.reply'
  | 'tweet.retweet'
  | 'tweet.quote'
  | 'follower.gained'
  | 'follower.lost';

/**
 * Paginated list of tweets with cursor-based navigation.
 */
export interface PaginatedTweets {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<TweetsAPI.SearchTweet>;
}

/**
 * Paginated list of user profiles with cursor-based navigation.
 */
export interface PaginatedUsers {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UsersAPI.UserProfile>;
}
