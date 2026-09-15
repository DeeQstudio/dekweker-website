# Security

The public release deliberately has a small runtime surface: no database, admin portal, public form endpoint, commerce API or secret-bearing backend service.

`next.config.ts` sets a Content Security Policy plus content-type, referrer, framing and permissions headers. CSP currently allows only first-party resources, the Vercel telemetry endpoints and privacy-enhanced YouTube frames required by the live site.

Only variables prefixed with `NEXT_PUBLIC_` may be added to browser code. Do not commit `.env.local`, credentials or service tokens.

## Dependency review, 2026-09-15

The previous lockfile reported five vulnerable packages: Next.js (critical), sharp and js-yaml (high), and Vitest with its mocker (moderate). Updated Next.js and eslint-config-next to 16.3.5, Vitest to 4.1.11, and the affected transitive packages within their supported ranges. No npm `overrides`, forced audit fixes or ignored advisories are used.

Relevant advisories: [Next.js on Windows](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36), [image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4), [Vitest mocker](https://github.com/advisories/GHSA-82fw-gwwq-j7x9).

`npm run audit` checks all dependencies, including development tooling. A clean audit means no known advisories reported by the registry at that time; it is not a guarantee that the application has no security defects.

The static rendering setup currently requires inline scripts/styles in CSP. It does not allow production `unsafe-eval`; dynamic input is not inserted into executable scripts. A nonce-based policy would require a separate rendering change and has not been claimed as part of this cleanup.
