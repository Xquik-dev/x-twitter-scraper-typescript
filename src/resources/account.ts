// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Account info & settings
 */
export class Account extends APIResource {
  /**
   * Get account info
   */
  retrieve(options?: RequestOptions): APIPromise<AccountRetrieveResponse> {
    return this._client.get('/account', { ...options, __security: { apiKeyAuth: true } });
  }

  /**
   * Set linked X username
   */
  setXUsername(
    body: AccountSetXUsernameParams,
    options?: RequestOptions,
  ): APIPromise<AccountSetXUsernameResponse> {
    return this._client.put('/account/x-identity', { body, ...options });
  }

  /**
   * Update account locale
   */
  updateLocale(
    body: AccountUpdateLocaleParams,
    options?: RequestOptions,
  ): APIPromise<AccountUpdateLocaleResponse> {
    return this._client.patch('/account', { body, ...options, __security: { apiKeyAuth: true } });
  }
}

export interface AccountRetrieveResponse {
  monitorsAllowed: number;

  monitorsUsed: number;

  plan: 'active' | 'inactive';

  currentPeriod?: AccountRetrieveResponse.CurrentPeriod;
}

export namespace AccountRetrieveResponse {
  export interface CurrentPeriod {
    end: string;

    start: string;

    usagePercent: number;
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
