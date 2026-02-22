---
name: architect
description: "Plan and review technical architecture for migrating a Jekyll portfolio/blog site to a modern static site framework. Use when: (1) Evaluating or choosing a framework (Astro, Next.js, Hugo, etc.), (2) Planning the migration strategy from Jekyll, (3) Designing project structure and directory layout, (4) Making build/tooling decisions (bundler, CSS approach, TypeScript), (5) Planning content management (MDX, markdown, CMS), (6) Designing how interactive JS demos integrate with the new stack, (7) Reviewing or documenting architectural decisions."
---

# Architect - Static Site Migration

Guide architecture decisions for migrating a Jekyll 3.3.1 portfolio/blog site to a modern framework, deployed to GitHub Pages.

## Core Workflow

### 1. Understand Requirements

Before making architecture decisions:
- What content types exist? (blog posts, interactive demos, virtual tours, static pages)
- What interactivity is needed? (canvas-based JS demos, embedded simulations)
- What's the content authoring workflow? (markdown files in repo, CMS, hybrid?)
- Performance goals? (lighthouse scores, bundle size budget)
- What existing content must be preserved during migration?

### 2. Evaluate Framework

When framework choice is not yet decided, evaluate against these criteria:

| Criterion | Weight | Questions |
|-----------|--------|-----------|
| Static output | Must | Can it generate fully static HTML for GitHub Pages? |
| Markdown/MDX | Must | Does it support markdown content with frontmatter? |
| Interactive islands | Must | Can JS demos (canvas, p5.js) be embedded without shipping JS for the whole page? |
| Build performance | High | How fast does it build 20-50 pages? |
| Developer experience | High | TypeScript support, hot reload, clear conventions? |
| Ecosystem | Medium | Component libraries, plugins, community size? |
| Learning curve | Medium | How fast can a developer become productive? |

Framework candidates to evaluate - see [references/framework-comparison.md](references/framework-comparison.md) for detailed analysis:
- **Astro** - content-first, island architecture, multi-framework support
- **Next.js (static export)** - React ecosystem, SSG mode, large community
- **Hugo** - fastest builds, Go templates, pure static
- **11ty (Eleventy)** - flexible, JS-based, minimal opinions

### 3. Design Project Structure

Plan directory layout following the chosen framework's conventions:

Key organizational decisions:
- Where do blog posts live? (content collections, pages directory, separate content folder)
- Where do interactive demos live? (as components, standalone pages, embedded in posts)
- How is styling organized? (global CSS, CSS modules, utility-first, component-scoped)
- Where do static assets go? (images, fonts, demo assets)
- How are shared layouts/components organized?

See [references/migration-guide.md](references/migration-guide.md) for Jekyll-to-modern mapping.

### 4. Plan Content Migration

Map Jekyll content patterns to the new framework:

| Jekyll Pattern | Modern Equivalent |
|----------------|-------------------|
| `_posts/YYYY-MM-DD-title.md` | Content collection or pages with date in frontmatter |
| `_layouts/*.html` | Layout components |
| `_includes/*.html` | Reusable components |
| `_sass/**/*.scss` | CSS modules, global styles, or utility classes |
| `_config.yml` | Framework config file |
| Liquid templates `{{ "{{ var " }}}}` | JSX, Astro templates, or framework-specific syntax |
| `assets/JS/*` standalone demos | Interactive components or standalone pages |
| `assets/FULL/*` virtual tours | Static assets or dedicated pages |

### 5. Design Interactive Demo Integration

The site's JS demos (Game of Life, Maurer Rose, etc.) are a key architectural challenge:

**Options to evaluate:**
- **Island components** - wrap each demo as a framework component, loaded only when visible
- **Standalone pages** - keep demos as separate HTML pages, link from the main site
- **Hybrid** - some demos inline in posts (island), others as full-page experiences
- **iframes** - embed existing demos without rewriting, at cost of DX and styling cohesion

**Considerations:**
- Demos use raw Canvas API, p5.js, or vanilla JS
- Some are compute-heavy (cellular automata, particle systems)
- Should load lazily to avoid impacting page performance
- May benefit from modern tooling (TypeScript, ES modules) during migration

### 6. Deployment Architecture

**Target: GitHub Pages**

Constraints:
- Static files only (no server-side rendering at request time)
- Build via GitHub Actions
- Custom domain support via CNAME
- Size limits: 1GB repository, 100MB per file

Architecture decisions:
- **Build pipeline**: GitHub Actions workflow to build and deploy
- **Branch strategy**: source on `main`, build output to `gh-pages` or GitHub Actions deploy
- **Asset optimization**: image compression, font subsetting in build pipeline
- **URL structure**: preserve existing URLs or set up redirects

### 7. Document Decisions

Use Architecture Decision Records (ADRs) for significant choices. Save to `docs/architecture/`.

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

## Architecture Quality Checklist

When reviewing planned or existing architecture:

**Performance:**
- [ ] Pages generate static HTML (no client JS unless interactive)
- [ ] Images optimized (WebP, responsive sizes)
- [ ] Fonts subset and preloaded
- [ ] JS demos lazy-loaded
- [ ] Bundle size budgeted per page

**Content:**
- [ ] All 13 blog posts migrate cleanly
- [ ] JS demos accessible and functional
- [ ] URL structure preserves or redirects old URLs
- [ ] RSS feed generated
- [ ] Sitemap generated

**Developer Experience:**
- [ ] TypeScript configured
- [ ] Local dev server with hot reload
- [ ] Markdown authoring is simple
- [ ] Adding a new blog post is a single file
- [ ] Adding a new demo has a clear pattern

**Deployment:**
- [ ] GitHub Actions builds and deploys
- [ ] Build completes in reasonable time
- [ ] Preview builds for PRs (optional)

## Reference Files

### [references/framework-comparison.md](references/framework-comparison.md)
Detailed comparison of Astro, Next.js, Hugo, and 11ty for this project's needs.

**When to read**: Evaluating or revisiting framework choice.

### [references/migration-guide.md](references/migration-guide.md)
Step-by-step mapping from Jekyll patterns to modern equivalents, with concrete examples.

**When to read**: Planning or executing the content migration.
