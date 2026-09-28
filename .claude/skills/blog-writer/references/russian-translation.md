# English → Russian: Writing Natural Russian

The Russian version is a post a Russian developer would have written, not a translation of the
English one. The failure mode is not wrong words, it is **English sentence structure in Russian
words** (calque): every sentence parses, and none of them sounds like a person.

The examples below come from the first draft of `2026-09-26-Approval_Is_The_Go` (RU), which the
author rejected as unnatural.

## The test

Read each sentence and ask: **would a Russian engineer say this out loud to a colleague?** If the
sentence only makes sense because you can see the English behind it, rewrite it from the meaning.
Never keep a structure just because it maps one-to-one.

## Calque patterns to catch

### 1. English contrast frames: "X rather than Y", "treated as A rather than B"

| Calque                                                                   | Natural                                                             |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| параллельную машинерию держал как доступную, а не как режим по умолчанию | параллельный режим включал при необходимости, а не по умолчанию     |
| Одну хорошо управляемую петлю я запускал куда чаще, чем несколько        | Чаще всего я вёл одну хорошо налаженную петлю, а не несколько сразу |

Rebuild around a verb a Russian speaker would use ("включал при необходимости"), not around the
English adjective ("available").

### 2. Abstract nouns as subjects and objects ("carried a decision", "the risk is carried by")

| Calque                                                      | Natural                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| Четыре вмешательства без единого решения                    | Четыре действия, в которых нечего было решать               |
| Этот риск так же хорошо закрывает сессия, которой выдан…    | От этого риска так же хорошо защищает сессия, которой дали… |
| не несёт в себе никаких рассуждений реализации              | ничего не знает о ходе реализации                           |
| Это та категория, которую самоотчёт сессии поймать не может | Такие ошибки самоотчёт сессии поймать не может              |

English lets abstractions act ("the approval records", "the argument survived"). Russian prefers
a person or a concrete thing as the actor, or an impersonal construction.

### 3. Literal verbs from English idioms

| English                         | Calque                                     | Natural                                 |
| ------------------------------- | ------------------------------------------ | --------------------------------------- |
| fails on a fact                 | проваливается на факте                     | отпадает из-за факта                    |
| earned its keep                 | —                                          | окупился                                |
| on no schedule                  | без всякого расписания                     | когда угодно                            |
| quietly erode                   | незаметно подточить                        | незаметно размыть                       |
| the ask                         | просьба (ok) / запрос                      | keep, but check the whole sentence      |
| lands its error                 | —                                          | протащит свою ошибку                    |
| a claim `git` does not bear out | утверждение, которое `git` не подтверждает | Если `git` заявление не подтверждает, … |

### 4. Participle chains copied from English relative clauses

"the one fix nobody else had reviewed was the gate on everything after it" should not become a
stack of participles. Split into two sentences or use «тот самый … через который проходило всё
остальное».

### 5. Keeping the English emphasis word where Russian has none

"the important word is _inside_" → the Russian claim must contain a word that actually carries
the emphasis. «Рецензия… бесполезна, если её делает та же сессия» → «ключевое слово здесь — _та
же_». Do not italicise a Russian word that is not the pivot of the sentence.

## Terminology

Pick one Russian term per concept, use it everywhere, including Mermaid labels and table rows.

| English              | Use                  | Avoid                            |
| -------------------- | -------------------- | -------------------------------- |
| merge (verb)         | влить, слить         | смёржить (only in casual speech) |
| merged plans         | влитые планы         | смёрженные                       |
| lock                 | блокировка           | замок                            |
| repair (session)     | починка              | ремонт                           |
| decision record, ADR | ADR (masc.), решение | «запись о решении»               |
| claim (by a session) | заявление            | утверждение (when ambiguous)     |
| evidence             | доказательство       | свидетельства (plural calque)    |
| spend cap            | лимит трат           | потолок трат                     |
| allowlist            | список разрешений    | —                                |
| fast-forward         | перемотать вперёд    | —                                |

Keep untranslated: code identifiers, CLI flags, park reasons (`plan_wrong`), section names quoted
from files (`Needs you`, `## Close review`), git/CLI jargon a Russian dev uses in English
(worktree, headless, commit → коммит, push → пушить).

## Quotes from earlier posts

When the English quotes an earlier post, **quote the Russian version of that post verbatim**
(grep `src/content/blog/ru/`). Do not re-translate the English quote.

## Process

1. Translate paragraph by paragraph **from the meaning**: read the English paragraph, close it,
   write the Russian.
2. Self-review pass: read only the Russian, top to bottom, applying the test above. Hunt
   specifically for patterns 1–5.
3. Check terminology consistency (grep for the "Avoid" column).
4. Run `node scripts/check-post-length.mjs ru`.
