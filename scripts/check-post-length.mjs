#!/usr/bin/env node
// Report the body word count of every blog post, and warn on the ones under the
// floor stated in AGENTS.md.
//
// Rationale: the blog had no stated length and nothing measuring one, and the
// length drifted. Six posts written between 2026-09-10 and 2026-09-15 came in at
// 1,714-2,126 words against the 2,457 of the post that preceded them, trending
// down — the three newest were the three shortest. Nobody chose that. It is what
// happens to a number nothing prints.
//
// This warns, it does not fail. A short post is worse than it should be; it is
// not incorrect, and a gate that blocks a commit over prose length would be
// disabled the first time a genuinely short post was the right call. The floor
// is a conversation-starter with a measurement beside it, which is the whole
// point (see the 2026-09-14 post).
//
// Word counts are of the BODY only: frontmatter, code fences, MDX import lines,
// Mermaid blocks and image markup are stripped, because none of them is prose
// the reader reads. That makes the number comparable across posts that carry a
// lot of code and posts that carry none. It also means these numbers run 10-15 %
// below a naive `wc -w` of the file, and the floor is set against THIS metric.
//
// WHAT THE FLOOR DOES NOT APPLY TO, and why — a floor whose scope is unstated
// gets read as universal and then nagged about until someone deletes it:
//
//   - Posts carrying a `demo:` field. The 2017 creative-coding write-ups exist
//     to introduce an embedded canvas the reader then plays with. The demo is
//     the artifact; the prose is a caption. 27 words is correct there.
//   - Posts dated before 2026. Legacy, and not being rewritten. Counted and
//     shown, never measured against the floor.
//
// Usage:  node scripts/check-post-length.mjs [--floor N] [lang]
// Exit 0 always. Prints a table, then names the in-scope posts under the floor.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Per-language floors. Russian is NOT held to the English number: measured over
// the seven 2026 post pairs, a Russian translation of identical content runs at
// 0.889 of its English source (range 0.855-0.926, so the ratio is stable and not
// an artifact of one post). Russian has no articles and its cases do the work of
// prepositions, so the same content is genuinely fewer words. Holding it to 3500
// would be measuring the language, not the post.
//
// 3500 * 0.889 = 3111, rounded down to 3100. That rounding is the only judgement
// in the number; the ratio is measured. Re-derive with:
//   node scripts/check-post-length.mjs   # then compare the two columns
const FLOORS = { en: 3500, ru: 3100 };
const OVERRIDE = readFloorOverride();
const ROOT = 'src/content/blog';
const langArg = process.argv.find((a) => /^(en|ru)$/.test(a));

function readFloorOverride() {
  const i = process.argv.indexOf('--floor');
  if (i !== -1 && process.argv[i + 1]) return Number(process.argv[i + 1]);
  return null;
}

const floorFor = (lang) => OVERRIDE ?? FLOORS[lang] ?? FLOORS.en;

/** Strip everything that is not prose the reader reads. */
function bodyWords(source) {
  let text = source;

  // Frontmatter: the first --- ... --- block.
  text = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  // Fenced code blocks, including the ```mermaid ones.
  text = text.replace(/^```[\s\S]*?^```/gm, '');
  // MDX import statements.
  text = text.replace(/^import\s+.*$/gm, '');
  // Template-literal props FIRST — `<Mermaid code={`...`} />` carries a diagram
  // whose own markup contains `<br/>`. Stripping JSX before this makes the
  // element match end at that `<br/>`, stranding the literal's closing backtick,
  // and the inline-code pass below then pairs backticks across the whole
  // document and eats most of the post. (Measured: 3,991 words -> 1,475.)
  text = text.replace(/\{`[\s\S]*?`\}/g, ' ');
  // JSX component elements, self-closing or paired.
  text = text.replace(/<[A-Z][A-Za-z0-9]*[\s\S]*?\/>/g, ' ');
  text = text.replace(/<\/?[A-Z][A-Za-z0-9]*[^>]*>/g, ' ');
  // Image markup — alt text is not body prose.
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  // Link syntax: keep the label, drop the URL.
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  // Inline code and markdown table pipes.
  text = text.replace(/`[^`]*`/g, ' ');
  text = text.replace(/^\s*\|.*$/gm, '');

  return text.split(/\s+/).filter(Boolean).length;
}

const langs = langArg ? [langArg] : ['en', 'ru'];
const rows = [];

for (const lang of langs) {
  const dir = join(ROOT, lang);
  let names;
  try {
    names = readdirSync(dir).filter((n) => /\.mdx?$/.test(n));
  } catch {
    continue;
  }
  for (const name of names.sort()) {
    const path = join(dir, name);
    if (!statSync(path).isFile()) continue;
    const source = readFileSync(path, 'utf8');
    const slug = name.replace(/\.mdx?$/, '');
    const isDemo = /^demo:\s*\S/m.test(source.split(/^---$/m)[1] ?? '');
    const isLegacy = !/^20(2[6-9]|[3-9]\d)-/.test(slug);
    rows.push({
      lang,
      slug,
      words: bodyWords(source),
      scoped: !isDemo && !isLegacy,
      why: isDemo ? 'demo' : isLegacy ? 'legacy' : '',
    });
  }
}

if (rows.length === 0) {
  console.log('check-post-length: no posts found under', ROOT);
  process.exit(0);
}

const scoped = rows.filter((r) => r.scoped);
const width = Math.max(...rows.map((r) => r.slug.length));

const floorList = [...new Set(langs)]
  .map((l) => `${l} ${floorFor(l)}`)
  .join(', ');
console.log(`Post body word counts (floors: ${floorList}; long-form posts from 2026 on):
`);

for (const r of rows) {
  const mark = r.scoped
    ? r.words < floorFor(r.lang)
      ? ' ← under floor'
      : ''
    : `  (${r.why}, not scoped)`;
  console.log(
    `  ${r.lang}  ${r.slug.padEnd(width)}  ${String(r.words).padStart(5)}${mark}`,
  );
}

const under = scoped.filter((r) => r.words < floorFor(r.lang));
const mean = scoped.length
  ? Math.round(scoped.reduce((a, r) => a + r.words, 0) / scoped.length)
  : 0;

console.log(`
  ${rows.length} posts, ${scoped.length} in scope, mean ${mean} words across those.`);

if (under.length > 0) {
  console.log(
    `  ${under.length} under floor. Not a failure — see AGENTS.md, "Post length".`,
  );
}
