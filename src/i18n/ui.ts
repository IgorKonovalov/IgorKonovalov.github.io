import { DEFAULT_LOCALE, type Locale } from '../lib/postUrl';

export { DEFAULT_LOCALE, LOCALES, type Locale } from '../lib/postUrl';

/**
 * UI string dictionary. `en` is the source of truth and must stay byte-for-byte
 * identical to the previously hardcoded copy so English output never changes.
 * `ru` values are author-facing chrome (nav, labels, tagline) — review for tone.
 */
export const ui = {
  en: {
    'nav.about': 'About',
    'nav.archive': 'Archive',
    'home.title': 'Notes on programming',
    'home.tagline':
      'A programming blog — experiments and notes on software, AI agents, and generative art.',
    'archive.title': 'Archive',
    'card.read': 'Read',
    'post.postedOn': 'Posted on',
    noPosts: 'No posts yet.',
    'footer.description':
      'Belgrade, Serbia. Fullstack developer working in TypeScript and Python, building AI agents and creative-coding experiments. Personal blog and portfolio.',
    'lang.name': 'English',
    'lang.switchTo': 'Русский',
  },
  ru: {
    'nav.about': 'Обо мне',
    'nav.archive': 'Архив',
    'home.title': 'Заметки о программировании',
    'home.tagline':
      'Блог о программировании — эксперименты и заметки о разработке, AI-агентах и генеративном искусстве.',
    'archive.title': 'Архив',
    'card.read': 'Читать',
    'post.postedOn': 'Опубликовано',
    noPosts: 'Пока нет записей.',
    'footer.description':
      'Белград, Сербия. Fullstack-разработчик на TypeScript и Python, создаю AI-агентов и эксперименты с генеративным искусством. Личный блог и портфолио.',
    'lang.name': 'Русский',
    'lang.switchTo': 'English',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

/** Look up a UI string for a locale, falling back to the default locale. */
export function t(locale: Locale, key: UIKey): string {
  return ui[locale][key] ?? ui[DEFAULT_LOCALE][key];
}

/** The BCP-47 tag used for `Intl` date formatting per locale. */
export const DATE_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  ru: 'ru-RU',
};

/**
 * The current locale for a page, derived from its URL path. Anything under
 * `/ru/` (or `/ru`) is Russian; everything else is the unprefixed default.
 */
export function getLocaleFromPath(pathname: string): Locale {
  return pathname === '/ru' || pathname.startsWith('/ru/') ? 'ru' : 'en';
}

/** The home path for a locale (`/` for en, `/ru/` for ru). */
export function localeHome(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}/`;
}

/**
 * Prefix an absolute, unprefixed site path (`/about/`) with the locale segment
 * when it is not the default locale (`/ru/about/`).
 */
export function localizePath(path: string, locale: Locale): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}

/** The other locale in the pair. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ru' : 'en';
}

/**
 * The same page's path in the other locale: add the `/ru` prefix on default
 * pages, strip it on Russian ones. `/` ↔ `/ru/`, `/about/` ↔ `/ru/about/`.
 */
export function toggleLocalePath(pathname: string): string {
  if (pathname === '/ru' || pathname.startsWith('/ru/')) {
    const stripped = pathname.replace(/^\/ru/, '');
    return stripped === '' ? '/' : stripped;
  }
  return pathname === '/' ? '/ru/' : `/ru${pathname}`;
}

/**
 * hreflang + switcher info for a page whose translation is *known to exist*
 * (the static pages: home, archive, about). `alternates` maps each locale to
 * its path; `switchHref` is where the language toggle points.
 */
export function pageI18n(pathname: string): {
  switchHref: string;
  alternates: Record<Locale, string>;
} {
  const isRu = pathname === '/ru' || pathname.startsWith('/ru/');
  const other = toggleLocalePath(pathname);
  return {
    switchHref: other,
    alternates: isRu
      ? { en: other, ru: pathname }
      : { en: pathname, ru: other },
  };
}
