// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const spawnSync = require('child_process').spawnSync;
const fs = require('fs');
const path = require('path');
const asObject = require('./json.cjs').asObject;
const parseJson = require('./json.cjs').parseJson;

const repository = path.resolve(__dirname, '..', '..');
const tsc = path.join(repository, 'node_modules', '@typescript', 'native', 'bin', 'tsc');

const formats = [
  { name: 'ES modules', module: 'esnext', js: '.mjs', dts: '.d.mts', verbatimModuleSyntax: 'true' },
  { name: 'CommonJS', module: 'commonjs', js: '.js', dts: '.d.ts', verbatimModuleSyntax: 'false' },
];

/** @type {(message: string, status?: number) => never} */
const fail = (message, status = 1) => {
  console.error(message);
  process.exit(status);
};

/** @type {(args: string[]) => import('child_process').SpawnSyncReturns<string>} */
const runTsc = (args) => {
  const result = spawnSync(process.execPath, [tsc, ...args], { encoding: 'utf8' });
  if (result.error !== undefined) throw result.error;
  return result;
};

/** @type {(config: string) => { outDir: string; rootDir: string }} */
const readLayout = (config) => {
  const result = runTsc(['--project', config, '--showConfig']);
  if (result.status !== 0) {
    process.stderr.write(result.stdout + result.stderr);
    fail(`TypeScript could not read ${config}. Fix the errors above.`);
  }
  const options = asObject(asObject(parseJson(result.stdout))?.['compilerOptions']);
  const outDir = options?.['outDir'];
  const rootDir = options?.['rootDir'];
  if (typeof outDir !== 'string' || outDir === '' || typeof rootDir !== 'string' || rootDir === '') {
    fail(`${config} needs outDir and rootDir. Add both.`);
  }
  return {
    outDir: path.resolve(path.dirname(config), outDir),
    rootDir: path.resolve(path.dirname(config), rootDir),
  };
};

/** @type {(outDir: string, format: (typeof formats)[number]) => string} */
const helpersFileOf = (outDir, format) => path.join(outDir, 'internal', `tslib${format.js}`);

/** @type {(file: string) => boolean} */
const isFile = (file) => fs.statSync(file, { throwIfNoEntry: false })?.isFile() ?? false;

/** @type {(file: string) => boolean} */
const isDirectory = (file) => fs.statSync(file, { throwIfNoEntry: false })?.isDirectory() ?? false;

/** @type {(specifier: string, extension: string, sourceDirectory: string) => string | undefined} */
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

/** @type {(from: string, to: string) => string} */
const relativeSpecifier = (from, to) => {
  const relative = path.relative(from, to).split(path.sep).join('/');
  return relative.startsWith('.') ? relative : `./${relative}`;
};

const specifierPatterns = [
  /(\brequire\()(['"])([^'"\n]+)\2(?=\))/g,
  /(\bimport\()(['"])([^'"\n]+)\2(?=\))/g,
  /(\bfrom )(['"])([^'"\n]+)\2(?=;)/g,
  /(^\s*import )(['"])([^'"\n]+)\2(?=;)/g,
];

/** @type {(line: string, column: number) => boolean} */
const insideString = (line, column) => {
  /** @type {string | undefined} */
  let quote;
  for (let index = 0; index < column; index++) {
    const char = line[index];
    if (quote === undefined) {
      if (char === '"' || char === "'" || char === '`') quote = char;
    } else if (char === '\\') {
      index++;
    } else if (char === quote) {
      quote = undefined;
    }
  }
  return quote !== undefined;
};

/** @type {(text: string, rewrite: (specifier: string) => string | undefined) => { text: string; edits: Map<number, Array<{ column: number; length: number; delta: number }>> }} */
const rewriteSpecifiers = (text, rewrite) => {
  /** @type {Map<number, Array<{ column: number; length: number; delta: number }>>} */
  const edits = new Map();
  const lines = text.split('\n').map((line, index) => {
    const matches = specifierPatterns
      .flatMap((pattern) => [...line.matchAll(pattern)])
      .map((match) => ({
        column: match.index + (match[1] ?? '').length,
        literal: match[0].slice((match[1] ?? '').length),
        specifier: match[3] ?? '',
      }))
      .sort((a, b) => a.column - b.column);
    /** @type {Array<{ column: number; length: number; delta: number }>} */
    const lineEdits = [];
    let output = '';
    let cursor = 0;
    for (const { column, literal, specifier } of matches) {
      const next = column >= cursor && !insideString(line, column) ? rewrite(specifier) : undefined;
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

/** @type {(segment: string) => number[]} */
const decodeSegment = (segment) => {
  /** @type {number[]} */
  const values = [];
  let value = 0;
  let shift = 0;
  for (const char of segment) {
    const digit = base64.indexOf(char);
    if (digit < 0) throw new Error(`A source map holds the invalid segment ${segment}.`);
    value += (digit & 31) << shift;
    if ((digit & 32) !== 0) {
      shift += 5;
    } else {
      values.push((value & 1) !== 0 ? -(value >>> 1) : value >>> 1);
      value = 0;
      shift = 0;
    }
  }
  return values;
};

/** @type {(value: number) => string} */
const encodeValue = (value) => {
  let rest = value < 0 ? (-value << 1) | 1 : value << 1;
  let output = '';
  do {
    const digit = rest & 31;
    rest >>>= 5;
    output += base64.charAt(rest > 0 ? digit | 32 : digit);
  } while (rest > 0);
  return output;
};

/** @type {(mappings: string, edits: Map<number, Array<{ column: number; length: number; delta: number }>>) => string} */
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

/** @type {(text: string) => Map<string, string>} */
const readHelperDeclarations = (text) => {
  /** @type {Map<string, string[]>} */
  const declarations = new Map();
  /** @type {string[] | undefined} */
  let current;
  for (const line of text.split('\n')) {
    const start = /^(?:export )?(?:function|var) ([\w$]+)/.exec(line);
    const name = start?.[1];
    if (name !== undefined && name !== '') {
      current = [line.replace(/^export /, '')];
      declarations.set(name, current);
    } else if (line === '' || /^[\s}]/.test(line)) {
      current?.push(line);
    } else {
      current = undefined;
    }
  }
  return new Map([...declarations].map(([name, lines]) => [name, lines.join('\n').trimEnd()]));
};

/** @type {(names: Set<string>, format: (typeof formats)[number]) => string} */
const buildHelpers = (names, format) => {
  const tslibFile = require.resolve('tslib/tslib.es6.mjs', { paths: [repository] });
  const declarations = readHelperDeclarations(fs.readFileSync(tslibFile, 'utf8'));
  /** @type {Set<string>} */
  const needed = new Set();
  /** @type {(name: string) => void} */
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

/** @type {(text: string) => string[]} */
const helpersUsed = (text) => {
  const names = [...text.matchAll(/^import \{([^}]*)\} from "tslib";$/gm)].flatMap((match) =>
    (match[1] ?? '').split(',').map((name) => name.trim()),
  );
  const bindings = new Set(
    [...text.matchAll(/\b(?:const|var) ([\w$]+) = require\("tslib"\);/g)].map((match) => match[1]),
  );
  for (const [, binding, name] of text.matchAll(/(?<![\w$.])([\w$]+)\.(__[\w$]+)/g)) {
    if (bindings.has(binding) && name !== undefined && name !== '') names.push(name);
  }
  return names.filter(Boolean);
};

/** @type {(file: string, layout: { outDir: string; rootDir: string }, format: (typeof formats)[number]) => string[]} */
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
    const map = asObject(parseJson(fs.readFileSync(mapFile, 'utf8')));
    const mappings = map?.['mappings'];
    if (map === undefined || typeof mappings !== 'string')
      fail(`${mapFile} has no mappings. Check the TypeScript build.`);
    map['file'] = path.basename(target);
    map['mappings'] = shiftMappings(mappings, edits);
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

/** @type {(config: string, layout: { outDir: string; rootDir: string }, format: (typeof formats)[number]) => void} */
const compileFormat = (config, layout, format) => {
  const result = runTsc([
    '--project',
    config,
    '--module',
    format.module,
    '--verbatimModuleSyntax',
    format.verbatimModuleSyntax,
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
