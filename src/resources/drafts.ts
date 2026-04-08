// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Tweet composition, drafts, writing styles & radar
 */
export class Drafts extends APIResource {
  /**
   * Save a tweet draft
   *
   * @example
   * ```ts
   * const draft = await client.drafts.create({
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
   * Get draft by ID
   *
   * @example
   * ```ts
   * const draft = await client.drafts.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<DraftRetrieveResponse> {
    return this._client.get(path`/drafts/${id}`, options);
  }

  /**
   * List saved drafts
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
   * Delete a draft
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
 * Saved tweet draft with optional topic and goal.
 */
export interface Draft {
  id: string;

  createdAt: string;

  text: string;

  goal?: string;

  topic?: string;
}

/**
 * Full tweet draft including update timestamp.
 */
export interface DraftDetail {
  id: string;

  createdAt: string;

  text: string;

  updatedAt: string;

  goal?: string;

  topic?: string;
}

/**
 * Full tweet draft including update timestamp.
 */
export interface DraftCreateResponse {
  id: string;

  createdAt: string;

  text: string;

  updatedAt: string;

  goal?: string;

  topic?: string;
}

/**
 * Full tweet draft including update timestamp.
 */
export interface DraftRetrieveResponse {
  id: string;

  createdAt: string;

  text: string;

  updatedAt: string;

  goal?: string;

  topic?: string;
}

export interface DraftListResponse {
  drafts: Array<DraftListResponse.Draft>;

  hasMore: boolean;

  nextCursor?: string;
}

export namespace DraftListResponse {
  /**
   * Saved tweet draft with optional topic and goal.
   */
  export interface Draft {
    id: string;

    createdAt: string;

    text: string;

    goal?: string;

    topic?: string;
  }
}

export interface DraftCreateParams {
  text: string;

  goal?: 'engagement' | 'followers' | 'authority' | 'conversation';

  topic?: string;
}

export interface DraftListParams {
  /**
   * Cursor for pagination
   */
  afterCursor?: string;

  /**
   * Maximum number of items to return (1-100, default 50)
   */
  limit?: number;
}

export declare namespace Drafts {
  export {
    type Draft as Draft,
    type DraftDetail as DraftDetail,
    type DraftCreateResponse as DraftCreateResponse,
    type DraftRetrieveResponse as DraftRetrieveResponse,
    type DraftListResponse as DraftListResponse,
    type DraftCreateParams as DraftCreateParams,
    type DraftListParams as DraftListParams,
  };
}
