import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeTableScroll from './src/plugins/rehype-table-scroll.mjs';

export default defineConfig({
  site: 'https://igorkonovalov.github.io',
  output: 'static',
  markdown: {
    rehypePlugins: [rehypeTableScroll],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ru: 'ru' },
      },
    }),
  ],
});
