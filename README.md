# IgorKonovalov.github.io

Personal portfolio and technical blog — showcasing interactive JavaScript demos (generative art, simulations), blog posts, and virtual tours.

## Current Stack (Legacy)

- Jekyll 3.3.1 with Minima theme
- SCSS, Kramdown, Liquid templates
- GitHub Pages deployment

> This project is being migrated to a modern static site framework. See `docs/architecture/` for migration plans.

## Development (Jekyll)

```bash
# Install dependencies
bundle install

# Start local dev server
bundle exec jekyll serve

# Build for production
bundle exec jekyll build
```

## Project Structure

```
_posts/          Blog posts (Markdown)
_layouts/        Page layout templates
_includes/       Reusable HTML partials
_sass/           SCSS stylesheets
assets/
  JS/            Interactive JavaScript demos
  FULL/          Virtual panoramic tours
  IMG/           Blog post images
  HTML/          Standalone HTML demos
```

## Content

- **13 blog posts** covering JavaScript, generative art, Arduino, and web development
- **Interactive demos**: Game of Life, Cellular Automata, Islamic Star Patterns, Maurer Rose, Phyllotaxis, Random Walker
- **Virtual tours**: Panoramic property/location viewers

## AI Agent Skills

This project includes specialized AI agent skills in `.claude/skills/`:

| Skill              | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `designer`         | UI design and visual implementation           |
| `business-analyst` | Feature discovery and requirements            |
| `architect`        | Technical architecture and migration planning |
| `dev`              | Code implementation and development           |

See [AGENTS.md](AGENTS.md) for detailed agent guidelines.
