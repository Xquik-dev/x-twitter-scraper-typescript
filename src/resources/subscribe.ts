// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Subscription, billing, and credits
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

  /**
   * Currency the checkout charges. Only a checkout_created answer has it.
   */
  chargedCurrency?: Shared.Currency;
}

export interface SubscribeCreateParams {
  /**
   * Currency to pay in, USD by default. Lowercase codes work too. Each renewal
   * charges the same amount before tax. chargedCurrency shows the currency
   * charged.
   */
  currency?: Shared.Currency;

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
