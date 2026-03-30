// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as JoinAPI from './join';
import { Join, JoinCreateParams, JoinDeleteAllParams } from './join';
import * as TweetsAPI from './tweets';
import { TweetListParams, Tweets } from './tweets';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Communities extends APIResource {
  join: JoinAPI.Join = new JoinAPI.Join(this._client);
  tweets: TweetsAPI.Tweets = new TweetsAPI.Tweets(this._client);

  /**
   * Create community
   */
  create(body: CommunityCreateParams, options?: RequestOptions): APIPromise<CommunityCreateResponse> {
    return this._client.post('/x/communities', { body, ...options });
  }

  /**
   * Delete community
   */
  delete(
    id: string,
    body: CommunityDeleteParams,
    options?: RequestOptions,
  ): APIPromise<CommunityDeleteResponse> {
    return this._client.delete(path`/x/communities/${id}`, { body, ...options });
  }

  /**
   * Get community details
   */
  retrieveInfo(id: string, options?: RequestOptions): APIPromise<CommunityRetrieveInfoResponse> {
    return this._client.get(path`/x/communities/${id}/info`, options);
  }

  /**
   * Get community members
   */
  retrieveMembers(
    id: string,
    query: CommunityRetrieveMembersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.get(path`/x/communities/${id}/members`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get community moderators
   */
  retrieveModerators(
    id: string,
    query: CommunityRetrieveModeratorsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    return this._client.get(path`/x/communities/${id}/moderators`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Search tweets across communities
   */
  retrieveSearch(query: CommunityRetrieveSearchParams, options?: RequestOptions): APIPromise<void> {
    return this._client.get('/x/communities/search', {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface CommunityActionResult {
  communityId: string;

  communityName: string;

  success: true;
}

export interface CommunityCreateResponse {
  communityId: string;

  success: true;

  communityName?: string;
}

export interface CommunityDeleteResponse {
  success: true;
}

export interface CommunityRetrieveInfoResponse {
  /**
   * Community info object
   */
  community: unknown;
}

export interface CommunityCreateParams {
  /**
   * X account (@username or account ID)
   */
  account: string;

  /**
   * Community name
   */
  name: string;

  /**
   * Community description
   */
  description?: string;
}

export interface CommunityDeleteParams {
  /**
   * X account (@username or account ID)
   */
  account: string;

  /**
   * Community name for confirmation
   */
  community_name: string;
}

export interface CommunityRetrieveMembersParams {
  /**
   * Pagination cursor
   */
  cursor?: string;
}

export interface CommunityRetrieveModeratorsParams {
  /**
   * Pagination cursor
   */
  cursor?: string;
}

export interface CommunityRetrieveSearchParams {
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

Communities.Join = Join;
Communities.Tweets = Tweets;

export declare namespace Communities {
  export {
    type CommunityActionResult as CommunityActionResult,
    type CommunityCreateResponse as CommunityCreateResponse,
    type CommunityDeleteResponse as CommunityDeleteResponse,
    type CommunityRetrieveInfoResponse as CommunityRetrieveInfoResponse,
    type CommunityCreateParams as CommunityCreateParams,
    type CommunityDeleteParams as CommunityDeleteParams,
    type CommunityRetrieveMembersParams as CommunityRetrieveMembersParams,
    type CommunityRetrieveModeratorsParams as CommunityRetrieveModeratorsParams,
    type CommunityRetrieveSearchParams as CommunityRetrieveSearchParams,
  };

  export {
    Join as Join,
    type JoinCreateParams as JoinCreateParams,
    type JoinDeleteAllParams as JoinDeleteAllParams,
  };

  export { Tweets as Tweets, type TweetListParams as TweetListParams };
}
