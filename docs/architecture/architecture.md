# Architecture

Current architecture of the IgorKonovalov.github.io portfolio site.

## System Overview

Astro 5.17.3 static site generating pure HTML with zero client-side JavaScript by default. Interactive demos load vanilla JS only on pages that need it. Deployed to GitHub Pages via GitHub Actions.

The site is **bilingual (English / Russian)** via Astro's native i18n. English is unprefixed (URLs preserved from the Jekyll era); Russian lives under `/ru/`. See the [Internationalization](#internationalization) section and [ADR-001](../adrs/ADR-001-bilingual-blog-i18n.md).

**Integrations**: `@astrojs/mdx` (MDX support for embedding demo components in posts), `@astrojs/sitemap` (sitemap generation, i18n-aware with hreflang alternates), `@astrojs/rss` (per-locale RSS feeds).

## Directory Structure

```
/
├── astro.config.mjs              Astro config (site URL, static output, integrations)
├── tsconfig.json                 TypeScript strict (extends astro/tsconfigs/strict)
├── package.json                  Dependencies and scripts (Yarn, exact versions)
├── eslint.config.js              ESLint configuration
├── .prettierrc                   Prettier configuration
├── .husky/                       Git hooks (pre-commit: lint-staged)
├── .github/workflows/
│   └── deploy.yml                GitHub Actions: build + deploy to Pages
├── src/
│   ├── pages/
│   │   ├── index.astro           Homepage (en) — thin wrapper over HomeView
│   │   ├── about.astro           About page (en)
│   │   ├── archive.astro         Archive (en) — thin wrapper over ArchiveView
│   │   ├── [...slug].astro       Dynamic route for blog posts (both locales)
│   │   ├── rss.xml.ts            RSS feed endpoint (en)
│   │   └── ru/                   Russian routes (index, about, archive, rss.xml)
│   ├── i18n/
│   │   └── ui.ts                 en/ru string dictionary, t(), locale helpers
│   ├── lib/
│   │   ├── postUrl.ts            Single source of truth for post URLs + locale
│   │   └── feed.ts               Shared per-locale RSS builder
│   ├── layouts/
│   │   ├── BaseLayout.astro      HTML shell: <head>, header, footer, Google Fonts
│   │   └── PostLayout.astro      Blog post wrapper: article metadata, schema.org
│   ├── components/
│   │   ├── Header.astro          Site navigation + language switcher
│   │   ├── Footer.astro          Footer with social links
│   │   ├── SEO.astro             Meta tags, Open Graph, og:locale, hreflang
│   │   ├── HomeView.astro        Homepage body (locale-aware, shared en/ru)
│   │   ├── ArchiveView.astro     Archive body (locale-aware, shared en/ru)
│   │   └── demos/
│   │       ├── GameOfLife.astro
│   │       ├── CellularAutomaton.astro
│   │       ├── RandomWalker1.astro
│   │       ├── RandomWalker2.astro
│   │       ├── RandomLinesInShape.astro
│   │       ├── MaurerRose.astro
│   │       ├── MaurerRoseWalker.astro
│   │       ├── IslamicStarPatterns.astro
│   │       └── Phyllotaxis.astro
│   ├── content/
│   │   └── blog/
│   │       ├── en/               English posts (.md and .mdx)
│   │       └── ru/               Russian posts (paired by filename)
│   ├── content.config.ts         Collection schema (Zod validation, glob loader)
│   ├── scripts/
│   │   └── demos/
│   │       ├── game-of-life.js
│   │       ├── cellular-automaton.js
│   │       ├── random-walker-1.js
│   │       ├── random-walker-2.js
│   │       ├── random-lines-in-shape.js
│   │       ├── maurer-rose.js
│   │       ├── maurer-rose-walker.js
│   │       ├── islamic-star-patterns.js
│   │       └── phyllotaxis.js
│   └── styles/
│       ├── tokens.css            Design tokens (colors, typography, spacing, layout)
│       └── global.css            CSS reset + base styles using tokens
├── public/
│   ├── CNAME                     Custom domain for GitHub Pages
│   ├── favicon.ico
│   ├── images/                   Blog post images (by topic subfolder)
│   ├── archive/                  CV (HTML)
│   └── assets/FULL/              Virtual tours + L-systems app
│       ├── BangTao_house/
│       ├── vtour_A1/
│       ├── vtour_P1_fin/
│       └── L-systems/
└── docs/
    ├── architecture/
    │   ├── architecture.md       This file
    │   └── migration-plan.md     Historical migration record (Jekyll → Astro)
    ├── adrs/
    │   └── ADR-001-bilingual-blog-i18n.md   Bilingual i18n decision record
    └── plans/
        └── bilingual-blog-plan.md           i18n implementation plan
```

## Content Model

Blog posts use Astro content collections with a `glob` loader and Zod schema:

```typescript
// src/content.config.ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    demo: z.string().optional(),
  }),
});
```

- Posts without demos are plain `.md` files
- Posts with embedded demos are `.mdx` files that import Astro demo components
- Posts live in locale subfolders (`blog/en/`, `blog/ru/`); the leading path segment of `post.id` is the locale. A translation pair shares the same filename across the two folders.
- URL generation preserves Jekyll-era English paths (`/projects/YYYY/MM/DD/slug/`); Russian posts get a `/ru` prefix. All URL derivation lives in `src/lib/postUrl.ts` (`postHref`, `getLocale`, `getSlug`, `findCounterpart`).

## Component Architecture

### Layouts

`PostLayout.astro` wraps `BaseLayout.astro`. BaseLayout provides the HTML shell (`<html>`, `<head>`, `<body>`), imports Google Fonts and global styles, and renders Header + Footer. PostLayout adds article metadata (date, title, tags) and schema.org structured data.

### Demo Pattern (Two-File)

Each interactive demo consists of two files:

1. **Astro wrapper** (`src/components/demos/DemoName.astro`) — renders the HTML structure (canvas, buttons, inputs) the JS expects, plus a `<script>` tag importing the JS
2. **Vanilla JS** (`src/scripts/demos/demo-name.js`) — the actual demo logic, imported as an ES module

The Astro wrapper is imported in the corresponding `.mdx` blog post:

```mdx
import GameOfLife from '../../components/demos/GameOfLife.astro';

<GameOfLife />
```

JS loads only when the page containing the demo is visited. Pages without demos ship zero JavaScript.

## Internationalization

Bilingual (en / ru) via Astro's native i18n. Decisions are recorded in [ADR-001](../adrs/ADR-001-bilingual-blog-i18n.md).

**Routing** (`astro.config.mjs`): `defaultLocale: 'en'`, `locales: ['en', 'ru']`, `routing: { prefixDefaultLocale: false }`. English URLs stay unprefixed and byte-identical to the Jekyll era; Russian is served under `/ru/`. The current locale is derived from the URL path (`getLocaleFromPath`), not from Astro globals.

**Content model**: locale subfolders under `src/content/blog/`, paired by filename (see Content Model above).

**UI strings** (`src/i18n/ui.ts`): a plain `{ en, ru }` dictionary with a `t(locale, key)` lookup — no i18n library. Dates are formatted per locale via the `Intl` API (`DATE_LOCALE`). Locale-path helpers (`localizePath`, `toggleLocalePath`, `localeHome`, `pageI18n`) live here too.

**Shared views**: `HomeView.astro` and `ArchiveView.astro` hold the page bodies and derive their locale from the URL, so `pages/index.astro` + `pages/ru/index.astro` (and the archive pair) are thin wrappers over one source.

**Language switcher** (`Header.astro`): a compact `RU`/`EN` toggle. It targets the real translation when one exists, else falls back to the other locale's home — never a 404.

**Feeds**: `src/lib/feed.ts` builds a per-locale feed; `pages/rss.xml.ts` (en) and `pages/ru/rss.xml.ts` (ru) each list only their locale's posts.

**SEO** (`SEO.astro`): `og:locale` per page, locale-correct canonicals, and `hreflang` alternates (en / ru / x-default) emitted only when a translation actually exists — static pages always, posts once a counterpart is added. The sitemap emits matching `xhtml:link` alternates.

## Styling Architecture

**Design tokens** (`src/styles/tokens.css`):

- Color palette with light/dark mode via `@media (prefers-color-scheme: dark)`
- Typography scale (1.25 ratio): `--text-xs` through `--text-4xl`
- Spacing scale: `--space-1` through `--space-24`
- Layout widths: 720px (content), 1080px (wide), 1280px (full)
- Fonts: Source Serif 4 (headings), Source Sans 3 (body), JetBrains Mono (code)

**Base styles** (`src/styles/global.css`):

- CSS reset, button styles, base typography
- All values reference design tokens via `var(--token-name)`
- Mobile-first responsive (breakpoints: 640px, 768px, 1024px, 1280px)

**Component styles**: Astro scoped `<style>` blocks within individual components.

## Build & Deploy

GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Triggers on push to `main` or `master`
2. Checks out code, sets up Node 20, caches Yarn
3. `yarn install --frozen-lockfile`
4. `yarn build` → generates `dist/`
5. Uploads `dist/` as Pages artifact
6. Deploys via `actions/deploy-pages`

No Git LFS — virtual tours are stored as regular files.

## DX Tooling

- **TypeScript**: Strict mode via `astro/tsconfigs/strict`
- **ESLint**: `eslint-plugin-astro` + `@typescript-eslint`
- **Prettier**: `prettier-plugin-astro`, checks `.{js,mjs,ts,astro,css,md,mdx,json,yaml}`
- **Husky + lint-staged**: Pre-commit hooks run ESLint fix + Prettier on staged files
- **`astro check`**: TypeScript diagnostics for Astro files

## Key Architectural Decisions

| Decision            | Choice                                        | Rationale                                                                     |
| ------------------- | --------------------------------------------- | ----------------------------------------------------------------------------- |
| Framework           | Astro 5                                       | Island architecture for demos, zero-JS default, markdown-first, static output |
| Demo integration    | Astro wrapper + vanilla JS                    | Minimal changes to existing JS, no framework lock-in                          |
| Content collections | `glob` loader + Zod                           | Type-safe frontmatter, file-based content                                     |
| Styling             | CSS custom properties                         | No build step for styles, auto dark mode, simple tokens                       |
| Output mode         | Static only                                   | GitHub Pages requirement, best performance                                    |
| Package manager     | Yarn with exact versions                      | Reproducible builds, no version drift                                         |
| Virtual tours       | Regular files in `public/`                    | Simpler than LFS, within GitHub Pages limits                                  |
| URL structure       | Preserve Jekyll paths                         | Zero SEO disruption                                                           |
| i18n                | Native Astro, en unprefixed / ru under `/ru/` | Bilingual without a runtime dependency; English URLs preserved (ADR-001)      |
