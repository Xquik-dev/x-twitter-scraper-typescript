// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * Look up, search, and analyze individual tweets
 */
export class Bookmarks extends APIResource {
  /**
   * Returns your X account's bookmarks, else 424 `account_required`. A folder needs
   * X Premium, else 424 `bookmark_folders_unavailable`.
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
   * Returns your X account's bookmark folders, else 424 `account_required`. Folders
   * need X Premium, else 424 `bookmark_folders_unavailable`.
   *
   * @example
   * ```ts
   * const response = await client.x.bookmarks.retrieveFolders();
   * ```
   */
  retrieveFolders(
    query: BookmarkRetrieveFoldersParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BookmarkRetrieveFoldersResponse> {
    return this._client.get('/x/bookmarks/folders', { query, ...options });
  }
}

export interface BookmarkRetrieveFoldersResponse {
  folders: Array<BookmarkRetrieveFoldersResponse.Folder>;

  /**
   * Whether another folder page is available
   */
  has_next_page: boolean;

  /**
   * Cursor for the next folder page
   */
  next_cursor: string;
}

export namespace BookmarkRetrieveFoldersResponse {
  /**
   * Bookmark folder and its optional public cover image.
   */
  export interface Folder {
    /**
     * Folder ID.
     */
    id: string;

    /**
     * Public folder cover image metadata.
     */
    media?: Folder.Media;

    /**
     * Folder name.
     */
    name?: string;
  }

  export namespace Folder {
    /**
     * Public folder cover image metadata.
     */
    export interface Media {
      /**
       * Media object ID.
       */
      id?: string;

      /**
       * Media ID.
       */
      mediaId?: string;

      /**
       * Stable media key.
       */
      mediaKey?: string;

      /**
       * Original image height.
       */
      originalImageHeight?: number;

      /**
       * Original image URL.
       */
      originalImageUrl?: string;

      /**
       * Original image width.
       */
      originalImageWidth?: number;

      /**
       * Dominant image colors and their proportions.
       */
      palette?: Array<Media.Palette>;

      /**
       * Media object type.
       */
      type?: string;
    }

    export namespace Media {
      export interface Palette {
        percentage?: number;

        rgb?: Palette.Rgb;
      }

      export namespace Palette {
        export interface Rgb {
          blue?: number;

          green?: number;

          red?: number;
        }
      }
    }
  }
}

export interface BookmarkListParams {
  /**
   * Pagination cursor for bookmarks. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;

  /**
   * Optional bookmark folder ID. Folders need X Premium.
   */
  folderId?: string;
}

export interface BookmarkRetrieveFoldersParams {
  /**
   * Pagination cursor for collection results. Also read as next_cursor, next_token,
   * pagination_token or continuation_token.
   */
  cursor?: string;
}

export declare namespace Bookmarks {
  export {
    type BookmarkRetrieveFoldersResponse as BookmarkRetrieveFoldersResponse,
    type BookmarkListParams as BookmarkListParams,
    type BookmarkRetrieveFoldersParams as BookmarkRetrieveFoldersParams,
  };
}
