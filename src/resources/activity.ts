// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Account activity log
 */
export class Activity extends APIResource {
  /**
   * Returns the account's activity log, newest first, with the Activity page's
   * filters. It covers write actions, extractions, monitor changes and events,
   * webhooks, giveaways, media, support, API keys, X account connections and
   * billing.
   *
   * @example
   * ```ts
   * const rows = await client.activity.list({
   *   category: 'monitors',
   *   limit: 50,
   * });
   * ```
   */
  list(
    query: ActivityListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ActivityListResponse> {
    return this._client.get('/activity', { query, ...options });
  }

  /**
   * Returns 1 activity of the account with its full technical record. It covers
   * write actions, extractions and monitor changes. The record holds the request,
   * the caller, the charge, every timestamp in UTC and related activity. It never
   * holds an API key value or another account's data.
   *
   * @example
   * ```ts
   * const activityRecord = await client.activity.retrieve('naF3xqHLWDTs');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<ActivityRecord> {
    return this._client.get(path`/activity/${id}`, options);
  }

  /**
   * Downloads the activity log rows as a CSV, Excel, JSON, Markdown, PDF or text
   * file, with the same filters as list.
   *
   * @example
   * ```ts
   * const response = await client.activity.export({ format: 'csv' });
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  export(query: ActivityExportParams, options?: RequestOptions): APIPromise<Response> {
    return this._client.get('/activity', {
      query,
      ...options,
      headers: buildHeaders([{ Accept: 'application/octet-stream' }, options?.headers]),
      __binaryResponse: true,
    });
  }
}

/**
 * 1 Activity log row. A cut list ends with a row whose category is notice and
 * whose activity says where it stopped.
 */
export interface ActivityLogRow {
  /**
   * Activity ID.
   */
  id: string;

  activity: string;

  category: string;

  /**
   * Credits, or an empty string when the activity has none.
   */
  credits: number | string;

  details: string;

  link: string;

  /**
   * Result count, or an empty string when the activity has none.
   */
  results: number | string;

  source: string;

  status: string;

  target: string;

  /**
   * ISO 8601 time in UTC to the millisecond. Empty on the notice row.
   */
  time: string;

  type: string;
}

/**
 * Full technical record of 1 activity. Timestamps are ISO 8601 in UTC to the
 * millisecond.
 */
export interface ActivityRecord {
  /**
   * Activity ID.
   */
  id: string;

  caller: ActivityRecord.Caller;

  /**
   * Credits charged for this activity.
   */
  charge: ActivityRecord.Charge | null;

  /**
   * Fields of this kind of activity, such as its target.
   */
  details: { [key: string]: string | number | boolean | null };

  kind: 'write_action' | 'extraction' | 'monitor_change';

  object: 'activity';

  /**
   * Up to 5 other activities on the same subject within 7 days, newest first.
   */
  related: Array<ActivityRecord.Related>;

  /**
   * The API request behind this activity. Null for activity from before Oct 30,
   * 2026.
   */
  request: ActivityRecord.Request | null;

  /**
   * ID of the API request behind this activity.
   */
  requestId: string | null;

  status: 'completed' | 'running' | 'failed' | 'canceled';

  timestamps: ActivityRecord.Timestamps;

  /**
   * Write action type, extraction tool type or monitor change.
   */
  type: string;

  /**
   * Dashboard page of this activity.
   */
  url: string;
}

export namespace ActivityRecord {
  export interface Caller {
    /**
     * Name and prefix of the API key used. Never its value.
     */
    apiKey: Caller.APIKey | null;

    authMethod: 'api_key' | 'oauth' | 'session' | null;

    oauthClient: Caller.OAuthClient | null;
  }

  export namespace Caller {
    /**
     * Name and prefix of the API key used. Never its value.
     */
    export interface APIKey {
      name: string;

      prefix: string;
    }

    export interface OAuthClient {
      id: string;

      name: string;
    }
  }

  /**
   * Credits charged for this activity.
   */
  export interface Charge {
    at: string;

    balanceAfter: number;

    credits: number;
  }

  export interface Related {
    id: string;

    createdAt: string;

    status: 'completed' | 'running' | 'failed' | 'canceled';

    type: string;

    url: string;
  }

  /**
   * The API request behind this activity. Null for activity from before Oct 30,
   * 2026.
   */
  export interface Request {
    at: string;

    durationMs: number;

    httpStatus: number;

    ipAddress: string | null;

    method: 'DELETE' | 'PATCH' | 'POST' | 'PUT';

    path: string;

    userAgent: string | null;
  }

  export interface Timestamps {
    createdAt: string;

    completedAt?: string;

    confirmedAt?: string;

    expiresAt?: string;

    updatedAt?: string;
  }
}

export type ActivityListResponse = Array<ActivityLogRow>;

export interface ActivityListParams {
  /**
   * Activity group, like the Activity page's tabs. `all` by default, or `actions`,
   * `extractions`, `monitors`, `webhooks` or `billing`.
   */
  category?: string;

  /**
   * Most rows to return, from 1 to 100,000. 100 by default. PDF stops at 10,000
   * rows.
   */
  limit?: number;

  /**
   * Search text.
   */
  q?: string;

  /**
   * Oldest time, ISO 8601.
   */
  since?: string;

  /**
   * Comma-separated statuses.
   */
  status?: string;

  /**
   * Newest time, ISO 8601.
   */
  until?: string;
}

export interface ActivityExportParams extends ActivityListParams {
  /**
   * File format.
   */
  format: 'csv' | 'json' | 'md' | 'md-document' | 'pdf' | 'txt' | 'xlsx';
}

export declare namespace Activity {
  export {
    type ActivityLogRow as ActivityLogRow,
    type ActivityRecord as ActivityRecord,
    type ActivityListResponse as ActivityListResponse,
    type ActivityListParams as ActivityListParams,
    type ActivityExportParams as ActivityExportParams,
  };
}
