// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * Telegram bot service endpoints
 */
export class PlatformLinks extends APIResource {
  /**
   * Link a platform user to an Xquik account
   */
  create(body: PlatformLinkCreateParams, options?: RequestOptions): APIPromise<PlatformLinkCreateResponse> {
    return this._client.post('/bot/platform-links', { body, ...options });
  }

  /**
   * Unlink a platform user from an Xquik account
   */
  delete(body: PlatformLinkDeleteParams, options?: RequestOptions): APIPromise<PlatformLinkDeleteResponse> {
    return this._client.delete('/bot/platform-links', { body, ...options });
  }

  /**
   * Look up an Xquik user by platform identity
   */
  lookup(query: PlatformLinkLookupParams, options?: RequestOptions): APIPromise<PlatformLinkLookupResponse> {
    return this._client.get('/bot/platform-links/lookup', { query, ...options });
  }
}

export interface PlatformLinkCreateResponse {
  id: string;

  createdAt: string;

  platform: string;

  platformUserId: string;
}

export interface PlatformLinkDeleteResponse {
  success?: boolean;
}

export interface PlatformLinkLookupResponse {
  userId: string;
}

export interface PlatformLinkCreateParams {
  platform: 'telegram';

  platformUserId: string;
}

export interface PlatformLinkDeleteParams {
  platform: 'telegram';

  platformUserId: string;
}

export interface PlatformLinkLookupParams {
  platform: string;

  platformUserId: string;
}

export declare namespace PlatformLinks {
  export {
    type PlatformLinkCreateResponse as PlatformLinkCreateResponse,
    type PlatformLinkDeleteResponse as PlatformLinkDeleteResponse,
    type PlatformLinkLookupResponse as PlatformLinkLookupResponse,
    type PlatformLinkCreateParams as PlatformLinkCreateParams,
    type PlatformLinkDeleteParams as PlatformLinkDeleteParams,
    type PlatformLinkLookupParams as PlatformLinkLookupParams,
  };
}
