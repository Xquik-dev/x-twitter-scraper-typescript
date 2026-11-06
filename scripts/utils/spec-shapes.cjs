// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const CheckError = require('./api-spec.cjs').CheckError;
const asObject = require('./json.cjs').asObject;
const shapes = require('./shapes.cjs');

const { intersect, leaf, object, prop } = shapes;

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

/** @type {Array<'oneOf' | 'anyOf'>} */
const variantKeywords = ['oneOf', 'anyOf'];

/** @type {(value: import('./types').JsonValue | undefined) => import('./types').JsonValue[]} */
const asArray = (value) => (Array.isArray(value) ? value : []);

/** @type {(value: import('./types').JsonValue | undefined, key: string) => import('./types').JsonValue | undefined} */
const member = (value, key) => {
  if (Array.isArray(value)) return value[Number(key)];
  return asObject(value)?.[key];
};

class SpecShapes {
  constructor(/** @type {import('./types').SpecDocument} */ spec) {
    this.spec = spec;
  }

  /** @type {(ref: string) => import('./types').JsonValue} */
  resolve(ref) {
    /** @type {import('./types').JsonValue | undefined} */
    let target = this.spec;
    for (const part of ref.replace(/^#\//, '').split('/')) {
      target = member(target, part.replace(/~1/g, '/').replace(/~0/g, '~'));
    }
    if (target === undefined)
      throw new CheckError(`Could not resolve ${ref} in the API spec. Check the spec source.`);
    return target;
  }

  /** @type {(value: import('./types').JsonValue | undefined) => import('./types').JsonObject | undefined} */
  deref(value) {
    const ref = asObject(value)?.['$ref'];
    return asObject(typeof ref === 'string' && ref ? this.resolve(ref) : value);
  }

  /** @type {(value: import('./types').JsonValue | undefined, stack?: string[]) => [import('./types').Node, boolean]} */
  node(value, stack = []) {
    if (typeof value !== 'object' || value === null) return [{ t: 'unknown' }, false];
    if (Array.isArray(value)) return [leaf(), false];
    /** @type {import('./types').Schema} */
    const schema = value;
    if (typeof schema.$ref === 'string') return this.refNode(schema.$ref, schema, stack);
    let nullable = Boolean(schema.nullable);
    let types = schema.type;
    if (Array.isArray(types)) {
      nullable = nullable || types.includes('null');
      types = types.filter((type) => type !== 'null');
    } else if (types === 'null') {
      return [{ t: 'unknown' }, true];
    } else if (types !== undefined) {
      types = [types];
    }
    if (Array.isArray(schema.allOf)) {
      const parts = schema.allOf.map((sub) => this.node(sub, stack)[0]);
      const { allOf, ...rest } = schema;
      if (rest.properties && Object.keys(rest.properties).length) parts.push(this.node(rest, stack)[0]);
      return [intersect(parts), nullable];
    }
    for (const keyword of variantKeywords) {
      const subs = schema[keyword];
      if (!Array.isArray(subs)) continue;
      /** @type {import('./types').Node[]} */
      let variants = [];
      for (const sub of subs) {
        const subSchema = asObject(sub);
        if (
          subSchema?.['type'] === 'null' ||
          (Array.isArray(subSchema?.['enum']) &&
            subSchema['enum'].length === 1 &&
            subSchema['enum'][0] === null)
        ) {
          nullable = true;
          continue;
        }
        const [variant, variantNullable] = this.node(sub, stack);
        nullable = nullable || variantNullable;
        variants.push(variant);
      }
      if (schema.properties && Object.keys(schema.properties).length) {
        const { [keyword]: dropped, ...rest } = schema;
        const [base] = this.node(rest, stack);
        variants = variants.map((variant) => intersect([base, variant]));
      }
      const [only] = variants;
      return [only && variants.length === 1 ? only : { t: 'union', variants }, nullable];
    }
    if ('const' in schema) return [leaf([schema.const]), nullable];
    if (Array.isArray(schema.enum)) {
      const values = schema.enum.filter((value) => value !== null);
      return [leaf(values), nullable || values.length < schema.enum.length];
    }
    const isObject = types?.includes('object') || 'properties' in schema;
    const required = asArray(schema.required).filter((name) => typeof name === 'string');
    const properties = asObject(schema.properties);
    if (isObject && properties && Object.keys(properties).length) {
      const requiredNames = new Set(required);
      const props = Object.fromEntries(
        Object.entries(properties).map(([name, sub]) => {
          const [child, childNullable] = this.node(sub, stack);
          return [name, prop(child, requiredNames.has(name), childNullable)];
        }),
      );
      return [
        object(props, schema.additionalProperties != null && schema.additionalProperties !== false),
        nullable,
      ];
    }
    const values = schema.additionalProperties;
    const typedValues = values !== null && typeof values === 'object' && Object.keys(values).length > 0;
    if (isObject && typedValues && !required.length)
      return [{ t: 'map', items: this.node(values, stack)[0] }, nullable];
    if (isObject) return [required.length ? { t: 'free', requires: required } : { t: 'free' }, nullable];
    if (types?.includes('array')) {
      if ('items' in schema && !('prefixItems' in schema))
        return [{ t: 'array', items: this.node(schema.items, stack)[0] }, nullable];
      return [leaf(), nullable];
    }
    return [leaf(), nullable];
  }

  /** @type {(ref: string, schema: import('./types').Schema, stack: string[]) => [import('./types').Node, boolean]} */
  refNode(ref, schema, stack) {
    if (stack.includes(ref)) return [{ t: 'cycle' }, false];
    const target = this.resolve(ref);
    const siblings = Object.fromEntries(
      Object.entries(schema).filter(([key]) => !ignoredRefSiblings.has(key)),
    );
    if (Object.keys(siblings).some((key) => key !== 'type')) {
      return this.node({ allOf: [target, siblings] }, [...stack, ref]);
    }
    const [node, nullable] = this.node(target, [...stack, ref]);
    return [node, nullable || (Array.isArray(siblings['type']) && siblings['type'].includes('null'))];
  }

  /** @type {(content: import('./types').JsonValue | undefined, accept: (type: string) => boolean) => import('./types').JsonValue[]} */
  schemas(content, accept) {
    return Object.entries(asObject(content) ?? {}).flatMap(([type, media]) => {
      const schema = asObject(media)?.['schema'];
      return accept((type.split(';')[0] ?? '').trim()) && schema ? [schema] : [];
    });
  }

  /** @type {(pathItem: import('./types').JsonObject, operation: import('./types').JsonObject) => import('./types').SpecOperation} */
  operation(pathItem, operation) {
    /** @type {Map<string, import('./types').JsonObject>} */
    const params = new Map();
    for (const raw of [...asArray(pathItem['parameters']), ...asArray(operation['parameters'])]) {
      const param = this.deref(raw);
      if (param) params.set(`${param['in']} ${param['name']}`, param);
    }
    /** @type {import('./types').Props} */
    const query = {};
    /** @type {string[]} */
    const nonBodyParams = [];
    for (const param of params.values()) {
      const name = param['name'];
      if (typeof name !== 'string') continue;
      if (param['in'] === 'query')
        query[name] = prop(this.node(param['schema'] ?? {})[0], Boolean(param['required']));
      if (param['in'] === 'path' || param['in'] === 'header') nonBodyParams.push(name);
    }
    const requestBody = this.deref(operation['requestBody']);
    const bodies = this.schemas(requestBody?.['content'], (type) => bodyTypes.has(type)).map(
      (s) => this.node(s)[0],
    );
    const responses = Object.entries(asObject(operation['responses']) ?? {})
      .filter(([code]) => String(code).startsWith('2'))
      .flatMap(([, raw]) =>
        this.schemas(
          this.deref(raw)?.['content'],
          (type) => type === 'application/json' || type.endsWith('+json'),
        ),
      )
      .map((s) => this.node(s)[0]);
    /** @type {(nodes: import('./types').Node[]) => import('./types').Node | null} */
    const one = (nodes) => {
      const [first] = nodes;
      return (
        !first ? null
        : nodes.length === 1 ? first
        : { t: 'union', variants: nodes }
      );
    };
    return { query: object(query), nonBodyParams, body: one(bodies), response: one(responses) };
  }
}

module.exports = { SpecShapes };
