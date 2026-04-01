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
   */
  create(body: DraftCreateParams, options?: RequestOptions): APIPromise<DraftCreateResponse> {
    return this._client.post('/drafts', { body, ...options });
  }

  /**
   * Get draft by ID
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<DraftRetrieveResponse> {
    return this._client.get(path`/drafts/${id}`, options);
  }

  /**
   * List saved drafts
   */
  list(
    query: DraftListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DraftListResponse> {
    return this._client.get('/drafts', { query, ...options });
  }

  /**
   * Delete a draft
   */
  delete(id: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/drafts/${id}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface Draft {
  id: string;

  createdAt: string;

  text: string;

  goal?: string;

  topic?: string;
}

export interface DraftDetail {
  id: string;

  createdAt: string;

  text: string;

  updatedAt: string;

  goal?: string;

  topic?: string;
}

export interface DraftCreateResponse {
  id: string;

  createdAt: string;

  text: string;

  updatedAt: string;

  goal?: string;

  topic?: string;
}

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
