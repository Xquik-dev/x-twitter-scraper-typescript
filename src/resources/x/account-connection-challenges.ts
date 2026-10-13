// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Connected X account management
 */
export class AccountConnectionChallenges extends APIResource {
  /**
   * Submits the email code requested during X account connection.
   *
   * @example
   * ```ts
   * const response =
   *   await client.x.accountConnectionChallenges.submit(
   *     'xch_AbCdEfGhIjKlMnOp',
   *     { email_code: '<EMAIL_VERIFICATION_CODE>' },
   *   );
   * ```
   */
  submit(
    id: string,
    body: AccountConnectionChallengeSubmitParams,
    options?: RequestOptions,
  ): APIPromise<AccountConnectionChallengeSubmitResponse> {
    return this._client.post(path`/x/account-connection-challenges/${id}/submit`, { body, ...options });
  }
}

/**
 * Sanitized X account summary returned by connect and reauth.
 */
export type AccountConnectionChallengeSubmitResponse =
  | AccountConnectionChallengeSubmitResponse.SanitizedXAccount
  | AccountConnectionChallengeSubmitResponse.XAccountConnectionChallenge;

export namespace AccountConnectionChallengeSubmitResponse {
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

export interface AccountConnectionChallengeSubmitParams {
  /**
   * Code sent to the account email.
   */
  email_code: string;
}

export declare namespace AccountConnectionChallenges {
  export {
    type AccountConnectionChallengeSubmitResponse as AccountConnectionChallengeSubmitResponse,
    type AccountConnectionChallengeSubmitParams as AccountConnectionChallengeSubmitParams,
  };
}
