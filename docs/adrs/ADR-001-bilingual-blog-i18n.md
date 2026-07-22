# ADR-001: Bilingual (English / Russian) Blog via Astro Native i18n

## Status: Accepted

_Implemented 2026-07 on branch `feat/i18n-russian-blog`. English URLs verified byte-identical to the pre-change build; Russian site (`/ru/`) live with language switcher, per-locale RSS, and hreflang. Russian blog posts are added incrementally by the author._

## Context

The site is authored through a Russian → English workflow (the `blog-writer` skill): posts are dictated in Russian, then polished and translated to English for publication. The raw Russian source therefore already exists for most posts but is discarded after translation. We want to publish both languages side-by-side with a language switcher, so Russian-speaking readers get the original and the existing English audience is unaffected.

Two settled architectural principles constrain the solution:

- **URL preservation** — existing English post URLs (`/{category}/YYYY/MM/DD/slug/`, inherited from the Jekyll era) must not change. Any i18n scheme that rewrites them breaks SEO and inbound links.
- **Static-first, zero-JS-default, Astro-native** — no SSR, no new runtime framework, prefer built-in Astro features over dependencies.

The current implementation hardcodes English everywhere: `<html lang="en">`, nav labels, homepage copy, `toLocaleDateString('en-US')`, a single RSS feed, and a flat `src/content/blog/` collection with no language dimension. Four files (`[...slug].astro`, `index.astro`, `archive.astro`, `rss.xml.ts`) independently re-derive the same post URL from frontmatter.

### Options considered

**Routing strategy**

1. **English unprefixed, Russian under `/ru/`** (`defaultLocale: 'en'`, `prefixDefaultLocale: false`). English URLs stay byte-identical; Russian lives at `/ru/{category}/YYYY/MM/DD/slug/`.
2. Prefix both locales (`/en/…` and `/ru/…`). Cleaner symmetry but **rewrites every existing English URL** — violates URL preservation.
3. Query param or subdomain. Non-static, or extra infra — rejected outright.

**Content model** (how a post declares its language and locates its translation)

- **A. Locale subfolders** — `src/content/blog/en/…`, `src/content/blog/ru/…`. Language is derivable from `post.id`; translation pairs share a filename.
- **B. Schema fields** — flat folder, add `lang` + `translationKey` to the Zod schema. More frontmatter discipline per post, manual key management.
- **C. Filename suffix** — `Maurer_rose.ru.mdx`. Fragile slug parsing.

## Decision

Adopt **Astro's native i18n routing** with:

1. **Routing: English unprefixed, Russian under `/ru/`** (option 1). Configure `i18n` in `astro.config.mjs` with `defaultLocale: 'en'`, `locales: ['en', 'ru']`, `routing: { prefixDefaultLocale: false }`.

2. **Content model: locale subfolders** (option A). Existing posts move to `src/content/blog/en/`; Russian originals go to `src/content/blog/ru/` with a **matching filename** to mark a translation pair. Locale is parsed from the leading path segment of `post.id`.

3. **Translations are independent, not lockstep.** A Russian post may exist without an English counterpart and vice versa. Homepage and archive list only the current locale's posts; the language switcher offers the other language **only when that translation exists**, otherwise it links to that locale's home.

4. **UI strings live in a plain TS dictionary** (`src/i18n/ui.ts`, shape `{ en: {...}, ru: {...} }`) — no i18n library dependency. Dates become locale-driven via the `Intl` API (`en-US` / `ru-RU`).

5. **Slug derivation is extracted into one shared helper** (`src/lib/postUrl.ts` or similar) consumed by all four call sites, so the locale-aware URL rule lives in exactly one place.

## Consequences

**Positive**

- Existing English URLs, RSS, and sitemap entries are untouched — URL preservation holds.
- No new runtime dependency; Astro i18n and `Intl` are built in. Static output and zero-JS-default are preserved (the switcher is a plain link).
- Marginal cost per translated post drops to "drop a matching-named file into `blog/ru/`" — routing and the switcher pick it up automatically.
- Demos are unaffected: the `.astro` + `.js` demo pairs render identical output regardless of locale; only surrounding MDX prose is translated.
- hreflang + per-locale RSS make the Russian content independently discoverable.

**Negative / costs**

- One-time refactor moving 14 existing posts into `blog/en/` and updating the `glob` base + slug parsing in four files.
- Every layout/page that emitted a hardcoded English string or date now routes through the dictionary / `Intl`, touching most of `src/`.
- The content model assumes filename = translation key; renaming one side of a pair silently breaks the switcher link (mitigated by the "no-translation → link to home" fallback, which fails soft rather than 404).
- Two RSS feeds and hreflang tags to keep in sync as locales grow.

**Follow-ups**

- Implementation is planned in [`docs/plans/bilingual-blog-plan.md`](../plans/bilingual-blog-plan.md).
- If a third locale is ever added, revisit whether the unprefixed-default asymmetry still pays for itself versus prefixing all locales.
