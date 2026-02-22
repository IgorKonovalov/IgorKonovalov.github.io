# Design System Reference

Design tokens and patterns for the portfolio site. Update this file as design decisions are made during implementation.

## Color Tokens

```css
:root {
  /* Backgrounds */
  --color-bg-primary: #faf9f7;
  --color-bg-secondary: #f2f0ed;
  --color-bg-code: #f5f4f2;
  --color-bg-card: #ffffff;

  /* Text */
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #5a5a6e;
  --color-text-muted: #8a8a9a;

  /* Accent - to be finalized during implementation */
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-accent-subtle: #dbeafe;

  /* Borders */
  --color-border: #e5e4e1;
  --color-border-hover: #d1d0cd;
}
```

## Typography Tokens

```css
:root {
  /* Font families - placeholder, finalize during implementation */
  --font-heading: 'Source Serif 4', Georgia, serif;
  --font-body: 'Source Sans 3', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Scale (1.25 ratio) */
  --text-xs: 0.8rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.563rem;
  --text-3xl: 1.953rem;
  --text-4xl: 2.441rem;

  /* Line heights */
  --leading-tight: 1.2;
  --leading-normal: 1.6;
  --leading-relaxed: 1.75;
}
```

## Spacing Tokens

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-24: 6rem;     /* 96px */

  /* Content width */
  --content-width: 720px;
  --content-width-wide: 1080px;
  --content-width-full: 1280px;
}
```

## Breakpoints

| Name    | Width   | Usage                     |
|---------|---------|---------------------------|
| sm      | 640px   | Mobile landscape          |
| md      | 768px   | Tablet                    |
| lg      | 1024px  | Desktop                   |
| xl      | 1280px  | Wide desktop              |

## Component Patterns

### Project Card
- White background with subtle border
- Thumbnail/preview at top
- Title, description, tech tags below
- Hover: subtle shadow lift or border accent
- Aspect ratio: 16:9 for thumbnails

### Blog Post Preview
- Title as primary element (heading font)
- Date and tags as muted metadata
- Optional excerpt (2-3 lines max)
- No thumbnail unless post has a featured image

### Navigation
- Horizontal on desktop, minimal items (Home, Projects, Blog, About)
- Clean underline or weight change for active state
- Mobile: hamburger menu or collapsible

### Code Blocks
- Subtle background differentiation from page
- Rounded corners, comfortable padding
- Syntax highlighting with muted, readable colors
- Optional filename label

### Demo Container
- Full-width option for immersive canvas demos
- Bordered container for inline demos
- Responsive: scale canvas to viewport width, maintain aspect ratio
- Controls overlay or below the demo

## Dark Mode (Secondary)

Override light tokens via `prefers-color-scheme: dark`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #141418;
    --color-bg-secondary: #1e1e24;
    --color-bg-code: #1a1a20;
    --color-bg-card: #1e1e24;
    --color-text-primary: #e8e8ec;
    --color-text-secondary: #a8a8b8;
    --color-text-muted: #68687a;
    --color-border: #2a2a34;
  }
}
```
