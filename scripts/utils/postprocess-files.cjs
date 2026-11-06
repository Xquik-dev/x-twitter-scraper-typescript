// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// @ts-check
const fs = require('fs');
const path = require('path');

const distDir =
  process.env['DIST_PATH'] ?
    path.resolve(process.env['DIST_PATH'])
  : path.resolve(__dirname, '..', '..', 'dist');

async function* walk(dir) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

async function postprocess() {
  for await (const file of walk(distDir)) {
    if (!/(\.d)?[cm]?ts$/.test(file)) continue;

    const code = await fs.promises.readFile(file, 'utf8');

    const transformed = code.replace(
      /^ *\/\/\/ *<reference +(lib="dom"|types="(node|react)").*?\n/gm,
      (match) => ' '.repeat(match.length - 1) + '\n',
    );

    if (transformed !== code) {
      console.error(`wrote ${path.relative(process.cwd(), file)}`);
      await fs.promises.writeFile(file, transformed, 'utf8');
    }
  }

  const newExports = {
    '.': {
      require: {
        types: './index.d.ts',
        default: './index.js',
      },
      types: './index.d.mts',
      default: './index.mjs',
    },
  };
  const nonModuleDirectories = new Set(['assets', 'bin', 'internal', 'skills', 'src']);

  for (const entry of await fs.promises.readdir(distDir, { withFileTypes: true })) {
    if (entry.isDirectory() && !nonModuleDirectories.has(entry.name)) {
      const subpath = './' + entry.name;
      const formats = { import: subpath + '/*.mjs', require: subpath + '/*.js' };
      newExports[subpath + '/*.mjs'] = formats;
      newExports[subpath + '/*.js'] = formats;
      newExports[subpath + '/*'] = formats;
    } else if (entry.isFile() && entry.name.endsWith('.mjs')) {
      const subpath = './' + entry.name.slice(0, -'.mjs'.length);
      const formats = { import: subpath + '.mjs', require: subpath + '.js' };
      newExports[subpath] = formats;
      newExports[subpath + '.mjs'] = formats;
      newExports[subpath + '.js'] = formats;
    }
  }
  await fs.promises.writeFile(
    'dist/package.json',
    JSON.stringify(
      Object.assign(
        /** @type {Record<String, unknown>} */ (
          JSON.parse(await fs.promises.readFile('dist/package.json', 'utf-8'))
        ),
        {
          exports: newExports,
        },
      ),
      null,
      2,
    ),
  );
}
postprocess();
