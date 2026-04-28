// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as CommunitiesAPI from './communities';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X write actions (tweets, likes, follows, DMs)
 */
export class Join extends APIResource {
  /**
   * Join community
   *
   * @example
   * ```ts
   * const communityActionResult =
   *   await client.x.communities.join.create('id', {
   *     account: '@elonmusk',
   *   });
   * ```
   */
  create(
    id: string,
    body: JoinCreateParams,
    options?: RequestOptions,
  ): APIPromise<CommunitiesAPI.CommunityActionResult> {
    return this._client.post(path`/x/communities/${id}/join`, { body, ...options });
  }

  /**
   * Leave community
   *
   * @example
   * ```ts
   * const communityActionResult =
   *   await client.x.communities.join.deleteAll('id', {
   *     account: '@elonmusk',
   *   });
   * ```
   */
  deleteAll(
    id: string,
    body: JoinDeleteAllParams,
    options?: RequestOptions,
  ): APIPromise<CommunitiesAPI.CommunityActionResult> {
    return this._client.delete(path`/x/communities/${id}/join`, { body, ...options });
  }
}

export interface JoinCreateParams {
  /**
   * X account identifier (@username or account ID)
   */
  account: string;
}

export interface JoinDeleteAllParams {
  /**
   * X account identifier (@username or account ID)
   */
  account: string;
}

export declare namespace Join {
  export { type JoinCreateParams as JoinCreateParams, type JoinDeleteAllParams as JoinDeleteAllParams };
}
