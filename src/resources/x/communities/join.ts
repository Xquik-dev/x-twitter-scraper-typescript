// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X write actions (tweets, likes, follows, DMs)
 */
export class Join extends APIResource {
  /**
   * Join community
   */
  create(id: string, body: JoinCreateParams, options?: RequestOptions): APIPromise<JoinCreateResponse> {
    return this._client.post(path`/x/communities/${id}/join`, { body, ...options });
  }

  /**
   * Leave community
   */
  deleteAll(
    id: string,
    body: JoinDeleteAllParams,
    options?: RequestOptions,
  ): APIPromise<JoinDeleteAllResponse> {
    return this._client.delete(path`/x/communities/${id}/join`, { body, ...options });
  }
}

export interface JoinCreateResponse {
  communityId: string;

  communityName: string;

  success: true;
}

export interface JoinDeleteAllResponse {
  communityId: string;

  communityName: string;

  success: true;
}

export interface JoinCreateParams {
  /**
   * X account (@username or account ID)
   */
  account: string;
}

export interface JoinDeleteAllParams {
  /**
   * X account (@username or account ID)
   */
  account: string;
}

export declare namespace Join {
  export {
    type JoinCreateResponse as JoinCreateResponse,
    type JoinDeleteAllResponse as JoinDeleteAllResponse,
    type JoinCreateParams as JoinCreateParams,
    type JoinDeleteAllParams as JoinDeleteAllParams,
  };
}
