import type { Locale } from './postUrl';

export const SITE_URL = 'https://igorkonovalov.github.io';
export const SITE_TITLE = 'Igor Konovalov';

/** The social card used by every page that does not supply its own. */
export const DEFAULT_OG_IMAGE = '/images/og-default.png';
export const DEFAULT_OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Other profiles belonging to the same person. This is the `sameAs` list in the
 * Person schema below, and it is the whole point of that schema: GitHub and
 * LinkedIn already outrank this site for the name, and there are unrelated
 * people sharing it. `sameAs` is what tells a search engine those profiles and
 * this site are one entity rather than three strangers.
 */
export const SAME_AS = [
  'https://github.com/IgorKonovalov',
  'https://www.linkedin.com/in/igor-konovalov/',
  'https://www.instagram.com/some_strange/',
];

/** Stable node ids, so every page's schema references one shared entity. */
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const NAME: Record<Locale, string> = {
  en: 'Igor Konovalov',
  ru: 'Игорь Коновалов',
};

const JOB_TITLE: Record<Locale, string> = {
  en: 'Fullstack Developer',
  ru: 'Fullstack-разработчик',
};

const LOCALITY: Record<Locale, string> = { en: 'Belgrade', ru: 'Белград' };

const DESCRIPTION: Record<Locale, string> = {
  en: 'Fullstack developer in Belgrade working in TypeScript and Python, building AI agents and creative-coding experiments.',
  ru: 'Fullstack-разработчик из Белграда, работаю с TypeScript и Python, создаю AI-агентов и эксперименты с творческим программированием.',
};

export const BCP47: Record<Locale, string> = { en: 'en-US', ru: 'ru-RU' };

/** Resolve a site-relative path to an absolute URL; pass through absolute ones. */
export function absolute(path: string): string {
  return /^https?:\/\//.test(path) ? path : new URL(path, SITE_URL).href;
}

/** The person's display name in a locale — used for schema and page headings. */
export function personName(locale: Locale): string {
  return NAME[locale];
}

/**
 * The Person node. Emitted on the home and about pages only: repeating a full
 * entity on every post adds nothing, and the posts reference it by `@id`.
 */
export function personSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: NAME[locale],
    alternateName: NAME[locale === 'en' ? 'ru' : 'en'],
    description: DESCRIPTION[locale],
    url: absolute(locale === 'en' ? '/' : `/${locale}/`),
    image: absolute('/images/about/about_photo.jpg'),
    jobTitle: JOB_TITLE[locale],
    worksFor: {
      '@type': 'Organization',
      name: 'EPAM Systems',
      url: 'https://www.epam.com/',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: LOCALITY[locale],
      addressCountry: 'RS',
    },
    knowsAbout: [
      'TypeScript',
      'Python',
      'Rust',
      'AI agents',
      'Generative art',
      'Creative coding',
    ],
    sameAs: SAME_AS,
  };
}

/** The WebSite node, tying the blog itself to the person. */
export function websiteSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_TITLE,
    url: absolute(locale === 'en' ? '/' : `/${locale}/`),
    description: DESCRIPTION[locale],
    inLanguage: BCP47[locale],
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  };
}

interface BlogPostingInput {
  title: string;
  description?: string;
  date: Date;
  tags?: string[];
  url: string;
  image: string;
  locale: Locale;
}

/** The per-post node. Authorship points at the shared Person by `@id`. */
export function blogPostingSchema({
  title,
  description,
  date,
  tags,
  url,
  image,
  locale,
}: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    ...(description ? { description } : {}),
    datePublished: date.toISOString(),
    dateModified: date.toISOString(),
    url: absolute(url),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(url) },
    image: absolute(image),
    inLanguage: BCP47[locale],
    ...(tags?.length ? { keywords: tags.join(', ') } : {}),
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': PERSON_ID, '@type': 'Person', name: NAME[locale] },
    publisher: { '@id': PERSON_ID, '@type': 'Person', name: NAME[locale] },
  };
}
