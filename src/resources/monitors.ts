// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Real-time X account monitoring
 */
export class Monitors extends APIResource {
  /**
   * Create monitor
   */
  create(body: MonitorCreateParams, options?: RequestOptions): APIPromise<MonitorCreateResponse> {
    return this._client.post('/monitors', { body, ...options });
  }

  /**
   * Get monitor
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<Monitor> {
    return this._client.get(path`/monitors/${id}`, options);
  }

  /**
   * Update monitor
   */
  update(id: string, body: MonitorUpdateParams, options?: RequestOptions): APIPromise<Monitor> {
    return this._client.patch(path`/monitors/${id}`, { body, ...options });
  }

  /**
   * List monitors
   */
  list(options?: RequestOptions): APIPromise<MonitorListResponse> {
    return this._client.get('/monitors', options);
  }

  /**
   * Deactivate monitor
   */
  deactivate(id: string, options?: RequestOptions): APIPromise<MonitorDeactivateResponse> {
    return this._client.delete(path`/monitors/${id}`, options);
  }
}

export interface Monitor {
  id: string;

  createdAt: string;

  eventTypes: Array<Shared.EventType>;

  isActive: boolean;

  username: string;

  xUserId: string;
}

export interface MonitorCreateResponse {
  id: string;

  createdAt: string;

  eventTypes: Array<Shared.EventType>;

  username: string;

  xUserId: string;
}

export interface MonitorListResponse {
  monitors: Array<Monitor>;

  total: number;
}

export interface MonitorDeactivateResponse {
  success: true;
}

export interface MonitorCreateParams {
  eventTypes: Array<Shared.EventType>;

  /**
   * X username (without @)
   */
  username: string;
}

export interface MonitorUpdateParams {
  eventTypes?: Array<Shared.EventType>;

  isActive?: boolean;
}

export declare namespace Monitors {
  export {
    type Monitor as Monitor,
    type MonitorCreateResponse as MonitorCreateResponse,
    type MonitorListResponse as MonitorListResponse,
    type MonitorDeactivateResponse as MonitorDeactivateResponse,
    type MonitorCreateParams as MonitorCreateParams,
    type MonitorUpdateParams as MonitorUpdateParams,
  };
}
