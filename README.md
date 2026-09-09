# KWKR

Production source for **kwkr.be**, the official De Kweker website.

## Requirements

- Node.js 22.x
- npm

## Local development

```bash
npm install
npm run dev
```

On Windows, `START-KWKR-DEV.bat` performs the same setup and opens localhost when the dev server is ready.

## Release verification

```bash
npm run verify
```

This runs repository QA, TypeScript, ESLint, Vitest and a real Next.js production build. Vercel also runs those checks because they are part of the `build` script.

## Production architecture

The live branch is intentionally lean. Verified artist/release/event/media content is version-controlled in `src/content/verified.ts`; the public site has no database, CMS, shop backend or booking-form backend. Booking navigation ends on `/booking`, where visitors can open a prefilled e-mail request.

See `docs/ARCHITECTURE.md`, `docs/MOTION.md`, `docs/RELEASE-QA.md` and `docs/SECURITY.md`.

## SEO verification

Run `npm run seo:audit` to check the deployed site's HTTP responses, sitemap pages, canonicals, crawler directives, internal links, JSON-LD syntax, sitemap images, redirects and 404s. To check a running local production build, use `npm run seo:audit -- http://localhost:3127` with its port. The audit does not measure Google's index or rankings.

See [the SEO audit and Search Console follow-up](docs/SEO-AUDIT.md).
