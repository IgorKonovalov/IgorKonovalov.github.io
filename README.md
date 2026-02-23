# IgorKonovalov.github.io

Personal portfolio and technical blog — showcasing interactive JavaScript demos (generative art, simulations), blog posts, and virtual tours.

## Stack

- **Framework**: Astro 5.17.3 (static output, MDX, sitemap)
- **Styling**: CSS custom properties design system with automatic dark mode (`prefers-color-scheme`)
- **Typography**: Source Serif 4 (headings), Source Sans 3 (body), JetBrains Mono (code)
- **Deployment**: GitHub Actions → GitHub Pages
- **DX**: TypeScript strict, ESLint, Prettier, Husky pre-commit hooks
- **Package manager**: Yarn (exact versions)

## Development

```bash
yarn install        # Install dependencies
yarn dev            # Start dev server (localhost:4321)
yarn build          # Build for production → dist/
yarn preview        # Preview production build
yarn lint           # Run ESLint
yarn format         # Check Prettier formatting
yarn typecheck      # Run astro check (TypeScript)
```

## Project Structure

```
src/
  pages/              index.astro, about.astro, archive.astro, [...slug].astro, rss.xml.ts
  layouts/            BaseLayout.astro, PostLayout.astro
  components/         Header.astro, Footer.astro, SEO.astro
    demos/            9 interactive demo wrappers (.astro)
  content/blog/       13 blog posts (.md and .mdx)
  scripts/demos/      9 vanilla JS demo scripts
  styles/             tokens.css (design tokens), global.css (base styles)
public/
  assets/FULL/        Virtual tours + L-systems app (static passthrough)
  images/             Blog post images
  archive/            CV
docs/
  architecture/       Architecture docs and migration record
```

## Content

- **13 blog posts** covering JavaScript, generative art, Arduino, and web development
- **9 interactive demos**: Game of Life, Cellular Automaton, Islamic Star Patterns, Maurer Rose, Maurer Rose Walker, Phyllotaxis, Random Lines in Shape, Random Walker 1 & 2
- **Virtual tours**: Panoramic property/location viewers

## AI Agent Skills

This project includes specialized AI agent skills in `.claude/skills/`:

| Skill              | Purpose                              |
| ------------------ | ------------------------------------ |
| `architect`        | Technical architecture and evolution |
| `business-analyst` | Feature discovery and requirements   |
| `designer`         | UI design and visual implementation  |
| `dev`              | Code implementation and development  |

See [AGENTS.md](AGENTS.md) for detailed agent guidelines.
