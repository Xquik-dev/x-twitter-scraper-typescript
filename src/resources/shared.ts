// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * Content disclosure metadata shown by X when a tweet is labeled as paid
 * partnership content or AI-generated media.
 */
export interface ContentDisclosure {
  advertising?: ContentDisclosure.Advertising;

  aiGenerated?: ContentDisclosure.AIGenerated;
}

export namespace ContentDisclosure {
  export interface Advertising {
    /**
     * True when X labels the tweet as paid promotion content.
     */
    isPaidPromotion?: boolean;
  }

  export interface AIGenerated {
    /**
     * Whether the disclosure can be edited on X.
     */
    canEdit?: boolean;

    /**
     * Source of the AI-generated media disclosure.
     */
    detectionSource?: string;

    /**
     * True when X labels the tweet as containing AI-generated media.
     */
    hasAiGeneratedMedia?: boolean;
  }
}

/**
 * Quoted or retweeted tweet context. Every object includes id, text, and
 * engagement metrics. A zero metric can mean X did not report the count. Author,
 * media, and conversation fields appear when available.
 */
export interface EmbeddedTweet {
  id: string;

  bookmarkCount: number;

  likeCount: number;

  quoteCount: number;

  replyCount: number;

  retweetCount: number;

  text: string;

  viewCount: number;

  /**
   * X user profile with bio, follower counts, and verification status.
   */
  author?: UserProfile;

  /**
   * Content disclosure metadata shown by X when a tweet is labeled as paid
   * partnership content or AI-generated media.
   */
  contentDisclosure?: ContentDisclosure;

  conversationId?: string;

  createdAt?: string;

  displayTextRange?: Array<number>;

  entities?: { [key: string]: unknown };

  inReplyToId?: string;

  inReplyToUserId?: string;

  inReplyToUsername?: string;

  isLimitedReply?: boolean;

  isNoteTweet?: boolean;

  isQuoteStatus?: boolean;

  isReply?: boolean;

  lang?: string;

  media?: Array<TweetMedia>;

  source?: string;

  type?: string;

  url?: string;
}

/**
 * Error response. Default v1 returns a legacy string error code. Send
 * `xquik-api-contract: 2026-04-29` to receive the structured best-practice error
 * object.
 */
export interface Error {
  error:
    | 'internal_error'
    | 'account_already_connected'
    | 'account_needs_reauth'
    | 'account_not_found'
    | 'account_required'
    | 'account_restricted'
    | 'api_key_limit_reached'
    | 'article_not_found'
    | 'dm_not_permitted'
    | 'invalid_format'
    | 'invalid_id'
    | 'invalid_input'
    | 'invalid_params'
    | 'invalid_tool_type'
    | 'invalid_tweet_id'
    | 'invalid_tweet_url'
    | 'invalid_user_id'
    | 'invalid_user_ids'
    | 'invalid_username'
    | 'invalid_json'
    | 'insufficient_credits'
    | 'login_cooldown'
    | 'login_failed'
    | 'media_download_failed'
    | 'missing_params'
    | 'missing_query'
    | 'monitor_already_exists'
    | 'no_media'
    | 'no_credits'
    | 'no_subscription'
    | 'not_found'
    | 'payment_failed'
    | 'rate_limit_exceeded'
    | 'service_unavailable'
    | 'style_not_found'
    | 'subscription_inactive'
    | 'tweet_not_found'
    | 'unauthenticated'
    | 'unsupported_field'
    | 'user_not_found'
    | 'body_too_large'
    | 'checkout_unavailable'
    | 'connection_challenge_expired'
    | 'connection_challenge_inactive'
    | 'draft_not_found'
    | 'favoriters_unavailable'
    | 'forbidden'
    | 'guest_wallet_unavailable'
    | 'guest_wallets_disabled'
    | 'guest_wallets_unavailable'
    | 'idempotency_conflict'
    | 'idempotency_key_conflict'
    | 'invalid_community_id'
    | 'invalid_idempotency_key'
    | 'invalid_list_id'
    | 'invalid_payment_amount'
    | 'invalid_range'
    | 'login_rate_limited'
    | 'missing_idempotency_key'
    | 'missing_ids'
    | 'no_cached_style'
    | 'passkey_required'
    | 'rate_limited'
    | 'read_request_timeout'
    | 'replies_incomplete'
    | 'support_media_rate_limit'
    | 'support_request_rate_limit'
    | 'too_many_ids'
    | 'unknown_field'
    | 'unsupported_media_type'
    | 'webhook_inactive'
    | 'write_tracking_unavailable'
    | 'x_write_unconfirmed'
    | 'x_account_feature_required'
    | 'x_account_protected'
    | 'x_account_suspended'
    | 'x_api_rate_limited'
    | 'x_api_unavailable'
    | 'x_api_unauthorized'
    | 'x_auth_failure'
    | 'x_content_too_long'
    | 'x_daily_limit'
    | 'x_dm_not_allowed'
    | 'x_duplicate_action'
    | 'x_login_auth_failed'
    | 'x_login_challenge'
    | 'x_login_denied'
    | 'x_login_failed'
    | 'x_login_proxy_error'
    | 'x_login_rate_limited'
    | 'x_login_service_unavailable'
    | 'x_login_suspended'
    | 'x_rate_limited'
    | 'x_rejected'
    | 'x_target_not_found'
    | 'x_transient_error'
    | 'x_user_lookup_failed'
    | 'x_write_ambiguous'
    | 'x_write_failed'
    | Error.StructuredError;

  /**
   * Human-readable error guidance.
   */
  message?: string;

  /**
   * Machine-readable reason for a login cooldown.
   */
  reason?: string;

  /**
   * Seconds until the next permitted request.
   */
  retryAfter?: number;

  /**
   * Required wait in milliseconds.
   */
  retryAfterMs?: number;
}

export namespace Error {
  export interface StructuredError {
    code:
      | 'internal_error'
      | 'account_already_connected'
      | 'account_needs_reauth'
      | 'account_not_found'
      | 'account_required'
      | 'account_restricted'
      | 'api_key_limit_reached'
      | 'article_not_found'
      | 'dm_not_permitted'
      | 'invalid_format'
      | 'invalid_id'
      | 'invalid_input'
      | 'invalid_params'
      | 'invalid_tool_type'
      | 'invalid_tweet_id'
      | 'invalid_tweet_url'
      | 'invalid_user_id'
      | 'invalid_user_ids'
      | 'invalid_username'
      | 'invalid_json'
      | 'insufficient_credits'
      | 'login_cooldown'
      | 'login_failed'
      | 'media_download_failed'
      | 'missing_params'
      | 'missing_query'
      | 'monitor_already_exists'
      | 'no_media'
      | 'no_credits'
      | 'no_subscription'
      | 'not_found'
      | 'payment_failed'
      | 'rate_limit_exceeded'
      | 'service_unavailable'
      | 'style_not_found'
      | 'subscription_inactive'
      | 'tweet_not_found'
      | 'unauthenticated'
      | 'unsupported_field'
      | 'user_not_found'
      | 'body_too_large'
      | 'checkout_unavailable'
      | 'connection_challenge_expired'
      | 'connection_challenge_inactive'
      | 'draft_not_found'
      | 'favoriters_unavailable'
      | 'forbidden'
      | 'guest_wallet_unavailable'
      | 'guest_wallets_disabled'
      | 'guest_wallets_unavailable'
      | 'idempotency_conflict'
      | 'idempotency_key_conflict'
      | 'invalid_community_id'
      | 'invalid_idempotency_key'
      | 'invalid_list_id'
      | 'invalid_payment_amount'
      | 'invalid_range'
      | 'login_rate_limited'
      | 'missing_idempotency_key'
      | 'missing_ids'
      | 'no_cached_style'
      | 'passkey_required'
      | 'rate_limited'
      | 'read_request_timeout'
      | 'replies_incomplete'
      | 'support_media_rate_limit'
      | 'support_request_rate_limit'
      | 'too_many_ids'
      | 'unknown_field'
      | 'unsupported_media_type'
      | 'webhook_inactive'
      | 'write_tracking_unavailable'
      | 'x_write_unconfirmed'
      | 'x_account_feature_required'
      | 'x_account_protected'
      | 'x_account_suspended'
      | 'x_api_rate_limited'
      | 'x_api_unavailable'
      | 'x_api_unauthorized'
      | 'x_auth_failure'
      | 'x_content_too_long'
      | 'x_daily_limit'
      | 'x_dm_not_allowed'
      | 'x_duplicate_action'
      | 'x_login_auth_failed'
      | 'x_login_challenge'
      | 'x_login_denied'
      | 'x_login_failed'
      | 'x_login_proxy_error'
      | 'x_login_rate_limited'
      | 'x_login_service_unavailable'
      | 'x_login_suspended'
      | 'x_rate_limited'
      | 'x_rejected'
      | 'x_target_not_found'
      | 'x_transient_error'
      | 'x_user_lookup_failed'
      | 'x_write_ambiguous'
      | 'x_write_failed';

    message: string;

    type:
      | 'api_error'
      | 'authentication_error'
      | 'billing_error'
      | 'dependency_error'
      | 'invalid_request_error'
      | 'permission_error'
      | 'rate_limit_error';
  }
}

/**
 * Type of monitor event fired when account activity occurs.
 */
export type EventType =
  | 'tweet.new'
  | 'tweet.reply'
  | 'tweet.retweet'
  | 'tweet.quote'
  | 'tweet.media'
  | 'tweet.link'
  | 'tweet.poll'
  | 'tweet.mention'
  | 'tweet.hashtag'
  | 'tweet.longform'
  | 'profile.avatar.changed'
  | 'profile.banner.changed'
  | 'profile.name.changed'
  | 'profile.username.changed'
  | 'profile.bio.changed'
  | 'profile.location.changed'
  | 'profile.url.changed'
  | 'profile.verified.changed'
  | 'profile.protected.changed'
  | 'profile.pinned_tweet.changed'
  | 'profile.unavailable.changed';

/**
 * Paginated tweet results. The item count can be lower than pageSize when the
 * source returns fewer tweets, filters remove tweets, or the available usage balance covers
 * fewer results. Follow next_cursor while has_next_page is true. An empty page can
 * still have has_next_page true after filtering. Zero affordable results returns
 * 402 insufficient_credits.
 */
export interface PaginatedTweets {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<SearchTweet>;
}

/**
 * Paginated user profiles. The item count can be lower than pageSize when the
 * source returns fewer profiles or the available usage balance covers fewer results. Follow
 * next_cursor while has_next_page is true. A relationship can naturally contain
 * fewer profiles than requested. Zero affordable results returns 402
 * insufficient_credits.
 */
export interface PaginatedUsers {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UserProfile>;
}

/**
 * Tweet returned from search results with inline author info. A zero metric can
 * mean X did not report the count.
 */
export interface SearchTweet {
  id: string;

  bookmarkCount: number;

  likeCount: number;

  quoteCount: number;

  replyCount: number;

  retweetCount: number;

  text: string;

  viewCount: number;

  /**
   * X user profile with bio, follower counts, and verification status.
   */
  author?: UserProfile;

  /**
   * Content disclosure metadata shown by X when a tweet is labeled as paid
   * partnership content or AI-generated media.
   */
  contentDisclosure?: ContentDisclosure;

  /**
   * Root tweet ID for the search result conversation
   */
  conversationId?: string;

  createdAt?: string;

  /**
   * Rendered text's start and end offsets.
   */
  displayTextRange?: Array<number>;

  /**
   * Parsed search-result entities including URLs, mentions, hashtags, and media
   * markers
   */
  entities?: { [key: string]: unknown };

  /**
   * ID of the tweet this result replies to.
   */
  inReplyToId?: string;

  /**
   * ID of the user this result replies to.
   */
  inReplyToUserId?: string;

  /**
   * Username this result replies to.
   */
  inReplyToUsername?: string;

  /**
   * Whether the tweet has limited reply permissions
   */
  isLimitedReply?: boolean;

  /**
   * True for Note Tweets (long-form content, up to 25,000 characters)
   */
  isNoteTweet?: boolean;

  /**
   * True when this search result quotes another tweet
   */
  isQuoteStatus?: boolean;

  /**
   * True when this search result is a reply
   */
  isReply?: boolean;

  /**
   * Search result language code.
   */
  lang?: string;

  /**
   * Search-result media attachments, omitted when no media is present
   */
  media?: Array<TweetMedia>;

  /**
   * Quoted or retweeted tweet context. Every object includes id, text, and
   * engagement metrics. A zero metric can mean X did not report the count. Author,
   * media, and conversation fields appear when available.
   */
  quoted_tweet?: EmbeddedTweet;

  /**
   * Quoted or retweeted tweet context. Every object includes id, text, and
   * engagement metrics. A zero metric can mean X did not report the count. Author,
   * media, and conversation fields appear when available.
   */
  retweeted_tweet?: EmbeddedTweet;

  /**
   * Client application used to post the tweet
   */
  source?: string;

  type?: string;

  /**
   * Search result permalink.
   */
  url?: string;
}

/**
 * Normalized media attached to a tweet.
 */
export interface TweetMedia {
  /**
   * Media preview URL
   */
  mediaUrl: string;

  type: 'photo' | 'video' | 'animated_gif';

  /**
   * X media link from the tweet
   */
  url: string;

  /**
   * Available video encodings, ordered as returned
   */
  videoVariants?: Array<TweetMedia.VideoVariant>;
}

export namespace TweetMedia {
  export interface VideoVariant {
    contentType: string;

    url: string;

    bitrate?: number;
  }
}

/**
 * X user profile with bio, follower counts, and verification status.
 */
export interface UserProfile {
  id: string;

  name: string;

  username: string;

  automatedBy?: string;

  canDm?: boolean;

  /**
   * Community role when returned by community member reads
   */
  communityRole?: string;

  coverPicture?: string;

  createdAt?: string;

  description?: string;

  favouritesCount?: number;

  followers?: number;

  following?: number;

  hasCustomTimelines?: boolean;

  isAutomated?: boolean;

  /**
   * Whether X shows a blue verification badge
   */
  isBlueVerified?: boolean;

  isTranslator?: boolean;

  /**
   * Whether X marks the profile as verified
   */
  isVerified?: boolean;

  location?: string;

  mediaCount?: number;

  pinnedTweetIds?: Array<string>;

  possiblySensitive?: boolean;

  /**
   * Structured profile bio with entity annotations
   */
  profile_bio?: { [key: string]: unknown };

  /**
   * Original X profile banner field when available
   */
  profileBannerUrl?: string;

  profilePicture?: string;

  /**
   * Whether the profile protects its posts
   */
  protected?: boolean;

  statusesCount?: number;

  unavailable?: boolean;

  unavailableReason?: string;

  url?: string;

  verified?: boolean;

  verifiedType?: string;

  /**
   * Whether this profile follows the authenticated viewer
   */
  viewerFollowedBy?: boolean;

  /**
   * Whether the authenticated viewer follows this profile
   */
  viewerFollowing?: boolean;

  withheldInCountries?: Array<string>;
}
