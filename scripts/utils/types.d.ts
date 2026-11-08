// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import type { SourceCode } from 'eslint';
import type * as ts from 'typescript';

export type JsonValue = null | boolean | number | string | JsonValue[] | JsonObject;
export type JsonObject = { [key: string]: JsonValue | undefined };

export type SpecDocument = JsonObject & { paths: JsonObject | JsonValue[] };

export type SpecEntry = {
  id: string;
  key: string;
  operationId: JsonValue | undefined;
  pathItem: JsonObject;
  operation: JsonObject;
};

export type Schema = {
  $ref?: JsonValue;
  nullable?: JsonValue;
  type?: JsonValue;
  allOf?: JsonValue;
  oneOf?: JsonValue;
  anyOf?: JsonValue;
  properties?: JsonValue;
  const?: JsonValue;
  enum?: JsonValue;
  required?: JsonValue;
  additionalProperties?: JsonValue;
  items?: JsonValue;
  prefixItems?: JsonValue;
};

export type GroupRules = {
  field: string;
  noun: string;
  entryPattern: RegExp;
  entryHint: string;
  key: (entry: string) => string;
};

export type Leaf = { t: 'leaf'; enum: string[] | null };
export type ObjectNode = { t: 'object'; props: Props; open?: true };
export type ContainerNode = { t: 'array'; items: Node } | { t: 'map'; items: Node };
export type UnionNode = { t: 'union'; variants: Node[] };
export type Node =
  | Leaf
  | ObjectNode
  | ContainerNode
  | UnionNode
  | { t: 'free'; requires?: string[] }
  | { t: 'ref'; name: string }
  | { t: 'cycle' }
  | { t: 'unknown' };
export type Prop = { req: boolean | null; null: boolean | null; node: Node };
export type Props = Record<string, Prop>;
export type Defs = Record<string, Node>;

export type SpecOperation = {
  query: ObjectNode;
  nonBodyParams: string[];
  body: Node | null;
  response: Node | null;
};
export type SdkShape = { query: Node; body: Node | null; response: Node | null };
export type SdkOperation = SdkShape & { key: string };
export type SdkShapes = { ops: Record<string, SdkShape>; defs: Defs };
export type RequestCall = ts.CallExpression & { expression: ts.PropertyAccessExpression };
export type Difference = { side: string; kind: string; path: string };

export type Field =
  | { type: ts.Type; omit: string[]; name?: never; symbol?: never }
  | { name: string; symbol: ts.Symbol | null | undefined; type?: never };

export type Comment = ReturnType<SourceCode['getAllComments']>[number];
export type AstNode = NonNullable<ReturnType<SourceCode['getNodeByRangeIndex']>>;

export type ExportConditions = {
  import?: string | undefined;
  require?: string | ExportConditions | undefined;
  types?: string;
  default?: string;
};
