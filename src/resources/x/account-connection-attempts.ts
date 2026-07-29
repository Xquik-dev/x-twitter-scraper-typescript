// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Connected X account management
 */
export class AccountConnectionAttempts extends APIResource {
  /**
   * Get X account connection status
   *
   * @example
   * ```ts
   * const accountConnectionAttempt =
   *   await client.x.accountConnectionAttempts.retrieve(
   *     'xatt_0123456789abcdef0123456789abcdef',
   *   );
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<AccountConnectionAttemptRetrieveResponse> {
    return this._client.get(path`/x/account-connection-attempts/${id}`, options);
  }
}

/**
 * The connection is still in progress.
 */
export type AccountConnectionAttemptRetrieveResponse =
  | AccountConnectionAttemptRetrieveResponse.XAccountConnectionAttemptPending
  | AccountConnectionAttemptRetrieveResponse.XAccountConnectionAttemptSuccess
  | AccountConnectionAttemptRetrieveResponse.XAccountConnectionAttemptFailed
  | AccountConnectionAttemptRetrieveResponse.XAccountConnectionChallenge;

export namespace AccountConnectionAttemptRetrieveResponse {
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
   * The account connected successfully.
   */
  export interface XAccountConnectionAttemptSuccess {
    id: string;

    object: 'x_account_connection_attempt';

    status: 'success';
  }

  /**
   * The connection reached a final failure.
   */
  export interface XAccountConnectionAttemptFailed {
    id: string;

    error: string;

    object: 'x_account_connection_attempt';

    retryable: boolean;

    status: 'failed';

    reason?: string;
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

export declare namespace AccountConnectionAttempts {
  export { type AccountConnectionAttemptRetrieveResponse as AccountConnectionAttemptRetrieveResponse };
}
