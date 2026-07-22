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
   * Creates a keyword monitor. Keyword monitors are unlimited. Active monitors check
   * every 1 second and cost 21 credits per hour. Events and webhook deliveries are
   * included. Creation requires available credits for the first hourly charge.
   *
   * @example
   * ```ts
   * const keyword = await client.monitors.keywords.create({
   *   eventTypes: ['tweet.new'],
   *   query: 'xquik OR "x api"',
   * });
   * ```
   */
  create(body: KeywordCreateParams, options?: RequestOptions): APIPromise<KeywordCreateResponse> {
    return this._client.post('/monitors/keywords', { body, ...options });
  }

  /**
   * Get keyword monitor
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
   * Update keyword monitor
   *
   * @example
   * ```ts
   * const keyword = await client.monitors.keywords.update(
   *   'id',
   *   { eventTypes: ['tweet.new'], isActive: true },
   * );
   * ```
   */
  update(id: string, body: KeywordUpdateParams, options?: RequestOptions): APIPromise<KeywordUpdateResponse> {
    return this._client.patch(path`/monitors/keywords/${id}`, { body, ...options });
  }

  /**
   * List keyword monitors
   *
   * @example
   * ```ts
   * const keywords = await client.monitors.keywords.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<KeywordListResponse> {
    return this._client.get('/monitors/keywords', options);
  }

  /**
   * Delete keyword monitor
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
   * Next hourly usage charge time for this keyword query monitor.
   */
  nextBillingAt: string;

  query: string;
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
   * Next hourly usage charge time for this keyword query monitor.
   */
  nextBillingAt: string;

  query: string;
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
   * Next hourly usage charge time for this keyword query monitor.
   */
  nextBillingAt: string;

  query: string;
}

export interface KeywordListResponse {
  monitors: Array<KeywordListResponse.Monitor>;

  total: number;
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
     * Next hourly usage charge time for this keyword query monitor.
     */
    nextBillingAt: string;

    query: string;
  }
}

export interface KeywordDeactivateResponse {
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
}

export interface KeywordUpdateParams {
  /**
   * Array of event types to subscribe to.
   */
  eventTypes?: Array<Shared.EventType>;

  isActive?: boolean;
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
  };
}
