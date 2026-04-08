// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Webhook endpoint management & delivery
 */
export class Webhooks extends APIResource {
  /**
   * Create webhook
   *
   * @example
   * ```ts
   * const webhook = await client.webhooks.create({
   *   eventTypes: ['tweet.new', 'follower.gained'],
   *   url: 'https://example.com/webhook',
   * });
   * ```
   */
  create(body: WebhookCreateParams, options?: RequestOptions): APIPromise<WebhookCreateResponse> {
    return this._client.post('/webhooks', { body, ...options });
  }

  /**
   * Update webhook
   *
   * @example
   * ```ts
   * const webhook = await client.webhooks.update('id', {
   *   isActive: true,
   *   url: 'https://example.com/webhook',
   * });
   * ```
   */
  update(id: string, body: WebhookUpdateParams, options?: RequestOptions): APIPromise<Webhook> {
    return this._client.patch(path`/webhooks/${id}`, { body, ...options });
  }

  /**
   * List webhooks
   *
   * @example
   * ```ts
   * const webhooks = await client.webhooks.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<WebhookListResponse> {
    return this._client.get('/webhooks', options);
  }

  /**
   * Deactivate webhook
   *
   * @example
   * ```ts
   * const response = await client.webhooks.deactivate('id');
   * ```
   */
  deactivate(id: string, options?: RequestOptions): APIPromise<WebhookDeactivateResponse> {
    return this._client.delete(path`/webhooks/${id}`, options);
  }

  /**
   * List webhook deliveries
   *
   * @example
   * ```ts
   * const response = await client.webhooks.listDeliveries('id');
   * ```
   */
  listDeliveries(id: string, options?: RequestOptions): APIPromise<WebhookListDeliveriesResponse> {
    return this._client.get(path`/webhooks/${id}/deliveries`, options);
  }

  /**
   * Test webhook endpoint
   *
   * @example
   * ```ts
   * const response = await client.webhooks.test('id');
   * ```
   */
  test(id: string, options?: RequestOptions): APIPromise<WebhookTestResponse> {
    return this._client.post(path`/webhooks/${id}/test`, options);
  }
}

/**
 * Webhook delivery attempt record with status and retry count.
 */
export interface Delivery {
  id: string;

  attempts: number;

  createdAt: string;

  status: string;

  streamEventId: string;

  deliveredAt?: string;

  lastError?: string;

  lastStatusCode?: number;
}

/**
 * Webhook endpoint registered to receive event deliveries.
 */
export interface Webhook {
  id: string;

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType>;

  isActive: boolean;

  url: string;
}

export interface WebhookCreateResponse {
  id: string;

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType>;

  secret: string;

  url: string;
}

export interface WebhookListResponse {
  webhooks: Array<Webhook>;
}

export interface WebhookDeactivateResponse {
  success: true;
}

export interface WebhookListDeliveriesResponse {
  deliveries: Array<Delivery>;
}

export interface WebhookTestResponse {
  statusCode: number;

  success: boolean;

  error?: string;
}

export interface WebhookCreateParams {
  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType>;

  /**
   * HTTPS URL
   */
  url: string;
}

export interface WebhookUpdateParams {
  /**
   * Array of event types to subscribe to.
   */
  eventTypes?: Array<Shared.EventType>;

  isActive?: boolean;

  url?: string;
}

export declare namespace Webhooks {
  export {
    type Delivery as Delivery,
    type Webhook as Webhook,
    type WebhookCreateResponse as WebhookCreateResponse,
    type WebhookListResponse as WebhookListResponse,
    type WebhookDeactivateResponse as WebhookDeactivateResponse,
    type WebhookListDeliveriesResponse as WebhookListDeliveriesResponse,
    type WebhookTestResponse as WebhookTestResponse,
    type WebhookCreateParams as WebhookCreateParams,
    type WebhookUpdateParams as WebhookUpdateParams,
  };
}
