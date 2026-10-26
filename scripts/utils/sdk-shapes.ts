// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { CheckError, comparable } from './api-spec.ts';
import { leaf, object, type Prop, type Props, type SdkOperation, type Shape } from './shapes.ts';

type Field =
  | { readonly type: ts.Type; readonly omit: readonly string[] }
  | { readonly name: string; readonly symbol: ts.Symbol | null };
type RequestCall = { readonly call: ts.CallExpression; readonly verb: string };

const verbs = new Set(['get', 'post', 'put', 'patch', 'delete']);
const fileTypes = new Set(['Blob', 'File', 'Response', 'Date', 'ReadableStream']);
const fallbackOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2020,
  lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'],
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  exactOptionalPropertyTypes: true,
  noEmit: true,
  types: [],
};

const sourceFiles = (directory: string): string[] =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(file);
    return entry.name.endsWith('.ts') ? [file] : [];
  });

const isNullish = (type: ts.Type) =>
  (type.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void)) !== 0;

const isReference = (type: ts.Type): type is ts.TypeReference =>
  'objectFlags' in type &&
  typeof type.objectFlags === 'number' &&
  (type.objectFlags & ts.ObjectFlags.Reference) !== 0;

const unquoted = (text: string) => text.replace(/^['"]|['"]$/g, '');

const compilerOptions = (root: string): ts.CompilerOptions => {
  const configFile = path.join(root, 'tsconfig.json');
  if (!fs.existsSync(configFile)) return fallbackOptions;
  const read: { readonly config?: unknown; readonly error?: ts.Diagnostic } = ts.readConfigFile(
    configFile,
    ts.sys.readFile,
  );
  if (read.error)
    throw new CheckError(
      `Could not read tsconfig.json, because ${ts.flattenDiagnosticMessageText(read.error.messageText, ' ')}`,
    );
  return { ...ts.parseJsonConfigFileContent(read.config, ts.sys, root).options, noEmit: true };
};

const typeErrors = (program: ts.Program, root: string) =>
  ts.getPreEmitDiagnostics(program).map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ');
    if (!diagnostic.file || diagnostic.start === undefined) return message;
    const line = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1;
    return `${message} at ${path.relative(root, diagnostic.file.fileName)} line ${line}`;
  });

const routeOf = (argument: ts.Expression) => {
  if (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument)) return argument.text;
  if (ts.isTaggedTemplateExpression(argument) && argument.tag.getText() === 'path') {
    const template = argument.template;
    if (ts.isNoSubstitutionTemplateLiteral(template)) return template.text;
    return template.head.text + template.templateSpans.map((span) => `{}${span.literal.text}`).join('');
  }
  throw new Error(`its path ${argument.getText()} is not a string or a path template`);
};

const requestCall = (node: ts.Node): RequestCall | undefined => {
  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    verbs.has(node.expression.name.text) &&
    node.expression.expression.getText() === 'this._client'
  ) {
    return { call: node, verb: node.expression.name.text };
  }
  return ts.forEachChild(node, requestCall);
};

const optionsLiteral = (expression: ts.Expression | undefined) => {
  if (!expression) return null;
  if (ts.isObjectLiteralExpression(expression)) return expression;
  const [first] = ts.isCallExpression(expression) ? expression.arguments : [];
  return first && ts.isObjectLiteralExpression(first) ? first : null;
};

const union = (left: Shape | null, right: Shape | null): Shape | null =>
  left && right ? { t: 'union', variants: [left, right] } : (left ?? right);

export const sdkShapes = (root: string, basePath: string) => {
  const src = path.join(root, 'src');
  const program = ts.createProgram(sourceFiles(src), compilerOptions(root));
  const errors = typeErrors(program, root);
  if (errors.length) {
    throw new CheckError(
      `Could not read the SDK's types, because the TypeScript compiler reports ${errors.slice(0, 3).join(', ')}. Fix the type errors first.`,
    );
  }
  const checker = program.getTypeChecker();
  const defs: { [name: string]: Shape } = {};

  const literal = (type: ts.Type) => {
    if (type.isStringLiteral() || type.isNumberLiteral()) return String(type.value);
    if (type.flags & ts.TypeFlags.BooleanLiteral) return checker.typeToString(type);
    return null;
  };

  const defName = (type: ts.Type) => {
    const symbol = type.aliasSymbol ?? type.getSymbol();
    if (!symbol || type.aliasTypeArguments?.length) return null;
    if (isReference(type) && checker.getTypeArguments(type).length) return null;
    if (['__type', '__object', 'Array', 'Record'].includes(symbol.getName())) return null;
    const declaration = symbol.declarations?.[0];
    if (!declaration?.getSourceFile().fileName.startsWith(src + path.sep)) return null;
    return checker.getFullyQualifiedName(symbol);
  };

  const node = (type: ts.Type): Shape => {
    if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return { t: 'unknown' };
    if (type.aliasSymbol?.getName() === 'Uploadable') return leaf();
    const name = defName(type);
    if (!name) return build(type);
    if (!(name in defs)) {
      defs[name] = { t: 'unknown' };
      defs[name] = build(type);
    }
    return { t: 'ref', name };
  };

  const build = (type: ts.Type): Shape => {
    if (type.isUnion()) {
      const parts = type.types.filter((part) => !isNullish(part));
      if (!parts.length) return { t: 'unknown' };
      const literals = parts.map(literal);
      if (literals.every((value) => value !== null)) {
        return literals.length === 2 && literals.includes('true') && literals.includes('false') ?
            leaf()
          : leaf(literals);
      }
      const primitive = ts.TypeFlags.String | ts.TypeFlags.Number | ts.TypeFlags.Boolean;
      if (parts.every((part) => literal(part) !== null || part.flags & primitive)) return leaf();
      const [only, ...others] = parts;
      return only && !others.length ? node(only) : { t: 'union', variants: parts.map(node) };
    }
    const value = literal(type);
    if (value !== null) return leaf([value]);
    const scalar =
      ts.TypeFlags.String |
      ts.TypeFlags.Number |
      ts.TypeFlags.Boolean |
      ts.TypeFlags.BigInt |
      ts.TypeFlags.ESSymbol |
      ts.TypeFlags.Enum;
    if (type.flags & scalar || checker.isTupleType(type)) return leaf();
    if (checker.isArrayType(type) && isReference(type)) {
      const [item] = checker.getTypeArguments(type);
      return { t: 'array', items: item ? node(item) : { t: 'unknown' } };
    }
    if (type.flags & ts.TypeFlags.Object || type.isIntersection()) {
      if (type.getCallSignatures().length) return { t: 'unknown' };
      const symbols = checker.getPropertiesOfType(type);
      if (!symbols.length) {
        const values = type.getStringIndexType();
        const valueNode = values && node(values);
        return valueNode && valueNode.t !== 'unknown' ? { t: 'map', items: valueNode } : { t: 'free' };
      }
      if (fileTypes.has(type.getSymbol()?.getName() ?? '')) return leaf();
      return object(propsOf(symbols));
    }
    return { t: 'unknown' };
  };

  const propsOf = (symbols: readonly ts.Symbol[]): Props =>
    Object.fromEntries(
      symbols.flatMap((symbol): [string, Prop][] => {
        const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
        const type =
          declaration ?
            checker.getTypeOfSymbolAtLocation(symbol, declaration)
          : checker.getTypeOfSymbol(symbol);
        if (type.getCallSignatures().length) return [];
        const nullable =
          type.isUnion() ?
            type.types.some((part) => part.flags & ts.TypeFlags.Null)
          : (type.flags & ts.TypeFlags.Null) !== 0;
        const optional = (symbol.flags & ts.SymbolFlags.Optional) !== 0;
        return [[symbol.getName(), { req: !optional, null: nullable, node: node(type) }]];
      }),
    );

  const fieldsOf = (expression: ts.Expression, shorthand?: ts.ShorthandPropertyAssignment): Field[] => {
    if (ts.isIdentifier(expression)) {
      const symbol =
        shorthand ?
          checker.getShorthandAssignmentValueSymbol(shorthand)
        : checker.getSymbolAtLocation(expression);
      const declaration = symbol?.valueDeclaration;
      if (!declaration) throw new Error(`it cannot resolve ${expression.getText()}`);
      if (ts.isParameter(declaration)) {
        return [{ type: checker.getNonNullableType(checker.getTypeAtLocation(declaration)), omit: [] }];
      }
      const pattern = declaration.parent;
      const initializer =
        ts.isBindingElement(declaration) && ts.isObjectBindingPattern(pattern) ?
          pattern.parent.initializer
        : undefined;
      if (ts.isBindingElement(declaration) && ts.isObjectBindingPattern(pattern) && initializer) {
        const source = checker.getNonNullableType(checker.getTypeAtLocation(initializer));
        if (declaration.dotDotDotToken) {
          const taken = pattern.elements
            .filter((element) => !element.dotDotDotToken)
            .map((element) => unquoted((element.propertyName ?? element.name).getText()));
          return [{ type: source, omit: taken }];
        }
        const key = unquoted((declaration.propertyName ?? declaration.name).getText());
        const [first] = (source.isUnion() ? source.types : [source]).flatMap(
          (part) => checker.getPropertyOfType(part, key) ?? [],
        );
        return first ? [{ name: key, symbol: first }] : [];
      }
      throw new Error(`it cannot read the declaration of ${expression.getText()}`);
    }
    if (ts.isObjectLiteralExpression(expression)) {
      return expression.properties.flatMap((property): Field[] => {
        if (ts.isShorthandPropertyAssignment(property)) {
          const name = property.name.text;
          return fieldsOf(property.name, property).map((field) =>
            'type' in field ?
              { name, symbol: checker.getShorthandAssignmentValueSymbol(property) ?? null }
            : { ...field, name },
          );
        }
        if (ts.isSpreadAssignment(property)) return fieldsOf(property.expression);
        if (ts.isPropertyAssignment(property)) {
          const [only, ...others] =
            ts.isIdentifier(property.initializer) ? fieldsOf(property.initializer) : [];
          return [
            {
              name: unquoted(property.name.getText()),
              symbol: only && !others.length && 'symbol' in only ? only.symbol : null,
            },
          ];
        }
        return [];
      });
    }
    throw new Error(`it cannot read ${expression.getText()}`);
  };

  const fieldsNode = (fields: readonly Field[]): Shape => {
    const named: { [name: string]: Prop } = {};
    for (const field of fields) {
      if ('type' in field) continue;
      named[field.name] = (field.symbol && propsOf([field.symbol])[field.symbol.getName()]) ?? {
        req: null,
        null: null,
        node: { t: 'unknown' },
      };
    }
    const variants = fields.flatMap((field) =>
      'type' in field ?
        (field.type.isUnion() ? field.type.types.filter((part) => !isNullish(part)) : [field.type]).map(
          (part) =>
            object({
              ...propsOf(checker.getPropertiesOfType(part).filter((s) => !field.omit.includes(s.getName()))),
              ...named,
            }),
        )
      : [],
    );
    const [only, ...others] = variants;
    if (!only) return object(named);
    return others.length ? { t: 'union', variants } : only;
  };

  const responseNode = (method: ts.MethodDeclaration) => {
    const signature = checker.getSignatureFromDeclaration(method);
    if (!signature) throw new Error('it has no call signature');
    const returned = checker.getReturnTypeOfSignature(signature);
    const name = (returned.getSymbol() ?? returned.aliasSymbol)?.getName();
    if (name !== 'APIPromise')
      throw new Error(`it returns ${checker.typeToString(returned)}, not an APIPromise`);
    const args =
      returned.aliasTypeArguments ?? (isReference(returned) ? checker.getTypeArguments(returned) : []);
    const inner = args[args.length - 1];
    if (!inner || inner.flags & ts.TypeFlags.Void || inner.getSymbol()?.getName() === 'Response') return null;
    return node(inner);
  };

  const operation = (method: ts.MethodDeclaration, { call, verb }: RequestCall) => {
    const [pathArgument, optionsArgument] = call.arguments;
    if (!pathArgument) throw new Error('it passes no path');
    const route = routeOf(pathArgument);
    let query: Shape = object({});
    let body: Shape | null = null;
    const options = optionsLiteral(optionsArgument);
    if (!options && optionsArgument && optionsArgument.getText() !== 'options') {
      throw new Error(`its options ${optionsArgument.getText()} are not an object literal`);
    }
    for (const property of options?.properties ?? []) {
      const key = property.name?.getText();
      if (key !== 'query' && key !== 'body') continue;
      const fields =
        ts.isShorthandPropertyAssignment(property) ? fieldsOf(property.name, property)
        : ts.isPropertyAssignment(property) ? fieldsOf(property.initializer)
        : [];
      if (key === 'query') query = fieldsNode(fields);
      else body = fieldsNode(fields);
    }
    const key = comparable(`${verb.toUpperCase()} ${basePath}${route}`);
    const entry: SdkOperation = { query, body, response: responseNode(method) };
    return { key, entry };
  };

  const ops: { [key: string]: SdkOperation } = {};
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.startsWith(path.join(src, 'resources') + path.sep)) continue;
    const visit = (child: ts.Node): void => {
      if (ts.isClassDeclaration(child)) {
        for (const member of child.members) {
          if (!ts.isMethodDeclaration(member) || !member.body) continue;
          const call = requestCall(member.body);
          if (!call) continue;
          let read: { readonly key: string; readonly entry: SdkOperation };
          try {
            read = operation(member, call);
          } catch (error) {
            const line = sourceFile.getLineAndCharacterOfPosition(member.getStart()).line + 1;
            throw new CheckError(
              `Could not read the fields of ${member.name.getText()} at ${path.relative(root, sourceFile.fileName)} line ${line}, because ${error instanceof Error ? error.message : String(error)}.`,
            );
          }
          const { key, entry } = read;
          const old = ops[key];
          ops[key] =
            old ?
              {
                query: { t: 'union', variants: [old.query, entry.query] },
                body: union(old.body, entry.body),
                response: union(old.response, entry.response),
              }
            : entry;
        }
      }
      ts.forEachChild(child, visit);
    };
    ts.forEachChild(sourceFile, visit);
  }
  return { ops, defs };
};
