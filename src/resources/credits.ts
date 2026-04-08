// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Subscription & billing
 */
export class Credits extends APIResource {
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
   * Top up credits balance
   *
   * @example
   * ```ts
   * const response = await client.credits.topupBalance({
   *   amount: 10000,
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
  auto_topup_enabled: boolean;

  balance: number;

  lifetime_purchased: number;

  lifetime_used: number;
}

export interface CreditTopupBalanceResponse {
  success: true;
}

export interface CreditTopupBalanceParams {
  /**
   * Amount to top up in credits
   */
  amount: number;
}

export declare namespace Credits {
  export {
    type CreditRetrieveBalanceResponse as CreditRetrieveBalanceResponse,
    type CreditTopupBalanceResponse as CreditTopupBalanceResponse,
    type CreditTopupBalanceParams as CreditTopupBalanceParams,
  };
}
