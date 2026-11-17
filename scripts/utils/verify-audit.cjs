// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const MAX_EXCEPTION_DAYS = 14;
const DAY_MS = 86_400_000;
const SEVERITIES = ['info', 'low', 'moderate', 'high', 'critical'];

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value) => typeof value === 'string' && value !== '';

const advisoryProblem = (key, advisory) => {
  if (
    !isObject(advisory) ||
    !isText(advisory.github_advisory_id) ||
    !isText(advisory.module_name) ||
    !isText(advisory.severity) ||
    (typeof advisory.patched_versions !== 'string' && advisory.patched_versions !== null)
  )
    return `advisory ${key} lacks its GHSA ID, package, severity or patched versions`;
  if (
    !Array.isArray(advisory.findings) ||
    advisory.findings.length === 0 ||
    !advisory.findings.every((finding) => isObject(finding) && isText(finding.version))
  )
    return `advisory ${key} lists no finding with a version`;
  return undefined;
};

const advisoryCountProblems = (advisories, advisoriesBySeverity) => {
  const held = new Map();
  for (const advisory of advisories) held.set(advisory.severity, (held.get(advisory.severity) ?? 0) + 1);
  return [...new Set([...SEVERITIES, ...Object.keys(advisoriesBySeverity), ...held.keys()])]
    .filter((severity) => advisoriesBySeverity[severity] !== (held.get(severity) ?? 0))
    .map(
      (severity) =>
        `metadata.vulnerabilities.${severity} counts ${advisoriesBySeverity[severity]} advisories & the report holds ${held.get(severity) ?? 0}`,
    );
};

const readReport = (report) => {
  if (!isObject(report) || !isObject(report.advisories) || !isObject(report.metadata?.vulnerabilities))
    return { findings: [], problems: ["it isn't an object with advisories & metadata.vulnerabilities"] };
  const entries = Object.entries(report.advisories);
  const shapeProblems = entries.flatMap(([key, advisory]) => advisoryProblem(key, advisory) ?? []);
  if (shapeProblems.length > 0) return { findings: [], problems: shapeProblems };
  const advisories = entries.map(([, advisory]) => advisory);
  return {
    findings: advisories.flatMap((advisory) =>
      [...new Set(advisory.findings.map((finding) => finding.version))].map((version) => ({
        fixed: advisory.patched_versions !== null && advisory.patched_versions !== '<0.0.0',
        id: advisory.github_advisory_id,
        name: advisory.module_name,
        severity: advisory.severity,
        version,
      })),
    ),
    problems: advisoryCountProblems(advisories, report.metadata.vulnerabilities),
  };
};

const exceptionFor = (finding, exceptions, now) =>
  exceptions.find(
    (exception) =>
      exception.id === finding.id &&
      exception.package === finding.name &&
      exception.version === finding.version &&
      !finding.fixed &&
      now < Date.parse(exception.expires),
  );

const verify = (report, exceptions, now) => {
  const { findings, problems } = readReport(report);
  const unread = problems.map((problem) => ({
    failed: true,
    line: `The audit report fails, since ${problem}.`,
  }));
  const lines = [
    ...unread,
    ...findings.map((finding) => {
      const named = `${finding.id} (${finding.severity}) on ${finding.name} ${finding.version}`;
      const exception = exceptionFor(finding, exceptions, now);
      return exception === undefined ?
          { failed: true, line: `${named} fails. Upgrade, override or replace that package.` }
        : {
            failed: false,
            line: `${named} passes until ${exception.expires} or its first fixed release, since ${exception.patch} applies ${exception.fix}.`,
          };
    }),
  ];
  return { failures: lines.filter(({ failed }) => failed).length, lines: lines.map(({ line }) => line) };
};

const main = () => {
  const root = path.join(__dirname, '..', '..');
  const { exceptions } = JSON.parse(fs.readFileSync(path.join(root, 'audit-exceptions.json'), 'utf8'));
  const audit = spawnSync('pnpm', ['audit', '--json'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (audit.status !== 0 && audit.status !== 1) {
    process.stderr.write(`pnpm audit exited ${audit.status}. ${audit.stderr}\n`);
    process.exitCode = 1;
    return;
  }
  const result = verify(JSON.parse(audit.stdout), exceptions, Date.now());
  for (const line of result.lines) process.stdout.write(`${line}\n`);
  process.stdout.write(
    result.failures === 0 ?
      `Dependency audit passed with ${result.lines.length} reviewed exception${result.lines.length === 1 ? '' : 's'}.\n`
    : `Dependency audit failed on ${result.failures} line${result.failures === 1 ? '' : 's'} above.\n`,
  );
  process.exitCode = result.failures === 0 ? 0 : 1;
};

if (require.main === module) main();

module.exports = { DAY_MS, MAX_EXCEPTION_DAYS, exceptionFor, verify };
