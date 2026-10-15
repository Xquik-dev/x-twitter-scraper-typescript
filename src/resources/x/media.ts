// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { type Uploadable } from '../../core/uploads';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { maybeMultipartFormRequestOptions } from '../../internal/uploads';

export class Media extends APIResource {
  /**
   * Downloads images and videos attached to selected tweets.
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
   * Uploads media and returns an identifier for later writes.
   *
   * @example
   * ```ts
   * const response = await client.x.media.upload({
   *   account: '@elonmusk',
   *   url: 'https://example.com/image.png',
   *   'Idempotency-Key': 'Idempotency-Key',
   * });
   * ```
   */
  upload(params: MediaUploadParams, options?: RequestOptions): APIPromise<MediaUploadResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post(
      '/x/media',
      maybeMultipartFormRequestOptions(
        {
          body,
          ...options,
          headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
        },
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

/**
 * Durable write record. Poll statusUrl until terminal is true. Reusing its
 * Idempotency-Key returns this record. Create another action only when safeToRetry
 * is true.
 */
export interface MediaUploadResponse {
  id: string;

  /**
   * Connected account selected for the write.
   */
  account: MediaUploadResponse.Account | null;

  action:
    | 'create_tweet'
    | 'delete_tweet'
    | 'like'
    | 'unlike'
    | 'retweet'
    | 'unretweet'
    | 'follow'
    | 'unfollow'
    | 'remove_follower'
    | 'send_dm'
    | 'delete_dm'
    | 'upload_media'
    | 'update_profile'
    | 'update_avatar'
    | 'update_banner'
    | 'create_community'
    | 'delete_community'
    | 'join_community'
    | 'leave_community';

  /**
   * plannedCredits is the approved maximum. chargedCredits comes from the settled
   * credit ledger. Pending or failed writes are not charged.
   */
  billing: MediaUploadResponse.Billing;

  charged: boolean;

  chargedCredits: string;

  /**
   * Exact follow-up an API client or agent should perform.
   */
  nextAction: MediaUploadResponse.NextAction | null;

  object: 'x_write_action';

  pollAfterMs: number | null;

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  request: MediaUploadResponse.Request;

  /**
   * Confirmed result produced by the write, when available.
   */
  result: MediaUploadResponse.Result | null;

  /**
   * True only when a new attempt can reasonably succeed.
   */
  retryable: boolean;

  /**
   * True only when X did not get the write and a new idempotency key may be used.
   */
  safeToRetry: boolean;

  sendDispatched: boolean;

  status: 'accepted' | 'dispatching' | 'pending_confirmation' | 'success' | 'failed' | 'expired';

  statusUrl: string;

  success: boolean;

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  target: MediaUploadResponse.Target | null;

  targetId: string | null;

  terminal: boolean;

  writeActionId: string;

  /**
   * Compatibility field for a confirmed community ID.
   */
  communityId?: string;

  /**
   * Confirmed community name when available.
   */
  communityName?: string;

  completedAt?: string;

  confirmationAttempts?: number;

  confirmationCheckedAt?: string;

  confirmedAt?: string;

  createdAt?: string;

  /**
   * Structured recovery context for a failed write.
   */
  details?: { [key: string]: unknown };

  error?: string;

  /**
   * Deadline for resolving a non-terminal write. This is not the Idempotency-Key
   * retention deadline.
   */
  expiresAt?: string;

  /**
   * True when this answers a retry of an earlier request with the same
   * Idempotency-Key.
   */
  idempotent?: boolean;

  /**
   * Media count, kind, size, and billing details when used.
   */
  media?: { [key: string]: unknown };

  /**
   * Compatibility field for a confirmed media upload ID.
   */
  mediaId?: string;

  /**
   * Public media URL when the upload creates one.
   */
  mediaUrl?: string;

  message?: string;

  /**
   * Compatibility field for a confirmed direct message ID.
   */
  messageId?: string;

  requestHash?: string;

  requestId?: string;

  /**
   * Compatibility result ID for other write actions.
   */
  resultId?: string;

  /**
   * Dispatch timestamp when the write reached execution.
   */
  sendDispatchedAt?: string;

  /**
   * Compatibility field for a confirmed tweet result ID.
   */
  tweetId?: string;

  updatedAt?: string;
}

export namespace MediaUploadResponse {
  /**
   * Connected account selected for the write.
   */
  export interface Account {
    id: string;

    username: string;
  }

  /**
   * plannedCredits is the approved maximum. chargedCredits comes from the settled
   * credit ledger. Pending or failed writes are not charged.
   */
  export interface Billing {
    charged: boolean;

    chargedCredits: string;

    plannedCredits: string;

    status: 'not_charged' | 'pending' | 'charged' | 'charge_failed' | 'refunded';
  }

  /**
   * Exact follow-up an API client or agent should perform.
   */
  export interface NextAction {
    type: 'poll' | 'retry' | 'verify_result' | 'fix_request';

    /**
     * Milliseconds to wait before you poll or retry.
     */
    afterMs?: number;

    requiresNewIdempotencyKey?: boolean;

    url?: string;
  }

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  export interface Request {
    /**
     * Stable hash of account, action, target, and payload.
     */
    hash: string | null;

    /**
     * Exact sanitized payload dispatched for this action.
     */
    payload: { [key: string]: unknown } | null;
  }

  /**
   * Confirmed result produced by the write, when available.
   */
  export interface Result {
    id?: string;

    state?: string;

    type?: 'tweet' | 'direct_message' | 'media' | 'community' | 'state_change';
  }

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  export interface Target {
    id: string;

    type: 'tweet' | 'user' | 'community';
  }
}

export interface MediaDownloadParams {
  /**
   * Numeric tweet ID alias for tweetInput
   */
  tweetId?: string;

  /**
   * Up to 50 tweet URLs or IDs. An item that names no post gets 400
   * `invalid_tweet_id`, which says which item.
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
   * Body param: X account (@username or ID) uploading media
   */
  account: string;

  /**
   * Body param: Media file to upload, up to 15 MB. A larger file gets 413
   * `media_too_large` before any account lookup.
   */
  file?: Uploadable;

  /**
   * Body param: Set true only for video/mp4 multipart uploads longer than 140
   * seconds.
   */
  is_long_video?: boolean;

  /**
   * Body param: HTTPS URL to download and upload as media, up to 15 MB. Another
   * scheme gets 400 `invalid_media_url`.
   */
  url?: string;

  /**
   * Header param: Use one unique value per intended write. Reuse it only for an
   * identical retry. A matching retry returns the first answer again, with
   * idempotent: true added. It keeps the first status, body & Retry-After. It sends
   * nothing to X & charges nothing. While the first request runs, a retry returns
   * 202 & the action. Different input returns 409. Protection lasts at least 90
   * days.
   */
  'Idempotency-Key': string;
}

export declare namespace Media {
  export {
    type MediaDownloadResponse as MediaDownloadResponse,
    type MediaUploadResponse as MediaUploadResponse,
    type MediaDownloadParams as MediaDownloadParams,
    type MediaUploadParams as MediaUploadParams,
  };
}
