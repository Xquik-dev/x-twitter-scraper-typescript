// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// @ts-check
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-plugin-prettier';
import noCodeComments from './scripts/utils/no-code-comments.cjs';

export default tseslint.config(
  {
    ignores: ['dist/**'],
  },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { sourceType: 'module' },
    },
    files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.js', '**/*.mjs', '**/*.cjs'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
      prettier,
      xquik: { rules: { 'no-code-comments': noCodeComments } },
    },
    rules: {
      'no-unused-vars': 'off',
      'prettier/prettier': 'error',
      'xquik/no-code-comments': 'error',
      'unused-imports/no-unused-imports': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^x-twitter-scraper(/.*)?',
              message: 'Use a relative import, not a package import.',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'src/**',
      'src/internal/request-options.ts',
      'src/internal/to-file.ts',
      'src/internal/uploads.ts',
    ],
    ignores: ['src/internal/!(request-options|to-file|uploads).ts', 'src/internal/*/**'],
    rules: {
      'xquik/no-code-comments': ['error', { publicApiDocs: true }],
    },
  },
  {
    files: ['tests/**', 'examples/**'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
);
