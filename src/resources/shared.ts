// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as Shared from './shared';

/**
 * Public X Community, as every Community read returns it.
 */
export interface Community {
  /**
   * Unique community identifier
   */
  id: string;

  /**
   * Whether the community is marked sensitive
   */
  is_nsfw: boolean;

  /**
   * Total member count
   */
  member_count: number;

  /**
   * Display name of the community
   */
  name: string;

  /**
   * Public X profile.
   */
  admin?: UserProfile;

  /**
   * The banner X shows for a community, with its size & colors.
   */
  banner?: Community.Banner;

  /**
   * Community banner image URL
   */
  banner_url?: string;

  /**
   * Community creation timestamp
   */
  created_at?: string;

  /**
   * The creator's public profile, or the ID, username and badge alone when X sends
   * no profile
   */
  creator?: UserProfile | Community.UnionMember1;

  /**
   * About text for the community
   */
  description?: string;

  /**
   * Invitation policy
   */
  invites_policy?: string;

  /**
   * Join policy (open or restricted)
   */
  join_policy?: string;

  /**
   * The members X previews beside the member count. A keyword or topic result gives
   * each member's ID & picture only.
   */
  membersFacepile?: Array<UserProfile | Community.CommunityMemberPreview>;

  /**
   * Total moderator count
   */
  moderator_count?: number;

  /**
   * Primary topic. Its id is absent when X lists the community in a keyword or topic
   * result.
   */
  primary_topic?: Community.PrimaryTopic;

  /**
   * What the community asks a user who joins
   */
  question?: string;

  /**
   * Community rules
   */
  rules?: Array<Community.Rule>;

  /**
   * Tags X finds the community by
   */
  searchTags?: Array<string>;
}

export namespace Community {
  /**
   * The banner X shows for a community, with its size & colors.
   */
  export interface Banner {
    /**
     * Banner image URL at its original size
     */
    url: string;

    /**
     * Main colors of the banner, largest share first
     */
    colors?: Array<Banner.Color>;

    /**
     * Area X keeps in view when it crops the banner, in pixels from the top left
     */
    focus?: Banner.Focus;

    /**
     * Banner height in pixels
     */
    height?: number;

    /**
     * Banner width in pixels
     */
    width?: number;
  }

  export namespace Banner {
    export interface Color {
      /**
       * Blue value of the color
       */
      blue: number;

      /**
       * Green value of the color
       */
      green: number;

      /**
       * Share of the banner in this color
       */
      percentage: number;

      /**
       * Red value of the color
       */
      red: number;
    }

    /**
     * Area X keeps in view when it crops the banner, in pixels from the top left
     */
    export interface Focus {
      /**
       * Height of the area
       */
      height?: number;

      /**
       * Distance from the left edge
       */
      left?: number;

      /**
       * Distance from the top edge
       */
      top?: number;

      /**
       * Width of the area
       */
      width?: number;
    }
  }

  export interface UnionMember1 {
    /**
     * Numeric X user ID of the creator
     */
    id: string;

    /**
     * X username of the creator
     */
    username: string;

    /**
     * Whether X shows the creator a badge
     */
    verified: boolean;
  }

  /**
   * A member X previews by ID & profile picture only.
   */
  export interface CommunityMemberPreview {
    /**
     * Numeric X user ID of the member
     */
    id: string;

    /**
     * Profile picture URL of the member
     */
    profilePicture?: string;
  }

  /**
   * Primary topic. Its id is absent when X lists the community in a keyword or topic
   * result.
   */
  export interface PrimaryTopic {
    /**
     * Topic name X shows on the community
     */
    name: string;

    /**
     * Topic ID that /x/communities/popular takes
     */
    id?: string;
  }

  export interface Rule {
    /**
     * Rule ID
     */
    id?: string;

    /**
     * What the rule asks of members
     */
    description?: string;

    /**
     * Rule title
     */
    name?: string;
  }
}

/**
 * 1 page of X Communities, in X's order.
 */
export interface CommunityPage {
  /**
   * Communities in X's order
   */
  communities: Array<Community>;

  /**
   * Whether another page of communities follows
   */
  has_next_page: boolean;

  /**
   * Cursor for the next page of communities. Empty at the end.
   */
  next_cursor: string;
}

/**
 * A topic X groups communities under, with its subtopics.
 */
export interface CommunityTopic {
  /**
   * Topic ID. Pass it as topicId to /x/communities/popular.
   */
  id: string;

  /**
   * Topic name, which topic on /x/communities/popular takes
   */
  name: string;

  /**
   * Narrower topics inside this topic
   */
  subtopics: Array<CommunityTopic.Subtopic>;
}

export namespace CommunityTopic {
  export interface Subtopic {
    /**
     * Subtopic ID, which topicId also takes
     */
    id: string;

    /**
     * Subtopic name, which topic also takes
     */
    name: string;
  }
}

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
     * How X detected AI media. X omits it for self-declared posts.
     */
    detectionSource?: string;

    /**
     * True when X labels the tweet as containing AI-generated media.
     */
    hasAiGeneratedMedia?: boolean;
  }
}

/**
 * A parent, quoted or retweeted tweet. It has the TweetPublicData fields and an
 * author. Nesting stops after 4 levels.
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
   * Public X profile.
   */
  author?: UserProfile;

  [k: string]: unknown;
}

/**
 * Error response. Default v1 returns a legacy string code. Send
 * `xquik-api-contract: 2026-04-29` for the structured best-practice error object.
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
    | 'closed'
    | 'dm_not_permitted'
    | 'invalid_format'
    | 'invalid_id'
    | 'invalid_input'
    | 'invalid_media_url'
    | 'invalid_message_id'
    | 'invalid_params'
    | 'invalid_tool_type'
    | 'invalid_tweet_id'
    | 'invalid_tweet_url'
    | 'invalid_user_id'
    | 'invalid_user_ids'
    | 'invalid_username'
    | 'invalid_json'
    | 'insufficient_credits'
    | 'job_not_found'
    | 'login_cooldown'
    | 'login_failed'
    | 'media_download_failed'
    | 'media_too_large'
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
    | 'bookmark_folders_unavailable'
    | 'broadcast_not_found'
    | 'checkout_unavailable'
    | 'connection_challenge_expired'
    | 'connection_challenge_inactive'
    | 'coverage_cursor_gone'
    | 'coverage_cursor_unavailable'
    | 'cursor_account_unavailable'
    | 'draft_not_found'
    | 'draw_too_large'
    | 'expired'
    | 'favoriters_unavailable'
    | 'forbidden'
    | 'guest_wallet_unavailable'
    | 'guest_wallets_disabled'
    | 'guest_wallets_unavailable'
    | 'idempotency_conflict'
    | 'idempotency_in_progress'
    | 'idempotency_key_conflict'
    | 'invalid_broadcast_id'
    | 'invalid_community_id'
    | 'invalid_community_topic'
    | 'invalid_complete_replies_request'
    | 'invalid_coverage_cursor'
    | 'invalid_coverage_request'
    | 'invalid_cursor'
    | 'invalid_idempotency_key'
    | 'invalid_job_filter'
    | 'invalid_job_id'
    | 'invalid_list_id'
    | 'invalid_output_options'
    | 'invalid_payment_amount'
    | 'invalid_range'
    | 'invalid_reply_options'
    | 'invalid_space_id'
    | 'likes_unavailable'
    | 'list_not_found'
    | 'login_rate_limited'
    | 'login_service_unavailable'
    | 'missing_idempotency_key'
    | 'missing_ids'
    | 'missing_url'
    | 'no_cached_style'
    | 'pagination_stalled'
    | 'passkey_required'
    | 'rate_limited'
    | 'read_request_timeout'
    | 'replay_unavailable'
    | 'replies_incomplete'
    | 'retweeters_incomplete'
    | 'search_unavailable'
    | 'space_canceled'
    | 'space_not_ended'
    | 'support_media_rate_limit'
    | 'support_request_rate_limit'
    | 'telegram_unavailable'
    | 'too_many_ids'
    | 'too_many_streams'
    | 'too_many_tweets'
    | 'unknown_field'
    | 'unsupported_media_combination'
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
    | 'x_automation_refused'
    | 'x_community_not_joined'
    | 'x_community_not_selectable'
    | 'x_community_post_public'
    | 'x_community_post_removed'
    | 'x_content_too_long'
    | 'x_daily_limit'
    | 'x_dm_not_allowed'
    | 'x_dm_not_deleted'
    | 'x_dm_not_sent'
    | 'x_duplicate_action'
    | 'x_login_auth_failed'
    | 'x_login_challenge'
    | 'x_login_denied'
    | 'x_login_failed'
    | 'x_login_rate_limited'
    | 'x_login_service_unavailable'
    | 'x_login_suspended'
    | 'x_image_invalid'
    | 'x_media_rejected'
    | 'x_post_not_sent'
    | 'x_rate_limited'
    | 'x_rejected'
    | 'x_reply_not_allowed'
    | 'x_reply_target_unavailable'
    | 'x_target_not_found'
    | 'x_transient_error'
    | 'x_user_lookup_failed'
    | 'x_write_ambiguous'
    | 'x_write_failed'
    | Error.StructuredError;

  /**
   * With unknown_field: the valid names where the first unknown name in fields or
   * omit stopped.
   */
  allowedFields?: Array<string>;

  /**
   * With unknown_field: each unknown name in fields or omit, with the name it most
   * likely meant.
   */
  fieldErrors?: Array<Error.FieldError>;

  /**
   * Human-readable error guidance.
   */
  message?: string;

  /**
   * Machine-readable reason. A login failure names its cause, such as
   * temporary_issue. A user_not_found answer names why X shows no profile: not_found
   * or suspended. A tweet_not_found answer names why X shows no post, when X said:
   * deleted, author_suspended or protected.
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
      | 'closed'
      | 'dm_not_permitted'
      | 'invalid_format'
      | 'invalid_id'
      | 'invalid_input'
      | 'invalid_media_url'
      | 'invalid_message_id'
      | 'invalid_params'
      | 'invalid_tool_type'
      | 'invalid_tweet_id'
      | 'invalid_tweet_url'
      | 'invalid_user_id'
      | 'invalid_user_ids'
      | 'invalid_username'
      | 'invalid_json'
      | 'insufficient_credits'
      | 'job_not_found'
      | 'login_cooldown'
      | 'login_failed'
      | 'media_download_failed'
      | 'media_too_large'
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
      | 'bookmark_folders_unavailable'
      | 'broadcast_not_found'
      | 'checkout_unavailable'
      | 'connection_challenge_expired'
      | 'connection_challenge_inactive'
      | 'coverage_cursor_gone'
      | 'coverage_cursor_unavailable'
      | 'cursor_account_unavailable'
      | 'draft_not_found'
      | 'draw_too_large'
      | 'expired'
      | 'favoriters_unavailable'
      | 'forbidden'
      | 'guest_wallet_unavailable'
      | 'guest_wallets_disabled'
      | 'guest_wallets_unavailable'
      | 'idempotency_conflict'
      | 'idempotency_in_progress'
      | 'idempotency_key_conflict'
      | 'invalid_broadcast_id'
      | 'invalid_community_id'
      | 'invalid_community_topic'
      | 'invalid_complete_replies_request'
      | 'invalid_coverage_cursor'
      | 'invalid_coverage_request'
      | 'invalid_cursor'
      | 'invalid_idempotency_key'
      | 'invalid_job_filter'
      | 'invalid_job_id'
      | 'invalid_list_id'
      | 'invalid_output_options'
      | 'invalid_payment_amount'
      | 'invalid_range'
      | 'invalid_reply_options'
      | 'invalid_space_id'
      | 'likes_unavailable'
      | 'list_not_found'
      | 'login_rate_limited'
      | 'login_service_unavailable'
      | 'missing_idempotency_key'
      | 'missing_ids'
      | 'missing_url'
      | 'no_cached_style'
      | 'pagination_stalled'
      | 'passkey_required'
      | 'rate_limited'
      | 'read_request_timeout'
      | 'replay_unavailable'
      | 'replies_incomplete'
      | 'retweeters_incomplete'
      | 'search_unavailable'
      | 'space_canceled'
      | 'space_not_ended'
      | 'support_media_rate_limit'
      | 'support_request_rate_limit'
      | 'telegram_unavailable'
      | 'too_many_ids'
      | 'too_many_streams'
      | 'too_many_tweets'
      | 'unknown_field'
      | 'unsupported_media_combination'
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
      | 'x_automation_refused'
      | 'x_community_not_joined'
      | 'x_community_not_selectable'
      | 'x_community_post_public'
      | 'x_community_post_removed'
      | 'x_content_too_long'
      | 'x_daily_limit'
      | 'x_dm_not_allowed'
      | 'x_dm_not_deleted'
      | 'x_dm_not_sent'
      | 'x_duplicate_action'
      | 'x_login_auth_failed'
      | 'x_login_challenge'
      | 'x_login_denied'
      | 'x_login_failed'
      | 'x_login_rate_limited'
      | 'x_login_service_unavailable'
      | 'x_login_suspended'
      | 'x_image_invalid'
      | 'x_media_rejected'
      | 'x_post_not_sent'
      | 'x_rate_limited'
      | 'x_rejected'
      | 'x_reply_not_allowed'
      | 'x_reply_target_unavailable'
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

  export interface FieldError {
    code: 'unknown_field';

    /**
     * The name as the request wrote it.
     */
    field: string;

    /**
     * What to send instead.
     */
    message: string;

    /**
     * The parameter that held the name.
     */
    path: 'query.fields' | 'query.omit';

    /**
     * The closest valid name, when 1 is close.
     */
    suggestion?: string;
  }
}

/**
 * Type of monitor event fired when account activity occurs. tweet.deleted fires
 * once X confirms the account deleted a post the monitor saw. Its data is the post
 * as last seen. broadcast.started & space.started fire when the account posts its
 * running live video or Space. Their data is that post. A live the account does
 * not post is not seen. following.added & following.removed fire when the account
 * follows or unfollows someone, with that account's profile. Keyword monitors take
 * the 10 post types only.
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
  | 'profile.unavailable.changed'
  | 'tweet.deleted'
  | 'broadcast.started'
  | 'space.started'
  | 'following.added'
  | 'following.removed';

/**
 * Follow next_cursor while the response reports more pages. A page can hold fewer
 * rows than its limit & still report more. That report decides, not the row count.
 * A page can be empty & still report more, filtered or not. Automatic search, user
 * Tweet & reply coverage keeps shape, filters, aliases & billing. Unprefixed
 * cursors are legacy.
 */
export interface PaginatedTweets {
  has_next_page: boolean;

  next_cursor: string;

  tweets: Array<SearchTweet>;

  /**
   * Whole number from 0.
   */
  filtered_count?: number;

  /**
   * How far back a filtered Latest search has read, in UTC. Every newer post was
   * checked, so an empty page still moves this time back.
   */
  readBackTo?: string;

  /**
   * What X shows beside a search's posts that is the same for every reader. Present
   * on a search for a cashtag X has a card for, such as $BTC.
   */
  searchContext?: PaginatedTweets.SearchContext;

  /**
   * Search q as X ran it, when Xquik fixed it.
   */
  searchedQuery?: string;

  /**
   * Present on a last page whose sources all read past its start time.
   */
  windowComplete?: true;
}

export namespace PaginatedTweets {
  /**
   * What X shows beside a search's posts that is the same for every reader. Present
   * on a search for a cashtag X has a card for, such as $BTC.
   */
  export interface SearchContext {
    /**
     * X's card for the cashtag the search names.
     */
    smartTag: SearchContext.SmartTag;
  }

  export namespace SearchContext {
    /**
     * X's card for the cashtag the search names.
     */
    export interface SmartTag {
      /**
       * The ticker X matched.
       */
      id: string;

      /**
       * Whether X lists the ticker as active.
       */
      active?: boolean;

      /**
       * Whether X charts the ticker with open, high, low & close prices.
       */
      supportsOhlc?: boolean;
    }
  }
}

/**
 * Profile coverage preserves shape, billing, aliases, and filters. Follow
 * next_cursor while the response reports more pages. Unprefixed cursors remain
 * legacy.
 */
export interface PaginatedUsers {
  has_next_page: boolean;

  next_cursor: string;

  users: Array<UserProfile>;

  /**
   * Whole number from 0.
   */
  filtered_count?: number;
}

/**
 * Search tweet with author. Zero metrics may mean X omitted counts.
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
   * Describes an X Article preview and its lifecycle metadata.
   */
  article?: SearchTweet.Article;

  /**
   * Public X profile.
   */
  author?: UserProfile;

  /**
   * Why the tweet has no author. X serves a suspended or deleted account as an
   * unavailable user with a reason such as Suspended or NotFound. Omitted when the
   * author is available.
   */
  authorUnavailable?: SearchTweet.AuthorUnavailable;

  /**
   * Describes a public card and its referenced profiles.
   */
  card?: SearchTweet.Card;

  /**
   * Price charts the author attached under the post, 1 per cashtag. Absent when the
   * post has none. X may send a cashtag without a chart window.
   */
  cashtagAttachments?: Array<SearchTweet.CashtagAttachment>;

  /**
   * Community ID.
   */
  communityId?: string;

  /**
   * Community name. Present when X sends it with the post.
   */
  communityName?: string;

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
   * Reply policy & conversation owner.
   */
  conversationControl?: SearchTweet.ConversationControl;

  conversationId?: string;

  /**
   * Author-published point, with longitude before latitude.
   */
  coordinates?: SearchTweet.Coordinates;

  createdAt?: string;

  displayTextRange?: Array<number>;

  /**
   * Lists edit-chain identifiers and the remaining edit window.
   */
  edit?: SearchTweet.Edit;

  /**
   * Lists hashtags, symbols, links, and mentions from tweet text.
   */
  entities?: SearchTweet.Entities;

  /**
   * Marks a subscriber-only post with the creator whose subscription unlocks it.
   * Non-subscribers get the preview text & the subscribe link. Omitted on public
   * posts.
   */
  exclusiveContent?: SearchTweet.ExclusiveContent;

  /**
   * Author-published point, with latitude before longitude.
   */
  geo?: SearchTweet.Geo;

  /**
   * Public metadata whose fields are defined by X.
   */
  grokShareAttachment?: { [key: string]: unknown };

  /**
   * Grok's translation of the post, as X shows it.
   */
  grokTranslatedPost?: { [key: string]: unknown };

  /**
   * Whether X holds Community Notes on the post, shown or not.
   */
  hasCommunityNotes?: boolean;

  inReplyToId?: string;

  inReplyToUserId?: string;

  inReplyToUsername?: string;

  /**
   * The notice x.com covers the post with until the reader views it, such as X's
   * public interest notice on a post that broke its rules but stays up.
   */
  interstitial?: SearchTweet.Interstitial;

  isLimitedReply?: boolean;

  isNoteTweet?: boolean;

  isPinned?: boolean;

  isQuoteStatus?: boolean;

  isReply?: boolean;

  isRetweet?: boolean;

  isTranslatable?: boolean;

  /**
   * Public metadata whose fields are defined by X.
   */
  jetfuelAttachment?: { [key: string]: unknown };

  lang?: string;

  /**
   * Public restrictions & prompts.
   */
  limitedActions?: Array<SearchTweet.LimitedAction>;

  /**
   * Media, omitted when unavailable.
   */
  media?: Array<TweetMedia>;

  /**
   * Complete Note Tweet content and rich-text metadata.
   */
  noteTweet?: SearchTweet.NoteTweet;

  /**
   * A parent, quoted or retweeted tweet. It has the TweetPublicData fields and an
   * author. Nesting stops after 4 levels.
   */
  parentTweet?: EmbeddedTweet;

  /**
   * Describes public place metadata on a geotagged tweet.
   */
  place?: SearchTweet.Place;

  possiblySensitive?: boolean;

  /**
   * Public metadata whose fields are defined by X.
   */
  postCta?: { [key: string]: unknown };

  /**
   * Engagement counts retained from a prior tweet edit.
   */
  previousCounts?: SearchTweet.PreviousCounts;

  /**
   * A parent, quoted or retweeted tweet. It has the TweetPublicData fields and an
   * author. Nesting stops after 4 levels.
   */
  quoted_tweet?: EmbeddedTweet;

  quotedTweetId?: string;

  /**
   * The quoted post's link, kept when X withholds that post.
   */
  quotedTweetPermalink?: SearchTweet.QuotedTweetPermalink;

  /**
   * Why X shows no quoted post. Omitted when X names no reason, as its legacy
   * answers never do.
   */
  quotedTweetUnavailable?: SearchTweet.QuotedTweetUnavailable;

  /**
   * Public post & user this reaction references.
   */
  reactionContext?: SearchTweet.ReactionContext;

  /**
   * A parent, quoted or retweeted tweet. It has the TweetPublicData fields and an
   * author. Nesting stops after 4 levels.
   */
  retweeted_tweet?: EmbeddedTweet;

  /**
   * Repost event time in UTC. Null when unavailable; omitted for other posts.
   */
  retweetedAt?: string | null;

  /**
   * Public metadata whose fields are defined by X.
   */
  scopes?: { [key: string]: unknown };

  /**
   * The app the post was sent from, as X labels it. X sends it for some posts only.
   */
  source?: string;

  /**
   * Game metadata attached to this post.
   */
  sportsContext?: SearchTweet.SportsContext;

  /**
   * The Subscriber badge X shows on a reply. The reply's author subscribes to the
   * creator who started the conversation. Omitted on a post without the badge.
   */
  subscriberBadge?: SearchTweet.SubscriberBadge;

  /**
   * Where `text` matches the search, on each row a search read. Offsets count code
   * points of `text`, as `displayTextRange` does. Empty when X marks nothing in the
   * post. X marks matches only in a post's first 280 characters.
   */
  textHighlights?: Array<SearchTweet.TextHighlight>;

  /**
   * Public visibility notice attached to an available tweet.
   */
  tombstone?: SearchTweet.Tombstone;

  type?: string;

  /**
   * The author's ID when X withholds the author's profile.
   */
  unavailableAuthorId?: string;

  /**
   * User IDs that left this conversation.
   */
  unmentionedUserIds?: Array<string>;

  url?: string;

  viewState?: string;
}

export namespace SearchTweet {
  /**
   * Describes an X Article preview and its lifecycle metadata.
   */
  export interface Article {
    id?: string;

    /**
     * Public metadata whose fields are defined by X.
     */
    coverMedia?: { [key: string]: unknown };

    coverMediaUrl?: string;

    /**
     * Public metadata whose fields are defined by X.
     */
    lifecycleState?: { [key: string]: unknown };

    /**
     * Public metadata whose fields are defined by X.
     */
    metadata?: { [key: string]: unknown };

    previewText?: string;

    title?: string;
  }

  /**
   * Why the tweet has no author. X serves a suspended or deleted account as an
   * unavailable user with a reason such as Suspended or NotFound. Omitted when the
   * author is available.
   */
  export interface AuthorUnavailable {
    /**
     * X's reason code.
     */
    reason: string;

    /**
     * X's notice text for the reason.
     */
    message?: string;
  }

  /**
   * Describes a public card and its referenced profiles.
   */
  export interface Card {
    id?: string;

    /**
     * Public metadata whose fields are defined by X.
     */
    bindingValues?: { [key: string]: unknown };

    name?: string;

    /**
     * Public metadata whose fields are defined by X.
     */
    platform?: { [key: string]: unknown };

    url?: string;

    /**
     * Unresolved card user references.
     */
    userReferenceErrors?: Array<Card.UserReferenceError>;

    userReferences?: Array<Shared.UserProfile>;
  }

  export namespace Card {
    export interface UserReferenceError {
      message?: string;

      reason?: string;
    }
  }

  export interface CashtagAttachment {
    /**
     * The cashtag with its `$`.
     */
    cashtag: string;

    /**
     * Span of each candle.
     */
    candleSize?: string;

    /**
     * Time of the chart's last price.
     */
    endTime?: string;

    /**
     * X's size for the chart.
     */
    sizeVariant?: number;

    /**
     * Time of the chart's first candle.
     */
    startTime?: string;

    /**
     * Span the chart covers.
     */
    timeframe?: string;
  }

  /**
   * Community Note presentation metadata returned by X.
   */
  export interface CommunityNote {
    id?: string;

    destinationUrl?: string;

    footer?: string;

    footerIconType?: string;

    iconType?: string;

    /**
     * Public metadata whose fields are defined by X.
     */
    metadata?: { [key: string]: unknown };

    shortTitle?: string;

    subtitle?: string;

    title?: string;

    visualStyle?: string;
  }

  /**
   * Reply policy & conversation owner.
   */
  export interface ConversationControl {
    /**
     * Regions whose accounts may reply, as country codes. Sent with the
     * `country_of_origin` mode.
     */
    allowedCountryCodes?: Array<string>;

    inviteViaMention?: boolean;

    /**
     * Reply policy from X's newer field, such as `my_network`, `premium` or
     * `country_of_origin`. Omitted when X sends none.
     */
    mode?: string;

    /**
     * The conversation owner's account ID.
     */
    ownerId?: string;

    ownerUsername?: string;

    policy?: string;
  }

  /**
   * Author-published point, with longitude before latitude.
   */
  export interface Coordinates {
    coordinates: Array<number>;

    type: 'Point';
  }

  /**
   * Lists edit-chain identifiers and the remaining edit window.
   */
  export interface Edit {
    editableUntilMsecs?: string;

    editTweetIds?: Array<string>;

    initialTweetId?: string;
  }

  /**
   * Lists hashtags, symbols, links, and mentions from tweet text.
   */
  export interface Entities {
    hashtags?: Array<Entities.Hashtag>;

    smarttags?: Array<Entities.Smarttag>;

    symbols?: Array<Entities.Symbol>;

    timestamps?: Array<Entities.Timestamp>;

    urls?: Array<Entities.URL>;

    user_mentions?: Array<Entities.UserMention>;
  }

  export namespace Entities {
    /**
     * Provides hashtag text and source offsets within a tweet.
     */
    export interface Hashtag {
      text: string;

      indices?: Array<number>;

      /**
       * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
       * platforms, which differ by reader.
       */
      tag?: Hashtag.Tag;
    }

    export namespace Hashtag {
      /**
       * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
       * platforms, which differ by reader.
       */
      export interface Tag {
        /**
         * X's ID for the SmartTag.
         */
        id?: string;

        info?: Tag.Info;
      }

      export namespace Tag {
        export interface Info {
          info?: Info.Info;
        }

        export namespace Info {
          export interface Info {
            /**
             * Whether X marks the SmartTag active.
             */
            active?: boolean;

            name?: string;

            ticker?: string;
          }
        }
      }
    }

    /**
     * Indexed smart-tag, cashtag, or video timestamp metadata.
     */
    export interface Smarttag {
      indices?: Array<number>;

      seconds?: number;

      /**
       * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
       * platforms, which differ by reader.
       */
      tag?: Smarttag.Tag;

      text?: string;
    }

    export namespace Smarttag {
      /**
       * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
       * platforms, which differ by reader.
       */
      export interface Tag {
        /**
         * X's ID for the SmartTag.
         */
        id?: string;

        info?: Tag.Info;
      }

      export namespace Tag {
        export interface Info {
          info?: Info.Info;
        }

        export namespace Info {
          export interface Info {
            /**
             * Whether X marks the SmartTag active.
             */
            active?: boolean;

            name?: string;

            ticker?: string;
          }
        }
      }
    }

    /**
     * Indexed smart-tag, cashtag, or video timestamp metadata.
     */
    export interface Symbol {
      indices?: Array<number>;

      seconds?: number;

      /**
       * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
       * platforms, which differ by reader.
       */
      tag?: Symbol.Tag;

      text?: string;
    }

    export namespace Symbol {
      /**
       * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
       * platforms, which differ by reader.
       */
      export interface Tag {
        /**
         * X's ID for the SmartTag.
         */
        id?: string;

        info?: Tag.Info;
      }

      export namespace Tag {
        export interface Info {
          info?: Info.Info;
        }

        export namespace Info {
          export interface Info {
            /**
             * Whether X marks the SmartTag active.
             */
            active?: boolean;

            name?: string;

            ticker?: string;
          }
        }
      }
    }

    /**
     * Indexed smart-tag, cashtag, or video timestamp metadata.
     */
    export interface Timestamp {
      indices?: Array<number>;

      seconds?: number;

      /**
       * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
       * platforms, which differ by reader.
       */
      tag?: Timestamp.Tag;

      text?: string;
    }

    export namespace Timestamp {
      /**
       * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
       * platforms, which differ by reader.
       */
      export interface Tag {
        /**
         * X's ID for the SmartTag.
         */
        id?: string;

        info?: Tag.Info;
      }

      export namespace Tag {
        export interface Info {
          info?: Info.Info;
        }

        export namespace Info {
          export interface Info {
            /**
             * Whether X marks the SmartTag active.
             */
            active?: boolean;

            name?: string;

            ticker?: string;
          }
        }
      }
    }

    /**
     * Provides shortened, display, and expanded URLs from tweet text.
     */
    export interface URL {
      display_url?: string;

      expanded_url?: string;

      indices?: Array<number>;

      url?: string;
    }

    /**
     * Provides profile identity and source offsets for a mention.
     */
    export interface UserMention {
      screen_name: string;

      id_str?: string;

      indices?: Array<number>;

      name?: string;
    }
  }

  /**
   * Marks a subscriber-only post with the creator whose subscription unlocks it.
   * Non-subscribers get the preview text & the subscribe link. Omitted on public
   * posts.
   */
  export interface ExclusiveContent {
    /**
     * Username of the creator whose subscription unlocks the post.
     */
    creatorUserName: string;

    /**
     * Subscribe link X shows non-subscribers. Omitted when X serves the full post.
     */
    subscribeUrl?: string;
  }

  /**
   * Author-published point, with latitude before longitude.
   */
  export interface Geo {
    coordinates: Array<number>;

    type: 'Point';
  }

  /**
   * The notice x.com covers the post with until the reader views it, such as X's
   * public interest notice on a post that broke its rules but stays up.
   */
  export interface Interstitial {
    /**
     * How x.com shows the notice. `NonCompliant` marks a post that broke X's rules.
     */
    displayType?: string;

    text?: Interstitial.Text;
  }

  export namespace Interstitial {
    export interface Text {
      /**
       * Links inside the notice, by character range.
       */
      entities?: Array<Text.Entity>;

      /**
       * Whether X writes it right to left.
       */
      rtl?: boolean;

      /**
       * The notice's text.
       */
      text?: string;
    }

    export namespace Text {
      export interface Entity {
        /**
         * Whole number from 0.
         */
        fromIndex?: number;

        ref?: Entity.Ref;

        /**
         * Whole number from 0.
         */
        toIndex?: number;
      }

      export namespace Entity {
        export interface Ref {
          type?: string;

          url?: string;

          urlType?: string;
        }
      }
    }
  }

  export interface LimitedAction {
    action?: string;

    prompt?: LimitedAction.Prompt;
  }

  export namespace LimitedAction {
    export interface Prompt {
      ctaType?: string;

      headline?: string;

      /**
       * Public metadata whose fields are defined by X.
       */
      metadata?: { [key: string]: unknown };

      subtext?: string;
    }
  }

  /**
   * Complete Note Tweet content and rich-text metadata.
   */
  export interface NoteTweet {
    text: string;

    /**
     * X's global ID of the Note, base64 of `NoteTweet:<noteId>`.
     */
    id?: string;

    /**
     * Lists hashtags, symbols, links, and mentions from tweet text.
     */
    entities?: NoteTweet.Entities;

    /**
     * Inline media positions in the Note Tweet text.
     */
    inlineMedia?: Array<NoteTweet.InlineMedia>;

    isExpandable?: boolean;

    /**
     * The Note's own ID, apart from the post's.
     */
    noteId?: string;

    richtextTags?: Array<NoteTweet.RichtextTag>;
  }

  export namespace NoteTweet {
    /**
     * Lists hashtags, symbols, links, and mentions from tweet text.
     */
    export interface Entities {
      hashtags?: Array<Entities.Hashtag>;

      smarttags?: Array<Entities.Smarttag>;

      symbols?: Array<Entities.Symbol>;

      timestamps?: Array<Entities.Timestamp>;

      urls?: Array<Entities.URL>;

      user_mentions?: Array<Entities.UserMention>;
    }

    export namespace Entities {
      /**
       * Provides hashtag text and source offsets within a tweet.
       */
      export interface Hashtag {
        text: string;

        indices?: Array<number>;

        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        tag?: Hashtag.Tag;
      }

      export namespace Hashtag {
        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        export interface Tag {
          /**
           * X's ID for the SmartTag.
           */
          id?: string;

          info?: Tag.Info;
        }

        export namespace Tag {
          export interface Info {
            info?: Info.Info;
          }

          export namespace Info {
            export interface Info {
              /**
               * Whether X marks the SmartTag active.
               */
              active?: boolean;

              name?: string;

              ticker?: string;
            }
          }
        }
      }

      /**
       * Indexed smart-tag, cashtag, or video timestamp metadata.
       */
      export interface Smarttag {
        indices?: Array<number>;

        seconds?: number;

        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        tag?: Smarttag.Tag;

        text?: string;
      }

      export namespace Smarttag {
        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        export interface Tag {
          /**
           * X's ID for the SmartTag.
           */
          id?: string;

          info?: Tag.Info;
        }

        export namespace Tag {
          export interface Info {
            info?: Info.Info;
          }

          export namespace Info {
            export interface Info {
              /**
               * Whether X marks the SmartTag active.
               */
              active?: boolean;

              name?: string;

              ticker?: string;
            }
          }
        }
      }

      /**
       * Indexed smart-tag, cashtag, or video timestamp metadata.
       */
      export interface Symbol {
        indices?: Array<number>;

        seconds?: number;

        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        tag?: Symbol.Tag;

        text?: string;
      }

      export namespace Symbol {
        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        export interface Tag {
          /**
           * X's ID for the SmartTag.
           */
          id?: string;

          info?: Tag.Info;
        }

        export namespace Tag {
          export interface Info {
            info?: Info.Info;
          }

          export namespace Info {
            export interface Info {
              /**
               * Whether X marks the SmartTag active.
               */
              active?: boolean;

              name?: string;

              ticker?: string;
            }
          }
        }
      }

      /**
       * Indexed smart-tag, cashtag, or video timestamp metadata.
       */
      export interface Timestamp {
        indices?: Array<number>;

        seconds?: number;

        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        tag?: Timestamp.Tag;

        text?: string;
      }

      export namespace Timestamp {
        /**
         * X's SmartTag for a cashtag, smarttag or hashtag. Xquik leaves out X's trading
         * platforms, which differ by reader.
         */
        export interface Tag {
          /**
           * X's ID for the SmartTag.
           */
          id?: string;

          info?: Tag.Info;
        }

        export namespace Tag {
          export interface Info {
            info?: Info.Info;
          }

          export namespace Info {
            export interface Info {
              /**
               * Whether X marks the SmartTag active.
               */
              active?: boolean;

              name?: string;

              ticker?: string;
            }
          }
        }
      }

      /**
       * Provides shortened, display, and expanded URLs from tweet text.
       */
      export interface URL {
        display_url?: string;

        expanded_url?: string;

        indices?: Array<number>;

        url?: string;
      }

      /**
       * Provides profile identity and source offsets for a mention.
       */
      export interface UserMention {
        screen_name: string;

        id_str?: string;

        indices?: Array<number>;

        name?: string;
      }
    }

    export interface InlineMedia {
      /**
       * Whole number from 0.
       */
      index: number;

      mediaId: string;
    }

    export interface RichtextTag {
      /**
       * Whole number from 0.
       */
      fromIndex: number;

      /**
       * Whole number from 0.
       */
      toIndex: number;

      types: Array<string>;
    }
  }

  /**
   * Describes public place metadata on a geotagged tweet.
   */
  export interface Place {
    id?: string;

    /**
     * Public metadata whose fields are defined by X.
     */
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
    /**
     * Whole number from 0.
     */
    bookmarkCount?: number;

    /**
     * Whole number from 0.
     */
    likeCount?: number;

    /**
     * Whole number from 0.
     */
    quoteCount?: number;

    /**
     * Whole number from 0.
     */
    replyCount?: number;

    /**
     * Whole number from 0.
     */
    retweetCount?: number;
  }

  /**
   * The quoted post's link, kept when X withholds that post.
   */
  export interface QuotedTweetPermalink {
    displayUrl?: string;

    expandedUrl?: string;

    url?: string;
  }

  /**
   * Why X shows no quoted post. Omitted when X names no reason, as its legacy
   * answers never do.
   */
  export interface QuotedTweetUnavailable {
    /**
     * X's reason, such as `Suspended` for a suspended author or `Protected` for an
     * author who protects their posts.
     */
    reason: string;
  }

  /**
   * Public post & user this reaction references.
   */
  export interface ReactionContext {
    /**
     * Referenced post ID.
     */
    reactedToPostId?: string;

    /**
     * Public X profile.
     */
    reactedToUser?: Shared.UserProfile;
  }

  /**
   * Game metadata attached to this post.
   */
  export interface SportsContext {
    /**
     * Teams & reported scores.
     */
    competitors?: Array<SportsContext.Competitor>;

    /**
     * Game ID.
     */
    gameId?: string;

    /**
     * League ID.
     */
    league?: string;

    /**
     * Scheduled Unix milliseconds, retaining the source type.
     */
    scheduledAtMs?: number | string;

    /**
     * Reported game state.
     */
    state?: string;

    /**
     * Game progress text.
     */
    statusText?: string;

    /**
     * Game title.
     */
    title?: string;

    /**
     * Game link.
     */
    url?: string;
  }

  export namespace SportsContext {
    export interface Competitor {
      /**
       * Team abbreviation.
       */
      abbreviation?: string;

      /**
       * Team display color.
       */
      color?: string;

      /**
       * Logo for dark backgrounds.
       */
      darkLogoUrl?: string;

      /**
       * Active competitor.
       */
      isActive?: boolean;

      /**
       * Winning competitor.
       */
      isWinner?: boolean;

      /**
       * Logo for light backgrounds.
       */
      logoUrl?: string;

      /**
       * Team name.
       */
      name?: string;

      /**
       * Score display text.
       */
      score?: string;

      /**
       * Team ID.
       */
      teamId?: string;
    }
  }

  /**
   * The Subscriber badge X shows on a reply. The reply's author subscribes to the
   * creator who started the conversation. Omitted on a post without the badge.
   */
  export interface SubscriberBadge {
    /**
     * Account ID of the creator the author subscribes to.
     */
    creatorId: string;
  }

  export interface TextHighlight {
    /**
     * The first code point after the match.
     */
    endIndex: number;

    /**
     * The first code point of the match.
     */
    startIndex: number;
  }

  /**
   * Public visibility notice attached to an available tweet.
   */
  export interface Tombstone {
    text?: Tombstone.Text;

    /**
     * Visibility notice type.
     */
    type?: string;
  }

  export namespace Tombstone {
    export interface Text {
      entities?: Array<Text.Entity>;

      /**
       * Right-to-left text direction.
       */
      rtl?: boolean;

      /**
       * Human-readable notice text.
       */
      text?: string;
    }

    export namespace Text {
      export interface Entity {
        /**
         * Whole number from 0.
         */
        fromIndex?: number;

        ref?: Entity.Ref;

        /**
         * Whole number from 0.
         */
        toIndex?: number;
      }

      export namespace Entity {
        export interface Ref {
          type?: string;

          url?: string;

          urlType?: string;
        }
      }
    }
  }
}

/**
 * Tweet media.
 */
export interface TweetMedia {
  /**
   * Preview URL.
   */
  mediaUrl: string;

  type: 'photo' | 'video' | 'animated_gif';

  /**
   * Tweet media link.
   */
  url: string;

  /**
   * Media entity ID.
   */
  id?: string;

  /**
   * Adult-content warning.
   */
  adultContent?: boolean;

  /**
   * Direct download permission.
   */
  allowDownload?: boolean;

  /**
   * Accessibility text.
   */
  altText?: string;

  /**
   * Video width and height ratio.
   */
  aspectRatio?: Array<number>;

  /**
   * Why X made the media unavailable, such as `Dmcaed` after a copyright report.
   * Omitted on available media.
   */
  availabilityReason?: string;

  /**
   * Availability state, such as `Available` or `Unavailable`.
   */
  availabilityStatus?: string;

  /**
   * Media description.
   */
  description?: string;

  /**
   * Display URL.
   */
  displayUrl?: string;

  /**
   * Video duration in milliseconds.
   */
  durationMillis?: number;

  /**
   * Embeddable status.
   */
  embeddable?: boolean;

  /**
   * Expanded media URL.
   */
  expandedUrl?: string;

  /**
   * Face crop rectangles by size.
   */
  faceRects?: { [key: string]: Array<TweetMedia.FaceRect> };

  /**
   * Suggested image crops.
   */
  focusRects?: Array<TweetMedia.FocusRect>;

  /**
   * Graphic-violence warning.
   */
  graphicViolence?: boolean;

  /**
   * Prompt a Grok image came from. Absent on other media & when X sends no prompt.
   */
  grokImageAnnotation?: TweetMedia.GrokImageAnnotation;

  /**
   * Grok post ID associated with the media.
   */
  grokPostId?: string;

  /**
   * Original height.
   */
  height?: number;

  /**
   * Tweet text offsets.
   */
  indices?: Array<number>;

  /**
   * Stable X media key.
   */
  mediaKey?: string;

  /**
   * Monetization status.
   */
  monetizable?: boolean;

  otherSensitiveContent?: boolean;

  /**
   * Named media renditions and resize modes.
   */
  sizes?: { [key: string]: TweetMedia.Sizes };

  /**
   * Source tweet ID for copied media.
   */
  sourceStatusId?: string;

  /**
   * The account that first posted the media. Some reads carry only its name, picture
   * & badges.
   */
  sourceUser?: UserProfile;

  /**
   * Source profile ID for copied media.
   */
  sourceUserId?: string;

  /**
   * Public profiles tagged in the media.
   */
  tags?: Array<TweetMedia.Tag>;

  /**
   * Media title.
   */
  title?: string;

  /**
   * Video encodings in source order.
   */
  videoVariants?: Array<TweetMedia.VideoVariant>;

  /**
   * Public destination URL.
   */
  visitSiteUrl?: string;

  /**
   * Public media action URL.
   */
  watchNowUrl?: string;

  /**
   * Original width.
   */
  width?: number;
}

export namespace TweetMedia {
  export interface FaceRect {
    /**
     * Whole number from 0.
     */
    h: number;

    /**
     * Whole number from 0.
     */
    w: number;

    /**
     * Whole number from 0.
     */
    x: number;

    /**
     * Whole number from 0.
     */
    y: number;
  }

  export interface FocusRect {
    /**
     * Whole number from 0.
     */
    h: number;

    /**
     * Whole number from 0.
     */
    w: number;

    /**
     * Whole number from 0.
     */
    x: number;

    /**
     * Whole number from 0.
     */
    y: number;
  }

  /**
   * Prompt a Grok image came from. Absent on other media & when X sends no prompt.
   */
  export interface GrokImageAnnotation {
    /**
     * Prompt the image came from.
     */
    prompt?: string;

    /**
     * Grok's longer rewrite of the prompt.
     */
    upsampledPrompt?: string;
  }

  export interface Sizes {
    /**
     * Whole number from 0.
     */
    h: number;

    resize: string;

    /**
     * Whole number from 0.
     */
    w: number;
  }

  export interface Tag {
    name?: string;

    screen_name?: string;

    type?: string;

    user_id?: string;
  }

  export interface VideoVariant {
    contentType: string;

    url: string;

    /**
     * Whole number from 0.
     */
    bitrate?: number;
  }
}

/**
 * Public X profile.
 */
export interface UserProfile {
  id: string;

  name: string;

  username: string;

  /**
   * Null when X shows no label.
   */
  accountBasedIn?: UserProfile.AccountBasedIn | null;

  /**
   * False when X notes accountBasedIn may be inaccurate.
   */
  accountBasedInAccurate?: boolean;

  /**
   * True when X withheld accountBasedIn from this read. Retry later.
   */
  accountBasedInUnavailable?: boolean;

  /**
   * X Ads services the account uses, such as `analytics`, `media_studio` or `smb`.
   * Empty for an account without ads.
   */
  advertiserAccountServiceLevels?: Array<string>;

  /**
   * The account's X Ads type. `none` for an account without ads, or
   * `promotable_user` for one that may run them.
   */
  advertiserAccountType?: string;

  /**
   * Organization affiliation label shown on an X profile.
   */
  affiliatesHighlightedLabel?: UserProfile.AffiliatesHighlightedLabel;

  /**
   * Handle of the organization X shows the account is affiliated with, from its
   * About page.
   */
  affiliateUsername?: string;

  automatedBy?: string;

  /**
   * The parts of the birthday the account made public.
   */
  birthdate?: UserProfile.Birthdate;

  /**
   * Whole number from 0.
   */
  businessAccountAffiliatesCount?: number;

  /**
   * Whether X treats the profile as a business profile. `none` or `enabled`.
   */
  businessProfileState?: string;

  /**
   * Community role when returned by community member reads
   */
  communityRole?: string;

  /**
   * How the account first connected to X.
   */
  connectedVia?: string;

  /**
   * False when X notes that country may be inaccurate.
   */
  connectedViaAccurate?: boolean;

  /**
   * Emails, phone numbers & links the account publishes on its own profile. Omitted
   * when it publishes none.
   */
  contactInfo?: UserProfile.ContactInfo;

  coverPicture?: string;

  /**
   * Account creation time.
   */
  createdAt?: string;

  /**
   * Whole number from 0.
   */
  creatorSubscriptionsCount?: number;

  /**
   * Whether the profile keeps X's default theme.
   */
  defaultProfile?: boolean;

  /**
   * Whether the profile keeps X's default avatar.
   */
  defaultProfileImage?: boolean;

  description?: string;

  /**
   * First email the account publishes on its profile, lowercased. Omitted when it
   * publishes none.
   */
  email?: string;

  /**
   * Followers X counts as fast followers.
   */
  fastFollowersCount?: number;

  favouritesCount?: number;

  /**
   * Omitted when X sends no count, as for the account that first posted reused
   * media.
   */
  followers?: number;

  following?: number;

  /**
   * Whether the profile may add a location to posts.
   */
  geoEnabled?: boolean;

  /**
   * Public profile bio translation returned by X
   */
  grokTranslatedBio?: { [key: string]: unknown };

  hasCustomTimelines?: boolean;

  /**
   * Whether the profile filled X's extended fields, such as a birth date. True or
   * false.
   */
  hasExtendedProfile?: boolean;

  hasGraduatedAccess?: boolean;

  hasHiddenSubscriptionsOnProfile?: boolean;

  /**
   * Profile highlight availability and count metadata.
   */
  highlightsInfo?: UserProfile.HighlightsInfo;

  /**
   * Identity verification X shows on the profile & its About page.
   */
  identityVerification?: UserProfile.IdentityVerification;

  isAutomated?: boolean;

  /**
   * Whether X shows a blue verification badge
   */
  isBlueVerified?: boolean;

  isProfileTranslatable?: boolean;

  /**
   * Whether the account turned on X's translation of its posts. True or false.
   */
  isTranslationEnabled?: boolean;

  isTranslator?: boolean;

  /**
   * Whether X marks the profile as verified
   */
  isVerified?: boolean;

  /**
   * Public lists that include the profile.
   */
  listedCount?: number;

  /**
   * Account owner's public profile location text
   */
  location?: string;

  mediaCount?: number;

  /**
   * Followers minus fast followers.
   */
  normalFollowersCount?: number;

  parodyCommentaryFanLabel?: string;

  pinnedTweetIds?: Array<string>;

  possiblySensitive?: boolean;

  /**
   * Professional metadata with category display settings
   */
  professional?: { [key: string]: unknown };

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

  /**
   * UTC repost time with includeRetweetTimestamp. Null if the newest profile page
   * has no match or lookup failed; otherwise omitted.
   */
  retweetedAt?: string | null;

  statusesCount?: number;

  /**
   * Accounts subscribed to the profile's paid Subscriptions. 0 when it has none.
   */
  subscribersCount?: number;

  superFollowEligible?: boolean;

  /**
   * Whether X marks the subscription profile as active.
   */
  superFollowsUserProfileActive?: boolean;

  /**
   * Public payment and creator-support handles shown on X.
   */
  tipJar?: UserProfile.TipJar;

  unavailable?: boolean;

  unavailableReason?: string;

  url?: string;

  /**
   * How often the account changed its username.
   */
  usernameChanges?: UserProfile.UsernameChanges;

  /**
   * X's text on why the profile is verified, with its links.
   */
  verificationReason?: UserProfile.VerificationReason;

  verified?: boolean;

  verifiedType?: string;

  withheldInCountries?: Array<string>;

  /**
   * Whether X withholds a post or user
   */
  withheldScope?: string;
}

export namespace UserProfile {
  /**
   * X's best-effort public label inferred from aggregated account-access IP
   * addresses. It does not state nationality, residence, identity, registration,
   * post location, or exact location.
   */
  export interface AccountBasedIn {
    level: 'country' | 'region';

    observedAt: string;

    value: string;
  }

  /**
   * Organization affiliation label shown on an X profile.
   */
  export interface AffiliatesHighlightedLabel {
    badgeUrl?: string;

    description?: string;

    /**
     * Public text, ranges, references, and mention data.
     */
    longDescription?: { [key: string]: unknown };

    url?: string;

    urlType?: string;

    userLabelDisplayType?: string;

    userLabelType?: string;
  }

  /**
   * The parts of the birthday the account made public.
   */
  export interface Birthdate {
    day?: number;

    month?: number;

    year?: number;
  }

  /**
   * Emails, phone numbers & links the account publishes on its own profile. Omitted
   * when it publishes none.
   */
  export interface ContactInfo {
    /**
     * Emails in the bio, name or location, lowercased.
     */
    emails?: Array<ContactInfo.Email>;

    /**
     * The profile's website & the links in its bio.
     */
    links?: Array<ContactInfo.Link>;

    /**
     * Phone numbers on the profile. Only a spelling that can be nothing else counts.
     */
    phones?: Array<ContactInfo.Phone>;
  }

  export namespace ContactInfo {
    export interface Email {
      /**
       * The part after the @ sign.
       */
      domain: string;

      /**
       * Profile field that holds the email.
       */
      source: 'bio' | 'name' | 'location';

      /**
       * The email address.
       */
      value: string;

      /**
       * The account's own spelling, sent when it spelled the email out.
       */
      writtenAs?: string;
    }

    export interface Link {
      /**
       * Site the link belongs to, such as `linkedin`, `github` or `telegram`. Any other
       * site is `website`.
       */
      network: string;

      /**
       * `url` for the website field, `bio` for a bio link.
       */
      source: 'url' | 'bio';

      /**
       * The link, as X expands it.
       */
      url: string;
    }

    export interface Phone {
      /**
       * Profile field that holds the number.
       */
      source: 'bio' | 'name' | 'location' | 'url';

      /**
       * The digits, with a leading + when the account wrote a country code.
       */
      value: string;

      /**
       * The account's own spelling of the number.
       */
      writtenAs?: string;
    }
  }

  /**
   * Profile highlight availability and count metadata.
   */
  export interface HighlightsInfo {
    canHighlightTweets?: boolean;

    highlightedTweets?: string;
  }

  /**
   * Identity verification X shows on the profile & its About page.
   */
  export interface IdentityVerification {
    description?: string;

    /**
     * Whether the owner verified their ID with X.
     */
    isIdentityVerified?: boolean;

    /**
     * When X verified the account, in milliseconds since 1970, as text.
     */
    verifiedSinceMsec?: string;
  }

  /**
   * Public payment and creator-support handles shown on X.
   */
  export interface TipJar {
    bandcampHandle?: string;

    bitcoinHandle?: string;

    cashAppHandle?: string;

    ethereumHandle?: string;

    gofundmeHandle?: string;

    isEnabled?: boolean;

    patreonHandle?: string;

    payPalHandle?: string;

    venmoHandle?: string;
  }

  /**
   * How often the account changed its username.
   */
  export interface UsernameChanges {
    /**
     * Whole number from 0.
     */
    count: number;

    /**
     * Time of the latest change, omitted when there is none.
     */
    lastChangedAt?: string;
  }

  /**
   * X's text on why the profile is verified, with its links.
   */
  export interface VerificationReason {
    /**
     * Links inside the text, by character range.
     */
    entities?: Array<VerificationReason.Entity>;

    text?: string;
  }

  export namespace VerificationReason {
    export interface Entity {
      /**
       * Whole number from 0.
       */
      fromIndex?: number;

      /**
       * Whole number from 0.
       */
      toIndex?: number;

      url?: string;

      urlType?: string;
    }
  }
}
