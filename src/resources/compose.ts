// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * AI tweet composition, drafts, writing styles, and radar
 */
export class Compose extends APIResource {
  /**
   * Compose, refine, or score a tweet
   *
   * @example
   * ```ts
   * const compose = await client.compose.create({
   *   step: 'compose',
   *   goal: 'engagement',
   *   topic: 'AI trends in 2025',
   * });
   * ```
   */
  create(body: ComposeCreateParams, options?: RequestOptions): APIPromise<ComposeCreateResponse> {
    return this._client.post('/compose', { body, ...options });
  }
}

export interface ComposeCreateResponse {
  /**
   * AI feedback on the draft
   */
  feedback?: string;

  /**
   * Engagement score (0-100)
   */
  score?: number;

  /**
   * Improvement suggestions
   */
  suggestions?: Array<string>;

  /**
   * Generated or refined tweet text
   */
  text?: string;

  [k: string]: unknown;
}

export interface ComposeCreateParams {
  /**
   * Workflow step
   */
  step: 'compose' | 'refine' | 'score';

  /**
   * Extra context or URLs (refine)
   */
  additionalContext?: string;

  /**
   * Desired call to action (refine)
   */
  callToAction?: string;

  /**
   * Tweet draft text to evaluate (score)
   */
  draft?: string;

  /**
   * Optimization goal
   */
  goal?: 'engagement' | 'followers' | 'authority' | 'conversation';

  /**
   * Whether a link is attached (score)
   */
  hasLink?: boolean;

  /**
   * Whether media is attached (score)
   */
  hasMedia?: boolean;

  /**
   * Media type (refine)
   */
  mediaType?: 'photo' | 'video' | 'none';

  /**
   * Cached style username for voice matching (compose)
   */
  styleUsername?: string;

  /**
   * Desired tone (refine)
   */
  tone?: string;

  /**
   * Tweet topic (compose, refine)
   */
  topic?: string;
}

export declare namespace Compose {
  export {
    type ComposeCreateResponse as ComposeCreateResponse,
    type ComposeCreateParams as ComposeCreateParams,
  };
}
