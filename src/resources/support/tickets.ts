// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { maybeMultipartFormRequestOptions } from '../../internal/uploads';
import { path } from '../../internal/utils/path';

/**
 * Support ticket management
 */
export class Tickets extends APIResource {
  /**
   * Create a support ticket
   *
   * @example
   * ```ts
   * const ticket = await client.support.tickets.create({
   *   body: 'I am unable to connect my X account. Please help.',
   *   subject: 'Cannot connect X account',
   * });
   * ```
   */
  create(params: TicketCreateParams, options?: RequestOptions): APIPromise<TicketCreateResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post(
      '/support/tickets',
      maybeMultipartFormRequestOptions(
        {
          body,
          ...options,
          headers: buildHeaders([
            { ...(idempotencyKey != null ? { 'Idempotency-Key': idempotencyKey } : undefined) },
            options?.headers,
          ]),
        },
        this._client,
      ),
    );
  }

  /**
   * Get ticket with all messages
   *
   * @example
   * ```ts
   * const ticket = await client.support.tickets.retrieve(
   *   'tkt_a1b2c3d4e5f6a1b2c3d4e5f6',
   * );
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<TicketRetrieveResponse> {
    return this._client.get(path`/support/tickets/${id}`, options);
  }

  /**
   * Update ticket status
   *
   * @example
   * ```ts
   * const ticket = await client.support.tickets.update(
   *   'tkt_a1b2c3d4e5f6a1b2c3d4e5f6',
   *   { status: 'resolved' },
   * );
   * ```
   */
  update(id: string, body: TicketUpdateParams, options?: RequestOptions): APIPromise<TicketUpdateResponse> {
    return this._client.patch(path`/support/tickets/${id}`, { body, ...options });
  }

  /**
   * List user's support tickets
   *
   * @example
   * ```ts
   * const tickets = await client.support.tickets.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<TicketListResponse> {
    return this._client.get('/support/tickets', options);
  }

  /**
   * Reply to a support ticket
   *
   * @example
   * ```ts
   * const response = await client.support.tickets.reply(
   *   'tkt_a1b2c3d4e5f6a1b2c3d4e5f6',
   *   { body: 'Thank you for the update.' },
   * );
   * ```
   */
  reply(id: string, params: TicketReplyParams, options?: RequestOptions): APIPromise<TicketReplyResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post(
      path`/support/tickets/${id}/messages`,
      maybeMultipartFormRequestOptions(
        {
          body,
          ...options,
          headers: buildHeaders([
            { ...(idempotencyKey != null ? { 'Idempotency-Key': idempotencyKey } : undefined) },
            options?.headers,
          ]),
        },
        this._client,
      ),
    );
  }
}

export interface TicketCreateResponse {
  attachments: Array<TicketCreateResponse.Attachment>;

  publicId: string;
}

export namespace TicketCreateResponse {
  /**
   * Attachment identifier and initial processing state.
   */
  export interface Attachment {
    publicId: string;

    status: 'pending' | 'ready' | 'failed';
  }
}

export interface TicketRetrieveResponse {
  createdAt?: string;

  messages?: Array<TicketRetrieveResponse.Message>;

  publicId?: string;

  status?: string;

  subject?: string;

  updatedAt?: string;
}

export namespace TicketRetrieveResponse {
  export interface Message {
    attachments?: Array<Message.Attachment>;

    body?: string;

    createdAt?: string;

    sender?: string;
  }

  export namespace Message {
    /**
     * Downloadable image or video attached to a support message.
     */
    export interface Attachment {
      /**
       * Validated media type.
       */
      contentType:
        | 'image/jpeg'
        | 'image/png'
        | 'image/gif'
        | 'image/webp'
        | 'video/mp4'
        | 'video/quicktime'
        | 'video/webm';

      filename: string;

      /**
       * Attachment media class.
       */
      kind: 'image' | 'video';

      publicId: string;

      sizeBytes: number;

      /**
       * Storage processing state.
       */
      status: 'pending' | 'ready' | 'failed';

      url: string;
    }
  }
}

export interface TicketUpdateResponse {
  publicId?: string;

  status?: string;
}

export interface TicketListResponse {
  tickets?: Array<TicketListResponse.Ticket>;
}

export namespace TicketListResponse {
  export interface Ticket {
    createdAt?: string;

    messageCount?: number;

    publicId?: string;

    status?: string;

    subject?: string;

    updatedAt?: string;
  }
}

export interface TicketReplyResponse {
  attachments: Array<TicketReplyResponse.Attachment>;

  publicId: string;
}

export namespace TicketReplyResponse {
  /**
   * Attachment identifier and initial processing state.
   */
  export interface Attachment {
    publicId: string;

    status: 'pending' | 'ready' | 'failed';
  }
}

export interface TicketCreateParams {
  /**
   * Body param
   */
  body: string;

  /**
   * Body param
   */
  subject: string;

  /**
   * Header param: Generate one random value per ticket or reply. Reuse it only when
   * retrying identical text and attachments. Never log this value.
   */
  'Idempotency-Key'?: string;
}

export interface TicketUpdateParams {
  status: 'open' | 'resolved' | 'closed';
}

export interface TicketReplyParams {
  /**
   * Body param
   */
  body: string;

  /**
   * Header param: Generate one random value per ticket or reply. Reuse it only when
   * retrying identical text and attachments. Never log this value.
   */
  'Idempotency-Key'?: string;
}

export declare namespace Tickets {
  export {
    type TicketCreateResponse as TicketCreateResponse,
    type TicketRetrieveResponse as TicketRetrieveResponse,
    type TicketUpdateResponse as TicketUpdateResponse,
    type TicketListResponse as TicketListResponse,
    type TicketReplyResponse as TicketReplyResponse,
    type TicketCreateParams as TicketCreateParams,
    type TicketUpdateParams as TicketUpdateParams,
    type TicketReplyParams as TicketReplyParams,
  };
}
