// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Push notification integrations (Telegram)
 */
export class Integrations extends APIResource {
  /**
   * Create integration
   *
   * @example
   * ```ts
   * const integration = await client.integrations.create({
   *   config: { chatId: '-1001234567890' },
   *   eventTypes: ['tweet.new', 'follower.gained'],
   *   name: 'My Telegram Bot',
   *   type: 'telegram',
   * });
   * ```
   */
  create(body: IntegrationCreateParams, options?: RequestOptions): APIPromise<IntegrationCreateResponse> {
    return this._client.post('/integrations', { body, ...options });
  }

  /**
   * Get integration details
   *
   * @example
   * ```ts
   * const integration = await client.integrations.retrieve(
   *   'id',
   * );
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<IntegrationRetrieveResponse> {
    return this._client.get(path`/integrations/${id}`, options);
  }

  /**
   * Update integration
   *
   * @example
   * ```ts
   * const integration = await client.integrations.update('id', {
   *   isActive: true,
   *   name: 'My Telegram Bot',
   * });
   * ```
   */
  update(
    id: string,
    body: IntegrationUpdateParams,
    options?: RequestOptions,
  ): APIPromise<IntegrationUpdateResponse> {
    return this._client.patch(path`/integrations/${id}`, { body, ...options });
  }

  /**
   * List integrations
   *
   * @example
   * ```ts
   * const integrations = await client.integrations.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<IntegrationListResponse> {
    return this._client.get('/integrations', options);
  }

  /**
   * Delete integration
   *
   * @example
   * ```ts
   * const integration = await client.integrations.delete('id');
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<IntegrationDeleteResponse> {
    return this._client.delete(path`/integrations/${id}`, options);
  }

  /**
   * List integration delivery history
   *
   * @example
   * ```ts
   * const response = await client.integrations.listDeliveries(
   *   'id',
   * );
   * ```
   */
  listDeliveries(
    id: string,
    query: IntegrationListDeliveriesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<IntegrationListDeliveriesResponse> {
    return this._client.get(path`/integrations/${id}/deliveries`, { query, ...options });
  }

  /**
   * Send test delivery
   *
   * @example
   * ```ts
   * const response = await client.integrations.sendTest('id');
   * ```
   */
  sendTest(id: string, options?: RequestOptions): APIPromise<IntegrationSendTestResponse> {
    return this._client.post(path`/integrations/${id}/test`, options);
  }
}

/**
 * Third-party integration (e.g. Telegram) subscribed to monitor events.
 */
export interface Integration {
  id: string;

  /**
   * Integration config — shape varies by type (JSON)
   */
  config: { [key: string]: unknown };

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<
    'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
  >;

  isActive: boolean;

  name: string;

  type: 'telegram';

  /**
   * Event filter rules (JSON)
   */
  filters?: { [key: string]: unknown };

  messageTemplate?: string;

  scopeAllMonitors?: boolean;

  silentPush?: boolean;
}

/**
 * Integration delivery attempt record with status and retry count.
 */
export interface IntegrationDelivery {
  id: string;

  attempts: number;

  createdAt: string;

  eventType: string;

  status: string;

  deliveredAt?: string;

  lastError?: string;

  lastStatusCode?: number;

  sourceId?: string;

  sourceType?: string;
}

/**
 * Third-party integration (e.g. Telegram) subscribed to monitor events.
 */
export interface IntegrationCreateResponse {
  id: string;

  /**
   * Integration config — shape varies by type (JSON)
   */
  config: { [key: string]: unknown };

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<
    'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
  >;

  isActive: boolean;

  name: string;

  type: 'telegram';

  /**
   * Event filter rules (JSON)
   */
  filters?: { [key: string]: unknown };

  messageTemplate?: string;

  scopeAllMonitors?: boolean;

  silentPush?: boolean;
}

/**
 * Third-party integration (e.g. Telegram) subscribed to monitor events.
 */
export interface IntegrationRetrieveResponse {
  id: string;

  /**
   * Integration config — shape varies by type (JSON)
   */
  config: { [key: string]: unknown };

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<
    'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
  >;

  isActive: boolean;

  name: string;

  type: 'telegram';

  /**
   * Event filter rules (JSON)
   */
  filters?: { [key: string]: unknown };

  messageTemplate?: string;

  scopeAllMonitors?: boolean;

  silentPush?: boolean;
}

/**
 * Third-party integration (e.g. Telegram) subscribed to monitor events.
 */
export interface IntegrationUpdateResponse {
  id: string;

  /**
   * Integration config — shape varies by type (JSON)
   */
  config: { [key: string]: unknown };

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<
    'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
  >;

  isActive: boolean;

  name: string;

  type: 'telegram';

  /**
   * Event filter rules (JSON)
   */
  filters?: { [key: string]: unknown };

  messageTemplate?: string;

  scopeAllMonitors?: boolean;

  silentPush?: boolean;
}

export interface IntegrationListResponse {
  integrations: Array<IntegrationListResponse.Integration>;
}

export namespace IntegrationListResponse {
  /**
   * Third-party integration (e.g. Telegram) subscribed to monitor events.
   */
  export interface Integration {
    id: string;

    /**
     * Integration config — shape varies by type (JSON)
     */
    config: { [key: string]: unknown };

    createdAt: string;

    /**
     * Array of event types to subscribe to.
     */
    eventTypes: Array<
      'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
    >;

    isActive: boolean;

    name: string;

    type: 'telegram';

    /**
     * Event filter rules (JSON)
     */
    filters?: { [key: string]: unknown };

    messageTemplate?: string;

    scopeAllMonitors?: boolean;

    silentPush?: boolean;
  }
}

export interface IntegrationDeleteResponse {
  success: true;
}

export interface IntegrationListDeliveriesResponse {
  deliveries: Array<IntegrationListDeliveriesResponse.Delivery>;
}

export namespace IntegrationListDeliveriesResponse {
  /**
   * Integration delivery attempt record with status and retry count.
   */
  export interface Delivery {
    id: string;

    attempts: number;

    createdAt: string;

    eventType: string;

    status: string;

    deliveredAt?: string;

    lastError?: string;

    lastStatusCode?: number;

    sourceId?: string;

    sourceType?: string;
  }
}

export interface IntegrationSendTestResponse {
  success: true;
}

export interface IntegrationCreateParams {
  /**
   * Integration config (e.g. Telegram chatId)
   */
  config: IntegrationCreateParams.Config;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<
    'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
  >;

  name: string;

  type: 'telegram';
}

export namespace IntegrationCreateParams {
  /**
   * Integration config (e.g. Telegram chatId)
   */
  export interface Config {
    chatId: string;
  }
}

export interface IntegrationUpdateParams {
  /**
   * Array of event types to subscribe to.
   */
  eventTypes?: Array<
    'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
  >;

  /**
   * Event filter rules (JSON)
   */
  filters?: { [key: string]: unknown };

  isActive?: boolean;

  /**
   * Custom message template (JSON)
   */
  messageTemplate?: { [key: string]: unknown };

  name?: string;

  scopeAllMonitors?: boolean;

  silentPush?: boolean;
}

export interface IntegrationListDeliveriesParams {
  /**
   * Maximum number of items to return (1-100, default 50)
   */
  limit?: number;
}

export declare namespace Integrations {
  export {
    type Integration as Integration,
    type IntegrationDelivery as IntegrationDelivery,
    type IntegrationCreateResponse as IntegrationCreateResponse,
    type IntegrationRetrieveResponse as IntegrationRetrieveResponse,
    type IntegrationUpdateResponse as IntegrationUpdateResponse,
    type IntegrationListResponse as IntegrationListResponse,
    type IntegrationDeleteResponse as IntegrationDeleteResponse,
    type IntegrationListDeliveriesResponse as IntegrationListDeliveriesResponse,
    type IntegrationSendTestResponse as IntegrationSendTestResponse,
    type IntegrationCreateParams as IntegrationCreateParams,
    type IntegrationUpdateParams as IntegrationUpdateParams,
    type IntegrationListDeliveriesParams as IntegrationListDeliveriesParams,
  };
}
