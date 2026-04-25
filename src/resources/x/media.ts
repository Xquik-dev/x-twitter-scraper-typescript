// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';

/**
 * Media upload and download
 */
export class Media extends APIResource {
  /**
   * Download images and videos from tweets
   *
   * @example
   * ```ts
   * const response = await client.x.media.download({
   *   tweetInput: 'https://x.com/elonmusk/status/1234567890',
   * });
   * ```
   */
  download(body: MediaDownloadParams, options?: RequestOptions): APIPromise<MediaDownloadResponse> {
    return this._client.post('/x/media/download', { body, ...options });
  }

  /**
   * Upload media
   *
   * @example
   * ```ts
   * const response = await client.x.media.upload({
   *   account: '@elonmusk',
   *   file: fs.createReadStream('path/to/file'),
   *   is_long_video: true,
   * });
   * ```
   */
  upload(body: MediaUploadParams, options?: RequestOptions): APIPromise<MediaUploadResponse> {
    return this._client.post('/x/media', multipartFormRequestOptions({ body, ...options }, this._client));
  }
}

export interface MediaDownloadResponse {
  cacheHit?: boolean;

  galleryUrl?: string;

  totalMedia?: number;

  totalTweets?: number;

  tweetId?: string;
}

export interface MediaUploadResponse {
  mediaId: string;

  success: true;
}

export interface MediaDownloadParams {
  /**
   * Array of tweet URLs or IDs (bulk, max 50)
   */
  tweetIds?: Array<string>;

  /**
   * Tweet URL or ID (single tweet)
   */
  tweetInput?: string;
}

export interface MediaUploadParams {
  /**
   * X account (@username or ID) uploading media
   */
  account: string;

  /**
   * Media file to upload
   */
  file: Uploadable;

  is_long_video?: boolean;
}

export declare namespace Media {
  export {
    type MediaDownloadResponse as MediaDownloadResponse,
    type MediaUploadResponse as MediaUploadResponse,
    type MediaDownloadParams as MediaDownloadParams,
    type MediaUploadParams as MediaUploadParams,
  };
}
