// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type { XTwitterScraper } from '../client';

export abstract class APIResource {
  protected _client: XTwitterScraper;

  constructor(client: XTwitterScraper) {
    this._client = client;
  }
}
