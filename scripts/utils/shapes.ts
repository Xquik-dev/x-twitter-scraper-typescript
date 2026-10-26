// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

export type Prop = { readonly req: boolean | null; readonly null: boolean | null; readonly node: Shape };
export type Props = { readonly [name: string]: Prop };
export type ObjectShape = { readonly t: 'object'; readonly props: Props; readonly open?: true };
export type Container =
  { readonly t: 'array'; readonly items: Shape } | { readonly t: 'map'; readonly items: Shape };
export type Shape =
  | { readonly t: 'leaf'; readonly enum: string[] | null }
  | ObjectShape
  | Container
  | { readonly t: 'union'; readonly variants: readonly Shape[] }
  | { readonly t: 'ref'; readonly name: string }
  | { readonly t: 'free'; readonly requires?: readonly string[] }
  | { readonly t: 'cycle' | 'unknown' };
export type Defs = { readonly [name: string]: Shape };
export type SpecOperation = {
  readonly query: ObjectShape;
  readonly nonBodyParams: readonly string[];
  readonly body: Shape | null;
  readonly response: Shape | null;
};
export type SdkOperation = {
  readonly query: Shape;
  readonly body: Shape | null;
  readonly response: Shape | null;
};
type Side = 'request' | 'response';
type Difference = {
  readonly side: Side;
  readonly kind: 'missing' | 'extra' | 'enum' | 'required' | 'nullable';
  readonly path: string;
};

const opaque = new Set<Shape['t']>(['free', 'cycle', 'unknown']);

export const leaf = (values?: readonly unknown[] | null): Shape => ({
  t: 'leaf',
  enum: values == null ? null : [...new Set(values.map(String))].sort(),
});

export const object = (props: Props, open = false): ObjectShape =>
  open ? { t: 'object', props, open: true } : { t: 'object', props };

export const prop = (node: Shape, req: boolean | null = null, nullable: boolean | null = null): Prop => ({
  req,
  null: nullable,
  node,
});

const containerSuffix = { array: '[]', map: '{}' } as const;

const isContainer = (node: Shape) => node.t === 'array' || node.t === 'map';

const canon = (node: Shape, defs: Defs = {}, stack: readonly string[] = []): Shape => {
  switch (node.t) {
    case 'ref': {
      if (stack.includes(node.name)) return { t: 'cycle' };
      const def = defs[node.name];
      if (!def) throw new Error(`The SDK shapes have no definition of ${node.name}.`);
      return canon(def, defs, [...stack, node.name]);
    }
    case 'object':
      return object(
        Object.fromEntries(
          Object.entries(node.props).map(([name, p]): [string, Prop] => [
            name,
            { ...p, node: canon(p.node, defs, stack) },
          ]),
        ),
        node.open,
      );
    case 'array':
    case 'map':
      return { t: node.t, items: canon(node.items, defs, stack) };
    case 'union':
      return mergeUnion(node.variants.map((variant) => canon(variant, defs, stack)));
    default:
      return node;
  }
};

const mergeProps = (objects: readonly ObjectShape[]): Props => {
  const names = [...new Set(objects.flatMap((o) => Object.keys(o.props)))];
  return Object.fromEntries(
    names.map((name): [string, Prop] => {
      const have = objects.flatMap((o) => o.props[name] ?? []);
      const reqs = have.map((p) => p.req);
      const nulls = have.map((p) => p.null);
      let req: boolean | null;
      if (have.length < objects.length) req = reqs.every((r) => r !== null) ? false : null;
      else req = reqs.some((r) => r === null) ? null : reqs.every(Boolean);
      const nullable = nulls.some((n) => n === null) ? null : nulls.some(Boolean);
      return [name, prop(mergeUnion(have.map((p) => p.node)), req, nullable)];
    }),
  );
};

const mergeUnion = (all: readonly Shape[]): Shape => {
  const known = all.filter((v) => v.t !== 'cycle' && v.t !== 'unknown');
  const variants = known.length ? known : all;
  const [first, ...others] = variants;
  if (!first) return { t: 'unknown' };
  if (!others.length) return first;
  if (variants.some((v) => v.t === 'free')) return { t: 'free' };
  const objects = variants.filter((v) => v.t === 'object');
  if (objects.length)
    return object(
      mergeProps(objects),
      objects.some((o) => o.open),
    );
  for (const t of ['array', 'map'] as const) {
    const items = variants.flatMap((v) => (v.t === t ? [v.items] : []));
    if (items.length) return { t, items: mergeUnion(items) };
  }
  const leaves = variants.flatMap((v) => (v.t === 'leaf' ? [v.enum] : []));
  if (leaves.length) {
    return leaves.every((values) => values !== null) ? leaf(leaves.flat()) : leaf();
  }
  return { t: 'unknown' };
};

export const intersect = (all: readonly Shape[]): Shape => {
  const parts = all.filter((p) => p.t !== 'unknown');
  const [first] = parts;
  if (!first) return { t: 'unknown' };
  const unions = parts.flatMap((p) => (p.t === 'union' ? [p.variants] : []));
  const [variants] = unions;
  if (variants && unions.length === 1) {
    const rest = parts.filter((p) => p.t !== 'union');
    return { t: 'union', variants: variants.map((v) => intersect([...rest, v])) };
  }
  const items = parts.flatMap((p) => (isContainer(p) && p.t === first.t ? [p.items] : []));
  if (parts.length > 1 && isContainer(first) && items.length === parts.length) {
    return { t: first.t, items: intersect(items) };
  }
  const objects = parts.filter((p) => p.t === 'object');
  if (!objects.length) return first;
  const props: { [name: string]: Prop } = {};
  for (const o of objects) {
    for (const [name, p] of Object.entries(o.props)) {
      const old = props[name];
      props[name] =
        old ?
          prop(intersect([old.node, p.node]), Boolean(old.req || p.req), Boolean(old.null && p.null))
        : { ...p };
    }
  }
  for (const name of parts.flatMap((p) => (p.t === 'free' ? (p.requires ?? []) : []))) {
    const old = props[name];
    if (old) props[name] = { ...old, req: true };
  }
  return object(
    props,
    objects.some((o) => o.open),
  );
};

const topLevel = (node: Shape | null, kind: Difference['kind'], side: Side): Difference[] =>
  node?.t === 'object' ? Object.keys(node.props).map((name) => ({ side, kind, path: name })) : [];

const compareTree = (spec: Shape, sdk: Shape, path: string, side: Side, out: Difference[]): void => {
  if (opaque.has(spec.t) || opaque.has(sdk.t)) return;
  if (spec.t === 'object' && sdk.t === 'object') {
    for (const [name, specProp] of Object.entries(spec.props)) {
      const here = path ? `${path}.${name}` : name;
      const sdkProp = sdk.props[name];
      if (!sdkProp) {
        out.push({ side, kind: 'missing', path: here });
        continue;
      }
      for (const flag of ['req', 'null'] as const) {
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
  if (isContainer(spec) && isContainer(sdk) && sdk.t === spec.t) {
    compareTree(spec.items, sdk.items, `${path}${containerSuffix[spec.t]}`, side, out);
    return;
  }
  if (spec.t === 'leaf' && sdk.t === 'leaf') {
    if (spec.enum && sdk.enum && spec.enum.join('\n') !== sdk.enum.join('\n'))
      out.push({ side, kind: 'enum', path });
    return;
  }
  out.push(...(path ? [{ side, kind: 'missing' as const, path }] : topLevel(spec, 'missing', side)));
};

const normalized = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const withoutParams = (node: Shape, specOp: SpecOperation, specNames: ReadonlySet<string>): Shape => {
  if (node.t !== 'object') return node;
  const names = new Set(specOp.nonBodyParams.map(normalized));
  return object(
    Object.fromEntries(
      Object.entries(node.props).filter(([name]) => !(names.has(normalized(name)) && !specNames.has(name))),
    ),
    node.open,
  );
};

const propNames = (node: Shape | null) => (node?.t === 'object' ? Object.keys(node.props) : []);

export const compareOperation = (specOp: SpecOperation, sdkOp: SdkOperation, defs: Defs): Difference[] => {
  const specQuery = canon(specOp.query);
  const specBody = specOp.body && canon(specOp.body);
  const specNames = new Set([...propNames(specQuery), ...propNames(specBody)]);
  const sdkQuery = withoutParams(canon(sdkOp.query, defs), specOp, specNames);
  let sdkBody = sdkOp.body && withoutParams(canon(sdkOp.body, defs), specOp, specNames);
  if (sdkBody?.t === 'object' && !Object.keys(sdkBody.props).length && !specBody) sdkBody = null;
  const specResponse = specOp.response && canon(specOp.response);
  const out: Difference[] = [];
  compareTree(specQuery, sdkQuery, '', 'request', out);
  if (specBody && sdkBody) compareTree(specBody, sdkBody, '', 'request', out);
  else if (specBody) out.push(...topLevel(specBody, 'missing', 'request'));
  else if (sdkBody) out.push(...topLevel(sdkBody, 'extra', 'request'));
  if (specResponse && sdkOp.response)
    compareTree(specResponse, canon(sdkOp.response, defs), '', 'response', out);
  else if (specResponse) out.push(...topLevel(specResponse, 'missing', 'response'));
  return out;
};
