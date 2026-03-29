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
   */
  create(body: TicketCreateParams, options?: RequestOptions): APIPromise<TicketCreateResponse> {
    return this._client.post('/support/tickets', { body, ...options });
  }

  /**
   * Get ticket with all messages
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<TicketRetrieveResponse> {
    return this._client.get(path`/support/tickets/${id}`, options);
  }

  /**
   * Update ticket status
   */
  update(id: string, body: TicketUpdateParams, options?: RequestOptions): APIPromise<TicketUpdateResponse> {
    return this._client.patch(path`/support/tickets/${id}`, { body, ...options });
  }

  /**
   * List user's support tickets
   */
  list(options?: RequestOptions): APIPromise<TicketListResponse> {
    return this._client.get('/support/tickets', options);
  }

  /**
   * Reply to a support ticket
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
