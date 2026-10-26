// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { CheckError } from './api-spec.ts';
import { field, isList, isObject, list, record, type JsonObject } from './json.ts';
import { intersect, leaf, object, prop, type Prop, type Shape, type SpecOperation } from './shapes.ts';

type Node = [shape: Shape, nullable: boolean];

const bodyTypes = new Set(['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded']);
const ignoredRefSiblings = new Set([
  '$ref',
  'description',
  'example',
  'examples',
  'title',
  'deprecated',
  'readOnly',
  'writeOnly',
]);

const hasKeys = (value: unknown) => isObject(value) && Object.keys(value).length > 0;

export class SpecShapes {
  readonly spec: JsonObject;

  constructor(spec: JsonObject) {
    this.spec = spec;
  }

  resolve(ref: string): unknown {
    const target = ref
      .replace(/^#\//, '')
      .split('/')
      .reduce<unknown>(
        (current, part) => field(current, part.replace(/~1/g, '/').replace(/~0/g, '~')),
        this.spec,
      );
    if (target === undefined)
      throw new CheckError(`Could not resolve ${ref} in the API spec. Check the spec source.`);
    return target;
  }

  resolved(value: unknown): unknown {
    const ref = field(value, '$ref');
    return ref ? this.resolve(String(ref)) : value;
  }

  node(schema: unknown, stack: readonly string[] = []): Node {
    if (!isObject(schema)) return [{ t: 'unknown' }, false];
    if ('$ref' in schema) return this.refNode(schema, stack);
    let nullable = Boolean(schema['nullable']);
    const type = schema['type'];
    let types: unknown[] | undefined;
    if (isList(type)) {
      nullable = nullable || type.includes('null');
      types = type.filter((name) => name !== 'null');
    } else if (type === 'null') {
      return [{ t: 'unknown' }, true];
    } else if (type !== undefined) {
      types = [type];
    }
    const allOf = schema['allOf'];
    if (isList(allOf)) {
      const parts = allOf.map((sub) => this.node(sub, stack)[0]);
      const { allOf: dropped, ...rest } = schema;
      if (hasKeys(rest['properties'])) parts.push(this.node(rest, stack)[0]);
      return [intersect(parts), nullable];
    }
    for (const keyword of ['oneOf', 'anyOf'] as const) {
      const subs = schema[keyword];
      if (!isList(subs)) continue;
      let variants: Shape[] = [];
      for (const sub of subs) {
        const subEnum = field(sub, 'enum');
        if (
          field(sub, 'type') === 'null' ||
          (isList(subEnum) && subEnum.length === 1 && subEnum[0] === null)
        ) {
          nullable = true;
          continue;
        }
        const [variant, variantNullable] = this.node(sub, stack);
        nullable = nullable || variantNullable;
        variants.push(variant);
      }
      if (hasKeys(schema['properties'])) {
        const { [keyword]: dropped, ...rest } = schema;
        const [base] = this.node(rest, stack);
        variants = variants.map((variant) => intersect([base, variant]));
      }
      const [only, ...others] = variants;
      return [only && !others.length ? only : { t: 'union', variants }, nullable];
    }
    if ('const' in schema) return [leaf([schema['const']]), nullable];
    const values = schema['enum'];
    if (isList(values)) {
      const present = values.filter((value) => value !== null);
      return [leaf(present), nullable || present.length < values.length];
    }
    const isObjectType = types?.includes('object') || 'properties' in schema;
    const properties = record(schema['properties']);
    const required = schema['required'];
    if (isObjectType && Object.keys(properties).length) {
      const requiredNames = new Set(list(required));
      const props = Object.fromEntries(
        Object.entries(properties).map(([name, sub]): [string, Prop] => {
          const [child, childNullable] = this.node(sub, stack);
          return [name, prop(child, requiredNames.has(name), childNullable)];
        }),
      );
      const additional = schema['additionalProperties'];
      return [object(props, additional != null && additional !== false), nullable];
    }
    const additional = schema['additionalProperties'];
    const requires = list(required);
    if (isObjectType && hasKeys(additional) && !requires.length)
      return [{ t: 'map', items: this.node(additional, stack)[0] }, nullable];
    if (isObjectType)
      return [requires.length ? { t: 'free', requires: requires.map(String) } : { t: 'free' }, nullable];
    if (types?.includes('array')) {
      if ('items' in schema && !('prefixItems' in schema))
        return [{ t: 'array', items: this.node(schema['items'], stack)[0] }, nullable];
      return [leaf(), nullable];
    }
    return [leaf(), nullable];
  }

  refNode(schema: JsonObject, stack: readonly string[]): Node {
    const ref = String(schema['$ref']);
    if (stack.includes(ref)) return [{ t: 'cycle' }, false];
    const target = this.resolve(ref);
    const siblings = Object.fromEntries(
      Object.entries(schema).filter(([key]) => !ignoredRefSiblings.has(key)),
    );
    if (Object.keys(siblings).some((key) => key !== 'type')) {
      return this.node({ allOf: [target, siblings] }, [...stack, ref]);
    }
    const [node, nullable] = this.node(target, [...stack, ref]);
    const siblingType = siblings['type'];
    return [node, nullable || (isList(siblingType) && siblingType.includes('null'))];
  }

  schemas(content: unknown, accept: (type: string) => boolean): unknown[] {
    return Object.entries(record(content)).flatMap(([type, media]) => {
      const schema = field(media, 'schema');
      return accept((type.split(';')[0] ?? type).trim()) && schema ? [schema] : [];
    });
  }

  operation(pathItem: JsonObject, operation: JsonObject): SpecOperation {
    const params = new Map<string, unknown>();
    for (const raw of [...list(pathItem['parameters']), ...list(operation['parameters'])]) {
      const param = this.resolved(raw);
      params.set(`${field(param, 'in')} ${field(param, 'name')}`, param);
    }
    const query: { [name: string]: Prop } = {};
    const nonBodyParams: string[] = [];
    for (const param of params.values()) {
      const where = field(param, 'in');
      const name = String(field(param, 'name'));
      if (where === 'query')
        query[name] = prop(this.node(field(param, 'schema') ?? {})[0], Boolean(field(param, 'required')));
      if (where === 'path' || where === 'header') nonBodyParams.push(name);
    }
    const requestBody = this.resolved(operation['requestBody']);
    const bodies = this.schemas(field(requestBody, 'content'), (type) => bodyTypes.has(type)).map(
      (s) => this.node(s)[0],
    );
    const responses = Object.entries(record(operation['responses']))
      .filter(([code]) => code.startsWith('2'))
      .flatMap(([, raw]) =>
        this.schemas(
          field(this.resolved(raw), 'content'),
          (type) => type === 'application/json' || type.endsWith('+json'),
        ),
      )
      .map((s) => this.node(s)[0]);
    const one = (nodes: Shape[]): Shape | null => {
      const [only, ...others] = nodes;
      if (!only) return null;
      return others.length ? { t: 'union', variants: nodes } : only;
    };
    return { query: object(query), nonBodyParams, body: one(bodies), response: one(responses) };
  }
}
