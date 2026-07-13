// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Account info and settings
 */
export class Account extends APIResource {
  /**
   * Get account info
   *
   * @example
   * ```ts
   * const account = await client.account.retrieve();
   * ```
   */
  retrieve(options?: RequestOptions): APIPromise<AccountRetrieveResponse> {
    return this._client.get('/account', options);
  }

  /**
   * Set linked X username
   *
   * @example
   * ```ts
   * const response = await client.account.setXUsername({
   *   username: 'elonmusk',
   * });
   * ```
   */
  setXUsername(
    body: AccountSetXUsernameParams,
    options?: RequestOptions,
  ): APIPromise<AccountSetXUsernameResponse> {
    return this._client.put('/account/x-identity', { body, ...options });
  }

  /**
   * Update account locale
   *
   * @example
   * ```ts
   * const response = await client.account.updateLocale({
   *   locale: 'en',
   * });
   * ```
   */
  updateLocale(
    body: AccountUpdateLocaleParams,
    options?: RequestOptions,
  ): APIPromise<AccountUpdateLocaleResponse> {
    return this._client.patch('/account', { body, ...options });
  }
}

export interface AccountRetrieveResponse {
  monitorBilling: AccountRetrieveResponse.MonitorBilling;

  /**
   * @deprecated Monitor slots are unlimited. Use monitorBilling.unlimitedSlots
   * instead.
   */
  monitorsAllowed: number;

  monitorsUsed: number;

  plan: 'active' | 'inactive';

  creditInfo?: AccountRetrieveResponse.CreditInfo;

  /**
   * Linked X username, omitted when no X account is connected.
   */
  xUsername?: string;
}

export namespace AccountRetrieveResponse {
  export interface MonitorBilling {
    /**
     * Estimated daily usage for currently active monitors.
     */
    activeDailyEstimate: string;

    /**
     * Usage charged each hour for currently active monitors.
     */
    activeHourlyBurn: string;

    /**
     * Estimated daily usage for 1 active instant monitor.
     */
    creditsPerActiveMonitorDay: string;

    /**
     * Hourly usage charged for 1 active instant monitor.
     */
    creditsPerActiveMonitorHour: string;

    /**
     * Webhook and event deliveries are included in monitor billing.
     */
    eventsIncluded: boolean;

    /**
     * Active monitors check every 1 second.
     */
    instantCheckIntervalSeconds: number;

    /**
     * Monitor slot count is unlimited.
     */
    unlimitedSlots: boolean;
  }

  export interface CreditInfo {
    /**
     * Dollar amount charged when automatic top-up runs.
     */
    autoTopupAmountDollars: number;

    autoTopupEnabled: boolean;

    /**
     * Bigint string threshold that triggers automatic top-up when enabled.
     */
    autoTopupThreshold: string;

    /**
     * Bigint string to preserve precision above Number.MAX_SAFE_INTEGER.
     */
    balance: string;

    /**
     * Total purchased usage as a bigint string.
     */
    lifetimePurchased: string;

    /**
     * Total consumed usage as a bigint string.
     */
    lifetimeUsed: string;
  }
}

export interface AccountSetXUsernameResponse {
  success: true;

  xUsername: string;
}

export interface AccountUpdateLocaleResponse {
  success: true;
}

export interface AccountSetXUsernameParams {
  /**
   * X username without @
   */
  username: string;
}

export interface AccountUpdateLocaleParams {
  locale: 'en' | 'tr' | 'es';
}

export declare namespace Account {
  export {
    type AccountRetrieveResponse as AccountRetrieveResponse,
    type AccountSetXUsernameResponse as AccountSetXUsernameResponse,
    type AccountUpdateLocaleResponse as AccountUpdateLocaleResponse,
    type AccountSetXUsernameParams as AccountSetXUsernameParams,
    type AccountUpdateLocaleParams as AccountUpdateLocaleParams,
  };
}
