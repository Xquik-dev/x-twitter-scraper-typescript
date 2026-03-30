// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Tweet composition, drafts, writing styles & radar
 */
export class Styles extends APIResource {
  /**
   * Get cached style profile
   */
  retrieve(username: string, options?: RequestOptions): APIPromise<StyleProfile> {
    return this._client.get(path`/styles/${username}`, options);
  }

  /**
   * Save style profile with custom tweets
   */
  update(username: string, body: StyleUpdateParams, options?: RequestOptions): APIPromise<StyleProfile> {
    return this._client.put(path`/styles/${username}`, { body, ...options });
  }

  /**
   * List cached style profiles
   */
  list(options?: RequestOptions): APIPromise<StyleListResponse> {
    return this._client.get('/styles', options);
  }

  /**
   * Delete a style profile
   */
  delete(username: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/styles/${username}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Analyze writing style from recent tweets
   */
  analyze(body: StyleAnalyzeParams, options?: RequestOptions): APIPromise<StyleProfile> {
    return this._client.post('/styles', { body, ...options });
  }

  /**
   * Compare two style profiles
   */
  compare(query: StyleCompareParams, options?: RequestOptions): APIPromise<StyleCompareResponse> {
    return this._client.get('/styles/compare', { query, ...options });
  }

  /**
   * Get engagement metrics for style tweets
   */
  getPerformance(username: string, options?: RequestOptions): APIPromise<StyleGetPerformanceResponse> {
    return this._client.get(path`/styles/${username}/performance`, options);
  }
}

export interface StyleProfile {
  fetchedAt: string;

  isOwnAccount: boolean;

  tweetCount: number;

  tweets: Array<StyleProfile.Tweet>;

  xUsername: string;
}

export namespace StyleProfile {
  export interface Tweet {
    id: string;

    text: string;

    authorUsername?: string;

    createdAt?: string;
  }
}

export interface StyleProfileSummary {
  fetchedAt: string;

  isOwnAccount: boolean;

  tweetCount: number;

  xUsername: string;
}

export interface StyleListResponse {
  styles: Array<StyleProfileSummary>;
}

export interface StyleCompareResponse {
  style1: StyleProfile;

  style2: StyleProfile;
}

export interface StyleGetPerformanceResponse {
  tweetCount: number;

  tweets: Array<StyleGetPerformanceResponse.Tweet>;

  xUsername: string;
}

export namespace StyleGetPerformanceResponse {
  export interface Tweet {
    id: string;

    text: string;

    createdAt?: string;

    likeCount?: number;

    replyCount?: number;

    retweetCount?: number;

    viewCount?: number;
  }
}

export interface StyleUpdateParams {
  /**
   * Display label for the style
   */
  label: string;

  /**
   * Array of tweet objects
   */
  tweets: Array<StyleUpdateParams.Tweet>;
}

export namespace StyleUpdateParams {
  export interface Tweet {
    text: string;
  }
}

export interface StyleAnalyzeParams {
  /**
   * X username to analyze
   */
  username: string;
}

export interface StyleCompareParams {
  /**
   * First username to compare
   */
  username1: string;

  /**
   * Second username to compare
   */
  username2: string;
}

export declare namespace Styles {
  export {
    type StyleProfile as StyleProfile,
    type StyleProfileSummary as StyleProfileSummary,
    type StyleListResponse as StyleListResponse,
    type StyleCompareResponse as StyleCompareResponse,
    type StyleGetPerformanceResponse as StyleGetPerformanceResponse,
    type StyleUpdateParams as StyleUpdateParams,
    type StyleAnalyzeParams as StyleAnalyzeParams,
    type StyleCompareParams as StyleCompareParams,
  };
}
