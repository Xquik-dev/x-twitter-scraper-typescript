// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * X live video details, watch counts, and broadcaster
 */
export class Broadcasts extends APIResource {
  /**
   * Returns one X broadcast, the live video X hosts at x.com/i/broadcasts, live or
   * ended. Accepts the broadcast ID or the URL-encoded broadcast URL. Reading a
   * broadcast adds no view to it.
   *
   * @example
   * ```ts
   * const broadcast = await client.x.broadcasts.retrieve('id');
   * ```
   */
  retrieve(
    id: string,
    query: BroadcastRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BroadcastRetrieveResponse> {
    return this._client.get(path`/x/broadcasts/${id}`, { query, ...options });
  }
}

export interface BroadcastRetrieveResponse {
  /**
   * X broadcast, a live video
   */
  broadcast: BroadcastRetrieveResponse.Broadcast;
}

export namespace BroadcastRetrieveResponse {
  /**
   * X broadcast, a live video
   */
  export interface Broadcast {
    /**
     * Broadcast ID
     */
    id: string;

    /**
     * Camera rotation in degrees
     */
    cameraRotation?: number;

    /**
     * X's code for who may chat
     */
    chatOption?: number;

    /**
     * Public X profile.
     */
    creator?: Shared.UserProfile;

    /**
     * When the broadcast ended
     */
    endedAt?: string;

    /**
     * Video height in pixels
     */
    height?: number;

    /**
     * Whether X offers a recording of the broadcast
     */
    isAvailableForReplay?: boolean;

    /**
     * Whether the video stream runs in high-latency mode
     */
    isHighLatency?: boolean;

    /**
     * Whether X marks the chat private
     */
    isPrivateChat?: boolean;

    /**
     * Whether the broadcaster edited the title of the replay
     */
    isTitleEdited?: boolean;

    /**
     * When the video stream last reached X
     */
    lastPingAt?: string;

    /**
     * X's media key for the video
     */
    mediaKey?: string;

    /**
     * Broadcaster, as X's live video service names the account
     */
    periscopeUser?: Broadcast.PeriscopeUser;

    /**
     * Image X shows before the broadcast starts
     */
    preLiveSlateUrl?: string;

    /**
     * When the broadcast was set to start
     */
    scheduledStart?: string;

    /**
     * What produced the video stream, as X names it
     */
    source?: string;

    /**
     * When the broadcast went live
     */
    startedAt?: string;

    /**
     * Such as NotStarted, Running or Ended, as X names it
     */
    state?: string;

    /**
     * Broadcast title
     */
    title?: string;

    /**
     * Accounts that watched, live or after
     */
    totalWatched?: number;

    /**
     * Accounts watching, as X counts them
     */
    totalWatching?: number;

    /**
     * Search tweet with author. Zero metrics may mean X omitted counts.
     */
    tweet?: Shared.SearchTweet;

    /**
     * ID of the post that announces the broadcast
     */
    tweetId?: string;

    /**
     * X's revision number of the broadcast
     */
    version?: number;

    /**
     * Video width in pixels
     */
    width?: number;
  }

  export namespace Broadcast {
    /**
     * Broadcaster, as X's live video service names the account
     */
    export interface PeriscopeUser {
      /**
       * Live video account ID
       */
      id?: string;

      /**
       * Live video display name
       */
      displayName?: string;

      /**
       * Live video avatar URL
       */
      profilePicture?: string;

      /**
       * Live video username
       */
      username?: string;
    }
  }
}

export interface BroadcastRetrieveParams {
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

export declare namespace Broadcasts {
  export {
    type BroadcastRetrieveResponse as BroadcastRetrieveResponse,
    type BroadcastRetrieveParams as BroadcastRetrieveParams,
  };
}
