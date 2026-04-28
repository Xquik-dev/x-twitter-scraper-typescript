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
    return this._client.post('/x/accounts', { body, ...options });
  }

  /**
   * Get X account details
   *
   * @example
   * ```ts
   * const xAccountDetail = await client.x.accounts.retrieve(
   *   'id',
   * );
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<XAccountDetail> {
    return this._client.get(path`/x/accounts/${id}`, options);
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
    return this._client.get('/x/accounts', options);
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
    return this._client.delete(path`/x/accounts/${id}`, options);
  }

  /**
   * Clears loginFailedAt and loginFailureReason for all accounts with transient or
   * automated failure reasons, making them eligible for retry on next use.
   *
   * @example
   * ```ts
   * const response = await client.x.accounts.bulkRetry();
   * ```
   */
  bulkRetry(options?: RequestOptions): APIPromise<AccountBulkRetryResponse> {
    return this._client.post('/x/accounts/bulk-retry', options);
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
    return this._client.post(path`/x/accounts/${id}/reauth`, { body, ...options });
  }
}

/**
 * Linked X account summary with username and connection status.
 */
export interface XAccount {
  id: string;

  createdAt: string;

  /**
   * Derived login/cookie health. `healthy` = cookies valid. `needsReauth` = user
   * must submit fresh credentials. `locked` = X locked the account; unlock on x.com
   * first. `suspended` = X banned the account. `recovering` = past cooldown, will
   * auto-retry on next use. `temporaryIssue` = transient backend problem; retry
   * shortly.
   */
  health: 'healthy' | 'locked' | 'needsReauth' | 'recovering' | 'suspended' | 'temporaryIssue';

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

  health: 'healthy' | 'locked' | 'needsReauth' | 'recovering' | 'suspended' | 'temporaryIssue';

  status: string;

  xUserId: string;

  xUsername: string;

  cookiesObtainedAt?: string;

  proxyCountry?: string;

  updatedAt?: string;
}

/**
 * Sanitized X account summary returned by connect and reauth. Includes an optional
 * `loginCountry` field surfaced only when the declared proxy region had no Driver
 * capacity and the login fell back to a single US consumer device for this
 * one-time action. Future activity continues to use the selected `proxy_country`;
 * the field is omitted on normal logins.
 */
export interface AccountCreateResponse {
  id: string;

  createdAt: string;

  health: 'healthy' | 'locked' | 'needsReauth' | 'recovering' | 'suspended' | 'temporaryIssue';

  status: string;

  xUserId: string;

  xUsername: string;

  /**
   * ISO-3166-1 alpha-2 country code of the Driver consumer device used for this
   * login. Present only when the US fallback was triggered because Driver had no
   * capacity in the declared region. Omitted otherwise.
   */
  loginCountry?: string;
}

export interface AccountListResponse {
  accounts: Array<XAccount>;
}

export interface AccountDeleteResponse {
  success: true;
}

export interface AccountBulkRetryResponse {
  /**
   * Number of accounts cleared
   */
  cleared: number;
}

/**
 * Sanitized X account summary returned by connect and reauth. Includes an optional
 * `loginCountry` field surfaced only when the declared proxy region had no Driver
 * capacity and the login fell back to a single US consumer device for this
 * one-time action. Future activity continues to use the selected `proxy_country`;
 * the field is omitted on normal logins.
 */
export interface AccountReauthResponse {
  id: string;

  createdAt: string;

  health: 'healthy' | 'locked' | 'needsReauth' | 'recovering' | 'suspended' | 'temporaryIssue';

  status: string;

  xUserId: string;

  xUsername: string;

  /**
   * ISO-3166-1 alpha-2 country code of the Driver consumer device used for this
   * login. Present only when the US fallback was triggered because Driver had no
   * capacity in the declared region. Omitted otherwise.
   */
  loginCountry?: string;
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
   * Email for the X account (updates stored email)
   */
  email?: string;

  /**
   * Two-letter country code for login proxy region
   */
  proxy_country?: string;

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
    type AccountListResponse as AccountListResponse,
    type AccountDeleteResponse as AccountDeleteResponse,
    type AccountBulkRetryResponse as AccountBulkRetryResponse,
    type AccountReauthResponse as AccountReauthResponse,
    type AccountCreateParams as AccountCreateParams,
    type AccountReauthParams as AccountReauthParams,
  };
}
