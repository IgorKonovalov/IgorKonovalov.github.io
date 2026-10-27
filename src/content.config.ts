import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { SECTIONS } from './lib/postUrl';
import { TAG_SLUGS } from './lib/tags';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    /** URL segment (`/projects/2026/…`); see `SECTIONS`. */
    section: z.enum(SECTIONS).optional(),
    /** From the closed vocabulary in `src/lib/tags.ts`. */
    tags: z.array(z.enum(TAG_SLUGS)).optional(),
    description: z.string().optional(),
    demo: z.string().optional(),
    /** Featured image (site-relative). Doubles as the post's social card. */
    image: z.string().optional(),
  }),
});

export const collections = { blog };
