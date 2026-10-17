// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * X live video details, watch counts, and broadcaster
 */
export class Broadcasts extends APIResource {
  /**
   * Returns one X broadcast, the live video X hosts at x.com/i/broadcasts, live or
   * ended. Accepts the broadcast ID or the URL-encoded broadcast URL. Reading a
   * broadcast adds no view to it.
   *
   * @example
   * ```ts
   * const broadcast = await client.x.broadcasts.retrieve('id');
   * ```
   */
  retrieve(
    id: string,
    query: BroadcastRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BroadcastRetrieveResponse> {
    return this._client.get(path`/x/broadcasts/${id}`, { query, ...options });
  }
}

export interface BroadcastRetrieveResponse {
  /**
   * X broadcast, a live video
   */
  broadcast: Shared.Broadcast;
}

export namespace BroadcastRetrieveResponse {
  export type Broadcast = Shared.Broadcast;

  export namespace Broadcast {
    export type PeriscopeUser = Shared.Broadcast.PeriscopeUser;
  }
}

export interface BroadcastRetrieveParams {
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

export declare namespace Broadcasts {
  export {
    type BroadcastRetrieveResponse as BroadcastRetrieveResponse,
    type BroadcastRetrieveParams as BroadcastRetrieveParams,
  };
}
