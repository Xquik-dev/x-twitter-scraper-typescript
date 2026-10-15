// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const opaque = new Set(['free', 'cycle', 'unknown']);
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

const leaf = (values) => ({
  t: 'leaf',
  enum: values == null ? null : [...new Set(values.map(String))].sort(),
});

const object = (props, open = false) => (open ? { t: 'object', props, open: true } : { t: 'object', props });

const prop = (node, req = null, nullable = null) => ({ req, null: nullable, node });

const canon = (node, defs = {}, stack = []) => {
  switch (node.t) {
    case 'ref':
      return stack.includes(node.name) ? { t: 'cycle' } : canon(defs[node.name], defs, [...stack, node.name]);
    case 'object':
      return object(
        Object.fromEntries(
          Object.entries(node.props).map(([name, p]) => [name, { ...p, node: canon(p.node, defs, stack) }]),
        ),
        node.open,
      );
    case 'array':
      return { t: 'array', items: canon(node.items, defs, stack) };
    case 'union':
      return mergeUnion(node.variants.map((variant) => canon(variant, defs, stack)));
    default:
      return node;
  }
};

const mergeProps = (objects) => {
  const names = [...new Set(objects.flatMap((o) => Object.keys(o.props)))];
  return Object.fromEntries(
    names.map((name) => {
      const have = objects.filter((o) => name in o.props).map((o) => o.props[name]);
      const reqs = have.map((p) => p.req);
      const nulls = have.map((p) => p.null);
      let req;
      if (have.length < objects.length) req = reqs.every((r) => r !== null) ? false : null;
      else req = reqs.some((r) => r === null) ? null : reqs.every(Boolean);
      const nullable = nulls.some((n) => n === null) ? null : nulls.some(Boolean);
      return [name, prop(mergeUnion(have.map((p) => p.node)), req, nullable)];
    }),
  );
};

const mergeUnion = (all) => {
  const known = all.filter((v) => v.t !== 'cycle' && v.t !== 'unknown');
  const variants = known.length ? known : all;
  if (!variants.length) return { t: 'unknown' };
  if (variants.length === 1) return variants[0];
  if (variants.some((v) => v.t === 'free')) return { t: 'free' };
  const objects = variants.filter((v) => v.t === 'object');
  if (objects.length)
    return object(
      mergeProps(objects),
      objects.some((o) => o.open),
    );
  const arrays = variants.filter((v) => v.t === 'array');
  if (arrays.length) return { t: 'array', items: mergeUnion(arrays.map((a) => a.items)) };
  const leaves = variants.filter((v) => v.t === 'leaf');
  if (leaves.length) {
    return leaves.every((l) => l.enum !== null) ? leaf(leaves.flatMap((l) => l.enum)) : leaf();
  }
  return { t: 'unknown' };
};

const intersect = (all) => {
  const parts = all.filter((p) => p.t !== 'unknown');
  if (!parts.length) return { t: 'unknown' };
  const unions = parts.filter((p) => p.t === 'union');
  if (unions.length === 1) {
    const rest = parts.filter((p) => p.t !== 'union');
    return { t: 'union', variants: unions[0].variants.map((v) => intersect([...rest, v])) };
  }
  if (parts.length > 1 && parts.every((p) => p.t === 'array')) {
    return { t: 'array', items: intersect(parts.map((p) => p.items)) };
  }
  const objects = parts.filter((p) => p.t === 'object');
  if (!objects.length) return parts[0];
  const props = {};
  for (const o of objects) {
    for (const [name, p] of Object.entries(o.props)) {
      const old = props[name];
      props[name] =
        old ?
          prop(intersect([old.node, p.node]), Boolean(old.req || p.req), Boolean(old.null && p.null))
        : { ...p };
    }
  }
  return object(
    props,
    objects.some((o) => o.open),
  );
};

class SpecShapes {
  constructor(spec) {
    this.spec = spec;
  }

  resolve(ref) {
    return ref
      .replace(/^#\//, '')
      .split('/')
      .reduce((current, part) => current?.[part.replace(/~1/g, '/').replace(/~0/g, '~')], this.spec);
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
    if (isObject) return [{ t: 'free' }, nullable];
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
    const pathParams = [];
    for (const param of params.values()) {
      if (param.in === 'query')
        query[param.name] = prop(this.node(param.schema ?? {})[0], Boolean(param.required));
      if (param.in === 'path' || param.in === 'header') pathParams.push(param.name);
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
    return { query: object(query), pathParams, body: one(bodies), response: one(responses) };
  }
}

const compareTree = (spec, sdk, path, side, out) => {
  if (opaque.has(spec.t) || opaque.has(sdk.t)) return;
  if (spec.t === 'object' && sdk.t === 'object') {
    for (const [name, specProp] of Object.entries(spec.props)) {
      const here = path ? `${path}.${name}` : name;
      const sdkProp = sdk.props[name];
      if (!sdkProp) {
        out.push({ side, kind: 'missing', path: here });
        continue;
      }
      for (const flag of ['req', 'null']) {
        if (specProp[flag] !== null && sdkProp[flag] !== null && specProp[flag] !== sdkProp[flag]) {
          out.push({ side, kind: flag === 'req' ? 'required' : 'nullable', path: here });
        }
      }
      compareTree(specProp.node, sdkProp.node, here, side, out);
    }
    if (!spec.open) {
      for (const name of Object.keys(sdk.props)) {
        if (!(name in spec.props)) out.push({ side, kind: 'extra', path: path ? `${path}.${name}` : name });
      }
    }
    return;
  }
  if (spec.t === 'array' && sdk.t === 'array') {
    compareTree(spec.items, sdk.items, `${path}[]`, side, out);
    return;
  }
  if (spec.t === 'leaf' && sdk.t === 'leaf' && spec.enum && sdk.enum) {
    if (spec.enum.join('\n') !== sdk.enum.join('\n')) out.push({ side, kind: 'enum', path });
  }
};

const normalized = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const withoutPathParams = (node, specOp, specNames) => {
  if (node?.t !== 'object') return node;
  const pathNames = new Set(specOp.pathParams.map(normalized));
  return object(
    Object.fromEntries(
      Object.entries(node.props).filter(
        ([name]) => !(pathNames.has(normalized(name)) && !specNames.has(name)),
      ),
    ),
    node.open,
  );
};

const topLevel = (node, kind, side) =>
  node?.t === 'object' ? Object.keys(node.props).map((name) => ({ side, kind, path: name })) : [];

const compareOperation = (specOp, sdkOp, defs) => {
  const specQuery = canon(specOp.query);
  const specBody = specOp.body && canon(specOp.body);
  const specNames = new Set([
    ...Object.keys(specQuery.props),
    ...(specBody?.t === 'object' ? Object.keys(specBody.props) : []),
  ]);
  const sdkQuery = withoutPathParams(canon(sdkOp.query, defs), specOp, specNames);
  let sdkBody = sdkOp.body && withoutPathParams(canon(sdkOp.body, defs), specOp, specNames);
  if (sdkBody?.t === 'object' && !Object.keys(sdkBody.props).length && !specBody) sdkBody = null;
  const out = [];
  compareTree(specQuery, sdkQuery, '', 'request', out);
  if (specBody && sdkBody) compareTree(specBody, sdkBody, '', 'request', out);
  else if (specBody) out.push(...topLevel(specBody, 'missing', 'request'));
  else if (sdkBody) out.push(...topLevel(sdkBody, 'extra', 'request'));
  if (specOp.response && sdkOp.response) {
    compareTree(canon(specOp.response), canon(sdkOp.response, defs), '', 'response', out);
  }
  return out;
};

module.exports = { SpecShapes, compareOperation, leaf, object };
