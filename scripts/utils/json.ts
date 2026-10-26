// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

export type JsonObject = { [key: string]: unknown };

export const isObject = (value: unknown): value is JsonObject => typeof value === 'object' && value !== null;

export const isList = (value: unknown): value is unknown[] => Array.isArray(value);

export const parseJson = (text: string): unknown => JSON.parse(text);

export const field = (value: unknown, key: string): unknown => (isObject(value) ? value[key] : undefined);

export const record = (value: unknown): JsonObject => (isObject(value) ? value : {});

export const list = (value: unknown): unknown[] => (isList(value) ? value : []);
