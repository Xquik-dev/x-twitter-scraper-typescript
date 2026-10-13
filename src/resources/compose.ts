// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * AI tweet composition, drafts, writing styles, and radar
 */
export class Compose extends APIResource {
  /**
   * Uses xai-org/x-algorithm facts to compose and refine text. Score checks text. It
   * never predicts reach or engagement.
   *
   * @example
   * ```ts
   * const compose = await client.compose.create({
   *   step: 'compose',
   *   topic: 'PostgreSQL query planning',
   *   goal: 'engagement',
   *   styleUsername: 'example_user',
   * });
   * ```
   */
  create(body: ComposeCreateParams, options?: RequestOptions): APIPromise<ComposeCreateResponse> {
    return this._client.post('/compose', { body, ...options });
  }
}

/**
 * Rules, questions, and research guidance for drafting a post.
 */
export type ComposeCreateResponse =
  | ComposeCreateResponse.ComposePrepareResult
  | ComposeCreateResponse.ComposeRefineResult
  | ComposeCreateResponse.ComposeScoreResult;

export namespace ComposeCreateResponse {
  /**
   * Rules, questions, and research guidance for drafting a post.
   */
  export interface ComposePrepareResult {
    /**
     * Facts derived only from xai-org/x-algorithm.
     */
    contentRules: Array<ComposePrepareResult.ContentRule>;

    /**
     * Source ranking signals. Repository defaults may vary in production.
     */
    engagementMultipliers: Array<ComposePrepareResult.EngagementMultiplier>;

    /**
     * Publication limit for timing and decay claims.
     */
    engagementVelocity: string;

    followUpQuestions: Array<string>;

    /**
     * X post intent seeded with the topic.
     */
    intentUrl: string;

    nextStep: string;

    /**
     * Deprecated compatibility field. Always empty.
     *
     * @deprecated
     */
    radarRecommendations: Array<ComposePrepareResult.RadarRecommendation>;

    /**
     * Source signals with production values withheld as null.
     */
    scorerWeights: Array<ComposePrepareResult.ScorerWeight>;

    /**
     * Signal source and evidence limits.
     */
    source: string;

    /**
     * Negative engagement predictions in the public model.
     */
    topPenalties: Array<string>;

    /**
     * Style analyses saved to the account.
     */
    savedStyles?: Array<ComposePrepareResult.SavedStyle>;

    /**
     * Next action when no cached style is available.
     */
    styleNote?: string;

    /**
     * Cached examples for the requested style username.
     */
    styleTweets?: Array<string>;
  }

  export namespace ComposePrepareResult {
    /**
     * One source-backed ranking fact returned during preparation.
     */
    export interface ContentRule {
      rule: string;
    }

    /**
     * One ranking signal and its source-value limit.
     */
    export interface EngagementMultiplier {
      /**
       * Human-readable published signal name.
       */
      action: string;

      multiplier: 'Source default; production value can vary';
    }

    /**
     * Deprecated compatibility schema. The response array is empty.
     *
     * @deprecated
     */
    export interface RadarRecommendation {
      /**
       * Radar endpoint for this source.
       */
      endpoint: string;

      /**
       * Source-specific drafting guidance.
       */
      guidance: string;

      source: 'reddit' | 'github' | 'trustmrr' | 'hacker_news' | 'google_trends' | 'wikipedia' | 'polymarket';

      /**
       * Current-topic research this source supports.
       */
      useFor: string;
    }

    /**
     * One source ranking signal without a production claim.
     */
    export interface ScorerWeight {
      /**
       * Signal direction and production limit.
       */
      context: string;

      /**
       * Signal name from X's public ranking repository.
       */
      signal: string;

      /**
       * Null prevents source defaults becoming production claims.
       */
      weight: null;
    }

    /**
     * A saved username style and analyzed post count.
     */
    export interface SavedStyle {
      /**
       * Whole number from 0.
       */
      tweetCount: number;

      username: string;
    }
  }

  /**
   * Source-backed guidance for refining a post.
   */
  export interface ComposeRefineResult {
    /**
     * Request context and xai-org/x-algorithm guidance.
     */
    compositionGuidance: Array<string>;

    /**
     * @deprecated
     */
    examplePatterns: Array<ComposeRefineResult.ExamplePattern>;

    /**
     * X post intent generated for the refined topic.
     */
    intentUrl: string;

    nextStep: string;
  }

  export namespace ComposeRefineResult {
    /**
     * Deprecated example-pattern schema. The response array is empty.
     *
     * @deprecated
     */
    export interface ExamplePattern {
      description: string;

      pattern: string;
    }
  }

  /**
   * Posting validation without a fabricated ranking score.
   */
  export interface ComposeScoreResult {
    /**
     * Deterministic input validation. Not a reach prediction.
     */
    checklist: Array<ComposeScoreResult.Checklist>;

    nextStep: string;

    passed: boolean;

    passedCount: number;

    topSuggestion: string;

    totalChecks: 1;

    /**
     * Present only when every check passes.
     */
    intentUrl?: string;
  }

  export namespace ComposeScoreResult {
    /**
     * One deterministic draft check.
     */
    export interface Checklist {
      factor: string;

      passed: boolean;

      /**
       * Present only when the check fails.
       */
      suggestion?: string;
    }
  }
}

/**
 * Inputs for preparing source-backed post guidance.
 */
export type ComposeCreateParams =
  | ComposeCreateParams.ComposePrepareRequest
  | ComposeCreateParams.ComposeRefineRequest
  | ComposeCreateParams.ComposeScoreRequest;

export declare namespace ComposeCreateParams {
  /**
   * Inputs for preparing source-backed post guidance.
   */
  export interface ComposePrepareRequest {
    step: 'compose';

    /**
     * Subject for the post.
     */
    topic: string;

    /**
     * User goal used for one follow-up question.
     */
    goal?: 'engagement' | 'followers' | 'authority' | 'conversation';

    /**
     * Username from a style analysis saved to this account.
     */
    styleUsername?: string;

    [k: string]: unknown;
  }

  /**
   * Inputs for refining a post plan.
   */
  export interface ComposeRefineRequest {
    /**
     * User goal interpreted against published ranking signals.
     */
    goal: 'engagement' | 'followers' | 'authority' | 'conversation';

    step: 'refine';

    /**
     * Requested writing tone.
     */
    tone: string;

    /**
     * Subject to refine into a post.
     */
    topic: string;

    /**
     * Audience, constraints, sources, or other writing context.
     */
    additionalContext?: string;

    /**
     * Specific action the draft should request.
     */
    callToAction?: string;

    /**
     * Planned media type.
     */
    mediaType?: 'photo' | 'video' | 'none';

    [k: string]: unknown;
  }

  /**
   * Inputs for checking a post draft.
   */
  export interface ComposeScoreRequest {
    /**
     * Full post text. The endpoint never assigns a ranking score.
     */
    draft: string;

    step: 'score';

    /**
     * @deprecated Ignored. Remove this field.
     */
    hasLink?: boolean;

    /**
     * @deprecated Ignored. Remove this field.
     */
    hasMedia?: boolean;

    [k: string]: unknown;
  }
}

export declare namespace Compose {
  export {
    type ComposeCreateResponse as ComposeCreateResponse,
    type ComposeCreateParams as ComposeCreateParams,
  };
}
