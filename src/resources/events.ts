// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import * as PostsAPI from './monitors/posts';
import { APIPromise } from '../core/api-promise';
import { Stream } from '../core/streaming';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Activity events from monitored accounts
 */
export class Events extends APIResource {
  /**
   * Returns one monitor event owned by the account.
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<EventDetail> {
    return this._client.get(path`/events/${id}`, options);
  }

  /**
   * Returns monitor events with cursor pagination and filters.
   */
  list(
    query: EventListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<EventListResponse> {
    return this._client.get('/events', { query, ...options });
  }

  /**
   * Streams the account's monitor events as server-sent events, each named by its
   * event type and numbered by its event ID. A reconnect that sends Last-Event-ID
   * first gets every event after that one from the last 30 days, then each new
   * event. A connection lasts up to 30 minutes and sends a comment every 15 seconds
   * while idle. Keep up to 5 streams open per account. Events and streams cost no
   * credits.
   *
   * @example
   * ```ts
   * const stream = await client.events.stream();
   *
   * for await (const event of stream) {
   *   console.log(event);
   * }
   * ```
   */
  stream(
    params: EventStreamParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Stream<Event>> {
    const { 'Last-Event-ID': lastEventID, ...query } = params ?? {};
    return this._client.get('/events/stream', {
      query,
      ...options,
      headers: buildHeaders([
        {
          Accept: 'text/event-stream',
          ...(lastEventID != null ? { 'Last-Event-ID': lastEventID } : undefined),
        },
        options?.headers,
      ]),
      stream: true,
    }) as APIPromise<Stream<Event>>;
  }
}

/**
 * Monitor event summary with source metadata and occurrence time.
 */
export interface Event {
  id: string;

  /**
   * Post fields match REST. Legacy fields remain available.
   */
  data:
    | Event.MonitorPost
    | Event.MonitorProfileChange
    | Shared.MonitorFollow
    | PostsAPI.MonitorPostMetricChange
    | PostsAPI.MonitorPostEdit
    | PostsAPI.MonitorPostDeleted
    | Event.MonitorLegacyPost;

  /**
   * Account monitor ID for account events, or keyword monitor ID for keyword events.
   */
  monitorId: string;

  /**
   * Source monitor type.
   */
  monitorType: 'account' | 'keyword' | 'post';

  occurredAt: string;

  /**
   * Type of monitor event fired when account activity occurs. tweet.deleted fires
   * once X confirms the account deleted a post the monitor saw. Its data is the post
   * as last seen. broadcast.started & space.started fire when the account posts its
   * running live video or Space. Their data is that post. Xquik misses a live video
   * the account does not post. following.added & following.removed fire when the
   * account follows or unfollows someone, with that account's profile.
   * follower.added & follower.removed fire when someone follows the account or
   * leaves its followers, with that account's profile. Xquik names lost followers
   * for accounts with up to 100,000 followers. profile.followers.changed &
   * profile.following.changed fire when the account's follower or following count
   * moves, at most once a minute each. X shows counts that differ by a few between
   * reads, so a monitor holds the lowest. A fall counts once 2 reads show it, & a
   * rise once no read for a minute showed less. Keyword monitors take the 10 post
   * types only.
   */
  type: Shared.EventType | PostsAPI.PostEventType;

  /**
   * Permanent X user ID of the monitored post's author, present for post events.
   */
  authorId?: string;

  /**
   * Username of the monitored post's author, present for post events.
   */
  authorUsername?: string;

  /**
   * Keyword monitor ID, present for keyword monitor events.
   */
  keywordMonitorId?: string;

  /**
   * Your monitor label when Xquik created the event, present when set. A rename
   * leaves the event's label unchanged.
   */
  monitorName?: string;

  /**
   * ID of the monitored post, present for post events.
   */
  postId?: string;

  /**
   * Link to the monitored post, present for post events.
   */
  postUrl?: string;

  /**
   * Keyword query, present for keyword monitor events.
   */
  query?: string;

  /**
   * Current account username, present for account monitor events.
   */
  username?: string;

  /**
   * Permanent X user ID of the monitored account, present for account monitor
   * events. It stays the same after a username change.
   */
  xUserId?: string;
}

export namespace Event {
  /**
   * Monitored post with public fields and retained legacy fields.
   */
  export interface MonitorPost {
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
    article?: MonitorPost.Article;

    /**
     * Public profile with retained legacy monitor fields.
     */
    author?: MonitorPost.Author;

    /**
     * Why the tweet has no author. X serves a suspended or deleted account as an
     * unavailable user with a reason such as Suspended or NotFound. Omitted when the
     * author is available.
     */
    authorUnavailable?: MonitorPost.AuthorUnavailable;

    card?: MonitorPost.Card;

    /**
     * Price charts the author attached under the post, 1 per cashtag. Absent when the
     * post has none. X may send a cashtag without a chart window.
     */
    cashtagAttachments?: Array<MonitorPost.CashtagAttachment>;

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
    communityNote?: MonitorPost.CommunityNote;

    /**
     * Content disclosure metadata shown by X when a tweet is labeled as paid
     * partnership content or AI-generated media.
     */
    contentDisclosure?: Shared.ContentDisclosure;

    /**
     * Reply policy & conversation owner.
     */
    conversationControl?: MonitorPost.ConversationControl;

    conversationId?: string;

    /**
     * Author-published point, with longitude before latitude.
     */
    coordinates?: MonitorPost.Coordinates;

    createdAt?: string;

    displayTextRange?: Array<number>;

    /**
     * Lists edit-chain identifiers and the remaining edit window.
     */
    edit?: MonitorPost.Edit;

    /**
     * Lists hashtags, symbols, links, and mentions from tweet text.
     */
    entities?: MonitorPost.Entities;

    /**
     * Marks a subscriber-only post with the creator whose subscription unlocks it.
     * Non-subscribers get the preview text & the subscribe link. Omitted on public
     * posts.
     */
    exclusiveContent?: MonitorPost.ExclusiveContent;

    /**
     * Author-published point, with latitude before longitude.
     */
    geo?: MonitorPost.Geo;

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
    interstitial?: MonitorPost.Interstitial;

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
    limitedActions?: Array<MonitorPost.LimitedAction>;

    /**
     * The live event the post belongs to, such as an election.
     */
    liveEventContext?: MonitorPost.LiveEventContext;

    /**
     * Media, omitted when unavailable.
     */
    media?: Array<Shared.TweetMedia>;

    /**
     * Complete Note Tweet content and rich-text metadata.
     */
    noteTweet?: MonitorPost.NoteTweet;

    /**
     * A parent, quoted or retweeted tweet. It has the TweetPublicData fields and an
     * author. Nesting stops after 4 levels.
     */
    parentTweet?: Shared.EmbeddedTweet;

    /**
     * Describes public place metadata on a geotagged tweet.
     */
    place?: MonitorPost.Place;

    possiblySensitive?: boolean;

    /**
     * Public metadata whose fields are defined by X.
     */
    postCta?: { [key: string]: unknown };

    /**
     * Engagement counts retained from a prior tweet edit.
     */
    previousCounts?: MonitorPost.PreviousCounts;

    /**
     * Embedded post with public fields and legacy profile aliases.
     */
    quoted_tweet?: MonitorPost.QuotedTweet;

    quotedTweetId?: string;

    /**
     * The quoted post's link, kept when X withholds that post.
     */
    quotedTweetPermalink?: MonitorPost.QuotedTweetPermalink;

    /**
     * Why X shows no quoted post. Omitted when X names no reason, as its legacy
     * answers never do.
     */
    quotedTweetUnavailable?: MonitorPost.QuotedTweetUnavailable;

    reactionContext?: MonitorPost.ReactionContext;

    /**
     * Embedded post with public fields and legacy profile aliases.
     */
    retweeted_tweet?: MonitorPost.RetweetedTweet;

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
    sportsContext?: MonitorPost.SportsContext;

    /**
     * The Subscriber badge X shows on a reply. The reply's author subscribes to the
     * creator who started the conversation. Omitted on a post without the badge.
     */
    subscriberBadge?: MonitorPost.SubscriberBadge;

    /**
     * Where `text` matches the search, on each row a search read. Offsets count code
     * points of `text`, as `displayTextRange` does. Empty when X marks nothing in the
     * post. X marks matches only in a post's first 280 characters.
     */
    textHighlights?: Array<MonitorPost.TextHighlight>;

    /**
     * Public visibility notice attached to an available tweet.
     */
    tombstone?: MonitorPost.Tombstone;

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
     * The fields X did not send for this post. text reads empty, so treat it as
     * unknown rather than empty. Left out when X sent the text.
     */
    unknownFields?: Array<'text'>;

    /**
     * User IDs that left this conversation.
     */
    unmentionedUserIds?: Array<string>;

    url?: string;

    viewState?: string;
  }

  export namespace MonitorPost {
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
     * Public profile with retained legacy monitor fields.
     */
    export interface Author extends Shared.UserProfile {
      /**
       * Original X flag. Read verified for the displayed badge.
       *
       * @deprecated
       */
      rawVerified?: boolean;

      /**
       * Legacy username alias. Read username instead.
       *
       * @deprecated
       */
      userName?: string;
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

      userReferences?: Array<Card.UserReference>;
    }

    export namespace Card {
      export interface UserReferenceError {
        message?: string;

        reason?: string;
      }

      /**
       * Public profile with retained legacy monitor fields.
       */
      export interface UserReference extends Shared.UserProfile {
        /**
         * Original X flag. Read verified for the displayed badge.
         *
         * @deprecated
         */
        rawVerified?: boolean;

        /**
         * Legacy username alias. Read username instead.
         *
         * @deprecated
         */
        userName?: string;
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

    export interface LiveEventContext {
      /**
       * The event's image.
       */
      imageUrl?: string;

      /**
       * Event name.
       */
      title?: string;

      /**
       * The event's page on X.
       */
      url?: string;
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
     * Embedded post with public fields and legacy profile aliases.
     */
    export interface QuotedTweet extends Shared.EmbeddedTweet {
      /**
       * Public profile with retained legacy monitor fields.
       */
      author?: QuotedTweet.Author;
    }

    export namespace QuotedTweet {
      /**
       * Public profile with retained legacy monitor fields.
       */
      export interface Author extends Shared.UserProfile {
        /**
         * Original X flag. Read verified for the displayed badge.
         *
         * @deprecated
         */
        rawVerified?: boolean;

        /**
         * Legacy username alias. Read username instead.
         *
         * @deprecated
         */
        userName?: string;
      }
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

    export interface ReactionContext {
      /**
       * The post this one reacts to, with the same fields. X often sends only its
       * ID, author & edit history. Then unknownFields lists text, and the flags X
       * did not send are left out.
       */
      reactedToPost?: QuotedTweet;

      reactedToPostId?: string;

      /**
       * Public profile with retained legacy monitor fields.
       */
      reactedToUser?: ReactionContext.ReactedToUser;
    }

    export namespace ReactionContext {
      /**
       * Public profile with retained legacy monitor fields.
       */
      export interface ReactedToUser extends Shared.UserProfile {
        /**
         * Original X flag. Read verified for the displayed badge.
         *
         * @deprecated
         */
        rawVerified?: boolean;

        /**
         * Legacy username alias. Read username instead.
         *
         * @deprecated
         */
        userName?: string;
      }
    }

    /**
     * Embedded post with public fields and legacy profile aliases.
     */
    export interface RetweetedTweet extends Shared.EmbeddedTweet {
      /**
       * Public profile with retained legacy monitor fields.
       */
      author?: RetweetedTweet.Author;
    }

    export namespace RetweetedTweet {
      /**
       * Public profile with retained legacy monitor fields.
       */
      export interface Author extends Shared.UserProfile {
        /**
         * Original X flag. Read verified for the displayed badge.
         *
         * @deprecated
         */
        rawVerified?: boolean;

        /**
         * Legacy username alias. Read username instead.
         *
         * @deprecated
         */
        userName?: string;
      }
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
   * Changed profile field with its previous and current values. The field of a count
   * event is followers or following, with both counts as integers.
   */
  export interface MonitorProfileChange {
    field: string;

    /**
     * Permanent X user ID.
     */
    userId: string;

    /**
     * Username observed for this change.
     */
    username: string;

    /**
     * Current count minus previous count. Only on the 2 count events.
     */
    change?: number;

    /**
     * Profile text, flag, count, or pinned post IDs. Missing values are omitted.
     */
    current?: string | boolean | number | Array<string>;

    /**
     * Profile text, flag, count, or pinned post IDs. Missing values are omitted.
     */
    previous?: string | boolean | number | Array<string>;
  }

  /**
   * Older stored posts remain readable. Fields can be missing or null.
   */
  export interface MonitorLegacyPost {
    id?: string;

    author?: { [key: string]: unknown } | null;

    quoted_tweet?: { [key: string]: unknown } | null;

    retweeted_tweet?: { [key: string]: unknown } | null;

    text?: string;

    [k: string]: unknown;
  }
}

/**
 * Full monitor event including payload data and optional X event ID.
 */
export interface EventDetail {
  id: string;

  /**
   * Post or profile-change payload for the event type.
   */
  data:
    | EventDetail.MonitorPost
    | EventDetail.MonitorProfileChange
    | Shared.MonitorFollow
    | PostsAPI.MonitorPostMetricChange
    | PostsAPI.MonitorPostEdit
    | PostsAPI.MonitorPostDeleted
    | EventDetail.MonitorLegacyPost;

  /**
   * Monitor ID associated with this detailed event payload.
   */
  monitorId: string;

  /**
   * Source monitor type for this detailed event.
   */
  monitorType: 'account' | 'keyword' | 'post';

  occurredAt: string;

  /**
   * Type of monitor event fired when account activity occurs. tweet.deleted fires
   * once X confirms the account deleted a post the monitor saw. Its data is the post
   * as last seen. broadcast.started & space.started fire when the account posts its
   * running live video or Space. Their data is that post. Xquik misses a live video
   * the account does not post. following.added & following.removed fire when the
   * account follows or unfollows someone, with that account's profile.
   * follower.added & follower.removed fire when someone follows the account or
   * leaves its followers, with that account's profile. Xquik names lost followers
   * for accounts with up to 100,000 followers. profile.followers.changed &
   * profile.following.changed fire when the account's follower or following count
   * moves, at most once a minute each. X shows counts that differ by a few between
   * reads, so a monitor holds the lowest. A fall counts once 2 reads show it, & a
   * rise once no read for a minute showed less. Keyword monitors take the 10 post
   * types only.
   */
  type: Shared.EventType | PostsAPI.PostEventType;

  /**
   * Keyword monitor ID included on detailed keyword events.
   */
  keywordMonitorId?: string;

  /**
   * Your monitor label when Xquik created this event, present when set. A rename
   * leaves the event's label unchanged.
   */
  monitorName?: string;

  /**
   * Keyword query for this detailed monitor event.
   */
  query?: string;

  /**
   * Current account username for this detailed event.
   */
  username?: string;

  xEventId?: string;

  /**
   * Permanent X user ID of the monitored account on account events. It stays the
   * same after a username change.
   */
  xUserId?: string;
}

export namespace EventDetail {
  /**
   * Monitored post with public fields and retained legacy fields.
   */
  export interface MonitorPost {
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
    article?: MonitorPost.Article;

    /**
     * Public profile with retained legacy monitor fields.
     */
    author?: MonitorPost.Author;

    /**
     * Why the tweet has no author. X serves a suspended or deleted account as an
     * unavailable user with a reason such as Suspended or NotFound. Omitted when the
     * author is available.
     */
    authorUnavailable?: MonitorPost.AuthorUnavailable;

    card?: MonitorPost.Card;

    /**
     * Price charts the author attached under the post, 1 per cashtag. Absent when the
     * post has none. X may send a cashtag without a chart window.
     */
    cashtagAttachments?: Array<MonitorPost.CashtagAttachment>;

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
    communityNote?: MonitorPost.CommunityNote;

    /**
     * Content disclosure metadata shown by X when a tweet is labeled as paid
     * partnership content or AI-generated media.
     */
    contentDisclosure?: Shared.ContentDisclosure;

    /**
     * Reply policy & conversation owner.
     */
    conversationControl?: MonitorPost.ConversationControl;

    conversationId?: string;

    /**
     * Author-published point, with longitude before latitude.
     */
    coordinates?: MonitorPost.Coordinates;

    createdAt?: string;

    displayTextRange?: Array<number>;

    /**
     * Lists edit-chain identifiers and the remaining edit window.
     */
    edit?: MonitorPost.Edit;

    /**
     * Lists hashtags, symbols, links, and mentions from tweet text.
     */
    entities?: MonitorPost.Entities;

    /**
     * Marks a subscriber-only post with the creator whose subscription unlocks it.
     * Non-subscribers get the preview text & the subscribe link. Omitted on public
     * posts.
     */
    exclusiveContent?: MonitorPost.ExclusiveContent;

    /**
     * Author-published point, with latitude before longitude.
     */
    geo?: MonitorPost.Geo;

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
    interstitial?: MonitorPost.Interstitial;

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
    limitedActions?: Array<MonitorPost.LimitedAction>;

    /**
     * The live event the post belongs to, such as an election.
     */
    liveEventContext?: MonitorPost.LiveEventContext;

    /**
     * Media, omitted when unavailable.
     */
    media?: Array<Shared.TweetMedia>;

    /**
     * Complete Note Tweet content and rich-text metadata.
     */
    noteTweet?: MonitorPost.NoteTweet;

    /**
     * A parent, quoted or retweeted tweet. It has the TweetPublicData fields and an
     * author. Nesting stops after 4 levels.
     */
    parentTweet?: Shared.EmbeddedTweet;

    /**
     * Describes public place metadata on a geotagged tweet.
     */
    place?: MonitorPost.Place;

    possiblySensitive?: boolean;

    /**
     * Public metadata whose fields are defined by X.
     */
    postCta?: { [key: string]: unknown };

    /**
     * Engagement counts retained from a prior tweet edit.
     */
    previousCounts?: MonitorPost.PreviousCounts;

    /**
     * Embedded post with public fields and legacy profile aliases.
     */
    quoted_tweet?: MonitorPost.QuotedTweet;

    quotedTweetId?: string;

    /**
     * The quoted post's link, kept when X withholds that post.
     */
    quotedTweetPermalink?: MonitorPost.QuotedTweetPermalink;

    /**
     * Why X shows no quoted post. Omitted when X names no reason, as its legacy
     * answers never do.
     */
    quotedTweetUnavailable?: MonitorPost.QuotedTweetUnavailable;

    reactionContext?: MonitorPost.ReactionContext;

    /**
     * Embedded post with public fields and legacy profile aliases.
     */
    retweeted_tweet?: MonitorPost.RetweetedTweet;

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
    sportsContext?: MonitorPost.SportsContext;

    /**
     * The Subscriber badge X shows on a reply. The reply's author subscribes to the
     * creator who started the conversation. Omitted on a post without the badge.
     */
    subscriberBadge?: MonitorPost.SubscriberBadge;

    /**
     * Where `text` matches the search, on each row a search read. Offsets count code
     * points of `text`, as `displayTextRange` does. Empty when X marks nothing in the
     * post. X marks matches only in a post's first 280 characters.
     */
    textHighlights?: Array<MonitorPost.TextHighlight>;

    /**
     * Public visibility notice attached to an available tweet.
     */
    tombstone?: MonitorPost.Tombstone;

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
     * The fields X did not send for this post. text reads empty, so treat it as
     * unknown rather than empty. Left out when X sent the text.
     */
    unknownFields?: Array<'text'>;

    /**
     * User IDs that left this conversation.
     */
    unmentionedUserIds?: Array<string>;

    url?: string;

    viewState?: string;
  }

  export namespace MonitorPost {
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
     * Public profile with retained legacy monitor fields.
     */
    export interface Author extends Shared.UserProfile {
      /**
       * Original X flag. Read verified for the displayed badge.
       *
       * @deprecated
       */
      rawVerified?: boolean;

      /**
       * Legacy username alias. Read username instead.
       *
       * @deprecated
       */
      userName?: string;
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

      userReferences?: Array<Card.UserReference>;
    }

    export namespace Card {
      export interface UserReferenceError {
        message?: string;

        reason?: string;
      }

      /**
       * Public profile with retained legacy monitor fields.
       */
      export interface UserReference extends Shared.UserProfile {
        /**
         * Original X flag. Read verified for the displayed badge.
         *
         * @deprecated
         */
        rawVerified?: boolean;

        /**
         * Legacy username alias. Read username instead.
         *
         * @deprecated
         */
        userName?: string;
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

    export interface LiveEventContext {
      /**
       * The event's image.
       */
      imageUrl?: string;

      /**
       * Event name.
       */
      title?: string;

      /**
       * The event's page on X.
       */
      url?: string;
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
     * Embedded post with public fields and legacy profile aliases.
     */
    export interface QuotedTweet extends Shared.EmbeddedTweet {
      /**
       * Public profile with retained legacy monitor fields.
       */
      author?: QuotedTweet.Author;
    }

    export namespace QuotedTweet {
      /**
       * Public profile with retained legacy monitor fields.
       */
      export interface Author extends Shared.UserProfile {
        /**
         * Original X flag. Read verified for the displayed badge.
         *
         * @deprecated
         */
        rawVerified?: boolean;

        /**
         * Legacy username alias. Read username instead.
         *
         * @deprecated
         */
        userName?: string;
      }
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

    export interface ReactionContext {
      /**
       * The post this one reacts to, with the same fields. X often sends only its
       * ID, author & edit history. Then unknownFields lists text, and the flags X
       * did not send are left out.
       */
      reactedToPost?: QuotedTweet;

      reactedToPostId?: string;

      /**
       * Public profile with retained legacy monitor fields.
       */
      reactedToUser?: ReactionContext.ReactedToUser;
    }

    export namespace ReactionContext {
      /**
       * Public profile with retained legacy monitor fields.
       */
      export interface ReactedToUser extends Shared.UserProfile {
        /**
         * Original X flag. Read verified for the displayed badge.
         *
         * @deprecated
         */
        rawVerified?: boolean;

        /**
         * Legacy username alias. Read username instead.
         *
         * @deprecated
         */
        userName?: string;
      }
    }

    /**
     * Embedded post with public fields and legacy profile aliases.
     */
    export interface RetweetedTweet extends Shared.EmbeddedTweet {
      /**
       * Public profile with retained legacy monitor fields.
       */
      author?: RetweetedTweet.Author;
    }

    export namespace RetweetedTweet {
      /**
       * Public profile with retained legacy monitor fields.
       */
      export interface Author extends Shared.UserProfile {
        /**
         * Original X flag. Read verified for the displayed badge.
         *
         * @deprecated
         */
        rawVerified?: boolean;

        /**
         * Legacy username alias. Read username instead.
         *
         * @deprecated
         */
        userName?: string;
      }
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
   * Changed profile field with its previous and current values. The field of a count
   * event is followers or following, with both counts as integers.
   */
  export interface MonitorProfileChange {
    field: string;

    /**
     * Permanent X user ID.
     */
    userId: string;

    /**
     * Username observed for this change.
     */
    username: string;

    /**
     * Current count minus previous count. Only on the 2 count events.
     */
    change?: number;

    /**
     * Profile text, flag, count, or pinned post IDs. Missing values are omitted.
     */
    current?: string | boolean | number | Array<string>;

    /**
     * Profile text, flag, count, or pinned post IDs. Missing values are omitted.
     */
    previous?: string | boolean | number | Array<string>;
  }

  /**
   * Older stored posts remain readable. Fields can be missing or null.
   */
  export interface MonitorLegacyPost {
    id?: string;

    author?: { [key: string]: unknown } | null;

    quoted_tweet?: { [key: string]: unknown } | null;

    retweeted_tweet?: { [key: string]: unknown } | null;

    text?: string;

    [k: string]: unknown;
  }
}

export interface EventListResponse {
  events: Array<Event>;

  hasMore: boolean;

  nextCursor?: string;
}

export interface EventListParams {
  /**
   * Previous nextCursor. The after alias also works. Offset pagination is not
   * supported.
   */
  cursor?: string;

  /**
   * Filter events by type
   */
  eventType?: Shared.EventType | PostsAPI.PostEventType;

  /**
   * Keyword monitor ID. The keyword_monitor_id alias also works.
   */
  keywordMonitorId?: string;

  /**
   * Maximum items per page: 1 to 100, default 50. Credits can reduce paid results.
   * With none affordable, it returns 402 insufficient_credits.
   */
  limit?: number;

  /**
   * Account monitor ID. The monitor_id alias also works.
   */
  monitorId?: string;

  /**
   * Post monitor ID. The post_monitor_id alias also works.
   */
  postMonitorId?: string;
}

export interface EventStreamParams {
  /**
   * The last event ID the client got. The stream first sends every event after it.
   */
  'Last-Event-ID'?: string;

  /**
   * Set to post_metrics to also get each post monitor's saved numbers. Any other
   * value is refused.
   */
  include?: 'post_metrics';

  /**
   * Set to true to resume 30 seconds before Last-Event-ID, so late events still
   * arrive. Events you have can arrive again, so skip IDs you've seen. An ID the
   * stream can't find starts 5 minutes back, not 30 days.
   */
  lookBack?: boolean;
}

export declare namespace Events {
  export {
    type Event as Event,
    type EventDetail as EventDetail,
    type EventListResponse as EventListResponse,
    type EventListParams as EventListParams,
    type EventStreamParams as EventStreamParams,
  };
}
