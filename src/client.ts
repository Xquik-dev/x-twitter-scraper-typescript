// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type { RequestInit, RequestInfo, BodyInit } from './internal/builtin-types';
import type { HTTPMethod, PromiseOrValue, MergedRequestInit, FinalizedRequestInit } from './internal/types';
import { uuid4 } from './internal/utils/uuid';
import { validatePositiveInteger, isAbsoluteURL, safeJSON, type JSONValue } from './internal/utils/values';
import { isReadableStream, runtime } from './internal/runtime';
import { sleep } from './internal/utils/sleep';
export type { Logger, LogLevel } from './internal/utils/log';
import { castToError, isAbortError } from './internal/errors';
import type { APIResponseProps } from './internal/parse';
import { getPlatformHeaders } from './internal/detect-platform';
import * as Shims from './internal/shims';
import * as Opts from './internal/request-options';
import { stringifyQuery } from './internal/utils/query';
import { VERSION } from './version';
import * as Errors from './core/error';
import * as Uploads from './core/uploads';
import * as API from './resources/index';
import { APIPromise } from './core/api-promise';
import {
  Account,
  AccountRetrieveResponse,
  AccountSetXUsernameParams,
  AccountSetXUsernameResponse,
  AccountUpdateLocaleParams,
  AccountUpdateLocaleResponse,
} from './resources/account';
import { Compose, ComposeCreateParams, ComposeCreateResponse } from './resources/compose';
import {
  CreditRedirectTopupCheckoutParams,
  CreditRetrieveBalanceResponse,
  CreditRetrieveTopupStatusParams,
  CreditRetrieveTopupStatusResponse,
  CreditTopupBalanceParams,
  CreditTopupBalanceResponse,
  Credits,
} from './resources/credits';
import {
  Draft,
  DraftCreateParams,
  DraftCreateResponse,
  DraftDetail,
  DraftListParams,
  DraftListResponse,
  Drafts,
} from './resources/drafts';
import {
  DrawDetail,
  DrawExportParams,
  DrawListItem,
  DrawListParams,
  DrawListResponse,
  DrawRetrieveResponse,
  DrawRunParams,
  DrawRunResponse,
  Draws,
  Winner,
} from './resources/draws';
import {
  Event,
  EventDetail,
  EventListParams,
  EventListResponse,
  EventStreamParams,
  Events,
} from './resources/events';
import {
  ExtractionCancelResponse,
  ExtractionEstimateCostParams,
  ExtractionEstimateCostResponse,
  ExtractionExportResultsParams,
  ExtractionJob,
  ExtractionListParams,
  ExtractionListResponse,
  ExtractionRetrieveParams,
  ExtractionRetrieveResponse,
  ExtractionRunParams,
  ExtractionRunResponse,
  Extractions,
} from './resources/extractions';
import {
  GuestWalletAmount,
  GuestWalletCreateParams,
  GuestWalletCreateResponse,
  GuestWalletRetrieveStatusResponse,
  GuestWalletTopupParams,
  GuestWalletTopupResponse,
  GuestWallets,
} from './resources/guest-wallets';
import {
  Radar,
  RadarItem,
  RadarRetrieveTrendingTopicsParams,
  RadarRetrieveTrendingTopicsResponse,
} from './resources/radar';
import {
  StyleAnalyzeParams,
  StyleCompareParams,
  StyleCompareResponse,
  StyleGetPerformanceResponse,
  StyleListParams,
  StyleListResponse,
  StyleProfile,
  StyleProfileSummary,
  StyleUpdateParams,
  Styles,
} from './resources/styles';
import { Subscribe, SubscribeCreateParams, SubscribeCreateResponse } from './resources/subscribe';
import { TrendListParams, TrendListResponse, Trends } from './resources/trends';
import {
  Delivery,
  Webhook,
  WebhookCreateParams,
  WebhookCreateResponse,
  WebhookCreateTelegramLinkParams,
  WebhookCreateTelegramLinkResponse,
  WebhookDeactivateResponse,
  WebhookListDeliveriesParams,
  WebhookListDeliveriesResponse,
  WebhookListParams,
  WebhookListResponse,
  WebhookResumeResponse,
  WebhookTestResponse,
  WebhookUpdateParams,
  Webhooks,
} from './resources/webhooks';
import {
  Monitor,
  MonitorCreateParams,
  MonitorCreateResponse,
  MonitorDeactivateResponse,
  MonitorListParams,
  MonitorListResponse,
  MonitorUpdateParams,
  Monitors,
} from './resources/monitors/monitors';
import { Support } from './resources/support/support';
import {
  TrendLocation,
  X,
  XAutocompleteSearchParams,
  XAutocompleteSearchResponse,
  XGetArticleParams,
  XGetArticleResponse,
  XGetHashflagsParams,
  XGetHashflagsResponse,
  XGetHomeTimelineParams,
  XGetNewsStoryVersionsParams,
  XGetNewsStoryVersionsResponse,
  XGetNotificationsParams,
  XGetNotificationsResponse,
  XGetTrendLocationsParams,
  XGetTrendLocationsResponse,
  XGetTrendsHistoryParams,
  XGetTrendsHistoryResponse,
  XGetTrendsParams,
  XGetTrendsResponse,
  XSearchPlacesParams,
  XSearchPlacesResponse,
} from './resources/x/x';
import { type Fetch } from './internal/builtin-types';
import { HeadersLike, NullableHeaders, buildHeaders } from './internal/headers';
import { FinalRequestOptions, RequestOptions } from './internal/request-options';
import { readEnv } from './internal/utils/env';
import {
  type LogLevel,
  type Logger,
  formatRequestDetails,
  loggerFor,
  parseLogLevel,
} from './internal/utils/log';
import { isEmptyObj } from './internal/utils/values';

const DEFAULT_BASE_URL = 'https://xquik.com/api/v1';

function isClientConstructor(value: unknown): value is new (options: ClientOptions) => XTwitterScraper {
  return typeof value === 'function' && (value === XTwitterScraper || XTwitterScraper.isPrototypeOf(value));
}

export interface ClientOptions {
  /**
   * Defaults to process.env['X_TWITTER_SCRAPER_API_KEY'].
   */
  apiKey?: string | null | undefined;

  /**
   * OAuth 2.1 access token
   */
  bearerToken?: string | null | undefined;

  /**
   * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
   *
   * Defaults to process.env['X_TWITTER_SCRAPER_BASE_URL'].
   */
  baseURL?: string | null | undefined;

  /**
   * The maximum amount of time (in milliseconds) that the client should wait for a response
   * from the server before timing out a single request.
   *
   * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
   * much longer than this timeout before the promise succeeds or fails.
   *
   * @unit milliseconds
   */
  timeout?: number | undefined;
  /**
   * Additional `RequestInit` options to be passed to `fetch` calls.
   * Properties will be overridden by per-request `fetchOptions`.
   */
  fetchOptions?: MergedRequestInit | undefined;

  /**
   * Specify a custom `fetch` function implementation.
   *
   * Defaults to globalThis.fetch.
   */
  fetch?: Fetch | undefined;

  /**
   * The maximum number of times that the client will retry a request in case of a
   * temporary failure, like a network error or a 5XX error from the server.
   *
   * @default 2
   */
  maxRetries?: number | undefined;

  /**
   * Default headers to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * header to `null` in request options.
   */
  defaultHeaders?: HeadersLike | undefined;

  /**
   * Default query parameters to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * param to `undefined` in request options.
   */
  defaultQuery?: Record<string, string | undefined> | undefined;

  /**
   * Set the log level.
   *
   * Defaults to process.env['X_TWITTER_SCRAPER_LOG'] or 'warn' if it isn't set.
   */
  logLevel?: LogLevel | undefined;

  /**
   * Set the logger.
   *
   * Defaults to globalThis.console.
   */
  logger?: Logger | undefined;
}

/**
 * API Client for interfacing with the X Twitter Scraper API.
 */
export class XTwitterScraper {
  apiKey: string | null;
  bearerToken: string | null;

  baseURL: string;
  maxRetries: number;
  timeout: number;
  logger: Logger;
  logLevel: LogLevel | undefined;
  fetchOptions: MergedRequestInit | undefined;

  private fetch: Fetch;
  #encoder: Opts.RequestEncoder;
  protected idempotencyHeader?: string;
  private _options: ClientOptions;

  /**
   * API Client for interfacing with the X Twitter Scraper API.
   *
   * @param {string | null | undefined} [opts.apiKey=process.env['X_TWITTER_SCRAPER_API_KEY'] ?? null]
   * @param {string | null | undefined} [opts.bearerToken=process.env['X_TWITTER_SCRAPER_BEARER_TOKEN'] ?? null]
   * @param {string} [opts.baseURL=process.env['X_TWITTER_SCRAPER_BASE_URL'] ?? https://xquik.com/api/v1] - Override the default base URL for the API.
   * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
   * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
   */
  constructor({
    baseURL = readEnv('X_TWITTER_SCRAPER_BASE_URL'),
    apiKey = readEnv('X_TWITTER_SCRAPER_API_KEY') ?? null,
    bearerToken = readEnv('X_TWITTER_SCRAPER_BEARER_TOKEN') ?? null,
    ...opts
  }: ClientOptions = {}) {
    const options: ClientOptions = {
      apiKey,
      bearerToken,
      ...opts,
      baseURL: baseURL || DEFAULT_BASE_URL,
    };

    this.baseURL = baseURL || DEFAULT_BASE_URL;
    this.timeout = options.timeout ?? XTwitterScraper.DEFAULT_TIMEOUT;
    this.logger = options.logger ?? console;
    const defaultLogLevel = 'warn';
    this.logLevel = defaultLogLevel;
    this.logLevel =
      parseLogLevel(options.logLevel, 'ClientOptions.logLevel', this) ??
      parseLogLevel(readEnv('X_TWITTER_SCRAPER_LOG'), "process.env['X_TWITTER_SCRAPER_LOG']", this) ??
      defaultLogLevel;
    this.fetchOptions = options.fetchOptions;
    this.maxRetries = options.maxRetries ?? 2;
    this.fetch = options.fetch ?? Shims.getDefaultFetch();
    this.#encoder = Opts.FallbackEncoder;

    const customHeadersEnv = readEnv('X_TWITTER_SCRAPER_CUSTOM_HEADERS');
    if (customHeadersEnv) {
      const parsed: Record<string, string> = {};
      for (const line of customHeadersEnv.split('\n')) {
        const colon = line.indexOf(':');
        if (colon >= 0) {
          parsed[line.substring(0, colon).trim()] = line.substring(colon + 1).trim();
        }
      }
      options.defaultHeaders = { ...parsed, ...options.defaultHeaders };
    }

    this._options = options;

    this.apiKey = apiKey;
    this.bearerToken = bearerToken;
  }

  /**
   * Create a new client instance re-using the same options given to the current client with optional overriding.
   */
  withOptions(options: Partial<ClientOptions>): XTwitterScraper {
    const Client: unknown = this.constructor;
    const Constructor = isClientConstructor(Client) ? Client : XTwitterScraper;
    const client = new Constructor({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      bearerToken: this.bearerToken,
      ...options,
    });
    return client;
  }

  #baseURLOverridden(): boolean {
    return this.baseURL !== DEFAULT_BASE_URL;
  }

  protected defaultQuery(): Record<string, string | undefined> | undefined {
    return this._options.defaultQuery;
  }

  protected validateHeaders({ values, nulls }: NullableHeaders) {
    if (this.apiKey && values.get('x-api-key')) {
      return;
    }
    if (nulls.has('x-api-key')) {
      return;
    }

    if (this.bearerToken && values.get('authorization')) {
      return;
    }
    if (nulls.has('authorization')) {
      return;
    }

    throw new Error(
      'Could not resolve authentication method. Expected either apiKey or bearerToken to be set. Or for one of the "x-api-key" or "Authorization" headers to be explicitly omitted',
    );
  }

  protected async authHeaders(
    opts: FinalRequestOptions,
    schemes: { apiKeyAuth?: boolean; oauthBearerAuth?: boolean },
  ): Promise<NullableHeaders | undefined> {
    return buildHeaders([
      schemes.apiKeyAuth ? await this.apiKeyAuth(opts) : null,
      schemes.oauthBearerAuth ? await this.oauthBearerAuth(opts) : null,
    ]);
  }

  protected async apiKeyAuth(opts: FinalRequestOptions): Promise<NullableHeaders | undefined> {
    if (this.apiKey == null) {
      return undefined;
    }
    return buildHeaders([{ 'x-api-key': this.apiKey }]);
  }

  protected async oauthBearerAuth(opts: FinalRequestOptions): Promise<NullableHeaders | undefined> {
    if (this.bearerToken == null) {
      return undefined;
    }
    return buildHeaders([{ Authorization: `Bearer ${this.bearerToken}` }]);
  }

  protected stringifyQuery(query: object | Record<string, unknown>): string {
    return stringifyQuery(query);
  }

  private getUserAgent(): string {
    return `${this.constructor.name}/JS ${VERSION}`;
  }

  protected defaultIdempotencyKey(): string {
    return `xquik-node-retry-${uuid4()}`;
  }

  protected makeStatusError(
    status: number,
    error: JSONValue | undefined,
    message: string | undefined,
    headers: Headers,
  ): Errors.APIError {
    return Errors.APIError.generate(status, error, message, headers);
  }

  buildURL(
    path: string,
    query: object | null | undefined,
    defaultBaseURL?: string | undefined,
  ): string {
    const baseURL = (!this.#baseURLOverridden() && defaultBaseURL) || this.baseURL;
    const url =
      isAbsoluteURL(path) ?
        new URL(path)
      : new URL(baseURL + (baseURL.endsWith('/') && path.startsWith('/') ? path.slice(1) : path));

    const defaultQuery = this.defaultQuery();
    const pathQuery = Object.fromEntries(url.searchParams);
    if (!isEmptyObj(defaultQuery) || !isEmptyObj(pathQuery)) {
      query = { ...pathQuery, ...defaultQuery, ...query };
    }

    if (typeof query === 'object' && query && !Array.isArray(query)) {
      url.search = this.stringifyQuery(query);
    }

    return url.toString();
  }

  protected async prepareOptions(options: FinalRequestOptions): Promise<void> {}

  protected async prepareRequest(
    request: RequestInit,
    { url, options }: { url: string; options: FinalRequestOptions },
  ): Promise<void> {}

  get<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('get', path, opts);
  }

  post<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('post', path, opts);
  }

  patch<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('patch', path, opts);
  }

  put<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('put', path, opts);
  }

  delete<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('delete', path, opts);
  }

  private methodRequest<Rsp>(
    method: HTTPMethod,
    path: string,
    opts?: PromiseOrValue<RequestOptions>,
  ): APIPromise<Rsp> {
    return this.request(
      Promise.resolve(opts).then((opts) => {
        return { method, path, ...opts };
      }),
    );
  }

  request<Rsp>(
    options: PromiseOrValue<FinalRequestOptions>,
    remainingRetries: number | null = null,
  ): APIPromise<Rsp> {
    return new APIPromise(this, this.makeRequest(options, remainingRetries, undefined));
  }

  private async makeRequest(
    optionsInput: PromiseOrValue<FinalRequestOptions>,
    retriesRemaining: number | null,
    retryOfRequestLogID: string | undefined,
  ): Promise<APIResponseProps> {
    const options = await optionsInput;
    const maxRetries = options.maxRetries ?? this.maxRetries;
    if (retriesRemaining == null) {
      retriesRemaining = maxRetries;
    }

    await this.prepareOptions(options);

    const { req, url, timeout } = await this.buildRequest(options, {
      retryCount: maxRetries - retriesRemaining,
    });

    await this.prepareRequest(req, { url, options });

    const requestLogID = 'log_' + ((Math.random() * (1 << 24)) | 0).toString(16).padStart(6, '0');
    const retryLogStr = retryOfRequestLogID === undefined ? '' : `, retryOf: ${retryOfRequestLogID}`;
    const startTime = Date.now();

    loggerFor(this).debug(
      `[${requestLogID}] sending request`,
      formatRequestDetails({
        retryOfRequestLogID,
        method: options.method,
        url,
        options,
        headers: req.headers,
      }),
    );

    if (options.signal?.aborted) {
      throw new Errors.APIUserAbortError();
    }

    const controller = new AbortController();
    const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
    const headersTime = Date.now();

    if (response instanceof globalThis.Error) {
      const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
      if (options.signal?.aborted) {
        throw new Errors.APIUserAbortError();
      }
      const isTimeout =
        isAbortError(response) ||
        /timed? ?out/i.test(String(response) + ('cause' in response ? String(response.cause) : ''));
      if (retriesRemaining) {
        loggerFor(this).info(
          `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - ${retryMessage}`,
        );
        loggerFor(this).debug(
          `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (${retryMessage})`,
          formatRequestDetails({
            retryOfRequestLogID,
            url,
            durationMs: headersTime - startTime,
            message: response.message,
          }),
        );
        return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
      }
      loggerFor(this).info(
        `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - error; no more retries left`,
      );
      loggerFor(this).debug(
        `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (error; no more retries left)`,
        formatRequestDetails({
          retryOfRequestLogID,
          url,
          durationMs: headersTime - startTime,
          message: response.message,
        }),
      );
      if (isTimeout) {
        throw new Errors.APIConnectionTimeoutError();
      }
      throw new Errors.APIConnectionError({ cause: response });
    }

    const responseInfo = `[${requestLogID}${retryLogStr}] ${req.method} ${url} ${
      response.ok ? 'succeeded' : 'failed'
    } with status ${response.status} in ${headersTime - startTime}ms`;

    if (!response.ok) {
      const shouldRetry = await this.shouldRetry(response);
      if (retriesRemaining && shouldRetry) {
        const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;

        await Shims.CancelReadableStream(response.body);
        loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
        loggerFor(this).debug(
          `[${requestLogID}] response error (${retryMessage})`,
          formatRequestDetails({
            retryOfRequestLogID,
            url: response.url,
            status: response.status,
            headers: response.headers,
            durationMs: headersTime - startTime,
          }),
        );
        return this.retryRequest(
          options,
          retriesRemaining,
          retryOfRequestLogID ?? requestLogID,
          response.headers,
        );
      }

      const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;

      loggerFor(this).info(`${responseInfo} - ${retryMessage}`);

      const errText = await response.text().catch((err: unknown) => castToError(err).message);
      const errJSON = safeJSON(errText);
      const errMessage = errJSON ? undefined : errText;

      loggerFor(this).debug(
        `[${requestLogID}] response error (${retryMessage})`,
        formatRequestDetails({
          retryOfRequestLogID,
          url: response.url,
          status: response.status,
          headers: response.headers,
          message: errMessage,
          durationMs: Date.now() - startTime,
        }),
      );

      const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
      throw err;
    }

    loggerFor(this).info(responseInfo);
    loggerFor(this).debug(
      `[${requestLogID}] response start`,
      formatRequestDetails({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        headers: response.headers,
        durationMs: headersTime - startTime,
      }),
    );

    return { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
  }

  async fetchWithTimeout(
    url: RequestInfo,
    init: RequestInit | undefined,
    ms: number,
    controller: AbortController,
  ): Promise<Response> {
    const { signal, method, ...options } = init || {};
    const abort = this._makeAbort(controller);
    if (signal) signal.addEventListener('abort', abort, { once: true });

    const timeout = setTimeout(abort, ms);

    const isReadableBody =
      isReadableStream(options.body) ||
      (typeof options.body === 'object' && options.body !== null && Symbol.asyncIterator in options.body);

    const fetchOptions: RequestInit = {
      signal: controller.signal,
      ...(isReadableBody ? { duplex: 'half' } : {}),
      method: 'GET',
      ...options,
    };
    if (method) {
      // Custom methods like 'patch' need to be uppercased
      // See https://github.com/nodejs/undici/issues/2294
      fetchOptions.method = method.toUpperCase();
    }

    try {
      return await this.fetch.call(undefined, url, fetchOptions);
    } finally {
      clearTimeout(timeout);
    }
  }

  private async shouldRetry(response: Response): Promise<boolean> {
    const shouldRetryHeader = response.headers.get('x-should-retry');

    if (shouldRetryHeader === 'true') return true;
    if (shouldRetryHeader === 'false') return false;

    if (response.status === 408) return true;

    if (response.status === 409) return true;

    if (response.status === 429) return true;

    if (response.status >= 500) return true;

    return false;
  }

  private async retryRequest(
    options: FinalRequestOptions,
    retriesRemaining: number,
    requestLogID: string,
    responseHeaders?: Headers | undefined,
  ): Promise<APIResponseProps> {
    let timeoutMillis: number | undefined;

    const retryAfterMillisHeader = responseHeaders?.get('retry-after-ms');
    if (retryAfterMillisHeader) {
      const timeoutMs = parseFloat(retryAfterMillisHeader);
      if (!Number.isNaN(timeoutMs)) {
        timeoutMillis = timeoutMs;
      }
    }

    const retryAfterHeader = responseHeaders?.get('retry-after');
    if (retryAfterHeader && !timeoutMillis) {
      const timeoutSeconds = parseFloat(retryAfterHeader);
      if (!Number.isNaN(timeoutSeconds)) {
        timeoutMillis = timeoutSeconds * 1000;
      } else {
        timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
      }
    }

    if (timeoutMillis === undefined) {
      const maxRetries = options.maxRetries ?? this.maxRetries;
      timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
    }
    await sleep(timeoutMillis);

    return this.makeRequest(options, retriesRemaining - 1, requestLogID);
  }

  private calculateDefaultRetryTimeoutMillis(retriesRemaining: number, maxRetries: number): number {
    const initialRetryDelay = 0.5;
    const maxRetryDelay = 8.0;

    const numRetries = maxRetries - retriesRemaining;

    const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);

    const jitter = 1 - Math.random() * 0.25;

    return sleepSeconds * jitter * 1000;
  }

  async buildRequest(
    inputOptions: FinalRequestOptions,
    { retryCount = 0 }: { retryCount?: number } = {},
  ): Promise<{ req: FinalizedRequestInit; url: string; timeout: number }> {
    const options = { ...inputOptions };
    const { method, path, query, defaultBaseURL } = options;

    const url = this.buildURL(path, query, defaultBaseURL);
    if ('timeout' in options) validatePositiveInteger('timeout', options.timeout);
    options.timeout = options.timeout ?? this.timeout;
    const { bodyHeaders, body } = this.buildBody({ options });
    const reqHeaders = await this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });

    const req: FinalizedRequestInit = {
      method,
      headers: reqHeaders,
      ...(options.signal && { signal: options.signal }),
      ...(isReadableStream(body) && { duplex: 'half' }),
      ...(body && { body }),
      ...this.fetchOptions,
      ...options.fetchOptions,
    };

    return { req, url, timeout: options.timeout };
  }

  private async buildHeaders({
    options,
    method,
    bodyHeaders,
    retryCount,
  }: {
    options: FinalRequestOptions;
    method: HTTPMethod;
    bodyHeaders: HeadersLike;
    retryCount: number;
  }): Promise<Headers> {
    let idempotencyHeaders: HeadersLike = {};
    if (this.idempotencyHeader && method !== 'get') {
      if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
      idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
    }

    const security = options.__security ?? { apiKeyAuth: true, oauthBearerAuth: true };
    const headers = buildHeaders([
      idempotencyHeaders,
      {
        Accept: 'application/json',
        'User-Agent': this.getUserAgent(),
        'X-Stainless-Retry-Count': String(retryCount),
        ...(options.timeout ? { 'X-Stainless-Timeout': String(Math.trunc(options.timeout / 1000)) } : {}),
        ...getPlatformHeaders(),
      },
      await this.authHeaders(options, security),
      this._options.defaultHeaders,
      bodyHeaders,
      options.headers,
    ]);

    if (security.apiKeyAuth || security.oauthBearerAuth) {
      this.validateHeaders(headers);
    }

    return headers.values;
  }

  private _makeAbort(controller: AbortController) {
    return () => controller.abort();
  }

  private buildBody({ options }: { options: FinalRequestOptions }): {
    bodyHeaders: HeadersLike;
    body: BodyInit | undefined;
  } {
    const { body, headers: rawHeaders } = options;
    if (!body) {
      if (body == null && 'body' in options) {
        return this.#encoder({ body, headers: buildHeaders([rawHeaders]) });
      }
      return { bodyHeaders: undefined, body: undefined };
    }
    const headers = buildHeaders([rawHeaders]);
    if (ArrayBuffer.isView(body)) {
      return { bodyHeaders: undefined, body: new Uint8Array(body.buffer, body.byteOffset, body.byteLength) };
    }
    if (
      body instanceof ArrayBuffer ||
      (typeof body === 'string' && headers.values.has('content-type')) ||
      (runtime.Blob !== undefined && body instanceof runtime.Blob) ||
      body instanceof FormData ||
      body instanceof URLSearchParams
    ) {
      return { bodyHeaders: undefined, body };
    }
    if (isReadableStream(body)) {
      return { bodyHeaders: undefined, body: Shims.toByteStream(body) };
    } else if (Shims.isAsyncIterable(body) || Shims.isIteratorObject(body)) {
      return { bodyHeaders: undefined, body: Shims.ReadableStreamFrom(Shims.byteChunks(body)) };
    } else if (
      typeof body === 'object' &&
      headers.values.get('content-type') === 'application/x-www-form-urlencoded'
    ) {
      return {
        bodyHeaders: { 'content-type': 'application/x-www-form-urlencoded' },
        body: this.stringifyQuery(body),
      };
    } else {
      return this.#encoder({ body, headers });
    }
  }

  static XTwitterScraper = this;
  static DEFAULT_TIMEOUT = 60000;

  static XTwitterScraperError = Errors.XTwitterScraperError;
  static APIError = Errors.APIError;
  static APIConnectionError = Errors.APIConnectionError;
  static APIConnectionTimeoutError = Errors.APIConnectionTimeoutError;
  static APIUserAbortError = Errors.APIUserAbortError;
  static NotFoundError = Errors.NotFoundError;
  static ConflictError = Errors.ConflictError;
  static RateLimitError = Errors.RateLimitError;
  static BadRequestError = Errors.BadRequestError;
  static AuthenticationError = Errors.AuthenticationError;
  static InternalServerError = Errors.InternalServerError;
  static PermissionDeniedError = Errors.PermissionDeniedError;
  static UnprocessableEntityError = Errors.UnprocessableEntityError;

  static toFile = Uploads.toFile;

  /**
   * Account info and settings
   */
  account: API.Account = new API.Account(this);
  /**
   * Subscription, billing, and credits
   */
  subscribe: API.Subscribe = new API.Subscribe(this);
  /**
   * AI tweet composition, drafts, writing styles, and radar
   */
  compose: API.Compose = new API.Compose(this);
  /**
   * AI tweet composition, drafts, writing styles, and radar
   */
  drafts: API.Drafts = new API.Drafts(this);
  /**
   * AI tweet composition, drafts, writing styles, and radar
   */
  styles: API.Styles = new API.Styles(this);
  /**
   * AI tweet composition, drafts, writing styles, and radar
   */
  radar: API.Radar = new API.Radar(this);
  /**
   * X account monitoring with 1-second checks
   */
  monitors: API.Monitors = new API.Monitors(this);
  /**
   * Activity events from monitored accounts
   */
  events: API.Events = new API.Events(this);
  /**
   * Saved or bulk data extraction (23 tool types)
   */
  extractions: API.Extractions = new API.Extractions(this);
  /**
   * Giveaway draws from tweet replies
   */
  draws: API.Draws = new API.Draws(this);
  /**
   * Webhook endpoint management and delivery
   */
  webhooks: API.Webhooks = new API.Webhooks(this);
  x: API.X = new API.X(this);
  /**
   * Trending topics and hashtags by region
   */
  trends: API.Trends = new API.Trends(this);
  support: API.Support = new API.Support(this);
  /**
   * Subscription, billing, and credits
   */
  credits: API.Credits = new API.Credits(this);
  /**
   * Accountless prepaid access for paid read endpoints
   */
  guestWallets: API.GuestWallets = new API.GuestWallets(this);
}

XTwitterScraper.Account = Account;
XTwitterScraper.Subscribe = Subscribe;
XTwitterScraper.Compose = Compose;
XTwitterScraper.Drafts = Drafts;
XTwitterScraper.Styles = Styles;
XTwitterScraper.Radar = Radar;
XTwitterScraper.Monitors = Monitors;
XTwitterScraper.Events = Events;
XTwitterScraper.Extractions = Extractions;
XTwitterScraper.Draws = Draws;
XTwitterScraper.Webhooks = Webhooks;
XTwitterScraper.X = X;
XTwitterScraper.Trends = Trends;
XTwitterScraper.Support = Support;
XTwitterScraper.Credits = Credits;
XTwitterScraper.GuestWallets = GuestWallets;

export declare namespace XTwitterScraper {
  export type RequestOptions = Opts.RequestOptions;

  export {
    Account as Account,
    type AccountRetrieveResponse as AccountRetrieveResponse,
    type AccountSetXUsernameResponse as AccountSetXUsernameResponse,
    type AccountUpdateLocaleResponse as AccountUpdateLocaleResponse,
    type AccountSetXUsernameParams as AccountSetXUsernameParams,
    type AccountUpdateLocaleParams as AccountUpdateLocaleParams,
  };

  export {
    Subscribe as Subscribe,
    type SubscribeCreateResponse as SubscribeCreateResponse,
    type SubscribeCreateParams as SubscribeCreateParams,
  };

  export {
    Compose as Compose,
    type ComposeCreateResponse as ComposeCreateResponse,
    type ComposeCreateParams as ComposeCreateParams,
  };

  export {
    Drafts as Drafts,
    type Draft as Draft,
    type DraftDetail as DraftDetail,
    type DraftCreateResponse as DraftCreateResponse,
    type DraftListResponse as DraftListResponse,
    type DraftCreateParams as DraftCreateParams,
    type DraftListParams as DraftListParams,
  };

  export {
    Styles as Styles,
    type StyleProfile as StyleProfile,
    type StyleProfileSummary as StyleProfileSummary,
    type StyleListResponse as StyleListResponse,
    type StyleCompareResponse as StyleCompareResponse,
    type StyleGetPerformanceResponse as StyleGetPerformanceResponse,
    type StyleUpdateParams as StyleUpdateParams,
    type StyleListParams as StyleListParams,
    type StyleAnalyzeParams as StyleAnalyzeParams,
    type StyleCompareParams as StyleCompareParams,
  };

  export {
    Radar as Radar,
    type RadarItem as RadarItem,
    type RadarRetrieveTrendingTopicsResponse as RadarRetrieveTrendingTopicsResponse,
    type RadarRetrieveTrendingTopicsParams as RadarRetrieveTrendingTopicsParams,
  };

  export {
    Monitors as Monitors,
    type Monitor as Monitor,
    type MonitorCreateResponse as MonitorCreateResponse,
    type MonitorListResponse as MonitorListResponse,
    type MonitorDeactivateResponse as MonitorDeactivateResponse,
    type MonitorCreateParams as MonitorCreateParams,
    type MonitorUpdateParams as MonitorUpdateParams,
    type MonitorListParams as MonitorListParams,
  };

  export {
    Events as Events,
    type Event as Event,
    type EventDetail as EventDetail,
    type EventListResponse as EventListResponse,
    type EventListParams as EventListParams,
    type EventStreamParams as EventStreamParams,
  };

  export {
    Extractions as Extractions,
    type ExtractionJob as ExtractionJob,
    type ExtractionRetrieveResponse as ExtractionRetrieveResponse,
    type ExtractionListResponse as ExtractionListResponse,
    type ExtractionCancelResponse as ExtractionCancelResponse,
    type ExtractionEstimateCostResponse as ExtractionEstimateCostResponse,
    type ExtractionRunResponse as ExtractionRunResponse,
    type ExtractionRetrieveParams as ExtractionRetrieveParams,
    type ExtractionListParams as ExtractionListParams,
    type ExtractionEstimateCostParams as ExtractionEstimateCostParams,
    type ExtractionExportResultsParams as ExtractionExportResultsParams,
    type ExtractionRunParams as ExtractionRunParams,
  };

  export {
    Draws as Draws,
    type DrawDetail as DrawDetail,
    type DrawListItem as DrawListItem,
    type Winner as Winner,
    type DrawRetrieveResponse as DrawRetrieveResponse,
    type DrawListResponse as DrawListResponse,
    type DrawRunResponse as DrawRunResponse,
    type DrawListParams as DrawListParams,
    type DrawExportParams as DrawExportParams,
    type DrawRunParams as DrawRunParams,
  };

  export {
    Webhooks as Webhooks,
    type Delivery as Delivery,
    type Webhook as Webhook,
    type WebhookCreateResponse as WebhookCreateResponse,
    type WebhookListResponse as WebhookListResponse,
    type WebhookCreateTelegramLinkResponse as WebhookCreateTelegramLinkResponse,
    type WebhookDeactivateResponse as WebhookDeactivateResponse,
    type WebhookListDeliveriesResponse as WebhookListDeliveriesResponse,
    type WebhookResumeResponse as WebhookResumeResponse,
    type WebhookTestResponse as WebhookTestResponse,
    type WebhookCreateParams as WebhookCreateParams,
    type WebhookUpdateParams as WebhookUpdateParams,
    type WebhookListParams as WebhookListParams,
    type WebhookCreateTelegramLinkParams as WebhookCreateTelegramLinkParams,
    type WebhookListDeliveriesParams as WebhookListDeliveriesParams,
  };

  export {
    X as X,
    type TrendLocation as TrendLocation,
    type XAutocompleteSearchResponse as XAutocompleteSearchResponse,
    type XGetArticleResponse as XGetArticleResponse,
    type XGetHashflagsResponse as XGetHashflagsResponse,
    type XGetNewsStoryVersionsResponse as XGetNewsStoryVersionsResponse,
    type XGetNotificationsResponse as XGetNotificationsResponse,
    type XGetTrendLocationsResponse as XGetTrendLocationsResponse,
    type XGetTrendsResponse as XGetTrendsResponse,
    type XGetTrendsHistoryResponse as XGetTrendsHistoryResponse,
    type XSearchPlacesResponse as XSearchPlacesResponse,
    type XAutocompleteSearchParams as XAutocompleteSearchParams,
    type XGetArticleParams as XGetArticleParams,
    type XGetHashflagsParams as XGetHashflagsParams,
    type XGetHomeTimelineParams as XGetHomeTimelineParams,
    type XGetNewsStoryVersionsParams as XGetNewsStoryVersionsParams,
    type XGetNotificationsParams as XGetNotificationsParams,
    type XGetTrendLocationsParams as XGetTrendLocationsParams,
    type XGetTrendsParams as XGetTrendsParams,
    type XGetTrendsHistoryParams as XGetTrendsHistoryParams,
    type XSearchPlacesParams as XSearchPlacesParams,
  };

  export {
    Trends as Trends,
    type TrendListResponse as TrendListResponse,
    type TrendListParams as TrendListParams,
  };

  export { Support as Support };

  export {
    Credits as Credits,
    type CreditRetrieveBalanceResponse as CreditRetrieveBalanceResponse,
    type CreditRetrieveTopupStatusResponse as CreditRetrieveTopupStatusResponse,
    type CreditTopupBalanceResponse as CreditTopupBalanceResponse,
    type CreditRedirectTopupCheckoutParams as CreditRedirectTopupCheckoutParams,
    type CreditRetrieveTopupStatusParams as CreditRetrieveTopupStatusParams,
    type CreditTopupBalanceParams as CreditTopupBalanceParams,
  };

  export {
    GuestWallets as GuestWallets,
    type GuestWalletAmount as GuestWalletAmount,
    type GuestWalletCreateResponse as GuestWalletCreateResponse,
    type GuestWalletRetrieveStatusResponse as GuestWalletRetrieveStatusResponse,
    type GuestWalletTopupResponse as GuestWalletTopupResponse,
    type GuestWalletCreateParams as GuestWalletCreateParams,
    type GuestWalletTopupParams as GuestWalletTopupParams,
  };

  export type Broadcast = API.Broadcast;
  export type Community = API.Community;
  export type CommunityPage = API.CommunityPage;
  export type CommunityTopic = API.CommunityTopic;
  export type ContentDisclosure = API.ContentDisclosure;
  export type EmbeddedTweet = API.EmbeddedTweet;
  export type Error = API.Error;
  export type EventType = API.EventType;
  export type MonitorFollow = API.MonitorFollow;
  export type PaginatedLists = API.PaginatedLists;
  export type PaginatedTweets = API.PaginatedTweets;
  export type PaginatedUserIds = API.PaginatedUserIds;
  export type PaginatedUsers = API.PaginatedUsers;
  export type SearchTweet = API.SearchTweet;
  export type SoftIntervention = API.SoftIntervention;
  export type TweetMedia = API.TweetMedia;
  export type UserListPage = API.UserListPage;
  export type UserProfile = API.UserProfile;
  export type XList = API.XList;
  export type XListBanner = API.XListBanner;
}
