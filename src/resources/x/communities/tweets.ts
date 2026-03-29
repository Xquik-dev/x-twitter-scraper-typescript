// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

/**
 * X data lookups (subscription required)
 */
export class Tweets extends APIResource {
  /**
   * Search tweets across all communities
   */
  list(query: TweetListParams, options?: RequestOptions): APIPromise<void> {
    return this._client.get('/x/communities/tweets', {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface TweetListParams {
  /**
   * Search query
   */
  q: string;

  /**
   * Pagination cursor
   */
  cursor?: string;

  /**
   * Sort order (Latest or Top)
   */
  queryType?: string;
}

export declare namespace Tweets {
  export { type TweetListParams as TweetListParams };
}
