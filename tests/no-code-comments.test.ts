// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { RuleTester } from '@typescript-eslint/rule-tester';
import tseslint from 'typescript-eslint';
import rule from '../scripts/utils/no-code-comments';

const tester = new RuleTester({ languageOptions: { parser: tseslint.parser } });
const comment = [{ messageId: 'comment' }] as const;
const publicApiDocs = [{ publicApiDocs: true }] as const;

tester.run('no-code-comments', rule, {
  valid: [
    '// SPDX-FileCopyrightText: 2026 Xquik contributors\n//\n// SPDX-License-Identifier: Apache-2.0\nconst a = 1;',
    '// Node keeps the socket open.\n// https://nodejs.org/api/http.html#agentkeepalive\nconst a = 1;',
    '// eslint-disable-next-line no-console\nconsole.log(1);',
    '// @ts-ignore\nconst a: number = "1";',
    '/// <reference types="node" />',
    'const a = /* #__PURE__ */ make();',
    '/** @type {number} */\nconst a = 1;',
    '#!/usr/bin/env node\nconst a = 1;',
    { code: '/** Searches tweets. */\nexport function search(): void {}', options: publicApiDocs },
    { code: 'export interface Params {\n  /** Tweet ID. */\n  id: string;\n}', options: publicApiDocs },
    { code: 'export class Client {\n  /** Lists tweets. */\n  list(): void {}\n}', options: publicApiDocs },
    { code: "/** @deprecated Use ./core/error. */\nexport * from './core/error';", options: publicApiDocs },
  ],
  invalid: [
    { code: '// Explains the next line.\nconst a = 1;', errors: comment },
    { code: 'const a = 1; // says what a is', errors: comment },
    { code: 'const a = add(/* first */ 1, 2);', errors: comment },
    {
      code: '// First line.\n// Second line, still no proof.\nconst a = 1;',
      errors: [...comment, ...comment],
    },
    { code: '// Unrelated note.\n\n// https://example.com/doc\nconst a = 1;', errors: comment },
    { code: '/** Searches tweets. */\nexport function search(): void {}', errors: comment },
    { code: '/** Internal helper. */\nfunction helper(): void {}', options: publicApiDocs, errors: comment },
    {
      code: 'export class Client {\n  /** Hidden. */\n  private secret(): void {}\n}',
      options: publicApiDocs,
      errors: comment,
    },
    {
      code: 'export function search(): void {\n  /** Names a local. */\n  const id = 1;\n}',
      options: publicApiDocs,
      errors: comment,
    },
    {
      code: 'export class Client {\n  /** A subclass hook. */\n  protected prepare(): void {}\n}',
      options: publicApiDocs,
      errors: comment,
    },
    {
      code: 'export function search(): void {\n  /** Narrates the body. */\n  run();\n}',
      options: publicApiDocs,
      errors: comment,
    },
  ],
});
