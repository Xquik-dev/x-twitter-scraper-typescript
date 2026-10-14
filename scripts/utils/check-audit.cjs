// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] ?? path.join(__dirname, '..', '..'));
const exceptionsFile = 'audit-exceptions.json';
const allowedReasons = new Set(['build-time only', 'test-time only', 'peer dependency provided by the host']);
const maxRecheckDays = 30;
const dayInMs = 24 * 60 * 60 * 1000;

const run = (command, args) => {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  if (result.error) throw result.error;
  return result;
};

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

const minimumReleaseAgeMs = () => {
  const workspace = fs.readFileSync(path.join(root, 'pnpm-workspace.yaml'), 'utf8');
  const match = workspace.match(/^minimumReleaseAge:\s*(\d+)\s*$/m);
  return match ? Number(match[1]) * 60 * 1000 : 0;
};

const normalizePath = (auditPath) =>
  auditPath
    .split('>')
    .map((part) => part.trim())
    .filter((part) => part !== '.' && part !== '')
    .join(' > ');

const npmViewJson = (args) => {
  const result = run('npm', ['view', ...args, '--json']);
  const output = result.stdout.trim();
  const parsed = output ? JSON.parse(output) : undefined;
  if (result.status === 0) return parsed;
  if (parsed?.error?.code === 'E404') return undefined;
  throw new Error(`npm view ${args.join(' ')} failed. Check the network, then run the audit again.`);
};

const hasInstallableFix = (moduleName, patchedVersions, releaseAgeMs, now) => {
  if (!patchedVersions || patchedVersions === '<0.0.0') return false;
  const matching = npmViewJson([`${moduleName}@${patchedVersions}`, 'version']);
  if (matching === undefined) return false;
  const versions = Array.isArray(matching) ? matching : [matching];
  const published = npmViewJson([moduleName, 'time']) ?? {};
  return versions.some((version) => {
    const time = Date.parse(published[version] ?? '');
    return Number.isFinite(time) && now - time >= releaseAgeMs;
  });
};

const loadExceptions = (problems) => {
  if (!fs.existsSync(path.join(root, exceptionsFile))) return [];
  const file = readJson(exceptionsFile);
  if (!Array.isArray(file.exceptions)) {
    problems.push(`${exceptionsFile} needs an "exceptions" array. Add one, even if it is empty.`);
    return [];
  }
  return file.exceptions.filter((entry, index) => {
    const label = `${exceptionsFile} entry ${index + 1}`;
    if (!/^GHSA(-[0-9a-z]{4}){3}$/.test(entry.advisory ?? '')) {
      problems.push(`${label} needs an "advisory" like GHSA-xxxx-xxxx-xxxx.`);
    } else if (typeof entry.path !== 'string' || normalizePath(entry.path) !== entry.path) {
      problems.push(`${label} needs a "path" like "jest > micromatch > braces".`);
    } else if (!allowedReasons.has(entry.reason)) {
      problems.push(`${label} needs a "reason" of ${[...allowedReasons].map((r) => `"${r}"`).join(' or ')}.`);
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.recheck ?? '') || Number.isNaN(Date.parse(entry.recheck))) {
      problems.push(`${label} needs a "recheck" date like 2026-11-12.`);
    } else {
      return true;
    }
    return false;
  });
};

const main = () => {
  const problems = [];
  const accepted = [];
  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);
  const latestRecheck = new Date(now + maxRecheckDays * dayInMs).toISOString().slice(0, 10);
  const releaseAgeMs = minimumReleaseAgeMs();

  const pkg = readJson('package.json');
  const runtimeNames = new Set(
    ['dependencies', 'optionalDependencies', 'peerDependencies'].flatMap((field) =>
      Object.keys(pkg[field] ?? {}),
    ),
  );
  const exceptions = loadExceptions(problems);
  const matched = new Set();

  const audit = run('pnpm', ['audit', '--json']);
  let report;
  try {
    report = JSON.parse(audit.stdout);
  } catch {
    report = undefined;
  }
  if (!report || typeof report.advisories !== 'object' || report.advisories === null) {
    process.stderr.write(audit.stderr);
    console.error('pnpm audit returned no report. Run pnpm audit to see why.');
    process.exit(1);
  }

  for (const advisory of Object.values(report.advisories)) {
    const id = advisory.github_advisory_id;
    const name = `${id} ${advisory.module_name} (${advisory.severity})`;
    const paths = [
      ...new Set((advisory.findings ?? []).flatMap((finding) => finding.paths ?? []).map(normalizePath)),
    ];
    const runtimePaths = paths.filter((p) => runtimeNames.has(p.split(' > ')[0]));
    const developmentPaths = paths.filter((p) => !runtimePaths.includes(p));

    if (runtimePaths.length > 0) {
      problems.push(`${name} reaches the shipped dependency path ${runtimePaths[0]}. Upgrade it.`);
    }
    if (developmentPaths.length === 0) continue;

    let fixable;
    try {
      fixable = hasInstallableFix(advisory.module_name, advisory.patched_versions, releaseAgeMs, now);
    } catch (error) {
      problems.push(`${name} could not be checked. ${error.message}`);
      continue;
    }
    if (fixable) {
      const listed = exceptions.filter((e) => e.advisory === id);
      listed.forEach((entry) => matched.add(entry));
      const cleanup = listed.length > 0 ? `, then remove its ${exceptionsFile} entry` : '';
      problems.push(
        `${name} has an installable fix (${advisory.patched_versions}). Upgrade or override it${cleanup}.`,
      );
      continue;
    }

    const unlisted = [];
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
