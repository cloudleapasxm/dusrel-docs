# Dusrel Docs

Public documentation for every Dusrel app and service, at
**https://docs.dusrel.com** (VitePress, EN + Hindi).

> Docs sites always use VitePress — never Astro for a docs site.
> The same 15 docs also live at `dusrel.com/docs/` (both places stay live;
> no redirects between them).

## Local dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # vitepress build docs → docs/.vitepress/dist
npm run preview  # serve the built site
npm test         # vitest run
npx tsc --noEmit # typecheck config + tests
```

## Adding a doc

1. Create the Markdown file: `docs/<slug>.md` (and `docs/hi/<slug>.md`
   for the Hindi translation — **same slug** in both locales).
2. Add one entry to the sidebar in `docs/.vitepress/config.mts`
   (the matching `sidebarEn` / `sidebarHi` group, in order).
3. `npm run build` → check the page renders and the sidebar lists it.

Frontmatter per page (kept from the dusrel.com docs):

```yaml
---
title: "How to create a QR code"
description: "One line, what the page teaches."
category: "tools"    # guides | tools | apps | concepts
type: "how-to"       # tutorial | how-to | reference | explanation
updated: 2026-11-02
---
```

Section images go in `docs/public/docs-sections/<slug>-s<n>.jpg` and are
referenced from the Markdown as `/docs-sections/<slug>-s<n>.jpg`.
Per-doc OG images live in `docs/public/og-docs/<slug>.jpg`.

## Search

Built-in local search (`search: { provider: 'local' }` in the config) —
no server, no Algolia. It indexes all pages at build time.

## SEO

- Built-in sitemap: `sitemap: { hostname: 'https://docs.dusrel.com' }`
  writes `sitemap.xml` at build time. `lastmod` comes from each page's
  `lastUpdated` date (git commit dates), so CI checks out with
  `fetch-depth: 0` — a shallow clone would stamp every page with the
  build date.
- `cleanUrls: true`, `og:site_name`, theme-color `#4d90fe`, favicon
  `/favicon.svg` + `/favicon.ico`.

## Deploy (manual steps — not done by this repo alone)

1. GitHub repo `dusmamud/dusrel-docs` (public, branch `main`).
2. Cloudflare Pages project **`dusrel-docs`** (Direct Upload — the
   deploy workflow builds in GitHub Actions and uploads the built
   `docs/.vitepress/dist/`; Cloudflare does not build).
3. Repo secrets (Settings → Secrets and variables → Actions):
   `CLOUDFLARE_API_TOKEN` (Account → Cloudflare Pages → Edit) and
   `CLOUDFLARE_ACCOUNT_ID`.
4. DNS: `docs` CNAME → the Pages project domain, at the DNS provider
   (Spaceship), then attach the custom domain `docs.dusrel.com` to the
   Pages project.

Until steps 2–3 exist, the Deploy workflow fails at the deploy step —
expected and harmless.
