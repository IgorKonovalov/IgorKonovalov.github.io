import { getCollection } from 'astro:content';
import { otherLocale, type Locale } from '../i18n/ui';
import { getLocale } from './postUrl';
import { TAG_SLUGS, type Tag } from './tags';

/**
 * `getStaticPaths` for one locale's tag pages: a page per tag that at least
 * one of that locale's posts carries, so no tag page is ever empty.
 */
export async function tagStaticPaths(locale: Locale) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const tagged = (tag: Tag, loc: Locale) =>
    posts.filter((p) => getLocale(p) === loc && p.data.tags?.includes(tag));
  return TAG_SLUGS.filter((tag) => tagged(tag, locale).length > 0).map(
    (tag) => ({
      params: { tag },
      props: {
        tag,
        locale,
        posts: tagged(tag, locale),
        translated: tagged(tag, otherLocale(locale)).length > 0,
      },
    }),
  );
}
