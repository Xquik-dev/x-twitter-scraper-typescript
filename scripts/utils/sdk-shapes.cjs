// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const { CheckError, comparable } = require('./api-spec.cjs');
const { leaf, object } = require('./shapes.cjs');

const verbs = new Set(['get', 'post', 'put', 'patch', 'delete']);
const fileTypes = new Set(['Blob', 'File', 'Response', 'Date', 'ReadableStream']);
const fallbackOptions = {
  target: ts.ScriptTarget.ES2020,
  lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'],
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  exactOptionalPropertyTypes: true,
  skipLibCheck: true,
  noEmit: true,
  types: [],
};

const sourceFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(file);
    return entry.name.endsWith('.ts') ? [file] : [];
  });

const literal = (type) => {
  if (type.flags & (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral)) return String(type.value);
  if (type.flags & ts.TypeFlags.BooleanLiteral) return type.intrinsicName;
  return null;
};

const isNullish = (type) =>
  (type.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void)) !== 0;

const unquoted = (text) => text.replace(/^['"]|['"]$/g, '');

const compilerOptions = (root) => {
  const configFile = path.join(root, 'tsconfig.json');
  if (!fs.existsSync(configFile)) return fallbackOptions;
  const { config, error } = ts.readConfigFile(configFile, ts.sys.readFile);
  if (error)
    throw new CheckError(
      `Could not read tsconfig.json, because ${ts.flattenDiagnosticMessageText(error.messageText, ' ')}`,
    );
  return { ...ts.parseJsonConfigFileContent(config, ts.sys, root).options, noEmit: true };
};

const typeErrors = (program, root) =>
  ts.getPreEmitDiagnostics(program).map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ');
    if (!diagnostic.file || diagnostic.start === undefined) return message;
    const line = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1;
    return `${message} at ${path.relative(root, diagnostic.file.fileName)} line ${line}`;
  });

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
  const defs = {};

  const defName = (type) => {
    const symbol = type.aliasSymbol ?? type.getSymbol();
    if (!symbol || type.aliasTypeArguments?.length) return null;
    if (type.objectFlags & ts.ObjectFlags.Reference && checker.getTypeArguments(type).length) return null;
    if (['__type', '__object', 'Array', 'Record'].includes(symbol.getName())) return null;
    const declaration = symbol.declarations?.[0];
    if (!declaration?.getSourceFile().fileName.startsWith(src + path.sep)) return null;
    return checker.getFullyQualifiedName(symbol);
  };

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
      return parts.length === 1 ? node(parts[0]) : { t: 'union', variants: parts.map(node) };
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
    if (checker.isArrayType(type)) {
      const [item] = checker.getTypeArguments(type);
      return { t: 'array', items: item ? node(item) : { t: 'unknown' } };
    }
    if (type.flags & ts.TypeFlags.Object || type.isIntersection()) {
      if (type.getCallSignatures().length) return { t: 'unknown' };
      const symbols = checker.getPropertiesOfType(type);
      if (!symbols.length) return { t: 'free' };
      if (fileTypes.has(type.getSymbol()?.getName())) return leaf();
      return object(propsOf(symbols));
    }
    return { t: 'unknown' };
  };

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

  const routeOf = (argument) => {
    if (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument)) return argument.text;
    if (ts.isTaggedTemplateExpression(argument) && argument.tag.getText() === 'path') {
      const template = argument.template;
      if (ts.isNoSubstitutionTemplateLiteral(template)) return template.text;
      return template.head.text + template.templateSpans.map((span) => `{}${span.literal.text}`).join('');
    }
    throw new Error(`its path ${argument.getText()} is not a string or a path template`);
  };

  const requestCall = (body) => {
    let found = null;
    const visit = (child) => {
      if (found) return;
      if (
        ts.isCallExpression(child) &&
        ts.isPropertyAccessExpression(child.expression) &&
        verbs.has(child.expression.name.text) &&
        child.expression.expression.getText() === 'this._client'
      ) {
        found = child;
        return;
      }
      ts.forEachChild(child, visit);
    };
    visit(body);
    return found;
  };

  const optionsLiteral = (expression) => {
    if (!expression) return null;
    if (ts.isObjectLiteralExpression(expression)) return expression;
    if (ts.isCallExpression(expression) && ts.isObjectLiteralExpression(expression.arguments[0])) {
      return expression.arguments[0];
    }
    return null;
  };

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
        const source = checker.getNonNullableType(checker.getTypeAtLocation(pattern.parent.initializer));
        if (declaration.dotDotDotToken) {
          const taken = pattern.elements
            .filter((element) => !element.dotDotDotToken)
            .map((element) => unquoted((element.propertyName ?? element.name).getText()));
          return [{ type: source, omit: taken }];
        }
        const key = unquoted((declaration.propertyName ?? declaration.name).getText());
        const symbols = (source.isUnion() ? source.types : [source])
          .map((part) => checker.getPropertyOfType(part, key))
          .filter(Boolean);
        return symbols.length ? [{ name: key, symbol: symbols[0] }] : [];
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
          return [
            { name: unquoted(property.name.getText()), symbol: inner.length === 1 ? inner[0].symbol : null },
          ];
        }
        return [];
      });
    }
    throw new Error(`it cannot read ${expression.getText()}`);
  };

  const fieldsNode = (fields) => {
    const named = {};
    for (const field of fields.filter((f) => !f.type)) {
      named[field.name] =
        field.symbol ?
          propsOf([field.symbol])[field.symbol.getName()]
        : { req: null, null: null, node: { t: 'unknown' } };
    }
    const variants = fields
      .filter((field) => field.type)
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
    return variants.length === 1 ? variants[0] : { t: 'union', variants };
  };

  const responseNode = (method) => {
    const returned = checker.getReturnTypeOfSignature(checker.getSignatureFromDeclaration(method));
    const name = (returned.getSymbol() ?? returned.aliasSymbol)?.getName();
    if (name !== 'APIPromise')
      throw new Error(`it returns ${checker.typeToString(returned)}, not an APIPromise`);
    const args = returned.aliasTypeArguments ?? checker.getTypeArguments(returned);
    const inner = args[args.length - 1];
    if (!inner || inner.flags & ts.TypeFlags.Void || inner.getSymbol()?.getName() === 'Response') return null;
    return node(inner);
  };

  const operation = (method, call) => {
    if (!call.arguments.length) throw new Error('it passes no path');
    const route = routeOf(call.arguments[0]);
    let query = object({});
    let body = null;
    const options = optionsLiteral(call.arguments[1]);
    if (!options && call.arguments[1] && call.arguments[1].getText() !== 'options') {
      throw new Error(`its options ${call.arguments[1].getText()} are not an object literal`);
    }
    for (const property of options?.properties ?? []) {
      const key = property.name?.getText();
      if (key !== 'query' && key !== 'body') continue;
      const fields =
        ts.isShorthandPropertyAssignment(property) ?
          fieldsOf(property.name, property)
        : fieldsOf(property.initializer);
      if (key === 'query') query = fieldsNode(fields);
      else body = fieldsNode(fields);
    }
    const key = comparable(`${call.expression.name.text.toUpperCase()} ${basePath}${route}`);
    return { key, query, body, response: responseNode(method) };
  };

  const ops = {};
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.startsWith(path.join(src, 'resources') + path.sep)) continue;
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
            throw new CheckError(
              `Could not read the fields of ${member.name.getText()} at ${path.relative(root, sourceFile.fileName)} line ${line}, because ${error.message}.`,
            );
          }
          const old = ops[entry.key];
          ops[entry.key] =
            old ?
              Object.fromEntries(
                ['query', 'body', 'response'].map((side) => [
                  side,
                  old[side] && entry[side] ?
                    { t: 'union', variants: [old[side], entry[side]] }
                  : (old[side] ?? entry[side]),
                ]),
              )
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
