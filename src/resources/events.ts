// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Activity events from monitored accounts
 */
export class Events extends APIResource {
  /**
   * Get event
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<EventDetail> {
    return this._client.get(path`/events/${id}`, options);
  }

  /**
   * List events
   */
  list(
    query: EventListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<EventListResponse> {
    return this._client.get('/events', { query, ...options, __security: { apiKeyAuth: true } });
  }
}

/**
 * Monitor event summary with type, username, and occurrence time.
 */
export interface Event {
  id: string;

  data: { [key: string]: unknown };

  monitorId: string;

  occurredAt: string;

  /**
   * Type of monitor event fired when account activity occurs.
   */
  type: Shared.EventType;

  username: string;
}

/**
 * Full monitor event including payload data and optional X event ID.
 */
export interface EventDetail {
  id: string;

  /**
   * Event payload — shape varies by event type (JSON)
   */
  data: { [key: string]: unknown };

  monitorId: string;

  occurredAt: string;

  /**
   * Type of monitor event fired when account activity occurs.
   */
  type: Shared.EventType;

  username: string;

  xEventId?: string;
}

export interface EventListResponse {
  events: Array<Event>;

  hasMore: boolean;

  nextCursor?: string;
}

export interface EventListParams {
  /**
   * Cursor for keyset pagination
   */
  after?: string;

  /**
   * Filter events by type
   */
  eventType?: Shared.EventType;

  /**
   * Maximum number of items to return (1-100, default 50)
   */
  limit?: number;

  /**
   * Filter events by monitor ID
   */
  monitorId?: string;
}

export declare namespace Events {
  export {
    type Event as Event,
    type EventDetail as EventDetail,
    type EventListResponse as EventListResponse,
    type EventListParams as EventListParams,
  };
}
