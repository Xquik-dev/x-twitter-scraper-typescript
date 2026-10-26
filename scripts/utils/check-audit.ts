// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { field, isList, isObject, list, parseJson, record } from './json.ts';

type Exception = {
  readonly advisory: string;
  readonly path: string;
  readonly reason: string;
  readonly recheck: string;
};

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, '..', '..'));
const exceptionsFile = 'audit-exceptions.json';
const allowedReasons = new Set(['build-time only', 'test-time only', 'peer dependency provided by the host']);
const maxRecheckDays = 30;
const dayInMs = 24 * 60 * 60 * 1000;

const run = (command: string, args: readonly string[]) => {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  if (result.error) throw result.error;
  return result;
};

const readJson = (file: string) => parseJson(fs.readFileSync(path.join(root, file), 'utf8'));

const minimumReleaseAgeMs = () => {
  const workspace = fs.readFileSync(path.join(root, 'pnpm-workspace.yaml'), 'utf8');
  const match = workspace.match(/^minimumReleaseAge:\s*(\d+)\s*$/m);
  return match ? Number(match[1]) * 60 * 1000 : 0;
};

const normalizePath = (auditPath: string) =>
  auditPath
    .split('>')
    .map((part) => part.trim())
    .filter((part) => part !== '.' && part !== '')
    .join(' > ');

const npmViewJson = (args: readonly string[]) => {
  const result = run('npm', ['view', ...args, '--json']);
  const output = result.stdout.trim();
  const parsed = output ? parseJson(output) : undefined;
  if (result.status === 0) return parsed;
  if (field(field(parsed, 'error'), 'code') === 'E404') return undefined;
  throw new Error(`npm view ${args.join(' ')} failed. Check the network, then run the audit again.`);
};

const hasInstallableFix = (
  moduleName: string,
  patchedVersions: unknown,
  releaseAgeMs: number,
  now: number,
) => {
  if (!patchedVersions || patchedVersions === '<0.0.0') return false;
  const matching = npmViewJson([`${moduleName}@${patchedVersions}`, 'version']);
  if (matching === undefined) return false;
  const versions = isList(matching) ? matching : [matching];
  const published = npmViewJson([moduleName, 'time']) ?? {};
  return versions.some((version) => {
    const time = Date.parse(String(field(published, String(version)) ?? ''));
    return Number.isFinite(time) && now - time >= releaseAgeMs;
  });
};

const loadExceptions = (problems: string[]): Exception[] => {
  if (!fs.existsSync(path.join(root, exceptionsFile))) return [];
  const entries = field(readJson(exceptionsFile), 'exceptions');
  if (!isList(entries)) {
    problems.push(`${exceptionsFile} needs an "exceptions" array. Add one, even if it is empty.`);
    return [];
  }
  return entries.flatMap((entry, index) => {
    const label = `${exceptionsFile} entry ${index + 1}`;
    const advisory = field(entry, 'advisory');
    const entryPath = field(entry, 'path');
    const reason = field(entry, 'reason');
    const recheck = field(entry, 'recheck');
    if (typeof advisory !== 'string' || !/^GHSA(-[0-9a-z]{4}){3}$/.test(advisory)) {
      problems.push(`${label} needs an "advisory" like GHSA-xxxx-xxxx-xxxx.`);
    } else if (typeof entryPath !== 'string' || normalizePath(entryPath) !== entryPath) {
      problems.push(`${label} needs a "path" like "jest > micromatch > braces".`);
    } else if (typeof reason !== 'string' || !allowedReasons.has(reason)) {
      problems.push(`${label} needs a "reason" of ${[...allowedReasons].map((r) => `"${r}"`).join(' or ')}.`);
    } else if (
      typeof recheck !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(recheck) ||
      Number.isNaN(Date.parse(recheck))
    ) {
      problems.push(`${label} needs a "recheck" date like 2026-11-12.`);
    } else {
      return [{ advisory, path: entryPath, reason, recheck }];
    }
    return [];
  });
};

const main = () => {
  const problems: string[] = [];
  const accepted: string[] = [];
  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);
  const latestRecheck = new Date(now + maxRecheckDays * dayInMs).toISOString().slice(0, 10);
  const releaseAgeMs = minimumReleaseAgeMs();

  const pkg = readJson('package.json');
  const runtimeNames = new Set(
    ['dependencies', 'optionalDependencies', 'peerDependencies'].flatMap((name) =>
      Object.keys(record(field(pkg, name))),
    ),
  );
  const exceptions = loadExceptions(problems);
  const matched = new Set<Exception>();

  const audit = run('pnpm', ['audit', '--json']);
  let report: unknown;
  try {
    report = parseJson(audit.stdout);
  } catch {
    report = undefined;
  }
  const advisories = field(report, 'advisories');
  if (!isObject(advisories)) {
    process.stderr.write(audit.stderr);
    console.error('pnpm audit returned no report. Run pnpm audit to see why.');
    process.exit(1);
  }

  for (const advisory of Object.values(advisories)) {
    const id = field(advisory, 'github_advisory_id');
    const moduleName = String(field(advisory, 'module_name'));
    const patchedVersions = field(advisory, 'patched_versions');
    const name = `${id} ${moduleName} (${field(advisory, 'severity')})`;
    const paths = [
      ...new Set(
        list(field(advisory, 'findings'))
          .flatMap((finding) => list(field(finding, 'paths')))
          .flatMap((auditPath) => (typeof auditPath === 'string' ? [normalizePath(auditPath)] : [])),
      ),
    ];
    const runtimePaths = paths.filter((p) => runtimeNames.has(p.split(' > ')[0] ?? ''));
    const developmentPaths = paths.filter((p) => !runtimePaths.includes(p));

    if (runtimePaths.length > 0) {
      problems.push(`${name} reaches the shipped dependency path ${runtimePaths[0]}. Upgrade it.`);
    }
    if (developmentPaths.length === 0) continue;

    let fixable: boolean;
    try {
      fixable = hasInstallableFix(moduleName, patchedVersions, releaseAgeMs, now);
    } catch (error) {
      problems.push(
        `${name} could not be checked. ${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }
    if (fixable) {
      const listed = exceptions.filter((e) => e.advisory === id);
      listed.forEach((entry) => matched.add(entry));
      const cleanup = listed.length > 0 ? `, then remove its ${exceptionsFile} entry` : '';
      problems.push(`${name} has an installable fix (${patchedVersions}). Upgrade or override it${cleanup}.`);
      continue;
    }

    const unlisted: string[] = [];
    for (const developmentPath of developmentPaths) {
      const entry = exceptions.find((e) => e.advisory === id && e.path === developmentPath);
      if (!entry) {
        unlisted.push(developmentPath);
        continue;
      }
      matched.add(entry);
      if (entry.recheck <= today) {
        problems.push(`${name} exception for ${developmentPath} expired on ${entry.recheck}. Recheck it.`);
      } else if (entry.recheck > latestRecheck) {
        problems.push(
          `${name} exception recheck ${entry.recheck} is too far out. Use ${latestRecheck} or earlier.`,
        );
      } else {
        accepted.push(`${name} via ${developmentPath}. It is ${entry.reason}. Recheck by ${entry.recheck}.`);
      }
    }
    if (unlisted.length > 0) {
      problems.push(
        `${name} has no fix and ${unlisted.length} unlisted path(s), such as ${unlisted[0]}. ` +
          `Review each one and list it in ${exceptionsFile}.`,
      );
    }
  }

  for (const entry of exceptions) {
    if (!matched.has(entry)) {
      console.log(
        `${exceptionsFile} lists ${entry.advisory} for ${entry.path}, which no longer applies. Remove it.`,
      );
    }
  }
  for (const line of accepted) console.log(`Accepted the reviewed exception for ${line}`);

  if (problems.length > 0) {
    for (const line of problems) console.error(`Blocked. ${line}`);
    console.error(`Audit failed with ${problems.length} blocking finding(s).`);
    process.exit(1);
  }
  const plural = accepted.length === 1 ? '' : 's';
  console.log(
    accepted.length > 0 ?
      `Audit passed with ${accepted.length} reviewed exception${plural}.`
    : 'Audit passed.',
  );
};

main();
