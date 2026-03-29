// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Dm extends APIResource {
  /**
   * Send direct message
   */
  update(userID: string, body: DmUpdateParams, options?: RequestOptions): APIPromise<DmUpdateResponse> {
    return this._client.post(path`/x/dm/${userID}`, { body, ...options });
  }

  /**
   * Get DM conversation history
   */
  retrieveHistory(
    userID: string,
    query: DmRetrieveHistoryParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DmRetrieveHistoryResponse> {
    return this._client.get(path`/x/dm/${userID}/history`, { query, ...options });
  }
}

export interface DmUpdateResponse {
  messageId: string;

  success: true;
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

export interface DmUpdateParams {
  /**
   * X account (@username or account ID)
   */
  account: string;

  text: string;

  media_ids?: Array<string>;

  reply_to_message_id?: string;
}

export interface DmRetrieveHistoryParams {
  /**
   * Pagination cursor from previous response
   */
  cursor?: string;

  /**
   * Legacy pagination cursor (backward compat)
   */
  maxId?: string;
}

export declare namespace Dm {
  export {
    type DmUpdateResponse as DmUpdateResponse,
    type DmRetrieveHistoryResponse as DmRetrieveHistoryResponse,
    type DmUpdateParams as DmUpdateParams,
    type DmRetrieveHistoryParams as DmRetrieveHistoryParams,
  };
}
