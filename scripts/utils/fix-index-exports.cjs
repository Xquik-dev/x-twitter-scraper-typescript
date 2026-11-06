// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');

const distPath = process.env['DIST_PATH'];
const indexJs =
  distPath !== undefined && distPath !== '' ?
    path.resolve(distPath, 'index.js')
  : path.resolve(__dirname, '..', '..', 'dist', 'index.js');

const before = fs.readFileSync(indexJs, 'utf8');
const after = before.replace(
  /^(\s*Object\.defineProperty\s*\(exports,\s*["']__esModule["'].+)$/m,
  `exports = module.exports = function (...args) {
    return new exports.default(...args)
  }
  $1`.replace(/^ {2}/gm, ''),
);
fs.writeFileSync(indexJs, after, 'utf8');
