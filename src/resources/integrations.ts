// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Push notification integrations (Telegram)
 */
export class Integrations extends APIResource {
  /**
   * Create integration
   */
  create(body: IntegrationCreateParams, options?: RequestOptions): APIPromise<Integration> {
    return this._client.post('/integrations', { body, ...options });
  }

  /**
   * Get integration details
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<Integration> {
    return this._client.get(path`/integrations/${id}`, options);
  }

  /**
   * Update integration
   */
  update(id: string, body: IntegrationUpdateParams, options?: RequestOptions): APIPromise<Integration> {
    return this._client.patch(path`/integrations/${id}`, { body, ...options });
  }

  /**
   * List integrations
   */
  list(options?: RequestOptions): APIPromise<IntegrationListResponse> {
    return this._client.get('/integrations', options);
  }

  /**
   * Delete integration
   */
  delete(id: string, options?: RequestOptions): APIPromise<IntegrationDeleteResponse> {
    return this._client.delete(path`/integrations/${id}`, options);
  }

  /**
   * List integration delivery history
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
   */
  sendTest(id: string, options?: RequestOptions): APIPromise<IntegrationSendTestResponse> {
    return this._client.post(path`/integrations/${id}/test`, options);
  }
}

export interface Integration {
  id: string;

  config: { [key: string]: unknown };

  createdAt: string;

  eventTypes: Array<Shared.EventType>;

  isActive: boolean;

  name: string;

  type: 'telegram';

  filters?: { [key: string]: unknown };

  messageTemplate?: string;

  scopeAllMonitors?: boolean;

  silentPush?: boolean;
}

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

export interface IntegrationListResponse {
  integrations: Array<Integration>;
}

export interface IntegrationDeleteResponse {
  success: true;
}

export interface IntegrationListDeliveriesResponse {
  deliveries: Array<IntegrationDelivery>;
}

export interface IntegrationSendTestResponse {
  success: true;
}

export interface IntegrationCreateParams {
  /**
   * Integration config (e.g. Telegram chatId)
   */
  config: IntegrationCreateParams.Config;

  eventTypes: Array<Shared.EventType>;

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
  eventTypes?: Array<Shared.EventType>;

  filters?: { [key: string]: unknown };

  isActive?: boolean;

  messageTemplate?: { [key: string]: unknown };

  name?: string;

  scopeAllMonitors?: boolean;

  silentPush?: boolean;
}

export interface IntegrationListDeliveriesParams {
  limit?: number;
}

export declare namespace Integrations {
  export {
    type Integration as Integration,
    type IntegrationDelivery as IntegrationDelivery,
    type IntegrationListResponse as IntegrationListResponse,
    type IntegrationDeleteResponse as IntegrationDeleteResponse,
    type IntegrationListDeliveriesResponse as IntegrationListDeliveriesResponse,
    type IntegrationSendTestResponse as IntegrationSendTestResponse,
    type IntegrationCreateParams as IntegrationCreateParams,
    type IntegrationUpdateParams as IntegrationUpdateParams,
    type IntegrationListDeliveriesParams as IntegrationListDeliveriesParams,
  };
}
