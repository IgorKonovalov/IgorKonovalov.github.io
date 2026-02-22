# Full Architecture Plan: Jekyll → Astro Migration

## Context

The current site is a Jekyll 3.3.1 portfolio/blog focused on generative art and algorithmic visualization. It has 13 blog posts with 10 interactive JS demos embedded inline, 3 static pages, ~598MB of virtual panoramic tours, and is deployed to GitHub Pages. Jekyll 3.3.1 is outdated (2016), the Ruby toolchain adds friction, and there's no CI/CD pipeline. The goal is to migrate to a modern framework that preserves all existing content and interactivity while enabling a better developer experience and future growth.

### Current Two-Repo Setup

The site currently uses two separate repositories:

| Repo | Purpose | URL |
|------|---------|-----|
| `IgorKonovalov.github.io_source` | Jekyll source code (Markdown, templates, assets) | — |
| `IgorKonovalov.github.io` | Pre-built static HTML output, served by GitHub Pages | igorkonovalov.github.io |

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

| Criterion | Why Astro wins |
|-----------|---------------|
| **Island architecture** | Demos load JS only where needed — content-only pages ship zero JS |
| **Markdown-first** | Content collections with frontmatter, native MDX support |
| **Static output** | Generates pure static HTML — perfect for GitHub Pages |
| **Vanilla JS friendly** | No requirement to wrap demos in React/Vue — can use `<script>` tags directly in `.astro` components |
| **TypeScript built-in** | Aligns with existing skill guidance for new code |
| **Image optimization** | Built-in `<Image>` component with WebP, responsive sizes |
| **Migration path** | Closest conceptual model to Jekyll (file-based routing, markdown content, layouts) |

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
│   │   ├── PostLayout.astro   # Blog post wrapper (date, title, schema.org)
│   │   └── PageLayout.astro   # Static page wrapper
│   ├── components/
│   │   ├── Header.astro       # Site header + navigation
│   │   ├── Footer.astro       # Footer with social links
│   │   ├── PostCard.astro     # Post preview card for homepage
│   │   ├── SEO.astro          # Meta tags, Open Graph, schema.org
│   │   └── demos/             # Demo wrapper components
│   │       ├── GameOfLife.astro
│   │       ├── CellularAutomaton.astro
│   │       ├── MaurerRose.astro
│   │       ├── RandomWalker1.astro
│   │       ├── RandomWalker2.astro
│   │       ├── RandomLinesInShape.astro
│   │       ├── IslamicStarPatterns.astro
│   │       ├── Phyllotaxis.astro
│   │       └── MaurerRoseRevisited.astro
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
│       └── demos/             # Existing demo JS (migrated, minimal changes)
│           ├── game-of-life/
│           │   └── index.ts   # Original JS → TypeScript (optional)
│           ├── cellular-automaton/
│           │   ├── rules.ts
│           │   └── index.ts
│           ├── maurer-rose/
│           │   └── index.ts
│           └── ...
├── public/
│   ├── CNAME                  # Custom domain for GitHub Pages
│   ├── favicon.ico
│   ├── images/                # Blog images (from assets/IMG/)
│   ├── archive/               # CV (from assets/ARCHIVE/)
│   └── tours/                 # Virtual tours (see Section 5)
│       ├── bangtao-house/
│       ├── vtour-a1/
│       └── vtour-p1/
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

const blog = defineCollection({
  type: 'content',
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
  <canvas id="game" width="740" height="600" style="background-color: lightgray"></canvas>
  <br>
  <div class="demo-controls">
    <button id="random">Randomize</button>
    <button id="step">Next Step</button>
    <span>Speed: </span>
    <input type="text" id="speed" value="10">
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
title: "Game of Life"
date: 2017-01-04
tags: ["projects", "generative-art"]
demo: "game-of-life"
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
- **L-systems Generator**: Already a standalone app at `/assets/FULL/L-systems/` → keep as static passthrough in `public/tours/l-systems/`, link from blog post

---

## 5. Virtual Tour Handling

### Problem
Virtual tours total ~598MB. GitHub repo limit is 1GB, and GitHub Pages has a 1GB site size limit. This is a real constraint.

### Approach: Git LFS + Static Passthrough

Tour files are tracked via **Git LFS** to keep the repo lightweight. At build time, LFS files are checked out and placed in `public/tours/` — Astro copies `public/` to build output unchanged. Tours remain self-contained with their own HTML entry points.

**Setup:**
```bash
git lfs install
git lfs track "public/tours/**"
```

**GitHub Actions** must include LFS checkout:
```yaml
- uses: actions/checkout@v4
  with:
    lfs: true
```

**Note:** GitHub LFS has a free tier of 1GB storage + 1GB/month bandwidth. Tours at 598MB fit within storage but may need a data pack ($5/mo for 50GB bandwidth) if the site gets moderate traffic to tour pages.

**URL mapping:**
- `/assets/FULL/BangTao_house/` → `/tours/bangtao-house/` (with redirect from old URL)
- `/assets/FULL/vtour_A1/` → `/tours/vtour-a1/`
- `/assets/FULL/vtour_P1_fin/` → `/tours/vtour-p1/`
- `/assets/FULL/L-systems/` → `/tours/l-systems/`

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
  --font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
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
        with:
          lfs: true
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
- **main** — source code (rename from master)
- Deploy via GitHub Actions → GitHub Pages (no `gh-pages` branch needed with `actions/deploy-pages`)
- The `CNAME` file lives in `public/CNAME` so Astro copies it to `dist/` at build time

---

## 8. URL Preservation Strategy

Configure Astro to generate posts at the same paths Jekyll used:

```typescript
// src/pages/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => {
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

### Phase 1: Project Scaffold
- Initialize Astro project with TypeScript **in `IgorKonovalov.github.io_source`** (the current working repo — development stays here through Phases 1–6)
- Set up directory structure
- Configure `astro.config.mjs` (site URL: `https://igorkonovalov.github.io`, output: static)
- Add `public/CNAME` with `igorkonovalov.github.io` (preserved for GitHub Pages custom domain)
- Port existing Minima CSS into `src/styles/global.css` (direct conversion from SCSS, same look & feel)
- Create `BaseLayout.astro`, `Header.astro`, `Footer.astro`
- **Verify:** `yarn dev` shows a styled shell matching the current site

### Phase 2: Static Pages
- Migrate homepage (index.astro with post listing)
- Migrate about page
- Migrate archive page
- Port SEO/meta tag system
- **Verify:** All 3 pages render correctly, navigation works

### Phase 3: Blog Posts (Text Only)
- Set up content collection with schema
- Migrate all 13 posts as `.md` files (strip demo HTML for now)
- Configure URL generation to match Jekyll paths
- Implement `PostLayout.astro` with date, title, tags
- **Verify:** All 13 posts accessible at correct URLs, post listing works

### Phase 4: Interactive Demos (Simplest First)
- Create demo wrapper components, starting with simplest:
  1. Random Walker 1 (single canvas, minimal controls)
  2. Random Walker 2 (single canvas, minimal controls)
  3. Game of Life (canvas + button controls)
  4. Cellular Automaton (canvas + dropdowns + color pickers)
  5. Phyllotaxis (canvas, responsive)
- Convert those 5 posts from `.md` to `.mdx`
- Migrate demo JS to `src/scripts/demos/` as ES modules
- **Verify:** Each demo renders and is interactive in the blog post

### Phase 5: Interactive Demos (Complex)
- Remaining demos with more complex UI:
  6. Maurer Rose (dual input controls, sliders, checkboxes)
  7. Maurer Rose Revisited (if inline) or link to CodePen
  8. Random Lines in Shape (SVG generation, download)
  9. Islamic Star Patterns (SVG, range sliders, tiling selection)
- L-systems: copy standalone app to `public/tours/l-systems/`, update link
- **Verify:** All demos functional, responsive on mobile

### Phase 6: Static Assets & Tours
- Copy virtual tours to `public/tours/`
- Copy blog images to `public/images/`
- Copy CV to `public/archive/`
- Update all asset references in posts
- Optimize images (WebP via Astro `<Image>`)
- **Verify:** All images load, tour links work, CV accessible

### Phase 7: Build Pipeline & Repo Consolidation
This phase moves the Astro source from the development repo into the live repo and enables automated deployment.

1. **Prepare `IgorKonovalov.github.io` repo:**
   - Create a fresh branch (e.g., `astro-migration`) in `IgorKonovalov.github.io`
   - Remove the old Jekyll-built HTML files from the branch
   - Copy the Astro source code (everything except `.git/`) from `_source` into this branch
2. **Add GitHub Actions workflow** (`.github/workflows/deploy.yml`)
3. **Switch GitHub Pages source:**
   - Go to `IgorKonovalov.github.io` → **Settings → Pages → Source**
   - Change from "Deploy from a branch" to **"GitHub Actions"**
4. **Merge and push** the `astro-migration` branch to `main` (rename from `master` if desired)
5. **Verify deployment:** GitHub Actions runs, builds Astro, deploys to Pages
6. **Verify all URLs** match the old site (spot-check posts, demos, tours, static pages)
- **Verify:** Site live at `igorkonovalov.github.io`, all pages/demos/tours working, `CNAME` preserved

### Phase 8: Cleanup & Polish
- Remove Jekyll files from `IgorKonovalov.github.io` (Gemfile, _config.yml, _layouts/, _includes/, _sass/, _posts/) — these were copied during Phase 7 and are no longer needed
- Update README
- Add sitemap and RSS feed (Astro has plugins: `@astrojs/sitemap`, `@astrojs/rss`)
- Remove Google Analytics UA (deprecated) or migrate to GA4
- Write ADR documenting the migration decision
- **Archive `IgorKonovalov.github.io_source`:** set repo to archived on GitHub (or delete if no longer needed). All development now happens in `IgorKonovalov.github.io`
- **Verify:** Clean repo, no dead files, lighthouse audit passes

### Phase 9: Design System
- Define design tokens in `src/styles/tokens.css` (colors, typography, spacing)
- Migrate global CSS to use CSS custom properties
- Update breakpoints to new system (640/768/1024/1280px)
- Move component styles from global CSS into Astro scoped `<style>` tags
- Redesign visual direction (typography, color palette, component look & feel)
- Style demo wrapper components with consistent controls layout
- **Verify:** Visual consistency across all pages, responsive on all breakpoints

---

## Key Files to Modify/Create

| Action | File |
|--------|------|
| Create | `astro.config.mjs` |
| Create | `src/layouts/BaseLayout.astro` |
| Create | `src/layouts/PostLayout.astro` |
| Create | `src/components/demos/*.astro` (9 wrappers) |
| Create | `src/content/blog/*.md` and `*.mdx` (13 posts) |
| Create | `src/pages/index.astro`, `about.astro`, `archive.astro` |
| Create | `src/styles/tokens.css`, `global.css` |
| Create | `.github/workflows/deploy.yml` |
| Migrate | `assets/JS/*` → `src/scripts/demos/*` (minimal changes) |
| Copy | `assets/FULL/*` → `public/tours/*` |
| Copy | `assets/IMG/*` → `public/images/*` |
| Create | `public/CNAME` (custom domain) |
| Delete (Phase 8) | `Gemfile`, `_config.yml`, `_layouts/`, `_includes/`, `_sass/`, `_posts/` |
| Archive (Phase 8) | `IgorKonovalov.github.io_source` repo (all dev moves to `.github.io` repo) |

## Verification

After each phase, verify with:
- `yarn dev` — local dev server, check all pages
- `yarn build` — ensure static build succeeds
- After Phase 7: check live GitHub Pages deployment
- Final: Lighthouse audit targeting 90+ on Performance, Accessibility, SEO
