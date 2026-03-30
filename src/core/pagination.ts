// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { XTwitterScraperError } from './error';
import { FinalRequestOptions } from '../internal/request-options';
import { defaultParseResponse } from '../internal/parse';
import { type XTwitterScraper } from '../client';
import { APIPromise } from './api-promise';
import { type APIResponseProps } from '../internal/parse';
import { maybeObj } from '../internal/utils/values';

export type PageRequestOptions = Pick<FinalRequestOptions, 'query' | 'headers' | 'body' | 'path' | 'method'>;

export abstract class AbstractPage<Item> implements AsyncIterable<Item> {
  #client: XTwitterScraper;
  protected options: FinalRequestOptions;

  protected response: Response;
  protected body: unknown;

  constructor(client: XTwitterScraper, response: Response, body: unknown, options: FinalRequestOptions) {
    this.#client = client;
    this.options = options;
    this.response = response;
    this.body = body;
  }

  abstract nextPageRequestOptions(): PageRequestOptions | null;

  abstract getPaginatedItems(): Item[];

  hasNextPage(): boolean {
    const items = this.getPaginatedItems();
    if (!items.length) return false;
    return this.nextPageRequestOptions() != null;
  }

  async getNextPage(): Promise<this> {
    const nextOptions = this.nextPageRequestOptions();
    if (!nextOptions) {
      throw new XTwitterScraperError(
        'No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.',
      );
    }

    return await this.#client.requestAPIList(this.constructor as any, nextOptions);
  }

  async *iterPages(): AsyncGenerator<this> {
    let page: this = this;
    yield page;
    while (page.hasNextPage()) {
      page = await page.getNextPage();
      yield page;
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Item> {
    for await (const page of this.iterPages()) {
      for (const item of page.getPaginatedItems()) {
        yield item;
      }
    }
  }
}

/**
 * This subclass of Promise will resolve to an instantiated Page once the request completes.
 *
 * It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
 *
 *    for await (const item of client.items.list()) {
 *      console.log(item)
 *    }
 */
export class PagePromise<
    PageClass extends AbstractPage<Item>,
    Item = ReturnType<PageClass['getPaginatedItems']>[number],
  >
  extends APIPromise<PageClass>
  implements AsyncIterable<Item>
{
  constructor(
    client: XTwitterScraper,
    request: Promise<APIResponseProps>,
    Page: new (...args: ConstructorParameters<typeof AbstractPage>) => PageClass,
  ) {
    super(
      client,
      request,
      async (client, props) =>
        new Page(client, props.response, await defaultParseResponse(client, props), props.options),
    );
  }

  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<Item> {
    const page = await this;
    for await (const item of page) {
      yield item;
    }
  }
}

export interface CursorPageResponse<Item> {
  tweets: Array<unknown>;

  users: Array<unknown>;

  next_cursor: string;

  has_next_page: boolean;
}

export interface CursorPageParams {
  cursor?: string;

  limit?: number;
}

export class CursorPage<Item> extends AbstractPage<Item> implements CursorPageResponse<Item> {
  tweets: Array<unknown>;

  users: Array<unknown>;

  next_cursor: string;

  has_next_page: boolean;

  constructor(
    client: XTwitterScraper,
    response: Response,
    body: CursorPageResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.tweets = body.tweets || [];
    this.users = body.users || [];
    this.next_cursor = body.next_cursor || '';
    this.has_next_page = body.has_next_page || false;
  }

  getPaginatedItems(): Item[] {
    return this.data;
  }

  nextPageRequestOptions(): PageRequestOptions | null {
    const cursor = this.next_cursor;
    if (!cursor) {
      return null;
    }

    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        cursor,
      },
    };
  }
}

export interface CursorPageLegacyResponse<Item> {
  items: Array<Item>;

  nextCursor: string;

  hasMore: boolean;
}

export interface CursorPageLegacyParams {
  afterCursor?: string;

  limit?: number;
}

export class CursorPageLegacy<Item> extends AbstractPage<Item> implements CursorPageLegacyResponse<Item> {
  items: Array<Item>;

  nextCursor: string;

  hasMore: boolean;

  constructor(
    client: XTwitterScraper,
    response: Response,
    body: CursorPageLegacyResponse<Item>,
    options: FinalRequestOptions,
  ) {
    super(client, response, body, options);

    this.items = body.items || [];
    this.nextCursor = body.nextCursor || '';
    this.hasMore = body.hasMore || false;
  }

  getPaginatedItems(): Item[] {
    return this.items ?? [];
  }

  override hasNextPage(): boolean {
    if (this.hasMore === false) {
      return false;
    }

    return super.hasNextPage();
  }

  nextPageRequestOptions(): PageRequestOptions | null {
    const cursor = this.nextCursor;
    if (!cursor) {
      return null;
    }

    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        afterCursor: cursor,
      },
    };
  }
}
