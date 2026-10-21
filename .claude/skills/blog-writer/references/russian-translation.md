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

### 6. Verbs that mean something else in Russian, and tautologies

From the first draft of `2026-10-13-Diablo_II_Days_Two_And_Three` (RU), which the author called
"a bit unnatural".

| Calque                                      | Natural                                       |
| ------------------------------------------- | --------------------------------------------- |
| складывает 1 в 2 (folds 1 into 2)           | превращает 1 в 2 («складывает» = adds)        |
| с одного к четырём до одного к трём (share) | с четверти до трети («к» reads as a ratio)    |
| Здесь умерло несколько предположений        | Тут не подтвердилось несколько предположений  |
| репозиторий может сказать                   | по репозиторию можно понять                   |
| играть в игру; по чтению … не читается      | играть; сначала мы решили, что игра не читает |
| уйдёт с сида (goes off the seed)            | собьётся с последовательности сида            |
| сыграл запуск                               | сам прошёл (уровень)                          |
| Получается, что … / Дальше …                | Выходит, … / А теперь …                       |

Also: «в Nightmare» → «на Nightmare» (difficulty), and "draw" is «взять число», never «шаг»,
which collides with "step" of the generator.

### 7. Calques the critics caught in the 16 October posts

From the Russian critiques of `2026-10-16-Voxel_Engine_Day_One` and `2026-10-16-Diablo_II_Days_Five_And_Six`
(agent critics, not yet confirmed by the author).

| English                            | Calque                                | Natural                                         |
| ---------------------------------- | ------------------------------------- | ----------------------------------------------- |
| destruction feeds the loot         | разрушение кормит лут                 | разрушение — источник лута                      |
| a cautionary tale                  | поучительный пример                   | пример того, как делать не надо                 |
| blessed on Linux (a golden)        | благословлён на Linux                 | закреплён на Linux                              |
| falls back when…                   | откатывается, когда…                  | уходит на запасной путь, когда…                 |
| a runaway run                      | сбежавший запуск                      | запуск, который разъелся по памяти              |
| missed by a lot                    | не выполнено с большим запасом        | промах большой («с запасом» значит «уложились») |
| the op fails / the builder refuses | правка отказывает, сборщик отказывает | правка отвергается; сборщик не принимает        |
| a mercenary's kill                 | убийство наёмника                     | когда убивает наёмник                           |
| the level term                     | член с уровнем                        | слагаемое с уровнем                             |
| on the wire                        | на проводе                            | в канале                                        |
| rulings finer than the rule        | решения тоньше правила                | ревьюеры решали тоньше, чем написано в правиле  |
| projections (unmeasured numbers)   | проекции                              | оценки, прикидки                                |
| killed every lane at once (OOM)    | убил все лейны разом                  | убил все сессии разом (author, 2026-10-16)      |

Collisions to avoid, one Russian word per concept:

- **addendum** (owner addendum to a run record) → «аддендум владельца». Never «дополнение»: that is
  the expansion (LoD). The author rejected «приписка» (2026-10-16).
- **chamber** (a carved cavity) → «полость». «Камера» is the camera.
- **blocked phase** → «остановка». «Блокировка» is a lock.
- **reference image / visual reference** → «ориентир» or «планка». «Эталон» is a golden image.
- **rank slot** (warps) → «позиция ранга». «Слот» is a harness slot.
- **drop resolution** → «вызов раскрытия», as in the earlier posts; not «раскрытие дропа».
- **probe** → «зонд»; **spike** (a time-boxed experiment) → «проба».
- headless stays `headless`; ray marching stays `ray marching`, the march pass is «проход лучей».
- Gem grades: perfect → «идеальный», flawless → «безупречный», chipped → «сколотый».

## Terminology

Pick one Russian term per concept, use it everywhere, including Mermaid labels and table rows.

| English              | Use                  | Avoid                            |
| -------------------- | -------------------- | -------------------------------- |
| merge (verb)         | влить, слить         | смёржить (only in casual speech) |
| merged plans         | влитые планы         | смёрженные                       |
| lock                 | блокировка           | замок                            |
| preset (DS1)         | пресет               | готовая карта, готовый файл      |
| superior (quality)   | превосходный         | высокого качества                |
| spawn (monsters)     | спавн, расстановка   | заселение                        |
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

### 8. Calques the critics caught in the 21 October posts

From the Russian critiques of `2026-10-21-Diablo_II_Days_Seven_To_Eleven` and
`2026-10-21-Voxel_Engine_Days_Two_To_Six` (agent critics, applied, not yet confirmed by the author).

| English                                   | Calque                          | Natural                                                |
| ----------------------------------------- | ------------------------------- | ------------------------------------------------------ |
| the blows took 1/4 (of life)              | взяли 1/4                       | сняли 1/4                                              |
| do the specs compose?                     | складываются ли спецификации    | стыкуются ли спецификации                              |
| retire an oracle                          | вывести из обращения            | убрать оракул                                          |
| a value saturates                         | насыщается                      | обрезается до максимума                                |
| the plan asked for N and got M            | план просил и получил           | в плане стояло N, вышло M                              |
| the discount decided 30 checks            | решила 30 проверок              | от скидки зависели 30 проверок                         |
| the claim covers nothing after the call   | покрывает «ничего после вызова» | на то, что после вызова, не распространяется           |
| the record's way of saying                | —                               | (do not gloss a quote; ask the author what it meant)   |
| Switch 1 is out of reach                  | Switch 1 недосягаем             | до Switch 1 движок не дотянется                        |
| no library to blame                       | винить некого                   | свалить не на какую библиотеку                         |
| a probe (collision, network)              | проба                           | зонд («проба» is a spike)                              |
| the footprint (memory)                    | объём                           | память под атрибуты                                    |
| landed (a commit, a fix)                  | лёг, легло                      | появился, влили, вошло (once is fine, thrice is a tic) |
| standing instruction                      | постоянное указание             | одно указание на все случаи                            |
| chose the other door                      | выбрал другую дверь             | пошёл другим путём                                     |
| a dangling participle for "rebuilt with…" | Собранные с…, оба дерева…       | После пересборки с… оба дерева…                        |

Collisions added: **collapse** → «обрушение» (day one), never «обвал»; **worktree** stays `worktree`;
**the owner's "go"** stays «go»; a "sweep batch" is «пакет», so network packets are «сетевые пакеты»;
place names (Arreat Summit, Harrogath, the Ancients) stay in English like item and monster names;
**the bless verb** «закрепить» is for goldens and hashes only, an ADR «фиксирует» a decision.
