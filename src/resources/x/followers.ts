// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * X data lookups (subscription required)
 */
export class Followers extends APIResource {
  /**
   * Check follow relationship
   */
  retrieveCheck(
    query: FollowerRetrieveCheckParams,
    options?: RequestOptions,
  ): APIPromise<FollowerRetrieveCheckResponse> {
    return this._client.get('/x/followers/check', { query, ...options });
  }
}

export interface FollowerRetrieveCheckResponse {
  isFollowedBy: boolean;

  isFollowing: boolean;

  sourceUsername: string;

  targetUsername: string;
}

export interface FollowerRetrieveCheckParams {
  /**
   * Username to check (without @)
   */
  source: string;

  /**
   * Target username (without @)
   */
  target: string;
}

export declare namespace Followers {
  export {
    type FollowerRetrieveCheckResponse as FollowerRetrieveCheckResponse,
    type FollowerRetrieveCheckParams as FollowerRetrieveCheckParams,
  };
}
