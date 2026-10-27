/**
 * The closed tag vocabulary. The content schema accepts only these slugs, so a
 * new tag is a deliberate edit here rather than a typo in one post's
 * frontmatter (`agent` beside `agents`).
 *
 * A `series` tag names one project followed across several posts; a `topic`
 * tag cuts across projects and years. The listing card shows a post's series
 * when it has one, since that is what tells two "day N" posts apart.
 *
 * Slugs are shared by both locales — they are URL segments, like post slugs.
 * Only the label and description are translated.
 */
import type { Locale } from './postUrl';

export type TagKind = 'series' | 'topic';

interface TagInfo {
  kind: TagKind;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
}

export const TAGS = {
  'd2-recon': {
    kind: 'series',
    label: { en: 'd2-recon', ru: 'd2-recon' },
    description: {
      en: 'A preservation project: documenting Diablo II 1.14d precisely enough to rebuild it.',
      ru: 'Проект сохранения: описать Diablo II 1.14d настолько точно, чтобы её можно было собрать заново.',
    },
  },
  'voxel-engine': {
    kind: 'series',
    label: { en: 'Voxel engine', ru: 'Воксельный движок' },
    description: {
      en: 'A game-agnostic voxel engine in Rust, ray-marched in compute shaders.',
      ru: 'Воксельный движок на Rust, не привязанный к игре, с ray marching в compute-шейдерах.',
    },
  },
  agents: {
    kind: 'topic',
    label: { en: 'AI agents', ru: 'AI-агенты' },
    description: {
      en: 'Building real software with a team of coding agents: the harness, the plans, the reviews.',
      ru: 'Настоящие проекты силами команды агентов: обвязка, планы, ревью.',
    },
  },
  workflow: {
    kind: 'topic',
    label: { en: 'Workflow', ru: 'Процесс' },
    description: {
      en: 'How the work is organised: plans, lanes, skills, decision records.',
      ru: 'Как устроена работа: планы, дорожки, навыки, записи решений.',
    },
  },
  verification: {
    kind: 'topic',
    label: { en: 'Verification', ru: 'Проверки' },
    description: {
      en: 'Gates, tests and measurements, and what each of them cannot tell you.',
      ru: 'Гейты, тесты и измерения — и то, чего каждый из них сказать не может.',
    },
  },
  automation: {
    kind: 'topic',
    label: { en: 'Automation', ru: 'Автоматизация' },
    description: {
      en: 'Work that runs unattended: conductors, queues, nights nobody watched.',
      ru: 'Работа без присмотра: дирижёры, очереди, ночи, за которыми никто не следил.',
    },
  },
  architecture: {
    kind: 'topic',
    label: { en: 'Architecture', ru: 'Архитектура' },
    description: {
      en: 'How a system is cut into parts, and why there.',
      ru: 'Как система разрезана на части и почему именно так.',
    },
  },
  'reverse-engineering': {
    kind: 'topic',
    label: { en: 'Reverse engineering', ru: 'Реверс-инжиниринг' },
    description: {
      en: 'Recovering how a program works from the program itself.',
      ru: 'Восстановление того, как работает программа, по самой программе.',
    },
  },
  rust: {
    kind: 'topic',
    label: { en: 'Rust', ru: 'Rust' },
    description: {
      en: 'Projects written in Rust.',
      ru: 'Проекты на Rust.',
    },
  },
  graphics: {
    kind: 'topic',
    label: { en: 'Graphics', ru: 'Графика' },
    description: {
      en: 'Real-time rendering on the GPU.',
      ru: 'Рендеринг в реальном времени на GPU.',
    },
  },
  'generative-art': {
    kind: 'topic',
    label: { en: 'Generative art', ru: 'Генеративное искусство' },
    description: {
      en: 'Patterns grown from rules: automata, walkers, roses, L-systems.',
      ru: 'Узоры, выращенные из правил: автоматы, блуждания, розы, L-системы.',
    },
  },
  javascript: {
    kind: 'topic',
    label: { en: 'JavaScript', ru: 'JavaScript' },
    description: {
      en: 'Posts built in plain JavaScript.',
      ru: 'Записи, сделанные на чистом JavaScript.',
    },
  },
  hardware: {
    kind: 'topic',
    label: { en: 'Hardware', ru: 'Железо' },
    description: {
      en: 'Software that talks to physical devices.',
      ru: 'Программы, которые общаются с физическими устройствами.',
    },
  },
  personal: {
    kind: 'topic',
    label: { en: 'Personal', ru: 'Личное' },
    description: {
      en: 'About the blog and its author.',
      ru: 'О блоге и его авторе.',
    },
  },
} as const satisfies Record<string, TagInfo>;

export type Tag = keyof typeof TAGS;

/** Every slug, as a non-empty tuple for `z.enum`. */
export const TAG_SLUGS = Object.keys(TAGS) as [Tag, ...Tag[]];

/** The tag a listing card shows: the series if the post has one, else its first tag. */
export function primaryTag(tags: readonly Tag[] | undefined): Tag | undefined {
  return tags?.find((tag) => TAGS[tag].kind === 'series') ?? tags?.[0];
}

/**
 * Every tag the given posts carry with its post count: series first, then
 * topics, each by count. Tags no post carries are left out.
 */
export function tagCounts(
  posts: readonly { data: { tags?: readonly Tag[] } }[],
): { tag: Tag; count: number }[] {
  return TAG_SLUGS.map((tag) => ({
    tag,
    count: posts.filter((post) => post.data.tags?.includes(tag)).length,
  }))
    .filter(({ count }) => count > 0)
    .sort(
      (a, b) =>
        Number(TAGS[a.tag].kind === 'topic') -
          Number(TAGS[b.tag].kind === 'topic') || b.count - a.count,
    );
}

/** The tag's listing page, e.g. `/tags/agents/` or `/ru/tags/agents/`. */
export function tagHref(tag: string, locale: Locale): string {
  return `${locale === 'en' ? '' : `/${locale}`}/tags/${tag}/`;
}
