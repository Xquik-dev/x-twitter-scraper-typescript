// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { maybeMultipartFormRequestOptions } from '../../internal/uploads';

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
    return this._client.post('/x/media/download', {
      body,
      ...options,
      __security: { apiKeyAuth: true, oauthBearerAuth: true },
    });
  }

  /**
   * Upload media
   *
   * @example
   * ```ts
   * const response = await client.x.media.upload({
   *   account: '@elonmusk',
   *   url: 'https://example.com/image.png',
   * });
   * ```
   */
  upload(body: MediaUploadParams, options?: RequestOptions): APIPromise<MediaUploadResponse> {
    return this._client.post(
      '/x/media',
      maybeMultipartFormRequestOptions(
        { body, ...options, __security: { apiKeyAuth: true, oauthBearerAuth: true } },
        this._client,
      ),
    );
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

  /**
   * Public media URL for tweet `media` arrays.
   */
  mediaUrl: string;

  success: true;
}

export interface MediaDownloadParams {
  /**
   * Numeric tweet ID alias for tweetInput
   */
  tweetId?: string;

  /**
   * Array of tweet URLs or IDs (bulk, max 50 string items)
   */
  tweetIds?: Array<string>;

  /**
   * Tweet URL or ID (single tweet)
   */
  tweetInput?: string;

  /**
   * Tweet URL alias for tweetInput
   */
  tweetUrl?: string;
}

export interface MediaUploadParams {
  /**
   * X account (@username or ID) uploading media from URL
   */
  account: string;

  /**
   * HTTPS URL to download and upload as media
   */
  url: string;
}

export declare namespace Media {
  export {
    type MediaDownloadResponse as MediaDownloadResponse,
    type MediaUploadResponse as MediaUploadResponse,
    type MediaDownloadParams as MediaDownloadParams,
    type MediaUploadParams as MediaUploadParams,
  };
}
