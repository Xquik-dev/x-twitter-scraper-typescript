// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import XTwitterScraper from 'x-twitter-scraper';

// Compile-only mirror of the README quickstart. It intentionally constructs
// the client and request params without sending a network request.
const client = new XTwitterScraper({
  apiKey: process.env['X_TWITTER_SCRAPER_API_KEY'],
});

const searchParams: XTwitterScraper.X.TweetSearchParams = { q: 'from:elonmusk', limit: 10 };

void client;
void searchParams;
