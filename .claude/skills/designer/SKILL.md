---
name: designer
description: "Design and implement visual UI for a personal portfolio/blog site with interactive demos. Use when the user asks to design, style, or build pages, components, layouts, or visual elements for the site. Triggers: (1) Designing new pages or sections (homepage, portfolio, blog, demo showcase), (2) Creating or updating CSS/styling, (3) Building responsive layouts, (4) Choosing typography, colors, or spacing, (5) Designing navigation, cards, grids, or any UI component, (6) Making the site look better or more modern."
---

# Designer - Portfolio Site UI

Design and implement production-grade UI for a personal developer portfolio featuring blog posts, interactive JavaScript demos (generative art, simulations), and virtual tours.

## Design Direction

**Aesthetic**: Minimal and clean with a light theme.

Core principles:
- **Generous whitespace** - let content breathe, avoid clutter
- **Strong typography hierarchy** - clear distinction between headings, body, meta
- **Subtle color accents** - restrained palette, max 2-3 accent colors
- **Content-first** - design serves the content, not the other way around
- **Interactive demos as hero elements** - generative art and simulations deserve prominent, immersive presentation

## Design Process

1. **Understand the request** - what page/component/element needs design work
2. **Review existing patterns** - check [references/design-system.md](references/design-system.md) for established tokens and patterns
3. **Propose direction** - describe the visual approach before coding, use ASCII mockups for layout decisions
4. **Implement** - write production CSS/HTML with the chosen framework
5. **Refine** - adjust spacing, typography, and responsiveness

## Content Types to Design For

### Portfolio / Demo Showcase
- Grid or masonry layout for project cards
- Each project: thumbnail/preview, title, tech tags, brief description
- Interactive demos should have immersive full-width presentation options
- Canvas-based demos need proper sizing and responsive containers

### Blog Posts
- Clean reading experience, optimal line length (60-75 characters)
- Code blocks with syntax highlighting
- Embedded images and interactive elements within posts
- Post metadata (date, tags) styled subtly

### Homepage
- Clear introduction of who the author is
- Featured projects or recent work
- Navigation to all sections
- Fast, no heavy hero animations

### About Page
- Professional but personal
- Social links and contact info
- Skills/tech stack presented visually

## Typography Guidelines

- Use a distinctive serif or sans-serif for headings (not Inter, Roboto, Arial)
- Pair with a highly readable body font
- Sizes: establish a clear modular scale (e.g., 1.25 ratio)
- Line height: 1.5-1.7 for body text, tighter for headings

## Color Guidelines

- **Background**: warm white or soft off-white (not pure #fff)
- **Text**: dark gray, not pure black (e.g., #1a1a2e or #2d2d2d)
- **Accent**: one primary accent color, used sparingly for links, buttons, highlights
- **Code blocks**: subtle background differentiation
- **Interactive demos**: can break the palette for visual impact

## Responsive Design

- Mobile-first approach
- Breakpoints: 640px (mobile), 768px (tablet), 1024px (desktop), 1280px (wide)
- Navigation collapses to hamburger or bottom nav on mobile
- Demo previews adapt to screen size
- Blog post layout stays single-column, adjusts padding

## Implementation Notes

- Use CSS custom properties for all design tokens (colors, spacing, fonts)
- Prefer CSS Grid and Flexbox for layouts
- Animations: subtle and purposeful (page transitions, hover states)
- Avoid heavy JS-based animations for UI chrome; reserve animation budget for interactive demos
- Ensure good contrast ratios (WCAG AA minimum)
- Support system dark mode via `prefers-color-scheme` media query as secondary theme

## Anti-Patterns

- No cookie-cutter templates or generic "developer portfolio" layouts
- No gradient blobs or generic tech hero images
- No overly complex navigation for a small site
- No fixed/sticky elements that consume mobile viewport
- No carousel/slider patterns for projects
- No animations that delay content visibility
