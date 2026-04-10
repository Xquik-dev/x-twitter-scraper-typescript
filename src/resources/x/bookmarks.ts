// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * Look up, search, and analyze individual tweets
 */
export class Bookmarks extends APIResource {
  /**
   * Get bookmarked tweets
   *
   * @example
   * ```ts
   * const paginatedTweets = await client.x.bookmarks.list();
   * ```
   */
  list(
    query: BookmarkListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.PaginatedTweets> {
    return this._client.get('/x/bookmarks', { query, ...options });
  }

  /**
   * Get bookmark folders
   *
   * @example
   * ```ts
   * const response = await client.x.bookmarks.retrieveFolders();
   * ```
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
   * Pagination cursor for bookmarks
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
