import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { SECTIONS } from './lib/postUrl';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    /** URL segment (`/projects/2026/…`); see `SECTIONS`. */
    section: z.enum(SECTIONS).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    demo: z.string().optional(),
    /** Featured image (site-relative). Doubles as the post's social card. */
    image: z.string().optional(),
  }),
});

export const collections = { blog };
