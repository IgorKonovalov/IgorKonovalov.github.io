# Coding Conventions

Living document. Update as the project matures and patterns solidify.

## Project Setup

> **Update this section** once the framework is chosen and the project is initialized.

- **Package manager**: TBD (npm / pnpm / yarn)
- **Framework**: TBD (pending architect decision)
- **Node version**: TBD
- **TypeScript**: strict mode enabled

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Header.astro`, `BlogPost.tsx` |
| Pages | kebab-case | `about.astro`, `game-of-life.astro` |
| Styles | kebab-case | `global.css`, `blog-post.module.css` |
| Content (blog) | kebab-case | `game-of-life.md` |
| Utilities | camelCase | `formatDate.ts`, `slugify.ts` |
| Constants | UPPER_SNAKE in file | `const MAX_POSTS_PER_PAGE = 10` |

## TypeScript Conventions

```typescript
// Prefer interfaces for object shapes
interface BlogPost {
  title: string;
  date: Date;
  tags: string[];
  description: string;
  demo?: string;
}

// Use type for unions and computed types
type Theme = 'light' | 'dark';

// Export types from a central location
// src/types/index.ts or per-feature type files
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

## Content Frontmatter Schema

```yaml
# Required fields for blog posts
title: "Post Title"
date: 2024-01-15
description: "Brief description for SEO and previews"
tags: [javascript, generative-art]

# Optional fields
draft: false
demo: "game-of-life"        # slug of related interactive demo
image: "./hero.webp"         # featured image
```

## Git Conventions

- **Commit messages**: imperative mood, concise (`add blog post grid`, `fix demo lazy loading`)
- **Branch names**: `feature/description`, `fix/description`, `migrate/description`
- **No force-push** to main/master

## Demo Component Pattern

> **Update this section** with framework-specific code once chosen.

Every interactive demo should follow this pattern:

1. **Lazy loadable** - no side effects at module level
2. **Self-contained** - all logic within the component directory
3. **Responsive** - adapts to container width
4. **Clean** - cancels animations and listeners on unmount
5. **Accessible** - includes descriptive text for screen readers

```
demos/
  game-of-life/
    index.ts          # main component export
    GameOfLife.ts      # implementation
    styles.css         # scoped styles (if needed)
```
