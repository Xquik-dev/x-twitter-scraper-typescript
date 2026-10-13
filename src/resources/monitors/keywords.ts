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
 * X account monitoring with 1-second checks
 */
export class Keywords extends APIResource {
  /**
   * Creates a keyword monitor, with no count limit. Active monitors check every
   * second for 30 credits an hour, events & webhook deliveries included. That hourly
   * price is a monitor's only charge. Creation needs the credits of the first hour.
   *
   * @example
   * ```ts
   * const keyword = await client.monitors.keywords.create({
   *   eventTypes: ['tweet.new'],
   *   query: 'xquik OR "x api"',
   *   name: 'Launch mentions',
   * });
   * ```
   */
  create(body: KeywordCreateParams, options?: RequestOptions): APIPromise<KeywordCreateResponse> {
    return this._client.post('/monitors/keywords', { body, ...options });
  }

  /**
   * Returns configuration and status for one keyword monitor.
   *
   * @example
   * ```ts
   * const keyword = await client.monitors.keywords.retrieve(
   *   'id',
   * );
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<KeywordRetrieveResponse> {
    return this._client.get(path`/monitors/keywords/${id}`, options);
  }

  /**
   * Updates mutable settings for an existing keyword monitor.
   *
   * @example
   * ```ts
   * const keyword = await client.monitors.keywords.update(
   *   'id',
   *   {
   *     eventTypes: ['tweet.new'],
   *     isActive: true,
   *     name: 'Launch mentions',
   *   },
   * );
   * ```
   */
  update(id: string, body: KeywordUpdateParams, options?: RequestOptions): APIPromise<KeywordUpdateResponse> {
    return this._client.patch(path`/monitors/keywords/${id}`, { body, ...options });
  }

  /**
   * Returns keyword monitors with their current operating states.
   *
   * @example
   * ```ts
   * const keywords = await client.monitors.keywords.list();
   * ```
   */
  list(
    query: KeywordListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<KeywordListResponse> {
    return this._client.get('/monitors/keywords', { query, ...options });
  }

  /**
   * Stops one keyword monitor, then removes its stored events in bounded batches.
   * Poll statusUrl until the monitor returns 404.
   *
   * @example
   * ```ts
   * const response = await client.monitors.keywords.deactivate(
   *   'id',
   * );
   * ```
   */
  deactivate(id: string, options?: RequestOptions): APIPromise<KeywordDeactivateResponse> {
    return this._client.delete(path`/monitors/keywords/${id}`, options);
  }
}

/**
 * Keyword monitor that tracks matching public X activity.
 */
export interface KeywordCreateResponse {
  id: string;

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType>;

  isActive: boolean;

  /**
   * Next hourly credit charge time for this keyword query monitor.
   */
  nextBillingAt: string;

  query: string;

  /**
   * Customer-set label of the keyword monitor, when set.
   */
  name?: string;
}

/**
 * Keyword monitor that tracks matching public X activity.
 */
export interface KeywordRetrieveResponse {
  id: string;

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType>;

  isActive: boolean;

  /**
   * Next hourly credit charge time for this keyword query monitor.
   */
  nextBillingAt: string;

  query: string;

  /**
   * Customer-set label of the keyword monitor, when set.
   */
  name?: string;
}

/**
 * Keyword monitor that tracks matching public X activity.
 */
export interface KeywordUpdateResponse {
  id: string;

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType>;

  isActive: boolean;

  /**
   * Next hourly credit charge time for this keyword query monitor.
   */
  nextBillingAt: string;

  query: string;

  /**
   * Customer-set label of the keyword monitor, when set.
   */
  name?: string;
}

export interface KeywordListResponse {
  hasMore: boolean;

  monitors: Array<KeywordListResponse.Monitor>;

  /**
   * Keyword monitors on this page.
   */
  total: number;

  nextCursor?: string;
}

export namespace KeywordListResponse {
  /**
   * Keyword monitor that tracks matching public X activity.
   */
  export interface Monitor {
    id: string;

    createdAt: string;

    /**
     * Array of event types to subscribe to.
     */
    eventTypes: Array<Shared.EventType>;

    isActive: boolean;

    /**
     * Next hourly credit charge time for this keyword query monitor.
     */
    nextBillingAt: string;

    query: string;

    /**
     * Customer-set label of the keyword monitor, when set.
     */
    name?: string;
  }
}

export interface KeywordDeactivateResponse {
  deletionStatus: 'deleting';

  /**
   * Poll this monitor URL until it returns 404.
   */
  statusUrl: string;

  success: true;
}

export interface KeywordCreateParams {
  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType>;

  /**
   * X search query to monitor. Whitespace is normalized.
   */
  query: string;

  /**
   * Your own label for the keyword monitor. Its events carry it as monitorName.
   */
  name?: string;
}

export interface KeywordUpdateParams {
  /**
   * Array of event types to subscribe to.
   */
  eventTypes?: Array<Shared.EventType>;

  isActive?: boolean;

  /**
   * New label for the keyword monitor. Send null to remove it.
   */
  name?: string | null;
}

export interface KeywordListParams {
  /**
   * Previous nextCursor. The after alias also works. Offset pagination is not
   * supported.
   */
  cursor?: string;

  /**
   * Maximum items per page: 1 to 200, default 200. Pass nextCursor as cursor for the
   * next page.
   */
  limit?: number;
}

export declare namespace Keywords {
  export {
    type KeywordCreateResponse as KeywordCreateResponse,
    type KeywordRetrieveResponse as KeywordRetrieveResponse,
    type KeywordUpdateResponse as KeywordUpdateResponse,
    type KeywordListResponse as KeywordListResponse,
    type KeywordDeactivateResponse as KeywordDeactivateResponse,
    type KeywordCreateParams as KeywordCreateParams,
    type KeywordUpdateParams as KeywordUpdateParams,
    type KeywordListParams as KeywordListParams,
  };
}
