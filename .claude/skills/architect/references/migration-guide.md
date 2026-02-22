# Jekyll Migration Guide

Step-by-step mapping from Jekyll patterns to modern framework equivalents. Examples use Astro syntax but concepts apply to any framework.

## Table of Contents

- [Content Migration](#content-migration)
- [Template Migration](#template-migration)
- [Styling Migration](#styling-migration)
- [Asset Migration](#asset-migration)
- [Configuration Migration](#configuration-migration)
- [URL Preservation](#url-preservation)
- [Migration Checklist](#migration-checklist)

## Content Migration

### Blog Posts

**Jekyll** (`_posts/2017-01-15-game-of-life.md`):

```yaml
---
layout: post
title: 'Game of Life'
date: 2017-01-15
categories: javascript generative
---
Post content here...
```

**Modern** (`src/content/blog/game-of-life.md`):

```yaml
---
title: 'Game of Life'
date: 2017-01-15
tags: [javascript, generative]
description: 'Brief description for SEO and previews'
demo: game-of-life # optional: link to interactive demo
---
Post content here...
```

Key changes:

- Remove `layout` from frontmatter (handled by content collection config)
- Date moves from filename to frontmatter
- `categories` becomes `tags` (array)
- Add `description` for SEO
- Add optional `demo` field to link related interactive demos

### Static Pages

**Jekyll** (`about.md`):

```yaml
---
layout: page
title: About
permalink: /about/
---
```

**Modern** (`src/pages/about.astro` or `src/pages/about.md`):
Pages become either markdown files or framework components depending on interactivity needs.

## Template Migration

### Layouts

**Jekyll** (`_layouts/post.html`):

```html
<!DOCTYPE html>
<html>
  {% include head.html %}
  <body>
    {% include header.html %}
    <article>{{ content }}</article>
    {% include footer.html %}
  </body>
</html>
```

**Modern** (`src/layouts/PostLayout.astro`):

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
const { frontmatter } = Astro.props;
---

<html>
  <head><title>{frontmatter.title}</title></head>
  <body>
    <Header />
    <article><slot /></article>
    <Footer />
  </body>
</html>
```

### Includes to Components

| Jekyll Include                    | Modern Component                              |
| --------------------------------- | --------------------------------------------- |
| `_includes/head.html`             | `<Head>` component or layout `<head>` section |
| `_includes/header.html`           | `<Header>` component                          |
| `_includes/footer.html`           | `<Footer>` component                          |
| `_includes/google-analytics.html` | Analytics component or `<script>` in layout   |
| `_includes/icon-instagram.html`   | SVG icon component or icon library            |

### Liquid to Modern Syntax

| Liquid                         | Modern (JSX/Astro)              |
| ------------------------------ | ------------------------------- |
| `{{ page.title }}`             | `{frontmatter.title}`           |
| `{% for post in site.posts %}` | `{posts.map(post => ...)}`      |
| `{% if page.comments %}`       | `{frontmatter.comments && ...}` |
| `{{ content }}`                | `<slot />`                      |
| `{% include header.html %}`    | `<Header />`                    |
| `{{ post.url }}`               | Framework routing (file-based)  |

## Styling Migration

### SCSS to Modern CSS

**Jekyll** (`_sass/minima/_base.scss`):

```scss
$base-font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
$base-font-size: 16px;
$brand-color: #2a7ae2;

body {
  font: #{$base-font-size}/#{$base-line-height} #{$base-font-family};
  color: $text-color;
}
```

**Modern** (CSS custom properties):

```css
:root {
  --font-body: 'Source Sans 3', system-ui, sans-serif;
  --text-base: 1rem;
  --color-accent: #2563eb;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
}
```

Options:

- **CSS custom properties + vanilla CSS**: simplest, no build step for styles
- **CSS Modules**: scoped styles per component
- **Tailwind CSS**: utility-first, rapid prototyping
- Keep SCSS if preferred (most frameworks support it)

## Asset Migration

| Jekyll Path                  | Modern Path                                                      | Notes                                                  |
| ---------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------ |
| `assets/IMG/`                | `src/assets/images/` or `public/images/`                         | Use `src/` for optimization, `public/` for passthrough |
| `assets/JS/GameOfLife/`      | `src/components/demos/GameOfLife/` or `public/demos/GameOfLife/` | Depends on integration strategy                        |
| `assets/FULL/BangTao_house/` | `public/tours/bangtao-house/`                                    | Static passthrough, too complex to rewrite             |
| `favicon.ico`                | `public/favicon.ico`                                             | Direct copy                                            |
| `assets/main.scss`           | `src/styles/global.css`                                          | Rewrite with new design system                         |

## Configuration Migration

**Jekyll** (`_config.yml`):

```yaml
title: Igor Konovalov
email: konovalov.avp@gmail.com
description: 'Russia, Saint Petersburg...'
baseurl: ''
url: ''
theme: minima
google_analytics: UA-89901015-1
plugins:
  - jekyll-feed
  - jekyll-archives
```

**Modern** (framework config + separate concerns):

- Site metadata: framework config or `src/data/site.ts`
- Analytics: dedicated component or script
- Feed: framework plugin or build step
- Archives: handled by content queries

## URL Preservation

Critical for SEO and existing links. Map old Jekyll URLs to new routes:

| Old URL Pattern             | New Route              | Method               |
| --------------------------- | ---------------------- | -------------------- |
| `/2017/01/15/game-of-life/` | `/blog/game-of-life/`  | Redirect or preserve |
| `/about/`                   | `/about/`              | Keep same            |
| `/archive/`                 | `/blog/`               | Redirect             |
| `/assets/JS/GameOfLife/`    | `/demos/game-of-life/` | Redirect             |

Implement redirects via:

- Static `_redirects` file (Netlify) or equivalent
- Meta refresh tags in old URL paths
- GitHub Pages doesn't support server redirects, so use meta refresh or JavaScript redirects in generated HTML at old paths

## Migration Checklist

### Phase 1: Setup

- [ ] Initialize new framework project
- [ ] Configure TypeScript
- [ ] Set up GitHub Actions for deployment
- [ ] Create base layout with header/footer
- [ ] Implement design system tokens (CSS variables)

### Phase 2: Content

- [ ] Migrate all 13 blog posts (adjust frontmatter)
- [ ] Migrate about page
- [ ] Create new homepage
- [ ] Create projects/demos listing page
- [ ] Verify all images render correctly

### Phase 3: Interactive Demos

- [ ] Choose integration strategy (islands, standalone, hybrid)
- [ ] Migrate or embed each JS demo
- [ ] Ensure demos are lazy-loaded
- [ ] Test on mobile devices

### Phase 4: Polish

- [ ] Implement RSS feed
- [ ] Add sitemap
- [ ] Set up URL redirects from old paths
- [ ] Verify Google Analytics (or switch to privacy-friendly alternative)
- [ ] Test all pages, all breakpoints
- [ ] Run Lighthouse audit

### Phase 5: Deploy

- [ ] Configure GitHub Actions workflow
- [ ] Test deployment to GitHub Pages
- [ ] Verify custom domain (if applicable)
- [ ] Decommission old Jekyll build
