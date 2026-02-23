# Architecture Overview

Comprehensive reference for the IgorKonovalov.github.io portfolio site architecture.

## Architecture Diagram

```
src/content/blog/*.{md,mdx}     Content authoring (Markdown + MDX)
        |
        v
src/content.config.ts            Zod schema validation, glob loader
        |
        v
src/pages/[...slug].astro        getStaticPaths() generates Jekyll-compatible URLs
        |
        v
src/layouts/PostLayout.astro     Article metadata, schema.org structured data
        |
        v
src/layouts/BaseLayout.astro     HTML shell, <head>, Google Fonts, Header, Footer
        |
        v
astro build                      Static site generation → dist/
        |
        v
GitHub Actions                   deploy.yml → upload-pages-artifact → deploy-pages
        |
        v
GitHub Pages                     Static hosting at igorkonovalov.github.io
```

## Directory Map

### Source (`src/`)

| Path                | Files                                                                          | Role                                                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/`            | `index.astro`, `about.astro`, `archive.astro`, `[...slug].astro`, `rss.xml.ts` | File-based routing — 3 static pages + 1 dynamic + 1 API endpoint                                                                                                           |
| `layouts/`          | `BaseLayout.astro`, `PostLayout.astro`                                         | HTML shell and post wrapper                                                                                                                                                |
| `components/`       | `Header.astro`, `Footer.astro`, `SEO.astro`                                    | Shared layout components                                                                                                                                                   |
| `components/demos/` | 9 `.astro` files                                                               | Demo wrappers: GameOfLife, CellularAutomaton, RandomWalker1, RandomWalker2, RandomLinesInShape, MaurerRose, MaurerRoseWalker, IslamicStarPatterns, Phyllotaxis             |
| `content/blog/`     | 13 files (`.md` + `.mdx`)                                                      | Blog posts with frontmatter (dates 2016–2017)                                                                                                                              |
| `content.config.ts` | 1 file                                                                         | Collection schema — `glob` loader + Zod                                                                                                                                    |
| `scripts/demos/`    | 9 `.js` files                                                                  | Demo logic: game-of-life, cellular-automaton, random-walker-1, random-walker-2, random-lines-in-shape, maurer-rose, maurer-rose-walker, islamic-star-patterns, phyllotaxis |
| `styles/`           | `tokens.css`, `global.css`                                                     | Design system tokens + CSS reset/base                                                                                                                                      |

### Public (`public/`)

| Path                         | Role                                   |
| ---------------------------- | -------------------------------------- |
| `CNAME`                      | Custom domain for GitHub Pages         |
| `favicon.ico`                | Site favicon                           |
| `images/`                    | Blog post images (subfolders by topic) |
| `archive/`                   | CV (HTML, 2017)                        |
| `assets/FULL/BangTao_house/` | Virtual tour — property walkthrough    |
| `assets/FULL/vtour_A1/`      | Virtual tour — panoramic               |
| `assets/FULL/vtour_P1_fin/`  | Virtual tour — panoramic               |
| `assets/FULL/L-systems/`     | Standalone L-systems generator app     |

### Configuration (root)

| File                           | Role                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| `astro.config.mjs`             | Site URL (`https://igorkonovalov.github.io`), static output, MDX + sitemap integrations |
| `tsconfig.json`                | TypeScript strict, extends `astro/tsconfigs/strict`                                     |
| `package.json`                 | Dependencies (exact versions), scripts, lint-staged config                              |
| `eslint.config.js`             | ESLint with `eslint-plugin-astro` + `@typescript-eslint`                                |
| `.prettierrc`                  | Prettier config with `prettier-plugin-astro`                                            |
| `.husky/`                      | Pre-commit hook running lint-staged                                                     |
| `.github/workflows/deploy.yml` | GitHub Actions build + deploy pipeline                                                  |

## Key Architectural Decisions

### Why Astro

Astro's island architecture lets interactive demos load JS only where needed while content pages ship zero JavaScript. Its markdown-first content collections with Zod validation provide type-safe frontmatter. Static output mode generates pure HTML for GitHub Pages. Vanilla JS demos work directly via `<script>` tags — no need to wrap in React or Vue.

### Demo Integration: Two-File Pattern

Each demo is split into an Astro wrapper (`.astro`) and vanilla JS logic (`.js`):

- The **wrapper** renders the exact HTML structure (canvas, buttons, inputs with specific IDs) and imports the script via `<script>` tag
- The **script** queries the DOM elements and runs the demo logic
- This avoids rewriting existing demos and keeps them framework-independent

### Content Model: Glob Loader

Blog posts use `glob` loader (not filesystem routing) for the content collection. This allows posts to live in `src/content/blog/` with arbitrary filenames while URL generation is controlled by `getStaticPaths()` in `[...slug].astro`.

### Styling: CSS Custom Properties

Design tokens are plain CSS custom properties in `tokens.css`. No preprocessor (Sass/Less) or utility framework (Tailwind). Dark mode is automatic via `@media (prefers-color-scheme: dark)` overrides on token values.

### Virtual Tours: Static Passthrough

Tours are self-contained apps (HTML + JS + assets) stored in `public/assets/FULL/`. Astro copies `public/` contents unchanged to `dist/`. No build processing, no LFS.

### URL Preservation

Blog posts generate at the same paths Jekyll used (`/projects/YYYY/MM/DD/slug/`) via computed slugs in `getStaticPaths()`. This ensures zero SEO disruption and no broken links.

## Patterns & Conventions

### Adding a New Blog Post

1. Create `src/content/blog/YYYY-MM-DD-title.md` (or `.mdx` if embedding a demo)
2. Add frontmatter: `title`, `date`, `tags`, `description`
3. The post auto-appears on homepage and archive

### Adding a New Demo

1. Create `src/scripts/demos/demo-name.js` — the demo logic
2. Create `src/components/demos/DemoName.astro` — the HTML wrapper with `<script>` import
3. Create or update the `.mdx` post to import and render `<DemoName />`
4. Add `demo: "demo-name"` to the post's frontmatter

### Adding a New Page

1. Create `src/pages/page-name.astro`
2. Import `BaseLayout` and wrap content
3. Add navigation link in `Header.astro` if needed

### Adding a New Content Collection

1. Define the collection in `src/content.config.ts` with Zod schema and `glob` loader
2. Create the content directory under `src/content/`
3. Create a page in `src/pages/` that queries the collection via `getCollection()`

## Evolution Considerations

Areas for future architectural decisions:

- **Image optimization**: Move images from `public/images/` to `src/assets/` to use Astro's `<Image>` component (WebP, responsive sizes)
- **Font optimization**: Subset Google Fonts and self-host for performance
- **Client framework**: If a demo needs complex state management, consider adding React/Vue as an Astro integration with `client:visible`
- **Search**: Client-side search (Pagefind, Fuse.js) for blog posts
- **Demo showcase**: Dedicated page listing all demos with previews
- **Analytics**: Privacy-friendly alternative to Google Analytics (Plausible, Umami)
