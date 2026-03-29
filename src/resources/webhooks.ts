// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Webhook endpoint management & delivery
 */
export class Webhooks extends APIResource {
  /**
   * Create webhook
   */
  create(body: WebhookCreateParams, options?: RequestOptions): APIPromise<WebhookCreateResponse> {
    return this._client.post('/webhooks', { body, ...options });
  }

  /**
   * Update webhook
   */
  update(id: string, body: WebhookUpdateParams, options?: RequestOptions): APIPromise<WebhookUpdateResponse> {
    return this._client.patch(path`/webhooks/${id}`, { body, ...options });
  }

  /**
   * List webhooks
   */
  list(options?: RequestOptions): APIPromise<WebhookListResponse> {
    return this._client.get('/webhooks', options);
  }

  /**
   * Deactivate webhook
   */
  deactivate(id: string, options?: RequestOptions): APIPromise<WebhookDeactivateResponse> {
    return this._client.delete(path`/webhooks/${id}`, options);
  }

  /**
   * List webhook deliveries
   */
  listDeliveries(id: string, options?: RequestOptions): APIPromise<WebhookListDeliveriesResponse> {
    return this._client.get(path`/webhooks/${id}/deliveries`, options);
  }

  /**
   * Test webhook endpoint
   */
  test(id: string, options?: RequestOptions): APIPromise<WebhookTestResponse> {
    return this._client.post(path`/webhooks/${id}/test`, options);
  }
}

export interface WebhookCreateResponse {
  id: string;

  createdAt: string;

  eventTypes: Array<
    'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
  >;

  secret: string;

  url: string;
}

export interface WebhookUpdateResponse {
  id: string;

  createdAt: string;

  eventTypes: Array<
    'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
  >;

  isActive: boolean;

  url: string;
}

export interface WebhookListResponse {
  webhooks: Array<WebhookListResponse.Webhook>;
}

export namespace WebhookListResponse {
  export interface Webhook {
    id: string;

    createdAt: string;

    eventTypes: Array<
      'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
    >;

    isActive: boolean;

    url: string;
  }
}

export interface WebhookDeactivateResponse {
  success: true;
}

export interface WebhookListDeliveriesResponse {
  deliveries: Array<WebhookListDeliveriesResponse.Delivery>;
}

export namespace WebhookListDeliveriesResponse {
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
}

export interface WebhookTestResponse {
  statusCode: number;

  success: boolean;

  error?: string;
}

export interface WebhookCreateParams {
  eventTypes: Array<
    'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
  >;

  /**
   * HTTPS URL
   */
  url: string;
}

export interface WebhookUpdateParams {
  eventTypes?: Array<
    'tweet.new' | 'tweet.reply' | 'tweet.retweet' | 'tweet.quote' | 'follower.gained' | 'follower.lost'
  >;

  isActive?: boolean;

  url?: string;
}

export declare namespace Webhooks {
  export {
    type WebhookCreateResponse as WebhookCreateResponse,
    type WebhookUpdateResponse as WebhookUpdateResponse,
    type WebhookListResponse as WebhookListResponse,
    type WebhookDeactivateResponse as WebhookDeactivateResponse,
    type WebhookListDeliveriesResponse as WebhookListDeliveriesResponse,
    type WebhookTestResponse as WebhookTestResponse,
    type WebhookCreateParams as WebhookCreateParams,
    type WebhookUpdateParams as WebhookUpdateParams,
  };
}
