// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const asObject = require('./json.cjs').asObject;

const distDir =
  process.env['DIST_PATH'] ?
    path.resolve(process.env['DIST_PATH'])
  : path.resolve(__dirname, '..', '..', 'dist');

/** @type {(dir: string) => AsyncGenerator<string>} */
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

  /** @type {Record<string, import('./types').ExportConditions>} */
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
      newExports[subpath + '/*.mjs'] = {
        default: subpath + '/*.mjs',
      };
      newExports[subpath + '/*.js'] = {
        default: subpath + '/*.js',
      };
      newExports[subpath + '/*'] = {
        import: subpath + '/*.mjs',
        require: subpath + '/*.js',
      };
    } else if (entry.isFile() && /\.[cm]?js$/.test(entry.name)) {
      const { name, ext } = path.parse(entry.name);
      const subpathWithoutExt = './' + name;
      const subpath = './' + entry.name;
      const conditions = (newExports[subpathWithoutExt] ||= { import: undefined, require: undefined });
      const isModule = ext[1] === 'm';
      if (isModule) {
        conditions.import = subpath;
      } else {
        conditions.require = subpath;
      }
      newExports[subpath] = {
        default: subpath,
      };
    }
  }
  /** @type {import('./types').JsonValue} */
  const distPackage = JSON.parse(await fs.promises.readFile('dist/package.json', 'utf-8'));
  await fs.promises.writeFile(
    'dist/package.json',
    JSON.stringify(
      {
        ...asObject(distPackage),
        exports: newExports,
      },
      null,
      2,
    ),
  );
}
postprocess();
