# Framework Comparison

Evaluation of static site frameworks for migrating a Jekyll portfolio/blog with interactive JS demos. Deployment target: GitHub Pages (static output required).

## Table of Contents
- [Astro](#astro)
- [Next.js (Static Export)](#nextjs-static-export)
- [Hugo](#hugo)
- [Eleventy (11ty)](#eleventy-11ty)
- [Summary Matrix](#summary-matrix)

## Astro

**Philosophy**: Content-first, ship zero JS by default, add interactivity via islands.

**Strengths for this project:**
- Island architecture: perfect for embedding JS demos without bloating other pages
- Content collections with type-safe frontmatter (great for blog posts)
- MDX support: embed interactive components directly in markdown
- Ships zero JS by default, adds only what's needed per component
- Built-in image optimization
- Simple GitHub Pages deployment via `@astrojs/sitemap` and Actions

**Weaknesses:**
- Smaller ecosystem than React/Next.js
- Component libraries less abundant
- Newer framework, fewer Stack Overflow answers

**Demo integration pattern:**
```astro
---
// Blog post with embedded demo
import GameOfLife from '../components/demos/GameOfLife.astro';
---
<article>
  <Content />
  <GameOfLife client:visible />
</article>
```
`client:visible` loads JS only when the demo scrolls into view.

## Next.js (Static Export)

**Philosophy**: Full React framework with optional static export mode.

**Strengths for this project:**
- Massive ecosystem, abundant component libraries
- Strong TypeScript support
- `output: 'export'` generates static HTML
- React ecosystem for building complex interactive demos
- Well-documented, large community

**Weaknesses:**
- Ships React runtime to every page (larger baseline JS)
- Static export loses many Next.js features (API routes, ISR, middleware)
- Overkill for a content-focused site
- More complex configuration for a simple blog
- Image optimization requires external loader for static export

**Demo integration pattern:**
```tsx
// Dynamic import for code-splitting
const GameOfLife = dynamic(() => import('../components/demos/GameOfLife'), {
  ssr: false,
  loading: () => <DemoSkeleton />
});
```

## Hugo

**Philosophy**: The fastest static site generator. Go-based, template-driven.

**Strengths for this project:**
- Extremely fast builds (milliseconds for small sites)
- Simple markdown-first workflow
- Built-in taxonomies, RSS, sitemap
- Mature, stable, well-documented
- No Node.js dependency

**Weaknesses:**
- Go templates are verbose and unfamiliar to JS developers
- No component model for interactive elements
- JS demos would need to be standalone (no island architecture)
- Limited JS tooling integration (no built-in bundling)
- Harder to embed interactive components in markdown

**Demo integration pattern:**
```html
<!-- Shortcode: embed demo as iframe or script include -->
{{< demo name="game-of-life" height="400px" >}}
```
Demos remain standalone JS, embedded via shortcodes. No component-level code splitting.

## Eleventy (11ty)

**Philosophy**: Flexible, minimal-opinion static site generator. JS-based.

**Strengths for this project:**
- Very flexible, works with many template languages
- Lightweight, fast builds
- Great markdown support
- Feels like a natural Jekyll successor
- Can integrate with any JS bundler for demos

**Weaknesses:**
- Less opinionated means more decisions to make
- No built-in component model or island architecture
- Image optimization requires plugins
- Interactive demos need custom bundling setup
- Smaller community than Next.js or Astro

**Demo integration pattern:**
```md
<!-- Shortcode approach, similar to Hugo -->
{% demo "game-of-life" %}
```
Requires custom shortcode + bundler setup for demo assets.

## Summary Matrix

| Criterion | Astro | Next.js | Hugo | 11ty |
|-----------|-------|---------|------|------|
| Static output | Native | Export mode | Native | Native |
| Zero-JS pages | Yes | No (React runtime) | Yes | Yes |
| Island architecture | Built-in | Manual (dynamic import) | No | No |
| Markdown/MDX | Built-in | Built-in | Built-in (MD) | Built-in |
| Interactive demos | Excellent (islands) | Good (React) | Poor (iframes) | Fair (custom) |
| Build speed | Fast | Medium | Fastest | Fast |
| TypeScript | Built-in | Built-in | No | Plugin |
| Image optimization | Built-in | External for static | Plugin | Plugin |
| Learning curve | Low-Medium | Medium | Medium (Go tmpl) | Low |
| Ecosystem size | Growing | Largest | Large | Medium |
| GitHub Pages | Easy | Easy | Easy | Easy |

## Recommendation Factors

**Choose Astro if**: Interactive demos are a priority, you want minimal JS overhead, content-first approach matches the site's nature.

**Choose Next.js if**: You plan to add significant dynamic features later (auth, API), want the largest ecosystem, comfortable with React shipping to all pages.

**Choose Hugo if**: Build speed is paramount, demos can stay standalone, you prefer Go templates or don't need component-level interactivity.

**Choose 11ty if**: You want maximum flexibility, prefer a Jekyll-like workflow, comfortable setting up your own tooling for demos.
