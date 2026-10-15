// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const opaque = new Set(['free', 'cycle', 'unknown']);

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
  for (const name of parts.flatMap((p) => p.requires ?? [])) {
    if (props[name]) props[name] = { ...props[name], req: true };
  }
  return object(
    props,
    objects.some((o) => o.open),
  );
};

const topLevel = (node, kind, side) =>
  node?.t === 'object' ? Object.keys(node.props).map((name) => ({ side, kind, path: name })) : [];

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
  if (spec.t === 'leaf' && sdk.t === 'leaf') {
    if (spec.enum && sdk.enum && spec.enum.join('\n') !== sdk.enum.join('\n'))
      out.push({ side, kind: 'enum', path });
    return;
  }
  out.push(...(path ? [{ side, kind: 'missing', path }] : topLevel(spec, 'missing', side)));
};

const normalized = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const withoutParams = (node, specOp, specNames) => {
  if (node?.t !== 'object') return node;
  const names = new Set(specOp.nonBodyParams.map(normalized));
  return object(
    Object.fromEntries(
      Object.entries(node.props).filter(([name]) => !(names.has(normalized(name)) && !specNames.has(name))),
    ),
    node.open,
  );
};

const compareOperation = (specOp, sdkOp, defs) => {
  const specQuery = canon(specOp.query);
  const specBody = specOp.body && canon(specOp.body);
  const specNames = new Set([
    ...Object.keys(specQuery.props),
    ...(specBody?.t === 'object' ? Object.keys(specBody.props) : []),
  ]);
  const sdkQuery = withoutParams(canon(sdkOp.query, defs), specOp, specNames);
  let sdkBody = sdkOp.body && withoutParams(canon(sdkOp.body, defs), specOp, specNames);
  if (sdkBody?.t === 'object' && !Object.keys(sdkBody.props).length && !specBody) sdkBody = null;
  const specResponse = specOp.response && canon(specOp.response);
  const out = [];
  compareTree(specQuery, sdkQuery, '', 'request', out);
  if (specBody && sdkBody) compareTree(specBody, sdkBody, '', 'request', out);
  else if (specBody) out.push(...topLevel(specBody, 'missing', 'request'));
  else if (sdkBody) out.push(...topLevel(sdkBody, 'extra', 'request'));
  if (specResponse && sdkOp.response)
    compareTree(specResponse, canon(sdkOp.response, defs), '', 'response', out);
  else if (specResponse) out.push(...topLevel(specResponse, 'missing', 'response'));
  return out;
};

module.exports = { compareOperation, intersect, leaf, object, prop };
