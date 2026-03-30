// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * X data lookups (subscription required)
 */
export class Bookmarks extends APIResource {
  /**
   * Get bookmarked tweets
   */
  list(
    query: BookmarkListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/bookmarks', { query, ...options });
  }

  /**
   * Get bookmark folders
   */
  retrieveFolders(options?: RequestOptions): APIPromise<BookmarkRetrieveFoldersResponse> {
    return this._client.get('/x/bookmarks/folders', options);
  }
}

export interface BookmarkRetrieveFoldersResponse {
  folders: Array<BookmarkRetrieveFoldersResponse.Folder>;

  has_next_page: boolean;

  next_cursor: string;
}

export namespace BookmarkRetrieveFoldersResponse {
  export interface Folder {
    id: string;

    name: string;
  }
}

export interface BookmarkListParams {
  /**
   * Pagination cursor from previous response
   */
  cursor?: string;

  /**
   * Optional bookmark folder ID
   */
  folderId?: string;
}

export declare namespace Bookmarks {
  export {
    type BookmarkRetrieveFoldersResponse as BookmarkRetrieveFoldersResponse,
    type BookmarkListParams as BookmarkListParams,
  };
}
