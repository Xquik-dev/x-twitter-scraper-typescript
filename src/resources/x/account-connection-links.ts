// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Connected X account management
 */
export class AccountConnectionLinks extends APIResource {
  /**
   * Creates a link to a page Xquik hosts, where a person connects an X account with
   * no Xquik signup. Your backend never receives their password or 2FA secret, and
   * the account belongs to you. Send `accountId` to reconnect 1 of your accounts
   * instead. Connecting is free. The link works for 30 minutes, & the response is
   * the only place its token appears.
   *
   * @example
   * ```ts
   * const accountConnectionLink =
   *   await client.x.accountConnectionLinks.create({
   *     reference: 'user-42',
   *   });
   * ```
   */
  create(
    body: AccountConnectionLinkCreateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AccountConnectionLinkCreateResponse> {
    return this._client.post('/x/account-connection-links', { body, ...options });
  }

  /**
   * Reads what happened on a link. `status` reads `connected` once the person
   * finishes, with `xUserId`, `xUsername` & `health`. It never holds the token.
   *
   * @example
   * ```ts
   * const accountConnectionLink =
   *   await client.x.accountConnectionLinks.retrieve(
   *     'xlink_AAAAAAAAAAAAAAAA',
   *   );
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<XAccountConnectionLink> {
    return this._client.get(path`/x/account-connection-links/${id}`, options);
  }

  /**
   * Stops a link working. An account it already connected stays connected.
   *
   * @example
   * ```ts
   * const accountConnectionLink =
   *   await client.x.accountConnectionLinks.delete(
   *     'xlink_AAAAAAAAAAAAAAAA',
   *   );
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<AccountConnectionLinkDeleteResponse> {
    return this._client.delete(path`/x/account-connection-links/${id}`, options);
  }
}

/**
 * A link where a person connects an X account on Xquik's page.
 */
export interface XAccountConnectionLink {
  id: string;

  accountId: string | null;

  completedAt: string | null;

  createdAt: string;

  expiresAt: string;

  /**
   * Why the last login didn't finish.
   */
  failure: string | null;

  health: string | null;

  object: 'x_account_connection_link';

  purpose: 'connect' | 'reconnect';

  reference: string | null;

  returnUrl: string | null;

  /**
   * `failed` means 5 logins were refused, so make a new link.
   */
  status: 'pending' | 'connecting' | 'requires_email_code' | 'connected' | 'failed' | 'expired' | 'revoked';

  xUserId: string | null;

  xUsername: string | null;

  /**
   * Present only in the response that creates the link.
   */
  url?: string;
}

/**
 * A link where a person connects an X account on Xquik's page.
 */
export interface AccountConnectionLinkCreateResponse extends XAccountConnectionLink {
  /**
   * The page to open. Its fragment holds the token, so treat it as a secret & keep
   * it out of logs.
   */
  url: string;
}

export interface AccountConnectionLinkDeleteResponse {
  success: true;
}

export interface AccountConnectionLinkCreateParams {
  /**
   * The ID of 1 of your X accounts. The link then reconnects that account.
   */
  accountId?: string;

  /**
   * Your own ID for this person. It comes back when you read the link.
   */
  reference?: string;

  /**
   * A public https URL the page offers as a button once the account connects. Xquik
   * never redirects by itself, & never adds the token.
   */
  returnUrl?: string;
}

export declare namespace AccountConnectionLinks {
  export {
    type XAccountConnectionLink as XAccountConnectionLink,
    type AccountConnectionLinkCreateResponse as AccountConnectionLinkCreateResponse,
    type AccountConnectionLinkDeleteResponse as AccountConnectionLinkDeleteResponse,
    type AccountConnectionLinkCreateParams as AccountConnectionLinkCreateParams,
  };
}
