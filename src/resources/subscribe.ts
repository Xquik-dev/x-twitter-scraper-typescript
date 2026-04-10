// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Subscription, billing, and credits
 */
export class Subscribe extends APIResource {
  /**
   * Get checkout or billing URL
   */
  create(options?: RequestOptions): APIPromise<SubscribeCreateResponse> {
    return this._client.post('/subscribe', options);
  }
}

export interface SubscribeCreateResponse {
  url: string;

  message?: string;

  status?: 'checkout_created' | 'already_subscribed' | 'payment_issue';
}

export declare namespace Subscribe {
  export { type SubscribeCreateResponse as SubscribeCreateResponse };
}
