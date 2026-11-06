// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { XTwitterScraperError } from '../../core/error';
import { encodeUTF8 } from './bytes';
import { readGlobal, readProperty } from './globals';
import { isPresent } from './values';

type NodeBuffer = {
  from(data: string | Uint8Array, encoding?: 'base64'): Uint8Array & { toString(encoding: 'base64'): string };
};

const isNodeBuffer = (value: unknown): value is NodeBuffer =>
  typeof value === 'function' && typeof readProperty(value, 'from') === 'function';

export const toBase64 = (data: string | Uint8Array | null | undefined): string => {
  if (!isPresent(data) || data === '') return '';

  const buffer = readGlobal('Buffer');
  if (isNodeBuffer(buffer)) {
    return buffer.from(data).toString('base64');
  }

  const bytes = typeof data === 'string' ? encodeUTF8(data) : data;

  if (typeof btoa !== 'undefined') {
    return btoa(String.fromCharCode(...bytes));
  }

  throw new XTwitterScraperError('Cannot generate base64 string; Expected `Buffer` or `btoa` to be defined');
};

export const fromBase64 = (str: string): Uint8Array => {
  const buffer = readGlobal('Buffer');
  if (isNodeBuffer(buffer)) {
    const buf = buffer.from(str, 'base64');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }

  if (typeof atob !== 'undefined') {
    const bstr = atob(str);
    const buf = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      buf[i] = bstr.charCodeAt(i);
    }
    return buf;
  }

  throw new XTwitterScraperError('Cannot decode base64 string; Expected `Buffer` or `atob` to be defined');
};
