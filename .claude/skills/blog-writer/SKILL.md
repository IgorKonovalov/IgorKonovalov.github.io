---
name: blog-writer
description: >
  Polish and translate blog post text from raw Russian speech-to-text dictation into clean English.
  Three-step workflow: (1) polish Russian text, (2) translate to English, (3) polish English text.
  Optionally wrap result into MDX blog post format. Use when: the user pastes raw Russian text for
  a blog post, asks to polish/translate dictated text, wants to convert Russian draft to English
  blog post, or says something like "here's my draft" or "I dictated this" followed by Russian text.
  ALSO use when translating an English post into Russian (the `src/content/blog/ru/` twin) or
  reviewing a Russian translation for naturalness.
  ALSO use when drafting a long-form post from research (git history, run records) — follow the
  write → critique → questions → fix loop in references/review-loop.md.
---

# Blog Writer

Process raw Russian speech-to-text into polished English blog content. The author's voice is
personal, enthusiastic, and technically approachable — see [style-guide.md](references/style-guide.md).

## Critical Rules

1. **Never add or remove content.** Only fix style, grammar, and speech-to-text artifacts.
2. **Never change meaning.** If something seems factually wrong, flag it as a question — do not silently correct it.
3. **Ask about unclear parts.** If a sentence seems out of place or nonsensical (likely a dictation error), ask the author what was meant before guessing.
4. **Preserve the author's voice.** The writing should sound like him, not like a polished corporate blog.

## Workflow

Execute these steps sequentially. Present each step's output and wait for approval before proceeding.

### Step 1: Polish Russian

Take the raw dictated Russian text and:

- Fix obvious speech-to-text errors (misrecognized words, broken sentences)
- Clean up punctuation and sentence boundaries
- Smooth incomplete thoughts into coherent sentences without adding new ideas
- Flag any passages that seem out of place or unclear — present these as numbered questions

Output format:

```
## Polished Russian

[cleaned text]

## Questions (if any)

1. "[quoted unclear passage]" — what did you mean here?
```

Wait for the author to answer questions (if any) and confirm the Russian text before proceeding.

### Step 2: Translate to English

Translate the approved Russian text to English:

- Translate meaning, not word-for-word
- Maintain the conversational, first-person tone
- Keep technical terms accurate
- Preserve short punchy sentences and enthusiasm markers

Output the English translation. Wait for approval.

### Step 3: Polish English

Refine the English text for readability:

- Fix awkward phrasing while keeping the natural non-native voice (don't over-polish)
- Ensure technical accuracy in terminology
- Smooth transitions between ideas
- Read [style-guide.md](references/style-guide.md) for tone examples and patterns to match

Output the final polished text. Wait for approval.

### Step 4 (Optional): Wrap into MDX

If the author requests a blog post, read [mdx-format.md](references/mdx-format.md) and:

- Ask for title, tags, description, and whether the post has a demo component
- Generate the complete MDX file with frontmatter
- Use the file naming convention: `YYYY-MM-DD-Title_With_Underscores.mdx`
- Write the file to `src/content/blog/`

## Drafting a Post From Research: Write → Critique → Questions → Fix

When Claude writes a long-form post itself (from git history, run records, repositories) rather
than polishing the author's dictation, follow the loop in
[review-loop.md](references/review-loop.md): research with agents, draft EN and RU, then two
parallel critic agents (one per language), then numbered questions to the author for anything
only the author knows, then apply. Never fill a gap with an invented feeling, memory or plan.

## Translating an English Post to Russian

Most posts are now written in English first and get a Russian twin in `src/content/blog/ru/` with
the same filename. Before writing or reviewing one, read
[russian-translation.md](references/russian-translation.md) — it lists the calque patterns that
made earlier translations sound unnatural, the fixed terminology, and the self-review pass.

- Write from the meaning, not from the English sentence structure
- Always do the Russian-only read-through before presenting the result
- Quote earlier posts from their Russian versions, never re-translate the quote
- When the author corrects a phrasing, add the pattern to `russian-translation.md`
