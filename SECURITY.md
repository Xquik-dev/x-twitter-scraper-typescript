# Security Policy

## Supported Versions

Security fixes target the latest published release.

## Reporting A Vulnerability

Use this repository's private vulnerability reporting option.

Use [security@xquik.com](mailto:security@xquik.com) when private reporting fails.

Never post exploit details through public channels.

Never post credentials, cookies, webhook secrets, or personal data.

We will acknowledge reports within 3 business days.

We will validate and classify reports within 14 days.

We will fix confirmed public vulnerabilities within 60 days.

Critical vulnerabilities receive immediate priority.

We will coordinate disclosure timing with the reporter.

Public advisories will credit reporters unless they request anonymity.

## Security Boundary

This package includes the generated TypeScript SDK and bundled agent Skills.

The SDK constructs HTTPS requests and parses remote responses.

It handles API keys, OAuth bearer tokens, uploads, retries, and response streams.

The default service endpoint uses HTTPS.

Callers may explicitly provide another endpoint for testing or compatible services.

The SDK trusts the host runtime's TLS and cryptographic implementations.

The SDK does not operate X accounts or store credentials remotely.

Xquik services enforce server-side authorization and write confirmations.

## Threat Model

Protected assets include credentials, request bodies, response data, and package integrity.

Relevant threats include:

- Credentials exposed through logs, source files, URLs, or untrusted endpoints.
- Malicious responses exploiting parsing, streaming, upload, or retry behavior.
- Dependency or release-workflow compromise.
- Generated-code drift weakening validation or security behavior.
- Unreviewed write actions causing unintended external changes.

Required mitigations include:

- Keep credentials in secret stores or environment variables.
- Use the default HTTPS endpoint outside isolated tests.
- Review custom endpoints before sending credentials.
- Validate untrusted response data before privileged use.
- Confirm account, payload, and audience before write actions.
- Pin workflow actions and production dependencies.
- Run coverage, static analysis, audits, and reproducibility checks.
- Publish through npm trusted publishing with provenance.

## Response Process

Keep exploit details inside GitHub's private vulnerability process.

Add regression tests for every corrected vulnerability.

Identify affected and fixed versions in advisories.

Publish a fixed release before public technical disclosure.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
