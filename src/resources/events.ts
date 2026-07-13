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
    return this._client.get('/events', { query, ...options });
  }
}

/**
 * Monitor event summary with source metadata and occurrence time.
 */
export interface Event {
  id: string;

  data: { [key: string]: unknown };

  /**
   * Account monitor ID for account events, or keyword monitor ID for keyword events.
   */
  monitorId: string;

  /**
   * Source monitor type.
   */
  monitorType: 'account' | 'keyword';

  occurredAt: string;

  /**
   * Type of monitor event fired when account activity occurs.
   */
  type: Shared.EventType;

  /**
   * Keyword monitor ID, present for keyword monitor events.
   */
  keywordMonitorId?: string;

  /**
   * Keyword query, present for keyword monitor events.
   */
  query?: string;

  /**
   * Account username, present for account monitor events.
   */
  username?: string;
}

/**
 * Full monitor event including payload data and optional X event ID.
 */
export interface EventDetail {
  id: string;

  /**
   * Event payload - shape varies by event type (JSON)
   */
  data: { [key: string]: unknown };

  /**
   * Monitor ID associated with this detailed event payload.
   */
  monitorId: string;

  /**
   * Source monitor type for this detailed event.
   */
  monitorType: 'account' | 'keyword';

  occurredAt: string;

  /**
   * Type of monitor event fired when account activity occurs.
   */
  type: Shared.EventType;

  /**
   * Keyword monitor ID included on detailed keyword events.
   */
  keywordMonitorId?: string;

  /**
   * Keyword query for this detailed monitor event.
   */
  query?: string;

  /**
   * Account username for this detailed monitor event.
   */
  username?: string;

  xEventId?: string;
}

export interface EventListResponse {
  events: Array<Event>;

  hasMore: boolean;

  nextCursor?: string;
}

export interface EventListParams {
  /**
   * Cursor for keyset pagination from prior response next_cursor
   */
  cursor?: string;

  /**
   * Filter events by type
   */
  eventType?: Shared.EventType;

  /**
   * Maximum number of items to return (1-100, default 50). For paid per-result
   * endpoints, the returned count may be lower when remaining credits cannot cover
   * the requested page. If zero paid results are affordable, the endpoint returns
   * 402 insufficient_credits.
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
