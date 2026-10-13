// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * Look up, search, and explore user profiles and relationships
 */
export class Followers extends APIResource {
  /**
   * Returns whether one public account follows another, & the reverse, with each
   * account's username & user ID as X names them.
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
    return this._client.get('/x/followers/check', { query, ...options });
  }
}

export interface FollowerCheckResponse {
  isFollowedBy: boolean;

  isFollowing: boolean;

  sourceUsername: string;

  /**
   * The target account's username, in lower case.
   */
  targetUsername: string;

  /**
   * The source account's user ID, as X gives it.
   */
  sourceId?: string;

  /**
   * The target account's user ID, as X gives it.
   */
  targetId?: string;
}

export interface FollowerCheckParams {
  /**
   * Source user ID, username, @username, or X or Twitter profile URL, such as
   * x.com/i/user/11348282. A number is a user ID.
   */
  source: string;

  /**
   * Target user ID, username, @username, or X or Twitter profile URL, such as
   * x.com/i/user/11348282. A number is a user ID.
   */
  target: string;

  /**
   * Fields to keep in each row, comma-separated. Use dots for nested fields, such as
   * author.username. A list keeps the field in each item. Case & underscores do not
   * matter. A row that lacks a field leaves it out. Cursors, counts & diagnostics
   * always stay. An unknown name answers 400 unknown_field with the valid names,
   * before any read. The price stays the same. SDK row types then hold only the
   * named fields.
   */
  fields?: string;

  /**
   * Fields to drop from each row, comma-separated. It takes the same names as
   * fields. With fields, it drops from the kept fields.
   */
  omit?: string;
}

export declare namespace Followers {
  export {
    type FollowerCheckResponse as FollowerCheckResponse,
    type FollowerCheckParams as FollowerCheckParams,
  };
}
