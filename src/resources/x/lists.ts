// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * X List search, details, followers, members, and tweets
 */
export class Lists extends APIResource {
  /**
   * Returns one public X List as its page on X shows it. Accepts the List ID or the
   * URL-encoded List URL, such as x.com/i/lists/4143408. A private List answers 404
   * list_not_found.
   *
   * @example
   * ```ts
   * const list = await client.x.lists.retrieve('id');
   * ```
   */
  retrieve(
    id: string,
    query: ListRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListRetrieveResponse> {
    return this._client.get(path`/x/lists/${id}`, { query, ...options });
  }

  /**
   * Returns a public List's followers with resumable or standard pagination. A
   * private List answers 404 list_not_found.
   *
   * @example
   * ```ts
   * const response = await client.x.lists.retrieveFollowers(
   *   'id',
   * );
   * ```
   */
  retrieveFollowers(
    id: string,
    query: ListRetrieveFollowersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListRetrieveFollowersResponse> {
    return this._client.get(path`/x/lists/${id}/followers`, { query, ...options });
  }

  /**
   * Returns a public List's members with resumable or standard pagination. A private
   * List answers 404 list_not_found.
   *
   * @example
   * ```ts
   * const response = await client.x.lists.retrieveMembers('id');
   * ```
   */
  retrieveMembers(
    id: string,
    query: ListRetrieveMembersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListRetrieveMembersResponse> {
    return this._client.get(path`/x/lists/${id}/members`, { query, ...options });
  }

  /**
   * Returns one page of public Lists with member counts, banners & owner profiles. X
   * may rank the Lists differently per request. Pass next_cursor as cursor for the
   * next page.
   *
   * @example
   * ```ts
   * const response = await client.x.lists.retrieveSearch({
   *   q: 'q',
   * });
   * ```
   */
  retrieveSearch(
    query: ListRetrieveSearchParams,
    options?: RequestOptions,
  ): APIPromise<ListRetrieveSearchResponse> {
    return this._client.get('/x/lists/search', { query, ...options });
  }

  /**
   * Omit mode for resumable maximum coverage. Pass next_cursor unchanged. Standard
   * keeps legacy pagination. A private List answers 404 list_not_found.
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.lists.retrieveTweets(
   *   'id',
   * );
   * ```
   */
  retrieveTweets(
    id: string,
    query: ListRetrieveTweetsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get(path`/x/lists/${id}/tweets`, { query, ...options });
  }
}

export interface ListRetrieveResponse {
  /**
   * Public X List with its owner's public profile. Leaves out what X tells the
   * reading account, such as whether it follows the List.
   */
  list: ListRetrieveResponse.List;
}

export namespace ListRetrieveResponse {
  /**
   * Public X List with its owner's public profile. Leaves out what X tells the
   * reading account, such as whether it follows the List.
   */
  export interface List {
    /**
     * Numeric ID of the List.
     */
    id: string;

    /**
     * Name the owner gave the List.
     */
    name: string;

    /**
     * URL of the banner the owner uploaded. Absent when the owner uploaded none.
     */
    bannerUrl?: string;

    /**
     * When the owner made the List.
     */
    createdAt?: string;

    /**
     * Banner the owner uploaded.
     */
    customBanner?: List.CustomBanner;

    /**
     * Banner X shows when the owner uploaded none. X picks it per reading account, so
     * 2 calls can return different ones.
     */
    defaultBanner?: List.DefaultBanner;

    /**
     * About text of the List. Empty when the owner wrote none.
     */
    description?: string;

    /**
     * Avatar URLs of a few List members, which X may pick per request.
     */
    facepileUrls?: Array<string>;

    /**
     * Accounts on the List.
     */
    memberCount?: number;

    /**
     * Member count as X words it, such as 35 members.
     */
    membersContext?: string;

    /**
     * Public profile of the account that owns the List.
     */
    owner?: Shared.UserProfile;

    /**
     * Accounts that follow the List, which X calls followers.
     */
    subscriberCount?: number;

    /**
     * List page on x.com.
     */
    url?: string;
  }

  export namespace List {
    /**
     * Banner the owner uploaded.
     */
    export interface CustomBanner {
      /**
       * Banner image URL.
       */
      url: string;

      /**
       * Banner height in pixels.
       */
      height?: number;

      /**
       * Media ID of an uploaded banner.
       */
      mediaId?: string;

      /**
       * Stable media key of an uploaded banner.
       */
      mediaKey?: string;

      /**
       * Dominant colors of an uploaded banner and their shares.
       */
      palette?: Array<CustomBanner.Palette>;

      /**
       * Area X marks as the subject of the banner, in pixels.
       */
      salientRect?: CustomBanner.SalientRect;

      /**
       * Banner width in pixels.
       */
      width?: number;
    }

    export namespace CustomBanner {
      export interface Palette {
        /**
         * Share of the banner
         */
        percentage?: number;

        /**
         * The color's red, green and blue values.
         */
        rgb?: Palette.Rgb;
      }

      export namespace Palette {
        /**
         * The color's red, green and blue values.
         */
        export interface Rgb {
          blue?: number;

          green?: number;

          red?: number;
        }
      }

      /**
       * Area X marks as the subject of the banner, in pixels.
       */
      export interface SalientRect {
        /**
         * Height of the marked area.
         */
        height?: number;

        /**
         * Pixels from the banner's left.
         */
        left?: number;

        /**
         * Pixels from the banner's top.
         */
        top?: number;

        /**
         * Width of the marked area.
         */
        width?: number;
      }
    }

    /**
     * Banner X shows when the owner uploaded none. X picks it per reading account, so
     * 2 calls can return different ones.
     */
    export interface DefaultBanner {
      /**
       * Banner image URL.
       */
      url: string;

      /**
       * Banner height in pixels.
       */
      height?: number;

      /**
       * Media ID of an uploaded banner.
       */
      mediaId?: string;

      /**
       * Stable media key of an uploaded banner.
       */
      mediaKey?: string;

      /**
       * Dominant colors of an uploaded banner and their shares.
       */
      palette?: Array<DefaultBanner.Palette>;

      /**
       * Area X marks as the subject of the banner, in pixels.
       */
      salientRect?: DefaultBanner.SalientRect;

      /**
       * Banner width in pixels.
       */
      width?: number;
    }

    export namespace DefaultBanner {
      export interface Palette {
        /**
         * Share of the banner
         */
        percentage?: number;

        /**
         * The color's red, green and blue values.
         */
        rgb?: Palette.Rgb;
      }

      export namespace Palette {
        /**
         * The color's red, green and blue values.
         */
        export interface Rgb {
          blue?: number;

          green?: number;

          red?: number;
        }
      }

      /**
       * Area X marks as the subject of the banner, in pixels.
       */
      export interface SalientRect {
        /**
         * Height of the marked area.
         */
        height?: number;

        /**
         * Pixels from the banner's left.
         */
        left?: number;

        /**
         * Pixels from the banner's top.
         */
        top?: number;

        /**
         * Width of the marked area.
         */
        width?: number;
      }
    }
  }
}

/**
 * A standard or terminal maximum-coverage relationship page.
 */
export type ListRetrieveFollowersResponse =
  Shared.PaginatedUsers | ListRetrieveFollowersResponse.UserListCoverageResponse;

export namespace ListRetrieveFollowersResponse {
  /**
   * Terminal relationship coverage response with diagnostics.
   */
  export interface UserListCoverageResponse extends Omit<
    Shared.PaginatedUsers,
    'has_next_page' | 'next_cursor'
  > {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    diagnostic: UserListCoverageResponse.Diagnostic;

    has_next_page?: false;

    next_cursor?: '';
  }

  export namespace UserListCoverageResponse {
    /**
     * Coverage evidence across parallel relationship strategies.
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
       * True when credits or the requested limit reduce output.
       */
      responseTruncated: boolean;

      resultLimitReached: boolean;

      returnedUsers: number;

      /**
       * Whole number from 0.
       */
      stalledStrategyCount: number;

      strategies: Array<Diagnostic.Strategy>;

      strategyCount: number;

      uniqueUsers: number;
    }

    export namespace Diagnostic {
      /**
       * Result counts and stop reason for one relationship strategy.
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
      }
    }
  }
}

/**
 * A standard or terminal maximum-coverage relationship page.
 */
export type ListRetrieveMembersResponse =
  Shared.PaginatedUsers | ListRetrieveMembersResponse.UserListCoverageResponse;

export namespace ListRetrieveMembersResponse {
  /**
   * Terminal relationship coverage response with diagnostics.
   */
  export interface UserListCoverageResponse extends Omit<
    Shared.PaginatedUsers,
    'has_next_page' | 'next_cursor'
  > {
    /**
     * Coverage evidence across parallel relationship strategies.
     */
    diagnostic: UserListCoverageResponse.Diagnostic;

    has_next_page?: false;

    next_cursor?: '';
  }

  export namespace UserListCoverageResponse {
    /**
     * Coverage evidence across parallel relationship strategies.
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
       * True when credits or the requested limit reduce output.
       */
      responseTruncated: boolean;

      resultLimitReached: boolean;

      returnedUsers: number;

      /**
       * Whole number from 0.
       */
      stalledStrategyCount: number;

      strategies: Array<Diagnostic.Strategy>;

      strategyCount: number;

      uniqueUsers: number;
    }

    export namespace Diagnostic {
      /**
       * Result counts and stop reason for one relationship strategy.
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
      }
    }
  }
}

/**
 * One page of public X Lists. Follow next_cursor while the response reports more
 * pages. Each returned List costs 1 credit.
 */
export interface ListRetrieveSearchResponse {
  has_next_page: boolean;

  lists: Array<ListRetrieveSearchResponse.List>;

  next_cursor: string;
}

export namespace ListRetrieveSearchResponse {
  /**
   * Public X List with its owner's public profile. Leaves out what X tells the
   * reading account, such as whether it follows the List.
   */
  export interface List {
    /**
     * Numeric ID of the List.
     */
    id: string;

    /**
     * Name the owner gave the List.
     */
    name: string;

    /**
     * URL of the banner the owner uploaded. Absent when the owner uploaded none.
     */
    bannerUrl?: string;

    /**
     * When the owner made the List.
     */
    createdAt?: string;

    /**
     * Banner the owner uploaded.
     */
    customBanner?: List.CustomBanner;

    /**
     * Banner X shows when the owner uploaded none. X picks it per reading account, so
     * 2 calls can return different ones.
     */
    defaultBanner?: List.DefaultBanner;

    /**
     * About text of the List. Empty when the owner wrote none.
     */
    description?: string;

    /**
     * Avatar URLs of a few List members, which X may pick per request.
     */
    facepileUrls?: Array<string>;

    /**
     * Accounts on the List.
     */
    memberCount?: number;

    /**
     * Member count as X words it, such as 35 members.
     */
    membersContext?: string;

    /**
     * Public profile of the account that owns the List.
     */
    owner?: Shared.UserProfile;

    /**
     * Accounts that follow the List, which X calls followers.
     */
    subscriberCount?: number;

    /**
     * List page on x.com.
     */
    url?: string;
  }

  export namespace List {
    /**
     * Banner the owner uploaded.
     */
    export interface CustomBanner {
      /**
       * Banner image URL.
       */
      url: string;

      /**
       * Banner height in pixels.
       */
      height?: number;

      /**
       * Media ID of an uploaded banner.
       */
      mediaId?: string;

      /**
       * Stable media key of an uploaded banner.
       */
      mediaKey?: string;

      /**
       * Dominant colors of an uploaded banner and their shares.
       */
      palette?: Array<CustomBanner.Palette>;

      /**
       * Area X marks as the subject of the banner, in pixels.
       */
      salientRect?: CustomBanner.SalientRect;

      /**
       * Banner width in pixels.
       */
      width?: number;
    }

    export namespace CustomBanner {
      export interface Palette {
        /**
         * Share of the banner
         */
        percentage?: number;

        /**
         * The color's red, green and blue values.
         */
        rgb?: Palette.Rgb;
      }

      export namespace Palette {
        /**
         * The color's red, green and blue values.
         */
        export interface Rgb {
          blue?: number;

          green?: number;

          red?: number;
        }
      }

      /**
       * Area X marks as the subject of the banner, in pixels.
       */
      export interface SalientRect {
        /**
         * Height of the marked area.
         */
        height?: number;

        /**
         * Pixels from the banner's left.
         */
        left?: number;

        /**
         * Pixels from the banner's top.
         */
        top?: number;

        /**
         * Width of the marked area.
         */
        width?: number;
      }
    }

    /**
     * Banner X shows when the owner uploaded none. X picks it per reading account, so
     * 2 calls can return different ones.
     */
    export interface DefaultBanner {
      /**
       * Banner image URL.
       */
      url: string;

      /**
       * Banner height in pixels.
       */
      height?: number;

      /**
       * Media ID of an uploaded banner.
       */
      mediaId?: string;

      /**
       * Stable media key of an uploaded banner.
       */
      mediaKey?: string;

      /**
       * Dominant colors of an uploaded banner and their shares.
       */
      palette?: Array<DefaultBanner.Palette>;

      /**
       * Area X marks as the subject of the banner, in pixels.
       */
      salientRect?: DefaultBanner.SalientRect;

      /**
       * Banner width in pixels.
       */
      width?: number;
    }

    export namespace DefaultBanner {
      export interface Palette {
        /**
         * Share of the banner
         */
        percentage?: number;

        /**
         * The color's red, green and blue values.
         */
        rgb?: Palette.Rgb;
      }

      export namespace Palette {
        /**
         * The color's red, green and blue values.
         */
        export interface Rgb {
          blue?: number;

          green?: number;

          red?: number;
        }
      }

      /**
       * Area X marks as the subject of the banner, in pixels.
       */
      export interface SalientRect {
        /**
         * Height of the marked area.
         */
        height?: number;

        /**
         * Pixels from the banner's left.
         */
        left?: number;

        /**
         * Pixels from the banner's top.
         */
        top?: number;

        /**
         * Width of the marked area.
         */
        width?: number;
      }
    }
  }
}

export interface ListRetrieveParams {
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

export interface ListRetrieveFollowersParams {
  /**
   * Legacy cursor alias. Prefer cursor.
   */
  after?: string;

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
   * Cursor from the previous response. Existing unprefixed cursors keep legacy
   * standard behavior. Pages can be empty before more rows; follow next_cursor. Also
   * read as next_cursor, next_token, pagination_token or continuation_token.
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
   * Most profiles 1 request reads, kept or dropped by the filters. A filter that
   * keeps few profiles reads up to 65 s a request without it. The request then
   * answers the profiles it kept, the count it dropped & the cursor to read on. Each
   * request of a cursor may send its own value. Automatic mode only.
   */
  maxScan?: number;

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
   * Omit mode for resumable maximum coverage. Standard keeps legacy pagination.
   * Coverage returns diagnostics once and rejects cursors.
   */
  mode?: 'standard' | 'coverage';

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Up to 300 user profiles in automatic mode, 200 in standard. Sources can return
   * fewer. Follow next_cursor for more pages. Aliases: limit, count, max_results,
   * maxItems, max_items & per_page.
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

export interface ListRetrieveMembersParams {
  /**
   * Legacy cursor alias. Prefer cursor.
   */
  after?: string;

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
   * Cursor from the previous response. Existing unprefixed cursors keep legacy
   * standard behavior. Pages can be empty before more rows; follow next_cursor. Also
   * read as next_cursor, next_token, pagination_token or continuation_token.
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
   * Most profiles 1 request reads, kept or dropped by the filters. A filter that
   * keeps few profiles reads up to 65 s a request without it. The request then
   * answers the profiles it kept, the count it dropped & the cursor to read on. Each
   * request of a cursor may send its own value. Automatic mode only.
   */
  maxScan?: number;

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
   * Omit mode for resumable maximum coverage. Standard keeps legacy pagination.
   * Coverage returns diagnostics once and rejects cursors.
   */
  mode?: 'standard' | 'coverage';

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;

  /**
   * Up to 300 user profiles in automatic mode, 200 in standard. Sources can return
   * fewer. Follow next_cursor for more pages. Aliases: limit, count, max_results,
   * maxItems, max_items & per_page.
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

export interface ListRetrieveSearchParams {
  /**
   * Keywords to find Lists by, such as a topic. Alias query.
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
   * Items per page (1-100, default 20). Source, filters or credits can return fewer.
   * Follow next_cursor for more pages. Aliases: limit, count, max_results, maxItems,
   * max_items & per_page.
   */
  pageSize?: number;
}

export interface ListRetrieveTweetsParams {
  /**
   * Raw advanced search query appended as-is.
   */
  advancedQuery?: string;

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
   * Include reply tweets unless replies specifies another mode.
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

export declare namespace Lists {
  export {
    type ListRetrieveResponse as ListRetrieveResponse,
    type ListRetrieveFollowersResponse as ListRetrieveFollowersResponse,
    type ListRetrieveMembersResponse as ListRetrieveMembersResponse,
    type ListRetrieveSearchResponse as ListRetrieveSearchResponse,
    type ListRetrieveParams as ListRetrieveParams,
    type ListRetrieveFollowersParams as ListRetrieveFollowersParams,
    type ListRetrieveMembersParams as ListRetrieveMembersParams,
    type ListRetrieveSearchParams as ListRetrieveSearchParams,
    type ListRetrieveTweetsParams as ListRetrieveTweetsParams,
  };
}
