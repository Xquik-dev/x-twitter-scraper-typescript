// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * X Space details, host, and speakers
 */
export class Spaces extends APIResource {
  /**
   * Returns one X Space as X shows it, live, scheduled or ended. Accepts the Space
   * ID or the URL-encoded Space URL. A Space X limits to subscribers or a community
   * answers 404.
   *
   * @example
   * ```ts
   * const space = await client.x.spaces.retrieve('id');
   * ```
   */
  retrieve(
    id: string,
    query: SpaceRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SpaceRetrieveResponse> {
    return this._client.get(path`/x/spaces/${id}`, { query, ...options });
  }

  /**
   * Returns the recording X plays back once a Space is over, in state Ended or
   * TimedOut. Accepts the Space ID or the URL-encoded Space URL. Check state and
   * isAvailableForReplay with the Space lookup first. A live or scheduled Space
   * answers 409, and a cancelled one 404.
   *
   * @example
   * ```ts
   * const response = await client.x.spaces.retrieveReplay('id');
   * ```
   */
  retrieveReplay(
    id: string,
    query: SpaceRetrieveReplayParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SpaceRetrieveReplayResponse> {
    return this._client.get(path`/x/spaces/${id}/replay`, { query, ...options });
  }

  /**
   * Returns public Spaces each once, as GET /x/spaces/{id} serves them. Latest & Top
   * find the Spaces that matching posts share, live, scheduled or ended. Live &
   * Upcoming read X's own Spaces search, in X's order. It finds live or scheduled
   * Spaces by the words in their titles. Costs 1 credit per Space.
   *
   * @example
   * ```ts
   * const response = await client.x.spaces.search({
   *   q: 'from:solana',
   * });
   * ```
   */
  search(query: SpaceSearchParams, options?: RequestOptions): APIPromise<SpaceSearchResponse> {
    return this._client.get('/x/spaces/search', { query, ...options });
  }
}

export interface SpaceRetrieveResponse {
  /**
   * X Space
   */
  space: SpaceRetrieveResponse.Space;
}

export namespace SpaceRetrieveResponse {
  /**
   * X Space
   */
  export interface Space {
    /**
     * Space ID
     */
    id: string;

    /**
     * Hosts and co-hosts
     */
    admins: Array<Space.Admin>;

    /**
     * Accounts X lists as listeners
     */
    listeners: Array<Space.Listener>;

    /**
     * Accounts X lists as speakers
     */
    speakers: Array<Space.Speaker>;

    /**
     * Audio or video kind, as X names it
     */
    contentType?: string;

    /**
     * X's code for who may speak
     */
    conversationControls?: number;

    /**
     * When the Space was made
     */
    createdAt?: string;

    /**
     * Public X profile.
     */
    creator?: Shared.UserProfile;

    /**
     * Whether X lets no more accounts join
     */
    disallowJoin?: boolean;

    /**
     * When the Space ended
     */
    endedAt?: string;

    /**
     * Whether listeners may clip the Space
     */
    isAvailableForClipping?: boolean;

    /**
     * Whether X offers a recording
     */
    isAvailableForReplay?: boolean;

    /**
     * Whether only X employees may join
     */
    isEmployeeOnly?: boolean;

    /**
     * Whether the host locked the Space
     */
    isLocked?: boolean;

    /**
     * Most hosts and co-hosts the Space allows
     */
    maxAdminCapacity?: number;

    /**
     * X's media key for the Space's audio
     */
    mediaKey?: string;

    /**
     * IDs of the accounts the host tagged
     */
    mentionedUserIds?: Array<string>;

    /**
     * Whether anonymous listening is off
     */
    noIncognito?: boolean;

    /**
     * Accounts in the Space now, while it is live
     */
    participantCount?: number;

    /**
     * When the Space was set to start
     */
    scheduledStart?: string;

    /**
     * Posts the hosts and speakers shared in the Space, in X's order. Only when X
     * lists them.
     */
    sharings?: Array<Space.Sharing>;

    /**
     * When the Space went live
     */
    startedAt?: string;

    /**
     * NotStarted (scheduled), Running (live), Ended, Canceled (scheduled, never
     * started) or TimedOut (closed by X, not by its host)
     */
    state?: string;

    /**
     * Space title
     */
    title?: string;

    /**
     * Accounts that listened live
     */
    totalLiveListeners?: number;

    /**
     * Accounts that played the recording
     */
    totalReplayWatched?: number;

    /**
     * Search tweet with author. Zero metrics may mean X omitted counts.
     */
    tweet?: Shared.SearchTweet;

    /**
     * ID of the post that announces the Space
     */
    tweetId?: string;

    /**
     * When X last changed the Space
     */
    updatedAt?: string;
  }

  export namespace Space {
    /**
     * An account on a Space's stage or in its audience, as X lists it there.
     */
    export interface Admin {
      id: string;

      /**
       * Name the account shows in the Space
       */
      name: string;

      username: string;

      /**
       * Organization affiliation label shown on an X profile.
       */
      affiliatesHighlightedLabel?: Admin.AffiliatesHighlightedLabel;

      /**
       * Whether the account has X Premium verification
       */
      isBlueVerified?: boolean;

      /**
       * Whether a host muted the account
       */
      isMutedByAdmin?: boolean;

      /**
       * Whether the account muted itself
       */
      isMutedByGuest?: boolean;

      /**
       * Whether X shows a verified badge in the Space
       */
      isVerified?: boolean;

      /**
       * When the account joined the Space
       */
      joinedAt?: string;

      /**
       * The account's ID in X's broadcast service
       */
      periscopeUserId?: string;

      /**
       * Profile picture URL
       */
      profilePicture?: string;

      /**
       * Business or Government badge type
       */
      verifiedType?: string;
    }

    export namespace Admin {
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
    }

    /**
     * An account on a Space's stage or in its audience, as X lists it there.
     */
    export interface Listener {
      id: string;

      /**
       * Name the account shows in the Space
       */
      name: string;

      username: string;

      /**
       * Organization affiliation label shown on an X profile.
       */
      affiliatesHighlightedLabel?: Listener.AffiliatesHighlightedLabel;

      /**
       * Whether the account has X Premium verification
       */
      isBlueVerified?: boolean;

      /**
       * Whether a host muted the account
       */
      isMutedByAdmin?: boolean;

      /**
       * Whether the account muted itself
       */
      isMutedByGuest?: boolean;

      /**
       * Whether X shows a verified badge in the Space
       */
      isVerified?: boolean;

      /**
       * When the account joined the Space
       */
      joinedAt?: string;

      /**
       * The account's ID in X's broadcast service
       */
      periscopeUserId?: string;

      /**
       * Profile picture URL
       */
      profilePicture?: string;

      /**
       * Business or Government badge type
       */
      verifiedType?: string;
    }

    export namespace Listener {
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
    }

    /**
     * An account on a Space's stage or in its audience, as X lists it there.
     */
    export interface Speaker {
      id: string;

      /**
       * Name the account shows in the Space
       */
      name: string;

      username: string;

      /**
       * Organization affiliation label shown on an X profile.
       */
      affiliatesHighlightedLabel?: Speaker.AffiliatesHighlightedLabel;

      /**
       * Whether the account has X Premium verification
       */
      isBlueVerified?: boolean;

      /**
       * Whether a host muted the account
       */
      isMutedByAdmin?: boolean;

      /**
       * Whether the account muted itself
       */
      isMutedByGuest?: boolean;

      /**
       * Whether X shows a verified badge in the Space
       */
      isVerified?: boolean;

      /**
       * When the account joined the Space
       */
      joinedAt?: string;

      /**
       * The account's ID in X's broadcast service
       */
      periscopeUserId?: string;

      /**
       * Profile picture URL
       */
      profilePicture?: string;

      /**
       * Business or Government badge type
       */
      verifiedType?: string;
    }

    export namespace Speaker {
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
    }

    /**
     * A post shared in a Space, & the account that shared it.
     */
    export interface Sharing {
      /**
       * X's ID of the sharing, not of the post
       */
      id?: string;

      /**
       * When the post was shared
       */
      sharedAt?: string;

      /**
       * Public X profile.
       */
      sharedBy?: Shared.UserProfile;

      /**
       * Search tweet with author. Zero metrics may mean X omitted counts.
       */
      tweet?: Shared.SearchTweet;

      /**
       * When X last changed the sharing
       */
      updatedAt?: string;
    }
  }
}

export interface SpaceRetrieveReplayResponse {
  /**
   * Recording of an ended Space
   */
  replay: SpaceRetrieveReplayResponse.Replay;
}

export namespace SpaceRetrieveReplayResponse {
  /**
   * Recording of an ended Space
   */
  export interface Replay {
    /**
     * HLS playlist of the recording
     */
    url: string;

    /**
     * Stream status, as X names it
     */
    status?: string;

    /**
     * Stream format, as X names it
     */
    streamType?: string;
  }
}

export interface SpaceSearchResponse {
  has_next_page: boolean;

  next_cursor: string;

  /**
   * Public Spaces, in the order the posts share them
   */
  spaces: Array<SpaceSearchResponse.Space>;
}

export namespace SpaceSearchResponse {
  /**
   * X Space
   */
  export interface Space {
    /**
     * Space ID
     */
    id: string;

    /**
     * Hosts and co-hosts
     */
    admins: Array<Space.Admin>;

    /**
     * Accounts X lists as listeners
     */
    listeners: Array<Space.Listener>;

    /**
     * Accounts X lists as speakers
     */
    speakers: Array<Space.Speaker>;

    /**
     * Audio or video kind, as X names it
     */
    contentType?: string;

    /**
     * X's code for who may speak
     */
    conversationControls?: number;

    /**
     * When the Space was made
     */
    createdAt?: string;

    /**
     * Public X profile.
     */
    creator?: Shared.UserProfile;

    /**
     * Whether X lets no more accounts join
     */
    disallowJoin?: boolean;

    /**
     * When the Space ended
     */
    endedAt?: string;

    /**
     * Whether listeners may clip the Space
     */
    isAvailableForClipping?: boolean;

    /**
     * Whether X offers a recording
     */
    isAvailableForReplay?: boolean;

    /**
     * Whether only X employees may join
     */
    isEmployeeOnly?: boolean;

    /**
     * Whether the host locked the Space
     */
    isLocked?: boolean;

    /**
     * Most hosts and co-hosts the Space allows
     */
    maxAdminCapacity?: number;

    /**
     * X's media key for the Space's audio
     */
    mediaKey?: string;

    /**
     * IDs of the accounts the host tagged
     */
    mentionedUserIds?: Array<string>;

    /**
     * Whether anonymous listening is off
     */
    noIncognito?: boolean;

    /**
     * Accounts in the Space now, while it is live
     */
    participantCount?: number;

    /**
     * When the Space was set to start
     */
    scheduledStart?: string;

    /**
     * Posts the hosts and speakers shared in the Space, in X's order. Only when X
     * lists them.
     */
    sharings?: Array<Space.Sharing>;

    /**
     * When the Space went live
     */
    startedAt?: string;

    /**
     * NotStarted (scheduled), Running (live), Ended, Canceled (scheduled, never
     * started) or TimedOut (closed by X, not by its host)
     */
    state?: string;

    /**
     * Space title
     */
    title?: string;

    /**
     * Accounts that listened live
     */
    totalLiveListeners?: number;

    /**
     * Accounts that played the recording
     */
    totalReplayWatched?: number;

    /**
     * Search tweet with author. Zero metrics may mean X omitted counts.
     */
    tweet?: Shared.SearchTweet;

    /**
     * ID of the post that announces the Space
     */
    tweetId?: string;

    /**
     * When X last changed the Space
     */
    updatedAt?: string;
  }

  export namespace Space {
    /**
     * An account on a Space's stage or in its audience, as X lists it there.
     */
    export interface Admin {
      id: string;

      /**
       * Name the account shows in the Space
       */
      name: string;

      username: string;

      /**
       * Organization affiliation label shown on an X profile.
       */
      affiliatesHighlightedLabel?: Admin.AffiliatesHighlightedLabel;

      /**
       * Whether the account has X Premium verification
       */
      isBlueVerified?: boolean;

      /**
       * Whether a host muted the account
       */
      isMutedByAdmin?: boolean;

      /**
       * Whether the account muted itself
       */
      isMutedByGuest?: boolean;

      /**
       * Whether X shows a verified badge in the Space
       */
      isVerified?: boolean;

      /**
       * When the account joined the Space
       */
      joinedAt?: string;

      /**
       * The account's ID in X's broadcast service
       */
      periscopeUserId?: string;

      /**
       * Profile picture URL
       */
      profilePicture?: string;

      /**
       * Business or Government badge type
       */
      verifiedType?: string;
    }

    export namespace Admin {
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
    }

    /**
     * An account on a Space's stage or in its audience, as X lists it there.
     */
    export interface Listener {
      id: string;

      /**
       * Name the account shows in the Space
       */
      name: string;

      username: string;

      /**
       * Organization affiliation label shown on an X profile.
       */
      affiliatesHighlightedLabel?: Listener.AffiliatesHighlightedLabel;

      /**
       * Whether the account has X Premium verification
       */
      isBlueVerified?: boolean;

      /**
       * Whether a host muted the account
       */
      isMutedByAdmin?: boolean;

      /**
       * Whether the account muted itself
       */
      isMutedByGuest?: boolean;

      /**
       * Whether X shows a verified badge in the Space
       */
      isVerified?: boolean;

      /**
       * When the account joined the Space
       */
      joinedAt?: string;

      /**
       * The account's ID in X's broadcast service
       */
      periscopeUserId?: string;

      /**
       * Profile picture URL
       */
      profilePicture?: string;

      /**
       * Business or Government badge type
       */
      verifiedType?: string;
    }

    export namespace Listener {
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
    }

    /**
     * An account on a Space's stage or in its audience, as X lists it there.
     */
    export interface Speaker {
      id: string;

      /**
       * Name the account shows in the Space
       */
      name: string;

      username: string;

      /**
       * Organization affiliation label shown on an X profile.
       */
      affiliatesHighlightedLabel?: Speaker.AffiliatesHighlightedLabel;

      /**
       * Whether the account has X Premium verification
       */
      isBlueVerified?: boolean;

      /**
       * Whether a host muted the account
       */
      isMutedByAdmin?: boolean;

      /**
       * Whether the account muted itself
       */
      isMutedByGuest?: boolean;

      /**
       * Whether X shows a verified badge in the Space
       */
      isVerified?: boolean;

      /**
       * When the account joined the Space
       */
      joinedAt?: string;

      /**
       * The account's ID in X's broadcast service
       */
      periscopeUserId?: string;

      /**
       * Profile picture URL
       */
      profilePicture?: string;

      /**
       * Business or Government badge type
       */
      verifiedType?: string;
    }

    export namespace Speaker {
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
    }

    /**
     * A post shared in a Space, & the account that shared it.
     */
    export interface Sharing {
      /**
       * X's ID of the sharing, not of the post
       */
      id?: string;

      /**
       * When the post was shared
       */
      sharedAt?: string;

      /**
       * Public X profile.
       */
      sharedBy?: Shared.UserProfile;

      /**
       * Search tweet with author. Zero metrics may mean X omitted counts.
       */
      tweet?: Shared.SearchTweet;

      /**
       * When X last changed the sharing
       */
      updatedAt?: string;
    }
  }
}

export interface SpaceRetrieveParams {
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

export interface SpaceRetrieveReplayParams {
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

export interface SpaceSearchParams {
  /**
   * Words, hashtags or X search operators, such as from:solana. Latest & Top add
   * filter:spaces. Live & Upcoming match title words only, without operators. Alias
   * query.
   */
  q: string;

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
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * For Latest & Top, the posts a page reads, 20 at a time (1-100, default 20). Posts
   * often share the same Space, so a page returns fewer Spaces. Send 100 to read a
   * search fastest. For Live & Upcoming, the most Spaces a page returns. Its aliases
   * are limit, count, max_results, maxItems, max_items & per_page.
   */
  pageSize?: number;

  /**
   * Latest finds Spaces in the newest posts. Top finds them in the most engaging
   * posts. Live lists Spaces on air now. Upcoming lists scheduled ones, as X's Spaces
   * search does. Any case works. Aliases result_type, sort_order, type, search_type,
   * product, category & section.
   */
  queryType?: 'Latest' | 'Top' | 'Live' | 'Upcoming';
}

export declare namespace Spaces {
  export {
    type SpaceRetrieveResponse as SpaceRetrieveResponse,
    type SpaceRetrieveReplayResponse as SpaceRetrieveReplayResponse,
    type SpaceSearchResponse as SpaceSearchResponse,
    type SpaceRetrieveParams as SpaceRetrieveParams,
    type SpaceRetrieveReplayParams as SpaceRetrieveReplayParams,
    type SpaceSearchParams as SpaceSearchParams,
  };
}
