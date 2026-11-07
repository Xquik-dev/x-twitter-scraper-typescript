// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../../core/resource';
import * as WriteActionsAPI from '../write-actions';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

/**
 * X write actions (tweets, likes, follows, DMs)
 */
export class Block extends APIResource {
  /**
   * Blocks a user through a connected X account. X removes follows both ways, and
   * unblocking doesn't restore them.
   *
   * @example
   * ```ts
   * const block = await client.x.users.block.create('id', {
   *   account: '@elonmusk',
   *   'Idempotency-Key': 'Idempotency-Key',
   * });
   * ```
   */
  create(id: string, params: BlockCreateParams, options?: RequestOptions): APIPromise<BlockCreateResponse> {
    const { 'Idempotency-Key': idempotencyKey, Prefer: prefer, ...body } = params;
    return this._client.post(path`/x/users/${id}/block`, {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey, Prefer: prefer }, options?.headers]),
    });
  }

  /**
   * Unblocks a user through a connected X account.
   *
   * @example
   * ```ts
   * const response = await client.x.users.block.delete('id', {
   *   account: '@elonmusk',
   *   'Idempotency-Key': 'Idempotency-Key',
   * });
   * ```
   */
  delete(id: string, params: BlockDeleteParams, options?: RequestOptions): APIPromise<BlockDeleteResponse> {
    const { 'Idempotency-Key': idempotencyKey, Prefer: prefer, ...body } = params;
    return this._client.delete(path`/x/users/${id}/block`, {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey, Prefer: prefer }, options?.headers]),
    });
  }
}

export type BlockCreateResponse = WriteActionsAPI.WriteActionRetrieveResponse;

export type BlockDeleteResponse = WriteActionsAPI.WriteActionRetrieveResponse;

export interface BlockCreateParams {
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

export interface BlockDeleteParams {
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

export declare namespace Block {
  export {
    type BlockCreateResponse as BlockCreateResponse,
    type BlockDeleteResponse as BlockDeleteResponse,
    type BlockCreateParams as BlockCreateParams,
    type BlockDeleteParams as BlockDeleteParams,
  };
}
