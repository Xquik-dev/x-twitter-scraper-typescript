// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { XTwitterScraper } from '../client';

export abstract class APIResource {
  protected _client: XTwitterScraper;

  constructor(client: XTwitterScraper) {
    this._client = client;
  }
}
