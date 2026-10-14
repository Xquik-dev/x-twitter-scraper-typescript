// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';

const repository = resolve(__dirname, '..');
const script = join(repository, 'scripts', 'utils', 'compile-formats.cjs');

const sources: Record<string, string> = {
  'index.ts': [
    "import * as sub from './sub';",
    "import { other } from './other.js';",
    "export * from './value';",
    'export { sub, other };',
    'export class Counter {',
    '  #count = 0;',
    '  increment(): number {',
    '    return ++this.#count;',
    '  }',
    '}',
    "export const load = (): Promise<number> => import('./value').then((m) => m.value);",
    '',
  ].join('\n'),
  'value.ts': 'export const value = 1;\n',
  'other.ts': 'export const other = 2;\n',
  'sub/index.ts': 'export const inner = 3;\n',
};

const config = {
  include: ['dist/src'],
  exclude: [],
  compilerOptions: {
    target: 'es2020',
    module: 'commonjs',
    moduleResolution: 'bundler',
    strict: true,
    types: [],
    rootDir: './dist/src',
    outDir: 'dist',
    declaration: true,
    declarationMap: true,
    sourceMap: true,
  },
};

type Build = { status: number | null; output: string; files: string[]; read: (file: string) => string };

const build = (extraSources: Record<string, string> = {}): Build & { root: string } => {
  const root = mkdtempSync(join(tmpdir(), 'compile-formats-'));
  for (const [file, text] of Object.entries({ ...sources, ...extraSources })) {
    mkdirSync(join(root, 'dist', 'src', file, '..'), { recursive: true });
    writeFileSync(join(root, 'dist', 'src', file), text);
  }
  writeFileSync(join(root, 'tsconfig.build.json'), JSON.stringify(config));
  symlinkSync(join(repository, 'node_modules'), join(root, 'node_modules'), 'junction');
  const result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' });
  const list = (directory: string): string[] =>
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory() ?
        list(join(directory, entry.name))
      : [relative(join(root, 'dist'), join(directory, entry.name))],
    );
  return {
    root,
    status: result.status,
    output: result.stdout + result.stderr,
    files: list(join(root, 'dist'))
      .filter((file) => !file.startsWith('src/'))
      .sort(),
    read: (file) => readFileSync(join(root, 'dist', file), 'utf8'),
  };
};

const run = (root: string, type: 'commonjs' | 'module', body: string) =>
  spawnSync(process.execPath, ['--input-type', type, '--eval', `(async () => {\n${body}\n})();`], {
    cwd: join(root, 'dist'),
    encoding: 'utf8',
  });

const decodeMappings = (mappings: string): number[][][] => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const state = [0, 0, 0, 0, 0];
  return mappings.split(';').map((line) => {
    state[0] = 0;
    return line
      .split(',')
      .filter(Boolean)
      .map((segment) => {
        const values: number[] = [];
        let value = 0;
        let shift = 0;
        for (const char of segment) {
          const digit = alphabet.indexOf(char);
          value += (digit & 31) << shift;
          if (digit & 32) {
            shift += 5;
          } else {
            values.push(value & 1 ? -(value >>> 1) : value >>> 1);
            value = 0;
            shift = 0;
          }
        }
        return values.map((relativeValue, index) => (state[index] = (state[index] ?? 0) + relativeValue));
      });
  });
};

const originalPosition = (map: { mappings: string }, line: number, column: number) => {
  const segments = decodeMappings(map.mappings)[line] ?? [];
  const segment = segments.filter(([generated]) => (generated ?? 0) <= column).pop();
  if (!segment) return undefined;
  const [generated = 0, , sourceLine, sourceColumn = 0] = segment;
  return { line: sourceLine, column: sourceColumn + column - generated };
};

describe('scripts/utils/compile-formats.cjs', () => {
  let built: ReturnType<typeof build>;

  beforeAll(() => {
    built = build();
  });

  afterAll(() => {
    rmSync(built.root, { recursive: true, force: true });
  });

  it('writes CommonJS and ES module files with their declarations, maps and 1 helpers file each', () => {
    expect(built.output).not.toContain('error');
    expect(built.status).toBe(0);
    const outputs = ['index', 'other', 'sub/index', 'value'].flatMap((name) =>
      ['.js', '.mjs', '.d.ts', '.d.mts'].flatMap((extension) => [
        `${name}${extension}`,
        `${name}${extension}.map`,
      ]),
    );
    expect(built.files).toEqual([...outputs, 'internal/tslib.js', 'internal/tslib.mjs'].sort());
  });

  it('gives each relative import the extension of its format and resolves folders to their index', () => {
    expect(built.read('index.js')).toContain('const sub = tslib_1.__importStar(require("./sub/index.js"));');
    expect(built.read('index.js')).toContain('const other_js_1 = require("./other.js");');
    expect(built.read('index.js')).toContain('tslib_1.__exportStar(require("./value.js"), exports);');
    expect(built.read('index.js')).toContain('const tslib_1 = require("./internal/tslib.js");');
    expect(built.read('index.js')).toContain(
      'Promise.resolve().then(() => tslib_1.__importStar(require("./value.js")))',
    );
    expect(built.read('index.mjs')).toContain('import * as sub from "./sub/index.mjs";');
    expect(built.read('index.mjs')).toContain('import { other } from "./other.mjs";');
    expect(built.read('index.mjs')).toContain('export * from "./value.mjs";');
    expect(built.read('index.mjs')).toContain('import("./value.mjs")');
    expect(built.read('index.mjs')).toContain('from "./internal/tslib.mjs";');
    expect(built.read('index.d.ts')).toContain('import * as sub from "./sub/index.js";');
    expect(built.read('index.d.ts')).toContain('export * from "./value.js";');
    expect(built.read('index.d.mts')).toContain('import * as sub from "./sub/index.mjs";');
    expect(built.read('index.d.mts')).toContain('import { other } from "./other.mjs";');
    expect(built.read('index.d.mts')).toContain('export * from "./value.mjs";');
  });

  it.each([
    ['commonjs' as const, "require('./entry.js')", 'require("./setup.js");'],
    ['module' as const, "await import('./entry.mjs')", 'import "./setup.mjs";'],
  ])('gives a side-effect import the extension of its format, so it runs as %s', (type, load, line) => {
    const withSetup = build({
      'entry.ts': "import './setup';\nexport const ready = (globalThis as { ready?: boolean }).ready;\n",
      'setup.ts': '(globalThis as { ready?: boolean }).ready = true;\nexport {};\n',
    });
    try {
      expect(withSetup.status).toBe(0);
      expect(withSetup.read(type === 'module' ? 'entry.mjs' : 'entry.js')).toContain(line);
      const result = run(withSetup.root, type, `const m = ${load};\nconsole.log(m.ready);`);
      expect(result.stderr).toBe('');
      expect(result.stdout).toBe('true\n');
    } finally {
      rmSync(withSetup.root, { recursive: true, force: true });
    }
  });

  it.each([
    ['commonjs' as const, "require('./text.js')", 'text.d.ts'],
    ['module' as const, "await import('./text.mjs')", 'text.d.mts'],
  ])('leaves import-like text inside a string alone, so it runs as %s', (type, load, declarations) => {
    const text = "import a from './value'; require('./value'); import('./value')";
    const withText = build({ 'text.ts': `export const text = ${JSON.stringify(text)};\n` });
    try {
      expect(withText.status).toBe(0);
      expect(withText.read(declarations)).toContain(JSON.stringify(text));
      const result = run(withText.root, type, `const m = ${load};\nconsole.log(m.text);`);
      expect(result.stderr).toBe('');
      expect(result.stdout).toBe(`${text}\n`);
    } finally {
      rmSync(withText.root, { recursive: true, force: true });
    }
  });

  it.each([
    ['commonjs' as const, "require('./index.js')"],
    ['module' as const, "await import('./index.mjs')"],
  ])('runs as %s with the shared helpers', (type, load) => {
    const result = run(
      built.root,
      type,
      `const m = ${load};
      const counter = new m.Counter();
      counter.increment();
      console.log(JSON.stringify([m.value, m.other, m.sub.inner, counter.increment(), await m.load()]));`,
    );

    expect(result.stderr).toBe('');
    expect(result.stdout).toBe('[1,2,3,2,1]\n');
  });

  it.each([
    [
      'commonjs' as const,
      "require('./internal/tslib.js')",
      ['__classPrivateFieldGet', '__classPrivateFieldSet', '__exportStar', '__importStar'],
    ],
    [
      'module' as const,
      "await import('./internal/tslib.mjs')",
      ['__classPrivateFieldGet', '__classPrivateFieldSet'],
    ],
  ])('the %s helpers file exports only the helpers that format calls', (type, load, expected) => {
    const result = run(
      built.root,
      type,
      `const helpers = ${load};
      console.log(JSON.stringify(Object.keys(helpers).filter((name) => name !== '__esModule').sort()));`,
    );

    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual(expected);
  });

  it.each([
    ['index.js', 'index.js.map', 'index.js'],
    ['index.mjs', 'index.mjs.map', 'index.mjs'],
    ['index.d.ts', 'index.d.ts.map', 'index.d.ts'],
    ['index.d.mts', 'index.d.mts.map', 'index.d.mts'],
  ])('%s links its own map, which names the file and the source', (file, mapFile, mapped) => {
    expect(built.read(file).split('\n').pop()).toBe(`//# sourceMappingURL=${mapFile}`);
    const map = JSON.parse(built.read(mapFile));
    expect(map.file).toBe(mapped);
    expect(map.sources).toEqual(['src/index.ts']);
  });

  it('keeps map positions right after a rewritten import on the same line', () => {
    const source = sources['index.ts']!.split('\n');
    const sourceLine = source.findIndex((line) => line.includes('m.value'));
    const output = built.read('index.mjs').split('\n');
    const line = output.findIndex((text) => text.includes('import("./value.mjs")'));

    expect(
      originalPosition(JSON.parse(built.read('index.mjs.map')), line, output[line]!.indexOf('m.value')),
    ).toEqual({
      line: sourceLine,
      column: source[sourceLine]!.indexOf('m.value'),
    });
  });

  it('gives a rewritten specifier no map position of its own, as the old build tool did', () => {
    const output = built.read('index.mjs').split('\n');
    const line = output.findIndex((text) => text.includes('import("./value.mjs")'));
    const start = output[line]!.indexOf('"./value.mjs"');
    const columns = (decodeMappings(JSON.parse(built.read('index.mjs.map')).mappings)[line] ?? []).map(
      ([column]) => column ?? 0,
    );

    expect(columns.filter((column) => column >= start && column <= start + '"./value.mjs"'.length)).toEqual(
      [],
    );
    expect(columns.length).toBeGreaterThan(0);
  });

  it('fails the build on a type error', () => {
    const broken = build({ 'broken.ts': "export const broken: number = 'text';\n" });
    try {
      expect(broken.status).not.toBe(0);
      expect(broken.output).toContain('broken.ts');
      expect(broken.output).toContain('TS2322');
    } finally {
      rmSync(broken.root, { recursive: true, force: true });
    }
  });
});
