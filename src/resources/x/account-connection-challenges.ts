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
   * Submit X account email verification code
   *
   * @example
   * ```ts
   * const response =
   *   await client.x.accountConnectionChallenges.submit('id', {
   *     email_code: '123456',
   *   });
   * ```
   */
  submit(
    id: string,
    body: AccountConnectionChallengeSubmitParams,
    options?: RequestOptions,
  ): APIPromise<AccountConnectionChallengeSubmitResponse> {
    return this._client.post(path`/x/account-connection-challenges/${id}/submit`, {
      body,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }
}

/**
 * Sanitized X account summary returned by connect and reauth.
 */
export interface AccountConnectionChallengeSubmitResponse {
  id: string;

  createdAt: string;

  health: 'healthy' | 'locked' | 'needsReauth' | 'recovering' | 'suspended' | 'temporaryIssue';

  status: string;

  xUserId: string;

  xUsername: string;
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
