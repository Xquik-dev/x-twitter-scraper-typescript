// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as TicketsAPI from './tickets';
import {
  TicketCreateParams,
  TicketCreateResponse,
  TicketListResponse,
  TicketReplyParams,
  TicketReplyResponse,
  TicketRetrieveResponse,
  TicketUpdateParams,
  TicketUpdateResponse,
  Tickets,
} from './tickets';

export class Support extends APIResource {
  tickets: TicketsAPI.Tickets = new TicketsAPI.Tickets(this._client);
}

Support.Tickets = Tickets;

export declare namespace Support {
  export {
    Tickets as Tickets,
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
