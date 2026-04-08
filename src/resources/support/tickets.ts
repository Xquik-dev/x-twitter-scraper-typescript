// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
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
  create(body: TicketCreateParams, options?: RequestOptions): APIPromise<TicketCreateResponse> {
    return this._client.post('/support/tickets', { body, ...options });
  }

  /**
   * Get ticket with all messages
   *
   * @example
   * ```ts
   * const ticket = await client.support.tickets.retrieve(
   *   'messages_value',
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
   * const ticket = await client.support.tickets.update('id', {
   *   status: 'resolved',
   * });
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
   * const response = await client.support.tickets.reply('id', {
   *   body: 'Thank you for the update.',
   * });
   * ```
   */
  reply(id: string, body: TicketReplyParams, options?: RequestOptions): APIPromise<TicketReplyResponse> {
    return this._client.post(path`/support/tickets/${id}/messages`, { body, ...options });
  }
}

export interface TicketCreateResponse {
  publicId?: string;
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
    body?: string;

    createdAt?: string;

    sender?: string;
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
  publicId?: string;
}

export interface TicketCreateParams {
  body: string;

  subject: string;
}

export interface TicketUpdateParams {
  status: 'open' | 'resolved' | 'closed';
}

export interface TicketReplyParams {
  body: string;
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
