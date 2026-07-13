// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

/**
 * Subscription, billing, and credits
 */
export class Credits extends APIResource {
  /**
   * Redirect to an active top-up payment page
   *
   * @example
   * ```ts
   * await client.credits.redirectTopupCheckout({
   *   session_id: 'session_id',
   * });
   * ```
   */
  redirectTopupCheckout(
    query: CreditRedirectTopupCheckoutParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.get('/credits/topup/redirect', {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
      __security: {},
    });
  }

  /**
   * Get credits balance
   *
   * @example
   * ```ts
   * const response = await client.credits.retrieveBalance();
   * ```
   */
  retrieveBalance(options?: RequestOptions): APIPromise<CreditRetrieveBalanceResponse> {
    return this._client.get('/credits', options);
  }

  /**
   * Get top-up billing status
   *
   * @example
   * ```ts
   * const response = await client.credits.retrieveTopupStatus({
   *   session_id: 'session_id',
   * });
   * ```
   */
  retrieveTopupStatus(
    query: CreditRetrieveTopupStatusParams,
    options?: RequestOptions,
  ): APIPromise<CreditRetrieveTopupStatusResponse> {
    return this._client.get('/credits/topup/status', { query, ...options });
  }

  /**
   * Create a Stripe Checkout session only after the user confirms. The request never
   * completes payment or adds credits by itself.
   *
   * @example
   * ```ts
   * const response = await client.credits.topupBalance({
   *   dollars: 10,
   * });
   * ```
   */
  topupBalance(
    body: CreditTopupBalanceParams,
    options?: RequestOptions,
  ): APIPromise<CreditTopupBalanceResponse> {
    return this._client.post('/credits/topup', { body, ...options });
  }
}

export interface CreditRetrieveBalanceResponse {
  /**
   * Configured dollar amount for each automatic top-up.
   */
  auto_topup_amount_dollars: number;

  auto_topup_enabled: boolean;

  /**
   * Credit balance threshold that triggers automatic top-up when enabled,
   * represented as a bigint string.
   */
  auto_topup_threshold: string;

  /**
   * Current credit balance as a bigint string to preserve precision above
   * Number.MAX_SAFE_INTEGER.
   */
  balance: string;

  /**
   * Lifetime purchased credits as a bigint string.
   */
  lifetime_purchased: string;

  /**
   * Lifetime consumed credits as a bigint string.
   */
  lifetime_used: string;
}

export interface CreditRetrieveTopupStatusResponse {
  status: 'paid' | 'processing' | 'failed' | 'expired';

  /**
   * Dollar amount requested for the top-up.
   */
  amount_dollars?: number | null;

  /**
   * Bigint string credit amount granted or pending.
   */
  credits?: string;
}

export interface CreditTopupBalanceResponse {
  /**
   * Stable first-party Xquik redirect URL for the active Stripe Checkout session.
   */
  redirect_url: string;

  /**
   * Same stable first-party Xquik redirect URL as redirect_url. The response never
   * exposes a raw Stripe Checkout URL.
   */
  url: string;
}

export interface CreditRedirectTopupCheckoutParams {
  /**
   * Billing session ID returned by the top-up billing flow.
   */
  session_id: string;
}

export interface CreditRetrieveTopupStatusParams {
  /**
   * Billing session ID returned by the top-up billing flow.
   */
  session_id: string;
}

export interface CreditTopupBalanceParams {
  /**
   * Amount to top up in US dollars. Minimum 10.
   */
  dollars: number;

  /**
   * Optional checkout locale. Defaults to en.
   */
  locale?: string;
}

export declare namespace Credits {
  export {
    type CreditRetrieveBalanceResponse as CreditRetrieveBalanceResponse,
    type CreditRetrieveTopupStatusResponse as CreditRetrieveTopupStatusResponse,
    type CreditTopupBalanceResponse as CreditTopupBalanceResponse,
    type CreditRedirectTopupCheckoutParams as CreditRedirectTopupCheckoutParams,
    type CreditRetrieveTopupStatusParams as CreditRetrieveTopupStatusParams,
    type CreditTopupBalanceParams as CreditTopupBalanceParams,
  };
}
