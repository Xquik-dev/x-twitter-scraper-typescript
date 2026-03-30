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
   */
  create(body: APIKeyCreateParams, options?: RequestOptions): APIPromise<APIKeyCreateResponse> {
    return this._client.post('/api-keys', { body, ...options, __security: {} });
  }

  /**
   * List API keys
   */
  list(options?: RequestOptions): APIPromise<APIKeyListResponse> {
    return this._client.get('/api-keys', { ...options, __security: {} });
  }

  /**
   * Revoke API key
   */
  revoke(id: string, options?: RequestOptions): APIPromise<APIKeyRevokeResponse> {
    return this._client.delete(path`/api-keys/${id}`, { ...options, __security: {} });
  }
}

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
