# Sources and local decisions

This is a locally owned adaptation. Superpowers' brainstorming skill is its
primary basis; Agent Skills and Matt Pocock's skills supply the interview,
ideation, and decision-round techniques it lacks; Pstack supplies the closing
restatement. [SOURCE.toml](SOURCE.toml)
pins the reviewed versions; the shared [licenses](../../licenses/README.md)
preserve their notices. Future changes follow local judgment.

The skill fills the gap before Spellbook's other design skills. The Pstack
skills assume an established project; this one starts from a vague idea and
ends with a brief that **architect**, **interrogate**, or an implementing agent
can take over.

## Superpowers: brainstorming

Reviewed `SKILL.md` and `builder-check-prompt.md`, and skimmed
`visual-companion.md` and the companion server's start script. Retained the "what do you know" check, the opt-out
line, one open question per message, getting the user describing before
offering options, the "how it gets made" questions, the ground-to-cover list,
private divergence, spikes, chunked playback with guesses marked, the size
table, the builder check and its three piles, and the approval gate. The builder
check prompt is reworded in `references/builder-check.md`.

**Declined**

- Triggering before all creative work: the description is narrowed to
  brainstorming and vague ideas, so ordinary tasks are not interrupted.
- The browser visual companion and its server: use **html-communication** or
  the harness's preview tools, which Spellbook already maintains.
- Asking permission before recon: read-only lookups are the agent's job, per
  the grilling source.
- `docs/superpowers/specs/` and committing the design: use `docs/ideas/` and
  commit only on request, matching Spellbook's commit rules.
- Invoking `superpowers:writing-plans` as the only next step: offer
  Spellbook's **architect** and **interrogate** skills or a fresh
  implementation session instead.

## Agent Skills: interview-me

Reviewed `SKILL.md`. Added the private hypothesis with a confidence number,
shared as a correctable guess in the first message; a guess attached to each
question; the "if you didn't have to justify this" probe; treating "sounds
good" as unconfirmed; the predict-the-next-three-questions stop test; the
stalled-confidence escape; and stopping the turn after approval.

**Declined**

- A separate `HYPOTHESIS`/`CONFIDENCE`/`Q`/`GUESS` block format: plain sentences
  are easier to read and carry the same content.
- Saving a separate intent document: the intent is the first section of the
  brief.

## Agent Skills: idea-refine

Reviewed `SKILL.md`, `frameworks.md`, `refinement-criteria.md`,
`scripts/idea-refine.sh`, and the first session in `examples.md`. Condensed the useful lenses (How Might We, jobs
to be done, simplification, inversion, constraint removal, analogy, scale) and
stress tests (painkiller or vitamin, hardest part, pre-mortem, assumption
sorting) into `references/lenses.md`. Kept candour, the smallest-version push,
and the not-doing list, which became a required brief section.

**Declined**

- Three to five batched opening questions: conflicts with one question per
  message.
- Always generating five to eight variations: show two or three structurally
  different directions only when the shape is open.
- SCAMPER as a full checklist and the value-feasibility matrix: the condensed
  lenses cover the same judgment.
- The directory-creation script: writing the brief creates its directory.

## Matt Pocock: grilling

Reviewed `SKILL.md`. Added the decision tree, frontier rounds with a
recommended answer each, wording so "yes" accepts it, deferring dependent
decisions to a later round, and the rule that the agent finds facts while the
user makes decisions. The empty frontier is one of the two stop conditions.

**Declined**

- Asking the whole frontier at once: rounds are capped at four decisions for
  readability, and open discovery stays one question at a time.
- Spawning a subagent for every fact lookup: look things up inline unless the
  search is broad.

## Matt Pocock: to-spec

Reviewed `SKILL.md`. The brief template takes its decisions and out-of-scope
sections, the rule to keep file paths and code out, and the exception for
decision-rich prototype snippets.

**Declined**

- Publishing to an issue tracker and triage labels: the brief is a file.
- An exhaustive user-story list: the scope section lists what the user meets,
  in order.
- Testing seams in the brief: the builder or **architect** decides them.

## Pstack: in-your-own-words

Reviewed `SKILL.md`. Its single instruction, to restate the user's goals and
problem in the agent's own words, became the closing alignment step after the
last question. Locally, the restate covers problem, goals, direction, and out
of scope; requires an explicit yes; and is repeated whole after corrections.
The confirmed restate feeds the brief's intent, success, and scope sections.

## Also reviewed

Matt Pocock's `wayfinder`, `prototype`, `domain-modeling`, and
`to-questionnaire`, and Agent Skills' `spec-driven-development`, informed the
"several projects" size and the throwaway spike rules without contributing
text. Pstack's `figure-it-out` and `sharpen` were reviewed and not used; they
target established projects.

## Local decisions

- Name `brainstorm` avoids a collision with Superpowers' `brainstorming` when
  both are installed.
- Automatic discovery is kept, with a narrow description, so a user saying
  "help me brainstorm" reaches the skill without a command.
- The builder check uses a `brainstorm builder` model role that prefers a
  different vendor from the default session, so the cold reader brings a
  different perspective.
- The brief ends with first slices, riskiest unknown first, so an implementing
  agent has a verifiable starting point.
