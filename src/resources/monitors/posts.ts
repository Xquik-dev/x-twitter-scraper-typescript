// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Post monitoring with replies, quotes, edits, deletion & 6 metrics
 */
export class Posts extends APIResource {
  /**
   * Creates a monitor for 1 X post. It tracks replies, quotes, edits, deletion
   * & 6 metrics, for 30 credits an hour with events & webhook deliveries
   * included. That hourly price is a monitor's only charge. Creation needs the
   * credits of the first hour & reads the post once.
   *
   * @example
   * ```ts
   * const postMonitor = await client.monitors.posts.create({
   *   post: 'https://x.com/xquik/status/2104984505677430978',
   * });
   * ```
   */
  create(body: PostCreateParams, options?: RequestOptions): APIPromise<PostMonitor> {
    return this._client.post('/monitors/posts', { body, ...options });
  }

  /**
   * Returns 1 post monitor with its post & the 6 metrics, each with its current
   * value & gain since tracking began.
   *
   * @example
   * ```ts
   * const postMonitor = await client.monitors.posts.retrieve('id');
   * ```
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<PostMonitor> {
    return this._client.get(path`/monitors/posts/${id}`, options);
  }

  /**
   * Updates a post monitor's label, event types or active state. Turning a
   * paused monitor on reads the post first, & answers 409 while X hides it.
   *
   * @example
   * ```ts
   * const postMonitor = await client.monitors.posts.update('id', {
   *   isActive: false,
   * });
   * ```
   */
  update(id: string, body: PostUpdateParams, options?: RequestOptions): APIPromise<PostMonitor> {
    return this._client.patch(path`/monitors/posts/${id}`, { body, ...options });
  }

  /**
   * Returns post monitors with each post's 6 metrics, their current values &
   * gains since tracking began.
   *
   * @example
   * ```ts
   * const posts = await client.monitors.posts.list();
   * ```
   */
  list(
    query: PostListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostListResponse> {
    return this._client.get('/monitors/posts', { query, ...options });
  }

  /**
   * Stops 1 post monitor, then removes its stored events & metric history in
   * bounded batches. Poll statusUrl until the monitor returns 404.
   *
   * @example
   * ```ts
   * const post = await client.monitors.posts.delete('id');
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<PostDeleteResponse> {
    return this._client.delete(path`/monitors/posts/${id}`, options);
  }

  /**
   * Returns 1 bucket per hour with each metric's value at the hour's end & its
   * gain over that hour. The last bucket is the current hour. Hours before
   * tracking began carry the starting values with a gain of 0.
   *
   * @example
   * ```ts
   * const postMonitorMetrics = await client.monitors.posts.retrieveMetrics('id');
   * ```
   */
  retrieveMetrics(
    id: string,
    query: PostRetrieveMetricsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PostMonitorMetrics> {
    return this._client.get(path`/monitors/posts/${id}/metrics`, { query, ...options });
  }
}

/**
 * A post event type.
 */
export type PostEventType =
  | 'post.reply.new'
  | 'post.quote.new'
  | 'post.likes.changed'
  | 'post.retweets.changed'
  | 'post.replies.changed'
  | 'post.quotes.changed'
  | 'post.bookmarks.changed'
  | 'post.views.changed'
  | 'post.edited'
  | 'post.deleted';

/**
 * A metric's current value & its gain since tracking began. Both are null when
 * X shows no count, as for views on old posts.
 */
export interface PostMetricReading {
  current: number | null;

  gain: number | null;
}

/**
 * The 6 metrics of a post.
 */
export interface PostMetrics {
  /**
   * A metric's current value & its gain since tracking began. Both are null
   * when X shows no count, as for views on old posts.
   */
  views: PostMetricReading;

  /**
   * A metric's current value & its gain since tracking began. Both are null
   * when X shows no count, as for views on old posts.
   */
  likes: PostMetricReading;

  /**
   * A metric's current value & its gain since tracking began. Both are null
   * when X shows no count, as for views on old posts.
   */
  retweets: PostMetricReading;

  /**
   * A metric's current value & its gain since tracking began. Both are null
   * when X shows no count, as for views on old posts.
   */
  replies: PostMetricReading;

  /**
   * A metric's current value & its gain since tracking began. Both are null
   * when X shows no count, as for views on old posts.
   */
  quotes: PostMetricReading;

  /**
   * A metric's current value & its gain since tracking began. Both are null
   * when X shows no count, as for views on old posts.
   */
  bookmarks: PostMetricReading;
}

/**
 * Post monitor that tracks 1 X post's replies, quotes, edits & metrics.
 */
export interface PostMonitor {
  id: string;

  /**
   * ID of the post you gave.
   */
  postId: string;

  postUrl: string;

  /**
   * Permanent X user ID of the post's author.
   */
  authorId: string;

  authorUsername: string;

  authorName: string;

  /**
   * Text of the newest version Xquik read.
   */
  text: string;

  postedAt: string;

  /**
   * Post event types to send. Without it, a monitor sends new replies, new
   * quotes, like & retweet changes, edits & deletion.
   */
  eventTypes: Array<PostEventType>;

  isActive: boolean;

  createdAt: string;

  /**
   * Next hourly credit charge time for this post monitor.
   */
  nextBillingAt: string;

  /**
   * The 6 metrics of a post.
   */
  metrics: PostMetrics;

  /**
   * Customer-set label of the post monitor, when set.
   */
  name?: string;

  /**
   * Why Xquik paused this post monitor. insufficient_credits means the balance
   * could not pay an hour, so add credits & resume. The other 3 mean X stopped
   * showing the post. Absent when the monitor is active or you paused it
   * yourself.
   */
  pausedReason?: 'insufficient_credits' | 'x_post_deleted' | 'x_post_protected' | 'x_post_unavailable';

  /**
   * When Xquik paused this post monitor.
   */
  pausedAt?: string;
}

/**
 * A metric's value at the hour's end & its gain over that hour. Both are null
 * when X shows no count.
 */
export interface PostMetricPoint {
  value: number | null;

  gain: number | null;
}

export interface PostMonitorMetricsBucketMetrics {
  /**
   * A metric's value at the hour's end & its gain over that hour. Both are null
   * when X shows no count.
   */
  views: PostMetricPoint;

  /**
   * A metric's value at the hour's end & its gain over that hour. Both are null
   * when X shows no count.
   */
  likes: PostMetricPoint;

  /**
   * A metric's value at the hour's end & its gain over that hour. Both are null
   * when X shows no count.
   */
  retweets: PostMetricPoint;

  /**
   * A metric's value at the hour's end & its gain over that hour. Both are null
   * when X shows no count.
   */
  replies: PostMetricPoint;

  /**
   * A metric's value at the hour's end & its gain over that hour. Both are null
   * when X shows no count.
   */
  quotes: PostMetricPoint;

  /**
   * A metric's value at the hour's end & its gain over that hour. Both are null
   * when X shows no count.
   */
  bookmarks: PostMetricPoint;
}

export interface PostMonitorMetricsBucket {
  /**
   * Start of the hour.
   */
  at: string;

  metrics: PostMonitorMetricsBucketMetrics;
}

/**
 * Hourly metric buckets of 1 post monitor, oldest first.
 */
export interface PostMonitorMetrics {
  hours: number;

  buckets: Array<PostMonitorMetricsBucket>;
}

/**
 * A post metric's change since its last event, on post.likes.changed,
 * post.retweets.changed, post.replies.changed, post.quotes.changed,
 * post.bookmarks.changed & post.views.changed.
 */
export interface MonitorPostMetricChange {
  /**
   * Current count minus previous count.
   */
  change: number;

  /**
   * The count X shows now.
   */
  current: number;

  /**
   * The metric that changed.
   */
  metric: 'bookmarks' | 'likes' | 'quotes' | 'replies' | 'retweets' | 'views';

  /**
   * The count the last event of this metric reported.
   */
  previous: number;
}

/**
 * The post's text before & after an edit, on post.edited.
 */
export interface MonitorPostEdit {
  /**
   * The text before the edit.
   */
  previousText: string;

  /**
   * The text of the newest version.
   */
  text: string;

  /**
   * X's ID of the newest version of the post.
   */
  versionId: string;
}

/**
 * The last text the monitor saw, on post.deleted.
 */
export interface MonitorPostDeleted {
  /**
   * The post's text before its author deleted it.
   */
  text: string;
}

export interface PostListResponse {
  hasMore: boolean;

  monitors: Array<PostMonitor>;

  /**
   * Post monitors on this page.
   */
  total: number;

  nextCursor?: string;
}

export interface PostDeleteResponse {
  deletionStatus: 'deleting';

  /**
   * Poll this monitor URL until it returns 404.
   */
  statusUrl: string;

  success: true;
}

export interface PostCreateParams {
  /**
   * Post link or ID. x.com, twitter.com, mobile & /i/web/status/ links work
   * with any query string.
   */
  post: string;

  /**
   * Post event types to send. Without it, a monitor sends new replies, new
   * quotes, like & retweet changes, edits & deletion.
   */
  eventTypes?: Array<PostEventType>;

  /**
   * Your own label for the post monitor. Its events carry it as monitorName.
   */
  name?: string | null;
}

export interface PostUpdateParams {
  /**
   * Post event types to send. Without it, a monitor sends new replies, new
   * quotes, like & retweet changes, edits & deletion.
   */
  eventTypes?: Array<PostEventType>;

  isActive?: boolean;

  /**
   * New label for the post monitor. Send null to remove it.
   */
  name?: string | null;
}

export interface PostListParams {
  /**
   * Previous nextCursor. The after alias also works. Offset pagination is not
   * supported.
   */
  cursor?: string;

  /**
   * Maximum items per page, from 1 to 200. Default 200. Pass nextCursor as
   * cursor for the next page.
   */
  limit?: number;
}

export interface PostRetrieveMetricsParams {
  /**
   * Hours to return, from 1 to 720.
   */
  hours?: number;
}

export declare namespace Posts {
  export {
    type PostEventType as PostEventType,
    type PostMetricReading as PostMetricReading,
    type PostMetrics as PostMetrics,
    type PostMonitor as PostMonitor,
    type PostMetricPoint as PostMetricPoint,
    type PostMonitorMetricsBucketMetrics as PostMonitorMetricsBucketMetrics,
    type PostMonitorMetricsBucket as PostMonitorMetricsBucket,
    type PostMonitorMetrics as PostMonitorMetrics,
    type MonitorPostMetricChange as MonitorPostMetricChange,
    type MonitorPostEdit as MonitorPostEdit,
    type MonitorPostDeleted as MonitorPostDeleted,
    type PostListResponse as PostListResponse,
    type PostDeleteResponse as PostDeleteResponse,
    type PostCreateParams as PostCreateParams,
    type PostUpdateParams as PostUpdateParams,
    type PostListParams as PostListParams,
    type PostRetrieveMetricsParams as PostRetrieveMetricsParams,
  };
}
