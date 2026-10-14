// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import assert from 'node:assert/strict';
import { execFile, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { promisify } from 'node:util';
import { gzipSync, gunzipSync } from 'node:zlib';

const execute = promisify(execFile);
const repository = new URL('../', import.meta.url);

async function fixture(t) {
  const directory = await mkdtemp(path.join(tmpdir(), 'npm-release-test-'));
  let server;
  t.after(async () => {
    try {
      if (server?.listening) {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
      }
    } finally {
      try {
        await rm(directory, { recursive: true, force: true });
      } catch (error) {
        process.stderr.write(JSON.stringify({ event: 'fixture_cleanup_failed', directory, message: error.message }) + '\n');
        throw error;
      }
    }
  });
  const source = path.join(directory, 'source');
  await mkdir(source);
  await cp(new URL('bin', repository), path.join(source, 'bin'), { recursive: true });
  await writeFile(path.join(source, '.gitignore'), 'dist/\n');
  await writeFile(
    path.join(source, 'package.json'),
    JSON.stringify({ name: 'x-twitter-scraper', version: '0.12.5' }),
  );
  const gitEnv = {
    PATH: process.env.PATH,
    HOME: directory,
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_TERMINAL_PROMPT: '0',
  };
  const git = (...args) => execFileSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgSign=false', ...args], {
    cwd: source, encoding: 'utf8', env: gitEnv, timeout: 10000,
  }).trim();
  git('init', '-q', '-b', 'main');
  git('add', '.');
  git('-c', 'user.name=Release test', '-c', 'user.email=release@example.test', 'commit', '-qm', 'Fixture');
  const commit = git('rev-parse', 'HEAD');
  git('tag', 'v0.12.5');
  git('update-ref', 'refs/remotes/origin/main', commit);

  const requests = [];
  let published;
  let uploaded;
  let readbackIntegrity;
  let authenticated = true;
  let unavailable = false;
  let onAuthentication;
  let onLookup;
  server = createServer(async (request, response) => {
    requests.push({ method: request.method, url: request.url });
    response.setHeader('content-type', 'application/json');
    if (request.url === '/-/whoami') {
      if (onAuthentication) await onAuthentication();
      response.writeHead(authenticated ? 200 : 401).end(
        JSON.stringify(authenticated ? { username: 'release-fixture' } : { error: 'Unauthorized' }),
      );
    } else if (unavailable) {
      response.writeHead(503).end(JSON.stringify({ error: 'Unavailable' }));
    } else if (request.method === 'GET' && request.url === '/x-twitter-scraper' && onLookup) {
      await onLookup();
      response.writeHead(404).end(JSON.stringify({ error: 'Not found' }));
    } else if (request.method === 'PUT' && request.url === '/x-twitter-scraper') {
      let body = '';
      for await (const chunk of request) body += chunk.toString();
      const document = JSON.parse(body);
      published = document.versions['0.12.5'];
      const attachment = document._attachments['x-twitter-scraper-0.12.5.tgz'];
      if (!published || !attachment) {
        response.writeHead(400).end(JSON.stringify({ error: 'Unexpected package metadata' }));
        return;
      }
      uploaded = Buffer.from(attachment.data, 'base64');
      if (readbackIntegrity) published.dist.integrity = readbackIntegrity;
      response.writeHead(201).end(JSON.stringify({ ok: true }));
    } else if (request.url === '/x-twitter-scraper' && published) {
      response.end(JSON.stringify({ name: 'x-twitter-scraper', 'dist-tags': { latest: '0.12.5' }, versions: { '0.12.5': published } }));
    } else if (request.url === '/x-twitter-scraper/0.12.5' && published) {
      response.end(JSON.stringify(published));
    } else {
      response.writeHead(404).end(JSON.stringify({ error: 'Not found' }));
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert(address && typeof address !== 'string');
  const registry = `http://127.0.0.1:${address.port}/`;
  const config = path.join(directory, 'npmrc');
  await writeFile(config, `${registry.replace('http:', '')}:_authToken=fixture-token\n`);
  const env = {
    ...gitEnv,
    GOCACHE: process.env.GOCACHE,
    GOMODCACHE: process.env.GOMODCACHE,
    GOCOVERDIR: process.env.GOCOVERDIR,
    NPM_CONFIG_USERCONFIG: config,
    NPM_CONFIG_REGISTRY: registry,
    NPM_CONFIG_CACHE: path.join(directory, 'cache'),
    NPM_CONFIG_FETCH_RETRIES: '0',
    NPM_CONFIG_FETCH_TIMEOUT: '5000',
    NPM_CONFIG_UPDATE_NOTIFIER: 'false',
  };
  const run = async (command, ...args) => {
    requests.length = 0;
    try {
      const result = await execute('bash', [path.join(source, 'bin', command), ...args], {
        cwd: source,
        env,
        timeout: 20000,
      });
      return { code: 0, ...result };
    } catch (error) {
      return { code: error.code, stdout: error.stdout, stderr: error.stderr };
    }
  };
  const artifact = async (metadata = {}, extraManifest) => {
    const dist = path.join(source, 'dist');
    await mkdir(dist);
    await writeFile(
      path.join(dist, 'package.json'),
      JSON.stringify({ name: 'x-twitter-scraper', version: '0.12.5', gitHead: commit, files: ['index.js'], ...metadata }),
    );
    await writeFile(path.join(dist, 'index.js'), 'module.exports = { version: "0.12.5" };\n');
    const result = await execute('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', directory], {
      cwd: dist,
      env,
      timeout: 20000,
    });
    const packed = JSON.parse(result.stdout)[0];
    const archive = path.join(directory, packed.filename);
    if (extraManifest) {
      const contents = path.join(directory, 'contents');
      await mkdir(path.join(contents, 'package'), { recursive: true });
      await cp(path.join(dist, 'package.json'), path.join(contents, 'package', 'package.json'));
      const secondManifest = extraManifest === 'duplicate' ? 'package/package.json' : 'shadow/package.json';
      if (extraManifest === 'alternate') {
        await mkdir(path.join(contents, 'shadow'));
        await writeFile(path.join(contents, secondManifest), JSON.stringify({ name: 'other-package', version: '0.12.5', gitHead: commit }));
      }
      await execute('tar', ['-czf', archive, '-C', contents, 'package/package.json', secondManifest], {
        env, timeout: 10000,
      });
    }
    const integrity = 'sha512-' + createHash('sha512').update(await readFile(archive)).digest('base64');
    return { archive, integrity };
  };
  return {
    source,
    commit,
    git,
    requests,
    registry,
    run,
    artifact,
    uploaded: () => uploaded,
    setReadbackIntegrity: (value) => (readbackIntegrity = value),
    setAuthenticated: (value) => (authenticated = value),
    setUnavailable: (value) => (unavailable = value),
    setOnAuthentication: (value) => (onAuthentication = value),
    setOnLookup: (value) => (onLookup = value),
    setPublished: (value) => (published = value),
  };
}

test('release preflight accepts an authenticated clean tagged main commit', async (t) => {
  const f = await fixture(t);
  const result = await f.run('check-release-environment', f.commit);
  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: 'ready', name: 'x-twitter-scraper', version: '0.12.5', source: f.commit,
  });
  assert(!result.stdout.includes('release-fixture'));
});

test('release preflight rejects unauthenticated npm sessions', async (t) => {
  const f = await fixture(t);
  f.setAuthenticated(false);
  const result = await f.run('check-release-environment', f.commit);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /npm login/);
});

test('release preflight rejects dirty source before contacting npm', async (t) => {
  const f = await fixture(t);
  await writeFile(path.join(f.source, 'package.json'), '{}');
  const result = await f.run('check-release-environment', f.commit);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /changes/);
  assert.equal(f.requests.length, 0);
});

test('release preflight rejects a tag pointing to a different commit', async (t) => {
  const f = await fixture(t);
  f.git('-c', 'user.name=Release test', '-c', 'user.email=release@example.test', 'commit', '--allow-empty', '-qm', 'Next');
  f.git('update-ref', 'refs/remotes/origin/main', f.git('rev-parse', 'HEAD'));
  const result = await f.run('check-release-environment', f.git('rev-parse', 'HEAD'));
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /tag/);
  assert.equal(f.requests.length, 0);
});

test('publisher verifies the exact archive and reads back its registry integrity', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact();
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: 'published', name: 'x-twitter-scraper', version: '0.12.5', source: f.commit, integrity,
  });
  assert.equal(f.requests.filter((request) => request.method === 'PUT').length, 1);
  assert.deepEqual(f.uploaded(), await readFile(archive));
});

test('publisher rejects mismatched registry integrity after publication', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact();
  f.setReadbackIntegrity('sha512-other');
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /integrity/);
  assert.equal(f.requests.filter((request) => request.method === 'PUT').length, 1);
});

test('publisher retries an identical registry release without another publication', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact();
  f.setPublished({ name: 'x-twitter-scraper', version: '0.12.5', gitHead: f.commit, dist: { integrity } });
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, 'already-published');
  assert.equal(f.requests.filter((request) => request.method === 'PUT').length, 0);
});

test('publisher rejects a conflicting immutable registry version', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact();
  f.setPublished({ name: 'x-twitter-scraper', version: '0.12.5', gitHead: f.commit, dist: { integrity: 'sha512-other' } });
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /integrity/);
  assert.equal(f.requests.filter((request) => request.method === 'PUT').length, 0);
});

test('publisher rejects registry outages instead of treating them as an absent version', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact();
  f.setUnavailable(true);
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 1);
  assert(f.requests.some((request) => request.url === '/-/whoami'));
  assert(f.requests.some((request) => request.url.startsWith('/x-twitter-scraper')));
  assert.equal(f.requests.filter((request) => request.method === 'PUT').length, 0);
});

test('publisher rejects an archive changed after qualification before any npm request', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact();
  await writeFile(archive, 'Changed archive');
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /integrity/);
  assert.equal(f.requests.length, 0);
});

test('publisher rejects archive metadata that differs from the qualified source', async (t) => {
  for (const metadata of [{ name: 'other-package' }, { version: '0.12.6' }, { gitHead: '0'.repeat(40) }]) {
    await t.test(JSON.stringify(metadata), async (variant) => {
      const f = await fixture(variant);
      const { archive, integrity } = await f.artifact(metadata);
      const result = await f.run('publish-npm-release', f.commit, archive, integrity);
      assert.equal(result.code, 1);
      assert.match(JSON.parse(result.stderr).error, /name|version|source SHA/);
      assert.equal(f.requests.length, 0);
    });
  }
});

test('publisher rejects an archive with duplicate package manifests before any npm request', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact({}, 'duplicate');
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /duplicat/);
  assert.equal(f.requests.length, 0);
});

test('publisher rejects registry source mismatches even when integrity matches', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact();
  f.setPublished({ name: 'x-twitter-scraper', version: '0.12.5', gitHead: '0'.repeat(40), dist: { integrity } });
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /source SHA/);
  assert.equal(f.requests.filter((request) => request.method === 'PUT').length, 0);
});

test('publisher rejects an alternate archive root before any npm request', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact({}, 'alternate');
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /contents/);
  assert.equal(f.requests.length, 0);
});

test('publisher binds publication to the registry used for authentication and readback', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact({ publishConfig: { registry: f.registry + 'redirect/' } });
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, 'published');
  assert.equal(f.requests.filter((request) => request.method === 'PUT').length, 1);
  assert(!f.requests.some((request) => request.url.startsWith('/redirect/')));
  assert.deepEqual(f.uploaded(), await readFile(archive));
});

test('release preflight rejects a checkout newer than the qualified source', async (t) => {
  const f = await fixture(t);
  f.git('-c', 'user.name=Release test', '-c', 'user.email=release@example.test', 'commit', '--allow-empty', '-qm', 'Next');
  f.git('update-ref', 'refs/remotes/origin/main', f.git('rev-parse', 'HEAD'));
  const result = await f.run('check-release-environment', f.commit);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /Source SHA/);
  assert.equal(f.requests.length, 0);
});

test('release preflight rejects a tagged source outside main', async (t) => {
  const f = await fixture(t);
  f.git('-c', 'user.name=Release test', '-c', 'user.email=release@example.test', 'commit', '--allow-empty', '-qm', 'Candidate');
  const candidate = f.git('rev-parse', 'HEAD');
  f.git('tag', '-f', 'v0.12.5', candidate);
  const result = await f.run('check-release-environment', candidate);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /origin\/main/);
  assert.equal(f.requests.length, 0);
});

test('publisher rejects source changes made during registry lookup before publication', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact();
  f.setOnLookup(() => writeFile(path.join(f.source, 'package.json'), '{}'));
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /changes/);
  assert.equal(f.requests.filter((request) => request.method === 'PUT').length, 0);
});

test('publisher uploads the qualified copy when the original archive changes during authentication', async (t) => {
  const f = await fixture(t);
  const { archive, integrity } = await f.artifact();
  const qualifiedBytes = await readFile(archive);
  f.setOnAuthentication(() => writeFile(archive, 'Changed during authentication'));
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, 'published');
  assert.deepEqual(f.uploaded(), qualifiedBytes);
  assert.notDeepEqual(await readFile(archive), qualifiedBytes);
});

test('publisher rejects a gzip checksum error beyond the tar end marker before authentication', async (t) => {
  const f = await fixture(t);
  const { archive } = await f.artifact();
  const packed = gzipSync(Buffer.concat([gunzipSync(await readFile(archive)), Buffer.alloc(65536)]));
  packed[packed.length - 8] ^= 255;
  await writeFile(archive, packed);
  const integrity = 'sha512-' + createHash('sha512').update(packed).digest('base64');
  const result = await f.run('publish-npm-release', f.commit, archive, integrity);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /checksum|contents/);
  assert.equal(f.requests.length, 0);
});
