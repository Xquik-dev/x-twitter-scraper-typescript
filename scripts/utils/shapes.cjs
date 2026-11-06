// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const opaque = new Set(['free', 'cycle', 'unknown']);

/** @type {(values?: unknown[] | null) => import('./types').Leaf} */
const leaf = (values) => ({
  t: 'leaf',
  enum: values === null || values === undefined ? null : [...new Set(values.map(String))].sort(),
});

/** @type {(props: import('./types').Props, open?: boolean) => import('./types').ObjectNode} */
const object = (props, open = false) => (open ? { t: 'object', props, open: true } : { t: 'object', props });

/** @type {(node: import('./types').Node, req?: boolean | null, nullable?: boolean | null) => import('./types').Prop} */
const prop = (node, req = null, nullable = null) => ({ req, null: nullable, node });

/** @type {Record<import('./types').ContainerNode['t'], string>} */
const containerSuffix = { array: '[]', map: '{}' };

/** @type {import('./types').ContainerNode['t'][]} */
const containerKinds = ['array', 'map'];

/** @type {Array<'req' | 'null'>} */
const flags = ['req', 'null'];

const isContainer = (/** @type {import('./types').Node} */ node) => node.t === 'array' || node.t === 'map';

/** @type {(node: import('./types').Node, defs?: import('./types').Defs, stack?: string[]) => import('./types').Node} */
const canon = (node, defs = {}, stack = []) => {
  switch (node.t) {
    case 'ref': {
      if (stack.includes(node.name)) return { t: 'cycle' };
      const target = defs[node.name];
      if (target === undefined) throw new Error(`${node.name} has no definition`);
      return canon(target, defs, [...stack, node.name]);
    }
    case 'object':
      return object(
        Object.fromEntries(
          Object.entries(node.props).map(([name, p]) => [name, { ...p, node: canon(p.node, defs, stack) }]),
        ),
        node.open,
      );
    case 'array':
    case 'map':
      return { t: node.t, items: canon(node.items, defs, stack) };
    case 'union':
      return mergeUnion(node.variants.map((variant) => canon(variant, defs, stack)));
    case 'leaf':
    case 'free':
    case 'cycle':
    case 'unknown':
      return node;
  }
};

/** @type {(objects: import('./types').ObjectNode[]) => import('./types').Props} */
const mergeProps = (objects) => {
  const names = [...new Set(objects.flatMap((o) => Object.keys(o.props)))];
  return Object.fromEntries(
    names.map((name) => {
      const have = objects.flatMap((o) => {
        const p = o.props[name];
        return p !== undefined ? [p] : [];
      });
      const reqs = have.map((p) => p.req);
      const nulls = have.map((p) => p.null);
      /** @type {boolean | null} */
      let req;
      if (have.length < objects.length) req = reqs.every((r) => r !== null) ? false : null;
      else req = reqs.some((r) => r === null) ? null : reqs.every(Boolean);
      const nullable = nulls.some((n) => n === null) ? null : nulls.some(Boolean);
      return [name, prop(mergeUnion(have.map((p) => p.node)), req, nullable)];
    }),
  );
};

/** @type {(all: import('./types').Node[]) => import('./types').Node} */
const mergeUnion = (all) => {
  const known = all.filter((v) => v.t !== 'cycle' && v.t !== 'unknown');
  const variants = known.length > 0 ? known : all;
  const [first] = variants;
  if (first === undefined) return { t: 'unknown' };
  if (variants.length === 1) return first;
  if (variants.some((v) => v.t === 'free')) return { t: 'free' };
  const objects = variants.filter((v) => v.t === 'object');
  if (objects.length > 0)
    return object(
      mergeProps(objects),
      objects.some((o) => o.open),
    );
  for (const t of containerKinds) {
    const containers = variants.filter(isContainer).filter((v) => v.t === t);
    if (containers.length > 0) return { t, items: mergeUnion(containers.map((c) => c.items)) };
  }
  const leaves = variants.filter((v) => v.t === 'leaf');
  if (leaves.length > 0) {
    return leaves.every((l) => l.enum !== null) ? leaf(leaves.flatMap((l) => l.enum)) : leaf();
  }
  return { t: 'unknown' };
};

/** @type {(all: import('./types').Node[]) => import('./types').Node} */
const intersect = (all) => {
  const parts = all.filter((p) => p.t !== 'unknown');
  const [first] = parts;
  if (first === undefined) return { t: 'unknown' };
  const unions = parts.filter((p) => p.t === 'union');
  const [union] = unions;
  if (union !== undefined && unions.length === 1) {
    const rest = parts.filter((p) => p.t !== 'union');
    return { t: 'union', variants: union.variants.map((v) => intersect([...rest, v])) };
  }
  if (parts.length > 1 && isContainer(first) && parts.every((p) => p.t === first.t)) {
    return { t: first.t, items: intersect(parts.filter(isContainer).map((p) => p.items)) };
  }
  const objects = parts.filter((p) => p.t === 'object');
  if (objects.length === 0) return first;
  /** @type {import('./types').Props} */
  const props = {};
  for (const o of objects) {
    for (const [name, p] of Object.entries(o.props)) {
      const old = props[name];
      props[name] =
        old !== undefined ?
          prop(
            intersect([old.node, p.node]),
            old.req === true || p.req === true,
            old.null === true && p.null === true,
          )
        : { ...p };
    }
  }
  for (const name of parts.flatMap((p) => (p.t === 'free' ? (p.requires ?? []) : []))) {
    const existing = props[name];
    if (existing !== undefined) props[name] = { ...existing, req: true };
  }
  return object(
    props,
    objects.some((o) => o.open),
  );
};

/** @type {(node: import('./types').Node | null, kind: string, side: string) => import('./types').Difference[]} */
const topLevel = (node, kind, side) =>
  node?.t === 'object' ? Object.keys(node.props).map((name) => ({ side, kind, path: name })) : [];

/** @type {(spec: import('./types').Node, sdk: import('./types').Node, path: string, side: string, out: import('./types').Difference[]) => void} */
const compareTree = (spec, sdk, path, side, out) => {
  if (opaque.has(spec.t) || opaque.has(sdk.t)) return;
  if (spec.t === 'object' && sdk.t === 'object') {
    for (const [name, specProp] of Object.entries(spec.props)) {
      const here = path !== '' ? `${path}.${name}` : name;
      const sdkProp = sdk.props[name];
      if (sdkProp === undefined) {
        out.push({ side, kind: 'missing', path: here });
        continue;
      }
      for (const flag of flags) {
        if (specProp[flag] !== null && sdkProp[flag] !== null && specProp[flag] !== sdkProp[flag]) {
          out.push({ side, kind: flag === 'req' ? 'required' : 'nullable', path: here });
        }
      }
      compareTree(specProp.node, sdkProp.node, here, side, out);
    }
    if (!spec.open) {
      for (const name of Object.keys(sdk.props)) {
        if (!(name in spec.props))
          out.push({ side, kind: 'extra', path: path !== '' ? `${path}.${name}` : name });
      }
    }
    return;
  }
  if (isContainer(spec) && isContainer(sdk) && sdk.t === spec.t) {
    compareTree(spec.items, sdk.items, `${path}${containerSuffix[spec.t]}`, side, out);
    return;
  }
  if (spec.t === 'leaf' && sdk.t === 'leaf') {
    if (spec.enum !== null && sdk.enum !== null && spec.enum.join('\n') !== sdk.enum.join('\n'))
      out.push({ side, kind: 'enum', path });
    return;
  }
  out.push(...(path !== '' ? [{ side, kind: 'missing', path }] : topLevel(spec, 'missing', side)));
};

/** @type {(name: string) => string} */
const normalized = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

/** @type {(node: import('./types').Node, specOp: import('./types').SpecOperation, specNames: Set<string>) => import('./types').Node} */
const withoutParams = (node, specOp, specNames) => {
  if (node.t !== 'object') return node;
  const names = new Set(specOp.nonBodyParams.map(normalized));
  return object(
    Object.fromEntries(
      Object.entries(node.props).filter(([name]) => !(names.has(normalized(name)) && !specNames.has(name))),
    ),
    node.open,
  );
};

/** @type {(specOp: import('./types').SpecOperation, sdkOp: import('./types').SdkShape, defs: import('./types').Defs) => import('./types').Difference[]} */
const compareOperation = (specOp, sdkOp, defs) => {
  const specQuery = canon(specOp.query);
  const specBody = specOp.body === null ? null : canon(specOp.body);
  const specNames = new Set([
    ...Object.keys(specOp.query.props),
    ...(specBody?.t === 'object' ? Object.keys(specBody.props) : []),
  ]);
  const sdkQuery = withoutParams(canon(sdkOp.query, defs), specOp, specNames);
  let sdkBody = sdkOp.body === null ? null : withoutParams(canon(sdkOp.body, defs), specOp, specNames);
  if (sdkBody?.t === 'object' && Object.keys(sdkBody.props).length === 0 && specBody === null) sdkBody = null;
  const specResponse = specOp.response === null ? null : canon(specOp.response);
  /** @type {import('./types').Difference[]} */
  const out = [];
  compareTree(specQuery, sdkQuery, '', 'request', out);
  if (specBody !== null && sdkBody !== null) compareTree(specBody, sdkBody, '', 'request', out);
  else if (specBody !== null) out.push(...topLevel(specBody, 'missing', 'request'));
  else if (sdkBody !== null) out.push(...topLevel(sdkBody, 'extra', 'request'));
  if (specResponse !== null && sdkOp.response !== null)
    compareTree(specResponse, canon(sdkOp.response, defs), '', 'response', out);
  else if (specResponse !== null) out.push(...topLevel(specResponse, 'missing', 'response'));
  return out;
};

module.exports = { compareOperation, intersect, leaf, object, prop };
