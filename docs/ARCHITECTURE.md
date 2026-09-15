# KWKR architecture

## Scope

This repository is the live public website for De Kweker. It contains only the public Next.js application and the first-party content/assets required to render it. Future commerce, CMS, database and booking-form experiments are intentionally not part of this release branch.

## Runtime

- Next.js App Router renders the public routes and metadata.
- `src/content/verified.ts` is the reviewed production content source.
- `src/lib/content/repository.ts` is the small read boundary used by pages and structured data.
- `SiteMotion` owns the header, scroll progress and bounded image depth; it refreshes elements on pathname changes and responds to motion/pointer preferences.
- `RouteTransition` owns internal page-transition choreography.
- Booking navigation goes to `/booking`; the final contact action uses the visitor's mail client.

## Public routes

`/`, `/muziek`, `/muziek/[slug]`, `/live`, `/live/[slug]`, `/archief`, `/media`, `/de-kweker`, `/booking`, `/contact`, `/privacy`, `/voorwaarden` plus metadata routes, RSS and the image sitemap. Social metadata uses the reviewed static 1200 × 630 brand image.

The canonical origin is always `https://kwkr.be`; `www.kwkr.be` permanently redirects to the non-www host. Preview deployments remain non-indexable and still point canonical metadata at production.

## Data and third parties

The live application does not require a database, CMS, payment provider or transactional mail service. The only runtime integrations are Vercel Analytics/Speed Insights and privacy-enhanced YouTube embeds on the media page.

## Stylesheet ownership

`src/app/globals.css` is an import manifest loaded only by the root layout. `src/styles/` owns base tokens, shared layout, navigation, music, live, media, home, profile, booking and motion. Route components never import competing global sheets.

Edit the existing selector in its owner. Keep its responsive/state variants there; do not append a correction sheet or repeat classes to raise specificity. The explicit `.page-hero.index-hero` modifier distinguishes compact index headers from generic page headers. `!important` is reserved for the reduced-motion accessibility boundary. Tests reject duplicate selectors within a media scope, duplicate declarations, repeated class specificity and extra global imports.
