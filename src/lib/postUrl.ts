import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export type Locale = 'en' | 'ru';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALES: Locale[] = ['en', 'ru'];

/**
 * The post's locale, taken from the leading path segment of its id
 * (`en/2017-02-14-Maurer_rose`, `ru/…`). Defaults to `en` for safety.
 */
export function getLocale(post: BlogPost): Locale {
  return post.id.startsWith('ru/') ? 'ru' : 'en';
}

/** Category is the post's first tag, defaulting to `personal`. */
export function getCategory(post: BlogPost): string {
  return post.data.tags?.[0] || 'personal';
}

/**
 * The post's slug: the id with its locale folder and the leading
 * `YYYY-MM-DD-` date prefix stripped (`Maurer_rose`).
 */
export function getSlug(post: BlogPost): string {
  return post.id.replace(/^(en|ru)\//, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/**
 * The post's public URL path, e.g. `/projects/2017/02/14/Maurer_rose/`.
 * English is unprefixed (URLs preserved from the Jekyll era); Russian posts
 * are prefixed with `/ru`. This is the single source of truth for post URLs —
 * every page, feed, and route derives its links from here.
 */
export function postHref(post: BlogPost): string {
  const { date } = post.data;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const prefix =
    getLocale(post) === DEFAULT_LOCALE ? '' : `/${getLocale(post)}`;
  return `${prefix}/${getCategory(post)}/${year}/${month}/${day}/${getSlug(post)}/`;
}

/**
 * The route param for `[...slug].astro` — `postHref` without its surrounding
 * slashes (`projects/2017/02/14/Maurer_rose`).
 */
export function postSlugParam(post: BlogPost): string {
  return postHref(post).slice(1, -1);
}
