// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve(__dirname, '..', 'scripts', 'utils', 'npm-publish');

// A registry that asks for 2FA approval as npm's does: the first PUT gets 401 with an approval URL
// and a URL to poll, the poll answers 202 until the owner approves, and the retried PUT carries the
// one-time password that the poll returned.
const startRegistry = async (pollsBeforeApproval: number) => {
  const requests: string[] = [];
  let polls = 0;
  const server = createServer((request, response) => {
    const otp = request.headers['npm-otp'];
    requests.push(`${request.method} ${request.url}${otp ? ` otp=${String(otp)}` : ''}`);
    const answer = (status: number, body: unknown, headers: Record<string, string> = {}) => {
      response.writeHead(status, { 'content-type': 'application/json', ...headers });
      response.end(JSON.stringify(body));
    };
    request.resume();
    request.on('end', () => {
      const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      if (request.method === 'PUT' && !otp) {
        answer(
          401,
          { authUrl: `${base}/approve/abc`, doneUrl: `${base}/done/abc` },
          { 'www-authenticate': 'OTP' },
        );
      } else if (request.method === 'PUT') {
        answer(200, { ok: true });
      } else if (request.url === '/done/abc') {
        polls += 1;
        if (polls <= pollsBeforeApproval) answer(202, {}, { 'retry-after': '1' });
        else answer(200, { token: '123456' });
      } else {
        answer(404, { error: 'not found' });
      }
    });
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    requests,
    close: () => new Promise<void>((done) => server.close(() => done())),
  };
};

const publish = (args: string[], cwd: string) =>
  new Promise<{ status: number | null; output: string }>((done) => {
    // stdin, stdout and stderr are pipes here, so npm has no terminal, as in a background release run.
    const child = spawn(script, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (chunk: Buffer) => (output += chunk.toString()));
    child.stderr.on('data', (chunk: Buffer) => (output += chunk.toString()));
    child.on('close', (status) => done({ status, output }));
  });

describe('scripts/utils/npm-publish', () => {
  it('shows the 2FA approval URL and waits for the approval when it has no terminal', async () => {
    const registry = await startRegistry(2);
    const root = mkdtempSync(join(tmpdir(), 'npm-publish-'));
    try {
      const packageRoot = join(root, 'package');
      mkdirSync(packageRoot);
      writeFileSync(
        join(packageRoot, 'package.json'),
        JSON.stringify({ name: 'approval-check', version: '1.0.0' }),
      );
      writeFileSync(join(packageRoot, 'index.js'), 'module.exports = 1;\n');
      const userconfig = join(root, 'npmrc');
      writeFileSync(userconfig, `${registry.url.replace('http:', '')}/:_authToken=not-a-real-token\n`);

      const result = await publish(
        [packageRoot, '--registry', registry.url, '--userconfig', userconfig, '--cache', join(root, 'cache')],
        packageRoot,
      );

      expect(result.output).toContain(`Authenticate your account at:`);
      expect(result.output).toContain(`${registry.url}/approve/abc`);
      expect(result.output).toContain('+ approval-check@1.0.0');
      expect(result.status).toBe(0);
      expect(registry.requests.filter((line) => line.startsWith('PUT'))).toEqual([
        'PUT /approval-check',
        'PUT /approval-check otp=123456',
      ]);
      expect(registry.requests.filter((line) => line === 'GET /done/abc')).toHaveLength(3);
    } finally {
      rmSync(root, { recursive: true, force: true });
      await registry.close();
    }
  }, 60_000);
});
