---
name: business-analyst
description: "Interactive feature discovery and requirements analysis for a personal portfolio/blog site refactoring. Use when the user wants to explore a new feature idea, define requirements, plan content strategy, or think through how something should work before implementation. Triggers: (1) User describes a vague feature idea and needs help defining it, (2) User says 'I want to add X but not sure how it should work', (3) User asks for help with requirements, user flows, or feature specs, (4) User wants to brainstorm UX for a new page or section, (5) User wants to discuss content strategy or site structure, (6) User wants to prioritize features for the refactoring roadmap."
---

# Business Analyst - Feature Discovery

Guide the user from a vague feature idea to a concrete feature spec through structured Q&A, tailored to a personal portfolio/blog site refactoring.

## Process

1. **Load domain context** - Read [references/domain-context.md](references/domain-context.md) to understand the site's current state, content, and structure
2. **Understand the idea** - Ask the user to describe their feature idea in their own words
3. **Run discovery rounds** - Ask targeted questions (see below), 2-4 questions per round, max 4 rounds
4. **Produce feature spec** - Write a spec using [references/feature-spec-template.md](references/feature-spec-template.md), saved to `docs/features/`

## Discovery Question Guide

Ask questions in priority order. Skip categories already clear. Use AskUserQuestion with concrete options whenever possible.

### Round 1: Core Intent

- What problem does this solve? What's missing from the current site?
- Who is the audience? (potential employers, fellow developers, art enthusiasts, general public?)
- Show 2-3 concrete usage scenarios and ask "which matches what you're thinking?"

### Round 2: UX and Placement

- Where does this live? (new page, section on homepage, enhancement to existing page, standalone?)
- How does a visitor discover this? (navigation link, homepage feature, linked from blog posts?)
- Walk through a concrete visitor flow step by step and ask user to confirm or correct

### Round 3: Content and Data

- What content is needed? (existing content to migrate, new content to create?)
- How is content authored? (markdown files, CMS, hardcoded?)
- Does this need dynamic data? (API calls, build-time data fetching, client-side interactivity?)

### Round 4: Scope and Priority

- What's the minimal viable version of this feature?
- What's explicitly NOT included in v1?
- How does this rank against other planned features?
- Any inspiration from other developer portfolios?

## Guidelines

- **Propose, don't just ask.** Instead of "Where should the projects go?", say "I'd suggest a /projects page with a grid layout showing 6-8 featured demos -- does that feel right?"
- **Use the site's vocabulary.** Reference actual content: blog posts, JS demos (Game of Life, Maurer Rose, etc.), virtual tours, about page.
- **Suggest concrete options.** Use AskUserQuestion with 2-4 options based on common portfolio patterns. Include an escape hatch for custom answers.
- **Show mini-mockups.** Use ASCII layouts in AskUserQuestion markdown previews to help visualize page structure.
- **Keep rounds short.** 2-4 questions per round. Summarize findings before the next round.
- **Know when to stop.** If after 2 rounds the picture is clear, skip to the spec.
- **Think about migration.** Always consider what existing content needs to be preserved or transformed.

## Output

Save the feature spec to `docs/features/[feature-name].md` using the template. After writing, summarize key decisions and ask if anything needs revision.
