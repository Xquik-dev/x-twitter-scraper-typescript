// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { PaginatedTweetsCursorPage } from '../shared';
import { APIPromise } from '../../core/api-promise';
import { CursorPage, type CursorPageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';

/**
 * X data lookups (subscription required)
 */
export class Bookmarks extends APIResource {
  /**
   * Get bookmarked tweets
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const paginatedTweets of client.x.bookmarks.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: BookmarkListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<PaginatedTweetsCursorPage, Shared.PaginatedTweets> {
    return this._client.getAPIList('/x/bookmarks', CursorPage<Shared.PaginatedTweets>, { query, ...options });
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

export interface BookmarkListParams extends CursorPageParams {
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

export { type PaginatedTweetsCursorPage };
