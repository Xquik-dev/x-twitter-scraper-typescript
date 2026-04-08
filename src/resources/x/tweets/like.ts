// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X write actions (tweets, likes, follows, DMs)
 */
export class Like extends APIResource {
  /**
   * Like tweet
   *
   * @example
   * ```ts
   * const like = await client.x.tweets.like.create('id', {
   *   account: '@elonmusk',
   * });
   * ```
   */
  create(id: string, body: LikeCreateParams, options?: RequestOptions): APIPromise<LikeCreateResponse> {
    return this._client.post(path`/x/tweets/${id}/like`, { body, ...options });
  }

  /**
   * Unlike tweet
   *
   * @example
   * ```ts
   * const like = await client.x.tweets.like.delete('id', {
   *   account: '@elonmusk',
   * });
   * ```
   */
  delete(id: string, body: LikeDeleteParams, options?: RequestOptions): APIPromise<LikeDeleteResponse> {
    return this._client.delete(path`/x/tweets/${id}/like`, { body, ...options });
  }
}

export interface LikeCreateResponse {
  success: true;
}

export interface LikeDeleteResponse {
  success: true;
}

export interface LikeCreateParams {
  /**
   * X account identifier (@username or account ID)
   */
  account: string;
}

export interface LikeDeleteParams {
  /**
   * X account identifier (@username or account ID)
   */
  account: string;
}

export declare namespace Like {
  export {
    type LikeCreateResponse as LikeCreateResponse,
    type LikeDeleteResponse as LikeDeleteResponse,
    type LikeCreateParams as LikeCreateParams,
    type LikeDeleteParams as LikeDeleteParams,
  };
}
