# Write → Critique → Questions → Fix

The loop for a long-form post Claude drafts from research (git history, run records, repos),
as opposed to a post the author dictated. First used on `2026-10-07-What_207_Commits_Are_Made_Of`;
the author asked for it to be the standard way.

## 1. Write

- Gather facts first, and delegate the digging: one research agent per repository or source,
  each asked for hard numbers **with file paths**, and told to say "not available" rather than
  estimate. Keep their raw dumps out of the main context.
- Read the previous related posts (EN and RU) so the new one builds on them and does not repeat.
- Draft the English post, then fact-check it against the research before anything else:
  recount every number that is a sum (the first draft said "fourteen parks" over a list that
  added up to ten), check timezones (conductor records mix UTC and local), and remove every
  sentence that states the author's feelings, memories or plans that nobody told you.
- Draft the Russian twin per [russian-translation.md](russian-translation.md).
- Run `node scripts/check-post-length.mjs` and `yarn build`.

## 2. Critique, in parallel

Spawn **two critic agents at once**, one per language. They read and report; they never edit.
Each gets:

- The post path, the voice guide ([style-guide.md](style-guide.md)), the previous post for
  voice and context, and the length floor from `AGENTS.md` (cuts must say what replaces them).
- Its hunt list:
  - **AI-writing tells:** "not X, but Y" / "X is not Y. It is Z." contrasts, a bolded aphorism
    closing every section, triplets, a tidy moral, signposting ("I will come back to…",
    "Here is the honest breakdown"), symmetric rhythm, too many em dashes and colons, generic
    metaphors.
  - **Clarity:** jargon a reader of only this post will not follow, numbers without meaning,
    tables that do not earn their place, mixed units or timezones.
  - **Report voice:** places with no person in them, missing reactions, skipped scenes.
  - **Repetition:** a conclusion that restates the sections above it.
  - **Overreach:** claims stronger than the evidence, including internal contradictions.
  - **Russian critic only:** calques per [russian-translation.md](russian-translation.md),
    one Russian term per concept, ё, grammar.
- Output format: a prioritized list, each item = short quote, one-line problem, concrete rewrite.

## 3. Questions

Critics propose human-sounding rewrites by **inventing** the author's experience ("I don't
remember what I was doing — probably…", "it felt like being a manager"). Never apply those.
Instead:

- Fix factual errors the critics found immediately, after verifying them against the source.
- Summarize both critiques for the author: where they agree, structure ideas, language-specific
  fixes.
- Ask the author **numbered questions** for everything only they know: how they noticed an
  incident, what they were doing in a gap, how the day felt, what really comes next. Offer to
  leave a passage neutral if they would rather not say.

## 4. Fix

- Apply the critiques and the author's answers to **both** versions, keeping the answers in
  the author's own words as closely as the language allows, and adding nothing beyond them
  (no motivations or feelings the answer did not contain).
- Re-run the length check (both floors) and `yarn build`, then format with prettier.
- If the author corrects a Russian phrasing, add the pattern to `russian-translation.md`.
