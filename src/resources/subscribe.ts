// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Subscription, billing, and usage balance
 */
export class Subscribe extends APIResource {
  /**
   * Create a subscription checkout or billing-management URL only after the user
   * confirms. The request never completes payment by itself.
   *
   * @example
   * ```ts
   * const subscribe = await client.subscribe.create({
   *   tier: 'pro',
   * });
   * ```
   */
  create(
    body: SubscribeCreateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SubscribeCreateResponse> {
    return this._client.post('/subscribe', { body, ...options });
  }
}

export interface SubscribeCreateResponse {
  message: string;

  status: 'checkout_created' | 'already_subscribed' | 'payment_issue';

  url: string;
}

export interface SubscribeCreateParams {
  /**
   * Subscription tier to pre-select.
   */
  tier?: 'starter' | 'pro' | 'business';
}

export declare namespace Subscribe {
  export {
    type SubscribeCreateResponse as SubscribeCreateResponse,
    type SubscribeCreateParams as SubscribeCreateParams,
  };
}
