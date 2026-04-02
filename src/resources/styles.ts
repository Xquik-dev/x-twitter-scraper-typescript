// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Tweet composition, drafts, writing styles & radar
 */
export class Styles extends APIResource {
  /**
   * List cached style profiles
   */
  list(options?: RequestOptions): APIPromise<StyleListResponse> {
    return this._client.get('/styles', options);
  }

  /**
   * Analyze writing style from recent tweets
   */
  analyze(body: StyleAnalyzeParams, options?: RequestOptions): APIPromise<StyleAnalyzeResponse> {
    return this._client.post('/styles', { body, ...options });
  }

  /**
   * Compare two style profiles
   */
  compare(query: StyleCompareParams, options?: RequestOptions): APIPromise<StyleCompareResponse> {
    return this._client.get('/styles/compare', { query, ...options });
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
  styles: Array<StyleListResponse.Style>;
}

export namespace StyleListResponse {
  export interface Style {
    fetchedAt: string;

    isOwnAccount: boolean;

    tweetCount: number;

    xUsername: string;
  }
}

export interface StyleAnalyzeResponse {
  fetchedAt: string;

  isOwnAccount: boolean;

  tweetCount: number;

  tweets: Array<StyleAnalyzeResponse.Tweet>;

  xUsername: string;
}

export namespace StyleAnalyzeResponse {
  export interface Tweet {
    id: string;

    text: string;

    authorUsername?: string;

    createdAt?: string;
  }
}

export interface StyleCompareResponse {
  style1: StyleCompareResponse.Style1;

  style2: StyleCompareResponse.Style2;
}

export namespace StyleCompareResponse {
  export interface Style1 {
    fetchedAt: string;

    isOwnAccount: boolean;

    tweetCount: number;

    tweets: Array<Style1.Tweet>;

    xUsername: string;
  }

  export namespace Style1 {
    export interface Tweet {
      id: string;

      text: string;

      authorUsername?: string;

      createdAt?: string;
    }
  }

  export interface Style2 {
    fetchedAt: string;

    isOwnAccount: boolean;

    tweetCount: number;

    tweets: Array<Style2.Tweet>;

    xUsername: string;
  }

  export namespace Style2 {
    export interface Tweet {
      id: string;

      text: string;

      authorUsername?: string;

      createdAt?: string;
    }
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
    type StyleAnalyzeResponse as StyleAnalyzeResponse,
    type StyleCompareResponse as StyleCompareResponse,
    type StyleAnalyzeParams as StyleAnalyzeParams,
    type StyleCompareParams as StyleCompareParams,
  };
}
