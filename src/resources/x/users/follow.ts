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
   */
  create(
    userID: string,
    body: FollowCreateParams,
    options?: RequestOptions,
  ): APIPromise<FollowCreateResponse> {
    return this._client.post(path`/x/users/${userID}/follow`, { body, ...options });
  }

  /**
   * Unfollow user
   */
  deleteAll(
    userID: string,
    body: FollowDeleteAllParams,
    options?: RequestOptions,
  ): APIPromise<FollowDeleteAllResponse> {
    return this._client.delete(path`/x/users/${userID}/follow`, { body, ...options });
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
   * X account (@username or account ID)
   */
  account: string;
}

export interface FollowDeleteAllParams {
  /**
   * X account (@username or account ID)
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
