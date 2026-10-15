// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * AI tweet composition, drafts, writing styles, and radar
 */
export class Drafts extends APIResource {
  /**
   * Stores a private Xquik draft. It never publishes or creates native X drafts.
   *
   * @example
   * ```ts
   * const response = await client.drafts.create({
   *   text: 'AI is the future of productivity',
   *   goal: 'engagement',
   *   topic: 'AI trends',
   * });
   * ```
   */
  create(body: DraftCreateParams, options?: RequestOptions): APIPromise<DraftCreateResponse> {
    return this._client.post('/drafts', { body, ...options });
  }

  /**
   * Returns one private Xquik draft. Native X drafts remain inaccessible.
   *
   * @example
   * ```ts
   * const draftDetail = await client.drafts.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<DraftDetail> {
    return this._client.get(path`/drafts/${id}`, options);
  }

  /**
   * Lists private Xquik drafts. It cannot access native X drafts.
   *
   * @example
   * ```ts
   * const drafts = await client.drafts.list();
   * ```
   */
  list(
    query: DraftListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DraftListResponse> {
    return this._client.get('/drafts', { query, ...options });
  }

  /**
   * Deletes one Xquik draft, not native X drafts or published posts.
   *
   * @example
   * ```ts
   * await client.drafts.delete('id');
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/drafts/${id}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Private Xquik draft with optional topic and goal.
 */
export interface Draft {
  id: string;

  createdAt: string;

  text: string;

  goal?: string;

  topic?: string;
}

/**
 * Full private Xquik draft including update timestamp.
 */
export interface DraftDetail extends Draft {
  updatedAt: string;
}

/**
 * The created draft, with the fields the request sent that the route did not read.
 */
export interface DraftCreateResponse extends DraftDetail {
  /**
   * Fields the request sent that this route does not read, in the order sent. They
   * changed nothing. The answer leaves this out when the route read every field.
   */
  ignoredFields?: Array<string>;
}

export interface DraftListResponse {
  drafts: Array<Draft>;

  hasMore: boolean;

  nextCursor?: string;
}

export interface DraftCreateParams {
  /**
   * Draft text, up to 25,000 characters. An emoji counts as 2.
   */
  text: string;

  goal?: 'engagement' | 'followers' | 'authority' | 'conversation';

  topic?: string;
}

export interface DraftListParams {
  /**
   * Cursor for pagination. The after alias also works.
   */
  afterCursor?: string;

  /**
   * Maximum items per page: 1 to 100, default 50. Credits can reduce paid results.
   * With none affordable, it returns 402 insufficient_credits.
   */
  limit?: number;
}

export declare namespace Drafts {
  export {
    type Draft as Draft,
    type DraftDetail as DraftDetail,
    type DraftCreateResponse as DraftCreateResponse,
    type DraftListResponse as DraftListResponse,
    type DraftCreateParams as DraftCreateParams,
    type DraftListParams as DraftListParams,
  };
}
