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
   */
  create(body: AccountCreateParams, options?: RequestOptions): APIPromise<AccountCreateResponse> {
    return this._client.post('/x/accounts', { body, ...options, __security: {} });
  }

  /**
   * Get X account details
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<XAccountDetail> {
    return this._client.get(path`/x/accounts/${id}`, { ...options, __security: {} });
  }

  /**
   * List connected X accounts
   */
  list(options?: RequestOptions): APIPromise<AccountListResponse> {
    return this._client.get('/x/accounts', { ...options, __security: {} });
  }

  /**
   * Disconnect X account
   */
  delete(id: string, options?: RequestOptions): APIPromise<AccountDeleteResponse> {
    return this._client.delete(path`/x/accounts/${id}`, { ...options, __security: {} });
  }

  /**
   * Re-authenticate X account
   */
  reauth(id: string, body: AccountReauthParams, options?: RequestOptions): APIPromise<AccountReauthResponse> {
    return this._client.post(path`/x/accounts/${id}/reauth`, { body, ...options, __security: {} });
  }
}

export interface XAccount {
  id: string;

  createdAt: string;

  status: string;

  xUserId: string;

  xUsername: string;
}

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

export interface AccountListResponse {
  accounts: Array<XAccount>;
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
   * Account password
   */
  password: string;

  /**
   * TOTP secret for 2FA
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
    type AccountReauthResponse as AccountReauthResponse,
    type AccountCreateParams as AccountCreateParams,
    type AccountReauthParams as AccountReauthParams,
  };
}
