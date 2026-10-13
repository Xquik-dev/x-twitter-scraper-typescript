// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as KeywordsAPI from './keywords';
import {
  KeywordCreateParams,
  KeywordCreateResponse,
  KeywordDeactivateResponse,
  KeywordListParams,
  KeywordListResponse,
  KeywordRetrieveResponse,
  KeywordUpdateParams,
  KeywordUpdateResponse,
  Keywords,
} from './keywords';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * X account monitoring with 1-second checks
 */
export class Monitors extends APIResource {
  keywords: KeywordsAPI.Keywords = new KeywordsAPI.Keywords(this._client);

  /**
   * Creates an account monitor, with no count limit. Active monitors check every
   * second for 30 credits an hour, events & webhook deliveries included. That hourly
   * price is a monitor's only charge. Creation needs the credits of the first hour.
   *
   * @example
   * ```ts
   * const monitor = await client.monitors.create({
   *   eventTypes: ['tweet.new', 'tweet.reply'],
   *   username: 'elonmusk',
   *   name: 'Launch watch',
   * });
   * ```
   */
  create(body: MonitorCreateParams, options?: RequestOptions): APIPromise<MonitorCreateResponse> {
    return this._client.post('/monitors', { body, ...options });
  }

  /**
   * Returns configuration and status for one account monitor.
   *
   * @example
   * ```ts
   * const monitor = await client.monitors.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<Monitor> {
    return this._client.get(path`/monitors/${id}`, options);
  }

  /**
   * Updates mutable settings for an existing account monitor.
   *
   * @example
   * ```ts
   * const monitor = await client.monitors.update('id', {
   *   eventTypes: ['tweet.new'],
   *   isActive: true,
   *   name: 'Launch watch',
   * });
   * ```
   */
  update(id: string, body: MonitorUpdateParams, options?: RequestOptions): APIPromise<Monitor> {
    return this._client.patch(path`/monitors/${id}`, { body, ...options });
  }

  /**
   * Returns account monitors with their current operating states.
   *
   * @example
   * ```ts
   * const monitors = await client.monitors.list();
   * ```
   */
  list(
    query: MonitorListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MonitorListResponse> {
    return this._client.get('/monitors', { query, ...options });
  }

  /**
   * Stops one account monitor, then removes its stored events in bounded batches.
   * Poll statusUrl until the monitor returns 404.
   *
   * @example
   * ```ts
   * const response = await client.monitors.deactivate('id');
   * ```
   */
  deactivate(id: string, options?: RequestOptions): APIPromise<MonitorDeactivateResponse> {
    return this._client.delete(path`/monitors/${id}`, options);
  }
}

/**
 * Account monitor that tracks activity for a given X user.
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
   * Next hourly credit charge time for this account monitor.
   */
  nextBillingAt: string;

  username: string;

  xUserId: string;

  /**
   * Customer-set label of the account monitor, when set.
   */
  name?: string;

  /**
   * When Xquik automatically paused this monitor.
   */
  pausedAt?: string;

  /**
   * Why Xquik automatically paused this monitor.
   */
  pausedReason?: 'x_account_protected' | 'x_user_not_found';
}

export interface MonitorCreateResponse {
  id: string;

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType>;

  isActive: boolean;

  /**
   * Next hourly credit charge time. New active monitors are due immediately.
   */
  nextBillingAt: string;

  username: string;

  xUserId: string;
}

export interface MonitorListResponse {
  hasMore: boolean;

  monitors: Array<Monitor>;

  /**
   * Account monitors on this page.
   */
  total: number;

  nextCursor?: string;
}

export interface MonitorDeactivateResponse {
  deletionStatus: 'deleting';

  /**
   * Poll this monitor URL until it returns 404.
   */
  statusUrl: string;

  success: true;
}

export interface MonitorCreateParams {
  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType>;

  /**
   * X username to monitor, with or without @
   */
  username: string;

  /**
   * Your label for the monitor. Its events carry it as monitorName. Whitespace is
   * normalized.
   */
  name?: string;
}

export interface MonitorUpdateParams {
  /**
   * Array of event types to subscribe to.
   */
  eventTypes?: Array<Shared.EventType>;

  isActive?: boolean;

  /**
   * New label for the account monitor. Send null to remove the label.
   */
  name?: string | null;
}

export interface MonitorListParams {
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

Monitors.Keywords = Keywords;

export declare namespace Monitors {
  export {
    type Monitor as Monitor,
    type MonitorCreateResponse as MonitorCreateResponse,
    type MonitorListResponse as MonitorListResponse,
    type MonitorDeactivateResponse as MonitorDeactivateResponse,
    type MonitorCreateParams as MonitorCreateParams,
    type MonitorUpdateParams as MonitorUpdateParams,
    type MonitorListParams as MonitorListParams,
  };

  export {
    Keywords as Keywords,
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
