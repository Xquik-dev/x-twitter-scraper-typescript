// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Account info and settings
 */
export class Account extends APIResource {
  /**
   * Returns plan, credit, monitoring, and account settings for the authenticated
   * user.
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
   * Links an X username to the authenticated Xquik account.
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
   * Changes the locale used for account responses and notifications.
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

  /**
   * Subscription state without billing provider identifiers.
   */
  subscription: AccountRetrieveResponse.Subscription;

  creditInfo?: AccountRetrieveResponse.CreditInfo;

  /**
   * Linked X username, omitted when no X account is connected.
   */
  xUsername?: string;
}

export namespace AccountRetrieveResponse {
  export interface MonitorBilling {
    /**
     * Daily credits for currently active monitors.
     */
    activeDailyEstimate: string;

    /**
     * Credits charged each hour for currently active monitors.
     */
    activeHourlyBurn: string;

    /**
     * Daily credits charged for 1 active monitor.
     */
    creditsPerActiveMonitorDay: '720';

    /**
     * Hourly credits charged for 1 active monitor. It is a monitor's only charge.
     */
    creditsPerActiveMonitorHour: '30';

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

  /**
   * Subscription state without billing provider identifiers.
   */
  export interface Subscription {
    status: 'none' | 'active' | 'past_due' | 'canceling' | 'incomplete';

    /**
     * Renewal date, or the end date when canceling.
     */
    currentPeriodEnd?: string;

    currentPeriodStart?: string;

    tier?: 'starter' | 'pro' | 'business';
  }

  export interface CreditInfo {
    /**
     * Dollar amount charged when automatic top-up runs.
     */
    autoTopupAmountDollars: number;

    autoTopupEnabled: boolean;

    /**
     * True when 3 declined charges in a row on one card stopped automatic top-up while
     * it stays enabled. A paid top-up, a paid plan renewal, or the next automatic
     * top-up on a new card clears it.
     */
    autoTopupStopped: boolean;

    /**
     * Bigint string threshold that triggers automatic top-up when enabled.
     */
    autoTopupThreshold: '10000' | '50000' | '100000' | '250000';

    /**
     * Bigint string to preserve precision above Number.MAX_SAFE_INTEGER.
     */
    balance: string;

    /**
     * Total purchased credits as a bigint string.
     */
    lifetimePurchased: string;

    /**
     * Total consumed credits as a bigint string.
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
