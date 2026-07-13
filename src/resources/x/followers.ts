// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * Look up, search, and explore user profiles and relationships
 */
export class Followers extends APIResource {
  /**
   * Check if one user follows another
   *
   * @example
   * ```ts
   * const response = await client.x.followers.check({
   *   source: 'source',
   *   target: 'target',
   * });
   * ```
   */
  check(query: FollowerCheckParams, options?: RequestOptions): APIPromise<FollowerCheckResponse> {
    return this._client.get('/x/followers/check', {
      query,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }
}

export interface FollowerCheckResponse {
  isFollowedBy: boolean;

  isFollowing: boolean;

  sourceUsername: string;

  targetUsername: string;
}

export interface FollowerCheckParams {
  /**
   * Source username, @username, or X or Twitter profile URL
   */
  source: string;

  /**
   * Target username, @username, or X or Twitter profile URL
   */
  target: string;
}

export declare namespace Followers {
  export {
    type FollowerCheckResponse as FollowerCheckResponse,
    type FollowerCheckParams as FollowerCheckParams,
  };
}
