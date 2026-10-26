// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type { Logger } from 'x-twitter-scraper/internal/utils/log';

type LoggerCalls = Record<keyof Logger, unknown[][]>;

export function recordingLogger(): { logger: Logger; calls: LoggerCalls } {
  const calls: LoggerCalls = { debug: [], info: [], warn: [], error: [] };
  const logger: Logger = {
    debug: (...args) => {
      calls.debug.push(args);
    },
    info: (...args) => {
      calls.info.push(args);
    },
    warn: (...args) => {
      calls.warn.push(args);
    },
    error: (...args) => {
      calls.error.push(args);
    },
  };
  return { logger, calls };
}
