---
name: brainstorm
description: Turn a vague idea into a brief an agent can build from, through a guided conversation that finds the intent, explores directions, and settles decisions. Use when the user wants to brainstorm, refine an idea, or work out what to build before a plan or code exists. Not for clear tasks or changes whose design is already settled.
---

# Brainstorm

Help the user work out what they want, then write it down so an agent can build
it without coming back to ask. The deliverable is a confirmed **brief**, not
code. The user owns the intent and the decisions. Facts are your job: look up
anything the project, its files, or the web can answer instead of asking.

Use plain words that match the user's vocabulary, and lead with what matters.
Keep this skill's process terms, such as frontier, restate, and builder check,
to yourself.

## Start

Form a one-sentence read of what they want and a confidence from 0 to 100%.

- If the request already says everything that matters, it is a task. Say so in
  one line and offer to just do it.
- If the design is settled and only the code shape is open, suggest the
  **architect** skill.
- Otherwise, send a first message with three parts, in order:
  1. One line saying they can skip the questions and have you start. If they
     do, state any significant choice (platform, language, storage) in one
     plain line and stop using this skill.
  2. Your read as a guess they can correct, with the confidence and what is
     missing: "My guess: you want X so that Y. About 30% sure; I don't know who
     it's for yet."
  3. One open question about a real moment: "Walk me through the last time you
     wished this existed."

## Find the intent

Ask one question per message, with your guess attached, and wait for the
answer. A wrong guess is faster to correct than a blank to fill.

- **Get them describing.** Open questions carry intent that options would
  steer; offer a short menu only when they are stuck. When they say "you
  decide", propose something concrete and mark it as your call.
- **Anchor in specifics.** "If it could only do one of these well, which?",
  "What would make you wince if I got it wrong?", "What do you do today
  instead?"
- **Probe should-want answers.** "Scalable", "clean", or "the standard way"
  often describe what sounds right. Ask: "If you didn't have to justify this
  to anyone, what would you want?"
- **Learn how it gets made.** Find out early which platform, language,
  library, and hosting choices they want to make, which they hand to you, and
  what already exists to build on. Say each default you choose out loud.

Cover this ground over the conversation without reading it out as a list: who
it is for and when they would use it; why now and what success looks like;
goals, non-goals, and anti-goals (failure even if it technically works); prior
art they loved or hated; what exists and what they have tried; and the details
they care about.

## Size the work

Once you can say who it is for, why they want it, and what success looks like,
pick a size and say it plainly. They can override it. If the work grows at any
later point, stop, say so, and step up a size.

| Size | Written as | Then |
| --- | --- | --- |
| Small change | The confirmed restate in chat | Build it through the normal workflow once they confirm the restate |
| Project | A brief in a file | Builder check, approval, then hand off |
| Several projects | One brief per project | Agree on an order, then take each project from "Explore directions" through its own restate and brief |

## Explore directions

Widen before you narrow. Privately generate several directions and drop the
weak ones, including any that fight the "why" they gave. Read
[lenses](references/lenses.md) for ways to generate and stress-test them. When
the shape is genuinely open, show two or three that differ in structure, not
style, each with a reason to exist and a cost, and recommend one, per
[exhaust-the-design-space](~/.agents/references/spellbook/principles/exhaust-the-design-space.md).
Skip the comparison when precedent or constraints settle the shape.

Be candid: say why a weak direction is weak, push toward the smallest version
that solves the real problem, and name each direction's riskiest assumption.

- **Show when seeing beats reading.** For a screen, layout, flow, or
  side-by-side options, offer a throwaway mockup through the
  **html-communication** skill or the harness's preview tools.
- **Spike to learn.** Offer a quick throwaway build when it would settle a
  question. Keep it labeled throwaway, untested, unpolished, and off the main
  branch, and bring what it taught you back into the conversation.

## Settle the decisions

Once a direction is chosen, treat the remaining decisions as a tree: each one
opens those that depend on it. The **frontier** is the open decisions whose
prerequisites are settled. Ask a round of at most four frontier decisions,
numbered, each with your recommended answer and worded so "yes" accepts it. Use
the harness's structured question tool when available. A decision that depends
on another one in the same round waits for a later round. Recompute the
frontier after each round.

## Play it back as you go

When you can describe one part, play it back in 200 words or fewer, then return
to questions. Mark guesses as yours; only what they said goes in as theirs. End
by asking what is wrong or missing. If several rounds pass without your
confidence rising, say so and ask whether something foundational is missing.

Questions are finished when the frontier is empty, with nothing silently
assumed, and you can predict their answers to the next three questions you
would ask.

## Restate in your own words

When no questions are left, restate in your own words what you think the user's
goals are and what problem they are trying to solve. Paraphrase rather than
quote; your phrasing exposes misunderstandings their words would hide. In one
message, cover the problem and who has it, the goals and what success looks
like, the chosen direction in a sentence or two, and what is out of scope. Mark
guesses and ask whether it matches what they mean.

Move on only after an explicit yes. "Sounds good", "whatever you think", or
"sure, let's go" is not one; ask once more in a form a yes answers, such as
"Does this match your goals and what's out of scope?" After any correction,
restate the whole idea again. Every later step builds on the confirmed restate.
For a small change, that yes is the approval to build.

## Write the brief

Fill in [the brief template](references/brief-template.md) for a capable
builder who has never met the user and cannot ask them anything. In a
repository, propose `docs/ideas/YYYY-MM-DD-<slug>.md`; elsewhere, ask. The
user's choice wins. Do not commit it unless asked.

**Builder check.** Tell the user a reviewer will read the brief first and you
may come back once with questions. Spawn one subagent with
[the builder check prompt](references/builder-check.md), using the
`brainstorm builder` role in
[model roles](~/.agents/references/spellbook/models/README.md). Without a
subagent tool, read the brief yourself as that builder. Sort what comes back:

- **Answered already** by the conversation or project: add it to the brief.
- **Minor**, settleable without changing what gets built: settle it and mark
  it in the brief as your call.
- **Theirs**, where only the user can answer and the answer changes what gets
  built: ask these in one message, most important first, then update the brief.

Hand over the brief with a short list of the calls you made, so they can check
those while reading. The check produces only this one round of questions.

## Approval gate

Nothing gets built until the user explicitly approves the full description: the
confirmed restate for a small change, or the brief for a project. Building
includes product code, scaffolding, installing dependencies, creating projects,
and starting an implementation skill. Reading and researching are fine. The
gate does not apply when they skipped the questions. An approved spike may be
built but stays throwaway; keeping it is a new request that comes back through
this gate.

## Hand off

After a project's brief is approved, offer next steps and stop your turn
without starting them:

- the **architect** skill, when types and module structure are the next
  open question
- a fresh agent session that implements the brief's first slice
