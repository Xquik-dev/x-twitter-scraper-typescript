// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type { FinalRequestOptions } from './request-options';
import { Stream } from '../core/streaming';
import type { XTwitterScraper } from '../client';
import { formatRequestDetails, loggerFor } from './utils/log';

export type APIResponseProps = {
  response: Response;
  options: FinalRequestOptions;
  controller: AbortController;
  requestLogID: string;
  retryOfRequestLogID: string | undefined;
  startTime: number;
};

export function defaultParseResponse<T>(client: XTwitterScraper, props: APIResponseProps): Promise<T>;
export async function defaultParseResponse(
  client: XTwitterScraper,
  props: APIResponseProps,
): Promise<unknown> {
  const { response, requestLogID, retryOfRequestLogID, startTime } = props;
  const body = await (async (): Promise<unknown> => {
    if (props.options.stream === true) {
      loggerFor(client).debug('response', response.status, response.url, response.headers, response.body);

      return Stream.fromSSEResponse(response, props.controller, client);
    }

    if (response.status === 204) {
      return null;
    }

    if (props.options.__binaryResponse === true) {
      return response;
    }

    const contentType = response.headers.get('content-type');
    const mediaType = contentType?.split(';')[0]?.trim();
    const isJSON =
      mediaType !== undefined && (mediaType.includes('application/json') || mediaType.endsWith('+json'));
    if (isJSON) {
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        return undefined;
      }

      return await response.json();
    }

    return await response.text();
  })();
  loggerFor(client).debug(
    `[${requestLogID}] response parsed`,
    formatRequestDetails({
      retryOfRequestLogID,
      url: response.url,
      status: response.status,
      body,
      durationMs: Date.now() - startTime,
    }),
  );
  return body;
}
