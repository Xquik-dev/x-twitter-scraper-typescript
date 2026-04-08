// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X write actions (tweets, likes, follows, DMs)
 */
export class Follow extends APIResource {
  /**
   * Follow user
   *
   * @example
   * ```ts
   * const follow = await client.x.users.follow.create('id', {
   *   account: '@elonmusk',
   * });
   * ```
   */
  create(id: string, body: FollowCreateParams, options?: RequestOptions): APIPromise<FollowCreateResponse> {
    return this._client.post(path`/x/users/${id}/follow`, { body, ...options });
  }

  /**
   * Unfollow user
   *
   * @example
   * ```ts
   * const response = await client.x.users.follow.deleteAll(
   *   'id',
   *   { account: '@elonmusk' },
   * );
   * ```
   */
  deleteAll(
    id: string,
    body: FollowDeleteAllParams,
    options?: RequestOptions,
  ): APIPromise<FollowDeleteAllResponse> {
    return this._client.delete(path`/x/users/${id}/follow`, { body, ...options });
  }
}

export interface FollowCreateResponse {
  success: true;
}

export interface FollowDeleteAllResponse {
  success: true;
}

export interface FollowCreateParams {
  /**
   * X account identifier (@username or account ID)
   */
  account: string;
}

export interface FollowDeleteAllParams {
  /**
   * X account identifier (@username or account ID)
   */
  account: string;
}

export declare namespace Follow {
  export {
    type FollowCreateResponse as FollowCreateResponse,
    type FollowDeleteAllResponse as FollowDeleteAllResponse,
    type FollowCreateParams as FollowCreateParams,
    type FollowDeleteAllParams as FollowDeleteAllParams,
  };
}
