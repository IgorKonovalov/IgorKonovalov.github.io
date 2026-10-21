import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeTableScroll from './src/plugins/rehype-table-scroll.mjs';
import {
  lastmodIndex,
  legacyRedirects,
  scanPosts,
} from './src/lib/contentIndex';
import { legacyRedirects as serveLegacyRedirects } from './src/lib/legacyRedirects';

const posts = scanPosts();
const lastmod = lastmodIndex(posts);

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
      // Without a date per URL a crawler has no reason to refetch a page it
      // has seen, and a site that was silent for years gets fetched rarely.
      serialize(item) {
        const date = lastmod.get(new URL(item.url).pathname);
        if (date) item.lastmod = date;
        return item;
      },
    }),
    serveLegacyRedirects(legacyRedirects(posts)),
  ],
});
