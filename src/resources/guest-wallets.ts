// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as GuestWalletsAPI from './guest-wallets';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

/**
 * Accountless prepaid access for paid read endpoints
 */
export class GuestWallets extends APIResource {
  /**
   * Create a one-use Stripe-hosted checkout after the user explicitly confirms a
   * $10-$250 USD amount. This request creates no charge by itself. The user opens
   * checkout_url on Stripe. This endpoint returns the paid-read API key without
   * requiring an Xquik account, email, dashboard, or Xquik web page. An idempotent
   * replay returns the same key.
   *
   * @example
   * ```ts
   * const guestWallet = await client.guestWallets.create({
   *   amount_minor: 1000,
   *   currency: 'usd',
   *   'Idempotency-Key': 'e1cb97D8-dDF3-4AaA-ad0a-49E4A0d1CfAa',
   * });
   * ```
   */
  create(params: GuestWalletCreateParams, options?: RequestOptions): APIPromise<GuestWalletCreateResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post('/guest-wallets', {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
      __security: {},
    });
  }

  /**
   * Poll after Stripe payment. Use usable to decide whether paid reads can run. An
   * active wallet can remain usable while a top-up is pending. A new wallet becomes
   * usable only after verified webhook fulfillment. Send the guest key as
   * Authorization: Bearer.
   *
   * @example
   * ```ts
   * const response = await client.guestWallets.retrieveStatus();
   * ```
   */
  retrieveStatus(options?: RequestOptions): APIPromise<GuestWalletRetrieveStatusResponse> {
    return this._client.get('/guest-wallets/status', {
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * Create a one-use Stripe-hosted checkout for an existing paid-read guest key
   * after the user explicitly confirms a $10-$250 USD amount. The key remains the
   * same. This request creates no charge by itself and never redirects through an
   * Xquik web page.
   *
   * @example
   * ```ts
   * const response = await client.guestWallets.topup({
   *   amount_minor: 1000,
   *   currency: 'usd',
   *   'Idempotency-Key': 'e1cb97D8-dDF3-4AaA-ad0a-49E4A0d1CfAa',
   * });
   * ```
   */
  topup(params: GuestWalletTopupParams, options?: RequestOptions): APIPromise<GuestWalletTopupResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post('/guest-wallets/topups', {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }
}

/**
 * Confirmed USD amount for a guest wallet purchase.
 */
export interface GuestWalletAmount {
  /**
   * USD amount in cents. Accepted range is $10-$250.
   */
  amount_minor: number;

  currency: 'usd';
}

/**
 * Initial guest wallet response containing the one-time key.
 */
export interface GuestWalletCreateResponse {
  account_required: false;

  /**
   * Confirmed USD amount for a guest wallet purchase.
   */
  amount: GuestWalletAmount;

  /**
   * Paid-read bearer credential returned only by initial creation. Store it as a
   * secret. Never place it in a URL or log.
   */
  api_key: string;

  authorization: GuestWalletCreateResponse.Authorization;

  /**
   * Raw Stripe-hosted checkout URL for user interaction.
   */
  checkout_url: string;

  credential_notice: 'Store api_key and the Idempotency-Key securely before sharing checkout_url. No email recovery is available.';

  /**
   * Usage granted after verified payment.
   */
  credits: string;

  /**
   * Time when the pending checkout expires.
   */
  expires_at: string;

  instructions: 'Give checkout_url to the user. They must complete payment on Stripe. Never submit payment for them. After payment, poll status_url every poll_after_seconds until latest_purchase.status is no longer pending.';

  /**
   * Wait at least this long before polling status_url.
   */
  poll_after_seconds: 2;

  purchase_id: string;

  requires_user_interaction: true;

  status: 'creating' | 'pending' | 'paid' | 'expired' | 'failed' | 'refunded' | 'disputed';

  status_url: 'https://xquik.com/api/v1/guest-wallets/status';

  wallet_id: string;
}

export namespace GuestWalletCreateResponse {
  export interface Authorization {
    header: 'Authorization';

    scheme: 'Bearer';
  }
}

/**
 * Current balance, usability, and latest guest purchase state.
 */
export interface GuestWalletRetrieveStatusResponse {
  balance: string;

  /**
   * Latest guest wallet purchase fulfillment state.
   */
  latest_purchase: GuestWalletRetrieveStatusResponse.LatestPurchase | null;

  /**
   * Polling delay while payment is pending. Null means stop.
   */
  poll_after_seconds: 2 | null;

  scope: 'paid_reads';

  /**
   * Combined wallet and pending-checkout state. A pending top-up can coexist with
   * usable true. Terminal expired or failed states require a new guest wallet.
   */
  status: 'active' | 'pending' | 'expired' | 'failed' | 'frozen' | 'closed';

  /**
   * Top-up action when usable and no checkout is pending.
   */
  top_up: GuestWalletRetrieveStatusResponse.TopUp | null;

  /**
   * Authoritative paid-read readiness. Use instead of status.
   */
  usable: boolean;

  wallet_id: string;
}

export namespace GuestWalletRetrieveStatusResponse {
  /**
   * Latest guest wallet purchase fulfillment state.
   */
  export interface LatestPurchase {
    /**
     * Confirmed USD amount for a guest wallet purchase.
     */
    amount: GuestWalletsAPI.GuestWalletAmount;

    /**
     * Present only while the purchase is pending.
     */
    checkout_url: string | null;

    credits: string;

    expires_at: string;

    purchase_id: string;

    status: 'creating' | 'pending' | 'paid' | 'expired' | 'failed' | 'refunded' | 'disputed';
  }

  /**
   * Top-up action when usable and no checkout is pending.
   */
  export interface TopUp {
    method: 'POST';

    path: '/api/v1/guest-wallets/topups';
  }
}

/**
 * Pending Stripe checkout and guest wallet purchase details.
 */
export interface GuestWalletTopupResponse {
  account_required: false;

  /**
   * Confirmed USD amount for a guest wallet purchase.
   */
  amount: GuestWalletAmount;

  /**
   * Raw Stripe-hosted checkout URL for user interaction.
   */
  checkout_url: string;

  /**
   * Usage granted after verified payment.
   */
  credits: string;

  /**
   * Time when the pending checkout expires.
   */
  expires_at: string;

  instructions: 'Give checkout_url to the user. They must complete payment on Stripe. Never submit payment for them. After payment, poll status_url every poll_after_seconds until latest_purchase.status is no longer pending.';

  /**
   * Wait at least this long before polling status_url.
   */
  poll_after_seconds: 2;

  purchase_id: string;

  requires_user_interaction: true;

  status: 'creating' | 'pending' | 'paid' | 'expired' | 'failed' | 'refunded' | 'disputed';

  status_url: 'https://xquik.com/api/v1/guest-wallets/status';

  wallet_id: string;

  /**
   * Paid-read bearer credential returned only by initial creation. Store it as a
   * secret. Never place it in a URL or log.
   */
  api_key?: string;

  authorization?: GuestWalletTopupResponse.Authorization;

  credential_notice?: 'Store api_key and the Idempotency-Key securely before sharing checkout_url. No email recovery is available.';
}

export namespace GuestWalletTopupResponse {
  export interface Authorization {
    header: 'Authorization';

    scheme: 'Bearer';
  }
}

export interface GuestWalletCreateParams {
  /**
   * Body param: Confirmed USD amount in cents.
   */
  amount_minor: number;

  /**
   * Body param
   */
  currency: 'usd';

  /**
   * Header param: Generate a cryptographically random UUID v4. Reuse it only to
   * retry the same wallet and amount request. Initial wallet creation can recover
   * the API key from this value, so store it as a secret and never log it.
   */
  'Idempotency-Key': string;
}

export interface GuestWalletTopupParams {
  /**
   * Body param: Confirmed USD amount in cents.
   */
  amount_minor: number;

  /**
   * Body param
   */
  currency: 'usd';

  /**
   * Header param: Generate a cryptographically random UUID v4. Reuse it only to
   * retry the same wallet and amount request. Initial wallet creation can recover
   * the API key from this value, so store it as a secret and never log it.
   */
  'Idempotency-Key': string;
}

export declare namespace GuestWallets {
  export {
    type GuestWalletAmount as GuestWalletAmount,
    type GuestWalletCreateResponse as GuestWalletCreateResponse,
    type GuestWalletRetrieveStatusResponse as GuestWalletRetrieveStatusResponse,
    type GuestWalletTopupResponse as GuestWalletTopupResponse,
    type GuestWalletCreateParams as GuestWalletCreateParams,
    type GuestWalletTopupParams as GuestWalletTopupParams,
  };
}
