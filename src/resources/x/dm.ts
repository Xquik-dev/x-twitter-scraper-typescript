// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Dm extends APIResource {
  /**
   * Get DM conversation history
   *
   * @example
   * ```ts
   * const response = await client.x.dm.retrieveHistory(
   *   'userId',
   *   { account: 'account' },
   * );
   * ```
   */
  retrieveHistory(
    userID: string,
    query: DmRetrieveHistoryParams,
    options?: RequestOptions,
  ): APIPromise<DmRetrieveHistoryResponse> {
    return this._client.get(path`/x/dm/${userID}/history`, { query, ...options });
  }

  /**
   * Send direct message
   *
   * @example
   * ```ts
   * const response = await client.x.dm.send('userId', {
   *   account: '@elonmusk',
   *   text: 'Example text content',
   *   'Idempotency-Key': 'Idempotency-Key',
   *   media_ids: ['1234567890123456789'],
   * });
   * ```
   */
  send(userID: string, params: DmSendParams, options?: RequestOptions): APIPromise<DmSendResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post(path`/x/dm/${userID}`, {
      body,
      ...options,
      headers: buildHeaders([{ 'Idempotency-Key': idempotencyKey }, options?.headers]),
    });
  }
}

export interface DmRetrieveHistoryResponse {
  has_next_page: boolean;

  messages: Array<DmRetrieveHistoryResponse.Message>;

  next_cursor: string;
}

export namespace DmRetrieveHistoryResponse {
  export interface Message {
    id: string;

    receiverId: string;

    senderId: string;

    createdAt?: string;

    /**
     * URL of attached media (image, GIF, or video). Omitted when the message has no
     * media attachment.
     */
    mediaUrl?: string;

    text?: string;
  }
}

/**
 * Durable write lifecycle record. Poll statusUrl until terminal is true. Reusing
 * the original Idempotency-Key returns this same record. Submit a new write only
 * when safeToRetry is true, using a new key.
 */
export interface DmSendResponse {
  id: string;

  /**
   * Connected account selected for the write.
   */
  account: DmSendResponse.Account | null;

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
  billing: DmSendResponse.Billing;

  charged: boolean;

  chargedCredits: string;

  /**
   * Exact follow-up an API client or agent should perform.
   */
  nextAction: DmSendResponse.NextAction | null;

  object: 'x_write_action';

  pollAfterMs: number | null;

  /**
   * Stable fingerprint and sanitized payload for replay checks.
   */
  request: DmSendResponse.Request;

  /**
   * Confirmed result produced by the write, when available.
   */
  result: DmSendResponse.Result | null;

  /**
   * True only when a new attempt can reasonably succeed.
   */
  retryable: boolean;

  /**
   * True only when no write was dispatched and a new idempotency key may be used.
   */
  safeToRetry: boolean;

  sendDispatched: boolean;

  status: 'accepted' | 'dispatching' | 'pending_confirmation' | 'success' | 'failed' | 'expired';

  statusUrl: string;

  success: boolean;

  /**
   * Existing X resource targeted by the write, when applicable.
   */
  target: DmSendResponse.Target | null;

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

export namespace DmSendResponse {
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

export interface DmRetrieveHistoryParams {
  /**
   * X handle (without the `@` prefix) of the connected X account used to read the
   * conversation. The account must be a participant in the conversation.
   */
  account: string;

  /**
   * Pagination cursor for DM history
   */
  cursor?: string;

  /**
   * Legacy pagination cursor (backward compat)
   */
  maxId?: string;
}

export interface DmSendParams {
  /**
   * Body param: X account (@username or ID) sending the DM
   */
  account: string;

  /**
   * Body param
   */
  text: string;

  /**
   * Header param: Generate one unique value for each intended write. Reuse it only
   * when retrying the exact same account, action, target, and payload. A reused key
   * returns the original action. Reusing it with different input returns 409. Replay
   * protection remains active for at least 90 days.
   */
  'Idempotency-Key': string;

  /**
   * Body param: Optional array containing exactly 1 uploaded media ID.
   */
  media_ids?: Array<string>;
}

export declare namespace Dm {
  export {
    type DmRetrieveHistoryResponse as DmRetrieveHistoryResponse,
    type DmSendResponse as DmSendResponse,
    type DmRetrieveHistoryParams as DmRetrieveHistoryParams,
    type DmSendParams as DmSendParams,
  };
}
