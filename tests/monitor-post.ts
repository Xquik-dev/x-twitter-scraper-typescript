// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type XTwitterScraper from 'x-twitter-scraper';

const isMonitorPost = (
  data: XTwitterScraper.EventDetail['data'],
): data is XTwitterScraper.EventDetail.MonitorPost =>
  'text' in data &&
  typeof data.text === 'string' &&
  'bookmarkCount' in data &&
  typeof data.bookmarkCount === 'number' &&
  'viewCount' in data &&
  typeof data.viewCount === 'number';

export const monitorPost = (
  data: XTwitterScraper.EventDetail['data'],
): XTwitterScraper.EventDetail.MonitorPost => {
  if (isMonitorPost(data)) return data;
  throw new Error('Expected the event to carry a post');
};

const isListedMonitorPost = (
  data: XTwitterScraper.Event['data'] | undefined,
): data is XTwitterScraper.Event.MonitorPost =>
  data !== undefined &&
  'text' in data &&
  typeof data.text === 'string' &&
  'bookmarkCount' in data &&
  typeof data.bookmarkCount === 'number' &&
  'viewCount' in data &&
  typeof data.viewCount === 'number';

export const listedMonitorPost = (
  data: XTwitterScraper.Event['data'] | undefined,
): XTwitterScraper.Event.MonitorPost => {
  if (isListedMonitorPost(data)) return data;
  throw new Error('Expected the event to carry a post');
};
