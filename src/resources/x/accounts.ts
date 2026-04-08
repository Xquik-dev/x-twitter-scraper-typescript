// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Connected X account management
 */
export class Accounts extends APIResource {
  /**
   * Connect X account
   *
   * @example
   * ```ts
   * const account = await client.x.accounts.create({
   *   email: 'user@example.com',
   *   password: 's3cur3Pa$$w0rd',
   *   username: 'elonmusk',
   * });
   * ```
   */
  create(body: AccountCreateParams, options?: RequestOptions): APIPromise<AccountCreateResponse> {
    return this._client.post('/x/accounts', { body, ...options, __security: { apiKeyAuth: true } });
  }

  /**
   * Get X account details
   *
   * @example
   * ```ts
   * const account = await client.x.accounts.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<AccountRetrieveResponse> {
    return this._client.get(path`/x/accounts/${id}`, { ...options, __security: { apiKeyAuth: true } });
  }

  /**
   * List connected X accounts
   *
   * @example
   * ```ts
   * const accounts = await client.x.accounts.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<AccountListResponse> {
    return this._client.get('/x/accounts', { ...options, __security: { apiKeyAuth: true } });
  }

  /**
   * Disconnect X account
   *
   * @example
   * ```ts
   * const account = await client.x.accounts.delete('id');
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<AccountDeleteResponse> {
    return this._client.delete(path`/x/accounts/${id}`, { ...options, __security: { apiKeyAuth: true } });
  }

  /**
   * Re-authenticate X account
   *
   * @example
   * ```ts
   * const response = await client.x.accounts.reauth('id', {
   *   password: 'password_value',
   *   totp_secret: 'totp_secret_value',
   * });
   * ```
   */
  reauth(id: string, body: AccountReauthParams, options?: RequestOptions): APIPromise<AccountReauthResponse> {
    return this._client.post(path`/x/accounts/${id}/reauth`, {
      body,
      ...options,
      __security: { apiKeyAuth: true },
    });
  }
}

/**
 * Linked X account summary with username and connection status.
 */
export interface XAccount {
  id: string;

  createdAt: string;

  status: string;

  xUserId: string;

  xUsername: string;
}

/**
 * Full X account details including proxy, cookies, and update timestamp.
 */
export interface XAccountDetail {
  id: string;

  createdAt: string;

  status: string;

  xUserId: string;

  xUsername: string;

  cookiesObtainedAt?: string;

  proxyCountry?: string;

  updatedAt?: string;
}

export interface AccountCreateResponse {
  id: string;

  status: string;

  xUserId: string;

  xUsername: string;
}

/**
 * Full X account details including proxy, cookies, and update timestamp.
 */
export interface AccountRetrieveResponse {
  id: string;

  createdAt: string;

  status: string;

  xUserId: string;

  xUsername: string;

  cookiesObtainedAt?: string;

  proxyCountry?: string;

  updatedAt?: string;
}

export interface AccountListResponse {
  accounts: Array<AccountListResponse.Account>;
}

export namespace AccountListResponse {
  /**
   * Linked X account summary with username and connection status.
   */
  export interface Account {
    id: string;

    createdAt: string;

    status: string;

    xUserId: string;

    xUsername: string;
  }
}

export interface AccountDeleteResponse {
  success: true;
}

export interface AccountReauthResponse {
  id: string;

  status: string;

  xUsername: string;
}

export interface AccountCreateParams {
  /**
   * Account email
   */
  email: string;

  /**
   * Account password
   */
  password: string;

  /**
   * X username
   */
  username: string;

  /**
   * Proxy country code
   */
  proxy_country?: string;

  /**
   * TOTP secret for 2FA
   */
  totp_secret?: string;
}

export interface AccountReauthParams {
  /**
   * Updated account password
   */
  password: string;

  /**
   * TOTP secret for 2FA re-authentication
   */
  totp_secret?: string;
}

export declare namespace Accounts {
  export {
    type XAccount as XAccount,
    type XAccountDetail as XAccountDetail,
    type AccountCreateResponse as AccountCreateResponse,
    type AccountRetrieveResponse as AccountRetrieveResponse,
    type AccountListResponse as AccountListResponse,
    type AccountDeleteResponse as AccountDeleteResponse,
    type AccountReauthResponse as AccountReauthResponse,
    type AccountCreateParams as AccountCreateParams,
    type AccountReauthParams as AccountReauthParams,
  };
}
