// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const proof = /https:\/\/|SPDX-/u;
const directive =
  /^\s*(?:eslint-disable(?:-next-line|-line)?|eslint-enable|eslint|globals?|exported)(?:\s|$)|^\s*@ts-(?:check|nocheck|expect-error|ignore)\b|^\s*prettier-ignore\b|^\s*(?:c8|v8|istanbul) ignore\b|^\/\s*<reference\s|^\*\s*@type\s*\{|[#@]__(?:PURE|NO_SIDE_EFFECTS)__/u;
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

function declarationAfter(sourceCode, comment) {
  const token = sourceCode.getTokenAfter(comment);
  if (!token) {
    return undefined;
  }
  let node = sourceCode.getNodeByRangeIndex(token.range[0]);
  while (node && node.parent && node.parent.type !== 'Program' && node.parent.range[0] === node.range[0]) {
    node = node.parent;
  }
  return node && declarations.has(node.type) ? node : undefined;
}

function isPublic(node) {
  if (node.accessibility === 'private' || node.key?.type === 'PrivateIdentifier') {
    return false;
  }
  for (let ancestor = node; ancestor; ancestor = ancestor.parent) {
    if (exported.has(ancestor.type)) {
      return true;
    }
  }
  return false;
}

function documentsPublicApi(sourceCode, comment) {
  if (comment.type !== 'Block' || !comment.value.startsWith('*')) {
    return false;
  }
  const node = declarationAfter(sourceCode, comment);
  return node !== undefined && isPublic(node);
}

function adjacent(sourceCode, earlier, later) {
  const between = sourceCode.text.slice(earlier.range[1], later.range[0]);
  return /^[^\S\n]*\n?[^\S\n]*$/u.test(between);
}

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
    const publicApiDocs = context.options[0]?.publicApiDocs === true;
    return {
      Program() {
        const comments = sourceCode.getAllComments().filter((comment) => comment.type !== 'Shebang');
        const proven = new Array(comments.length).fill(false);
        for (let index = comments.length - 1; index >= 0; index -= 1) {
          const comment = comments[index];
          const next = comments[index + 1];
          proven[index] =
            proof.test(comment.value) ||
            (next !== undefined && proven[index + 1] && adjacent(sourceCode, comment, next));
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
