// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { AST_NODE_TYPES, AST_TOKEN_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

type NodeType = `${AST_NODE_TYPES}`;
type Options = readonly [{ readonly publicApiDocs?: boolean }?];

const proof = /https:\/\/|SPDX-/u;
const directive =
  /^\s*(?:eslint-disable(?:-next-line|-line)?|eslint-enable|eslint|globals?|exported)(?:\s|$)|^\*?\s*@ts-(?:check|nocheck|expect-error|ignore)\b|^\s*prettier-ignore\b|^\s*(?:c8|v8|istanbul) ignore\b|^\/\s*<reference\s|^\*\s*@type\s*\{|[#@]__(?:PURE|NO_SIDE_EFFECTS)__/u;
const exported = new Set<string>([
  'ExportAllDeclaration',
  'ExportDefaultDeclaration',
  'ExportNamedDeclaration',
] satisfies NodeType[]);
const declarations = new Set<string>([
  ...exported,
  ...([
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
  ] satisfies NodeType[]),
]);

function declarationAfter(sourceCode: TSESLint.SourceCode, comment: TSESTree.Comment) {
  const token = sourceCode.getTokenAfter(comment);
  if (!token) {
    return undefined;
  }
  let node = sourceCode.getNodeByRangeIndex(token.range[0]);
  while (
    node &&
    node.parent &&
    node.parent.type !== AST_NODE_TYPES.Program &&
    node.parent.range[0] === node.range[0]
  ) {
    node = node.parent;
  }
  return node && declarations.has(node.type) ? node : undefined;
}

const bodies = new Set<string>([
  'ArrowFunctionExpression',
  'BlockStatement',
  'FunctionDeclaration',
  'FunctionExpression',
  'StaticBlock',
] satisfies NodeType[]);

function isPublic(node: TSESTree.Node) {
  if (
    ('accessibility' in node && (node.accessibility === 'private' || node.accessibility === 'protected')) ||
    ('key' in node && node.key?.type === AST_NODE_TYPES.PrivateIdentifier)
  ) {
    return false;
  }
  for (let ancestor: TSESTree.Node | undefined = node; ancestor; ancestor = ancestor.parent) {
    if (exported.has(ancestor.type)) {
      return true;
    }
    if (ancestor !== node && bodies.has(ancestor.type)) {
      return false;
    }
  }
  return false;
}

function documentsPublicApi(sourceCode: TSESLint.SourceCode, comment: TSESTree.Comment) {
  if (comment.type !== AST_TOKEN_TYPES.Block || !comment.value.startsWith('*')) {
    return false;
  }
  const node = declarationAfter(sourceCode, comment);
  return node !== undefined && isPublic(node);
}

function adjacent(sourceCode: TSESLint.SourceCode, earlier: TSESTree.Comment, later: TSESTree.Comment) {
  const between = sourceCode.text.slice(earlier.range[1], later.range[0]);
  return /^[^\S\n]*\n?[^\S\n]*$/u.test(between);
}

function isShebang(comment: { readonly type: string }) {
  return comment.type === 'Shebang';
}

const rule: TSESLint.RuleModule<'comment', Options> = {
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
    const publicApiDocs = context.options[0]?.publicApiDocs === true;
    return {
      Program() {
        const comments = sourceCode.getAllComments().filter((comment) => !isShebang(comment));
        const proven = new Array<boolean>(comments.length).fill(false);
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
          context.report({ loc: comment.loc, messageId: 'comment' });
        });
      },
    };
  },
};

export default rule;
