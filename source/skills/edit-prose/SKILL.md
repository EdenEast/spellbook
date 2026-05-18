---
name: edit-prose
description: Reviews prose and edits grammar, clarity, and sentence flow while preserving the author's original voice. Use when the user asks to edit, proofread, polish, revise, or improve written prose without changing its style or meaning.
---

# Edit Prose

## Quick start

When the user provides text to edit, return a polished version that:

- Fixes grammar, punctuation, spelling, and awkward phrasing.
- Improves sentence flow and readability.
- Preserves the user's original meaning, tone, vocabulary level, and voice.
- Avoids making the writing sound generic, corporate, or unlike the author.

If the user asks only for an edit, provide the edited text directly. Do not over-explain.

## Workflow

1. **Identify the voice**
   - Notice formality, rhythm, sentence length, directness, humor, emotion, and word choice.
   - Preserve intentional fragments, repetition, or informal wording when they contribute to voice.

2. **Edit conservatively**
   - Correct clear grammar and punctuation errors.
   - Smooth confusing sentence structure.
   - Improve transitions and flow between ideas.
   - Keep distinctive phrasing unless it blocks comprehension.

3. **Protect meaning**
   - Do not add new claims, examples, facts, or arguments.
   - Do not remove nuance or soften strong opinions unless the user asks.
   - If a sentence is ambiguous, choose the lightest edit or ask a clarification question.

4. **Return the result**
   - Default format: edited prose only.
   - If useful, include a brief note after the edit listing major changes, but keep it short.
   - If the user requests tracked changes, provide before/after bullets for meaningful edits.

## Style rules

- Prefer the author's words over synonyms unless the original word is incorrect or clunky.
- Keep contractions if the original uses them.
- Keep sentence length varied; do not split every long sentence.
- Avoid adding marketing language, inflated adjectives, or clichés.
- Maintain dialect, register, and personality unless they obscure meaning.
- Respect formatting such as paragraphs, headings, lists, and line breaks.

## Response patterns

### Simple edit

Return:

```text
[Edited text]
```

### Edit plus notes

Return:

```text
[Edited text]

Notes:
- [One concise note about the main grammar or flow change.]
- [Optional second note.]
```

### Ambiguous text

If preserving meaning requires clarification, ask:

```text
I can edit this, but one part is ambiguous: [quote or describe issue]. Did you mean [option A] or [option B]?
```
