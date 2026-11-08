// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const api = require('./api-spec.cjs');
const shapes = require('./shapes.cjs');

const { CheckError, comparable } = api;
const { leaf, object } = shapes;

const verbs = new Set(['get', 'post', 'put', 'patch', 'delete']);
const fileTypes = new Set(['Blob', 'File', 'Response', 'Date', 'ReadableStream']);
const fallbackOptions = {
  target: ts.ScriptTarget.ES2020,
  lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'],
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  exactOptionalPropertyTypes: true,
  skipLibCheck: false,
  noEmit: true,
  types: [],
};

/** @type {(directory: string) => string[]} */
const sourceFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(file);
    return entry.name.endsWith('.ts') ? [file] : [];
  });

/** @type {(type: import('typescript').Type) => type is import('typescript').TypeReference} */
function isReference(type) {
  return (
    'objectFlags' in type &&
    typeof type.objectFlags === 'number' &&
    (type.objectFlags & ts.ObjectFlags.Reference) !== 0
  );
}

/** @type {(node: import('typescript').Node) => node is import('./types').RequestCall} */
function isClientCall(node) {
  return (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    verbs.has(node.expression.name.text) &&
    node.expression.expression.getText() === 'this._client'
  );
}

/** @type {(type: import('typescript').Type) => boolean} */
const isNullish = (type) =>
  (type.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void)) !== 0;

/** @type {(text: string) => string} */
const unquoted = (text) => text.replace(/^['"]|['"]$/g, '');

/** @type {(root: string) => import('typescript').CompilerOptions} */
const compilerOptions = (root) => {
  const configFile = path.join(root, 'tsconfig.json');
  if (!fs.existsSync(configFile)) return fallbackOptions;
  /** @type {{ config?: unknown; error?: import('typescript').Diagnostic }} */
  const { config, error } = ts.readConfigFile(configFile, ts.sys.readFile);
  if (error)
    throw new CheckError(
      `Could not read tsconfig.json, because ${ts.flattenDiagnosticMessageText(error.messageText, ' ')}`,
    );
  return { ...ts.parseJsonConfigFileContent(config, ts.sys, root).options, noEmit: true };
};

/** @type {(program: import('typescript').Program, root: string) => string[]} */
const typeErrors = (program, root) =>
  ts.getPreEmitDiagnostics(program).map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ');
    if (!diagnostic.file || diagnostic.start === undefined) return message;
    const line = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1;
    return `${message} at ${path.relative(root, diagnostic.file.fileName)} line ${line}`;
  });

/** @type {(root: string, basePath: string) => import('./types').SdkShapes} */
const sdkShapes = (root, basePath) => {
  const src = path.join(root, 'src');
  const program = ts.createProgram(sourceFiles(src), compilerOptions(root));
  const errors = typeErrors(program, root);
  if (errors.length) {
    throw new CheckError(
      `Could not read the SDK's types, because the TypeScript compiler reports ${errors.slice(0, 3).join(', ')}. Fix the type errors first.`,
    );
  }
  const checker = program.getTypeChecker();
  /** @type {import('./types').Defs} */
  const defs = {};

  /** @type {(type: import('typescript').Type) => string | null} */
  const literal = (type) => {
    if (type.isStringLiteral() || type.isNumberLiteral()) return String(type.value);
    if (type.flags & ts.TypeFlags.BooleanLiteral) return checker.typeToString(type);
    return null;
  };

  /** @type {(type: import('typescript').Type) => string | null} */
  const defName = (type) => {
    const symbol = type.aliasSymbol ?? type.getSymbol();
    if (!symbol || type.aliasTypeArguments?.length) return null;
    if (isReference(type) && checker.getTypeArguments(type).length) return null;
    if (['__type', '__object', 'Array', 'Record'].includes(symbol.getName())) return null;
    const declaration = symbol.declarations?.[0];
    if (!declaration?.getSourceFile().fileName.startsWith(src + path.sep)) return null;
    return checker.getFullyQualifiedName(symbol);
  };

  /** @type {(type: import('typescript').Type) => import('./types').Node} */
  const node = (type) => {
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

  /** @type {(type: import('typescript').Type) => import('./types').Node} */
  const build = (type) => {
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
      const [only] = parts;
      return only && parts.length === 1 ? node(only) : { t: 'union', variants: parts.map(node) };
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
    if (isReference(type) && checker.isArrayType(type)) {
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

  /** @type {(symbols: readonly import('typescript').Symbol[]) => import('./types').Props} */
  const propsOf = (symbols) =>
    Object.fromEntries(
      symbols.flatMap((symbol) => {
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

  /** @type {(argument: import('typescript').Expression) => string} */
  const routeOf = (argument) => {
    if (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument)) return argument.text;
    if (ts.isTaggedTemplateExpression(argument) && argument.tag.getText() === 'path') {
      const template = argument.template;
      if (ts.isNoSubstitutionTemplateLiteral(template)) return template.text;
      return template.head.text + template.templateSpans.map((span) => `{}${span.literal.text}`).join('');
    }
    throw new Error(`its path ${argument.getText()} is not a string or a path template`);
  };

  /** @type {(body: import('typescript').Node) => import('./types').RequestCall | null} */
  const requestCall = (body) => {
    /** @type {import('./types').RequestCall | null} */
    let found = null;
    /** @type {(child: import('typescript').Node) => void} */
    const visit = (child) => {
      if (found) return;
      if (isClientCall(child)) {
        found = child;
        return;
      }
      ts.forEachChild(child, visit);
    };
    visit(body);
    return found;
  };

  /** @type {(expression: import('typescript').Expression | undefined) => import('typescript').ObjectLiteralExpression | null} */
  const optionsLiteral = (expression) => {
    if (!expression) return null;
    if (ts.isObjectLiteralExpression(expression)) return expression;
    if (ts.isCallExpression(expression)) {
      const [first] = expression.arguments;
      if (first && ts.isObjectLiteralExpression(first)) return first;
    }
    return null;
  };

  /** @type {(expression: import('typescript').Expression, shorthand?: import('typescript').ShorthandPropertyAssignment) => import('./types').Field[]} */
  const fieldsOf = (expression, shorthand) => {
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
      if (ts.isBindingElement(declaration)) {
        const pattern = declaration.parent;
        const initializer = pattern.parent.initializer;
        const source = checker.getNonNullableType(
          initializer ? checker.getTypeAtLocation(initializer) : checker.getAnyType(),
        );
        if (declaration.dotDotDotToken) {
          /** @type {readonly import('typescript').ArrayBindingElement[]} */
          const elements = pattern.elements;
          const taken = elements
            .filter(ts.isBindingElement)
            .filter((element) => !element.dotDotDotToken)
            .map((element) => unquoted((element.propertyName ?? element.name).getText()));
          return [{ type: source, omit: taken }];
        }
        const key = unquoted((declaration.propertyName ?? declaration.name).getText());
        const [symbol] = (source.isUnion() ? source.types : [source])
          .map((part) => checker.getPropertyOfType(part, key))
          .filter((found) => found !== undefined);
        return symbol ? [{ name: key, symbol }] : [];
      }
      throw new Error(`it cannot read the declaration of ${expression.getText()}`);
    }
    if (ts.isObjectLiteralExpression(expression)) {
      return expression.properties.flatMap((property) => {
        if (ts.isShorthandPropertyAssignment(property)) {
          const name = property.name.text;
          return fieldsOf(property.name, property).map((field) =>
            field.type ?
              { name, symbol: checker.getShorthandAssignmentValueSymbol(property) }
            : { ...field, name },
          );
        }
        if (ts.isSpreadAssignment(property)) return fieldsOf(property.expression);
        if (ts.isPropertyAssignment(property)) {
          const inner = ts.isIdentifier(property.initializer) ? fieldsOf(property.initializer) : [];
          const [only] = inner;
          return [
            {
              name: unquoted(property.name.getText()),
              symbol: only && inner.length === 1 ? only.symbol : null,
            },
          ];
        }
        return [];
      });
    }
    throw new Error(`it cannot read ${expression.getText()}`);
  };

  /** @type {(fields: import('./types').Field[]) => import('./types').Node} */
  const fieldsNode = (fields) => {
    /** @type {import('./types').Props} */
    const named = {};
    for (const field of fields.filter((f) => !f.type)) {
      /** @type {import('./types').Prop | undefined} */
      const fieldProp =
        field.symbol ?
          propsOf([field.symbol])[field.symbol.getName()]
        : { req: null, null: null, node: { t: 'unknown' } };
      if (fieldProp) named[field.name] = fieldProp;
    }
    const variants = fields
      .filter((field) => field.type !== undefined)
      .flatMap((field) =>
        (field.type.isUnion() ? field.type.types.filter((part) => !isNullish(part)) : [field.type]).map(
          (part) =>
            object({
              ...propsOf(checker.getPropertiesOfType(part).filter((s) => !field.omit.includes(s.getName()))),
              ...named,
            }),
        ),
      );
    if (!variants.length) return object(named);
    const [only] = variants;
    return only && variants.length === 1 ? only : { t: 'union', variants };
  };

  /** @type {(method: import('typescript').MethodDeclaration) => import('./types').Node | null} */
  const responseNode = (method) => {
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

  /** @type {(method: import('typescript').MethodDeclaration, call: import('./types').RequestCall) => import('./types').SdkOperation} */
  const operation = (method, call) => {
    const [pathArgument, optionsArgument] = call.arguments;
    if (!pathArgument) throw new Error('it passes no path');
    const route = routeOf(pathArgument);
    /** @type {import('./types').Node} */
    let query = object({});
    /** @type {import('./types').Node | null} */
    let body = null;
    const options = optionsLiteral(optionsArgument);
    if (!options && optionsArgument && optionsArgument.getText() !== 'options') {
      throw new Error(`its options ${optionsArgument.getText()} are not an object literal`);
    }
    for (const property of options?.properties ?? []) {
      if (ts.isSpreadAssignment(property)) continue;
      const key = property.name.getText();
      if (key !== 'query' && key !== 'body') continue;
      let fields;
      if (ts.isShorthandPropertyAssignment(property)) fields = fieldsOf(property.name, property);
      else if (ts.isPropertyAssignment(property)) fields = fieldsOf(property.initializer);
      else throw new Error(`it cannot read ${property.getText()}`);
      if (key === 'query') query = fieldsNode(fields);
      else body = fieldsNode(fields);
    }
    const key = comparable(`${call.expression.name.text.toUpperCase()} ${basePath}${route}`);
    return { key, query, body, response: responseNode(method) };
  };

  /** @type {<T extends import('./types').Node | null>(old: T, next: T) => T | import('./types').UnionNode} */
  const merged = (old, next) => (old && next ? { t: 'union', variants: [old, next] } : (old ?? next));

  /** @type {Record<string, import('./types').SdkShape>} */
  const ops = {};
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.startsWith(path.join(src, 'resources') + path.sep)) continue;
    /** @type {(child: import('typescript').Node) => void} */
    const visit = (child) => {
      if (ts.isClassDeclaration(child)) {
        for (const member of child.members) {
          if (!ts.isMethodDeclaration(member) || !member.body) continue;
          const call = requestCall(member.body);
          if (!call) continue;
          let entry;
          try {
            entry = operation(member, call);
          } catch (error) {
            const line = sourceFile.getLineAndCharacterOfPosition(member.getStart()).line + 1;
            const reason = error instanceof Error ? error.message : undefined;
            throw new CheckError(
              `Could not read the fields of ${member.name.getText()} at ${path.relative(root, sourceFile.fileName)} line ${line}, because ${reason}.`,
            );
          }
          const old = ops[entry.key];
          ops[entry.key] =
            old ?
              {
                query: merged(old.query, entry.query),
                body: merged(old.body, entry.body),
                response: merged(old.response, entry.response),
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

module.exports = { sdkShapes };
