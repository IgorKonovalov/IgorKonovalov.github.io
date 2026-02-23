# Blog Post MDX Format

## Frontmatter Schema

```yaml
---
title: 'Post Title' # required, single-quoted
date: YYYY-MM-DD # required, no quotes
tags: ['projects'] # optional, values: 'projects' or 'personal'
description: 'SEO summary' # optional, single-quoted, one sentence
demo: 'demo-slug' # optional, only if post has interactive demo component
---
```

## File Naming

Pattern: `YYYY-MM-DD-Title_With_Underscores.mdx`
Location: `src/content/blog/`

## Structure Pattern (project posts with demo)

```mdx
---
frontmatter
---

import DemoComponent from '../../components/demos/DemoName.astro';

[1-3 sentences: personal context, what inspired this, link to inspiration]

[Optional: Wikipedia quote or technical definition introduced casually]

[Optional: brief technical explanation with code snippets]

<DemoComponent />

[Optional: usage instructions for the demo]

[Source code link at the end]
```

## Structure Pattern (text-only posts)

```md
---
frontmatter
---

[Personal intro and context]

[Main content: explanations, code blocks, images]

[Closing: thanks, source code link]
```

## Notes

- Import statement goes right after frontmatter, before prose
- Demo component placed mid-post (after intro, before or after technical details)
- Headings are rare; most posts have zero headings
- Code blocks use triple backticks with language: javascript, java, bash, html, c
- Images: `![alt](/images/folder/file.png)`
- Source code link always at the very end
- Posts are typically short (10-60 lines of content)
