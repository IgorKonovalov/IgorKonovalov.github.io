# Portfolio Site - Domain Context

## What the Site Is

Personal portfolio and technical blog for Igor Konovalov, a web developer based in Saint Petersburg, Russia. Showcases interactive JavaScript demos (generative art, simulations), blog posts about development, and panoramic virtual tours.

## Current Tech Stack (Being Replaced)

- Jekyll 3.3.1 with Minima theme
- SCSS styling, Ruby toolchain
- GitHub Pages deployment
- Kramdown markdown, Liquid templates
- Google Analytics, Disqus comments

## Content Inventory

### Blog Posts (13 total, dated 2016-2017)
Technical posts covering JavaScript, generative art, Arduino, and web development. Written in Markdown with YAML frontmatter. Some embed interactive canvas demos directly.

### Interactive JS Demos
Located in `assets/JS/`, each is a standalone project:
- **Game of Life** - Conway's cellular automaton
- **Cellular Automata** - 1D cellular automaton simulations
- **Islamic Star Patterns SVG** - Generative geometric art
- **Maurer Rose** - Mathematical curve visualization
- **Phyllotaxis** - Plant growth pattern simulation
- **Random Lines In Shape** - Generative line art
- **Random Walker 1 & 2** - Brownian motion simulations

### Virtual Tours
Located in `assets/FULL/`, panoramic property/location viewers:
- BangTao house tour
- vtour_A1, vtour_P1_fin

### Static Pages
- **Homepage** (index.md) - List of recent posts
- **About** (about.md) - Brief bio, skills, social links
- **Archive** (archive.md) - Posts listing grouped by year

### Assets
- `assets/IMG/` - Blog post images organized by topic
- `assets/HTML/` - Standalone HTML demos (canvas_fun)
- `assets/ARCHIVE/` - Archived CV (HTML, 2017)

## Current Site Structure

```
/ (homepage)        - Recent blog posts list
/about/             - Bio and contact
/archive/           - All posts by year
/YYYY/MM/DD/title/  - Individual blog posts
/assets/JS/*/       - Interactive demos (standalone)
/assets/FULL/*/     - Virtual tours (standalone)
```

## Author Profile
- Name: Igor Konovalov
- Email: konovalov.avp@gmail.com
- GitHub: IgorKonovalov
- Twitter: @igor_dlinni
- Instagram: @some_strange
- Core skills: HTML, CSS, JavaScript, Node.js
- Interests: Generative art, algorithmic visualization, web development, photography

## Known Pain Points
- Outdated stack (Jekyll 3.3.1, Ruby 2.4.2)
- Minimal theme with no customization
- No proper project showcase (demos are buried in assets/)
- Blog hasn't been updated since 2017
- No dark mode, poor mobile experience
- Disqus comments (heavy, privacy concerns)
- No proper navigation between demos and related blog posts
- Virtual tours use old panorama viewer libraries

## Content Relationships
- Blog posts often reference or embed JS demos
- Some demos have dedicated blog posts, others don't
- Virtual tours are completely disconnected from the blog
- No tagging or categorization system beyond basic archive
