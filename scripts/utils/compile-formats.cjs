// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

// @ts-check

// Compiles the package with TypeScript 7 once per module format, then links the output the way the
// package has always shipped.
//
// CommonJS gets .js and .d.ts files, and ES modules get .mjs and .d.mts files. Each relative import
// names a file with its format's extension, and a folder import names the folder's index file. Each
// format imports TypeScript's helpers from 1 file, internal/tslib.js or internal/tslib.mjs, which this
// script builds from the pinned tslib package. Source maps keep pointing at the right files and columns.
//
// Pass a project folder to compile it instead of this repository. Its tsconfig.build.json compiles
// rootDir into outDir.

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repository = path.resolve(__dirname, '..', '..');
const tsc = path.join(repository, 'node_modules', '@typescript', 'native', 'bin', 'tsc');

// ES modules compile first. Their files get new names before CommonJS takes TypeScript's default names.
const formats = [
  { name: 'ES modules', module: 'esnext', js: '.mjs', dts: '.d.mts' },
  { name: 'CommonJS', module: 'commonjs', js: '.js', dts: '.d.ts' },
];

/**
 * @typedef {{ name: string, module: string, js: string, dts: string }} Format
 * @typedef {{ column: number, length: number, delta: number }} Edit
 */

/**
 * Prints what to fix and stops the build.
 * @param {string} message
 * @param {number} [status]
 * @returns {never}
 */
const fail = (message, status = 1) => {
  console.error(message);
  process.exit(status);
};

/** @param {string[]} args */
const runTsc = (args) => {
  const result = spawnSync(process.execPath, [tsc, ...args], { encoding: 'utf8' });
  if (result.error) throw result.error;
  return result;
};

/** @param {string} config */
const readLayout = (config) => {
  const result = runTsc(['--project', config, '--showConfig']);
  if (result.status !== 0) {
    process.stderr.write(result.stdout + result.stderr);
    fail(`TypeScript could not read ${config}. Fix the errors above.`);
  }
  const { outDir, rootDir } = JSON.parse(result.stdout).compilerOptions;
  if (!outDir || !rootDir) fail(`${config} needs outDir and rootDir. Add both.`);
  return {
    outDir: path.resolve(path.dirname(config), outDir),
    rootDir: path.resolve(path.dirname(config), rootDir),
  };
};

/**
 * The shared helpers file of a format.
 * @param {string} outDir
 * @param {Format} format
 */
const helpersFileOf = (outDir, format) => path.join(outDir, 'internal', `tslib${format.js}`);

/** @param {string} file */
const isFile = (file) => fs.statSync(file, { throwIfNoEntry: false })?.isFile() ?? false;

/** @param {string} file */
const isDirectory = (file) => fs.statSync(file, { throwIfNoEntry: false })?.isDirectory() ?? false;

/**
 * Returns the specifier a relative import needs in the given format, or undefined to keep it.
 * @param {string} specifier
 * @param {string} extension
 * @param {string} sourceDirectory the folder of the source file that holds the import
 */
const linkSpecifier = (specifier, extension, sourceDirectory) => {
  if (!specifier.startsWith('./') && !specifier.startsWith('../')) return undefined;
  const current = path.extname(specifier);
  if (current === '.mjs' || current === '.cjs' || current === '.json') return undefined;
  const base = current === '.js' ? specifier.slice(0, -current.length) : specifier;
  const resolved = (/** @type {string} */ file) => path.resolve(sourceDirectory, file);
  if (
    !isFile(resolved(`${base}.ts`)) &&
    !isFile(resolved(`${base}.js`)) &&
    isDirectory(resolved(specifier))
  ) {
    return `${specifier}/index${extension}`;
  }
  return `${base}${extension}`;
};

/**
 * Returns the relative import specifier that leads from a folder to a file.
 * @param {string} from
 * @param {string} to
 */
const relativeSpecifier = (from, to) => {
  const relative = path.relative(from, to).split(path.sep).join('/');
  return relative.startsWith('.') ? relative : `./${relative}`;
};

// The places where TypeScript writes a module specifier in JavaScript and declaration output.
const specifierPatterns = [
  /(\brequire\()(")([^"\n]+)"(?=\))/g,
  /(\bimport\()(['"])([^'"\n]+)\2(?=\))/g,
  /(\bfrom )(['"])([^'"\n]+)\2(?=;)/g,
];

/**
 * Rewrites each specifier that `rewrite` changes and records where each line changed. A new specifier
 * is written in double quotes, as the old build tool wrote it.
 * @param {string} text
 * @param {(specifier: string) => string | undefined} rewrite
 * @returns {{ text: string, edits: Map<number, Edit[]> }}
 */
const rewriteSpecifiers = (text, rewrite) => {
  /** @type {Map<number, Edit[]>} */
  const edits = new Map();
  const lines = text.split('\n').map((line, index) => {
    const matches = specifierPatterns
      .flatMap((pattern) => [...line.matchAll(pattern)])
      .map((match) => ({
        column: (match.index ?? 0) + (match[1] ?? '').length,
        literal: match[0].slice((match[1] ?? '').length),
        specifier: match[3] ?? '',
      }))
      .sort((a, b) => a.column - b.column);
    /** @type {Edit[]} */
    const lineEdits = [];
    let output = '';
    let cursor = 0;
    for (const { column, literal, specifier } of matches) {
      const next = column >= cursor ? rewrite(specifier) : undefined;
      if (next === undefined) continue;
      const replacement = JSON.stringify(next);
      output += line.slice(cursor, column) + replacement;
      cursor = column + literal.length;
      lineEdits.push({ column, length: literal.length, delta: replacement.length - literal.length });
    }
    if (lineEdits.length > 0) edits.set(index, lineEdits);
    return output + line.slice(cursor);
  });
  return { text: lines.join('\n'), edits };
};

const base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** @param {string} segment */
const decodeSegment = (segment) => {
  /** @type {number[]} */
  const values = [];
  let value = 0;
  let shift = 0;
  for (const char of segment) {
    const digit = base64.indexOf(char);
    if (digit < 0) throw new Error(`A source map holds the invalid segment ${segment}.`);
    value += (digit & 31) << shift;
    if (digit & 32) {
      shift += 5;
    } else {
      values.push(value & 1 ? -(value >>> 1) : value >>> 1);
      value = 0;
      shift = 0;
    }
  }
  return values;
};

/** @param {number} value */
const encodeValue = (value) => {
  let rest = value < 0 ? (-value << 1) | 1 : value << 1;
  let output = '';
  do {
    const digit = rest & 31;
    rest >>>= 5;
    output += base64[rest > 0 ? digit | 32 : digit];
  } while (rest > 0);
  return output;
};

/**
 * Moves mappings on changed lines by the length each specifier gained. A new specifier has no source
 * position, as with the old build tool, so mappings inside it and at its end go away.
 * @param {string} mappings
 * @param {Map<number, Edit[]>} edits
 */
const shiftMappings = (mappings, edits) => {
  if (edits.size === 0) return mappings;
  const decoded = [0, 0, 0, 0, 0];
  const encoded = [0, 0, 0, 0, 0];
  return mappings
    .split(';')
    .map((line, index) => {
      decoded[0] = 0;
      encoded[0] = 0;
      const lineEdits = edits.get(index) ?? [];
      /** @type {string[]} */
      const segments = [];
      for (const text of line === '' ? [] : line.split(',')) {
        const values = decodeSegment(text).map(
          (value, field) => (decoded[field] = (decoded[field] ?? 0) + value),
        );
        const column = values[0] ?? 0;
        if (lineEdits.some((edit) => column >= edit.column && column <= edit.column + edit.length)) continue;
        values[0] = lineEdits.reduce(
          (moved, edit) => (edit.column < column ? moved + edit.delta : moved),
          column,
        );
        segments.push(
          values
            .map((value, field) => {
              const relative = value - (encoded[field] ?? 0);
              encoded[field] = value;
              return encodeValue(relative);
            })
            .join(''),
        );
      }
      return segments.join(',');
    })
    .join(';');
};

/**
 * Splits tslib's ES module into its top-level helper declarations, in file order.
 * @param {string} text
 */
const readHelperDeclarations = (text) => {
  /** @type {Map<string, string[]>} */
  const declarations = new Map();
  /** @type {string[] | undefined} */
  let current;
  for (const line of text.split('\n')) {
    const start = /^(?:export )?(?:function|var) ([\w$]+)/.exec(line);
    if (start?.[1]) {
      current = [line.replace(/^export /, '')];
      declarations.set(start[1], current);
    } else if (line === '' || /^[\s}]/.test(line)) {
      current?.push(line);
    } else {
      current = undefined;
    }
  }
  return new Map([...declarations].map(([name, lines]) => [name, lines.join('\n').trimEnd()]));
};

/**
 * Builds a helpers file that defines the named helpers and the declarations they use.
 * @param {Set<string>} names
 * @param {Format} format
 */
const buildHelpers = (names, format) => {
  const tslibFile = require.resolve('tslib/tslib.es6.mjs', { paths: [repository] });
  const declarations = readHelperDeclarations(fs.readFileSync(tslibFile, 'utf8'));
  /** @type {Set<string>} */
  const needed = new Set();
  /** @param {string} name */
  const add = (name) => {
    if (needed.has(name)) return;
    const code = declarations.get(name);
    if (code === undefined) {
      fail(`${tslibFile} lacks the helper ${name}. Update tslib to the version TypeScript expects.`);
    }
    needed.add(name);
    const identifiers = new Set(code.match(/[\w$]+/g));
    for (const other of declarations.keys()) if (other !== name && identifiers.has(other)) add(other);
  };
  for (const name of names) add(name);
  const ordered = [...declarations.keys()].filter((name) => needed.has(name));
  const exported = ordered.filter((name) => names.has(name));
  const code = ordered.map((name) => declarations.get(name)).join('\n\n');
  if (format.module === 'commonjs') {
    return [
      '"use strict";',
      'Object.defineProperty(exports, "__esModule", { value: true });',
      code,
      exported.map((name) => `exports.${name} = ${name};`).join('\n'),
      '',
    ].join('\n');
  }
  return `${code}\n\nexport { ${exported.join(', ')} };\n`;
};

/**
 * Lists the tslib helpers a compiled JavaScript file imports.
 * @param {string} text
 */
const helpersUsed = (text) => {
  const names = [...text.matchAll(/^import \{([^}]*)\} from "tslib";$/gm)].flatMap((match) =>
    (match[1] ?? '').split(',').map((name) => name.trim()),
  );
  const bindings = new Set(
    [...text.matchAll(/\b(?:const|var) ([\w$]+) = require\("tslib"\);/g)].map((match) => match[1]),
  );
  for (const [, binding, name] of text.matchAll(/(?<![\w$.])([\w$]+)\.(__[\w$]+)/g)) {
    if (bindings.has(binding) && name) names.push(name);
  }
  return names.filter(Boolean);
};

/**
 * Gives 1 emitted file its format's name and links its imports, then does the same for its map.
 * Returns the tslib helpers the file calls.
 * @param {string} file an emitted .js or .d.ts file
 * @param {{ outDir: string, rootDir: string }} layout
 * @param {Format} format
 */
const relinkFile = (file, { outDir, rootDir }, format) => {
  const declaration = file.endsWith('.d.ts');
  const target = file.replace(declaration ? /\.d\.ts$/ : /\.js$/, declaration ? format.dts : format.js);
  const sourceDirectory = path.dirname(path.join(rootDir, path.relative(outDir, file)));
  const helpersFile = helpersFileOf(outDir, format);
  const original = fs.readFileSync(file, 'utf8');
  const { text, edits } = rewriteSpecifiers(original, (specifier) =>
    !declaration && specifier === 'tslib' ?
      relativeSpecifier(path.dirname(file), helpersFile)
    : linkSpecifier(specifier, format.js, sourceDirectory),
  );

  const mapFile = `${file}.map`;
  if (isFile(mapFile)) {
    const map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
    map.file = path.basename(target);
    map.mappings = shiftMappings(map.mappings, edits);
    fs.writeFileSync(`${target}.map`, JSON.stringify(map));
    if (target !== file) fs.rmSync(mapFile);
  }
  fs.writeFileSync(
    target,
    text.replace(/\/\/# sourceMappingURL=[^\n]*$/, `//# sourceMappingURL=${path.basename(target)}.map`),
  );
  if (target !== file) fs.rmSync(file);
  return declaration ? [] : helpersUsed(original);
};

/**
 * @param {string} config
 * @param {{ outDir: string, rootDir: string }} layout
 * @param {Format} format
 */
const compileFormat = (config, layout, format) => {
  const result = runTsc([
    '--project',
    config,
    '--module',
    format.module,
    '--importHelpers',
    '--listEmittedFiles',
  ]);
  const lines = result.stdout.split('\n');
  if (result.status !== 0) {
    process.stderr.write(lines.filter((line) => !line.startsWith('TSFILE: ')).join('\n') + result.stderr);
    fail(`TypeScript could not compile the ${format.name} build. Fix the errors above.`, result.status ?? 1);
  }
  const helpers = new Set(
    lines
      .filter((line) => line.startsWith('TSFILE: ') && /\.(js|d\.ts)$/.test(line.trim()))
      .flatMap((line) => relinkFile(line.slice('TSFILE: '.length).trim(), layout, format)),
  );
  if (helpers.size > 0) {
    const helpersFile = helpersFileOf(layout.outDir, format);
    fs.mkdirSync(path.dirname(helpersFile), { recursive: true });
    fs.writeFileSync(helpersFile, buildHelpers(helpers, format));
  }
};

const main = () => {
  const project = path.resolve(process.argv[2] ?? repository);
  const config = path.join(project, 'tsconfig.build.json');
  const layout = readLayout(config);
  for (const format of formats) compileFormat(config, layout, format);
};

main();
