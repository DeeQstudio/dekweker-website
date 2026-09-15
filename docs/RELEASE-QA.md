# Release QA

## Before a production push

Use Node 22 with registry access:

```bash
npm ci
npx playwright install chromium webkit
npm run verify:release
```

On Linux, install browser system dependencies with `npx playwright install --with-deps chromium webkit`.

`verify:release` runs repository QA, types, lint, unit/architecture tests, the production build, browser tests against `next start`, and a dependency audit. GitHub Actions repeats this on pull requests and pushes to main. Failed browser runs retain screenshots and traces. Vercel's build runs the code checks and production build; the workflow does not itself enforce branch protection or block Vercel deployment.

Commit `package-lock.json` with dependency changes. Review advisories and supported updates; do not use forced audit fixes, dependency overrides or advisory suppression to obtain a passing result.

## What is checked

- Repository QA: payload limits, environment artifacts, content/assets, links, metadata, canonical host, booking navigation, safe areas and image crops.
- Vitest: content relationships, dates, release credits, metadata/sitemaps, email composition, intro/route helpers and CSS ownership. Styles have one root import path and no duplicate selector within the same media scope.
- Chromium and WebKit: ten route examples at widths 320, 390, 760, 834, 1100, 1440, 1920 and 2557. Text ranges must fit the screen; `KWEKER.` must occupy one unbroken line on the profile page.
- Interactions: client navigation and stable typography, menu focus/Escape, record selection/credits/keyboard controls, loaded artwork, gallery/video lifecycle and focus, booking intents, archive filters, interrupted animation recovery and readable content without JavaScript.

Browser engine emulation does not replace checking real devices. Review screenshots when typography, layout or artwork changes; geometric assertions alone do not judge visual quality.

## Responsive conventions

Use safe-area insets for notches and `svh` for the small viewport height supported by the project's browsers. Documentary portraits in wide Live/Media panels use `object-fit: contain`; booking photography has an explicit focal point. Keep title sizing with its component and add a meaningful breakpoint test when repairing a layout regression.
