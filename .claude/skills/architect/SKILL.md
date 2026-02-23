---
name: architect
description: 'Review and evolve technical architecture for a portfolio/blog site built with Astro 5. Use when: (1) Planning new features that affect project structure, (2) Evaluating new dependencies or integrations, (3) Reviewing architectural decisions, (4) Optimizing build/deploy pipeline, (5) Designing how new interactive demos or content types integrate, (6) Conducting code health reviews, (7) Documenting Architecture Decision Records.'
---

# Architect — Portfolio Site Architecture

Guide architecture decisions for an Astro 5 portfolio/blog with interactive JS demos, deployed to GitHub Pages.

## Current Architecture Snapshot

**Framework**: Astro 5.17.3 — static output, zero JS by default, MDX + sitemap integrations.

**Project structure**:

```
src/
  pages/              index, about, archive, [...slug], rss.xml.ts
  layouts/            BaseLayout.astro, PostLayout.astro
  components/         Header, Footer, SEO
    demos/            9 Astro wrappers (GameOfLife, CellularAutomaton, etc.)
  content/blog/       13 posts (.md + .mdx)
  content.config.ts   Blog collection — glob loader, Zod schema
  scripts/demos/      9 vanilla JS scripts (game-of-life.js, etc.)
  styles/             tokens.css (design tokens), global.css (base styles)
public/
  assets/FULL/        Virtual tours + L-systems (static passthrough)
  images/             Blog post images
docs/architecture/    architecture.md (current state), migration-plan.md (historical)
```

**Key patterns**:

- **Content collections**: `glob` loader with Zod validation (`title`, `date`, `tags?`, `description?`, `demo?`)
- **Demo integration**: Two-file pattern — `.astro` wrapper renders HTML structure, `<script>` imports `.js` logic
- **Styling**: CSS custom properties in `tokens.css`, auto dark mode via `prefers-color-scheme`, mobile-first breakpoints
- **Deployment**: GitHub Actions → GitHub Pages (Node 20, Yarn, no LFS)
- **URL structure**: Preserves Jekyll-era paths (`/projects/YYYY/MM/DD/slug/`)

For full details, see [references/architecture-overview.md](references/architecture-overview.md) and `docs/architecture/architecture.md`.

## Core Workflow

### 1. Evaluate Proposed Changes

Before adding features, dependencies, or new patterns:

- Does this change align with the site's static-first, zero-JS-default philosophy?
- Does it fit within existing directory structure and naming conventions?
- What is the impact on build time, bundle size, and complexity?
- Could this be achieved with existing tools/patterns instead of adding new ones?

### 2. Design Integration

When adding new content types, demos, or pages:

- **New demo**: Follow the two-file pattern (`.astro` wrapper + `.js` script). Add component to `src/components/demos/`, script to `src/scripts/demos/`, import in `.mdx` post.
- **New content type**: Add a new collection in `content.config.ts` with Zod schema and `glob` loader.
- **New integration**: Add to `astro.config.mjs` integrations array. Prefer Astro-native integrations.
- **New page**: Add to `src/pages/`. Static pages as `.astro`, content-driven pages with `getStaticPaths()`.

### 3. Review Code Health

Periodically assess:

- Are dependencies up to date? (Astro, ESLint, Prettier, TypeScript)
- Is there unused code, dead routes, or orphaned assets?
- Are all demo scripts loading correctly?
- Does the build still complete without warnings?
- Is the design system being used consistently (no magic numbers, no hardcoded colors)?

### 4. Document Decisions

Use Architecture Decision Records for significant choices. Save to `docs/architecture/`.

ADR format:

```markdown
# ADR-NNN: [Title]

## Status: [Proposed | Accepted | Deprecated]

## Context

[Why is this decision needed?]

## Decision

[What was decided]

## Consequences

[Positive and negative outcomes]
```

## Architectural Principles

These are settled decisions. Deviations should be documented as ADRs.

| Principle                 | Detail                                                                        |
| ------------------------- | ----------------------------------------------------------------------------- |
| Zero-JS by default        | Pages ship no client JavaScript unless they contain an interactive demo       |
| Vanilla JS for demos      | Demo scripts are plain JS with ES module imports, not framework components    |
| Static output only        | No SSR — `output: 'static'` in Astro config, GitHub Pages serves static files |
| Content collections       | Blog uses `glob` loader + Zod schema, not filesystem routing                  |
| CSS custom properties     | Design tokens in `tokens.css`, no Sass/Less/Tailwind                          |
| Auto dark mode            | `prefers-color-scheme` media query in tokens, no toggle                       |
| Exact dependency versions | No `^` or `~` in package.json, Yarn only                                      |
| URL preservation          | Blog posts generate at original Jekyll paths                                  |

## Architecture Quality Checklist

**Completed:**

- [x] Pages generate static HTML (no client JS unless interactive)
- [x] TypeScript configured (strict mode)
- [x] All 13 blog posts migrated
- [x] 9 JS demos functional as Astro components
- [x] GitHub Actions builds and deploys
- [x] RSS feed generated (`rss.xml.ts`)
- [x] Sitemap generated (`@astrojs/sitemap`)
- [x] Design system tokens in place
- [x] Dark mode via `prefers-color-scheme`
- [x] URL structure preserves Jekyll paths
- [x] Pre-commit hooks (ESLint + Prettier)

**Outstanding:**

- [ ] Lighthouse audit 90+ on all categories
- [ ] Images optimized (WebP via Astro `<Image>` component)
- [ ] Fonts subset and preloaded
- [ ] Bundle size budgeted per page
- [ ] Preview builds for PRs

## Reference Files

### [references/architecture-overview.md](references/architecture-overview.md)

Detailed architecture reference with directory map, patterns, conventions, and evolution guide.

**When to read**: Before making any architectural change. Contains the authoritative project structure and settled patterns.
