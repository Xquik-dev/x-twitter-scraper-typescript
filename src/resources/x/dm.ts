// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
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
   * );
   * ```
   */
  retrieveHistory(
    userID: string,
    query: DmRetrieveHistoryParams | null | undefined = {},
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
   *   media_ids: ['1234567890123456789'],
   *   reply_to_message_id: '1234567890123456789',
   * });
   * ```
   */
  send(userID: string, body: DmSendParams, options?: RequestOptions): APIPromise<DmSendResponse> {
    return this._client.post(path`/x/dm/${userID}`, { body, ...options });
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

    createdAt?: string;

    receiverId?: string;

    senderId?: string;

    text?: string;
  }
}

export interface DmSendResponse {
  messageId: string;

  success: true;
}

export interface DmRetrieveHistoryParams {
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
   * X account (@username or ID) sending the DM
   */
  account: string;

  text: string;

  media_ids?: Array<string>;

  reply_to_message_id?: string;
}

export declare namespace Dm {
  export {
    type DmRetrieveHistoryResponse as DmRetrieveHistoryResponse,
    type DmSendResponse as DmSendResponse,
    type DmRetrieveHistoryParams as DmRetrieveHistoryParams,
    type DmSendParams as DmSendParams,
  };
}
