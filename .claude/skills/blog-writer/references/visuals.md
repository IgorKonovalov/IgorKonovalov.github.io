# Visuals in Posts

The author's rule (2026-10-14): **make visualisations whenever the material allows it.** A
long-form post that is only text and tables is hard to follow; the Diablo II diary was rewritten
around charts for exactly that reason. When you draft a post, plan its pictures together with
its sections, not after.

## What to visualise

Visualise **what was delivered**: the state of the work, what was verified, the results, the
shapes of the algorithms, the things themselves. A good post has, where the material allows:

- a **status grid** of what is done and what is not (`ResearchMap`), at the post's cut-off and
  the earlier posts' cut-offs, so the reader sees progress at a glance;
- a **chart per result** that has numbers: distributions, counts per category, before/after,
  a curve of a formula;
- a **diagram** (Mermaid) for every algorithm or pipeline with a shape;
- **pictures of the thing itself**: game art, maps, screenshots (below).

Do **not** chart process metrics. Commit counts, commits per hour and similar activity numbers
say nothing about quality; the author rejected a commit heatmap (2026-10-14). One plain sentence
about how the work was organised is enough.

## Components (`src/components/charts/`)

All render at build time to HTML/SVG, use the `--viz-*` tokens from `src/styles/tokens.css`,
take `lang="ru"` for the Russian twin, and repeat their numbers in a "Show the numbers" table.

| Component           | Use for                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `ResearchMap`       | status grid of the d2-recon research map; `snapshots={['d1','d3','d4']}` gives day tabs                                   |
| `BarChart`          | categories: grouped (`series` > 1) or `stacked`; `unit`, `max` for a shared scale                                         |
| `TagTimeline`       | confirmed vs inferred claims over time; `until="DD HH:MM"` for an older post's cut-off                                    |
| `ProgressMultiples` | headline counts at several cut-offs as small multiples; `snapshots`, `keys`                                               |
| `MagicFindCurve`    | the Diablo II magic find curve; `marks` for the MF values the text discusses                                              |
| `BloodMoorMaps`     | level layouts as cell grids (one square per 8×8-tile cell)                                                                |
| `Timeline`          | dated events of a life or a project, one per line, coloured by `groups`; readable on a phone, unlike Mermaid's `timeline` |
| `GameArt`           | a row of pixel-art images with captions and the Blizzard credit                                                           |
| `Mermaid`           | diagrams; keep long chains `flowchart TB`, use `LR` only for 3–5 short nodes                                              |

A new kind of chart gets a new component in the same style. Load the `dataviz` skill first and
run its palette validator on any new colours.

## Data

- Data behind the charts lives in `src/data/<topic>.ts` (e.g. `d2recon.ts`), with the source of
  every block in a comment: the file, the commit, the run id. Short one-off rows can sit inline
  in the MDX props.
- Read every number at the post's cut-off commit, the same as the prose. When an older post
  counted something differently (e.g. commits reachable from its cut-off), show its number, not
  today's.
- Never put a number in a chart that is not in the sources. A chart note must not repeat the
  sentence next to it; say where the data comes from or what to look at instead.

## Game art (Diablo II and other games)

Pictures of the monsters and items the text talks about make a post concrete. The d2-recon
repository renders them locally under `workspace/render/` and, by its ADR-0005, never commits
them. Publishing a few on the blog is the author's decision (made 2026-10-14). Rules:

- **A handful per post, each tied to the text**: the item that dropped, the monster in the run.
  Never galleries, sprite sheets, tile sets or bulk dumps.
- **Credit**: `GameArt` prints "Diablo II art © Blizzard Entertainment." under every figure.
- **Where to get it** (in `~/Work/recompilcation-project`, read-only use):
  - items: `workspace/render/items/` has one sheet per item (inventory picture, drop frames,
    worn on a character): `<code>.png` for bases, `unique_<row>_<slug>.png`,
    `set_<row>_<slug>.png`; `items/index.tsv` maps names to files;
  - monsters: `python3 -I tools/cof.py compose workspace/merged monsters/<token> NU HTH <out-dir>
--dirs 0 --frame 0` writes `<out-dir>/units/<token>/nu_0.png`. The token is `MonStats.Code`
    (lower-case); a superunique's class is in `superuniques.txt` `Class`. Write to the scratchpad,
    not `workspace/render`. The result has no superunique colour shift; say so in the caption;
  - level layouts: run the project's replay scripts (e.g. `tools/outdoor_replay.py`) on logged
    games and draw the result as boxes, as `BloodMoorMaps` does.
- **Files**: copy into `public/images/<topic>/` with kebab-case names, and write a lossless WebP
  next to each PNG (`magick x.png -define webp:lossless=true x.webp`). `GameArt` serves the WebP
  with the PNG as fallback, scales by a whole number with `image-rendering: pixelated`, and
  lazy-loads.
- **Alt text** describes what is visible ("green body armour, its drop frames and a character
  wearing it"), in the post's language.

## Checking

- `yarn build`, `yarn astro check`, `npx eslint src/components/charts`, prettier.
- Look at every changed page: desktop light and dark, and 390 px wide. Headless Chrome's
  `--virtual-time-budget` freezes the clock, so Mermaid gives several diagrams the same id and
  leaves them blank. That is not a site bug: take screenshots over the DevTools protocol with
  real time passing (a short Node script that navigates, waits ~6 s, then
  `Page.captureScreenshot`).
- Check labels for collisions (line-chart end labels, long Russian strings), dark sprites on
  the dark theme, and diagrams too wide to read on a phone.
