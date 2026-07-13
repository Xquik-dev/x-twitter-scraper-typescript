// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * X write actions (tweets, likes, follows, DMs)
 */
export class WriteActions extends APIResource {
  /**
   * Get write action status
   *
   * @example
   * ```ts
   * const writeAction = await client.x.writeActions.retrieve(
   *   'id',
   * );
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<WriteActionRetrieveResponse> {
    return this._client.get(path`/x/write-actions/${id}`, {
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }
}

export interface WriteActionRetrieveResponse {
  action: string;

  charged: boolean;

  chargedCredits: string;

  createdAt: string;

  media: WriteActionRetrieveResponse.Media;

  retryable: false;

  sendDispatched: boolean;

  status: 'success' | 'failed' | 'pending_confirmation';

  writeActionId: string;

  confirmationAttempts?: number;

  confirmationCheckedAt?: string;

  confirmationSource?: string | null;

  confirmedAt?: string;

  message?: string;

  messageId?: string;

  sendDispatchedAt?: string;

  targetId?: string | null;

  tweetId?: string;
}

export namespace WriteActionRetrieveResponse {
  export interface Media {
    count: number;

    credits: string;

    kind: 'none' | 'image' | 'video';

    totalBytes: string;
  }
}

export declare namespace WriteActions {
  export { type WriteActionRetrieveResponse as WriteActionRetrieveResponse };
}
