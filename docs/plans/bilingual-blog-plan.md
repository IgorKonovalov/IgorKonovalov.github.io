# Implementation Plan: Bilingual (EN / RU) Blog

> **Status: Done** — implemented 2026-07 on branch `feat/i18n-russian-blog` (Phases 0–6). Decisions are recorded in [ADR-001](../adrs/ADR-001-bilingual-blog-i18n.md). This document is the step-by-step implementation guide; kept for historical reference. Remaining work is content-only: the author adds Russian posts into `src/content/blog/ru/`.

## Summary

Add a Russian version of the blog alongside the existing English site using Astro's native i18n. English stays at its current unprefixed URLs; Russian lives under `/ru/`. Posts are organized into `blog/en/` and `blog/ru/` subfolders, paired by filename. No new runtime dependency.

**Estimated effort:** ~1.5–2 days for the framework; near-zero marginal cost per translated post thereafter.

**Guiding constraints (from ADR-001):**

- Existing English URLs must not change.
- Static output, zero-JS-default, Astro-native — no i18n library.
- Translations are independent; a post can exist in one language only.

---

## Phase 0 — Prep

- [ ] Read ADR-001 and confirm the routing + content-model decisions still hold.
- [ ] Create a working branch (e.g. `feat/i18n-russian-blog`).
- [ ] Confirm `docs/architecture/architecture.md` will need an update at the end (new collection layout, i18n routing).

---

## Phase 1 — Content model refactor (no behavior change yet)

Goal: move to locale subfolders and centralize URL derivation **before** adding Russian, so the refactor is verifiable against the existing English site (URLs must be byte-identical after this phase).

- [ ] Move all 14 posts from `src/content/blog/*` into `src/content/blog/en/*` (keep filenames unchanged).
- [ ] Update `content.config.ts`:
  - `glob` pattern stays `**/*.{md,mdx}`, base stays `./src/content/blog` (so `post.id` now begins with `en/`).
  - Optionally add an explicit `lang` field to the Zod schema as a fallback/override; primary source of truth is the path segment.
- [ ] Create `src/lib/postUrl.ts` exporting:
  - `getLocale(post)` → parses leading segment of `post.id` (`en` | `ru`).
  - `getSlug(post)` → strips locale segment **and** the `YYYY-MM-DD-` date prefix.
  - `postHref(post)` → builds `/{ru/ prefix if ru}{category}/YYYY/MM/DD/slug/`. For `en`, no prefix (preserves current URLs exactly).
- [ ] Refactor the four call sites to use the helper:
  - `src/pages/[...slug].astro` — `getStaticPaths()` slug building.
  - `src/pages/index.astro` — `postHref` inline function.
  - `src/pages/archive.astro` — inline href expression.
  - `src/pages/rss.xml.ts` — `link` construction.
- [ ] **Verify:** `astro build`, then diff the generated `dist/` routes against a pre-refactor build. English URLs must be unchanged. RSS and sitemap unchanged.

---

## Phase 2 — i18n config & locale plumbing

- [ ] Add the `i18n` block to `astro.config.mjs`:
  ```js
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    routing: { prefixDefaultLocale: false },
  }
  ```
- [ ] Add the `i18n` option to `@astrojs/sitemap` so it emits hreflang alternates.
- [ ] Create `src/i18n/ui.ts` — `{ en: {...}, ru: {...} }` dictionary + a `t(locale, key)` helper. Keys to cover:
  - Nav: `about`, `archive`
  - Homepage: `home.title`, `home.tagline`
  - Cards / posts: `read`, `postedOn`, `noPosts`
  - Archive: any labels
  - Footer: `footer.description`
- [ ] Add a `getLocaleFromUrl(Astro.url)` helper (or reuse Astro's `Astro.currentLocale`).

---

## Phase 3 — Layouts & components become locale-aware

- [ ] `BaseLayout.astro` — `<html lang>` reflects the current locale; accept/derive locale and pass down as needed.
- [ ] `Header.astro`:
  - Nav labels via `t(locale, …)`.
  - Nav link URLs prefixed with `/ru/` when locale is `ru`.
  - **Language switcher** control: links to the counterpart page. Uses a `getTranslationHref(post/page, targetLocale)` — for posts, look up a same-filename post in the other locale folder; if none exists, link to that locale's home. Render the switcher in both states (available / falls-back-to-home).
- [ ] `Footer.astro` — description string via dictionary.
- [ ] `PostLayout.astro` — "Posted on" label + date formatting via `Intl` with the post's locale.
- [ ] Locale-aware dates everywhere `toLocaleDateString` appears (`index.astro`, `archive.astro`, `PostLayout.astro`): `en-US` / `ru-RU`. Verify Russian output reads naturally (e.g. `14 февраля 2017 г.`).

---

## Phase 4 — Localized pages & feeds

- [ ] `index.astro` — filter posts to the current locale; localized title/tagline. Add the Russian home at `/ru/` (via `getStaticPaths` on a `[locale]`/`ru` route, or a dedicated `src/pages/ru/index.astro` — pick the pattern that keeps a single source of truth).
- [ ] `archive.astro` — same: per-locale filtering, Russian archive at `/ru/archive/`.
- [ ] `about.astro` — author a Russian counterpart at `/ru/about/` (real prose; translate the existing copy). Note the existing "Russian blog" LiveJournal link becomes redundant — decide whether to drop it.
- [ ] RSS — second feed at `/ru/rss.xml` (or parameterize `rss.xml.ts` by locale). Each feed lists only its locale's posts. Update the `<link rel="alternate">` in `BaseLayout.astro` head accordingly (currently points at `/feed.xml`).

---

## Phase 5 — SEO / discoverability

- [ ] `SEO.astro`:
  - `hreflang` alternate links for `en`, `ru`, and `x-default` — only emit the alternate that actually exists for the page.
  - `og:locale` per page.
  - Locale-correct canonical URLs.
- [ ] Confirm sitemap output contains hreflang alternates (Phase 2 config).

---

## Phase 6 — Verify & document

- [ ] `astro build` clean, no warnings.
- [ ] Manual pass: EN home/archive/about/posts unchanged; `/ru/` home/archive/about render; switcher toggles correctly both when a translation exists and when it doesn't; dates localized; both RSS feeds valid.
- [ ] Lighthouse spot-check on a Russian page (no regression).
- [ ] Update `docs/architecture/architecture.md` and the architect skill's `references/architecture-overview.md` to reflect the new collection layout, i18n routing, and `src/i18n/` + `src/lib/postUrl.ts`.
- [ ] Flip ADR-001 status `Proposed → Accepted`.

---

## Files touched (quick index)

| File                                     | Change                                            |
| ---------------------------------------- | ------------------------------------------------- |
| `astro.config.mjs`                       | `i18n` block; sitemap `i18n` option               |
| `content.config.ts`                      | subfolder base; optional `lang` field             |
| `src/content/blog/en/*`, `.../ru/*`      | posts moved / added                               |
| `src/lib/postUrl.ts`                     | **new** — locale + slug + href helper             |
| `src/i18n/ui.ts`                         | **new** — UI string dictionary + `t()`            |
| `src/pages/[...slug].astro`              | use helper; per-locale paths                      |
| `src/pages/index.astro`, `archive.astro` | locale filter, dictionary, dates; `/ru/` variants |
| `src/pages/about.astro`                  | `/ru/about/` counterpart                          |
| `src/pages/rss.xml.ts`                   | per-locale feed(s)                                |
| `src/layouts/BaseLayout.astro`           | dynamic `lang`, feed link                         |
| `src/layouts/PostLayout.astro`           | localized label + date                            |
| `src/components/Header.astro`            | localized nav + language switcher                 |
| `src/components/Footer.astro`            | localized description                             |
| `src/components/SEO.astro`               | hreflang, og:locale, canonical                    |

## Out of scope

- Translating demo internals — demos are language-agnostic; only MDX prose is translated.
- Automated translation. Russian originals come from the author (the `blog-writer` flow runs the opposite direction; register per `[[blog-register-by-genre]]` still applies).
- A third locale — see ADR-001 follow-up if ever needed.
