// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../../core/resource';
import type * as WriteActionsAPI from '../write-actions';
import type { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import type { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X write actions (tweets, likes, follows, DMs)
 */
export class Bookmark extends APIResource {
  /**
   * Bookmarks a post through a connected X account. Only that account sees its
   * bookmarks, and `client.x.bookmarks.list` lists them.
   *
   * @example
   * ```ts
   * const bookmark = await client.x.tweets.bookmark.create('id', {
   *   account: '@elonmusk',
   *   'Idempotency-Key': 'Idempotency-Key',
   * });
   * ```
   */
  create(
    id: string,
    params: BookmarkCreateParams,
    options?: RequestOptions,
  ): APIPromise<BookmarkCreateResponse> {
    const { 'Idempotency-Key': idempotencyKey, Prefer: prefer, ...body } = params;
    return this._client.post(path`/x/tweets/${id}/bookmark`, {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey, Prefer: prefer }, options?.headers]),
    });
  }

  /**
   * Removes a bookmark through a connected X account.
   *
   * @example
   * ```ts
   * const response = await client.x.tweets.bookmark.delete('id', {
   *   account: '@elonmusk',
   *   'Idempotency-Key': 'Idempotency-Key',
   * });
   * ```
   */
  delete(
    id: string,
    params: BookmarkDeleteParams,
    options?: RequestOptions,
  ): APIPromise<BookmarkDeleteResponse> {
    const { 'Idempotency-Key': idempotencyKey, Prefer: prefer, ...body } = params;
    return this._client.delete(path`/x/tweets/${id}/bookmark`, {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey, Prefer: prefer }, options?.headers]),
    });
  }
}

export type BookmarkCreateResponse = WriteActionsAPI.WriteActionRetrieveResponse;

export type BookmarkDeleteResponse = WriteActionsAPI.WriteActionRetrieveResponse;

export interface BookmarkCreateParams {
  /**
   * Body param: X account identifier (@username or account ID)
   */
  account: string;

  /**
   * Header param: Use one unique value per intended write. Reuse it only for an
   * identical retry. A matching retry returns the first answer again, with
   * idempotent: true added. It keeps the first status, body & Retry-After. It sends
   * nothing to X & charges nothing. While the first request runs, a retry returns
   * 202 & the action. Different input returns 409. Protection lasts at least 90
   * days.
   */
  'Idempotency-Key': string;

  /**
   * Header param: A long write answers 202 with a status link, then lands on X.
   * `wait=<seconds>` asks for the answer within that many seconds, up to 85. If
   * the write is still running then, the API answers 202 with Location. Poll
   * Location until `terminal` is true, and don't send the write again.
   */
  Prefer?: string;
}

export interface BookmarkDeleteParams {
  /**
   * Body param: X account identifier (@username or account ID)
   */
  account: string;

  /**
   * Header param: Use one unique value per intended write. Reuse it only for an
   * identical retry. A matching retry returns the first answer again, with
   * idempotent: true added. It keeps the first status, body & Retry-After. It sends
   * nothing to X & charges nothing. While the first request runs, a retry returns
   * 202 & the action. Different input returns 409. Protection lasts at least 90
   * days.
   */
  'Idempotency-Key': string;

  /**
   * Header param: A long write answers 202 with a status link, then lands on X.
   * `wait=<seconds>` asks for the answer within that many seconds, up to 85. If
   * the write is still running then, the API answers 202 with Location. Poll
   * Location until `terminal` is true, and don't send the write again.
   */
  Prefer?: string;
}

export declare namespace Bookmark {
  export {
    type BookmarkCreateResponse as BookmarkCreateResponse,
    type BookmarkDeleteResponse as BookmarkDeleteResponse,
    type BookmarkCreateParams as BookmarkCreateParams,
    type BookmarkDeleteParams as BookmarkDeleteParams,
  };
}
