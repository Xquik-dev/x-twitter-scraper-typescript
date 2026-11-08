// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../core/resource';
import type * as Shared from './shared';
import type * as PostsAPI from './monitors/posts';
import type { APIPromise } from '../core/api-promise';
import type { Stream } from '../core/streaming';
import { buildHeaders } from '../internal/headers';
import type { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';
import { isPresent } from '../internal/utils/values';

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
          ...(isPresent(lastEventID) ? { 'Last-Event-ID': lastEventID } : undefined),
        },
        options?.headers,
      ]),
      stream: true,
    });
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

export declare namespace Event {
  /**
   * Monitored post with public fields and retained legacy fields.
   */
  export interface MonitorPost extends Shared.SearchTweet {
    /**
     * Public profile with retained legacy monitor fields.
     */
    author?: MonitorPost.Author;

    card?: MonitorPost.Card;

    /**
     * Embedded post with public fields and legacy profile aliases.
     */
    quoted_tweet?: MonitorPost.QuotedTweet;

    reactionContext?: MonitorPost.ReactionContext;

    /**
     * Embedded post with public fields and legacy profile aliases.
     */
    retweeted_tweet?: MonitorPost.RetweetedTweet;
  }

  export namespace MonitorPost {
    export type Article = Shared.SearchTweet.Article;

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

    export type AuthorUnavailable = Shared.SearchTweet.AuthorUnavailable;

    export interface Card extends Shared.SearchTweet.Card {
      userReferences?: Array<Card.UserReference>;
    }

    export namespace Card {
      export type UserReferenceError = Shared.SearchTweet.Card.UserReferenceError;

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

    export type CashtagAttachment = Shared.SearchTweet.CashtagAttachment;

    export type CommunityNote = Shared.SearchTweet.CommunityNote;

    export type ConversationControl = Shared.SearchTweet.ConversationControl;

    export type Coordinates = Shared.SearchTweet.Coordinates;

    export type Edit = Shared.SearchTweet.Edit;

    export type Entities = Shared.SearchTweet.Entities;
    export namespace Entities {
      export type Hashtag = Shared.SearchTweet.Entities.Hashtag;
      export namespace Hashtag {
        export type Tag = Shared.SearchTweet.Entities.Hashtag.Tag;
        export namespace Tag {
          export type Info = Shared.SearchTweet.Entities.Hashtag.Tag.Info;
          export namespace Info {
            export type Info = Shared.SearchTweet.Entities.Hashtag.Tag.Info.Info;
          }
        }
      }
      export type Smarttag = Shared.SearchTweet.Entities.Smarttag;
      export namespace Smarttag {
        export type Tag = Shared.SearchTweet.Entities.Smarttag.Tag;
        export namespace Tag {
          export type Info = Shared.SearchTweet.Entities.Smarttag.Tag.Info;
          export namespace Info {
            export type Info = Shared.SearchTweet.Entities.Smarttag.Tag.Info.Info;
          }
        }
      }
      export type Symbol = Shared.SearchTweet.Entities.Symbol;
      export namespace Symbol {
        export type Tag = Shared.SearchTweet.Entities.Symbol.Tag;
        export namespace Tag {
          export type Info = Shared.SearchTweet.Entities.Symbol.Tag.Info;
          export namespace Info {
            export type Info = Shared.SearchTweet.Entities.Symbol.Tag.Info.Info;
          }
        }
      }
      export type Timestamp = Shared.SearchTweet.Entities.Timestamp;
      export namespace Timestamp {
        export type Tag = Shared.SearchTweet.Entities.Timestamp.Tag;
        export namespace Tag {
          export type Info = Shared.SearchTweet.Entities.Timestamp.Tag.Info;
          export namespace Info {
            export type Info = Shared.SearchTweet.Entities.Timestamp.Tag.Info.Info;
          }
        }
      }
      export type URL = Shared.SearchTweet.Entities.URL;
      export type UserMention = Shared.SearchTweet.Entities.UserMention;
    }

    export type ExclusiveContent = Shared.SearchTweet.ExclusiveContent;

    export type Geo = Shared.SearchTweet.Geo;

    export type Interstitial = Shared.SearchTweet.Interstitial;
    export namespace Interstitial {
      export type Text = Shared.SearchTweet.Interstitial.Text;
      export namespace Text {
        export type Entity = Shared.SearchTweet.Interstitial.Text.Entity;
        export namespace Entity {
          export type Ref = Shared.SearchTweet.Interstitial.Text.Entity.Ref;
        }
      }
    }

    export type LimitedAction = Shared.SearchTweet.LimitedAction;
    export namespace LimitedAction {
      export type Prompt = Shared.SearchTweet.LimitedAction.Prompt;
    }

    export type LiveEventContext = Shared.SearchTweet.LiveEventContext;

    export type NoteTweet = Shared.SearchTweet.NoteTweet;
    export namespace NoteTweet {
      export type Entities = Shared.SearchTweet.NoteTweet.Entities;
      export namespace Entities {
        export type Hashtag = Shared.SearchTweet.NoteTweet.Entities.Hashtag;
        export namespace Hashtag {
          export type Tag = Shared.SearchTweet.NoteTweet.Entities.Hashtag.Tag;
          export namespace Tag {
            export type Info = Shared.SearchTweet.NoteTweet.Entities.Hashtag.Tag.Info;
            export namespace Info {
              export type Info = Shared.SearchTweet.NoteTweet.Entities.Hashtag.Tag.Info.Info;
            }
          }
        }
        export type Smarttag = Shared.SearchTweet.NoteTweet.Entities.Smarttag;
        export namespace Smarttag {
          export type Tag = Shared.SearchTweet.NoteTweet.Entities.Smarttag.Tag;
          export namespace Tag {
            export type Info = Shared.SearchTweet.NoteTweet.Entities.Smarttag.Tag.Info;
            export namespace Info {
              export type Info = Shared.SearchTweet.NoteTweet.Entities.Smarttag.Tag.Info.Info;
            }
          }
        }
        export type Symbol = Shared.SearchTweet.NoteTweet.Entities.Symbol;
        export namespace Symbol {
          export type Tag = Shared.SearchTweet.NoteTweet.Entities.Symbol.Tag;
          export namespace Tag {
            export type Info = Shared.SearchTweet.NoteTweet.Entities.Symbol.Tag.Info;
            export namespace Info {
              export type Info = Shared.SearchTweet.NoteTweet.Entities.Symbol.Tag.Info.Info;
            }
          }
        }
        export type Timestamp = Shared.SearchTweet.NoteTweet.Entities.Timestamp;
        export namespace Timestamp {
          export type Tag = Shared.SearchTweet.NoteTweet.Entities.Timestamp.Tag;
          export namespace Tag {
            export type Info = Shared.SearchTweet.NoteTweet.Entities.Timestamp.Tag.Info;
            export namespace Info {
              export type Info = Shared.SearchTweet.NoteTweet.Entities.Timestamp.Tag.Info.Info;
            }
          }
        }
        export type URL = Shared.SearchTweet.NoteTweet.Entities.URL;
        export type UserMention = Shared.SearchTweet.NoteTweet.Entities.UserMention;
      }
      export type InlineMedia = Shared.SearchTweet.NoteTweet.InlineMedia;
      export type RichtextTag = Shared.SearchTweet.NoteTweet.RichtextTag;
    }

    export type Place = Shared.SearchTweet.Place;

    export type PreviousCounts = Shared.SearchTweet.PreviousCounts;

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

    export type QuotedTweetPermalink = Shared.SearchTweet.QuotedTweetPermalink;

    export type QuotedTweetUnavailable = Shared.SearchTweet.QuotedTweetUnavailable;

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

    export type SportsContext = Shared.SearchTweet.SportsContext;
    export namespace SportsContext {
      export type Competitor = Shared.SearchTweet.SportsContext.Competitor;
    }

    export type SubscriberBadge = Shared.SearchTweet.SubscriberBadge;

    export type TextHighlight = Shared.SearchTweet.TextHighlight;

    export type Tombstone = Shared.SearchTweet.Tombstone;
    export namespace Tombstone {
      export type Text = Shared.SearchTweet.Tombstone.Text;
      export namespace Text {
        export type Entity = Shared.SearchTweet.Tombstone.Text.Entity;
        export namespace Entity {
          export type Ref = Shared.SearchTweet.Tombstone.Text.Entity.Ref;
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

export declare namespace EventDetail {
  export import MonitorPost = Event.MonitorPost;

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
