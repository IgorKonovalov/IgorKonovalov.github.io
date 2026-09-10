# Project Rules for AI Agents

Guidelines for AI agents working on this portfolio/blog site migration and development.

---

## Project Context

Portfolio and technical blog built with Astro 5, deployed to GitHub Pages.

Key documentation:

- **`docs/architecture/`** - Architecture Decision Records
- **`docs/architecture/architecture.md`** - Current architecture reference
- **`.claude/skills/`** - Specialized agent skills

Review existing architecture decisions and feature specs before making significant changes.

---

## Specialized Agent Skills

Skills in `.claude/skills/` provide domain-specific guidance:

| Skill              | Purpose                                                 |
| ------------------ | ------------------------------------------------------- |
| `designer`         | UI design, styling, layout, visual components           |
| `business-analyst` | Feature discovery, requirements analysis, feature specs |
| `architect`        | Technical architecture, code health, evolution guidance |
| `dev`              | Code implementation, bug fixes, content migration       |

---

## Git Commit Rules

### Message Structure

```
Short summary (50 chars or less)

Detailed description wrapped at 72 characters.
Explain what changed and why.
```

### Summary Line

- **Max 50 characters**, imperative present tense, capitalized, no trailing period
- Use prefixes: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`, `ci:`

### Best Practices

- One logical change per commit
- Small, frequent commits over large batches
- Test before committing
- Never commit: secrets, debug logs, build artifacts, commented-out code

---

## Dependency Management

- **Use exact versions** in `package.json` — no `^` or `~` prefixes (e.g., `"astro": "5.17.3"`, not `"^5.0.0"`)
- When adding dependencies, use `yarn add --exact` (or `yarn add --dev --exact` for devDependencies)
- Use **Yarn** as the package manager (not npm/pnpm)

---

## Code Quality Rules

### General

- Write clean, readable code; follow existing patterns
- Keep functions small and single-purpose
- Comment complex logic (explain why, not what)

### TypeScript

- Use TypeScript for all new code
- Prefer explicit types for public APIs; avoid `any`
- Use destructured imports
- Prefer absolute imports when project supports path aliases

### CSS / Styling

- Use CSS custom properties from the design system (`.claude/skills/designer/references/design-system.md`)
- Mobile-first media queries
- No magic numbers; use spacing/sizing tokens
- Breakpoints: 640px, 768px, 1024px, 1280px

### Components

- One component per file, max 300 lines
- Handle loading, error, and empty states
- Clean up side effects on unmount
- Semantic HTML, accessible (ARIA labels, keyboard navigation)

### Error Handling

- Never swallow errors silently
- Validate input at system boundaries
- Provide context in error messages

---

## Content Rules

### Blog Posts

Required frontmatter:

```yaml
title: 'Post Title'
date: 2024-01-15
description: 'Brief description for SEO'
tags: [javascript, generative-art]
```

Optional: `draft`, `demo` (related demo slug), `image` (featured image)

### Post Length

**Floor: 3,500 body words (English) / 3,100 (Russian)** for a long-form technical post.
Measure it, do not estimate it:

```
node scripts/check-post-length.mjs [en|ru]
```

**Why Russian gets its own number.** Measured across the seven 2026 post pairs, a
Russian translation of identical content runs at **0.889** of its English source —
range 0.855–0.926, so the ratio is stable rather than an artifact of one post.
Russian has no articles and its cases do the work of prepositions; the same content
is genuinely fewer words. Holding it to 3,500 would measure the language, not the
post. 3,500 × 0.889 = 3,111, rounded down to 3,100; the rounding is the only
judgement, the ratio is measured. Re-derive it by running the script with no
language argument and comparing the two columns.

The script counts **body prose only** — frontmatter, code fences, Mermaid blocks,
tables, image markup and MDX imports are stripped — so its numbers run 10–15% below
a naive `wc -w`. The floor is set against the script's metric, not against the file.

**Scope.** The floor applies to posts dated 2026 or later that carry no `demo` field.
It does not apply to:

- **Demo write-ups** (posts with `demo:`). The embedded canvas is the artifact and the
  prose is a caption; the 2017 posts are 27–350 words and that is correct.
- **Posts before 2026.** Legacy, counted and shown, never measured.

**It warns, it never fails.** A short post is worse than it should be; it is not
incorrect. A gate that blocked a commit over prose length would be disabled the first
time a genuinely short post was the right call, and then it would be worth less than
nothing. A human decides.

**Why a floor exists at all.** The blog had no stated length and nothing measuring one.
Six posts written 2026-09-10 to 2026-09-15 came in at 1,551–1,990 words against the
2,163 of the post preceding them, trending down — the newest were the shortest. Nobody
chose that; it is what happens to a number nothing prints.

**The floor is not a target to pad toward.** Length comes from material — more of the
real reasoning, the measurements, the rejected alternatives, the things that did not
work. If a post cannot reach the floor on material, it is the wrong length _or_ the
wrong scope, and the fix is a bigger subject, never more words about a small one.

### Interactive Demos

- Lazy-loadable: no side effects at module level
- Self-contained: all logic within the component directory
- Responsive: adapts to container width
- Clean: cancels animations and listeners on unmount
- Accessible: includes descriptive text for screen readers

### Images

- Use optimized formats (WebP with fallback)
- Provide alt text for all images
- Use responsive image sizes where supported
- Lazy-load below the fold

---

## File Organization

### Naming Conventions

| Type       | Convention | Example                              |
| ---------- | ---------- | ------------------------------------ |
| Components | PascalCase | `Header.astro`, `BlogCard.tsx`       |
| Pages      | kebab-case | `about.astro`, `game-of-life.astro`  |
| Styles     | kebab-case | `global.css`, `blog-post.module.css` |
| Content    | kebab-case | `game-of-life.md`                    |
| Utilities  | camelCase  | `formatDate.ts`, `slugify.ts`        |

### Structure Principles

- Group by feature, not by file type
- Colocate related files (component, styles, tests)
- Shared code in `shared/` or `common/`
- Keep files under 300 lines

---

## Security Rules

- Never commit secrets or API keys
- Validate all external input
- Sanitize output to prevent XSS
- Keep dependencies updated

---

## Deployment

- **Target**: GitHub Pages (static files only)
- **Build**: GitHub Actions CI/CD
- **Branch**: source on `main`/`master`, deploy via Actions
- Verify `yarn build` succeeds before pushing
- Preserve or redirect existing URLs during migration

---

**Last Updated**: 2026-02-23
