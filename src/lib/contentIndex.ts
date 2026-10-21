/**
 * A config-time view of the blog: every post's URL, its last change, and the
 * URL it had under Jekyll. `astro.config.mjs` runs before `astro:content`
 * exists, so this scans `src/content/blog` directly and derives URLs through
 * the same `postHref` the pages use.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { getLocale, postHref, type PostLike } from './postUrl';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const CONTENT_DIR = 'src/content/blog';
const PAGES_DIR = 'src/pages';

/**
 * The day the Astro build replaced Jekyll. Only posts published before it ever
 * had a Jekyll URL, so only they get a redirect from one.
 */
const JEKYLL_RETIRED = new Date('2026-02-22');

export interface ScannedPost extends PostLike {
  /** Repo-relative path, the key for git lookups. */
  file: string;
  /** The filename's title part with its case intact, as Jekyll spelled it. */
  cased: string;
  href: string;
}

function parseFrontmatter(src: string, file: string): PostLike['data'] {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src);
  if (!match) throw new Error(`${file}: no frontmatter block`);
  // The timestamp tag makes `2017-10-28` a Date, as the content schema does.
  const data = parse(match[1], { customTags: ['timestamp'] });
  if (!(data?.date instanceof Date)) {
    throw new Error(`${file}: frontmatter needs a date`);
  }
  return { date: data.date, tags: data.tags };
}

/** Every post in both locales, URL derived exactly as the pages derive it. */
export function scanPosts(): ScannedPost[] {
  const posts: ScannedPost[] = [];
  for (const locale of ['en', 'ru'] as const) {
    const dir = path.join(ROOT, CONTENT_DIR, locale);
    for (const name of readdirSync(dir).sort()) {
      if (!/\.(md|mdx)$/.test(name)) continue;
      const file = path.posix.join(CONTENT_DIR, locale, name);
      const stem = name.replace(/\.(md|mdx)$/, '');
      // Astro's glob loader slugifies the id, which for these filenames
      // (letters, digits, underscores) means lowercasing it. The redirect
      // integration verifies every derived target against the built site,
      // so a drift here fails the build rather than shipping a dead link.
      const id = `${locale}/${stem.toLowerCase()}`;
      const data = parseFrontmatter(
        readFileSync(path.join(ROOT, file), 'utf8'),
        file,
      );
      const post = { id, data };
      posts.push({
        ...post,
        file,
        cased: stem.replace(/^\d{4}-\d{2}-\d{2}-/, ''),
        href: postHref(post),
      });
    }
  }
  return posts;
}

/**
 * Old URL → new URL for everything Jekyll served. Jekyll's default permalink
 * was `/:categories/:year/:month/:day/:title.html` with the filename's case
 * kept, so `Arduino_Node_SocketIO.markdown` lived at
 * `/projects/2017/10/28/Arduino_Node_SocketIO.html`. The feed moved too.
 */
export function legacyRedirects(posts = scanPosts()): Record<string, string> {
  const redirects: Record<string, string> = { '/feed.xml': '/rss.xml' };
  for (const post of posts) {
    if (getLocale(post) !== 'en' || post.data.date >= JEKYLL_RETIRED) continue;
    const old = post.href.replace(/[^/]+\/$/, `${post.cased}.html`);
    redirects[old] = post.href;
  }
  return redirects;
}

/**
 * The last commit date of every file under the content and pages trees, from
 * one `git log` pass: a file's first appearance in reverse-chronological
 * output is its latest change.
 *
 * A shallow clone would report HEAD's date for every file, which is a wrong
 * answer that looks right, so it is refused in favour of the frontmatter date.
 */
function gitLastCommitDates(): Map<string, string> {
  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
  if (git('rev-parse', '--is-shallow-repository') === 'true') {
    console.warn(
      '[sitemap] shallow clone: lastmod falls back to post dates. ' +
        'Check out with fetch-depth: 0 for real modification dates.',
    );
    return new Map();
  }
  const dates = new Map<string, string>();
  let current = '';
  const log = git(
    'log',
    '--format=%cI',
    '--name-only',
    '--',
    CONTENT_DIR,
    PAGES_DIR,
  );
  for (const line of log.split('\n')) {
    if (!line) continue;
    if (/^\d{4}-\d{2}-\d{2}T/.test(line)) current = line;
    else if (!dates.has(line)) dates.set(line, current);
  }
  return dates;
}

/**
 * Sitemap `lastmod` per site path. Posts take their file's last commit; the
 * home and archive pages take the newest post, since that is what changes
 * them; the about pages take their own file's last commit.
 */
export function lastmodIndex(posts = scanPosts()): Map<string, string> {
  const commits = gitLastCommitDates();
  const index = new Map<string, string>();
  let newest = '';
  for (const post of posts) {
    const lastmod = commits.get(post.file) ?? post.data.date.toISOString();
    index.set(post.href, lastmod);
    if (lastmod > newest) newest = lastmod;
  }
  for (const home of ['/', '/archive/', '/ru/', '/ru/archive/']) {
    index.set(home, newest);
  }
  for (const [href, file] of [
    ['/about/', `${PAGES_DIR}/about.astro`],
    ['/ru/about/', `${PAGES_DIR}/ru/about.astro`],
  ]) {
    const lastmod = commits.get(file);
    if (lastmod) index.set(href, lastmod);
  }
  return index;
}
