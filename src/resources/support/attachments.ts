// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { APIResource } from '../../core/resource';
import type { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import type { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';
import { isPresent } from '../../internal/utils/values';

/**
 * Support ticket management
 */
export class Attachments extends APIResource {
  /**
   * Streams an authenticated user's support image or video. Video requests support
   * one standard byte range for seeking and resumable playback.
   *
   * @example
   * ```ts
   * const response = await client.support.attachments.download(
   *   'att_a1b2c3d4e5f6a1b2c3d4e5f6',
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  download(
    id: string,
    params: AttachmentDownloadParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Response> {
    const { Range } = params ?? {};
    return this._client.get(path`/support/attachments/${id}`, {
      ...options,
      headers: buildHeaders([
        { Accept: 'application/octet-stream', ...(isPresent(Range) ? { Range: Range } : undefined) },
        options?.headers,
      ]),
      __binaryResponse: true,
    });
  }
}

export interface AttachmentDownloadParams {
  /**
   * Optional single byte range
   */
  Range?: string;
}

export declare namespace Attachments {
  export { type AttachmentDownloadParams as AttachmentDownloadParams };
}
