// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * API key management (session auth only)
 */
export class APIKeys extends APIResource {
  /**
   * Create API key
   *
   * @example
   * ```ts
   * const apiKey = await client.apiKeys.create({
   *   name: 'My API Key',
   * });
   * ```
   */
  create(body: APIKeyCreateParams, options?: RequestOptions): APIPromise<APIKeyCreateResponse> {
    return this._client.post('/api-keys', { body, ...options, __security: { apiKeyAuth: true } });
  }

  /**
   * List API keys
   *
   * @example
   * ```ts
   * const apiKeys = await client.apiKeys.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<APIKeyListResponse> {
    return this._client.get('/api-keys', { ...options, __security: { apiKeyAuth: true } });
  }

  /**
   * Revoke API key
   *
   * @example
   * ```ts
   * const response = await client.apiKeys.revoke('id');
   * ```
   */
  revoke(id: string, options?: RequestOptions): APIPromise<APIKeyRevokeResponse> {
    return this._client.delete(path`/api-keys/${id}`, { ...options, __security: { apiKeyAuth: true } });
  }
}

/**
 * API key metadata returned when listing keys.
 */
export interface APIKey {
  id: string;

  createdAt: string;

  isActive: boolean;

  name: string;

  prefix: string;

  lastUsedAt?: string;
}

export interface APIKeyCreateResponse {
  id: string;

  createdAt: string;

  fullKey: string;

  name: string;

  prefix: string;
}

export interface APIKeyListResponse {
  keys: Array<APIKey>;
}

export interface APIKeyRevokeResponse {
  success: true;
}

export interface APIKeyCreateParams {
  name?: string;
}

export declare namespace APIKeys {
  export {
    type APIKey as APIKey,
    type APIKeyCreateResponse as APIKeyCreateResponse,
    type APIKeyListResponse as APIKeyListResponse,
    type APIKeyRevokeResponse as APIKeyRevokeResponse,
    type APIKeyCreateParams as APIKeyCreateParams,
  };
}
