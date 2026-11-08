// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const asObject = require('./json.cjs').asObject;

const proof = /https:\/\/|SPDX-/u;
const directive =
  /^\s*(?:eslint-disable(?:-next-line|-line)?|eslint-enable|eslint|globals?|exported)(?:\s|$)|^\*?\s*@ts-(?:check|nocheck|expect-error|ignore)\b|^\s*prettier-ignore\b|^\s*(?:c8|v8|istanbul) ignore\b|^\/\s*<reference\s|^\*\s*@type\s*\{|[#@]__(?:PURE|NO_SIDE_EFFECTS)__/u;
const exported = new Set(['ExportAllDeclaration', 'ExportDefaultDeclaration', 'ExportNamedDeclaration']);
const declarations = new Set([
  ...exported,
  'ClassDeclaration',
  'FunctionDeclaration',
  'MethodDefinition',
  'PropertyDefinition',
  'TSAbstractMethodDefinition',
  'TSAbstractPropertyDefinition',
  'TSCallSignatureDeclaration',
  'TSConstructSignatureDeclaration',
  'TSDeclareFunction',
  'TSEnumDeclaration',
  'TSEnumMember',
  'TSIndexSignature',
  'TSInterfaceDeclaration',
  'TSMethodSignature',
  'TSModuleDeclaration',
  'TSPropertySignature',
  'TSTypeAliasDeclaration',
  'VariableDeclaration',
]);

/** @type {(sourceCode: import('eslint').SourceCode, comment: import('./types').Comment) => import('./types').AstNode | undefined} */
function declarationAfter(sourceCode, comment) {
  const token = sourceCode.getTokenAfter(comment);
  if (!token) {
    return undefined;
  }
  const start = sourceCode.getNodeByRangeIndex(token.range[0]);
  if (!start) {
    return undefined;
  }
  let node = start;
  for (const ancestor of sourceCode.getAncestors(start).reverse()) {
    if (ancestor.type === 'Program' || sourceCode.getRange(ancestor)[0] !== sourceCode.getRange(node)[0]) {
      break;
    }
    node = ancestor;
  }
  return declarations.has(node.type) ? node : undefined;
}

const bodies = new Set([
  'ArrowFunctionExpression',
  'BlockStatement',
  'FunctionDeclaration',
  'FunctionExpression',
  'StaticBlock',
]);

/** @type {(sourceCode: import('eslint').SourceCode, node: import('./types').AstNode) => boolean} */
function isPublic(sourceCode, node) {
  if (
    ('accessibility' in node && (node.accessibility === 'private' || node.accessibility === 'protected')) ||
    ('key' in node && node.key?.type === 'PrivateIdentifier')
  ) {
    return false;
  }
  for (const ancestor of [node, ...sourceCode.getAncestors(node).reverse()]) {
    if (exported.has(ancestor.type)) {
      return true;
    }
    if (ancestor !== node && bodies.has(ancestor.type)) {
      return false;
    }
  }
  return false;
}

/** @type {(sourceCode: import('eslint').SourceCode, comment: import('./types').Comment) => boolean} */
function documentsPublicApi(sourceCode, comment) {
  if (comment.type !== 'Block' || !comment.value.startsWith('*')) {
    return false;
  }
  const node = declarationAfter(sourceCode, comment);
  return node !== undefined && isPublic(sourceCode, node);
}

/** @type {(sourceCode: import('eslint').SourceCode, earlier: import('./types').Comment, later: import('./types').Comment) => boolean} */
function adjacent(sourceCode, earlier, later) {
  const between = sourceCode.text.slice(sourceCode.getRange(earlier)[1], sourceCode.getRange(later)[0]);
  return /^[^\S\n]*\n?[^\S\n]*$/u.test(between);
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Allow only comments with a legal marker, a functional directive or an https proof link.',
    },
    messages: {
      comment: 'Code has no comments. Put the meaning in names, types and tests.',
    },
    schema: [
      {
        type: 'object',
        properties: { publicApiDocs: { type: 'boolean' } },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const sourceCode = context.sourceCode;
    /** @type {import('./types').JsonValue | undefined} */
    const option = context.options[0];
    const publicApiDocs = asObject(option)?.['publicApiDocs'] === true;
    return {
      Program() {
        const comments = sourceCode.getAllComments().filter((comment) => {
          /** @type {string} */
          const type = comment.type;
          return type !== 'Shebang';
        });
        const proven = comments.map(() => false);
        for (const [index, comment] of [...comments.entries()].reverse()) {
          const next = comments[index + 1];
          proven[index] =
            proof.test(comment.value) ||
            (next !== undefined && proven[index + 1] === true && adjacent(sourceCode, comment, next));
        }
        comments.forEach((comment, index) => {
          if (
            proven[index] ||
            directive.test(comment.value) ||
            (publicApiDocs && documentsPublicApi(sourceCode, comment))
          ) {
            return;
          }
          context.report({ loc: sourceCode.getLoc(comment), messageId: 'comment' });
        });
      },
    };
  },
};
