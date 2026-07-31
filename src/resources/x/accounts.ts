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
   *   email: 'account@example.invalid',
   *   password: '<ACCOUNT_PASSWORD>',
   *   totp_secret: '<TOTP_SECRET>',
   *   username: 'your_x_username',
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
   *   password: '<ACCOUNT_PASSWORD>',
   *   email: 'account@example.invalid',
   *   totp_secret: '<TOTP_SECRET>',
   * });
   * ```
   */
  reauth(id: string, body: AccountReauthParams, options?: RequestOptions): APIPromise<AccountReauthResponse> {
    return this._client.post(path`/x/accounts/${id}/reauth`, { body, ...options });
  }
}

/**
 * Linked X account summary with connection status, health, and timestamp metadata.
 */
export interface XAccount {
  id: string;

  createdAt: string;

  /**
   * Derived connection health. `healthy` = ready to use. `needsReauth` = user must
   * submit fresh credentials. `locked` = X locked the account; unlock on x.com
   * first. `suspended` = X banned the account. `recovering` = cooldown ended; the
   * account can reconnect on its next use. `temporaryIssue` = temporary connection
   * problem; wait before the next use.
   */
  health: 'healthy' | 'locked' | 'needsReauth' | 'recovering' | 'suspended' | 'temporaryIssue';

  status: string;

  updatedAt: string;

  xUserId: string;

  xUsername: string;

  cookiesObtainedAt?: string;
}

/**
 * Connected X account details with health and timestamp metadata.
 */
export interface XAccountDetail {
  id: string;

  createdAt: string;

  health: 'healthy' | 'locked' | 'needsReauth' | 'recovering' | 'suspended' | 'temporaryIssue';

  status: string;

  xUserId: string;

  xUsername: string;

  cookiesObtainedAt?: string;

  updatedAt?: string;
}

/**
 * Sanitized X account summary returned by connect and reauth.
 */
export type AccountCreateResponse =
  | AccountCreateResponse.SanitizedXAccount
  | AccountCreateResponse.XAccountConnectionAttemptPending
  | AccountCreateResponse.XAccountConnectionChallenge;

export namespace AccountCreateResponse {
  /**
   * Sanitized X account summary returned by connect and reauth.
   */
  export interface SanitizedXAccount {
    id: string;

    createdAt: string;

    health: 'healthy' | 'locked' | 'needsReauth' | 'recovering' | 'suspended' | 'temporaryIssue';

    status: 'active';

    xUserId: string;

    xUsername: string;
  }

  /**
   * The connection is still in progress.
   */
  export interface XAccountConnectionAttemptPending {
    id: string;

    object: 'x_account_connection_attempt';

    pollAfterMs: number;

    status: 'pending';
  }

  /**
   * Resumable account connection challenge. Submit the email code to finish the same
   * connection attempt.
   */
  export interface XAccountConnectionChallenge {
    id: string;

    expiresAt: string;

    message: string;

    object: 'x_account_connection_challenge';

    status: 'requires_email_code';

    username: string;
  }
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
 * Sanitized X account summary returned by connect and reauth.
 */
export interface AccountReauthResponse {
  id: string;

  createdAt: string;

  health: 'healthy' | 'locked' | 'needsReauth' | 'recovering' | 'suspended' | 'temporaryIssue';

  status: 'active';

  xUserId: string;

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
   * Authenticator App TOTP secret required for durable login
   */
  totp_secret: string;

  /**
   * X username
   */
  username: string;
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
   * Replacement Authenticator App TOTP secret. Omit it to reuse the saved secret.
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
