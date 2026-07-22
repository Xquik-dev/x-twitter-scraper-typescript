// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * AI tweet composition, drafts, writing styles, and radar
 */
export class Compose extends APIResource {
  /**
   * Run one step of Xquik's three-step writing workflow. Compose returns questions
   * and editorial rules. Refine returns goal-specific guidance. Score applies
   * deterministic text checks. It does not predict reach or expose X ranking
   * weights.
   *
   * @example
   * ```ts
   * const compose = await client.compose.create({
   *   step: 'compose',
   *   topic: 'PostgreSQL query planning',
   *   goal: 'engagement',
   * });
   * ```
   */
  create(body: ComposeCreateParams, options?: RequestOptions): APIPromise<ComposeCreateResponse> {
    return this._client.post('/compose', { body, ...options });
  }
}

export type ComposeCreateResponse =
  | ComposeCreateResponse.ComposePrepareResult
  | ComposeCreateResponse.ComposeRefineResult
  | ComposeCreateResponse.ComposeScoreResult;

export namespace ComposeCreateResponse {
  export interface ComposePrepareResult {
    /**
     * Xquik editorial heuristics, ordered for the goal.
     */
    contentRules: Array<ComposePrepareResult.ContentRule>;

    /**
     * Published engagement signal names. Production multipliers are not published.
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
     * Published signal names with unpublished weights as null.
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
    export interface ContentRule {
      rule: string;
    }

    export interface EngagementMultiplier {
      /**
       * Human-readable published signal name.
       */
      action: string;

      multiplier: 'Production weight not published by X';
    }

    export interface ScorerWeight {
      /**
       * Signal direction and publication limit.
       */
      context: string;

      /**
       * Signal name from X's public ranking repository.
       */
      signal: string;

      /**
       * X does not publish the production weight.
       */
      weight: null;
    }

    export interface SavedStyle {
      tweetCount: number;

      username: string;
    }
  }

  export interface ComposeRefineResult {
    /**
     * Goal, tone, media, and editorial guidance.
     */
    compositionGuidance: Array<string>;

    examplePatterns: Array<ComposeRefineResult.ExamplePattern>;

    /**
     * X post intent seeded with the topic.
     */
    intentUrl: string;

    nextStep: string;
  }

  export namespace ComposeRefineResult {
    export interface ExamplePattern {
      description: string;

      pattern: string;
    }
  }

  export interface ComposeScoreResult {
    /**
     * Deterministic editorial checks. Not a reach prediction.
     */
    checklist: Array<ComposeScoreResult.Checklist>;

    nextStep: string;

    passed: boolean;

    passedCount: number;

    topSuggestion: string;

    totalChecks: 9;

    /**
     * Present only when every check passes.
     */
    intentUrl?: string;
  }

  export namespace ComposeScoreResult {
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

export type ComposeCreateParams =
  | ComposeCreateParams.ComposePrepareRequest
  | ComposeCreateParams.ComposeRefineRequest
  | ComposeCreateParams.ComposeScoreRequest;

export declare namespace ComposeCreateParams {
  export interface ComposePrepareRequest {
    step: 'compose';

    /**
     * Subject for the post.
     */
    topic: string;

    /**
     * Editorial goal used to order the rules and questions.
     */
    goal?: 'engagement' | 'followers' | 'authority' | 'conversation';

    /**
     * Username from a style analysis saved to this account.
     */
    styleUsername?: string;

    [k: string]: unknown;
  }

  export interface ComposeRefineRequest {
    /**
     * Editorial goal for the guidance.
     */
    goal: 'engagement' | 'followers' | 'authority' | 'conversation';

    step: 'refine';

    /**
     * Requested writing tone.
     */
    tone: string;

    /**
     * Subject for the post.
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

  export interface ComposeScoreRequest {
    /**
     * Full post text for deterministic editorial checks.
     */
    draft: string;

    step: 'score';

    /**
     * True when a separate link card is attached.
     */
    hasLink?: boolean;

    /**
     * @deprecated Accepted for backward compatibility. Text checks ignore this field.
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
