# Portfolio Site - Domain Context

## What the Site Is

Personal portfolio and technical blog for Igor Konovalov, a web developer based in Saint Petersburg, Russia. Showcases interactive JavaScript demos (generative art, simulations), blog posts about development, and panoramic virtual tours.

## Current Tech Stack

- Astro 5.17.3 (static output, MDX, sitemap)
- TypeScript strict mode
- CSS custom properties design system with automatic dark mode
- GitHub Actions deployment to GitHub Pages
- Yarn with exact dependency versions

## Content Inventory

### Blog Posts (13 total, dated 2016-2017)

Technical posts covering JavaScript, generative art, Arduino, and web development. Written in Markdown/MDX with YAML frontmatter. Some embed interactive canvas demos directly via Astro component imports.

Located in `src/content/blog/`.

### Interactive JS Demos

9 demo components in `src/components/demos/` with vanilla JS logic in `src/scripts/demos/`:

- **Game of Life** - Conway's cellular automaton
- **Cellular Automaton** - 1D cellular automaton simulations
- **Islamic Star Patterns** - Generative geometric art (SVG)
- **Maurer Rose** - Mathematical curve visualization
- **Maurer Rose Walker** - Maurer Rose variant
- **Phyllotaxis** - Plant growth pattern simulation
- **Random Lines In Shape** - Generative line art (SVG)
- **Random Walker 1 & 2** - Brownian motion simulations

### Virtual Tours

Located in `public/assets/FULL/`, panoramic property/location viewers:

- BangTao house tour
- vtour_A1, vtour_P1_fin

### Static Pages

- **Homepage** (`src/pages/index.astro`) - List of recent posts
- **About** (`src/pages/about.astro`) - Bio, skills, virtual tour links
- **Archive** (`src/pages/archive.astro`) - Posts listing grouped by year

### Assets

- `public/images/` - Blog post images organized by topic
- `public/archive/` - Archived CV (HTML, 2017)
- `public/assets/FULL/L-systems/` - Standalone L-systems generator app

## Current Site Structure

```
/ (homepage)                          - Recent blog posts list
/about/                               - Bio and contact
/archive/                             - All posts by year
/projects/YYYY/MM/DD/slug/            - Individual blog posts
/assets/FULL/*/                       - Virtual tours (static passthrough)
/rss.xml                              - RSS feed
```

## Author Profile

- Name: Igor Konovalov
- Email: konovalov.avp@gmail.com
- GitHub: IgorKonovalov
- Instagram: @some_strange
- Core skills: HTML, CSS, JavaScript, Node.js
- Interests: Generative art, algorithmic visualization, web development, photography

## Known Pain Points

### Resolved

- ~~Outdated stack (Jekyll 3.3.1, Ruby 2.4.2)~~ — now Astro 5.17.3
- ~~Minimal theme with no customization~~ — design system with tokens, custom typography
- ~~No dark mode, poor mobile experience~~ — auto dark mode via `prefers-color-scheme`, mobile-first responsive
- ~~Disqus comments (heavy, privacy concerns)~~ — removed

### Still Relevant

- Blog hasn't been updated since 2017
- No dedicated project showcase page (demos are embedded in posts but not listed separately)
- No proper navigation between demos and related blog posts
- Virtual tours use old panorama viewer libraries (jQuery-based)
- No search functionality
- Images not optimized (no WebP, no responsive sizes)

## Content Relationships

- Blog posts import and embed JS demos via MDX component imports
- Each demo has a corresponding blog post (linked via `demo` frontmatter field)
- Virtual tours are disconnected from the blog — linked only from the about page
- Tags exist in frontmatter but are not yet used for navigation or filtering
