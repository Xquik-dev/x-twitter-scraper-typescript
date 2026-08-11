// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

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
   * Article metadata attached to a tweet.
   */
  article?: EmbeddedTweet.Article;

  /**
   * X user profile with bio, follower counts, and verification status.
   */
  author?: UserProfile;

  /**
   * Public card metadata attached to a tweet.
   */
  card?: EmbeddedTweet.Card;

  /**
   * Community Note presentation metadata returned by X.
   */
  communityNote?: EmbeddedTweet.CommunityNote;

  /**
   * Content disclosure metadata shown by X when a tweet is labeled as paid
   * partnership content or AI-generated media.
   */
  contentDisclosure?: ContentDisclosure;

  conversationId?: string;

  createdAt?: string;

  displayTextRange?: Array<number>;

  /**
   * Edit history metadata returned by X.
   */
  edit?: EmbeddedTweet.Edit;

  entities?: { [key: string]: unknown };

  inReplyToId?: string;

  inReplyToUserId?: string;

  inReplyToUsername?: string;

  isLimitedReply?: boolean;

  isNoteTweet?: boolean;

  isQuoteStatus?: boolean;

  isReply?: boolean;

  isTranslatable?: boolean;

  lang?: string;

  media?: Array<TweetMedia>;

  /**
   * Complete Note Tweet content and rich-text metadata.
   */
  noteTweet?: EmbeddedTweet.NoteTweet;

  /**
   * Public place metadata attached to a tweet.
   */
  place?: EmbeddedTweet.Place;

  possiblySensitive?: boolean;

  /**
   * Engagement counts retained from a prior tweet edit.
   */
  previousCounts?: EmbeddedTweet.PreviousCounts;

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

  source?: string;

  type?: string;

  url?: string;

  viewState?: string;
}

export namespace EmbeddedTweet {
  /**
   * Article metadata attached to a tweet.
   */
  export interface Article {
    id?: string;

    coverMediaUrl?: string;

    previewText?: string;

    title?: string;
  }

  /**
   * Public card metadata attached to a tweet.
   */
  export interface Card {
    id?: string;

    bindingValues?: { [key: string]: unknown };

    name?: string;

    url?: string;
  }

  /**
   * Community Note presentation metadata returned by X.
   */
  export interface CommunityNote {
    id?: string;

    destinationUrl?: string;

    footer?: string;

    shortTitle?: string;

    subtitle?: string;

    title?: string;

    visualStyle?: string;
  }

  /**
   * Edit history metadata returned by X.
   */
  export interface Edit {
    editableUntilMsecs?: string;

    editTweetIds?: Array<string>;
  }

  /**
   * Complete Note Tweet content and rich-text metadata.
   */
  export interface NoteTweet {
    text: string;

    id?: string;

    entities?: { [key: string]: unknown };

    isExpandable?: boolean;

    richtextTags?: Array<NoteTweet.RichtextTag>;
  }

  export namespace NoteTweet {
    export interface RichtextTag {
      fromIndex: number;

      toIndex: number;

      types: Array<string>;
    }
  }

  /**
   * Public place metadata attached to a tweet.
   */
  export interface Place {
    id?: string;

    boundingBox?: { [key: string]: unknown };

    country?: string;

    countryCode?: string;

    fullName?: string;

    name?: string;

    placeType?: string;

    url?: string;
  }

  /**
   * Engagement counts retained from a prior tweet edit.
   */
  export interface PreviousCounts {
    bookmarkCount?: number;

    likeCount?: number;

    quoteCount?: number;

    replyCount?: number;

    retweetCount?: number;
  }
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
    | 'monitor_profile_unavailable'
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
    | 'coverage_cursor_gone'
    | 'coverage_cursor_unavailable'
    | 'draft_not_found'
    | 'favoriters_unavailable'
    | 'forbidden'
    | 'guest_wallet_unavailable'
    | 'guest_wallets_disabled'
    | 'guest_wallets_unavailable'
    | 'idempotency_conflict'
    | 'idempotency_key_conflict'
    | 'invalid_community_id'
    | 'invalid_coverage_cursor'
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
      | 'monitor_profile_unavailable'
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
      | 'coverage_cursor_gone'
      | 'coverage_cursor_unavailable'
      | 'draft_not_found'
      | 'favoriters_unavailable'
      | 'forbidden'
      | 'guest_wallet_unavailable'
      | 'guest_wallets_disabled'
      | 'guest_wallets_unavailable'
      | 'idempotency_conflict'
      | 'idempotency_key_conflict'
      | 'invalid_community_id'
      | 'invalid_coverage_cursor'
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
 * No-mode search, user Tweet, user reply, and direct reply reads use automatic
 * coverage. Shape, filters, aliases, and billing stay compatible. Unprefixed
 * cursors remain legacy. Follow next_cursor while has_next_page is true. An empty
 * filtered page can still have has_next_page true.
 */
export interface PaginatedTweets {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<SearchTweet>;
}

/**
 * Paginated user profiles. No-mode follower, following, and verified follower
 * requests merge independent views automatically. Response fields, page size,
 * aliases, filters, and per-returned-profile billing stay unchanged. Existing
 * unprefixed cursors retain legacy behavior. Follow next_cursor while
 * has_next_page is true.
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
   * Article metadata attached to a tweet.
   */
  article?: SearchTweet.Article;

  /**
   * X user profile with bio, follower counts, and verification status.
   */
  author?: UserProfile;

  /**
   * Public card metadata attached to a tweet.
   */
  card?: SearchTweet.Card;

  /**
   * Community Note presentation metadata returned by X.
   */
  communityNote?: SearchTweet.CommunityNote;

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
   * Edit history metadata returned by X.
   */
  edit?: SearchTweet.Edit;

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

  isTranslatable?: boolean;

  /**
   * Search result language code.
   */
  lang?: string;

  /**
   * Search-result media attachments, omitted when no media is present
   */
  media?: Array<TweetMedia>;

  /**
   * Complete Note Tweet content and rich-text metadata.
   */
  noteTweet?: SearchTweet.NoteTweet;

  /**
   * Public place metadata attached to a tweet.
   */
  place?: SearchTweet.Place;

  possiblySensitive?: boolean;

  /**
   * Engagement counts retained from a prior tweet edit.
   */
  previousCounts?: SearchTweet.PreviousCounts;

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

  viewState?: string;
}

export namespace SearchTweet {
  /**
   * Article metadata attached to a tweet.
   */
  export interface Article {
    id?: string;

    coverMediaUrl?: string;

    previewText?: string;

    title?: string;
  }

  /**
   * Public card metadata attached to a tweet.
   */
  export interface Card {
    id?: string;

    bindingValues?: { [key: string]: unknown };

    name?: string;

    url?: string;
  }

  /**
   * Community Note presentation metadata returned by X.
   */
  export interface CommunityNote {
    id?: string;

    destinationUrl?: string;

    footer?: string;

    shortTitle?: string;

    subtitle?: string;

    title?: string;

    visualStyle?: string;
  }

  /**
   * Edit history metadata returned by X.
   */
  export interface Edit {
    editableUntilMsecs?: string;

    editTweetIds?: Array<string>;
  }

  /**
   * Complete Note Tweet content and rich-text metadata.
   */
  export interface NoteTweet {
    text: string;

    id?: string;

    entities?: { [key: string]: unknown };

    isExpandable?: boolean;

    richtextTags?: Array<NoteTweet.RichtextTag>;
  }

  export namespace NoteTweet {
    export interface RichtextTag {
      fromIndex: number;

      toIndex: number;

      types: Array<string>;
    }
  }

  /**
   * Public place metadata attached to a tweet.
   */
  export interface Place {
    id?: string;

    boundingBox?: { [key: string]: unknown };

    country?: string;

    countryCode?: string;

    fullName?: string;

    name?: string;

    placeType?: string;

    url?: string;
  }

  /**
   * Engagement counts retained from a prior tweet edit.
   */
  export interface PreviousCounts {
    bookmarkCount?: number;

    likeCount?: number;

    quoteCount?: number;

    replyCount?: number;

    retweetCount?: number;
  }
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
   * X media entity ID.
   */
  id?: string;

  /**
   * Whether X permits direct media download.
   */
  allowDownload?: boolean;

  /**
   * Accessibility text supplied for the media.
   */
  altText?: string;

  /**
   * Video aspect ratio as width and height.
   */
  aspectRatio?: Array<number>;

  /**
   * Media availability state reported by X.
   */
  availabilityStatus?: string;

  /**
   * Display-friendly media URL reported by X.
   */
  displayUrl?: string;

  /**
   * Video duration in milliseconds.
   */
  durationMillis?: number;

  /**
   * Expanded X media URL.
   */
  expandedUrl?: string;

  /**
   * Face-aware crop rectangles grouped by media size.
   */
  faceRects?: { [key: string]: Array<TweetMedia.FaceRect> };

  /**
   * Suggested image crops reported by X.
   */
  focusRects?: Array<TweetMedia.FocusRect>;

  /**
   * Original media height.
   */
  height?: number;

  /**
   * Media entity offsets in the tweet text.
   */
  indices?: Array<number>;

  /**
   * Stable X media key.
   */
  mediaKey?: string;

  /**
   * Whether X reports the media as monetizable.
   */
  monetizable?: boolean;

  /**
   * Named media renditions and resize modes.
   */
  sizes?: { [key: string]: TweetMedia.Sizes };

  /**
   * Available video encodings, ordered as returned
   */
  videoVariants?: Array<TweetMedia.VideoVariant>;

  /**
   * Original media width.
   */
  width?: number;
}

export namespace TweetMedia {
  export interface FaceRect {
    h: number;

    w: number;

    x: number;

    y: number;
  }

  export interface FocusRect {
    h: number;

    w: number;

    x: number;

    y: number;
  }

  export interface Sizes {
    h: number;

    resize: string;

    w: number;
  }

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

  /**
   * Organization affiliation label shown on an X profile.
   */
  affiliatesHighlightedLabel?: UserProfile.AffiliatesHighlightedLabel;

  automatedBy?: string;

  businessAccountAffiliatesCount?: number;

  /**
   * Community role when returned by community member reads
   */
  communityRole?: string;

  coverPicture?: string;

  createdAt?: string;

  creatorSubscriptionsCount?: number;

  description?: string;

  favouritesCount?: number;

  followers?: number;

  following?: number;

  hasCustomTimelines?: boolean;

  hasGraduatedAccess?: boolean;

  hasHiddenSubscriptionsOnProfile?: boolean;

  /**
   * Profile highlight availability and count metadata.
   */
  highlightsInfo?: UserProfile.HighlightsInfo;

  /**
   * Identity verification metadata displayed by X.
   */
  identityVerification?: UserProfile.IdentityVerification;

  isAutomated?: boolean;

  /**
   * Whether X shows a blue verification badge
   */
  isBlueVerified?: boolean;

  isProfileTranslatable?: boolean;

  isTranslator?: boolean;

  /**
   * Whether X marks the profile as verified
   */
  isVerified?: boolean;

  location?: string;

  mediaCount?: number;

  parodyCommentaryFanLabel?: string;

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

  profileDescriptionLanguage?: string;

  profileImageShape?: string;

  profileInterstitialType?: string;

  profilePicture?: string;

  profileSortEnabled?: boolean;

  profileTranslatorType?: string;

  /**
   * Whether the profile protects its posts
   */
  protected?: boolean;

  statusesCount?: number;

  superFollowEligible?: boolean;

  unavailable?: boolean;

  unavailableReason?: string;

  url?: string;

  verified?: boolean;

  verifiedType?: string;

  withheldInCountries?: Array<string>;
}

export namespace UserProfile {
  /**
   * Organization affiliation label shown on an X profile.
   */
  export interface AffiliatesHighlightedLabel {
    badgeUrl?: string;

    description?: string;

    url?: string;

    urlType?: string;

    userLabelDisplayType?: string;

    userLabelType?: string;
  }

  /**
   * Profile highlight availability and count metadata.
   */
  export interface HighlightsInfo {
    canHighlightTweets?: boolean;

    highlightedTweets?: string;
  }

  /**
   * Identity verification metadata displayed by X.
   */
  export interface IdentityVerification {
    description?: string;

    isIdentityVerified?: boolean;

    verifiedSinceMsec?: string;
  }
}
