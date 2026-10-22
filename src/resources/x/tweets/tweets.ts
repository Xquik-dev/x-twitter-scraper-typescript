// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

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
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Tweets extends APIResource {
  like: LikeAPI.Like = new LikeAPI.Like(this._client);
  retweet: RetweetAPI.Retweet = new RetweetAPI.Retweet(this._client);

  /**
   * Publishes a post through a connected X account.
   *
   * @example
   * ```ts
   * const tweet = await client.x.tweets.create({
   *   account: '@elonmusk',
   *   'Idempotency-Key': 'Idempotency-Key',
   *   media: ['https://example.com/video.mp4'],
   *   text: 'Just launched our new feature!',
   * });
   * ```
   */
  create(params: TweetCreateParams, options?: RequestOptions): APIPromise<TweetCreateResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post('/x/tweets', {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
    });
  }

  /**
   * Returns one public tweet with author, metrics, and media.
   *
   * @example
   * ```ts
   * const tweet = await client.x.tweets.retrieve('id');
   * ```
   */
  retrieve(
    id: string,
    query: TweetRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetRetrieveResponse> {
    return this._client.get(path`/x/tweets/${id}`, { query, ...options });
  }

  /**
   * Returns public tweet records for the requested IDs.
   *
   * @example
   * ```ts
   * const tweets = await client.x.tweets.list({ ids: 'ids' });
   * ```
   */
  list(query: TweetListParams, options?: RequestOptions): APIPromise<TweetListResponse> {
    return this._client.get('/x/tweets', { query, ...options });
  }

  /**
   * Deletes an authored post through a connected X account.
   *
   * @example
   * ```ts
   * const tweet = await client.x.tweets.delete('id', {
   *   account: '@elonmusk',
   *   'Idempotency-Key': 'Idempotency-Key',
   * });
   * ```
   */
  delete(id: string, params: TweetDeleteParams, options?: RequestOptions): APIPromise<TweetDeleteResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.delete(path`/x/tweets/${id}`, {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
    });
  }

  /**
   * Returns whether 1 account reposted the post, read from its newest posts. A
   * repost older than the posts read returns false with complete false. Each check
   * costs 1 credit.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.checkRepost('id', {
   *   user: 'nasa',
   * });
   * ```
   */
  checkRepost(
    id: string,
    query: TweetCheckRepostParams,
    options?: RequestOptions,
  ): APIPromise<TweetCheckRepostResponse> {
    return this._client.get(path`/x/tweets/${id}/retweeters/check`, { query, ...options });
  }

  /**
   * Returns the HTML that X gives websites to embed one public tweet, with the
   * tweet's link and author.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.embed('id');
   * ```
   */
  embed(
    id: string,
    query: TweetEmbedParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetEmbedResponse> {
    return this._client.get(path`/x/tweets/${id}/embed`, { query, ...options });
  }

  /**
   * Likers your X account sees, else 424 `account_required`. X shows likers only to
   * the post author.
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
   * Returns the replies the post's author hid, oldest first, with the replies to
   * them. A post without hidden replies returns an empty list.
   *
   * @example
   * ```ts
   * const paginatedTweets =
   *   await client.x.tweets.getHiddenReplies('id');
   * ```
   */
  getHiddenReplies(
    id: string,
    query: TweetGetHiddenRepliesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/tweets/${id}/hidden-replies`, { query, ...options });
  }

  /**
   * Returns engagement insights for one tweet: engagements per hour since it went
   * up, per view and per follower of its author, and how far it spread. Each report
   * costs 1 credit, whatever it reads.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.getInsights('id');
   * ```
   */
  getInsights(
    id: string,
    query: TweetGetInsightsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetGetInsightsResponse> {
    return this._client.get(path`/x/tweets/${id}/insights`, { query, ...options });
  }

  /**
   * Returns public posts quoting the tweet, newest first, replies included. Drop
   * them with replies=exclude. Send queryType=Top for the quotes X ranks highest.
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
   * Returns direct replies with automatic maximum coverage and pagination. A retweet
   * ID returns replies to the original post. Complete mode adds nested replies,
   * diagnostics, and a 424 below 80% coverage. A fully read time window returns 200.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.getReplies('id');
   * ```
   */
  getReplies(
    id: string,
    query: TweetGetRepliesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetGetRepliesResponse> {
    return this._client.get(path`/x/tweets/${id}/replies`, { query, ...options });
  }

  /**
   * Returns the user IDs of a post's reposters, in the order & pages of
   * /x/tweets/{id}/retweeters. Use it when you need IDs only. Each ID costs 1
   * credit. A post nobody reposted returns an empty list for free.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.getRetweeterIds(
   *   'id',
   * );
   * ```
   */
  getRetweeterIds(
    id: string,
    query: TweetGetRetweeterIDsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetGetRetweeterIDsResponse> {
    return this._client.get(path`/x/tweets/${id}/retweeter-ids`, { query, ...options });
  }

  /**
   * Lists reposters. includeRetweetTimestamp adds retweeted_at in Unix seconds. Null
   * means no matching repost on the newest profile page or lookup failure. The
   * created field means account creation. Timestamp lookups add latency.
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
   * Returns the caption tracks of one public tweet's videos, as X's player reads
   * them. Each track has its language, name, timed cues, and full text. A tweet
   * without video, or a video without captions, returns no track and costs nothing.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.getSubtitles('id');
   * ```
   */
  getSubtitles(
    id: string,
    query: TweetGetSubtitlesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TweetGetSubtitlesResponse> {
    return this._client.get(path`/x/tweets/${id}/subtitles`, { query, ...options });
  }

  /**
   * Returns visible posts from the selected conversation thread. Results exclude X
   * ads.
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
   * Returns the tweets X ranks highest by one metric over the last day, week or
   * month, as x.com's Inspiration page shows them. Covers all of X unless you pick a
   * country or a language. Pages hold up to 20 tweets, and the list ends at 100.
   * Each tweet costs 1 credit.
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.tweets.listTop();
   * ```
   */
  listTop(
    query: TweetListTopParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/tweets/top', { query, ...options });
  }

  /**
   * Returns where each t.co link leads, as X's own redirect says. Xquik reads the
   * redirect and never visits the target site. A link t.co does not have comes back
   * without `resolvedUrl` and costs nothing. A link X does not answer for in time
   * comes back in `unprocessedUrls`, free. Each resolved link costs 1 credit.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.resolveLinks({
   *   urls: 'https://t.co/Xe1nm2pkSX',
   * });
   * ```
   */
  resolveLinks(
    query: TweetResolveLinksParams,
    options?: RequestOptions,
  ): APIPromise<TweetResolveLinksResponse> {
    return this._client.get('/x/links/resolve', { query, ...options });
  }

  /**
   * Tweets include authors, like counts, media, URLs & cursors. Omit mode for
   * maximum coverage. Reuse next_cursor with unchanged filters.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.search({ q: 'q' });
   * ```
   */
  search(query: TweetSearchParams, options?: RequestOptions): APIPromise<TweetSearchResponse> {
    return this._client.get('/x/tweets/search', { query, ...options });
  }

  /**
   * Returns X's own translation of one public tweet into the language you pick, with
   * the links, mentions, and tags X places in the translated text.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.translate('id', {
   *   language: 'tr',
   * });
   * ```
   */
  translate(
    id: string,
    query: TweetTranslateParams,
    options?: RequestOptions,
  ): APIPromise<TweetTranslateResponse> {
    return this._client.get(path`/x/tweets/${id}/translation`, { query, ...options });
  }
}

/**
 * Author profile. Lookups always include follower count & verification. Other
 * fields depend on availability.
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
   * Describes an X Article preview and its lifecycle metadata.
   */
  article?: TweetDetail.Article;

  /**
   * Author profile. Lookups always include follower count & verification. Other
   * fields depend on availability.
   */
  author?: TweetAuthor;

  /**
   * Why the tweet has no author. X serves a suspended or deleted account as an
   * unavailable user with a reason such as Suspended or NotFound. Omitted when the
   * author is available.
   */
  authorUnavailable?: TweetDetail.AuthorUnavailable;

  /**
   * Describes a public card and its referenced profiles.
   */
  card?: TweetDetail.Card;

  /**
   * Price charts the author attached under the post, 1 per cashtag. Absent when the
   * post has none. X may send a cashtag without a chart window.
   */
  cashtagAttachments?: Array<TweetDetail.CashtagAttachment>;

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
  communityNote?: TweetDetail.CommunityNote;

  /**
   * Content disclosure metadata shown by X when a tweet is labeled as paid
   * partnership content or AI-generated media.
   */
  contentDisclosure?: Shared.ContentDisclosure;

  /**
   * Reply policy & conversation owner.
   */
  conversationControl?: TweetDetail.ConversationControl;

  conversationId?: string;

  /**
   * Author-published point, with longitude before latitude.
   */
  coordinates?: TweetDetail.Coordinates;

  createdAt?: string;

  displayTextRange?: Array<number>;

  /**
   * Lists edit-chain identifiers and the remaining edit window.
   */
  edit?: TweetDetail.Edit;

  /**
   * Lists hashtags, symbols, links, and mentions from tweet text.
   */
  entities?: TweetDetail.Entities;

  /**
   * Marks a subscriber-only post with the creator whose subscription unlocks it.
   * Non-subscribers get the preview text & the subscribe link. Omitted on public
   * posts.
   */
  exclusiveContent?: TweetDetail.ExclusiveContent;

  /**
   * Author-published point, with latitude before longitude.
   */
  geo?: TweetDetail.Geo;

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
  interstitial?: TweetDetail.Interstitial;

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
  limitedActions?: Array<TweetDetail.LimitedAction>;

  /**
   * Media, omitted when unavailable.
   */
  media?: Array<Shared.TweetMedia>;

  /**
   * Complete Note Tweet content and rich-text metadata.
   */
  noteTweet?: TweetDetail.NoteTweet;

  /**
   * A parent, quoted or retweeted tweet. It has the TweetPublicData fields and an
   * author. Nesting stops after 4 levels.
   */
  parentTweet?: Shared.EmbeddedTweet;

  /**
   * Describes public place metadata on a geotagged tweet.
   */
  place?: TweetDetail.Place;

  possiblySensitive?: boolean;

  /**
   * Public metadata whose fields are defined by X.
   */
  postCta?: { [key: string]: unknown };

  /**
   * Engagement counts retained from a prior tweet edit.
   */
  previousCounts?: TweetDetail.PreviousCounts;

  /**
   * A parent, quoted or retweeted tweet. It has the TweetPublicData fields and an
   * author. Nesting stops after 4 levels.
   */
  quoted_tweet?: Shared.EmbeddedTweet;

  quotedTweetId?: string;

  /**
   * The quoted post's link, kept when X withholds that post.
   */
  quotedTweetPermalink?: TweetDetail.QuotedTweetPermalink;

  /**
   * Why X shows no quoted post. Omitted when X names no reason, as its legacy
   * answers never do.
   */
  quotedTweetUnavailable?: TweetDetail.QuotedTweetUnavailable;

  /**
   * Public post & user this reaction references.
   */
  reactionContext?: TweetDetail.ReactionContext;

  /**
   * A parent, quoted or retweeted tweet. It has the TweetPublicData fields and an
   * author. Nesting stops after 4 levels.
   */
  retweeted_tweet?: Shared.EmbeddedTweet;

  /**
   * Repost event time in UTC. Null when unavailable; omitted for other posts.
   */
  retweetedAt?: string | null;

  /**
   * Public metadata whose fields are defined by X.
   */
  scopes?: { [key: string]: unknown };

  /**
   * The label X shows under a post whose reach it limits. It links to the page that
   * explains it.
   */
  softIntervention?: Shared.SoftIntervention;

  /**
   * The app the post was sent from, as X labels it. X sends it for some posts only.
   */
  source?: string;

  /**
   * Game metadata attached to this post.
   */
  sportsContext?: TweetDetail.SportsContext;

  /**
   * The Subscriber badge X shows on a reply. The reply's author subscribes to the
   * creator who started the conversation. Omitted on a post without the badge.
   */
  subscriberBadge?: TweetDetail.SubscriberBadge;

  /**
   * Where `text` matches the search, on each row a search read. Offsets count code
   * points of `text`, as `displayTextRange` does. Empty when X marks nothing in the
   * post. X marks matches only in a post's first 280 characters.
   */
  textHighlights?: Array<TweetDetail.TextHighlight>;

  /**
   * Public visibility notice attached to an available tweet.
   */
  tombstone?: TweetDetail.Tombstone;

  type?: string;

  /**
   * The author's ID when X withholds the author's profile.
   */
  unavailableAuthorId?: string;

  /**
   * X did not send these counts, so each 0 means unknown.
   */
  unknownCounts?: Array<
    'retweetCount' | 'replyCount' | 'likeCount' | 'quoteCount' | 'viewCount' | 'bookmarkCount'
  >;

  /**
   * User IDs that left this conversation.
   */
  unmentionedUserIds?: Array<string>;

  url?: string;

  viewState?: string;
}

export namespace TweetDetail {
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
          screenName?: string;

          text?: string;

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
          screenName?: string;

          text?: string;

          type?: string;

          url?: string;

          urlType?: string;
        }
      }
    }
  }
}

/**
 * Durable write record. Poll statusUrl until terminal is true. Reusing its
 * Idempotency-Key returns this record. Create another action only when safeToRetry
 * is true.
 */
export interface TweetCreateResponse {
  id: string;

  /**
   * Connected account selected for the write.
   */
  account: TweetCreateResponse.Account | null;

  action:
    | 'create_tweet'
    | 'delete_tweet'
    | 'like'
    | 'unlike'
    | 'retweet'
    | 'unretweet'
    | 'follow'
    | 'unfollow'
    | 'remove_follower'
    | 'send_dm'
    | 'delete_dm'
    | 'upload_media'
    | 'update_profile'
    | 'update_avatar'
    | 'update_banner'
    | 'create_community'
    | 'delete_community'
    | 'join_community'
    | 'leave_community';

  /**
   * plannedCredits is the approved maximum. chargedCredits comes from the settled
   * credit ledger. Pending or failed writes are not charged.
   */
  billing: TweetCreateResponse.Billing;

  charged: boolean;

  chargedCredits: string;

  /**
   * Exact follow-up an API client or agent should perform.
   */
  nextAction: TweetCreateResponse.NextAction | null;

  object: 'x_write_action';

  pollAfterMs: number | null;

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  request: TweetCreateResponse.Request;

  /**
   * Confirmed result produced by the write, when available.
   */
  result: TweetCreateResponse.Result | null;

  /**
   * True only when a new attempt can reasonably succeed.
   */
  retryable: boolean;

  /**
   * True only when X did not get the write and a new idempotency key may be used.
   */
  safeToRetry: boolean;

  sendDispatched: boolean;

  status: 'accepted' | 'dispatching' | 'pending_confirmation' | 'success' | 'failed' | 'expired';

  statusUrl: string;

  success: boolean;

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  target: TweetCreateResponse.Target | null;

  targetId: string | null;

  terminal: boolean;

  writeActionId: string;

  /**
   * Compatibility field for a confirmed community ID.
   */
  communityId?: string;

  /**
   * Confirmed community name when available.
   */
  communityName?: string;

  completedAt?: string;

  confirmationAttempts?: number;

  confirmationCheckedAt?: string;

  confirmedAt?: string;

  createdAt?: string;

  /**
   * Structured recovery context for a failed write.
   */
  details?: { [key: string]: unknown };

  error?: string;

  /**
   * Deadline for resolving a non-terminal write. This is not the Idempotency-Key
   * retention deadline.
   */
  expiresAt?: string;

  /**
   * True when this answers a retry of an earlier request with the same
   * Idempotency-Key.
   */
  idempotent?: boolean;

  /**
   * Media count, kind, size, and billing details when used.
   */
  media?: { [key: string]: unknown };

  /**
   * Compatibility field for a confirmed media upload ID.
   */
  mediaId?: string;

  /**
   * Public media URL when the upload creates one.
   */
  mediaUrl?: string;

  message?: string;

  /**
   * Compatibility field for a confirmed direct message ID.
   */
  messageId?: string;

  requestHash?: string;

  requestId?: string;

  /**
   * Compatibility result ID for other write actions.
   */
  resultId?: string;

  /**
   * Dispatch timestamp when the write reached execution.
   */
  sendDispatchedAt?: string;

  /**
   * Compatibility field for a confirmed tweet result ID.
   */
  tweetId?: string;

  updatedAt?: string;
}

export namespace TweetCreateResponse {
  /**
   * Connected account selected for the write.
   */
  export interface Account {
    id: string;

    username: string;
  }

  /**
   * plannedCredits is the approved maximum. chargedCredits comes from the settled
   * credit ledger. Pending or failed writes are not charged.
   */
  export interface Billing {
    charged: boolean;

    chargedCredits: string;

    plannedCredits: string;

    status: 'not_charged' | 'pending' | 'charged' | 'charge_failed' | 'refunded';
  }

  /**
   * Exact follow-up an API client or agent should perform.
   */
  export interface NextAction {
    type: 'poll' | 'retry' | 'verify_result' | 'fix_request';

    /**
     * Milliseconds to wait before you poll or retry.
     */
    afterMs?: number;

    requiresNewIdempotencyKey?: boolean;

    url?: string;
  }

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  export interface Request {
    /**
     * Stable hash of account, action, target, and payload.
     */
    hash: string | null;

    /**
     * Exact sanitized payload dispatched for this action.
     */
    payload: { [key: string]: unknown } | null;
  }

  /**
   * Confirmed result produced by the write, when available.
   */
  export interface Result {
    id?: string;

    state?: string;

    type?: 'tweet' | 'direct_message' | 'media' | 'community' | 'state_change';
  }

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  export interface Target {
    id: string;

    type: 'tweet' | 'user' | 'community';
  }
}

export interface TweetRetrieveResponse {
  /**
   * Full tweet with text, engagement metrics, media, and metadata. A zero metric can
   * mean X did not report the count.
   */
  tweet: TweetDetail;

  /**
   * Author profile. Lookups always include follower count & verification. Other
   * fields depend on availability.
   */
  author?: TweetAuthor;
}

export interface TweetListResponse extends Shared.PaginatedTweets {
  /**
   * Each `ids` entry that names no post, with why. Absent when every entry names a
   * post.
   */
  skipped?: Array<TweetListResponse.Skipped>;
}

export namespace TweetListResponse {
  export interface Skipped {
    /**
     * The entry as sent.
     */
    entry: string;

    /**
     * Why the entry names no post.
     */
    reason: string;
  }
}

/**
 * Durable write record. Poll statusUrl until terminal is true. Reusing its
 * Idempotency-Key returns this record. Create another action only when safeToRetry
 * is true.
 */
export interface TweetDeleteResponse {
  id: string;

  /**
   * Connected account selected for the write.
   */
  account: TweetDeleteResponse.Account | null;

  action:
    | 'create_tweet'
    | 'delete_tweet'
    | 'like'
    | 'unlike'
    | 'retweet'
    | 'unretweet'
    | 'follow'
    | 'unfollow'
    | 'remove_follower'
    | 'send_dm'
    | 'delete_dm'
    | 'upload_media'
    | 'update_profile'
    | 'update_avatar'
    | 'update_banner'
    | 'create_community'
    | 'delete_community'
    | 'join_community'
    | 'leave_community';

  /**
   * plannedCredits is the approved maximum. chargedCredits comes from the settled
   * credit ledger. Pending or failed writes are not charged.
   */
  billing: TweetDeleteResponse.Billing;

  charged: boolean;

  chargedCredits: string;

  /**
   * Exact follow-up an API client or agent should perform.
   */
  nextAction: TweetDeleteResponse.NextAction | null;

  object: 'x_write_action';

  pollAfterMs: number | null;

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  request: TweetDeleteResponse.Request;

  /**
   * Confirmed result produced by the write, when available.
   */
  result: TweetDeleteResponse.Result | null;

  /**
   * True only when a new attempt can reasonably succeed.
   */
  retryable: boolean;

  /**
   * True only when X did not get the write and a new idempotency key may be used.
   */
  safeToRetry: boolean;

  sendDispatched: boolean;

  status: 'accepted' | 'dispatching' | 'pending_confirmation' | 'success' | 'failed' | 'expired';

  statusUrl: string;

  success: boolean;

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  target: TweetDeleteResponse.Target | null;

  targetId: string | null;

  terminal: boolean;

  writeActionId: string;

  /**
   * Compatibility field for a confirmed community ID.
   */
  communityId?: string;

  /**
   * Confirmed community name when available.
   */
  communityName?: string;

  completedAt?: string;

  confirmationAttempts?: number;

  confirmationCheckedAt?: string;

  confirmedAt?: string;

  createdAt?: string;

  /**
   * Structured recovery context for a failed write.
   */
  details?: { [key: string]: unknown };

  error?: string;

  /**
   * Deadline for resolving a non-terminal write. This is not the Idempotency-Key
   * retention deadline.
   */
  expiresAt?: string;

  /**
   * True when this answers a retry of an earlier request with the same
   * Idempotency-Key.
   */
  idempotent?: boolean;

  /**
   * Media count, kind, size, and billing details when used.
   */
  media?: { [key: string]: unknown };

  /**
   * Compatibility field for a confirmed media upload ID.
   */
  mediaId?: string;

  /**
   * Public media URL when the upload creates one.
   */
  mediaUrl?: string;

  message?: string;

  /**
   * Compatibility field for a confirmed direct message ID.
   */
  messageId?: string;

  requestHash?: string;

  requestId?: string;

  /**
   * Compatibility result ID for other write actions.
   */
  resultId?: string;

  /**
   * Dispatch timestamp when the write reached execution.
   */
  sendDispatchedAt?: string;

  /**
   * Compatibility field for a confirmed tweet result ID.
   */
  tweetId?: string;

  updatedAt?: string;
}

export namespace TweetDeleteResponse {
  /**
   * Connected account selected for the write.
   */
  export interface Account {
    id: string;

    username: string;
  }

  /**
   * plannedCredits is the approved maximum. chargedCredits comes from the settled
   * credit ledger. Pending or failed writes are not charged.
   */
  export interface Billing {
    charged: boolean;

    chargedCredits: string;

    plannedCredits: string;

    status: 'not_charged' | 'pending' | 'charged' | 'charge_failed' | 'refunded';
  }

  /**
   * Exact follow-up an API client or agent should perform.
   */
  export interface NextAction {
    type: 'poll' | 'retry' | 'verify_result' | 'fix_request';

    /**
     * Milliseconds to wait before you poll or retry.
     */
    afterMs?: number;

    requiresNewIdempotencyKey?: boolean;

    url?: string;
  }

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  export interface Request {
    /**
     * Stable hash of account, action, target, and payload.
     */
    hash: string | null;

    /**
     * Exact sanitized payload dispatched for this action.
     */
    payload: { [key: string]: unknown } | null;
  }

  /**
   * Confirmed result produced by the write, when available.
   */
  export interface Result {
    id?: string;

    state?: string;

    type?: 'tweet' | 'direct_message' | 'media' | 'community' | 'state_change';
  }

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  export interface Target {
    id: string;

    type: 'tweet' | 'user' | 'community';
  }
}

export interface TweetCheckRepostResponse {
  /**
   * How many of the account's newest posts the check read.
   */
  checkedPosts: number;

  /**
   * Whether the check read the account's whole timeline.
   */
  complete: boolean;

  /**
   * Whether the account reposted the post.
   */
  isRetweeted: boolean;

  /**
   * When the account reposted it, else null.
   */
  retweetedAt: string | null;

  /**
   * The ID of the account's repost, else null.
   */
  retweetId: string | null;

  tweetId: string;

  userId: string;
}

export interface TweetEmbedResponse {
  /**
   * Holds the HTML that embeds one tweet on a website.
   */
  embed: TweetEmbedResponse.Embed;
}

export namespace TweetEmbedResponse {
  /**
   * Holds the HTML that embeds one tweet on a website.
   */
  export interface Embed {
    /**
     * Display name of the tweet's author.
     */
    authorName: string;

    /**
     * Link to the author's profile.
     */
    authorUrl: string;

    /**
     * Markup to place on a page. It loads X's widget script unless `omitScript` is
     * `true`.
     */
    html: string;

    /**
     * ID of the embedded tweet.
     */
    tweetId: string;

    /**
     * Link to the tweet with its author's username.
     */
    url: string;

    /**
     * Height in pixels, when X fixes it.
     */
    height?: number;

    /**
     * Width of the embed in pixels.
     */
    width?: number;
  }
}

export interface TweetGetInsightsResponse {
  /**
   * Engagement insights of one tweet. Engagements are likes, replies, reposts and
   * quotes. A rate is null when nothing divides it, such as a tweet without views.
   */
  insights: TweetGetInsightsResponse.Insights;
}

export namespace TweetGetInsightsResponse {
  /**
   * Engagement insights of one tweet. Engagements are likes, replies, reposts and
   * quotes. A rate is null when nothing divides it, such as a tweet without views.
   */
  export interface Insights {
    /**
     * Hours since the tweet went up.
     */
    ageHours: number | null;

    /**
     * Reposts and quotes per like.
     */
    amplification: number | null;

    /**
     * ID of the author.
     */
    authorId: string | null;

    /**
     * Username of the author.
     */
    authorUserName: string | null;

    /**
     * Replies per like.
     */
    conversation: number | null;

    /**
     * When the tweet went up.
     */
    createdAt: string | null;

    /**
     * Engagements as a percent of views.
     */
    engagementPerView: number | null;

    /**
     * Engagements as a percent of the author's followers.
     */
    engagementRate: number | null;

    /**
     * Likes, replies, reposts and quotes.
     */
    engagements: number;

    /**
     * Engagements per hour since the tweet went up.
     */
    engagementsPerHour: number | null;

    /**
     * The public counts of one tweet.
     */
    metrics: Insights.Metrics;

    /**
     * ID of the tweet the insights describe.
     */
    tweetId: string;
  }

  export namespace Insights {
    /**
     * The public counts of one tweet.
     */
    export interface Metrics {
      /**
       * Bookmarks.
       */
      bookmarks: number;

      /**
       * Likes.
       */
      likes: number;

      /**
       * Quotes.
       */
      quotes: number;

      /**
       * Replies.
       */
      replies: number;

      /**
       * Reposts.
       */
      reposts: number;

      /**
       * Views.
       */
      views: number;
    }
  }
}

/**
 * Direct reply rows. No-mode requests use resumable automatic coverage. Complete
 * mode also returns nested replies and coverage diagnostics.
 */
export interface TweetGetRepliesResponse extends Omit<Shared.PaginatedTweets, 'tweets'> {
  tweets: Array<TweetGetRepliesResponse.Tweet>;

  /**
   * Direct-reply coverage & collection evidence.
   */
  diagnostic?: TweetGetRepliesResponse.Diagnostic;

  /**
   * Present on the last automatic page. X counts this many more replies but shows
   * them to nobody. They may be hidden, protected or deleted. A retry returns the
   * same replies.
   */
  hiddenReplies?: number;

  /**
   * Present when your limit cut a complete-mode answer. The post has more replies;
   * raise limit to get them all.
   */
  limit_reached?: true;

  /**
   * Explains an answer cut by your limit.
   */
  message?: string;

  /**
   * Nested replies. Excluded from direct coverage.
   */
  nested_replies?: Array<TweetGetRepliesResponse.NestedReply>;

  /**
   * Present with latest or oldest sort. The read stopped before it held every reply
   * X shows. Rows stay sorted by date, but replies may be missing between them.
   * Retry later for a gap-free order. Complete mode and automatic pages set it
   * alike.
   */
  orderPartial?: true;

  /**
   * Present on an answer that lacks replies of a large thread posted before this
   * time. X shows only part of the replies older than 7 days. A retry returns about
   * the same replies.
   */
  partialBefore?: string;
}

export namespace TweetGetRepliesResponse {
  /**
   * Direct-reply coverage & collection evidence.
   */
  export interface Diagnostic {
    /**
     * Coverage met its target, or read the whole time window, without truncation.
     * Protected accounts' replies count but aren't returned.
     */
    complete: boolean;

    /**
     * Unique direct replies / reported count, as a percentage.
     */
    coveragePercentage: number;

    /**
     * Cursor requests that failed.
     */
    cursorFailures: number;

    /**
     * Duplicate IDs removed across pages & strategies.
     */
    duplicateCount: number;

    /**
     * Empty pages rejected for no progress.
     */
    emptyFalseProgressPages: number;

    /**
     * Malformed response items rejected.
     */
    malformedCount: number;

    /**
     * Expected X modules or fields missing.
     */
    missingResponseModulesOrFields: Array<string>;

    /**
     * Unique nested replies, excluded from direct coverage.
     */
    nestedReplyCount: number;

    /**
     * Pages attempted across strategies.
     */
    pagesAttempted: number;

    /**
     * Recommended next action when coverage is incomplete.
     */
    recommendedFallback: string;

    /**
     * Looping cursors rejected.
     */
    repeatedCursorCount: number;

    /**
     * Source post reply count.
     */
    reportedReplyCount: number;

    /**
     * Requested row limit truncated safe results.
     */
    responseTruncated: boolean;

    /**
     * Field counts across collected direct replies.
     */
    richness: Diagnostic.Richness;

    /**
     * Every source ended. A retry returns the same rows.
     */
    sourcesEnded: boolean;

    /**
     * Pagination & contribution evidence per strategy.
     */
    strategiesAttempted: Array<Diagnostic.StrategiesAttempted>;

    /**
     * Direct replies required to meet the target.
     */
    targetDirectReplies: number;

    /**
     * Unique direct replies to the source post.
     */
    uniqueDirectReplies: number;

    /**
     * Tweets rejected from other conversations.
     */
    unrelatedCount: number;

    /**
     * Replies are accounted for through the requested scope & depth. Source errors
     * remain separate.
     */
    replyScopeComplete?: boolean;

    /**
     * All child counts are known & match collected replies.
     */
    replyTreeComplete?: boolean;
  }

  export namespace Diagnostic {
    /**
     * Field counts across collected direct replies.
     */
    export interface Richness {
      /**
       * Replies with articles.
       */
      article: number;

      /**
       * Replies with author details.
       */
      author: number;

      /**
       * Replies with cards.
       */
      card: number;

      /**
       * Replies with community notes.
       */
      communityNote: number;

      /**
       * Replies with creation timestamps.
       */
      createdAt: number;

      /**
       * Replies with engagement counts.
       */
      engagementCounts: number;

      /**
       * Replies with entities.
       */
      entities: number;

      /**
       * Replies with language.
       */
      language: number;

      /**
       * Replies with media.
       */
      media: number;

      /**
       * Replies with quotes or reposts.
       */
      quotedOrRepostedTweet: number;

      /**
       * Replies with text.
       */
      text: number;

      /**
       * Unique direct replies evaluated.
       */
      totalReplies: number;

      /**
       * Replies with canonical URLs.
       */
      url: number;
    }

    /**
     * Reply counts & stop reason per strategy.
     */
    export interface StrategiesAttempted {
      name: string;

      /**
       * Whole number from 0.
       */
      newDirectReplies: number;

      /**
       * Whole number from 0.
       */
      newNestedReplies: number;

      /**
       * Whole number from 0.
       */
      pagesAttempted: number;

      stopReason:
        | 'deadline'
        | 'empty_pages'
        | 'error'
        | 'missing_cursor'
        | 'no_next_page'
        | 'page_cap'
        | 'partial_view'
        | 'repeated_cursor'
        | 'window_covered'
        | 'window_passed';

      /**
       * For a search of the post's conversation, the page that listed each new direct
       * reply, from 1.
       */
      newDirectReplyPages?: Array<number>;
    }
  }

  /**
   * Reply row. A reply the post's author hid carries hiddenByAuthor.
   */
  export interface NestedReply extends Shared.SearchTweet {
    /**
     * Present on a reply the post's author hid. Complete-mode replies carry it when
     * includeHidden asks for them.
     */
    hiddenByAuthor?: true;
  }

  /**
   * Reply row. A reply the post's author hid carries hiddenByAuthor.
   */
  export interface Tweet extends Shared.SearchTweet {
    /**
     * Present on a reply the post's author hid. Complete-mode replies carry it when
     * includeHidden asks for them.
     */
    hiddenByAuthor?: true;
  }
}

/**
 * A page of user IDs without profiles. Follow next_cursor while the response
 * reports more pages.
 */
export interface TweetGetRetweeterIDsResponse {
  has_next_page: boolean;

  /**
   * X user IDs, newest relationship first.
   */
  ids: Array<string>;

  next_cursor: string;
}

export interface TweetGetSubtitlesResponse {
  /**
   * Holds the caption tracks of one tweet's videos.
   */
  subtitles: TweetGetSubtitlesResponse.Subtitles;
}

export namespace TweetGetSubtitlesResponse {
  /**
   * Holds the caption tracks of one tweet's videos.
   */
  export interface Subtitles {
    /**
     * Caption tracks, empty when no video has captions.
     */
    tracks: Array<Subtitles.Track>;

    /**
     * ID of the tweet.
     */
    tweetId: string;
  }

  export namespace Subtitles {
    /**
     * Holds one caption track of a video.
     */
    export interface Track {
      /**
       * True when X transcribed the audio itself.
       */
      autoGenerated: boolean;

      /**
       * Timed captions in order.
       */
      cues: Array<Track.Cue>;

      /**
       * Every cue's text in order, as one line.
       */
      text: string;

      /**
       * True when the track holds more than 50 caption files. The cues then cover the
       * first 50.
       */
      truncated: boolean;

      /**
       * Link to the track's first WebVTT file.
       */
      url: string;

      /**
       * Language code of the track, in lower case.
       */
      language?: string;

      /**
       * Media key of the video, as media rows carry it.
       */
      mediaKey?: string;

      /**
       * Track name the uploader or X gave it.
       */
      name?: string;
    }

    export namespace Track {
      export interface Cue {
        /**
         * End time in milliseconds.
         */
        endMs: number;

        /**
         * Start time in milliseconds.
         */
        startMs: number;

        /**
         * Caption text, with a line break between lines.
         */
        text: string;
      }
    }
  }
}

export interface TweetResolveLinksResponse {
  links: Array<TweetResolveLinksResponse.Link>;

  /**
   * Links not read, in the order sent. X did not answer for them in time, or
   * available credits ran out. Send them again.
   */
  unprocessedUrls: Array<string>;
}

export namespace TweetResolveLinksResponse {
  /**
   * Pairs one t.co link with the URL it leads to.
   */
  export interface Link {
    /**
     * The t.co link, as `https://t.co/<code>`.
     */
    url: string;

    /**
     * Target URL, as the link's author set it. Xquik does not check it. Absent for a
     * link t.co does not have.
     */
    resolvedUrl?: string;
  }
}

/**
 * Follow next_cursor while the response reports more pages. A page can hold fewer
 * rows than its limit & still report more. That report decides, not the row count.
 * A page can be empty & still report more, filtered or not. Automatic search, user
 * Tweet & reply coverage keeps shape, filters, aliases & billing. Unprefixed
 * cursors are legacy.
 */
export type TweetSearchResponse = Shared.PaginatedTweets | TweetSearchResponse.TweetSearchCoverageResponse;

export namespace TweetSearchResponse {
  /**
   * Terminal Tweet search coverage response with diagnostics.
   */
  export interface TweetSearchCoverageResponse extends Omit<
    Shared.PaginatedTweets,
    'has_next_page' | 'next_cursor'
  > {
    /**
     * Coverage evidence across parallel search strategies.
     */
    diagnostic: TweetSearchCoverageResponse.Diagnostic;

    has_next_page: false;

    next_cursor: '';
  }

  export namespace TweetSearchCoverageResponse {
    /**
     * Coverage evidence across parallel search strategies.
     */
    export interface Diagnostic {
      /**
       * True after all active strategies exhaust their sources. An empty read of the
       * whole search window also ends its time slices.
       */
      complete: boolean;

      /**
       * Whole number from 0.
       */
      cursorFailureCount: number;

      deadlineReached: boolean;

      /**
       * Whole number from 0.
       */
      duplicateCount: number;

      /**
       * Whole number from 0.
       */
      failedStrategyCount: number;

      /**
       * Whole number from 0.
       */
      malformedCount: number;

      /**
       * Whole number from 0.
       */
      pagesFetched: number;

      /**
       * Whether bounded time windows ran in parallel.
       */
      partitioned: boolean;

      /**
       * True when credits or the requested limit reduce output.
       */
      responseTruncated: boolean;

      resultLimitReached: boolean;

      returnedTweets: number;

      /**
       * Whole number from 0.
       */
      stalledStrategyCount: number;

      strategies: Array<Diagnostic.Strategy>;

      strategyCount: number;

      uniqueTweets: number;
    }

    export namespace Diagnostic {
      /**
       * Result counts and stop reason for one Tweet search strategy.
       */
      export interface Strategy {
        /**
         * Whole number from 0.
         */
        duplicateCount: number;

        /**
         * Whole number from 0.
         */
        pagesFetched: number;

        queryType: 'Latest' | 'Top';

        /**
         * Reason a coverage strategy stopped.
         */
        stopReason:
          'cursor_failure' | 'deadline' | 'exhausted' | 'failed' | 'page_limit' | 'result_limit' | 'stalled';

        strategy: number;

        /**
         * Whole number from 0.
         */
        uniqueAdded: number;

        /**
         * Non-overlapping time partition used by one strategy.
         */
        window?: Strategy.Window;
      }

      export namespace Strategy {
        /**
         * Non-overlapping time partition used by one strategy.
         */
        export interface Window {
          sinceTime: string;

          untilTime: string;
        }
      }
    }
  }
}

export interface TweetTranslateResponse {
  /**
   * Holds X's translation of one tweet into the requested language. `entities` holds
   * the links, mentions, and tags with their offsets in the translated text, and is
   * empty when the text has none.
   */
  translation: TweetTranslateResponse.Translation;
}

export namespace TweetTranslateResponse {
  /**
   * Holds X's translation of one tweet into the requested language. `entities` holds
   * the links, mentions, and tags with their offsets in the translated text, and is
   * empty when the text has none.
   */
  export interface Translation {
    /**
     * Lists hashtags, symbols, links, and mentions from tweet text.
     */
    entities: Translation.Entities;

    /**
     * Language code of the translated text, in lower case.
     */
    language: string;

    /**
     * Translated tweet text.
     */
    text: string;

    /**
     * ID of the translated tweet.
     */
    tweetId: string;

    /**
     * Language code X detects in the tweet, when it names one.
     */
    sourceLanguage?: string;
  }

  export namespace Translation {
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
  }
}

export interface TweetCreateParams {
  /**
   * Body param: X account (@username or account ID)
   */
  account: string;

  /**
   * Header param: Use one unique value per intended write. Reuse it only for an
   * identical retry. A matching retry returns the first answer again, with
   * idempotent: true added. It keeps the first status, body & Retry-After. It sends
   * nothing to X & charges nothing. While the first request runs, a retry returns
   * 202 & the action. Different input returns 409. Protection lasts at least 90
   * days.
   */
  'Idempotency-Key': string;

  /**
   * Body param: The Community to post into, from 1 to 19 digits. The account must be
   * a member. Xquik picks the Community in X's composer, checks the post request
   * names it & reads the post after. A post X puts outside the Community is deleted
   * & fails uncharged. Not with `reply_to_tweet_id`, since X keeps replies public.
   */
  community_id?: string;

  /**
   * Body param
   */
  is_note_tweet?: boolean;

  /**
   * Body param: Publicly reachable URLs of up to 4 images or exactly 1 MP4 video up
   * to 100 MB. Media adds 2 credits per started MB across all files.
   */
  media?: Array<string>;

  /**
   * Body param: The post to reply to. Any X post ID works, from 1 to 19 digits.
   */
  reply_to_tweet_id?: string;

  /**
   * Body param: Tweet text (optional when media is provided)
   */
  text?: string;
}

export interface TweetRetrieveParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface TweetListParams {
  /**
   * 1 to 100 posts, separated by commas. Each is a tweet ID or a tweet URL, such as
   * x.com/nasa/status/20. A post named twice is read once. Any other entry is
   * skipped & listed under `skipped` with why. A batch without 1 post gets 400
   * `invalid_tweet_id`.
   */
  ids: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface TweetDeleteParams {
  /**
   * Body param: X account identifier (@username or account ID)
   */
  account: string;

  /**
   * Header param: Use one unique value per intended write. Reuse it only for an
   * identical retry. A matching retry returns the first answer again, with
   * idempotent: true added. It keeps the first status, body & Retry-After. It sends
   * nothing to X & charges nothing. While the first request runs, a retry returns
   * 202 & the action. Different input returns 409. Protection lasts at least 90
   * days.
   */
  'Idempotency-Key': string;
}

export interface TweetCheckRepostParams {
  /**
   * User ID, username with or without @, or profile URL.
   */
  user: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface TweetEmbedParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Set `true` to leave photos, videos, and link cards out.
   */
  hideMedia?: boolean;

  /**
   * Set `true` to leave the tweet this one replies to out.
   */
  hideThread?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Set `true` to leave the widget script tag out, for pages that load it once
   * themselves.
   */
  omitScript?: boolean;

  /**
   * Color theme of the embed. X uses light when left out.
   */
  theme?: 'light' | 'dark';
}

export interface TweetGetFavoritersParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

  /**
   * Only return profiles with a location.
   */
  hasLocation?: boolean;

  /**
   * Only return profiles with a website.
   */
  hasWebsite?: boolean;

  /**
   * Match a location substring, ignoring case.
   */
  locationContains?: string;

  /**
   * Maximum follower count. Missing counts pass this maximum.
   */
  maxFollowers?: number;

  /**
   * Profiles may follow at most this many accounts.
   */
  maxFollowing?: number;

  /**
   * Maximum post count. maxPosts is also accepted.
   */
  maxStatuses?: number;

  /**
   * Minimum account age in whole days.
   */
  minAccountAgeDays?: number;

  /**
   * Minimum follower count. Filtering happens before billing.
   */
  minFollowers?: number;

  /**
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Profiles to request from this page (1-200, default 200). Source, filters or
   * credits can return fewer. Follow next_cursor for more pages. Aliases: limit,
   * count, max_results, maxItems, max_items & per_page.
   */
  pageSize?: number;

  /**
   * Match a username substring, ignoring case.
   */
  usernameContains?: string;

  /**
   * Only return verified profiles.
   */
  verifiedOnly?: boolean;

  /**
   * Match the verification type exactly, ignoring case.
   */
  verifiedType?: string;
}

export interface TweetGetHiddenRepliesParams {
  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Only return tweets from Blue-verified authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

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
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
   */
  maxId?: string;

  /**
   * Maximum quotes threshold.
   */
  maxQuotes?: number;

  /**
   * Maximum replies threshold.
   */
  maxReplies?: number;

  /**
   * Maximum retweets threshold.
   */
  maxRetweets?: number;

  /**
   * Filter media. Aliases: has_video, has_media.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum bookmark count threshold.
   */
  minBookmarks?: number;

  /**
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * Minimum view count threshold.
   */
  minViews?: number;

  /**
   * Only return native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

  /**
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
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

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface TweetGetInsightsParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface TweetGetQuotesParams {
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
   * Only return tweets from Blue-verified authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Geo bounding box, e.g. -74.1 40.6 -73.9 40.8.
   */
  boundingBox?: string;

  /**
   * Keep only Tweets with this card type, such as poll2choice_text_only. Tweet
   * search checks each Tweet's card.
   */
  cardName?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Cursor from the previous response. Existing unprefixed cursors keep legacy
   * standard behavior. Pages can be empty before more rows; follow next_cursor. Also
   * read as next_cursor, next_token, pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * X search no longer supports excludeSource. A Tweet search with it answers 424 &
   * charges nothing.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * X search no longer supports geocode. A Tweet search with it answers 424 &
   * charges nothing.
   */
  geocode?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Keep replies that quote the post. Automatic pages keep them unless this is
   * false. Standard pages keep them only when it is true. Explicit replies takes
   * precedence.
   */
  includeReplies?: boolean;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Words the Tweets must match, in X search syntax.
   */
  keywords?: string;

  /**
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Search within a list ID.
   */
  listId?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
   */
  maxId?: string;

  /**
   * Maximum quotes threshold.
   */
  maxQuotes?: number;

  /**
   * Maximum replies threshold.
   */
  maxReplies?: number;

  /**
   * Maximum retweets threshold.
   */
  maxRetweets?: number;

  /**
   * Filter media. Aliases: has_video, has_media.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum bookmark count threshold.
   */
  minBookmarks?: number;

  /**
   * @deprecated Use minLikes instead. The API still reads minFaves.
   */
  minFaves?: number;

  /**
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * Minimum view count threshold.
   */
  minViews?: number;

  /**
   * Optional legacy pagination override. Search-only filters such as keywords apply
   * only without it.
   */
  mode?: 'standard';

  /**
   * Only return native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * Match a place name.
   */
  near?: string;

  /**
   * X no longer searches filter:news.
   */
  news?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Automatic pages accept 1-300 Tweets, standard pages 1-100. Default 20. Follow
   * next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

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
   * Latest for newest first, or Top for the quotes X ranks highest. Top is X's
   * ranking, not a count order, & a later page can hold a quote X ranks higher. Any
   * case. Alias sort, which also takes Recency & Relevance. Send the same value with
   * each cursor. Standard pages list Latest.
   */
  queryType?: 'Latest' | 'Top';

  /**
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Enable the safe-search filter.
   */
  safe?: boolean;

  /**
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * Inclusive ISO bound for Tweet creation time, such as 2026-09-25T19:20:41Z. Unix
   * seconds also work. A time without an offset is UTC.
   */
  sinceTime?: string;

  /**
   * X search no longer supports source. A Tweet search with it answers 424 & charges
   * nothing.
   */
  source?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
   */
  untilDate?: string;

  /**
   * Exclusive ISO bound for Tweet creation time. Unix seconds also work. A time
   * without an offset is UTC.
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

  /**
   * X search no longer supports within. A Tweet search with it answers 424 & charges
   * nothing. Use near alone.
   */
  within?: string;

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface TweetGetRepliesParams {
  /**
   * Legacy cursor alias. Prefer cursor.
   */
  after?: string;

  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Only return tweets from Blue-verified authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  cardName?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Cursor from the previous response. Existing unprefixed cursors keep legacy
   * standard behavior. Pages can be empty before more rows; follow next_cursor. Also
   * read as next_cursor, next_token, pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * Exclude replies written by the source-post author.
   */
  excludeOriginalAuthor?: boolean;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  geocode?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Only return replies containing media.
   */
  hasMediaOnly?: boolean;

  /**
   * Complete mode only. Adds the replies the post's author hid, each with
   * hiddenByAuthor true. They count toward limit like any reply. A paged read
   * answers 400. Get its hidden replies from GET /x/tweets/{id}/hidden-replies.
   */
  includeHidden?: boolean;

  /**
   * Include the source post and count it toward limit.
   */
  includeOriginalPost?: boolean;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Complete mode defaults to 25,000 combined direct & nested replies; set another
   * total with limit. Automatic pages accept 1-300, standard pages 1-100.
   */
  limit?: number;

  /**
   * Maximum reply depth from the source post.
   */
  maxDepth?: number;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
   */
  maxId?: string;

  /**
   * Maximum quotes threshold.
   */
  maxQuotes?: number;

  /**
   * Maximum replies threshold.
   */
  maxReplies?: number;

  /**
   * Maximum retweets threshold.
   */
  maxRetweets?: number;

  /**
   * Filter media. Aliases: has_video, has_media.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum bookmark count threshold.
   */
  minBookmarks?: number;

  /**
   * @deprecated Use minLikes instead. The API still reads minFaves.
   */
  minFaves?: number;

  /**
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * Minimum view count threshold.
   */
  minViews?: number;

  /**
   * Override automatic coverage. Standard uses legacy pagination. Complete adds
   * nested replies, diagnostics, scope, depth, and original-post controls.
   */
  mode?: 'standard' | 'complete';

  /**
   * Only return native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  near?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  news?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Automatic pages accept 1-300 Tweets, standard pages 1-100. Default 20. Follow
   * next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

  /**
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  safe?: boolean;

  /**
   * Select all replies, direct replies, or nested replies.
   */
  scope?: 'all' | 'direct' | 'nested';

  /**
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * Inclusive ISO bound for Tweet creation time, such as 2026-09-25T19:20:41Z. Unix
   * seconds also work. A time without an offset is UTC.
   */
  sinceTime?: string;

  /**
   * Sorts the selected replies before limit applies. Complete mode defaults to
   * relevance. Automatic pages list the newest first unless you set sort; standard
   * pages ignore it. With likes, each page is sorted by likes. A later page can hold
   * a reply with more likes. The order is final on the last page. Latest & oldest
   * sort every row by date. They read the whole thread first, for up to 20 s. An
   * answer that stopped before every reply X shows sets orderPartial.
   */
  sort?: 'relevance' | 'latest' | 'oldest' | 'likes';

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  source?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
   */
  untilDate?: string;

  /**
   * Exclusive ISO bound for Tweet creation time. Unix seconds also work. A time
   * without an offset is UTC.
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

  /**
   * @deprecated The API ignores this filter on this route. Remove it.
   */
  within?: string;

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface TweetGetRetweeterIDsParams {
  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Profiles to request from this page (1-200, default 200). Source, filters or
   * credits can return fewer. Follow next_cursor for more pages. Aliases: limit,
   * count, max_results, maxItems, max_items & per_page.
   */
  pageSize?: number;
}

export interface TweetGetRetweetersParams {
  /**
   * Match any comma-separated or line-separated bio term, ignoring case.
   */
  bioContains?: string;

  /**
   * Only return profiles X marks as blue verified. X marks many business &
   * government accounts blue too. Use verifiedType for 1 badge type.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Only return profiles that publish an email outside free webmail, such as Gmail.
   */
  businessEmailOnly?: boolean;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Only return profiles with an email at one of these domains. Separate domains
   * with commas. Subdomains match.
   */
  emailDomains?: string;

  /**
   * Add each row's full profile, as GET /x/users/{id} returns it. Pages take several
   * seconds longer.
   */
  enrichProfiles?: boolean;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only return profiles that publish an email.
   */
  hasEmail?: boolean;

  /**
   * Only return profiles with a location.
   */
  hasLocation?: boolean;

  /**
   * Only return profiles with a website.
   */
  hasWebsite?: boolean;

  /**
   * Look up repost event times.
   */
  includeRetweetTimestamp?: boolean;

  /**
   * Match a location substring, ignoring case.
   */
  locationContains?: string;

  /**
   * Maximum follower count. Missing counts pass this maximum.
   */
  maxFollowers?: number;

  /**
   * Profiles may follow at most this many accounts.
   */
  maxFollowing?: number;

  /**
   * Maximum post count. maxPosts is also accepted.
   */
  maxStatuses?: number;

  /**
   * Minimum account age in whole days.
   */
  minAccountAgeDays?: number;

  /**
   * Minimum follower count. Filtering happens before billing.
   */
  minFollowers?: number;

  /**
   * Profiles must follow at least this many accounts.
   */
  minFollowing?: number;

  /**
   * Minimum post count. minPosts is also accepted.
   */
  minStatuses?: number;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Profiles to request from this page (1-200, default 200). Source, filters or
   * credits can return fewer. Follow next_cursor for more pages. Aliases: limit,
   * count, max_results, maxItems, max_items & per_page.
   */
  pageSize?: number;

  /**
   * Match a username substring, ignoring case.
   */
  usernameContains?: string;

  /**
   * Only return verified profiles.
   */
  verifiedOnly?: boolean;

  /**
   * Match the verification type exactly, ignoring case.
   */
  verifiedType?: string;
}

export interface TweetGetSubtitlesParams {
  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface TweetGetThreadParams {
  /**
   * Words or quoted phrases where any one can match. Separate with spaces, commas,
   * or lines.
   */
  anyWords?: string;

  /**
   * Only return tweets from Blue-verified authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

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
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
   */
  maxId?: string;

  /**
   * Maximum quotes threshold.
   */
  maxQuotes?: number;

  /**
   * Maximum replies threshold.
   */
  maxReplies?: number;

  /**
   * Maximum retweets threshold.
   */
  maxRetweets?: number;

  /**
   * Filter media. Aliases: has_video, has_media.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum bookmark count threshold.
   */
  minBookmarks?: number;

  /**
   * @deprecated Use minLikes instead. The API still reads minFaves.
   */
  minFaves?: number;

  /**
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * Minimum view count threshold.
   */
  minViews?: number;

  /**
   * Only return native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

  /**
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Start date in YYYY-MM-DD format, as a UTC day.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date in YYYY-MM-DD format, as a UTC day, inclusive, so its own posts count.
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

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface TweetListTopParams {
  /**
   * Only tweets from one country, as a 2- or 3-letter ISO 3166 code, such as US or
   * USA. Send country or language, not both.
   */
  country?: string;

  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Only tweets in one language, as a 2-letter code, such as en. Send country or
   * language, not both.
   */
  language?: string;

  /**
   * What to rank tweets by. Defaults to likes. Singular names work too, such as
   * like.
   */
  metric?: 'likes' | 'replies' | 'quotes' | 'bookmarks' | 'shares' | 'views';

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;

  /**
   * How far back to look. Defaults to day. Also takes 24h, 7d, 30d, daily, weekly
   * and monthly.
   */
  window?: 'day' | 'week' | 'month';
}

export interface TweetResolveLinksParams {
  /**
   * 1 to 100 links of the form `https://t.co/Xe1nm2pkSX`, separated by commas. Any
   * other link is refused.
   */
  urls: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export interface TweetSearchParams {
  /**
   * Query, Tweet ID, or URL. Alias query. Hyphens negate terms. Use exactPhrase for
   * literals. Valid bounds apply per page. `since:` & `until:` dates are UTC days,
   * written YYYY-MM-DD. 25/12/2026 & 12/25/2026 also work, since each has 1 reading.
   * 04/01/2026 has 2 & answers 424 with the form to write. `since_time:` &
   * `until_time:` take Unix seconds or an ISO 8601 time. `list:` takes a public
   * List's ID. A private List answers 404 list_not_found. X searches up to 512
   * characters. A longer query answers 424 before any read, unless a term of its
   * first OR group fits alone.
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
   * Only return tweets from Blue-verified authors.
   */
  blueVerifiedOnly?: boolean;

  /**
   * Geo bounding box, e.g. -74.1 40.6 -73.9 40.8.
   */
  boundingBox?: string;

  /**
   * Keep only Tweets with this card type, such as poll2choice_text_only. Tweet
   * search checks each Tweet's card.
   */
  cardName?: string;

  /**
   * Cashtags separated by spaces, commas, or lines.
   */
  cashtags?: string;

  /**
   * Conversation ID filter.
   */
  conversationId?: string;

  /**
   * Cursor from the previous response. Existing unprefixed cursors keep legacy
   * standard behavior. Pages can be empty before more rows; follow next_cursor. Also
   * read as next_cursor, next_token, pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Match this literal phrase, including any hyphens.
   */
  exactPhrase?: string;

  /**
   * X search no longer supports excludeSource. A Tweet search with it answers 424 &
   * charges nothing.
   */
  excludeSource?: string;

  /**
   * Words or quoted phrases to exclude. Separate with spaces, commas, or lines.
   */
  excludeWords?: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Filter by author username.
   */
  fromUser?: string;

  /**
   * X search no longer supports geocode. A Tweet search with it answers 424 &
   * charges nothing.
   */
  geocode?: string;

  /**
   * Hashtags separated by spaces, commas, or lines.
   */
  hashtags?: string;

  /**
   * Only replies to this tweet ID.
   */
  inReplyToTweetId?: string;

  /**
   * Words the Tweets must match, in X search syntax.
   */
  keywords?: string;

  /**
   * Filter by language. Alias `lang` is accepted.
   */
  language?: string;

  /**
   * Most unique matches to return after filtering. Default 20; explicit coverage
   * defaults to 2000. At the deadline it returns kept rows & diagnostics. Only
   * returned rows are billed; credits can cut results, & 0 affordable rows returns
   * 402. Aliases: pageSize, count, max_results, maxItems, max_items & per_page.
   */
  limit?: number;

  /**
   * Search within a list ID.
   */
  listId?: string;

  /**
   * Maximum likes threshold. maxLikes & max_likes also work.
   */
  maxFaves?: number;

  /**
   * Return Tweets at or below this ID.
   */
  maxId?: string;

  /**
   * Maximum quotes threshold.
   */
  maxQuotes?: number;

  /**
   * Maximum replies threshold.
   */
  maxReplies?: number;

  /**
   * Maximum retweets threshold.
   */
  maxRetweets?: number;

  /**
   * Filter media. Aliases: has_video, has_media.
   */
  mediaType?: 'images' | 'videos' | 'gifs' | 'media' | 'links' | 'none';

  /**
   * Filter tweets mentioning a username.
   */
  mentioning?: string;

  /**
   * Minimum bookmark count threshold.
   */
  minBookmarks?: number;

  /**
   * @deprecated Use minLikes instead. The API still reads minFaves.
   */
  minFaves?: number;

  /**
   * Minimum likes. Aliases: minFaves, min_likes, min_faves.
   */
  minLikes?: number;

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
   * Minimum view count threshold.
   */
  minViews?: number;

  /**
   * Omit mode for resumable maximum coverage. Standard keeps legacy pagination.
   * Coverage returns diagnostics once and rejects cursors.
   */
  mode?: 'standard' | 'coverage';

  /**
   * Only return native reposts.
   */
  nativeRetweets?: boolean;

  /**
   * Match a place name.
   */
  near?: string;

  /**
   * X no longer searches filter:news.
   */
  news?: boolean;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

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
   * Latest lists posts newest first. Top keeps X's engagement ranking within each
   * read. Xquik reads several of X's views, so a later page can hold a post X ranks
   * higher. Top skips posts X shows above a ranked reply that cannot match the
   * query. They cost nothing. Any case works. Photos, Videos & Media read Latest
   * with mediaType images, videos or media, unless mediaType is set. People & Lists
   * answer 400 & point to /x/users/search & /x/lists/search. Aliases result_type,
   * sort_order, type, search_type, product, category & section.
   */
  queryType?: string;

  /**
   * Only when the caller requests a quote mode.
   */
  quotes?: 'include' | 'exclude' | 'only';

  /**
   * Only quotes of this tweet ID.
   */
  quotesOfTweetId?: string;

  /**
   * Reply mode. Exclude keeps own-thread replies.
   */
  replies?: 'include' | 'exclude' | 'only';

  /**
   * Only when the caller requests a repost mode.
   */
  retweets?: 'include' | 'exclude' | 'only';

  /**
   * Only retweets of this tweet ID.
   */
  retweetsOfTweetId?: string;

  /**
   * Enable the safe-search filter.
   */
  safe?: boolean;

  /**
   * Start date as a UTC day, written YYYY-MM-DD. 25/12/2026 & 12/25/2026 also work,
   * since each has 1 reading. A date that fits both orders reads month first, so
   * 04/01/2026 is 1 April.
   */
  sinceDate?: string;

  /**
   * Return Tweets whose IDs exceed this ID.
   */
  sinceId?: string;

  /**
   * Inclusive ISO bound for Tweet creation time, such as 2026-09-25T19:20:41Z. Unix
   * seconds also work. A time without an offset is UTC.
   */
  sinceTime?: string;

  /**
   * X search no longer supports source. A Tweet search with it answers 424 & charges
   * nothing.
   */
  source?: string;

  /**
   * Filter replies sent to a username.
   */
  toUser?: string;

  /**
   * End date as a UTC day, inclusive, so its own posts count. It takes the same date
   * forms as sinceDate.
   */
  untilDate?: string;

  /**
   * Exclusive ISO bound for Tweet creation time. Unix seconds also work. A time
   * without an offset is UTC.
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

  /**
   * X search no longer supports within. A Tweet search with it answers 424 & charges
   * nothing. Use near alone.
   */
  within?: string;

  /**
   * Keeps Tweets from a recent window, such as 90m or 7d. Use a whole number & s, m,
   * h or d.
   */
  withinTime?: string;
}

export interface TweetTranslateParams {
  /**
   * Language code to translate into, such as `en`, `tr`, `pt-br`, or `zh-tw`. Upper
   * and lower case both work.
   */
  language: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

Tweets.Like = Like;
Tweets.Retweet = Retweet;

export declare namespace Tweets {
  export {
    type TweetAuthor as TweetAuthor,
    type TweetDetail as TweetDetail,
    type TweetCreateResponse as TweetCreateResponse,
    type TweetRetrieveResponse as TweetRetrieveResponse,
    type TweetListResponse as TweetListResponse,
    type TweetDeleteResponse as TweetDeleteResponse,
    type TweetCheckRepostResponse as TweetCheckRepostResponse,
    type TweetEmbedResponse as TweetEmbedResponse,
    type TweetGetInsightsResponse as TweetGetInsightsResponse,
    type TweetGetRepliesResponse as TweetGetRepliesResponse,
    type TweetGetRetweeterIDsResponse as TweetGetRetweeterIDsResponse,
    type TweetGetSubtitlesResponse as TweetGetSubtitlesResponse,
    type TweetResolveLinksResponse as TweetResolveLinksResponse,
    type TweetSearchResponse as TweetSearchResponse,
    type TweetTranslateResponse as TweetTranslateResponse,
    type TweetCreateParams as TweetCreateParams,
    type TweetRetrieveParams as TweetRetrieveParams,
    type TweetListParams as TweetListParams,
    type TweetDeleteParams as TweetDeleteParams,
    type TweetCheckRepostParams as TweetCheckRepostParams,
    type TweetEmbedParams as TweetEmbedParams,
    type TweetGetFavoritersParams as TweetGetFavoritersParams,
    type TweetGetHiddenRepliesParams as TweetGetHiddenRepliesParams,
    type TweetGetInsightsParams as TweetGetInsightsParams,
    type TweetGetQuotesParams as TweetGetQuotesParams,
    type TweetGetRepliesParams as TweetGetRepliesParams,
    type TweetGetRetweeterIDsParams as TweetGetRetweeterIDsParams,
    type TweetGetRetweetersParams as TweetGetRetweetersParams,
    type TweetGetSubtitlesParams as TweetGetSubtitlesParams,
    type TweetGetThreadParams as TweetGetThreadParams,
    type TweetListTopParams as TweetListTopParams,
    type TweetResolveLinksParams as TweetResolveLinksParams,
    type TweetSearchParams as TweetSearchParams,
    type TweetTranslateParams as TweetTranslateParams,
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
