# Sources and local decisions

This is a locally owned adaptation with Lauren Tan's Pstack Unslop as its primary
basis. Humanizer and Stop Slop supply selected guidance missing from that basis.
[SOURCE.toml](SOURCE.toml) pins the reviewed versions; [LICENSES](LICENSES)
preserves their notices. Future changes follow local judgment.

## Pstack: Unslop

Reviewed the complete `pstack/skills/unslop/SKILL.md` and `pstack/LICENSE`.
Retained the pattern coverage for content, language, style, communication
artifacts, filler, jargon, and plain speech. Grouped overlapping rules into eight
bullets and shortened examples and vocabulary lists for frequent use by agents.

**Declined**

- Stable rule numbers and gaps: no local callers depend on upstream IDs.
- Explicit-only invocation: allow normal discovery for drafting and editing prose.
- Absolute punctuation bans: use readable punctuation and respect supplied style.
- Replacing terms solely because they appear on a jargon list: preserve domain
  meaning, including Spellbook's defined term "harness".
- Deleting every sentence reusable in another project's docs: retain useful
  shared facts and instructions; remove empty generalities.

## Humanizer

Reviewed the complete `SKILL.md` and `LICENSE`. Added explicit protection for
facts, uncertainty, citations, quotations, code, and metadata; writing-sample
matching; treatment of supplied text as editing material; paragraph-level
repetition checks; leading replies with the answer; and comparison of the final
rewrite with the source. These extend Pstack's brief meaning-and-tone instruction.

**Declined**

- Full numbered catalog and repeated examples: fold useful additions into the
  compact checklist rather than duplicate Pstack's coverage.
- Default draft, critique, and final rewrite: return final prose unless requested.
- Adding reactions on the author's behalf: preserve expressed opinions.
- Removing factual details for stylistic reasons, as some examples do: retain
  substantive information and flag material unsupported claims.
- AI-authorship judgments and claims about detection: this skill edits prose.
- Detailed hyphenation rules: ordinary copyediting does not need another checklist.

## Stop Slop

Reviewed `SKILL.md`, `references/phrases.md`, `references/structures.md`,
`references/examples.md`, and `LICENSE`. Added explicit checks for staged
rhetorical questions, negative listings that delay the point, document
self-narration, and repetitive sentence and paragraph rhythm. Other useful
guidance overlaps with the Pstack basis and is not repeated.

**Declined**

- Universal bans on adverbs, passive voice, sentence starters, and three-item
  lists: revise when they impair meaning or flow.
- Requiring human subjects or second-person narration: preserve the real actor
  and choose a voice appropriate to the document.
- Numerical scoring and a mandatory revision threshold: use a final fidelity
  and readability check.
- Examples that strengthen qualifications or discard meaning for brevity:
  compact prose must preserve scope and substance.

## Local packaging and validation

Keep all operational guidance in `SKILL.md`. Source records, decisions, and
license notices support maintenance and need not be loaded during ordinary use.
No scripts, tools, companion skills, or harness-specific metadata are required.
The active-skill catalog exposes the skill; installation is a separate action.
