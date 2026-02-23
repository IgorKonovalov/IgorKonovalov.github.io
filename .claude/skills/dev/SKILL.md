---
name: dev
description: 'Implement features, fix bugs, and write code for a portfolio/blog site built with Astro. Use when: (1) Implementing new pages, components, or features, (2) Writing or modifying CSS/styles, (3) Creating or updating interactive JS demos, (4) Setting up build pipeline or GitHub Actions, (5) Fixing bugs or addressing build errors, (6) Adding new blog posts or content, (7) Any hands-on coding task for the site.'
---

# Dev - Implementation Guide

Implement features and write code for the portfolio/blog site (Astro 5, static output, GitHub Pages).

## Before Writing Code

1. **Check architecture decisions** - Read `docs/architecture/` for ADRs and agreed-upon patterns
2. **Check feature specs** - Read `docs/features/` for requirements if implementing a specified feature
3. **Review existing code** - understand current patterns before adding new ones
4. **Consult the designer skill's design system** - check `.claude/skills/designer/references/design-system.md` for design tokens

## Project Structure

```
src/
├── pages/               # File-based routing (required)
│   ├── index.astro      # Home / post listing
│   ├── [...slug].astro  # Dynamic blog post routes
│   ├── about.astro
│   ├── archive.astro
│   └── rss.xml.ts       # RSS API endpoint
├── layouts/
│   ├── BaseLayout.astro  # HTML shell, head, header/footer
│   └── PostLayout.astro  # Wraps BaseLayout for blog posts
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── SEO.astro
│   └── demos/            # Interactive demo components
├── content/
│   └── blog/             # MDX/Markdown blog posts
├── content.config.ts     # Content collection schema (Astro 5 location)
├── scripts/
│   └── demos/            # Vanilla JS for canvas demos
└── styles/
    ├── tokens.css        # Design tokens (colors, spacing, fonts)
    └── global.css        # Global resets and base styles
```

## Implementation Workflow

### Adding a New Page

1. Create `.astro` file in `src/pages/` (kebab-case filename)
2. Import and wrap with `BaseLayout`
3. Define `Props` interface in frontmatter if accepting props
4. Add navigation link in `Header.astro` if needed
5. Use scoped `<style>` for page-specific styles, reference tokens from `tokens.css`
6. Test locally with `yarn dev`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Page Title" description="Page description">
  <h1>Page Title</h1>
  <!-- content -->
</BaseLayout>

<style>
  h1 {
    color: var(--color-text-primary);
  }
</style>
```

### Adding a New Blog Post

1. Create `.mdx` file in `src/content/blog/` named `YYYY-MM-DD-Title.mdx`
2. Add required frontmatter matching the Zod schema in `content.config.ts`:
   ```yaml
   title: 'Post Title'
   date: 2026-01-15 # ISO format
   tags: [javascript, canvas]
   description: 'Brief description for SEO and previews'
   demo: 'game-of-life' # optional: slug of related demo
   ```
3. Add images to `src/assets/` (not `public/`) for optimization
4. If post includes a demo, create the demo component and set the `demo` field
5. Verify rendering with `yarn dev`

### Adding a Dynamic Route

Use `getStaticPaths()` for routes generated from content:

```astro
---
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: buildSlug(post) },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
```

### Creating an Interactive Demo Component

1. Create `src/components/demos/DemoName.astro`
2. Create `src/scripts/demos/demo-name.js` with the canvas/animation logic
3. Structure the component:

```astro
<!-- DemoName.astro -->
<div class="demo-container">
  <canvas id="demo-name-canvas"></canvas>
  <div class="demo-controls">
    <!-- buttons, sliders, etc. -->
  </div>
</div>

<style>
  .demo-container {
    /* responsive styles using tokens */
  }
  @media (max-width: 640px) {
    /* mobile adjustments */
  }
</style>

<script>
  import '../../scripts/demos/demo-name.js';
</script>
```

4. In the JS file: query DOM elements, add event listeners, handle canvas drawing
5. No `client:*` directives needed — Astro renders HTML statically, `<script>` runs on the client
6. Test at multiple viewport sizes

### Adding an RSS Feed or API Endpoint

Create a `.ts` file in `src/pages/` with named HTTP method exports:

```typescript
// src/pages/feed.xml.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // generate and return response
};
```

## Astro Component Patterns

### Static Components (default — zero JS shipped)

All `.astro` components render to static HTML. No `client:*` directive = no JavaScript.

```astro
---
interface Props {
  title: string;
  href: string;
}
const { title, href } = Astro.props;
---

<a href={href}>{title}</a>
```

### Client Directives (only when interactivity is required)

Use framework components (React/Preact) with directives only when vanilla JS in `<script>` isn't sufficient:

| Directive                          | When                 | Use For                                |
| ---------------------------------- | -------------------- | -------------------------------------- |
| `client:load`                      | Page load            | Above-the-fold interactive elements    |
| `client:idle`                      | Browser idle         | Secondary UI (accordions, toggles)     |
| `client:visible`                   | Enters viewport      | Below-the-fold heavy components        |
| `client:media="(max-width: 50em)"` | Media query matches  | Mobile-only components                 |
| `client:only="react"`              | Immediate, skips SSR | Browser-API-only (WebGL, localStorage) |

**Current project pattern:** demos use `.astro` + vanilla JS `<script>` imports, not client directives.

### Layout Composition

Layouts compose via wrapping, not inheritance:

```
BaseLayout (HTML shell, <head>, header, footer, <slot />)
  └── PostLayout (article wrapper, metadata, wraps BaseLayout)
```

### Content Collections (Astro 5 Content Layer)

Schema defined in `src/content.config.ts` using `glob` loader + Zod:

```typescript
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
```

Query with `getCollection('blog')`, render with `render(post)`.

## Code Quality Standards

### General

- Use TypeScript for all new code
- No `any` types except at framework boundaries
- Prefer `const` over `let`, never use `var`
- Use descriptive names; avoid abbreviations
- Keep files under 300 lines; split if larger
- Use `import type` for type-only imports

### CSS

- Use CSS custom properties from the design system (`tokens.css`)
- Scoped `<style>` blocks in components (Astro auto-scopes)
- Use `<style is:global>` or `:global()` sparingly, only in layouts
- Mobile-first media queries
- No magic numbers; use spacing/sizing tokens
- Test at breakpoints: 640px, 768px, 1024px, 1280px
- Bridge frontmatter values into CSS with `<style define:vars={{ ... }}>`

### Components

- One component per file
- Define `Props` interface in frontmatter
- Use `<slot />` for content projection
- Clean up side effects on unmount
- Accessible: semantic HTML, ARIA labels where needed, keyboard navigation
- No `client:*` directive unless the component genuinely needs browser interactivity

### Content

- Images: store in `src/assets/` for optimization, not `public/`
- Use `<Image>` / `<Picture>` from `astro:assets` for optimized output
- Provide `alt` text for all images
- Provide explicit `width`/`height` for remote images (prevents CLS)
- Lazy-load images below the fold

## Dependency Management

- **Use exact versions** in `package.json` — no `^` or `~` prefixes (e.g., `"astro": "5.17.3"`, not `"^5.0.0"`)
- When adding dependencies: `yarn add --exact <pkg>` or `yarn add --dev --exact <pkg>`
- Use **Yarn** as the package manager (not npm/pnpm)

## Build and Deploy

### Local Development

```bash
yarn install    # Install dependencies
yarn dev        # Start dev server
yarn build      # Build for production
yarn preview    # Preview production build locally
```

### GitHub Actions Deployment

The CI/CD pipeline should:

1. Install dependencies (with cache)
2. Build the site
3. Deploy to GitHub Pages

Key considerations:

- Cache `node_modules` and `.astro` cache between builds
- Run build with production environment variables
- `base` path is `""` for user sites (username.github.io)

### Pre-Commit Checks

A Husky pre-commit hook runs automatically:

1. **lint-staged**: ESLint + Prettier on staged files
2. **typecheck**: `astro check` for TypeScript errors

Before committing, also verify manually:

- [ ] `yarn build` succeeds with no errors
- [ ] Pages render correctly at all breakpoints
- [ ] New content has proper frontmatter
- [ ] Images are optimized
- [ ] No console errors in browser

## Common Pitfalls

- **Over-hydrating**: Don't add `client:*` to components that work as static HTML
- **`client:load` everywhere**: Use graduated hydration (`client:idle`, `client:visible`)
- **Browser APIs in SSR**: Guard `window`/`document` access or use `client:only`
- **Images in `public/`**: Put them in `src/assets/` so Astro can optimize them
- **Missing dimensions on remote images**: Always set `width`/`height` to prevent CLS
- **Environment variables on client**: Prefix with `PUBLIC_` for client-side access

## Continuous Improvement

As the project evolves, update this skill:

- Document recurring code patterns as they emerge
- Add templates for common operations (new post, new demo, new page)
- Update references when architectural decisions change

See [references/coding-conventions.md](references/coding-conventions.md) for detailed conventions.
