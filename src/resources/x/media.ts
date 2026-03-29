// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';

/**
 * Media upload & download
 */
export class Media extends APIResource {
  /**
   * Upload media
   */
  create(body: MediaCreateParams, options?: RequestOptions): APIPromise<MediaCreateResponse> {
    return this._client.post('/x/media', multipartFormRequestOptions({ body, ...options }, this._client));
  }

  /**
   * Download tweet media
   */
  download(body: MediaDownloadParams, options?: RequestOptions): APIPromise<MediaDownloadResponse> {
    return this._client.post('/x/media/download', { body, ...options });
  }
}

export interface MediaCreateResponse {
  mediaId: string;

  success: true;
}

export interface MediaDownloadResponse {
  cacheHit?: boolean;

  galleryUrl?: string;

  totalMedia?: number;

  totalTweets?: number;

  tweetId?: string;
}

export interface MediaCreateParams {
  /**
   * X account (@username or account ID)
   */
  account: string;

  /**
   * Media file to upload
   */
  file: Uploadable;

  is_long_video?: boolean;
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

export declare namespace Media {
  export {
    type MediaCreateResponse as MediaCreateResponse,
    type MediaDownloadResponse as MediaDownloadResponse,
    type MediaCreateParams as MediaCreateParams,
    type MediaDownloadParams as MediaDownloadParams,
  };
}
