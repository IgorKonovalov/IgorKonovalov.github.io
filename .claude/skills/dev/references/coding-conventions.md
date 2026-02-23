# Coding Conventions

Living document. Update as the project matures and patterns solidify.

## Project Setup

- **Framework**: Astro 5.x (static output)
- **Package manager**: Yarn (exact versions only)
- **TypeScript**: strict mode enabled
- **Site URL**: `https://igorkonovalov.github.io`
- **Integrations**: `@astrojs/mdx`, `@astrojs/sitemap`

## File Naming

| Type           | Convention          | Example                                |
| -------------- | ------------------- | -------------------------------------- |
| Components     | PascalCase          | `Header.astro`, `GameOfLife.astro`     |
| Pages          | kebab-case          | `about.astro`, `archive.astro`         |
| Dynamic routes | brackets            | `[...slug].astro`, `[id].astro`        |
| Layouts        | PascalCase          | `BaseLayout.astro`, `PostLayout.astro` |
| Styles         | kebab-case          | `global.css`, `tokens.css`             |
| Content (blog) | date-prefixed       | `2025-03-15-Game-Of-Life.mdx`          |
| Scripts        | kebab-case          | `game-of-life.js`, `phyllotaxis.js`    |
| API endpoints  | kebab-case + `.ts`  | `rss.xml.ts`                           |
| Utilities      | camelCase           | `formatDate.ts`, `slugify.ts`          |
| Constants      | UPPER_SNAKE in file | `const MAX_POSTS_PER_PAGE = 10`        |

## Astro Component Conventions

### Frontmatter Section

```astro
---
// 1. Type imports
import type { CollectionEntry } from 'astro:content';

// 2. Component/module imports
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

// 3. Props interface
interface Props {
  title: string;
  description?: string;
}

// 4. Props destructuring
const { title, description } = Astro.props;

// 5. Data fetching / logic
const posts = await getCollection('blog');
---
```

### Template Section

- Use semantic HTML (`<article>`, `<nav>`, `<section>`, `<main>`)
- Use `<slot />` for content projection in layouts/wrappers
- Use `<Fragment>` to group elements without a wrapper div

### Style Section

```astro
<style>
  /* Scoped by default — Astro adds data attributes */
  .card {
    padding: var(--space-6);
  }

  /* Target slotted/child content globally when needed */
  .wrapper :global(h1) {
    color: var(--color-text-primary);
  }
</style>
```

- Prefer scoped styles (default)
- Use `<style is:global>` only in layouts for resets/base styles
- Use `<style define:vars={{ myVar }}>` to pass frontmatter values to CSS
- Never use inline styles when a scoped class works

### Script Section

```astro
<!-- Client-side JS — bundled and executed in the browser -->
<script>
  import '../../scripts/demos/game-of-life.js';
</script>

<!-- Inline script — not processed by Astro -->
<script is:inline>
  console.log('runs as-is');
</script>
```

- `<script>` tags are processed and bundled by Astro (supports imports, TS)
- Use `is:inline` only when you need the script exactly as written (analytics snippets, etc.)

## TypeScript Conventions

```typescript
// Prefer interfaces for object shapes
interface Props {
  title: string;
  date: Date;
  tags: string[];
  description: string;
  demo?: string;
}

// Use type for unions and computed types
type Theme = 'light' | 'dark';

// Always use import type for type-only imports
import type { CollectionEntry } from 'astro:content';
import type { HTMLAttributes } from 'astro/types';

// Extend HTML attributes for wrapper components
interface Props extends HTMLAttributes<'a'> {
  isExternal?: boolean;
}
```

## CSS Conventions

Use design tokens from `.claude/skills/designer/references/design-system.md`:

```css
/* Use custom properties, never hardcode values */
.card {
  padding: var(--space-6);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

/* Mobile-first breakpoints */
.grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Style Architecture

- **`tokens.css`** — design tokens (colors, spacing, fonts, dark mode overrides)
- **`global.css`** — resets, base typography, utility classes
- Both imported once in `BaseLayout.astro` frontmatter
- Component styles are scoped `<style>` blocks, referencing token vars

### Dark Mode

Automatic via `prefers-color-scheme` media query in `tokens.css`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #0f0f23;
    --color-text-primary: #e0e0e0;
    /* ... overrides ... */
  }
}
```

## Content Collection Schema

Defined in `src/content.config.ts`:

```yaml
# Required fields for blog posts
title: 'Post Title'
date: 2025-01-15 # ISO format
description: 'Brief description for SEO and previews'
tags: [javascript, generative-art]

# Optional fields
demo: 'game-of-life' # slug of related interactive demo
```

## Routing Conventions

- **Static pages**: `src/pages/about.astro` → `/about`
- **Dynamic routes**: `src/pages/[...slug].astro` with `getStaticPaths()`
- **API endpoints**: `src/pages/rss.xml.ts` with exported `GET` function
- Route params extracted from content frontmatter (category, date, slug)

## Git Conventions

- **Commit messages**: imperative mood, concise (`add blog post grid`, `fix demo lazy loading`)
- **Branch names**: `feature/description`, `fix/description`
- **No force-push** to main/master

## Demo Component Pattern

Two-file pattern: `.astro` for markup + `.js` for logic.

### Component file (`src/components/demos/DemoName.astro`)

```astro
<div class="demo-container">
  <canvas id="demo-name-canvas" style="width: 100%; display: block;"></canvas>
  <div class="demo-controls">
    <button id="demo-name-start">Start</button>
    <input type="range" id="demo-name-speed" min="1" max="60" value="30" />
  </div>
</div>

<style>
  .demo-container {
    max-width: var(--content-width);
    margin: 0 auto;
  }
  .demo-controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    padding: var(--space-3) 0;
  }
  @media (max-width: 640px) {
    .demo-controls {
      flex-direction: column;
    }
  }
</style>

<script>
  import '../../scripts/demos/demo-name.js';
</script>
```

### Script file (`src/scripts/demos/demo-name.js`)

```javascript
const canvas = document.getElementById('demo-name-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('demo-name-start');

// Setup, event listeners, animation loop
// No module-level side effects that break without DOM
```

### Conventions

1. **No client directives** — static HTML + `<script>` import
2. **Self-contained** — component + script pair in their respective directories
3. **Responsive** — canvas adapts to container width
4. **Controls** — buttons, sliders, selects for interactivity
5. **Accessible** — includes descriptive text for screen readers
6. **ID-namespaced** — prefix element IDs with demo name to avoid collisions
