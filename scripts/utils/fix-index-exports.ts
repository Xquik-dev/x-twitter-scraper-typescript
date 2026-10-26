// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import path from 'node:path';

const indexJs = path.resolve(import.meta.dirname, '..', '..', 'dist', 'index.js');

const before = fs.readFileSync(indexJs, 'utf8');
const after = before.replace(
  /^(\s*Object\.defineProperty\s*\(exports,\s*["']__esModule["'].+)$/m,
  `exports = module.exports = function (...args) {
    return new exports.default(...args)
  }
  $1`.replace(/^  /gm, ''),
);
fs.writeFileSync(indexJs, after, 'utf8');
