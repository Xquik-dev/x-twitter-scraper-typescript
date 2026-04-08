// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X write actions (tweets, likes, follows, DMs)
 */
export class Retweet extends APIResource {
  /**
   * Retweet
   *
   * @example
   * ```ts
   * const retweet = await client.x.tweets.retweet.create('id', {
   *   account: '@elonmusk',
   * });
   * ```
   */
  create(id: string, body: RetweetCreateParams, options?: RequestOptions): APIPromise<RetweetCreateResponse> {
    return this._client.post(path`/x/tweets/${id}/retweet`, { body, ...options });
  }

  /**
   * Unretweet
   *
   * @example
   * ```ts
   * const retweet = await client.x.tweets.retweet.delete('id', {
   *   account: '@elonmusk',
   * });
   * ```
   */
  delete(id: string, body: RetweetDeleteParams, options?: RequestOptions): APIPromise<RetweetDeleteResponse> {
    return this._client.delete(path`/x/tweets/${id}/retweet`, { body, ...options });
  }
}

export interface RetweetCreateResponse {
  success: true;
}

export interface RetweetDeleteResponse {
  success: true;
}

export interface RetweetCreateParams {
  /**
   * X account identifier (@username or account ID)
   */
  account: string;
}

export interface RetweetDeleteParams {
  /**
   * X account identifier (@username or account ID)
   */
  account: string;
}

export declare namespace Retweet {
  export {
    type RetweetCreateResponse as RetweetCreateResponse,
    type RetweetDeleteResponse as RetweetDeleteResponse,
    type RetweetCreateParams as RetweetCreateParams,
    type RetweetDeleteParams as RetweetDeleteParams,
  };
}
