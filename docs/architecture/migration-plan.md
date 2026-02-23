# Full Architecture Plan: Jekyll → Astro Migration

> **Status: Completed** — Migration finished through all 9 phases. This document is preserved as a historical record of the migration decisions. For current architecture documentation, see [architecture.md](architecture.md).

## Context

The current site is a Jekyll 3.3.1 portfolio/blog focused on generative art and algorithmic visualization. It has 13 blog posts with 10 interactive JS demos embedded inline, 3 static pages, ~598MB of virtual panoramic tours, and is deployed to GitHub Pages. Jekyll 3.3.1 is outdated (2016), the Ruby toolchain adds friction, and there's no CI/CD pipeline. The goal is to migrate to a modern framework that preserves all existing content and interactivity while enabling a better developer experience and future growth.

### Current Two-Repo Setup

The site currently uses two separate repositories:

| Repo                             | Purpose                                              | URL                     |
| -------------------------------- | ---------------------------------------------------- | ----------------------- |
| `IgorKonovalov.github.io_source` | Jekyll source code (Markdown, templates, assets)     | —                       |
| `IgorKonovalov.github.io`        | Pre-built static HTML output, served by GitHub Pages | igorkonovalov.github.io |

The workflow is manual: edit source in `_source` repo → run `jekyll build` → copy output to `IgorKonovalov.github.io` → push. GitHub Pages serves `IgorKonovalov.github.io` directly from the `master` branch because `<username>.github.io` repos use branch-based deployment by default.

### Post-Migration: Single Repo

After migration, **only `IgorKonovalov.github.io` is needed.** Astro source code goes directly into this repo, and GitHub Actions builds and deploys automatically — no manual build step, no second repo.

```
Before (Jekyll):                      After (Astro):

_source repo ──(manual build)──►      IgorKonovalov.github.io
  .github.io repo ──► GitHub Pages      ├── src/          (Astro source)
                                         ├── .github/      (CI/CD)
                                         └── ──► GitHub Actions ──► GitHub Pages
```

---

## 1. Framework: Astro

**Rationale:** Astro is the strongest fit for this site's specific needs:

| Criterion               | Why Astro wins                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| **Island architecture** | Demos load JS only where needed — content-only pages ship zero JS                                   |
| **Markdown-first**      | Content collections with frontmatter, native MDX support                                            |
| **Static output**       | Generates pure static HTML — perfect for GitHub Pages                                               |
| **Vanilla JS friendly** | No requirement to wrap demos in React/Vue — can use `<script>` tags directly in `.astro` components |
| **TypeScript built-in** | Aligns with existing skill guidance for new code                                                    |
| **Image optimization**  | Built-in `<Image>` component with WebP, responsive sizes                                            |
| **Migration path**      | Closest conceptual model to Jekyll (file-based routing, markdown content, layouts)                  |

**Why not the others:**

- **Next.js** — Ships React runtime to every page, overkill for content-first site with vanilla JS demos
- **Hugo** — Go templates are verbose, no component model for wrapping interactive demos
- **11ty** — Good Jekyll successor but lacks built-in island architecture for lazy-loading demos

---

## 2. Project Directory Structure

```
/
├── astro.config.mjs          # Astro configuration
├── tsconfig.json              # TypeScript config
├── package.json
├── .github/workflows/
│   └── deploy.yml             # GitHub Actions deploy pipeline
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro   # <html>, <head>, <body> shell
│   │   └── PostLayout.astro   # Blog post wrapper (date, title, schema.org)
│   ├── components/
│   │   ├── Header.astro       # Site header + navigation
│   │   ├── Footer.astro       # Footer with social links
│   │   ├── SEO.astro          # Meta tags, Open Graph, schema.org
│   │   └── demos/             # Demo wrapper components
│   │       ├── GameOfLife.astro
│   │       ├── CellularAutomaton.astro
│   │       ├── MaurerRose.astro
│   │       ├── MaurerRoseWalker.astro
│   │       ├── RandomWalker1.astro
│   │       ├── RandomWalker2.astro
│   │       ├── RandomLinesInShape.astro
│   │       ├── IslamicStarPatterns.astro
│   │       └── Phyllotaxis.astro
│   ├── content/
│   │   └── blog/              # Content collection
│   │       ├── 2016-12-31-hello-world.md
│   │       ├── 2017-01-04-game-of-life.mdx    # MDX for demos
│   │       ├── 2017-01-20-cellular-automation.mdx
│   │       └── ... (13 posts total)
│   ├── pages/
│   │   ├── index.astro        # Homepage (post listing)
│   │   ├── about.astro        # About page
│   │   ├── archive.astro      # Archive page
│   │   └── [...slug].astro    # Dynamic blog post routes
│   ├── styles/
│   │   ├── global.css         # Ported Minima CSS (Phases 1–7), then refactored (Phase 9)
│   │   └── tokens.css         # Design tokens — added in Phase 9
│   └── scripts/
│       └── demos/             # Demo JS (vanilla, ES modules)
│           ├── game-of-life.js
│           ├── cellular-automaton.js
│           ├── random-walker-1.js
│           ├── random-walker-2.js
│           ├── random-lines-in-shape.js
│           ├── maurer-rose.js
│           ├── maurer-rose-walker.js
│           ├── islamic-star-patterns.js
│           └── phyllotaxis.js
├── public/
│   ├── CNAME                  # Custom domain for GitHub Pages
│   ├── favicon.ico
│   ├── images/                # Blog images (from assets/IMG/)
│   ├── archive/               # CV (from assets/ARCHIVE/)
│   └── assets/FULL/           # Virtual tours (static passthrough)
│       ├── BangTao_house/
│       ├── vtour_A1/
│       ├── vtour_P1_fin/
│       └── L-systems/
└── docs/
    └── architecture/          # ADRs and this plan
```

---

## 3. Content Migration Strategy

### Blog Posts

**Frontmatter mapping:**

```yaml
# Jekyll (before)                    # Astro (after)
layout: post                         # Removed (handled by content collection config)
title: "Game of Life"                title: "Game of Life"
date: 2017-01-04 17:36:55 +0300      date: 2017-01-04
categories: projects                  tags: ["projects", "generative-art"]
comments: true                        # Removed (Disqus deprecated)
                                      description: "Conway's Game of Life implementation"
                                      demo: "game-of-life"  # Links to demo component
```

**Content conversion:**

- Posts WITHOUT demos → plain `.md` files (7 posts: hello-world, random-walker-1, random-walker-2, phyllotaxis, maurer-rose-revisited-sep, arduino-node, and maurer-rose-revisited-mar)
- Posts WITH inline demos → `.mdx` files that import Astro demo components (6 posts: game-of-life, cellular-automation, maurer-rose, random-lines-in-shape, islamic-star-patterns, l-systems-generator)
- Liquid template syntax (`{{ }}`, `{% %}`) → removed or converted to MDX expressions
- Jekyll-specific image paths (`/assets/IMG/...`) → `/images/...`

### Static Pages

- `index.md` → `src/pages/index.astro` (queries content collection, renders post list)
- `about.md` → `src/pages/about.astro`
- `archive.md` → `src/pages/archive.astro` (groups posts by year programmatically)

### Content Collection Config

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

export const collections = { blog };
```

---

## 4. Interactive Demo Integration (Key Architecture Decision)

### Approach: Astro Component Wrappers + Dynamic Script Import

Each demo gets a thin `.astro` wrapper component that:

1. Renders the exact HTML structure the demo JS expects (canvas, buttons, inputs with specific IDs)
2. Loads the demo script via `<script>` tag with `is:inline` or dynamic import
3. Uses `client:visible` directive for lazy loading (JS only loads when scrolled into view)

**Example — Game of Life wrapper:**

```astro
<!-- src/components/demos/GameOfLife.astro -->
<div class="demo-container" id="game-of-life-demo">
  <canvas id="game" width="740" height="600" style="background-color: lightgray"
  ></canvas>
  <br />
  <div class="demo-controls">
    <button id="random">Randomize</button>
    <button id="step">Next Step</button>
    <span>Speed: </span>
    <input type="text" id="speed" value="10" />
    <button id="start" class="button-primary">Start</button>
    <button id="pause">Pause</button>
    <button id="clear">Clear</button>
  </div>
</div>

<script>
  import '/src/scripts/demos/game-of-life/index.js';
</script>
```

**In the MDX blog post:**

```mdx
---
title: 'Game of Life'
date: 2017-01-04
tags: ['projects', 'generative-art']
demo: 'game-of-life'
---

import GameOfLife from '../../components/demos/GameOfLife.astro';

Here's my implementation of Conway's Game of Life...

<GameOfLife />

The algorithm works by...
```

### Demo JS Migration

**Minimal changes needed to existing demo JS:**

- Wrap in a self-executing function or ES module to avoid global namespace pollution
- Ensure DOM queries run after the component mounts (use `DOMContentLoaded` or scope queries to the demo container)
- Optionally convert to TypeScript for type safety (can be done incrementally)
- Keep as vanilla JS — no need to rewrite in React/Vue

**Demo-specific notes:**

- **Cellular Automaton**: Has 2-file dependency (rules.js loaded before index.js) → merge into single module with `import`
- **Islamic Star Patterns & Random Lines**: SVG-based, use `createElementNS` — works as-is
- **L-systems Generator**: Already a standalone app → kept as static passthrough in `public/assets/FULL/L-systems/`, linked from blog post

---

## 5. Virtual Tour Handling

### Problem

Virtual tours total ~598MB. GitHub repo limit is 1GB, and GitHub Pages has a 1GB site size limit. This is a real constraint.

### Approach: Static Passthrough

Tour files are stored as regular files in `public/assets/FULL/` — Astro copies `public/` to build output unchanged. Tours remain self-contained with their own HTML entry points.

> **Note:** Git LFS was initially evaluated for tour storage but later removed (commit `055dd3d5`). Tours are stored as regular files, which is simpler and avoids LFS bandwidth costs.

**Tour locations (preserving original paths):**

- `/assets/FULL/BangTao_house/`
- `/assets/FULL/vtour_A1/`
- `/assets/FULL/vtour_P1_fin/`
- `/assets/FULL/L-systems/`

---

## 6. Styling Architecture

### Strategy: Port existing styles first, design system later

During the migration (Phases 1–7), port the existing Minima SCSS as plain CSS into `src/styles/global.css` — keep the same look and feel so the migration is purely a framework swap. This makes every phase visually verifiable against the current site.

After the functional migration is complete (Phase 9), build a proper design system with tokens, new visual direction, and scoped component styles. At that point you'll have a fully working site to iterate against with real content and demos.

### Phase 1–7: Ported Styles

**Global styles** (`src/styles/global.css`):

- Direct port of Minima's `_base.scss`, `_layout.scss`, `_syntax-highlighting.scss` as plain CSS
- Replace SCSS variables with hardcoded values (or minimal CSS custom properties for convenience)
- Keep existing breakpoints (600px, 800px) to match current behavior
- Demo-specific `<style>` blocks from posts move into each demo wrapper component

### Phase 9: Design System (post-migration)

Once the site is fully functional in Astro, build the design system:

**Design tokens** (`src/styles/tokens.css`):

```css
:root {
  /* Colors */
  --color-text: #111;
  --color-bg: #fdfdfd;
  --color-brand: #2a7ae2;
  --color-grey: #828282;
  --color-grey-light: #c5c5c5;
  --color-grey-dark: #3b3b3b;

  /* Typography */
  --font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-size-base: 1rem;
  --line-height: 1.5;

  /* Spacing */
  --spacing: 1.875rem;

  /* Layout */
  --content-width: 50rem;
}
```

**Updated breakpoints** (aligned with skill guidance):

- Mobile: < 640px
- Tablet: < 768px
- Desktop: < 1024px
- Wide: < 1280px

**Component styling:** Migrate from global CSS to Astro scoped `<style>` tags per component.

**This phase is where the visual redesign happens** — new typography, color palette, spacing, component look & feel — all informed by the real site running in Astro.

---

## 7. Build & Deployment Pipeline

### Repo Consolidation Strategy

The migration moves from two repos to one. All Astro source code will live in `IgorKonovalov.github.io` — the repo GitHub Pages is already configured to serve.

**Why this works:** GitHub Pages supports two deployment methods:

1. **Branch-based** (current) — serves static files from a branch directly
2. **GitHub Actions** (after migration) — a workflow builds the site and uploads an artifact that Pages serves

By switching to method 2, the repo can contain source code (not build output), and the build happens in CI. No `gh-pages` branch or second repo is needed.

**Steps to switch:**

1. Develop the Astro site in `IgorKonovalov.github.io_source` (Phases 1–6)
2. When ready to go live (Phase 7): push Astro source into `IgorKonovalov.github.io`, replacing the old built HTML
3. In GitHub repo **Settings → Pages → Source**: change from "Deploy from a branch" to **"GitHub Actions"**
4. Push triggers the workflow below → site deploys automatically
5. After verifying: archive or delete `IgorKonovalov.github.io_source`

**Custom domain** (`igorkonovalov.github.io`) stays on the same repo — no DNS or CNAME changes needed. Keep the existing `CNAME` file in the repo root (Astro copies it from `public/CNAME`).

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: yarn install --frozen-lockfile
      - run: yarn build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Branch Strategy

- **master** — source code
- Deploy via GitHub Actions → GitHub Pages (no `gh-pages` branch needed with `actions/deploy-pages`)
- The `CNAME` file lives in `public/CNAME` so Astro copies it to `dist/` at build time

---

## 8. URL Preservation Strategy

Configure Astro to generate posts at the same paths Jekyll used:

```typescript
// src/pages/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => {
    // Jekyll URL: /projects/2017/01/04/Game-of-Life.html
    // Generate matching path
    const { date, tags } = post.data;
    const category = tags?.[0] || 'personal';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const slug = post.slug; // from filename
    return {
      params: { slug: `${category}/${year}/${month}/${day}/${slug}` },
      props: { post },
    };
  });
}
```

This generates `/projects/2017/01/04/Game-of-Life/index.html` which GitHub Pages serves at `/projects/2017/01/04/Game-of-Life` — matching the old Jekyll URLs.

**Decision:** Exact URL matching. Zero SEO disruption, simplest implementation. Cleaner URLs can be introduced later if desired.

---

## 9. Migration Phases

> All phases completed. Checklists marked `[x]` for reference.

### Phase 1: Project Scaffold [x]

- [x] Initialize Astro project with TypeScript
- [x] Set up directory structure
- [x] Configure `astro.config.mjs` (site URL: `https://igorkonovalov.github.io`, output: static)
- [x] Add `public/CNAME` with `igorkonovalov.github.io` (preserved for GitHub Pages custom domain)
- [x] Port existing Minima CSS into `src/styles/global.css` (direct conversion from SCSS, same look & feel)
- [x] Create `BaseLayout.astro`, `Header.astro`, `Footer.astro`

### Phase 2: Static Pages [x]

- [x] Migrate homepage (index.astro with post listing)
- [x] Migrate about page
- [x] Migrate archive page
- [x] Port SEO/meta tag system

### Phase 3: Blog Posts (Text Only) [x]

- [x] Set up content collection with schema (glob loader + Zod)
- [x] Migrate all 13 posts as `.md` files
- [x] Configure URL generation to match Jekyll paths
- [x] Implement `PostLayout.astro` with date, title, tags

### Phase 4: Interactive Demos (Simplest First) [x]

- [x] Create demo wrapper components:
  1. Random Walker 1 (single canvas, minimal controls)
  2. Random Walker 2 (single canvas, minimal controls)
  3. Game of Life (canvas + button controls)
  4. Cellular Automaton (canvas + dropdowns + color pickers)
  5. Phyllotaxis (canvas, responsive)
- [x] Convert those 5 posts from `.md` to `.mdx`
- [x] Migrate demo JS to `src/scripts/demos/` as ES modules

### Phase 5: Interactive Demos (Complex) [x]

- [x] Maurer Rose (dual input controls, sliders, checkboxes)
- [x] Maurer Rose Walker
- [x] Random Lines in Shape (SVG generation, download)
- [x] Islamic Star Patterns (SVG, range sliders, tiling selection)
- [x] L-systems: standalone app in `public/assets/FULL/L-systems/`

### Phase 6: Static Assets & Tours [x]

- [x] Copy virtual tours to `public/assets/FULL/`
- [x] Copy blog images to `public/images/`
- [x] Copy CV to `public/archive/`
- [x] Update all asset references in posts

### Phase 7: Build Pipeline & Repo Consolidation [x]

- [x] Astro source code in `IgorKonovalov.github.io` repo
- [x] GitHub Actions workflow (`.github/workflows/deploy.yml`)
- [x] GitHub Pages source set to GitHub Actions
- [x] Site deployed on `master` branch
- [x] All URLs verified against old site

### Phase 8: Cleanup & Polish [x]

- [x] Jekyll files removed
- [x] Sitemap (`@astrojs/sitemap`) and RSS feed (`@astrojs/rss`) added
- [x] Google Analytics UA removed
- [x] Single repo — `IgorKonovalov.github.io_source` no longer needed

### Phase 9: Design System [x]

- [x] Design tokens in `src/styles/tokens.css` (colors, typography, spacing)
- [x] Global CSS uses CSS custom properties
- [x] Breakpoints updated (640/768/1024/1280px)
- [x] Visual direction redesigned (Source Serif 4, Source Sans 3, JetBrains Mono)
- [x] Dark mode via `prefers-color-scheme`

---

## Key Files Created During Migration

| File                                                                       | Status                         |
| -------------------------------------------------------------------------- | ------------------------------ |
| `astro.config.mjs`                                                         | Created                        |
| `src/layouts/BaseLayout.astro`, `PostLayout.astro`                         | Created                        |
| `src/components/demos/*.astro` (9 wrappers)                                | Created                        |
| `src/content/blog/*.md` and `*.mdx` (13 posts)                             | Migrated                       |
| `src/pages/index.astro`, `about.astro`, `archive.astro`, `[...slug].astro` | Created                        |
| `src/styles/tokens.css`, `global.css`                                      | Created                        |
| `.github/workflows/deploy.yml`                                             | Created                        |
| `src/scripts/demos/*.js` (9 scripts)                                       | Migrated from `assets/JS/`     |
| `public/assets/FULL/*`                                                     | Copied from old `assets/FULL/` |
| `public/images/*`                                                          | Copied from old `assets/IMG/`  |
| `public/CNAME`                                                             | Created                        |
| Jekyll files (`Gemfile`, `_config.yml`, `_layouts/`, etc.)                 | Deleted                        |
