// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

/**
 * AI analysis of posts, at 2 credits per analyzed post
 */
export class Analysis extends APIResource {
  /**
   * Answers whether each post is about your brand, the author's attitude toward it &
   * the author's relationship with it. Name the brand in analysis.targets. Each
   * analyzed post costs 2 credits.
   *
   * @example
   * ```ts
   * const response = await client.x.analysis.brand({
   *   limit: 20,
   *   query: 'Artemis lang:en',
   *   queryType: 'Latest',
   *   sinceTime: '2026-09-01T00:00:00Z',
   *   untilTime: '2026-09-30T23:59:59Z',
   * });
   * ```
   */
  brand(body: AnalysisBrandParams, options?: RequestOptions): APIPromise<AnalysisBrandResponse> {
    return this._client.post('/x/analysis/brand', { body, ...options });
  }

  /**
   * Answers 1 to 8 questions you write in analysis.questions. A choice picks a
   * category, such as a topic. A score picks a level. A probability answers yes or
   * no. Without questions it answers the sentiment questions. Each analyzed post
   * costs 2 credits.
   *
   * @example
   * ```ts
   * const response = await client.x.analysis.classify({
   *   limit: 20,
   *   query: 'Artemis lang:en',
   *   queryType: 'Latest',
   *   sinceTime: '2026-09-01T00:00:00Z',
   *   untilTime: '2026-09-30T23:59:59Z',
   * });
   * ```
   */
  classify(body: AnalysisClassifyParams, options?: RequestOptions): APIPromise<AnalysisClassifyResponse> {
    return this._client.post('/x/analysis/classify', { body, ...options });
  }

  /**
   * Answers each post's stance on an asset, its content type, its conviction & its
   * relevance. The summary counts bullish & bearish posts per cashtag. Name the
   * asset in analysis.targets. Each analyzed post costs 2 credits.
   *
   * @example
   * ```ts
   * const response = await client.x.analysis.marketSignals({
   *   limit: 20,
   *   query: 'Artemis lang:en',
   *   queryType: 'Latest',
   *   sinceTime: '2026-09-01T00:00:00Z',
   *   untilTime: '2026-09-30T23:59:59Z',
   * });
   * ```
   */
  marketSignals(
    body: AnalysisMarketSignalsParams,
    options?: RequestOptions,
  ): APIPromise<AnalysisMarketSignalsResponse> {
    return this._client.post('/x/analysis/market-signals', { body, ...options });
  }

  /**
   * Answers each post's format, such as reporting, commentary or speculation, its
   * source attribution & its relevance to your topic. Name the topic in
   * analysis.targets. Each analyzed post costs 2 credits.
   *
   * @example
   * ```ts
   * const response = await client.x.analysis.news({
   *   limit: 20,
   *   query: 'Artemis lang:en',
   *   queryType: 'Latest',
   *   sinceTime: '2026-09-01T00:00:00Z',
   *   untilTime: '2026-09-30T23:59:59Z',
   * });
   * ```
   */
  news(body: AnalysisNewsParams, options?: RequestOptions): APIPromise<AnalysisNewsResponse> {
    return this._client.post('/x/analysis/news', { body, ...options });
  }

  /**
   * Answers each post's attitude, its intensity & its sarcasm probability. Send post
   * IDs, an X search, an account, a List, a post's replies or quotes, or your own
   * texts. Each analyzed post costs 2 credits. A post without an analysis costs
   * nothing.
   *
   * @example
   * ```ts
   * const response = await client.x.analysis.sentiment({
   *   limit: 20,
   *   query: 'Artemis lang:en',
   *   queryType: 'Latest',
   *   sinceTime: '2026-09-01T00:00:00Z',
   *   untilTime: '2026-09-30T23:59:59Z',
   * });
   * ```
   */
  sentiment(body: AnalysisSentimentParams, options?: RequestOptions): APIPromise<AnalysisSentimentResponse> {
    return this._client.post('/x/analysis/sentiment', { body, ...options });
  }

  /**
   * Answers each post's hook, clarity, payoff, humor, spam risk & likely reaction, &
   * adds a Viral Score from 0 to 100 with a verdict. The score rates the wording. It
   * does not predict likes or views. Send drafts in texts to score them before
   * posting. Each analyzed post costs 2 credits.
   *
   * @example
   * ```ts
   * const response = await client.x.analysis.viralScore({
   *   limit: 20,
   *   query: 'Artemis lang:en',
   *   queryType: 'Latest',
   *   sinceTime: '2026-09-01T00:00:00Z',
   *   untilTime: '2026-09-30T23:59:59Z',
   * });
   * ```
   */
  viralScore(
    body: AnalysisViralScoreParams,
    options?: RequestOptions,
  ): APIPromise<AnalysisViralScoreResponse> {
    return this._client.post('/x/analysis/viral-score', { body, ...options });
  }
}

/**
 * Analyzed posts, the posts without an analysis & the totals of the answers. Each
 * row in results costs 2 credits.
 */
export interface AnalysisBrandResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  analysisSummary: AnalysisBrandResponse.AnalysisSummary;

  /**
   * Whether the search has more posts. Send next_cursor as cursor.
   */
  has_next_page: boolean;

  /**
   * Cursor of the search's next page, else empty.
   */
  next_cursor: string;

  /**
   * Each analyzed post with its answers.
   */
  results: Array<AnalysisBrandResponse.Result>;

  /**
   * Each post without an analysis, by ID & reason. These cost nothing.
   */
  unanalyzed: Array<AnalysisBrandResponse.Unanalyzed>;
}

export namespace AnalysisBrandResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  export interface AnalysisSummary {
    /**
     * Posts & answers per cashtag, most posts first, up to 20. signal is present for
     * the market questions.
     */
    cashtags: Array<AnalysisSummary.Cashtag>;

    /**
     * Likes, reposts, replies & quotes of the analyzed posts.
     */
    engagement: number;

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    monitor: AnalysisSummary.Monitor | null;

    /**
     * Totals by question ID. A choice has counts, shares, engagementShares & top posts
     * per category. A score has mean, engagementWeightedMean & levels. A probability
     * has mean, yes & no.
     */
    questions: { [key: string]: { [key: string]: unknown } };

    /**
     * Posts by analysis outcome.
     */
    rows: AnalysisSummary.Rows;

    schemaVersion: number;

    /**
     * Posts per linked hostname, most posts first, up to 20.
     */
    sourceDomains: Array<AnalysisSummary.SourceDomain>;

    /**
     * Mentions & answers per target in analysis.targets.
     */
    targets: Array<AnalysisSummary.Target>;

    /**
     * Only from /x/analysis/viral-score. Scored posts, the average score, verdict
     * counts, the scores against actual engagement, a report per author & the
     * leaderboards.
     */
    viral?: { [key: string]: unknown };
  }

  export namespace AnalysisSummary {
    export interface Cashtag {
      cashtag: string;

      /**
       * Category counts of the cashtag's posts by question ID.
       */
      choices: { [key: string]: unknown };

      rows: number;

      signal?: Cashtag.Signal;
    }

    export namespace Cashtag {
      export interface Signal {
        bearish: number;

        bullish: number;

        /**
         * Bullish minus bearish posts, over all posts.
         */
        score: number;
      }
    }

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    export interface Monitor {
      changedRows: Array<Monitor.ChangedRow>;

      /**
       * Posts per monitor status.
       */
      statuses: { [key: string]: number };
    }

    export namespace Monitor {
      export interface ChangedRow {
        changes: Array<ChangedRow.Change>;

        tweetId: string;
      }

      export namespace ChangedRow {
        export interface Change {
          current: string;

          previous: string;

          questionId: string;
        }
      }
    }

    /**
     * Posts by analysis outcome.
     */
    export interface Rows {
      analyzed: number;

      failed: number;

      skipped: number;
    }

    export interface SourceDomain {
      domain: string;

      posts: number;
    }

    export interface Target {
      /**
       * Category counts by question ID.
       */
      choices: { [key: string]: unknown };

      engagement: number;

      mentions: number;

      name: string;

      share: number;

      /**
       * The most engaged posts per question ID & category.
       */
      top: { [key: string]: unknown };
    }
  }

  /**
   * 1 analyzed post with its answers.
   */
  export interface Result {
    /**
     * The answers in full, with their probabilities.
     */
    analysis: Result.Analysis;

    /**
     * Each question's decision by question ID. A choice gives its category, a score
     * its level from 0, which can have decimals, & a probability its value from 0 to
     * 1.
     */
    answers: { [key: string]: string | number };

    /**
     * Cashtags in the post's text, in upper case.
     */
    cashtags: Array<string>;

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    monitor: Result.Monitor;

    /**
     * Hostnames the post links to, without t.co.
     */
    sourceDomains: Array<string>;

    /**
     * The post, as /x/tweets/search returns it. Your own texts have the IDs text:1,
     * text:2 & so on.
     */
    tweet: Shared.SearchTweet;

    /**
     * Only from /x/analysis/viral-score. The score with its weights version, the caps
     * that applied & the engagement comparison.
     */
    viral?: { [key: string]: unknown };

    /**
     * Only from /x/analysis/viral-score. log10 of 1 plus the weighted engagement per
     * 1,000 followers. Null without a follower count.
     */
    viralActualEngagementRate?: number | null;

    /**
     * Only from /x/analysis/viral-score. The post's public counts under X's published
     * ranking weights, per 1,000 views or followers.
     */
    viralAlgorithmScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. How viral the wording reads, or null when a
     * trait has no answer.
     */
    viralScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. send_it from 70, edit_first from 40, else
     * sleep_on_it.
     */
    viralVerdict?: 'send_it' | 'edit_first' | 'sleep_on_it' | null;
  }

  export namespace Result {
    /**
     * The answers in full, with their probabilities.
     */
    export interface Analysis {
      /**
       * 1 answer per question, in question order.
       */
      answers: Array<Analysis.Answer>;

      /**
       * What the AI read beside the post's text.
       */
      contextAvailability: Analysis.ContextAvailability;

      /**
       * Bytes of post & settings the AI read.
       */
      contextBytes: number;

      /**
       * The ID & version of each question asked.
       */
      questions: Array<Analysis.Question>;

      status: 'succeeded';
    }

    export namespace Analysis {
      /**
       * 1 question's answer. A probability has probability. A choice or score has value,
       * confidence & the probability of each category or level.
       */
      export interface Answer {
        questionId: string;

        questionVersion: string;

        type: 'choice' | 'score' | 'probability';

        confidence?: number;

        /**
         * For a score. The levels the question named, from 0.
         */
        levels?: Array<string>;

        /**
         * Probability of each category, or of each level by index.
         */
        probabilities?: { [key: string]: number };

        /**
         * For a probability. The chance the answer is yes.
         */
        probability?: number;

        /**
         * The chosen category, or the level from 0, which can have decimals, such as 1.4
         * between levels 1 & 2.
         */
        value?: string | number;
      }

      /**
       * What the AI read beside the post's text.
       */
      export interface ContextAvailability {
        article: 'text_blocks' | 'summary' | 'not_supplied';

        author: 'available' | 'missing';

        media: 'text_descriptions_only' | 'not_supplied';

        /**
         * truncated when the post was cut to fit.
         */
        postText: 'full' | 'truncated';

        quote: 'available' | 'missing' | 'not_applicable';

        reply: 'available' | 'missing' | 'not_applicable';
      }

      export interface Question {
        id: string;

        version: string;
      }
    }

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    export interface Monitor {
      /**
       * Always null. The baseline is the rows you sent.
       */
      baselineDatasetId: null;

      /**
       * IDs of the questions whose decision changed.
       */
      changedQuestionIds: Array<string>;

      /**
       * Each changed decision, earlier & now.
       */
      changes: Array<Monitor.Change>;

      /**
       * Hash of the questions, targets & context. Rows with another hash are
       * not_comparable.
       */
      configurationFingerprint: string;

      /**
       * first_run without baseline. new_to_baseline for a post baseline lacks. changed
       * when an answer clearly left its earlier decision. not_comparable when other
       * settings made the earlier row or it answers none of these questions.
       */
      status:
        'first_run' | 'new_to_baseline' | 'unchanged' | 'changed' | 'not_comparable' | 'analysis_unavailable';
    }

    export namespace Monitor {
      export interface Change {
        current: string;

        previous: string;

        questionId: string;
      }
    }
  }

  /**
   * A post without an analysis. It costs nothing.
   */
  export interface Unanalyzed {
    /**
     * Post ID. Your own texts have the IDs text:1, text:2 & so on.
     */
    id: string;

    /**
     * post_unavailable when X returns no such post. missing_text for a post without
     * text. insufficient_credits when credits ran out. context_limit when the settings
     * leave the post no room. The other reasons mean the analysis failed. Send the
     * post again.
     */
    reason: string;

    status: 'failed' | 'skipped';
  }
}

/**
 * Analyzed posts, the posts without an analysis & the totals of the answers. Each
 * row in results costs 2 credits.
 */
export interface AnalysisClassifyResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  analysisSummary: AnalysisClassifyResponse.AnalysisSummary;

  /**
   * Whether the search has more posts. Send next_cursor as cursor.
   */
  has_next_page: boolean;

  /**
   * Cursor of the search's next page, else empty.
   */
  next_cursor: string;

  /**
   * Each analyzed post with its answers.
   */
  results: Array<AnalysisClassifyResponse.Result>;

  /**
   * Each post without an analysis, by ID & reason. These cost nothing.
   */
  unanalyzed: Array<AnalysisClassifyResponse.Unanalyzed>;
}

export namespace AnalysisClassifyResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  export interface AnalysisSummary {
    /**
     * Posts & answers per cashtag, most posts first, up to 20. signal is present for
     * the market questions.
     */
    cashtags: Array<AnalysisSummary.Cashtag>;

    /**
     * Likes, reposts, replies & quotes of the analyzed posts.
     */
    engagement: number;

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    monitor: AnalysisSummary.Monitor | null;

    /**
     * Totals by question ID. A choice has counts, shares, engagementShares & top posts
     * per category. A score has mean, engagementWeightedMean & levels. A probability
     * has mean, yes & no.
     */
    questions: { [key: string]: { [key: string]: unknown } };

    /**
     * Posts by analysis outcome.
     */
    rows: AnalysisSummary.Rows;

    schemaVersion: number;

    /**
     * Posts per linked hostname, most posts first, up to 20.
     */
    sourceDomains: Array<AnalysisSummary.SourceDomain>;

    /**
     * Mentions & answers per target in analysis.targets.
     */
    targets: Array<AnalysisSummary.Target>;

    /**
     * Only from /x/analysis/viral-score. Scored posts, the average score, verdict
     * counts, the scores against actual engagement, a report per author & the
     * leaderboards.
     */
    viral?: { [key: string]: unknown };
  }

  export namespace AnalysisSummary {
    export interface Cashtag {
      cashtag: string;

      /**
       * Category counts of the cashtag's posts by question ID.
       */
      choices: { [key: string]: unknown };

      rows: number;

      signal?: Cashtag.Signal;
    }

    export namespace Cashtag {
      export interface Signal {
        bearish: number;

        bullish: number;

        /**
         * Bullish minus bearish posts, over all posts.
         */
        score: number;
      }
    }

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    export interface Monitor {
      changedRows: Array<Monitor.ChangedRow>;

      /**
       * Posts per monitor status.
       */
      statuses: { [key: string]: number };
    }

    export namespace Monitor {
      export interface ChangedRow {
        changes: Array<ChangedRow.Change>;

        tweetId: string;
      }

      export namespace ChangedRow {
        export interface Change {
          current: string;

          previous: string;

          questionId: string;
        }
      }
    }

    /**
     * Posts by analysis outcome.
     */
    export interface Rows {
      analyzed: number;

      failed: number;

      skipped: number;
    }

    export interface SourceDomain {
      domain: string;

      posts: number;
    }

    export interface Target {
      /**
       * Category counts by question ID.
       */
      choices: { [key: string]: unknown };

      engagement: number;

      mentions: number;

      name: string;

      share: number;

      /**
       * The most engaged posts per question ID & category.
       */
      top: { [key: string]: unknown };
    }
  }

  /**
   * 1 analyzed post with its answers.
   */
  export interface Result {
    /**
     * The answers in full, with their probabilities.
     */
    analysis: Result.Analysis;

    /**
     * Each question's decision by question ID. A choice gives its category, a score
     * its level from 0, which can have decimals, & a probability its value from 0 to
     * 1.
     */
    answers: { [key: string]: string | number };

    /**
     * Cashtags in the post's text, in upper case.
     */
    cashtags: Array<string>;

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    monitor: Result.Monitor;

    /**
     * Hostnames the post links to, without t.co.
     */
    sourceDomains: Array<string>;

    /**
     * The post, as /x/tweets/search returns it. Your own texts have the IDs text:1,
     * text:2 & so on.
     */
    tweet: Shared.SearchTweet;

    /**
     * Only from /x/analysis/viral-score. The score with its weights version, the caps
     * that applied & the engagement comparison.
     */
    viral?: { [key: string]: unknown };

    /**
     * Only from /x/analysis/viral-score. log10 of 1 plus the weighted engagement per
     * 1,000 followers. Null without a follower count.
     */
    viralActualEngagementRate?: number | null;

    /**
     * Only from /x/analysis/viral-score. The post's public counts under X's published
     * ranking weights, per 1,000 views or followers.
     */
    viralAlgorithmScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. How viral the wording reads, or null when a
     * trait has no answer.
     */
    viralScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. send_it from 70, edit_first from 40, else
     * sleep_on_it.
     */
    viralVerdict?: 'send_it' | 'edit_first' | 'sleep_on_it' | null;
  }

  export namespace Result {
    /**
     * The answers in full, with their probabilities.
     */
    export interface Analysis {
      /**
       * 1 answer per question, in question order.
       */
      answers: Array<Analysis.Answer>;

      /**
       * What the AI read beside the post's text.
       */
      contextAvailability: Analysis.ContextAvailability;

      /**
       * Bytes of post & settings the AI read.
       */
      contextBytes: number;

      /**
       * The ID & version of each question asked.
       */
      questions: Array<Analysis.Question>;

      status: 'succeeded';
    }

    export namespace Analysis {
      /**
       * 1 question's answer. A probability has probability. A choice or score has value,
       * confidence & the probability of each category or level.
       */
      export interface Answer {
        questionId: string;

        questionVersion: string;

        type: 'choice' | 'score' | 'probability';

        confidence?: number;

        /**
         * For a score. The levels the question named, from 0.
         */
        levels?: Array<string>;

        /**
         * Probability of each category, or of each level by index.
         */
        probabilities?: { [key: string]: number };

        /**
         * For a probability. The chance the answer is yes.
         */
        probability?: number;

        /**
         * The chosen category, or the level from 0, which can have decimals, such as 1.4
         * between levels 1 & 2.
         */
        value?: string | number;
      }

      /**
       * What the AI read beside the post's text.
       */
      export interface ContextAvailability {
        article: 'text_blocks' | 'summary' | 'not_supplied';

        author: 'available' | 'missing';

        media: 'text_descriptions_only' | 'not_supplied';

        /**
         * truncated when the post was cut to fit.
         */
        postText: 'full' | 'truncated';

        quote: 'available' | 'missing' | 'not_applicable';

        reply: 'available' | 'missing' | 'not_applicable';
      }

      export interface Question {
        id: string;

        version: string;
      }
    }

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    export interface Monitor {
      /**
       * Always null. The baseline is the rows you sent.
       */
      baselineDatasetId: null;

      /**
       * IDs of the questions whose decision changed.
       */
      changedQuestionIds: Array<string>;

      /**
       * Each changed decision, earlier & now.
       */
      changes: Array<Monitor.Change>;

      /**
       * Hash of the questions, targets & context. Rows with another hash are
       * not_comparable.
       */
      configurationFingerprint: string;

      /**
       * first_run without baseline. new_to_baseline for a post baseline lacks. changed
       * when an answer clearly left its earlier decision. not_comparable when other
       * settings made the earlier row or it answers none of these questions.
       */
      status:
        'first_run' | 'new_to_baseline' | 'unchanged' | 'changed' | 'not_comparable' | 'analysis_unavailable';
    }

    export namespace Monitor {
      export interface Change {
        current: string;

        previous: string;

        questionId: string;
      }
    }
  }

  /**
   * A post without an analysis. It costs nothing.
   */
  export interface Unanalyzed {
    /**
     * Post ID. Your own texts have the IDs text:1, text:2 & so on.
     */
    id: string;

    /**
     * post_unavailable when X returns no such post. missing_text for a post without
     * text. insufficient_credits when credits ran out. context_limit when the settings
     * leave the post no room. The other reasons mean the analysis failed. Send the
     * post again.
     */
    reason: string;

    status: 'failed' | 'skipped';
  }
}

/**
 * Analyzed posts, the posts without an analysis & the totals of the answers. Each
 * row in results costs 2 credits.
 */
export interface AnalysisMarketSignalsResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  analysisSummary: AnalysisMarketSignalsResponse.AnalysisSummary;

  /**
   * Whether the search has more posts. Send next_cursor as cursor.
   */
  has_next_page: boolean;

  /**
   * Cursor of the search's next page, else empty.
   */
  next_cursor: string;

  /**
   * Each analyzed post with its answers.
   */
  results: Array<AnalysisMarketSignalsResponse.Result>;

  /**
   * Each post without an analysis, by ID & reason. These cost nothing.
   */
  unanalyzed: Array<AnalysisMarketSignalsResponse.Unanalyzed>;
}

export namespace AnalysisMarketSignalsResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  export interface AnalysisSummary {
    /**
     * Posts & answers per cashtag, most posts first, up to 20. signal is present for
     * the market questions.
     */
    cashtags: Array<AnalysisSummary.Cashtag>;

    /**
     * Likes, reposts, replies & quotes of the analyzed posts.
     */
    engagement: number;

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    monitor: AnalysisSummary.Monitor | null;

    /**
     * Totals by question ID. A choice has counts, shares, engagementShares & top posts
     * per category. A score has mean, engagementWeightedMean & levels. A probability
     * has mean, yes & no.
     */
    questions: { [key: string]: { [key: string]: unknown } };

    /**
     * Posts by analysis outcome.
     */
    rows: AnalysisSummary.Rows;

    schemaVersion: number;

    /**
     * Posts per linked hostname, most posts first, up to 20.
     */
    sourceDomains: Array<AnalysisSummary.SourceDomain>;

    /**
     * Mentions & answers per target in analysis.targets.
     */
    targets: Array<AnalysisSummary.Target>;

    /**
     * Only from /x/analysis/viral-score. Scored posts, the average score, verdict
     * counts, the scores against actual engagement, a report per author & the
     * leaderboards.
     */
    viral?: { [key: string]: unknown };
  }

  export namespace AnalysisSummary {
    export interface Cashtag {
      cashtag: string;

      /**
       * Category counts of the cashtag's posts by question ID.
       */
      choices: { [key: string]: unknown };

      rows: number;

      signal?: Cashtag.Signal;
    }

    export namespace Cashtag {
      export interface Signal {
        bearish: number;

        bullish: number;

        /**
         * Bullish minus bearish posts, over all posts.
         */
        score: number;
      }
    }

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    export interface Monitor {
      changedRows: Array<Monitor.ChangedRow>;

      /**
       * Posts per monitor status.
       */
      statuses: { [key: string]: number };
    }

    export namespace Monitor {
      export interface ChangedRow {
        changes: Array<ChangedRow.Change>;

        tweetId: string;
      }

      export namespace ChangedRow {
        export interface Change {
          current: string;

          previous: string;

          questionId: string;
        }
      }
    }

    /**
     * Posts by analysis outcome.
     */
    export interface Rows {
      analyzed: number;

      failed: number;

      skipped: number;
    }

    export interface SourceDomain {
      domain: string;

      posts: number;
    }

    export interface Target {
      /**
       * Category counts by question ID.
       */
      choices: { [key: string]: unknown };

      engagement: number;

      mentions: number;

      name: string;

      share: number;

      /**
       * The most engaged posts per question ID & category.
       */
      top: { [key: string]: unknown };
    }
  }

  /**
   * 1 analyzed post with its answers.
   */
  export interface Result {
    /**
     * The answers in full, with their probabilities.
     */
    analysis: Result.Analysis;

    /**
     * Each question's decision by question ID. A choice gives its category, a score
     * its level from 0, which can have decimals, & a probability its value from 0 to
     * 1.
     */
    answers: { [key: string]: string | number };

    /**
     * Cashtags in the post's text, in upper case.
     */
    cashtags: Array<string>;

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    monitor: Result.Monitor;

    /**
     * Hostnames the post links to, without t.co.
     */
    sourceDomains: Array<string>;

    /**
     * The post, as /x/tweets/search returns it. Your own texts have the IDs text:1,
     * text:2 & so on.
     */
    tweet: Shared.SearchTweet;

    /**
     * Only from /x/analysis/viral-score. The score with its weights version, the caps
     * that applied & the engagement comparison.
     */
    viral?: { [key: string]: unknown };

    /**
     * Only from /x/analysis/viral-score. log10 of 1 plus the weighted engagement per
     * 1,000 followers. Null without a follower count.
     */
    viralActualEngagementRate?: number | null;

    /**
     * Only from /x/analysis/viral-score. The post's public counts under X's published
     * ranking weights, per 1,000 views or followers.
     */
    viralAlgorithmScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. How viral the wording reads, or null when a
     * trait has no answer.
     */
    viralScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. send_it from 70, edit_first from 40, else
     * sleep_on_it.
     */
    viralVerdict?: 'send_it' | 'edit_first' | 'sleep_on_it' | null;
  }

  export namespace Result {
    /**
     * The answers in full, with their probabilities.
     */
    export interface Analysis {
      /**
       * 1 answer per question, in question order.
       */
      answers: Array<Analysis.Answer>;

      /**
       * What the AI read beside the post's text.
       */
      contextAvailability: Analysis.ContextAvailability;

      /**
       * Bytes of post & settings the AI read.
       */
      contextBytes: number;

      /**
       * The ID & version of each question asked.
       */
      questions: Array<Analysis.Question>;

      status: 'succeeded';
    }

    export namespace Analysis {
      /**
       * 1 question's answer. A probability has probability. A choice or score has value,
       * confidence & the probability of each category or level.
       */
      export interface Answer {
        questionId: string;

        questionVersion: string;

        type: 'choice' | 'score' | 'probability';

        confidence?: number;

        /**
         * For a score. The levels the question named, from 0.
         */
        levels?: Array<string>;

        /**
         * Probability of each category, or of each level by index.
         */
        probabilities?: { [key: string]: number };

        /**
         * For a probability. The chance the answer is yes.
         */
        probability?: number;

        /**
         * The chosen category, or the level from 0, which can have decimals, such as 1.4
         * between levels 1 & 2.
         */
        value?: string | number;
      }

      /**
       * What the AI read beside the post's text.
       */
      export interface ContextAvailability {
        article: 'text_blocks' | 'summary' | 'not_supplied';

        author: 'available' | 'missing';

        media: 'text_descriptions_only' | 'not_supplied';

        /**
         * truncated when the post was cut to fit.
         */
        postText: 'full' | 'truncated';

        quote: 'available' | 'missing' | 'not_applicable';

        reply: 'available' | 'missing' | 'not_applicable';
      }

      export interface Question {
        id: string;

        version: string;
      }
    }

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    export interface Monitor {
      /**
       * Always null. The baseline is the rows you sent.
       */
      baselineDatasetId: null;

      /**
       * IDs of the questions whose decision changed.
       */
      changedQuestionIds: Array<string>;

      /**
       * Each changed decision, earlier & now.
       */
      changes: Array<Monitor.Change>;

      /**
       * Hash of the questions, targets & context. Rows with another hash are
       * not_comparable.
       */
      configurationFingerprint: string;

      /**
       * first_run without baseline. new_to_baseline for a post baseline lacks. changed
       * when an answer clearly left its earlier decision. not_comparable when other
       * settings made the earlier row or it answers none of these questions.
       */
      status:
        'first_run' | 'new_to_baseline' | 'unchanged' | 'changed' | 'not_comparable' | 'analysis_unavailable';
    }

    export namespace Monitor {
      export interface Change {
        current: string;

        previous: string;

        questionId: string;
      }
    }
  }

  /**
   * A post without an analysis. It costs nothing.
   */
  export interface Unanalyzed {
    /**
     * Post ID. Your own texts have the IDs text:1, text:2 & so on.
     */
    id: string;

    /**
     * post_unavailable when X returns no such post. missing_text for a post without
     * text. insufficient_credits when credits ran out. context_limit when the settings
     * leave the post no room. The other reasons mean the analysis failed. Send the
     * post again.
     */
    reason: string;

    status: 'failed' | 'skipped';
  }
}

/**
 * Analyzed posts, the posts without an analysis & the totals of the answers. Each
 * row in results costs 2 credits.
 */
export interface AnalysisNewsResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  analysisSummary: AnalysisNewsResponse.AnalysisSummary;

  /**
   * Whether the search has more posts. Send next_cursor as cursor.
   */
  has_next_page: boolean;

  /**
   * Cursor of the search's next page, else empty.
   */
  next_cursor: string;

  /**
   * Each analyzed post with its answers.
   */
  results: Array<AnalysisNewsResponse.Result>;

  /**
   * Each post without an analysis, by ID & reason. These cost nothing.
   */
  unanalyzed: Array<AnalysisNewsResponse.Unanalyzed>;
}

export namespace AnalysisNewsResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  export interface AnalysisSummary {
    /**
     * Posts & answers per cashtag, most posts first, up to 20. signal is present for
     * the market questions.
     */
    cashtags: Array<AnalysisSummary.Cashtag>;

    /**
     * Likes, reposts, replies & quotes of the analyzed posts.
     */
    engagement: number;

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    monitor: AnalysisSummary.Monitor | null;

    /**
     * Totals by question ID. A choice has counts, shares, engagementShares & top posts
     * per category. A score has mean, engagementWeightedMean & levels. A probability
     * has mean, yes & no.
     */
    questions: { [key: string]: { [key: string]: unknown } };

    /**
     * Posts by analysis outcome.
     */
    rows: AnalysisSummary.Rows;

    schemaVersion: number;

    /**
     * Posts per linked hostname, most posts first, up to 20.
     */
    sourceDomains: Array<AnalysisSummary.SourceDomain>;

    /**
     * Mentions & answers per target in analysis.targets.
     */
    targets: Array<AnalysisSummary.Target>;

    /**
     * Only from /x/analysis/viral-score. Scored posts, the average score, verdict
     * counts, the scores against actual engagement, a report per author & the
     * leaderboards.
     */
    viral?: { [key: string]: unknown };
  }

  export namespace AnalysisSummary {
    export interface Cashtag {
      cashtag: string;

      /**
       * Category counts of the cashtag's posts by question ID.
       */
      choices: { [key: string]: unknown };

      rows: number;

      signal?: Cashtag.Signal;
    }

    export namespace Cashtag {
      export interface Signal {
        bearish: number;

        bullish: number;

        /**
         * Bullish minus bearish posts, over all posts.
         */
        score: number;
      }
    }

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    export interface Monitor {
      changedRows: Array<Monitor.ChangedRow>;

      /**
       * Posts per monitor status.
       */
      statuses: { [key: string]: number };
    }

    export namespace Monitor {
      export interface ChangedRow {
        changes: Array<ChangedRow.Change>;

        tweetId: string;
      }

      export namespace ChangedRow {
        export interface Change {
          current: string;

          previous: string;

          questionId: string;
        }
      }
    }

    /**
     * Posts by analysis outcome.
     */
    export interface Rows {
      analyzed: number;

      failed: number;

      skipped: number;
    }

    export interface SourceDomain {
      domain: string;

      posts: number;
    }

    export interface Target {
      /**
       * Category counts by question ID.
       */
      choices: { [key: string]: unknown };

      engagement: number;

      mentions: number;

      name: string;

      share: number;

      /**
       * The most engaged posts per question ID & category.
       */
      top: { [key: string]: unknown };
    }
  }

  /**
   * 1 analyzed post with its answers.
   */
  export interface Result {
    /**
     * The answers in full, with their probabilities.
     */
    analysis: Result.Analysis;

    /**
     * Each question's decision by question ID. A choice gives its category, a score
     * its level from 0, which can have decimals, & a probability its value from 0 to
     * 1.
     */
    answers: { [key: string]: string | number };

    /**
     * Cashtags in the post's text, in upper case.
     */
    cashtags: Array<string>;

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    monitor: Result.Monitor;

    /**
     * Hostnames the post links to, without t.co.
     */
    sourceDomains: Array<string>;

    /**
     * The post, as /x/tweets/search returns it. Your own texts have the IDs text:1,
     * text:2 & so on.
     */
    tweet: Shared.SearchTweet;

    /**
     * Only from /x/analysis/viral-score. The score with its weights version, the caps
     * that applied & the engagement comparison.
     */
    viral?: { [key: string]: unknown };

    /**
     * Only from /x/analysis/viral-score. log10 of 1 plus the weighted engagement per
     * 1,000 followers. Null without a follower count.
     */
    viralActualEngagementRate?: number | null;

    /**
     * Only from /x/analysis/viral-score. The post's public counts under X's published
     * ranking weights, per 1,000 views or followers.
     */
    viralAlgorithmScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. How viral the wording reads, or null when a
     * trait has no answer.
     */
    viralScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. send_it from 70, edit_first from 40, else
     * sleep_on_it.
     */
    viralVerdict?: 'send_it' | 'edit_first' | 'sleep_on_it' | null;
  }

  export namespace Result {
    /**
     * The answers in full, with their probabilities.
     */
    export interface Analysis {
      /**
       * 1 answer per question, in question order.
       */
      answers: Array<Analysis.Answer>;

      /**
       * What the AI read beside the post's text.
       */
      contextAvailability: Analysis.ContextAvailability;

      /**
       * Bytes of post & settings the AI read.
       */
      contextBytes: number;

      /**
       * The ID & version of each question asked.
       */
      questions: Array<Analysis.Question>;

      status: 'succeeded';
    }

    export namespace Analysis {
      /**
       * 1 question's answer. A probability has probability. A choice or score has value,
       * confidence & the probability of each category or level.
       */
      export interface Answer {
        questionId: string;

        questionVersion: string;

        type: 'choice' | 'score' | 'probability';

        confidence?: number;

        /**
         * For a score. The levels the question named, from 0.
         */
        levels?: Array<string>;

        /**
         * Probability of each category, or of each level by index.
         */
        probabilities?: { [key: string]: number };

        /**
         * For a probability. The chance the answer is yes.
         */
        probability?: number;

        /**
         * The chosen category, or the level from 0, which can have decimals, such as 1.4
         * between levels 1 & 2.
         */
        value?: string | number;
      }

      /**
       * What the AI read beside the post's text.
       */
      export interface ContextAvailability {
        article: 'text_blocks' | 'summary' | 'not_supplied';

        author: 'available' | 'missing';

        media: 'text_descriptions_only' | 'not_supplied';

        /**
         * truncated when the post was cut to fit.
         */
        postText: 'full' | 'truncated';

        quote: 'available' | 'missing' | 'not_applicable';

        reply: 'available' | 'missing' | 'not_applicable';
      }

      export interface Question {
        id: string;

        version: string;
      }
    }

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    export interface Monitor {
      /**
       * Always null. The baseline is the rows you sent.
       */
      baselineDatasetId: null;

      /**
       * IDs of the questions whose decision changed.
       */
      changedQuestionIds: Array<string>;

      /**
       * Each changed decision, earlier & now.
       */
      changes: Array<Monitor.Change>;

      /**
       * Hash of the questions, targets & context. Rows with another hash are
       * not_comparable.
       */
      configurationFingerprint: string;

      /**
       * first_run without baseline. new_to_baseline for a post baseline lacks. changed
       * when an answer clearly left its earlier decision. not_comparable when other
       * settings made the earlier row or it answers none of these questions.
       */
      status:
        'first_run' | 'new_to_baseline' | 'unchanged' | 'changed' | 'not_comparable' | 'analysis_unavailable';
    }

    export namespace Monitor {
      export interface Change {
        current: string;

        previous: string;

        questionId: string;
      }
    }
  }

  /**
   * A post without an analysis. It costs nothing.
   */
  export interface Unanalyzed {
    /**
     * Post ID. Your own texts have the IDs text:1, text:2 & so on.
     */
    id: string;

    /**
     * post_unavailable when X returns no such post. missing_text for a post without
     * text. insufficient_credits when credits ran out. context_limit when the settings
     * leave the post no room. The other reasons mean the analysis failed. Send the
     * post again.
     */
    reason: string;

    status: 'failed' | 'skipped';
  }
}

/**
 * Analyzed posts, the posts without an analysis & the totals of the answers. Each
 * row in results costs 2 credits.
 */
export interface AnalysisSentimentResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  analysisSummary: AnalysisSentimentResponse.AnalysisSummary;

  /**
   * Whether the search has more posts. Send next_cursor as cursor.
   */
  has_next_page: boolean;

  /**
   * Cursor of the search's next page, else empty.
   */
  next_cursor: string;

  /**
   * Each analyzed post with its answers.
   */
  results: Array<AnalysisSentimentResponse.Result>;

  /**
   * Each post without an analysis, by ID & reason. These cost nothing.
   */
  unanalyzed: Array<AnalysisSentimentResponse.Unanalyzed>;
}

export namespace AnalysisSentimentResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  export interface AnalysisSummary {
    /**
     * Posts & answers per cashtag, most posts first, up to 20. signal is present for
     * the market questions.
     */
    cashtags: Array<AnalysisSummary.Cashtag>;

    /**
     * Likes, reposts, replies & quotes of the analyzed posts.
     */
    engagement: number;

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    monitor: AnalysisSummary.Monitor | null;

    /**
     * Totals by question ID. A choice has counts, shares, engagementShares & top posts
     * per category. A score has mean, engagementWeightedMean & levels. A probability
     * has mean, yes & no.
     */
    questions: { [key: string]: { [key: string]: unknown } };

    /**
     * Posts by analysis outcome.
     */
    rows: AnalysisSummary.Rows;

    schemaVersion: number;

    /**
     * Posts per linked hostname, most posts first, up to 20.
     */
    sourceDomains: Array<AnalysisSummary.SourceDomain>;

    /**
     * Mentions & answers per target in analysis.targets.
     */
    targets: Array<AnalysisSummary.Target>;

    /**
     * Only from /x/analysis/viral-score. Scored posts, the average score, verdict
     * counts, the scores against actual engagement, a report per author & the
     * leaderboards.
     */
    viral?: { [key: string]: unknown };
  }

  export namespace AnalysisSummary {
    export interface Cashtag {
      cashtag: string;

      /**
       * Category counts of the cashtag's posts by question ID.
       */
      choices: { [key: string]: unknown };

      rows: number;

      signal?: Cashtag.Signal;
    }

    export namespace Cashtag {
      export interface Signal {
        bearish: number;

        bullish: number;

        /**
         * Bullish minus bearish posts, over all posts.
         */
        score: number;
      }
    }

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    export interface Monitor {
      changedRows: Array<Monitor.ChangedRow>;

      /**
       * Posts per monitor status.
       */
      statuses: { [key: string]: number };
    }

    export namespace Monitor {
      export interface ChangedRow {
        changes: Array<ChangedRow.Change>;

        tweetId: string;
      }

      export namespace ChangedRow {
        export interface Change {
          current: string;

          previous: string;

          questionId: string;
        }
      }
    }

    /**
     * Posts by analysis outcome.
     */
    export interface Rows {
      analyzed: number;

      failed: number;

      skipped: number;
    }

    export interface SourceDomain {
      domain: string;

      posts: number;
    }

    export interface Target {
      /**
       * Category counts by question ID.
       */
      choices: { [key: string]: unknown };

      engagement: number;

      mentions: number;

      name: string;

      share: number;

      /**
       * The most engaged posts per question ID & category.
       */
      top: { [key: string]: unknown };
    }
  }

  /**
   * 1 analyzed post with its answers.
   */
  export interface Result {
    /**
     * The answers in full, with their probabilities.
     */
    analysis: Result.Analysis;

    /**
     * Each question's decision by question ID. A choice gives its category, a score
     * its level from 0, which can have decimals, & a probability its value from 0 to
     * 1.
     */
    answers: { [key: string]: string | number };

    /**
     * Cashtags in the post's text, in upper case.
     */
    cashtags: Array<string>;

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    monitor: Result.Monitor;

    /**
     * Hostnames the post links to, without t.co.
     */
    sourceDomains: Array<string>;

    /**
     * The post, as /x/tweets/search returns it. Your own texts have the IDs text:1,
     * text:2 & so on.
     */
    tweet: Shared.SearchTweet;

    /**
     * Only from /x/analysis/viral-score. The score with its weights version, the caps
     * that applied & the engagement comparison.
     */
    viral?: { [key: string]: unknown };

    /**
     * Only from /x/analysis/viral-score. log10 of 1 plus the weighted engagement per
     * 1,000 followers. Null without a follower count.
     */
    viralActualEngagementRate?: number | null;

    /**
     * Only from /x/analysis/viral-score. The post's public counts under X's published
     * ranking weights, per 1,000 views or followers.
     */
    viralAlgorithmScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. How viral the wording reads, or null when a
     * trait has no answer.
     */
    viralScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. send_it from 70, edit_first from 40, else
     * sleep_on_it.
     */
    viralVerdict?: 'send_it' | 'edit_first' | 'sleep_on_it' | null;
  }

  export namespace Result {
    /**
     * The answers in full, with their probabilities.
     */
    export interface Analysis {
      /**
       * 1 answer per question, in question order.
       */
      answers: Array<Analysis.Answer>;

      /**
       * What the AI read beside the post's text.
       */
      contextAvailability: Analysis.ContextAvailability;

      /**
       * Bytes of post & settings the AI read.
       */
      contextBytes: number;

      /**
       * The ID & version of each question asked.
       */
      questions: Array<Analysis.Question>;

      status: 'succeeded';
    }

    export namespace Analysis {
      /**
       * 1 question's answer. A probability has probability. A choice or score has value,
       * confidence & the probability of each category or level.
       */
      export interface Answer {
        questionId: string;

        questionVersion: string;

        type: 'choice' | 'score' | 'probability';

        confidence?: number;

        /**
         * For a score. The levels the question named, from 0.
         */
        levels?: Array<string>;

        /**
         * Probability of each category, or of each level by index.
         */
        probabilities?: { [key: string]: number };

        /**
         * For a probability. The chance the answer is yes.
         */
        probability?: number;

        /**
         * The chosen category, or the level from 0, which can have decimals, such as 1.4
         * between levels 1 & 2.
         */
        value?: string | number;
      }

      /**
       * What the AI read beside the post's text.
       */
      export interface ContextAvailability {
        article: 'text_blocks' | 'summary' | 'not_supplied';

        author: 'available' | 'missing';

        media: 'text_descriptions_only' | 'not_supplied';

        /**
         * truncated when the post was cut to fit.
         */
        postText: 'full' | 'truncated';

        quote: 'available' | 'missing' | 'not_applicable';

        reply: 'available' | 'missing' | 'not_applicable';
      }

      export interface Question {
        id: string;

        version: string;
      }
    }

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    export interface Monitor {
      /**
       * Always null. The baseline is the rows you sent.
       */
      baselineDatasetId: null;

      /**
       * IDs of the questions whose decision changed.
       */
      changedQuestionIds: Array<string>;

      /**
       * Each changed decision, earlier & now.
       */
      changes: Array<Monitor.Change>;

      /**
       * Hash of the questions, targets & context. Rows with another hash are
       * not_comparable.
       */
      configurationFingerprint: string;

      /**
       * first_run without baseline. new_to_baseline for a post baseline lacks. changed
       * when an answer clearly left its earlier decision. not_comparable when other
       * settings made the earlier row or it answers none of these questions.
       */
      status:
        'first_run' | 'new_to_baseline' | 'unchanged' | 'changed' | 'not_comparable' | 'analysis_unavailable';
    }

    export namespace Monitor {
      export interface Change {
        current: string;

        previous: string;

        questionId: string;
      }
    }
  }

  /**
   * A post without an analysis. It costs nothing.
   */
  export interface Unanalyzed {
    /**
     * Post ID. Your own texts have the IDs text:1, text:2 & so on.
     */
    id: string;

    /**
     * post_unavailable when X returns no such post. missing_text for a post without
     * text. insufficient_credits when credits ran out. context_limit when the settings
     * leave the post no room. The other reasons mean the analysis failed. Send the
     * post again.
     */
    reason: string;

    status: 'failed' | 'skipped';
  }
}

/**
 * Analyzed posts, the posts without an analysis & the totals of the answers. Each
 * row in results costs 2 credits.
 */
export interface AnalysisViralScoreResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  analysisSummary: AnalysisViralScoreResponse.AnalysisSummary;

  /**
   * Whether the search has more posts. Send next_cursor as cursor.
   */
  has_next_page: boolean;

  /**
   * Cursor of the search's next page, else empty.
   */
  next_cursor: string;

  /**
   * Each analyzed post with its answers.
   */
  results: Array<AnalysisViralScoreResponse.Result>;

  /**
   * Each post without an analysis, by ID & reason. These cost nothing.
   */
  unanalyzed: Array<AnalysisViralScoreResponse.Unanalyzed>;
}

export namespace AnalysisViralScoreResponse {
  /**
   * Totals of the answers across the analyzed posts.
   */
  export interface AnalysisSummary {
    /**
     * Posts & answers per cashtag, most posts first, up to 20. signal is present for
     * the market questions.
     */
    cashtags: Array<AnalysisSummary.Cashtag>;

    /**
     * Likes, reposts, replies & quotes of the analyzed posts.
     */
    engagement: number;

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    monitor: AnalysisSummary.Monitor | null;

    /**
     * Totals by question ID. A choice has counts, shares, engagementShares & top posts
     * per category. A score has mean, engagementWeightedMean & levels. A probability
     * has mean, yes & no.
     */
    questions: { [key: string]: { [key: string]: unknown } };

    /**
     * Posts by analysis outcome.
     */
    rows: AnalysisSummary.Rows;

    schemaVersion: number;

    /**
     * Posts per linked hostname, most posts first, up to 20.
     */
    sourceDomains: Array<AnalysisSummary.SourceDomain>;

    /**
     * Mentions & answers per target in analysis.targets.
     */
    targets: Array<AnalysisSummary.Target>;

    /**
     * Only from /x/analysis/viral-score. Scored posts, the average score, verdict
     * counts, the scores against actual engagement, a report per author & the
     * leaderboards.
     */
    viral?: { [key: string]: unknown };
  }

  export namespace AnalysisSummary {
    export interface Cashtag {
      cashtag: string;

      /**
       * Category counts of the cashtag's posts by question ID.
       */
      choices: { [key: string]: unknown };

      rows: number;

      signal?: Cashtag.Signal;
    }

    export namespace Cashtag {
      export interface Signal {
        bearish: number;

        bullish: number;

        /**
         * Bullish minus bearish posts, over all posts.
         */
        score: number;
      }
    }

    /**
     * Posts per comparison status, & up to 50 changed posts with their changes. Null
     * when the answer holds no post.
     */
    export interface Monitor {
      changedRows: Array<Monitor.ChangedRow>;

      /**
       * Posts per monitor status.
       */
      statuses: { [key: string]: number };
    }

    export namespace Monitor {
      export interface ChangedRow {
        changes: Array<ChangedRow.Change>;

        tweetId: string;
      }

      export namespace ChangedRow {
        export interface Change {
          current: string;

          previous: string;

          questionId: string;
        }
      }
    }

    /**
     * Posts by analysis outcome.
     */
    export interface Rows {
      analyzed: number;

      failed: number;

      skipped: number;
    }

    export interface SourceDomain {
      domain: string;

      posts: number;
    }

    export interface Target {
      /**
       * Category counts by question ID.
       */
      choices: { [key: string]: unknown };

      engagement: number;

      mentions: number;

      name: string;

      share: number;

      /**
       * The most engaged posts per question ID & category.
       */
      top: { [key: string]: unknown };
    }
  }

  /**
   * 1 analyzed post with its answers.
   */
  export interface Result {
    /**
     * The answers in full, with their probabilities.
     */
    analysis: Result.Analysis;

    /**
     * Each question's decision by question ID. A choice gives its category, a score
     * its level from 0, which can have decimals, & a probability its value from 0 to
     * 1.
     */
    answers: { [key: string]: string | number };

    /**
     * Cashtags in the post's text, in upper case.
     */
    cashtags: Array<string>;

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    monitor: Result.Monitor;

    /**
     * Hostnames the post links to, without t.co.
     */
    sourceDomains: Array<string>;

    /**
     * The post, as /x/tweets/search returns it. Your own texts have the IDs text:1,
     * text:2 & so on.
     */
    tweet: Shared.SearchTweet;

    /**
     * Only from /x/analysis/viral-score. The score with its weights version, the caps
     * that applied & the engagement comparison.
     */
    viral?: { [key: string]: unknown };

    /**
     * Only from /x/analysis/viral-score. log10 of 1 plus the weighted engagement per
     * 1,000 followers. Null without a follower count.
     */
    viralActualEngagementRate?: number | null;

    /**
     * Only from /x/analysis/viral-score. The post's public counts under X's published
     * ranking weights, per 1,000 views or followers.
     */
    viralAlgorithmScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. How viral the wording reads, or null when a
     * trait has no answer.
     */
    viralScore?: number | null;

    /**
     * Only from /x/analysis/viral-score. send_it from 70, edit_first from 40, else
     * sleep_on_it.
     */
    viralVerdict?: 'send_it' | 'edit_first' | 'sleep_on_it' | null;
  }

  export namespace Result {
    /**
     * The answers in full, with their probabilities.
     */
    export interface Analysis {
      /**
       * 1 answer per question, in question order.
       */
      answers: Array<Analysis.Answer>;

      /**
       * What the AI read beside the post's text.
       */
      contextAvailability: Analysis.ContextAvailability;

      /**
       * Bytes of post & settings the AI read.
       */
      contextBytes: number;

      /**
       * The ID & version of each question asked.
       */
      questions: Array<Analysis.Question>;

      status: 'succeeded';
    }

    export namespace Analysis {
      /**
       * 1 question's answer. A probability has probability. A choice or score has value,
       * confidence & the probability of each category or level.
       */
      export interface Answer {
        questionId: string;

        questionVersion: string;

        type: 'choice' | 'score' | 'probability';

        confidence?: number;

        /**
         * For a score. The levels the question named, from 0.
         */
        levels?: Array<string>;

        /**
         * Probability of each category, or of each level by index.
         */
        probabilities?: { [key: string]: number };

        /**
         * For a probability. The chance the answer is yes.
         */
        probability?: number;

        /**
         * The chosen category, or the level from 0, which can have decimals, such as 1.4
         * between levels 1 & 2.
         */
        value?: string | number;
      }

      /**
       * What the AI read beside the post's text.
       */
      export interface ContextAvailability {
        article: 'text_blocks' | 'summary' | 'not_supplied';

        author: 'available' | 'missing';

        media: 'text_descriptions_only' | 'not_supplied';

        /**
         * truncated when the post was cut to fit.
         */
        postText: 'full' | 'truncated';

        quote: 'available' | 'missing' | 'not_applicable';

        reply: 'available' | 'missing' | 'not_applicable';
      }

      export interface Question {
        id: string;

        version: string;
      }
    }

    /**
     * How the post's answers compare with its row in baseline, as the AI Actors
     * compare a run with an earlier dataset.
     */
    export interface Monitor {
      /**
       * Always null. The baseline is the rows you sent.
       */
      baselineDatasetId: null;

      /**
       * IDs of the questions whose decision changed.
       */
      changedQuestionIds: Array<string>;

      /**
       * Each changed decision, earlier & now.
       */
      changes: Array<Monitor.Change>;

      /**
       * Hash of the questions, targets & context. Rows with another hash are
       * not_comparable.
       */
      configurationFingerprint: string;

      /**
       * first_run without baseline. new_to_baseline for a post baseline lacks. changed
       * when an answer clearly left its earlier decision. not_comparable when other
       * settings made the earlier row or it answers none of these questions.
       */
      status:
        'first_run' | 'new_to_baseline' | 'unchanged' | 'changed' | 'not_comparable' | 'analysis_unavailable';
    }

    export namespace Monitor {
      export interface Change {
        current: string;

        previous: string;

        questionId: string;
      }
    }
  }

  /**
   * A post without an analysis. It costs nothing.
   */
  export interface Unanalyzed {
    /**
     * Post ID. Your own texts have the IDs text:1, text:2 & so on.
     */
    id: string;

    /**
     * post_unavailable when X returns no such post. missing_text for a post without
     * text. insufficient_credits when credits ran out. context_limit when the settings
     * leave the post no room. The other reasons mean the analysis failed. Send the
     * post again.
     */
    reason: string;

    status: 'failed' | 'skipped';
  }
}

export interface AnalysisBrandParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  analysis?: AnalysisBrandParams.Analysis;

  /**
   * Rows of an earlier answer to compare with, such as its results. Each needs the
   * post's id, or tweet.id, & its answers. Send monitor too, so other settings show
   * as not_comparable. Each result's monitor says whether the post is new, changed
   * or unchanged. The comparison costs nothing extra.
   */
  baseline?: Array<AnalysisBrandParams.Baseline>;

  /**
   * The next_cursor of the page before. Send the same search with it.
   */
  cursor?: string;

  /**
   * Maximum posts to analyze from the search. Credits can return fewer.
   */
  limit?: number;

  /**
   * Analyze a public List's posts. Send its ID or URL.
   */
  listId?: string;

  /**
   * X search to analyze, with the operators of /x/tweets/search, such as from:nasa
   * or lang:en. X searches up to 512 characters, counted with the other search
   * fields, as /x/tweets/search counts q.
   */
  query?: string;

  /**
   * Search order. Default Latest.
   */
  queryType?: 'Latest' | 'Top';

  /**
   * Analyze the quotes of 1 post. Send its ID or URL.
   */
  quotesOf?: string;

  /**
   * Analyze the replies in 1 post's conversation. Send its ID or URL.
   */
  repliesTo?: string;

  /**
   * Inclusive start of the search, such as 2026-09-25T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  sinceTime?: string | number;

  /**
   * Your own texts to analyze, such as drafts. Reads nothing from X. Each text costs
   * the same as 1 analyzed post.
   */
  texts?: Array<string>;

  /**
   * Post IDs or post URLs to analyze, up to 100.
   */
  tweetIds?: Array<string>;

  /**
   * Exclusive end of the search, such as 2026-09-26T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  untilTime?: string | number;

  /**
   * Analyze 1 account's posts. Send a handle, with or without @, or a profile URL.
   */
  username?: string;
}

export namespace AnalysisBrandParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  export interface Analysis {
    /**
     * Posts analyzed at the same time.
     */
    concurrency?: number;

    /**
     * Background the AI reads with every post.
     */
    context?: string;

    /**
     * Bytes of post, quote & settings the AI reads. Longer posts are cut to fit. Empty
     * settings take 219 bytes, so a smaller value gets a 400.
     */
    maxContextBytes?: number;

    /**
     * A ready set of questions, used when questions is left out. complaints,
     * competitors, purchase_intent & product_feedback need targets. viral_lite scores
     * how viral the wording reads.
     */
    preset?:
      | 'brand'
      | 'complaints'
      | 'competitors'
      | 'purchase_intent'
      | 'product_feedback'
      | 'news'
      | 'sentiment'
      | 'market'
      | 'viral_lite';

    /**
     * Your own questions, which replace the route's questions. Write question IDs &
     * category names in lower case without hyphens.
     */
    questions?: Array<Analysis.Question>;

    /**
     * Brands, people, assets or topics the questions are about, each with its aliases.
     */
    targets?: Array<Analysis.Target>;
  }

  export namespace Analysis {
    /**
     * A question the AI answers for each post. A choice picks 1 of 2 to 255
     * categories, a score picks 1 of 2 or more ordered levels & a probability answers
     * yes or no.
     */
    export interface Question {
      /**
       * Name of the answer, such as request. A name the response renames or drops gets a
       * 400, such as created_at, favorite_count, muting or blocking.
       */
      id: string;

      /**
       * The question, as the AI reads it.
       */
      instructions: string;

      type: 'choice' | 'score' | 'probability';

      /**
       * Your version of the question, such as 1.
       */
      version: string;

      /**
       * For a choice. Each category name with its description, or null.
       */
      categories?: { [key: string]: string | null };

      /**
       * For a probability. What counts as yes & as no.
       */
      criteria?: Question.Criteria;

      /**
       * For a score. Each level's description, lowest first.
       */
      levels?: Array<string>;
    }

    export namespace Question {
      /**
       * For a probability. What counts as yes & as no.
       */
      export interface Criteria {
        no: string;

        yes: string;
      }
    }

    export interface Target {
      name: string;

      aliases?: Array<string>;
    }
  }

  export interface Baseline {
    /**
     * The earlier answers by question ID.
     */
    answers: { [key: string]: string | number };

    /**
     * Post ID, or text:1 & so on. Else tweet.id counts.
     */
    id?: string;

    /**
     * The earlier row's monitor, with its fingerprint.
     */
    monitor?: Baseline.Monitor;

    tweet?: Baseline.Tweet;
  }

  export namespace Baseline {
    /**
     * The earlier row's monitor, with its fingerprint.
     */
    export interface Monitor {
      configurationFingerprint?: string;
    }

    export interface Tweet {
      id: string;
    }
  }
}

export interface AnalysisClassifyParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  analysis?: AnalysisClassifyParams.Analysis;

  /**
   * Rows of an earlier answer to compare with, such as its results. Each needs the
   * post's id, or tweet.id, & its answers. Send monitor too, so other settings show
   * as not_comparable. Each result's monitor says whether the post is new, changed
   * or unchanged. The comparison costs nothing extra.
   */
  baseline?: Array<AnalysisClassifyParams.Baseline>;

  /**
   * The next_cursor of the page before. Send the same search with it.
   */
  cursor?: string;

  /**
   * Maximum posts to analyze from the search. Credits can return fewer.
   */
  limit?: number;

  /**
   * Analyze a public List's posts. Send its ID or URL.
   */
  listId?: string;

  /**
   * X search to analyze, with the operators of /x/tweets/search, such as from:nasa
   * or lang:en. X searches up to 512 characters, counted with the other search
   * fields, as /x/tweets/search counts q.
   */
  query?: string;

  /**
   * Search order. Default Latest.
   */
  queryType?: 'Latest' | 'Top';

  /**
   * Analyze the quotes of 1 post. Send its ID or URL.
   */
  quotesOf?: string;

  /**
   * Analyze the replies in 1 post's conversation. Send its ID or URL.
   */
  repliesTo?: string;

  /**
   * Inclusive start of the search, such as 2026-09-25T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  sinceTime?: string | number;

  /**
   * Your own texts to analyze, such as drafts. Reads nothing from X. Each text costs
   * the same as 1 analyzed post.
   */
  texts?: Array<string>;

  /**
   * Post IDs or post URLs to analyze, up to 100.
   */
  tweetIds?: Array<string>;

  /**
   * Exclusive end of the search, such as 2026-09-26T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  untilTime?: string | number;

  /**
   * Analyze 1 account's posts. Send a handle, with or without @, or a profile URL.
   */
  username?: string;
}

export namespace AnalysisClassifyParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  export interface Analysis {
    /**
     * Posts analyzed at the same time.
     */
    concurrency?: number;

    /**
     * Background the AI reads with every post.
     */
    context?: string;

    /**
     * Bytes of post, quote & settings the AI reads. Longer posts are cut to fit. Empty
     * settings take 219 bytes, so a smaller value gets a 400.
     */
    maxContextBytes?: number;

    /**
     * A ready set of questions, used when questions is left out. complaints,
     * competitors, purchase_intent & product_feedback need targets. viral_lite scores
     * how viral the wording reads.
     */
    preset?:
      | 'brand'
      | 'complaints'
      | 'competitors'
      | 'purchase_intent'
      | 'product_feedback'
      | 'news'
      | 'sentiment'
      | 'market'
      | 'viral_lite';

    /**
     * Your own questions, which replace the route's questions. Write question IDs &
     * category names in lower case without hyphens.
     */
    questions?: Array<Analysis.Question>;

    /**
     * Brands, people, assets or topics the questions are about, each with its aliases.
     */
    targets?: Array<Analysis.Target>;
  }

  export namespace Analysis {
    /**
     * A question the AI answers for each post. A choice picks 1 of 2 to 255
     * categories, a score picks 1 of 2 or more ordered levels & a probability answers
     * yes or no.
     */
    export interface Question {
      /**
       * Name of the answer, such as request. A name the response renames or drops gets a
       * 400, such as created_at, favorite_count, muting or blocking.
       */
      id: string;

      /**
       * The question, as the AI reads it.
       */
      instructions: string;

      type: 'choice' | 'score' | 'probability';

      /**
       * Your version of the question, such as 1.
       */
      version: string;

      /**
       * For a choice. Each category name with its description, or null.
       */
      categories?: { [key: string]: string | null };

      /**
       * For a probability. What counts as yes & as no.
       */
      criteria?: Question.Criteria;

      /**
       * For a score. Each level's description, lowest first.
       */
      levels?: Array<string>;
    }

    export namespace Question {
      /**
       * For a probability. What counts as yes & as no.
       */
      export interface Criteria {
        no: string;

        yes: string;
      }
    }

    export interface Target {
      name: string;

      aliases?: Array<string>;
    }
  }

  export interface Baseline {
    /**
     * The earlier answers by question ID.
     */
    answers: { [key: string]: string | number };

    /**
     * Post ID, or text:1 & so on. Else tweet.id counts.
     */
    id?: string;

    /**
     * The earlier row's monitor, with its fingerprint.
     */
    monitor?: Baseline.Monitor;

    tweet?: Baseline.Tweet;
  }

  export namespace Baseline {
    /**
     * The earlier row's monitor, with its fingerprint.
     */
    export interface Monitor {
      configurationFingerprint?: string;
    }

    export interface Tweet {
      id: string;
    }
  }
}

export interface AnalysisMarketSignalsParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  analysis?: AnalysisMarketSignalsParams.Analysis;

  /**
   * Rows of an earlier answer to compare with, such as its results. Each needs the
   * post's id, or tweet.id, & its answers. Send monitor too, so other settings show
   * as not_comparable. Each result's monitor says whether the post is new, changed
   * or unchanged. The comparison costs nothing extra.
   */
  baseline?: Array<AnalysisMarketSignalsParams.Baseline>;

  /**
   * The next_cursor of the page before. Send the same search with it.
   */
  cursor?: string;

  /**
   * Maximum posts to analyze from the search. Credits can return fewer.
   */
  limit?: number;

  /**
   * Analyze a public List's posts. Send its ID or URL.
   */
  listId?: string;

  /**
   * X search to analyze, with the operators of /x/tweets/search, such as from:nasa
   * or lang:en. X searches up to 512 characters, counted with the other search
   * fields, as /x/tweets/search counts q.
   */
  query?: string;

  /**
   * Search order. Default Latest.
   */
  queryType?: 'Latest' | 'Top';

  /**
   * Analyze the quotes of 1 post. Send its ID or URL.
   */
  quotesOf?: string;

  /**
   * Analyze the replies in 1 post's conversation. Send its ID or URL.
   */
  repliesTo?: string;

  /**
   * Inclusive start of the search, such as 2026-09-25T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  sinceTime?: string | number;

  /**
   * Your own texts to analyze, such as drafts. Reads nothing from X. Each text costs
   * the same as 1 analyzed post.
   */
  texts?: Array<string>;

  /**
   * Post IDs or post URLs to analyze, up to 100.
   */
  tweetIds?: Array<string>;

  /**
   * Exclusive end of the search, such as 2026-09-26T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  untilTime?: string | number;

  /**
   * Analyze 1 account's posts. Send a handle, with or without @, or a profile URL.
   */
  username?: string;
}

export namespace AnalysisMarketSignalsParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  export interface Analysis {
    /**
     * Posts analyzed at the same time.
     */
    concurrency?: number;

    /**
     * Background the AI reads with every post.
     */
    context?: string;

    /**
     * Bytes of post, quote & settings the AI reads. Longer posts are cut to fit. Empty
     * settings take 219 bytes, so a smaller value gets a 400.
     */
    maxContextBytes?: number;

    /**
     * A ready set of questions, used when questions is left out. complaints,
     * competitors, purchase_intent & product_feedback need targets. viral_lite scores
     * how viral the wording reads.
     */
    preset?:
      | 'brand'
      | 'complaints'
      | 'competitors'
      | 'purchase_intent'
      | 'product_feedback'
      | 'news'
      | 'sentiment'
      | 'market'
      | 'viral_lite';

    /**
     * Your own questions, which replace the route's questions. Write question IDs &
     * category names in lower case without hyphens.
     */
    questions?: Array<Analysis.Question>;

    /**
     * Brands, people, assets or topics the questions are about, each with its aliases.
     */
    targets?: Array<Analysis.Target>;
  }

  export namespace Analysis {
    /**
     * A question the AI answers for each post. A choice picks 1 of 2 to 255
     * categories, a score picks 1 of 2 or more ordered levels & a probability answers
     * yes or no.
     */
    export interface Question {
      /**
       * Name of the answer, such as request. A name the response renames or drops gets a
       * 400, such as created_at, favorite_count, muting or blocking.
       */
      id: string;

      /**
       * The question, as the AI reads it.
       */
      instructions: string;

      type: 'choice' | 'score' | 'probability';

      /**
       * Your version of the question, such as 1.
       */
      version: string;

      /**
       * For a choice. Each category name with its description, or null.
       */
      categories?: { [key: string]: string | null };

      /**
       * For a probability. What counts as yes & as no.
       */
      criteria?: Question.Criteria;

      /**
       * For a score. Each level's description, lowest first.
       */
      levels?: Array<string>;
    }

    export namespace Question {
      /**
       * For a probability. What counts as yes & as no.
       */
      export interface Criteria {
        no: string;

        yes: string;
      }
    }

    export interface Target {
      name: string;

      aliases?: Array<string>;
    }
  }

  export interface Baseline {
    /**
     * The earlier answers by question ID.
     */
    answers: { [key: string]: string | number };

    /**
     * Post ID, or text:1 & so on. Else tweet.id counts.
     */
    id?: string;

    /**
     * The earlier row's monitor, with its fingerprint.
     */
    monitor?: Baseline.Monitor;

    tweet?: Baseline.Tweet;
  }

  export namespace Baseline {
    /**
     * The earlier row's monitor, with its fingerprint.
     */
    export interface Monitor {
      configurationFingerprint?: string;
    }

    export interface Tweet {
      id: string;
    }
  }
}

export interface AnalysisNewsParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  analysis?: AnalysisNewsParams.Analysis;

  /**
   * Rows of an earlier answer to compare with, such as its results. Each needs the
   * post's id, or tweet.id, & its answers. Send monitor too, so other settings show
   * as not_comparable. Each result's monitor says whether the post is new, changed
   * or unchanged. The comparison costs nothing extra.
   */
  baseline?: Array<AnalysisNewsParams.Baseline>;

  /**
   * The next_cursor of the page before. Send the same search with it.
   */
  cursor?: string;

  /**
   * Maximum posts to analyze from the search. Credits can return fewer.
   */
  limit?: number;

  /**
   * Analyze a public List's posts. Send its ID or URL.
   */
  listId?: string;

  /**
   * X search to analyze, with the operators of /x/tweets/search, such as from:nasa
   * or lang:en. X searches up to 512 characters, counted with the other search
   * fields, as /x/tweets/search counts q.
   */
  query?: string;

  /**
   * Search order. Default Latest.
   */
  queryType?: 'Latest' | 'Top';

  /**
   * Analyze the quotes of 1 post. Send its ID or URL.
   */
  quotesOf?: string;

  /**
   * Analyze the replies in 1 post's conversation. Send its ID or URL.
   */
  repliesTo?: string;

  /**
   * Inclusive start of the search, such as 2026-09-25T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  sinceTime?: string | number;

  /**
   * Your own texts to analyze, such as drafts. Reads nothing from X. Each text costs
   * the same as 1 analyzed post.
   */
  texts?: Array<string>;

  /**
   * Post IDs or post URLs to analyze, up to 100.
   */
  tweetIds?: Array<string>;

  /**
   * Exclusive end of the search, such as 2026-09-26T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  untilTime?: string | number;

  /**
   * Analyze 1 account's posts. Send a handle, with or without @, or a profile URL.
   */
  username?: string;
}

export namespace AnalysisNewsParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  export interface Analysis {
    /**
     * Posts analyzed at the same time.
     */
    concurrency?: number;

    /**
     * Background the AI reads with every post.
     */
    context?: string;

    /**
     * Bytes of post, quote & settings the AI reads. Longer posts are cut to fit. Empty
     * settings take 219 bytes, so a smaller value gets a 400.
     */
    maxContextBytes?: number;

    /**
     * A ready set of questions, used when questions is left out. complaints,
     * competitors, purchase_intent & product_feedback need targets. viral_lite scores
     * how viral the wording reads.
     */
    preset?:
      | 'brand'
      | 'complaints'
      | 'competitors'
      | 'purchase_intent'
      | 'product_feedback'
      | 'news'
      | 'sentiment'
      | 'market'
      | 'viral_lite';

    /**
     * Your own questions, which replace the route's questions. Write question IDs &
     * category names in lower case without hyphens.
     */
    questions?: Array<Analysis.Question>;

    /**
     * Brands, people, assets or topics the questions are about, each with its aliases.
     */
    targets?: Array<Analysis.Target>;
  }

  export namespace Analysis {
    /**
     * A question the AI answers for each post. A choice picks 1 of 2 to 255
     * categories, a score picks 1 of 2 or more ordered levels & a probability answers
     * yes or no.
     */
    export interface Question {
      /**
       * Name of the answer, such as request. A name the response renames or drops gets a
       * 400, such as created_at, favorite_count, muting or blocking.
       */
      id: string;

      /**
       * The question, as the AI reads it.
       */
      instructions: string;

      type: 'choice' | 'score' | 'probability';

      /**
       * Your version of the question, such as 1.
       */
      version: string;

      /**
       * For a choice. Each category name with its description, or null.
       */
      categories?: { [key: string]: string | null };

      /**
       * For a probability. What counts as yes & as no.
       */
      criteria?: Question.Criteria;

      /**
       * For a score. Each level's description, lowest first.
       */
      levels?: Array<string>;
    }

    export namespace Question {
      /**
       * For a probability. What counts as yes & as no.
       */
      export interface Criteria {
        no: string;

        yes: string;
      }
    }

    export interface Target {
      name: string;

      aliases?: Array<string>;
    }
  }

  export interface Baseline {
    /**
     * The earlier answers by question ID.
     */
    answers: { [key: string]: string | number };

    /**
     * Post ID, or text:1 & so on. Else tweet.id counts.
     */
    id?: string;

    /**
     * The earlier row's monitor, with its fingerprint.
     */
    monitor?: Baseline.Monitor;

    tweet?: Baseline.Tweet;
  }

  export namespace Baseline {
    /**
     * The earlier row's monitor, with its fingerprint.
     */
    export interface Monitor {
      configurationFingerprint?: string;
    }

    export interface Tweet {
      id: string;
    }
  }
}

export interface AnalysisSentimentParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  analysis?: AnalysisSentimentParams.Analysis;

  /**
   * Rows of an earlier answer to compare with, such as its results. Each needs the
   * post's id, or tweet.id, & its answers. Send monitor too, so other settings show
   * as not_comparable. Each result's monitor says whether the post is new, changed
   * or unchanged. The comparison costs nothing extra.
   */
  baseline?: Array<AnalysisSentimentParams.Baseline>;

  /**
   * The next_cursor of the page before. Send the same search with it.
   */
  cursor?: string;

  /**
   * Maximum posts to analyze from the search. Credits can return fewer.
   */
  limit?: number;

  /**
   * Analyze a public List's posts. Send its ID or URL.
   */
  listId?: string;

  /**
   * X search to analyze, with the operators of /x/tweets/search, such as from:nasa
   * or lang:en. X searches up to 512 characters, counted with the other search
   * fields, as /x/tweets/search counts q.
   */
  query?: string;

  /**
   * Search order. Default Latest.
   */
  queryType?: 'Latest' | 'Top';

  /**
   * Analyze the quotes of 1 post. Send its ID or URL.
   */
  quotesOf?: string;

  /**
   * Analyze the replies in 1 post's conversation. Send its ID or URL.
   */
  repliesTo?: string;

  /**
   * Inclusive start of the search, such as 2026-09-25T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  sinceTime?: string | number;

  /**
   * Your own texts to analyze, such as drafts. Reads nothing from X. Each text costs
   * the same as 1 analyzed post.
   */
  texts?: Array<string>;

  /**
   * Post IDs or post URLs to analyze, up to 100.
   */
  tweetIds?: Array<string>;

  /**
   * Exclusive end of the search, such as 2026-09-26T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  untilTime?: string | number;

  /**
   * Analyze 1 account's posts. Send a handle, with or without @, or a profile URL.
   */
  username?: string;
}

export namespace AnalysisSentimentParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  export interface Analysis {
    /**
     * Posts analyzed at the same time.
     */
    concurrency?: number;

    /**
     * Background the AI reads with every post.
     */
    context?: string;

    /**
     * Bytes of post, quote & settings the AI reads. Longer posts are cut to fit. Empty
     * settings take 219 bytes, so a smaller value gets a 400.
     */
    maxContextBytes?: number;

    /**
     * A ready set of questions, used when questions is left out. complaints,
     * competitors, purchase_intent & product_feedback need targets. viral_lite scores
     * how viral the wording reads.
     */
    preset?:
      | 'brand'
      | 'complaints'
      | 'competitors'
      | 'purchase_intent'
      | 'product_feedback'
      | 'news'
      | 'sentiment'
      | 'market'
      | 'viral_lite';

    /**
     * Your own questions, which replace the route's questions. Write question IDs &
     * category names in lower case without hyphens.
     */
    questions?: Array<Analysis.Question>;

    /**
     * Brands, people, assets or topics the questions are about, each with its aliases.
     */
    targets?: Array<Analysis.Target>;
  }

  export namespace Analysis {
    /**
     * A question the AI answers for each post. A choice picks 1 of 2 to 255
     * categories, a score picks 1 of 2 or more ordered levels & a probability answers
     * yes or no.
     */
    export interface Question {
      /**
       * Name of the answer, such as request. A name the response renames or drops gets a
       * 400, such as created_at, favorite_count, muting or blocking.
       */
      id: string;

      /**
       * The question, as the AI reads it.
       */
      instructions: string;

      type: 'choice' | 'score' | 'probability';

      /**
       * Your version of the question, such as 1.
       */
      version: string;

      /**
       * For a choice. Each category name with its description, or null.
       */
      categories?: { [key: string]: string | null };

      /**
       * For a probability. What counts as yes & as no.
       */
      criteria?: Question.Criteria;

      /**
       * For a score. Each level's description, lowest first.
       */
      levels?: Array<string>;
    }

    export namespace Question {
      /**
       * For a probability. What counts as yes & as no.
       */
      export interface Criteria {
        no: string;

        yes: string;
      }
    }

    export interface Target {
      name: string;

      aliases?: Array<string>;
    }
  }

  export interface Baseline {
    /**
     * The earlier answers by question ID.
     */
    answers: { [key: string]: string | number };

    /**
     * Post ID, or text:1 & so on. Else tweet.id counts.
     */
    id?: string;

    /**
     * The earlier row's monitor, with its fingerprint.
     */
    monitor?: Baseline.Monitor;

    tweet?: Baseline.Tweet;
  }

  export namespace Baseline {
    /**
     * The earlier row's monitor, with its fingerprint.
     */
    export interface Monitor {
      configurationFingerprint?: string;
    }

    export interface Tweet {
      id: string;
    }
  }
}

export interface AnalysisViralScoreParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  analysis?: AnalysisViralScoreParams.Analysis;

  /**
   * Rows of an earlier answer to compare with, such as its results. Each needs the
   * post's id, or tweet.id, & its answers. Send monitor too, so other settings show
   * as not_comparable. Each result's monitor says whether the post is new, changed
   * or unchanged. The comparison costs nothing extra.
   */
  baseline?: Array<AnalysisViralScoreParams.Baseline>;

  /**
   * The next_cursor of the page before. Send the same search with it.
   */
  cursor?: string;

  /**
   * Maximum posts to analyze from the search. Credits can return fewer.
   */
  limit?: number;

  /**
   * Analyze a public List's posts. Send its ID or URL.
   */
  listId?: string;

  /**
   * X search to analyze, with the operators of /x/tweets/search, such as from:nasa
   * or lang:en. X searches up to 512 characters, counted with the other search
   * fields, as /x/tweets/search counts q.
   */
  query?: string;

  /**
   * Search order. Default Latest.
   */
  queryType?: 'Latest' | 'Top';

  /**
   * Analyze the quotes of 1 post. Send its ID or URL.
   */
  quotesOf?: string;

  /**
   * Analyze the replies in 1 post's conversation. Send its ID or URL.
   */
  repliesTo?: string;

  /**
   * Inclusive start of the search, such as 2026-09-25T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  sinceTime?: string | number;

  /**
   * Your own texts to analyze, such as drafts. Reads nothing from X. Each text costs
   * the same as 1 analyzed post.
   */
  texts?: Array<string>;

  /**
   * Post IDs or post URLs to analyze, up to 100.
   */
  tweetIds?: Array<string>;

  /**
   * Exclusive end of the search, such as 2026-09-26T00:00:00Z. Unix seconds also
   * work. A time without an offset is UTC.
   */
  untilTime?: string | number;

  /**
   * Analyze 1 account's posts. Send a handle, with or without @, or a profile URL.
   */
  username?: string;
}

export namespace AnalysisViralScoreParams {
  /**
   * Analysis settings, the same as the analysis input of Xquik's AI Actors. Leave it
   * out for the route's own questions.
   */
  export interface Analysis {
    /**
     * Posts analyzed at the same time.
     */
    concurrency?: number;

    /**
     * Background the AI reads with every post.
     */
    context?: string;

    /**
     * Bytes of post, quote & settings the AI reads. Longer posts are cut to fit. Empty
     * settings take 219 bytes, so a smaller value gets a 400.
     */
    maxContextBytes?: number;

    /**
     * A ready set of questions, used when questions is left out. complaints,
     * competitors, purchase_intent & product_feedback need targets. viral_lite scores
     * how viral the wording reads.
     */
    preset?:
      | 'brand'
      | 'complaints'
      | 'competitors'
      | 'purchase_intent'
      | 'product_feedback'
      | 'news'
      | 'sentiment'
      | 'market'
      | 'viral_lite';

    /**
     * Your own questions, which replace the route's questions. Write question IDs &
     * category names in lower case without hyphens.
     */
    questions?: Array<Analysis.Question>;

    /**
     * Brands, people, assets or topics the questions are about, each with its aliases.
     */
    targets?: Array<Analysis.Target>;
  }

  export namespace Analysis {
    /**
     * A question the AI answers for each post. A choice picks 1 of 2 to 255
     * categories, a score picks 1 of 2 or more ordered levels & a probability answers
     * yes or no.
     */
    export interface Question {
      /**
       * Name of the answer, such as request. A name the response renames or drops gets a
       * 400, such as created_at, favorite_count, muting or blocking.
       */
      id: string;

      /**
       * The question, as the AI reads it.
       */
      instructions: string;

      type: 'choice' | 'score' | 'probability';

      /**
       * Your version of the question, such as 1.
       */
      version: string;

      /**
       * For a choice. Each category name with its description, or null.
       */
      categories?: { [key: string]: string | null };

      /**
       * For a probability. What counts as yes & as no.
       */
      criteria?: Question.Criteria;

      /**
       * For a score. Each level's description, lowest first.
       */
      levels?: Array<string>;
    }

    export namespace Question {
      /**
       * For a probability. What counts as yes & as no.
       */
      export interface Criteria {
        no: string;

        yes: string;
      }
    }

    export interface Target {
      name: string;

      aliases?: Array<string>;
    }
  }

  export interface Baseline {
    /**
     * The earlier answers by question ID.
     */
    answers: { [key: string]: string | number };

    /**
     * Post ID, or text:1 & so on. Else tweet.id counts.
     */
    id?: string;

    /**
     * The earlier row's monitor, with its fingerprint.
     */
    monitor?: Baseline.Monitor;

    tweet?: Baseline.Tweet;
  }

  export namespace Baseline {
    /**
     * The earlier row's monitor, with its fingerprint.
     */
    export interface Monitor {
      configurationFingerprint?: string;
    }

    export interface Tweet {
      id: string;
    }
  }
}

export declare namespace Analysis {
  export {
    type AnalysisBrandResponse as AnalysisBrandResponse,
    type AnalysisClassifyResponse as AnalysisClassifyResponse,
    type AnalysisMarketSignalsResponse as AnalysisMarketSignalsResponse,
    type AnalysisNewsResponse as AnalysisNewsResponse,
    type AnalysisSentimentResponse as AnalysisSentimentResponse,
    type AnalysisViralScoreResponse as AnalysisViralScoreResponse,
    type AnalysisBrandParams as AnalysisBrandParams,
    type AnalysisClassifyParams as AnalysisClassifyParams,
    type AnalysisMarketSignalsParams as AnalysisMarketSignalsParams,
    type AnalysisNewsParams as AnalysisNewsParams,
    type AnalysisSentimentParams as AnalysisSentimentParams,
    type AnalysisViralScoreParams as AnalysisViralScoreParams,
  };
}
