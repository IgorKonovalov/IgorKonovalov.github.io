import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { getLocale, postHref, type Locale } from './postUrl';

/** Per-locale feed metadata. */
const FEED_META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Igor Konovalov's Blog",
    description:
      'Projects and experiments with JavaScript, generative art, and algorithmic visualization',
  },
  ru: {
    title: 'Блог Игоря Коновалова',
    description:
      'Проекты и эксперименты: разработка, генеративное искусство и алгоритмическая визуализация',
  },
};

/** Build the RSS feed for a single locale (only that locale's posts). */
export async function buildFeed(context: APIContext, locale: Locale) {
  const posts = await getCollection('blog');
  const items = posts
    .filter((post) => getLocale(post) === locale)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: postHref(post),
    }));

  return rss({
    title: FEED_META[locale].title,
    description: FEED_META[locale].description,
    site: context.site!.toString(),
    items,
  });
}
