// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import * as PostsAPI from './monitors/posts';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Webhook endpoint management and delivery
 */
export class Webhooks extends APIResource {
  /**
   * Registers an endpoint for signed event deliveries.
   *
   * @example
   * ```ts
   * const webhook = await client.webhooks.create({
   *   eventTypes: ['tweet.new', 'tweet.reply'],
   *   url: 'https://example.com/webhook',
   * });
   * ```
   */
  create(body: WebhookCreateParams, options?: RequestOptions): APIPromise<WebhookCreateResponse> {
    return this._client.post('/webhooks', { body, ...options });
  }

  /**
   * Updates an endpoint, event selection, or delivery settings.
   *
   * @example
   * ```ts
   * const webhook = await client.webhooks.update('id', {
   *   eventTypes: ['tweet.new'],
   *   isActive: true,
   *   url: 'https://example.com/webhook',
   * });
   * ```
   */
  update(id: string, body: WebhookUpdateParams, options?: RequestOptions): APIPromise<Webhook> {
    return this._client.patch(path`/webhooks/${id}`, { body, ...options });
  }

  /**
   * Returns configured webhook endpoints and delivery states.
   *
   * @example
   * ```ts
   * const webhooks = await client.webhooks.list();
   * ```
   */
  list(
    query: WebhookListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<WebhookListResponse> {
    return this._client.get('/webhooks', { query, ...options });
  }

  /**
   * Returns a t.me link to @XquikBot that connects a Telegram chat to the account's
   * monitor events. Opening it & pressing Start connects the chat, which then gets
   * each event as a message. The link works once, within 15 minutes. The chat
   * appears in the webhook list with the URL telegram:<chat ID>, with deliveries,
   * retries & resume as any webhook. In the chat, /stop pauses its alerts. It costs
   * no credits.
   *
   * @example
   * ```ts
   * const response = await client.webhooks.createTelegramLink({
   *   eventTypes: ['tweet.new', 'tweet.reply'],
   * });
   * ```
   */
  createTelegramLink(
    body: WebhookCreateTelegramLinkParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<WebhookCreateTelegramLinkResponse> {
    return this._client.post('/webhooks/telegram', { body, ...options });
  }

  /**
   * Stops future deliveries to the selected webhook.
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
   * Returns delivery attempts and response outcomes, newest first.
   *
   * @example
   * ```ts
   * const response = await client.webhooks.listDeliveries('id');
   * ```
   */
  listDeliveries(
    id: string,
    query: WebhookListDeliveriesParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<WebhookListDeliveriesResponse> {
    return this._client.get(path`/webhooks/${id}/deliveries`, { query, ...options });
  }

  /**
   * Tests the endpoint before resuming a manually paused webhook.
   *
   * @example
   * ```ts
   * const response = await client.webhooks.resume('id');
   * ```
   */
  resume(id: string, options?: RequestOptions): APIPromise<WebhookResumeResponse> {
    return this._client.post(path`/webhooks/${id}/resume`, options);
  }

  /**
   * Sends a signed test event to the configured endpoint.
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

  /**
   * Whole number from 0.
   */
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

  /**
   * Consecutive failed delivery attempts since the last success.
   */
  consecutiveFailures: number;

  createdAt: string;

  /**
   * Endpoint delivery state. paused means the user paused delivery. needs_attention
   * marks repeated failures. Delivery attempts continue.
   */
  deliveryStatus: 'active' | 'paused' | 'needs_attention';

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType | PostsAPI.PostEventType>;

  /**
   * Maximum reported failures before needs_attention. It does not pause delivery.
   */
  failureHardCap: number;

  isActive: boolean;

  url: string;
}

export interface WebhookCreateResponse {
  id: string;

  createdAt: string;

  /**
   * Array of event types to subscribe to.
   */
  eventTypes: Array<Shared.EventType | PostsAPI.PostEventType>;

  /**
   * Plaintext HMAC signing secret returned only at creation.
   */
  secret: string;

  url: string;

  /**
   * Fields the request sent that this route does not read, in the order sent. They
   * changed nothing. The answer leaves this out when the route read every field.
   */
  ignoredFields?: Array<string>;
}

export interface WebhookListResponse {
  hasMore: boolean;

  webhooks: Array<Webhook>;

  nextCursor?: string;
}

export interface WebhookCreateTelegramLinkResponse {
  /**
   * When the link stops working, 15 minutes on.
   */
  expiresAt: string;

  /**
   * Opens @XquikBot with the link's code.
   */
  url: string;
}

export interface WebhookDeactivateResponse {
  success: true;
}

export interface WebhookListDeliveriesResponse {
  deliveries: Array<Delivery>;

  hasMore: boolean;

  nextCursor?: string;
}

export interface WebhookResumeResponse {
  statusCode: number;

  success: boolean;

  /**
   * Webhook endpoint registered to receive event deliveries.
   */
  webhook: Webhook;
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
  eventTypes: Array<Shared.EventType | PostsAPI.PostEventType>;

  /**
   * HTTPS URL. A Discord channel webhook URL gets each event as a Discord message, &
   * a Slack incoming webhook URL as a Slack message. To deliver to Telegram, use
   * POST /webhooks/telegram instead.
   */
  url: string;
}

export interface WebhookUpdateParams {
  /**
   * Array of event types to subscribe to.
   */
  eventTypes?: Array<Shared.EventType | PostsAPI.PostEventType>;

  isActive?: boolean;

  url?: string;
}

export interface WebhookListParams {
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

export interface WebhookCreateTelegramLinkParams {
  /**
   * Array of event types to subscribe to.
   */
  eventTypes?: Array<Shared.EventType>;
}

export interface WebhookListDeliveriesParams {
  /**
   * Previous nextCursor. The after alias also works. Offset pagination is not
   * supported.
   */
  cursor?: string;

  /**
   * Maximum deliveries per page: 1 to 100, default 100. Pass nextCursor as cursor
   * for the next page.
   */
  limit?: number;
}

export declare namespace Webhooks {
  export {
    type Delivery as Delivery,
    type Webhook as Webhook,
    type WebhookCreateResponse as WebhookCreateResponse,
    type WebhookListResponse as WebhookListResponse,
    type WebhookCreateTelegramLinkResponse as WebhookCreateTelegramLinkResponse,
    type WebhookDeactivateResponse as WebhookDeactivateResponse,
    type WebhookListDeliveriesResponse as WebhookListDeliveriesResponse,
    type WebhookResumeResponse as WebhookResumeResponse,
    type WebhookTestResponse as WebhookTestResponse,
    type WebhookCreateParams as WebhookCreateParams,
    type WebhookUpdateParams as WebhookUpdateParams,
    type WebhookListParams as WebhookListParams,
    type WebhookCreateTelegramLinkParams as WebhookCreateTelegramLinkParams,
    type WebhookListDeliveriesParams as WebhookListDeliveriesParams,
  };
}
