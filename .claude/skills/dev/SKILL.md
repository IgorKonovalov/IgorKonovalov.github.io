---
name: dev
description: "Implement features, fix bugs, and write code for a portfolio/blog site being migrated from Jekyll to a modern static site framework. Use when: (1) Implementing new pages, components, or features, (2) Migrating content from Jekyll, (3) Writing or modifying CSS/styles, (4) Creating or updating interactive JS demos, (5) Setting up build pipeline or GitHub Actions, (6) Fixing bugs or addressing build errors, (7) Adding new blog posts or content, (8) Any hands-on coding task for the site."
---

# Dev - Implementation Guide

Implement features and write code for the portfolio/blog site migration and ongoing development.

## Before Writing Code

1. **Check architecture decisions** - Read `docs/architecture/` for ADRs and agreed-upon patterns
2. **Check feature specs** - Read `docs/features/` for requirements if implementing a specified feature
3. **Review existing code** - understand current patterns before adding new ones
4. **Consult the designer skill's design system** - check `.claude/skills/designer/references/design-system.md` for design tokens

## Implementation Workflow

### Adding a New Page

1. Create the page file in the framework's pages directory
2. Use the appropriate layout component
3. Add navigation link if needed
4. Ensure responsive design across all breakpoints
5. Test locally with dev server

### Adding a New Blog Post

1. Create markdown file in the content directory
2. Add required frontmatter (title, date, tags, description)
3. Add images to the assets directory
4. If post includes an interactive demo, create the demo component and reference it
5. Verify rendering locally

### Creating an Interactive Demo Component

1. Create a new directory for the demo under the components/demos path
2. Implement the demo logic (Canvas API, p5.js, or vanilla JS)
3. Wrap in a framework component with proper lifecycle handling:
   - Initialize on mount
   - Clean up on unmount (cancel animation frames, remove event listeners)
   - Handle resize events for responsive canvas
4. Ensure the component works with lazy loading (no DOM access at import time)
5. Add a loading placeholder for the pre-hydration state
6. Test at multiple viewport sizes

### Migrating a Jekyll Blog Post

1. Copy markdown content from `_posts/YYYY-MM-DD-title.md`
2. Update frontmatter:
   - Remove `layout` field
   - Convert `categories` to `tags` array
   - Add `description` field
   - Keep `date` field
3. Convert Liquid template syntax:
   - `{{ site.baseurl }}` references to relative paths
   - `{% highlight lang %}` to fenced code blocks
   - `{% include %}` to component imports
4. Update image paths to new asset structure
5. Verify all links work

### Migrating a JS Demo

1. Review the existing demo code in `assets/JS/[name]/`
2. Decide integration approach:
   - **Rewrite as component**: for demos that benefit from modern tooling
   - **Wrap existing code**: for complex demos that work fine as-is
   - **Keep standalone**: for demos with heavy dependencies (virtual tours)
3. If rewriting: use ES modules, add TypeScript types, handle cleanup
4. If wrapping: create a thin component that loads the existing script
5. Add to the demos listing page
6. Link to related blog post if one exists

## Code Quality Standards

### General
- Use TypeScript for all new code
- No `any` types except at framework boundaries
- Prefer `const` over `let`, never use `var`
- Use descriptive names; avoid abbreviations
- Keep files under 300 lines; split if larger

### CSS
- Use CSS custom properties from the design system
- Mobile-first media queries
- No magic numbers; use spacing/sizing tokens
- Class names: BEM, utility classes, or CSS modules (match project convention)
- Test at all breakpoints: 640px, 768px, 1024px, 1280px

### Components
- One component per file
- Props interface defined and exported
- Handle loading, error, and empty states
- Clean up side effects on unmount
- Accessible: semantic HTML, ARIA labels where needed, keyboard navigation

### Content
- Images: use optimized formats (WebP with fallback)
- Provide alt text for all images
- Use responsive image sizes where supported
- Lazy-load images below the fold

## Build and Deploy

### Local Development
```bash
# Install dependencies
npm install  # or pnpm/yarn per project convention

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### GitHub Actions Deployment

The CI/CD pipeline should:
1. Install dependencies (with cache)
2. Build the site
3. Deploy to GitHub Pages

Key considerations:
- Cache `node_modules` and framework cache between builds
- Run build with production environment variables
- Ensure `base` path is correct for GitHub Pages (usually `""` for user sites)

### Pre-Commit Checks

Before committing, verify:
- [ ] `npm run build` succeeds with no errors
- [ ] No TypeScript errors
- [ ] Pages render correctly at all breakpoints
- [ ] New content has proper frontmatter
- [ ] Images are optimized
- [ ] No console errors in browser

## Continuous Improvement

As the project evolves, update this skill:
- Add framework-specific patterns once the framework is chosen
- Document recurring code patterns as they emerge
- Add templates for common operations (new post, new demo, new page)
- Update references when architectural decisions change

See [references/coding-conventions.md](references/coding-conventions.md) for detailed conventions that should be updated as the project matures.
