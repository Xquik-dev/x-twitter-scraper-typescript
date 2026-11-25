// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { leftoverStep, runUntilStarted, waitingStep } from './signal-run';

const script = resolve(__dirname, '..', 'bin', 'release-local');

const release = (variables: Record<string, string>) => {
  const env = { ...process.env, ...variables };
  for (const name of [
    'NPM_KEYCHAIN_SERVICE',
    'NPM_KEYCHAIN_ACCOUNT',
    'COSIGN_PRIVATE_KEY',
    'COSIGN_PASSWORD',
  ]) {
    if (!(name in variables)) delete env[name];
  }
  const result = spawnSync(script, [], { encoding: 'utf8', env });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
};

describe('bin/release-local', () => {
  it.each([
    [
      'NPM_KEYCHAIN_SERVICE',
      {},
      'NPM_KEYCHAIN_SERVICE is unset. Set it to the Keychain service that holds the npm token, then run bin/release-local again.\n',
    ],
    [
      'NPM_KEYCHAIN_SERVICE',
      { NPM_KEYCHAIN_SERVICE: '', NPM_KEYCHAIN_ACCOUNT: 'example-account' },
      'NPM_KEYCHAIN_SERVICE is unset. Set it to the Keychain service that holds the npm token, then run bin/release-local again.\n',
    ],
    [
      'NPM_KEYCHAIN_ACCOUNT',
      { NPM_KEYCHAIN_SERVICE: 'example-service' },
      'NPM_KEYCHAIN_ACCOUNT is unset. Set it to the Keychain account that holds the npm token, then run bin/release-local again.\n',
    ],
    [
      'COSIGN_PRIVATE_KEY',
      { NPM_KEYCHAIN_SERVICE: 'example-service', NPM_KEYCHAIN_ACCOUNT: 'example-account' },
      'COSIGN_PRIVATE_KEY is unset. Set it to the release signing key that matches cosign.pub, then run bin/release-local again.\n',
    ],
    [
      'COSIGN_PASSWORD',
      {
        NPM_KEYCHAIN_SERVICE: 'example-service',
        NPM_KEYCHAIN_ACCOUNT: 'example-account',
        COSIGN_PRIVATE_KEY: 'example-key',
      },
      'COSIGN_PASSWORD is unset. Set it to the password of the release signing key, then run bin/release-local again.\n',
    ],
  ])('stops with 1 line that names %s when it is unset', (_name, variables, message) => {
    expect(release(variables)).toEqual({ status: 1, stdout: '', stderr: message });
  });

  describe('in a copy with fake tools', () => {
    const setUp = (gh: string) => {
      const root = mkdtempSync(join(tmpdir(), 'release-local-'));
      mkdirSync(join(root, 'project', 'bin'), { recursive: true });
      mkdirSync(join(root, 'project', 'scripts'));
      mkdirSync(join(root, 'tools'));
      mkdirSync(join(root, 'tmp'));
      copyFileSync(script, join(root, 'project', 'bin', 'release-local'));
      copyFileSync(
        resolve(__dirname, '..', 'scripts', 'temp-directory.sh'),
        join(root, 'project', 'scripts', 'temp-directory.sh'),
      );
      for (const [tool, content] of [
        ['cosign', '#!/bin/sh\n'],
        ['gh', gh],
        ['npm', '#!/bin/sh\n'],
        ['pnpm', '#!/bin/sh\n'],
        ['security', '#!/bin/sh\n'],
      ] as const) {
        writeFileSync(join(root, 'tools', tool), content);
        chmodSync(join(root, 'tools', tool), 0o755);
      }
      return {
        root,
        temp: join(root, 'tmp'),
        command: join(root, 'project', 'bin', 'release-local'),
        env: {
          ...process.env,
          PATH: `${join(root, 'tools')}${delimiter}${process.env['PATH'] ?? ''}`,
          NPM_KEYCHAIN_SERVICE: 'example-service',
          NPM_KEYCHAIN_ACCOUNT: 'example-account',
          COSIGN_PRIVATE_KEY: 'example-key',
          COSIGN_PASSWORD: 'example-password',
          TMPDIR: join(root, 'tmp'),
        },
      };
    };

    it('removes its temp directory and what its steps left in TMPDIR when a step fails', () => {
      const { root, temp, command, env } = setUp(`${leftoverStep}exit 1\n`);
      try {
        const result = spawnSync(command, [], { encoding: 'utf8', env });

        expect(result.stderr).toBe(
          'gh is signed out. Run gh auth login, then run bin/release-local again.\n',
        );
        expect(result.status).toBe(1);
        expect(readdirSync(temp)).toEqual([]);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });

    it.each([
      ['SIGTERM', 143],
      ['SIGINT', null],
      ['SIGHUP', 129],
    ] as const)('removes its temp directory when %s stops it mid-run', async (signal, code) => {
      const { root, temp, command, env } = setUp(waitingStep);
      try {
        const result = await runUntilStarted(command, [], { env, root, signal });

        expect(result).toEqual({ code, signal: signal === 'SIGINT' ? signal : null });
        expect(readdirSync(temp)).toEqual([]);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });
  });
  describe('in a releasable checkout with fake npm, GitHub and cosign', () => {
    const version = '1.2.3';
    const tag = `v${version}`;
    const packageFile = `x-twitter-scraper-${version}.tgz`;
    const provenanceFile = `${packageFile}.intoto.jsonl`;
    const fakeTools = {
      cosign: `#!/bin/sh
for blob; do :; done
bundle=
previous=
for argument; do
  [ "$previous" = --bundle ] && bundle=$argument
  previous=$argument
done
case "$1" in
  attest-blob) [ "$FAKE_COSIGN_ATTEST" != fails ] && cksum <"$blob" >"$bundle" ;;
  verify-blob-attestation) [ -f "$bundle" ] && [ "$(cksum <"$blob")" = "$(cat "$bundle")" ] ;;
  *) exit 2 ;;
esac
`,
      gh: `#!/bin/sh
case "$1 $2" in
  'auth status') ;;
  'release create')
    shift 3
    state=published
    for argument; do [ "$argument" = --draft ] && state=draft; done
    printf '%s\\n' "$state" >"$FAKE_GITHUB/state"
    for asset; do
      case "$asset" in --*) break ;; esac
      cp "$asset" "$FAKE_GITHUB/assets/"
      [ "$FAKE_GH_UPLOAD" = stops ] && exit 1
    done
    ;;
  'release download')
    directory=
    previous=
    for argument; do
      [ "$previous" = --dir ] && directory=$argument
      previous=$argument
    done
    cp "$FAKE_GITHUB"/assets/* "$directory/"
    if [ "$FAKE_GH_DOWNLOAD" = tampered ]; then printf 'tampered' >>"$directory/${packageFile}"; fi
    ;;
  'release edit')
    for argument; do [ "$argument" = --draft=false ] && printf 'published\\n' >"$FAKE_GITHUB/state"; done
    ;;
  *) exit 2 ;;
esac
`,
      npm: `#!/bin/sh
case "$1" in
  pack)
    destination=
    previous=
    for argument; do
      [ "$previous" = --pack-destination ] && destination=$argument
      previous=$argument
    done
    printf 'package' >"$destination/${packageFile}"
    printf '[{"filename":"${packageFile}"}]\\n'
    ;;
  view) exit 1 ;;
  *) exit 2 ;;
esac
`,
      pnpm: '#!/bin/sh\n',
      security: "#!/bin/sh\nprintf 'example-token\\n'\n",
    };
    const gitEnv = {
      GIT_AUTHOR_NAME: 'Example Maintainer',
      GIT_AUTHOR_EMAIL: 'maintainer@example.com',
      GIT_COMMITTER_NAME: 'Example Maintainer',
      GIT_COMMITTER_EMAIL: 'maintainer@example.com',
      GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_CONFIG_NOSYSTEM: '1',
    };

    const git = (cwd: string, ...args: Array<string>) => {
      const result = spawnSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, ...gitEnv } });
      if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr}`);
      return result.stdout;
    };

    const write = (path: string, content: string, mode = 0o644) => {
      writeFileSync(path, content);
      chmodSync(path, mode);
    };

    const setUp = () => {
      const root = mkdtempSync(join(tmpdir(), 'release-local-'));
      const project = join(root, 'project');
      const origin = join(root, 'origin.git');
      const github = join(root, 'github');
      const registry = join(root, 'registry');
      for (const directory of [
        join(project, 'bin'),
        join(project, 'scripts', 'utils'),
        join(project, 'src'),
        join(root, 'tools'),
        join(root, 'tmp'),
        join(github, 'assets'),
        registry,
      ]) {
        mkdirSync(directory, { recursive: true });
      }
      for (const [tool, content] of Object.entries(fakeTools))
        write(join(root, 'tools', tool), content, 0o755);
      copyFileSync(script, join(project, 'bin', 'release-local'));
      copyFileSync(resolve(__dirname, '..', 'cosign.pub'), join(project, 'cosign.pub'));
      copyFileSync(
        resolve(__dirname, '..', 'scripts', 'temp-directory.sh'),
        join(project, 'scripts', 'temp-directory.sh'),
      );
      write(join(project, 'bin', 'check-local'), '#!/bin/sh\n', 0o755);
      write(join(project, 'bin', 'prepare-npm-release'), '#!/bin/sh\nmkdir -p dist\n', 0o755);
      write(
        join(project, 'scripts', 'utils', 'npm-publish'),
        '#!/bin/sh\ncp "$1" "$FAKE_REGISTRY/"\n',
        0o755,
      );
      write(join(project, 'package.json'), JSON.stringify({ name: 'x-twitter-scraper', version }));
      write(join(project, 'src', 'version.ts'), `export const VERSION = '${version}';\n`);
      write(join(project, 'CHANGELOG.md'), `# Changelog\n\n## ${version}\n\n- A change.\n`);
      write(join(project, '.gitignore'), 'dist\n');
      git(root, 'init', '--quiet', '--bare', origin);
      git(project, 'init', '--quiet', '--initial-branch=main');
      git(project, 'add', '--all');
      git(project, 'commit', '--quiet', '--message', 'Release');
      git(project, 'remote', 'add', 'origin', origin);
      git(project, 'push', '--quiet', 'origin', 'main');
      return {
        root,
        command: join(project, 'bin', 'release-local'),
        published: () => ({
          npm: readdirSync(registry),
          tags: git(origin, 'tag', '--list').split('\n').filter(Boolean),
          release:
            existsSync(join(github, 'state')) ? readFileSync(join(github, 'state'), 'utf8').trim() : 'none',
          assets: readdirSync(join(github, 'assets')).sort(),
        }),
        env: {
          ...process.env,
          ...gitEnv,
          PATH: `${join(root, 'tools')}${delimiter}${process.env['PATH'] ?? ''}`,
          NPM_KEYCHAIN_SERVICE: 'example-service',
          NPM_KEYCHAIN_ACCOUNT: 'example-account',
          COSIGN_PRIVATE_KEY: 'example-key',
          COSIGN_PASSWORD: 'example-password',
          FAKE_GITHUB: github,
          FAKE_REGISTRY: registry,
          TMPDIR: join(root, 'tmp'),
        },
      };
    };

    it('publishes the GitHub release once its draft holds the package and its verified provenance', () => {
      const { root, command, published, env } = setUp();
      try {
        const result = spawnSync(command, [], { encoding: 'utf8', env });

        expect(result.status).toBe(0);
        expect(published()).toEqual({
          npm: [packageFile],
          tags: [tag],
          release: 'published',
          assets: [packageFile, provenanceFile],
        });
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });

    it.each([
      [
        'attesting fails',
        { FAKE_COSIGN_ATTEST: 'fails' },
        `cosign could not attest ${packageFile}. Nothing was published. Fix the error above, then run bin/release-local again.`,
        { npm: [], tags: [], release: 'none', assets: [] },
      ],
      [
        'the upload stops after the package',
        { FAKE_GH_UPLOAD: 'stops' },
        `The upload to the draft release ${tag} failed. The GitHub release stays unpublished.`,
        { npm: [packageFile], tags: [tag], release: 'draft', assets: [packageFile] },
      ],
      [
        "the draft's package differs from the attested one",
        { FAKE_GH_DOWNLOAD: 'tampered' },
        `cosign.pub does not verify ${provenanceFile}. The GitHub release ${tag} stays unpublished.`,
        { npm: [packageFile], tags: [tag], release: 'draft', assets: [packageFile, provenanceFile] },
      ],
    ])('refuses to publish the GitHub release when %s', (_case, faults, message, state) => {
      const { root, command, published, env } = setUp();
      try {
        const result = spawnSync(command, [], { encoding: 'utf8', env: { ...env, ...faults } });

        expect(result.status).toBe(1);
        expect(result.stderr.trimEnd().split('\n').at(-1)).toBe(message);
        expect(published()).toEqual(state);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });
  });
});
