// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as PlatformLinksAPI from './platform-links';
import {
  PlatformLinkCreateParams,
  PlatformLinkCreateResponse,
  PlatformLinkDeleteParams,
  PlatformLinkDeleteResponse,
  PlatformLinkLookupParams,
  PlatformLinkLookupResponse,
  PlatformLinks,
} from './platform-links';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * Telegram bot service endpoints
 */
export class Bot extends APIResource {
  platformLinks: PlatformLinksAPI.PlatformLinks = new PlatformLinksAPI.PlatformLinks(this._client);

  /**
   * Track bot token usage
   */
  trackUsage(body: BotTrackUsageParams, options?: RequestOptions): APIPromise<BotTrackUsageResponse> {
    return this._client.post('/bot/usage', { body, ...options });
  }
}

export interface BotTrackUsageResponse {
  success?: boolean;
}

export interface BotTrackUsageParams {
  inputTokens: number;

  outputTokens: number;

  platformUserId: string;
}

Bot.PlatformLinks = PlatformLinks;

export declare namespace Bot {
  export {
    type BotTrackUsageResponse as BotTrackUsageResponse,
    type BotTrackUsageParams as BotTrackUsageParams,
  };

  export {
    PlatformLinks as PlatformLinks,
    type PlatformLinkCreateResponse as PlatformLinkCreateResponse,
    type PlatformLinkDeleteResponse as PlatformLinkDeleteResponse,
    type PlatformLinkLookupResponse as PlatformLinkLookupResponse,
    type PlatformLinkCreateParams as PlatformLinkCreateParams,
    type PlatformLinkDeleteParams as PlatformLinkDeleteParams,
    type PlatformLinkLookupParams as PlatformLinkLookupParams,
  };
}
