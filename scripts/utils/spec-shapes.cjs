// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const { CheckError } = require('./api-spec.cjs');
const { intersect, leaf, object, prop } = require('./shapes.cjs');

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

class SpecShapes {
  constructor(spec) {
    this.spec = spec;
  }

  resolve(ref) {
    const target = ref
      .replace(/^#\//, '')
      .split('/')
      .reduce((current, part) => current?.[part.replace(/~1/g, '/').replace(/~0/g, '~')], this.spec);
    if (target === undefined)
      throw new CheckError(`Could not resolve ${ref} in the API spec. Check the spec source.`);
    return target;
  }

  node(schema, stack = []) {
    if (typeof schema !== 'object' || schema === null) return [{ t: 'unknown' }, false];
    if ('$ref' in schema) return this.refNode(schema, stack);
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
    if (schema.allOf) {
      const parts = schema.allOf.map((sub) => this.node(sub, stack)[0]);
      const { allOf, ...rest } = schema;
      if (rest.properties && Object.keys(rest.properties).length) parts.push(this.node(rest, stack)[0]);
      return [intersect(parts), nullable];
    }
    for (const keyword of ['oneOf', 'anyOf']) {
      if (!schema[keyword]) continue;
      let variants = [];
      for (const sub of schema[keyword]) {
        if (
          sub?.type === 'null' ||
          (Array.isArray(sub?.enum) && sub.enum.length === 1 && sub.enum[0] === null)
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
      return [variants.length === 1 ? variants[0] : { t: 'union', variants }, nullable];
    }
    if ('const' in schema) return [leaf([schema.const]), nullable];
    if (Array.isArray(schema.enum)) {
      const values = schema.enum.filter((value) => value !== null);
      return [leaf(values), nullable || values.length < schema.enum.length];
    }
    const isObject = types?.includes('object') || 'properties' in schema;
    if (isObject && schema.properties && Object.keys(schema.properties).length) {
      const required = new Set(schema.required ?? []);
      const props = Object.fromEntries(
        Object.entries(schema.properties).map(([name, sub]) => {
          const [child, childNullable] = this.node(sub, stack);
          return [name, prop(child, required.has(name), childNullable)];
        }),
      );
      return [
        object(props, schema.additionalProperties != null && schema.additionalProperties !== false),
        nullable,
      ];
    }
    const values = schema.additionalProperties;
    const typedValues = values !== null && typeof values === 'object' && Object.keys(values).length > 0;
    if (isObject && typedValues && !schema.required?.length)
      return [{ t: 'map', items: this.node(values, stack)[0] }, nullable];
    if (isObject)
      return [schema.required?.length ? { t: 'free', requires: schema.required } : { t: 'free' }, nullable];
    if (types?.includes('array')) {
      if ('items' in schema && !('prefixItems' in schema))
        return [{ t: 'array', items: this.node(schema.items, stack)[0] }, nullable];
      return [leaf(), nullable];
    }
    return [leaf(), nullable];
  }

  refNode(schema, stack) {
    const ref = schema.$ref;
    if (stack.includes(ref)) return [{ t: 'cycle' }, false];
    const target = this.resolve(ref);
    const siblings = Object.fromEntries(
      Object.entries(schema).filter(([key]) => !ignoredRefSiblings.has(key)),
    );
    if (Object.keys(siblings).some((key) => key !== 'type')) {
      return this.node({ allOf: [target, siblings] }, [...stack, ref]);
    }
    const [node, nullable] = this.node(target, [...stack, ref]);
    return [node, nullable || (Array.isArray(siblings.type) && siblings.type.includes('null'))];
  }

  schemas(content, accept) {
    return Object.entries(content ?? {})
      .filter(([type, media]) => accept(type.split(';')[0].trim()) && media?.schema)
      .map(([, media]) => media.schema);
  }

  operation(pathItem, operation) {
    const params = new Map();
    for (const raw of [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])]) {
      const param = raw.$ref ? this.resolve(raw.$ref) : raw;
      params.set(`${param.in} ${param.name}`, param);
    }
    const query = {};
    const nonBodyParams = [];
    for (const param of params.values()) {
      if (param.in === 'query')
        query[param.name] = prop(this.node(param.schema ?? {})[0], Boolean(param.required));
      if (param.in === 'path' || param.in === 'header') nonBodyParams.push(param.name);
    }
    const requestBody =
      operation.requestBody?.$ref ? this.resolve(operation.requestBody.$ref) : operation.requestBody;
    const bodies = this.schemas(requestBody?.content, (type) => bodyTypes.has(type)).map(
      (s) => this.node(s)[0],
    );
    const responses = Object.entries(operation.responses ?? {})
      .filter(([code]) => String(code).startsWith('2'))
      .flatMap(([, raw]) => {
        const response = raw.$ref ? this.resolve(raw.$ref) : raw;
        return this.schemas(
          response.content,
          (type) => type === 'application/json' || type.endsWith('+json'),
        );
      })
      .map((s) => this.node(s)[0]);
    const one = (nodes) =>
      nodes.length === 0 ? null
      : nodes.length === 1 ? nodes[0]
      : { t: 'union', variants: nodes };
    return { query: object(query), nonBodyParams, body: one(bodies), response: one(responses) };
  }
}

module.exports = { SpecShapes };
