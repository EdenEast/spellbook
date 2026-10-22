---
name: brainstorm
description: Turn a vague idea into a brief an agent can build from, through a guided conversation that finds the intent, explores directions, and settles decisions. Use when the user wants to brainstorm, refine an idea, or work out what to build before a plan or code exists. Not for clear tasks or changes whose design is already settled.
---

# Brainstorm

Help the user work out what they actually want, then write it down so an agent
can build it without coming back to ask. The user often starts with a feeling or
a fragment. Good questions help them finish the thought. The deliverable is a
confirmed **brief**, not code.

The user owns the intent and the decisions. Facts are your job: look up anything
the project, its files, or the web can answer instead of asking for it.

## First: is this a brainstorm?

Write down, for yourself, your best one-sentence read of what they want and a
confidence from 0 to 100%.

- If the request already says everything that matters, it is a task. Say so in
  one line and offer to just do it.
- If the design is settled and only the code shape is open, suggest the
  **architect** skill instead.
- Otherwise, start the conversation.

## Open the conversation

Your first message has three parts, in this order:

1. One line saying they can skip the questions and have you start. If they
   take it, state any significant choice you are making (platform, language,
   storage) in one plain line and stop using this skill.
2. Your current read, as a guess they can correct, with the confidence and what
   is missing: "My guess: you want X so that Y. About 30% sure; I don't know who
   it's for yet."
3. One open question about a real moment or concrete picture: "Walk me through
   the last time you wished this existed."

## Find the intent

Ask one question per message and attach your guess to it. A wrong guess is
faster to correct than a blank to fill. Wait for the answer before the next
question; later questions depend on earlier answers.

- **Get them describing first.** Open questions carry intent that your options
  would steer. Offer a short menu only when they are stuck. When they say "you
  decide" or "just guess", propose something concrete and mark it as your call.
- **Anchor in specifics.** "If it could only do one of these well, which?",
  "What would make you wince if I got it wrong?", "What do you do today
  instead?"
- **Probe should-want answers.** Answers like "scalable", "clean", or "the
  standard way" often describe what sounds right, not what they want. Ask:
  "If you didn't have to justify this to anyone, what would you want?"
- **Find out how it gets made.** Learn early which choices of platform,
  language, libraries, and hosting they want to make, which they hand to you,
  and what already exists to build on. Use defaults for what they hand over,
  and say each default out loud.

Cover this ground over the conversation. It is territory, not a script; never
read it out as a list:

- who it is for and the moment they would use it
- why now, and what success looks like to them
- goals, non-goals, and anti-goals: what would make it a failure even if it
  technically works
- prior art they have seen, loved, or hated
- what exists now and what they have tried
- the details they care about

## Explore directions

Once you understand the problem, widen before you narrow. Privately generate
several directions and drop the weak ones, including any that fight the "why"
they gave you. Read [lenses](references/lenses.md) for ways to generate and
stress-test directions.

When the shape is genuinely open, show two or three directions that differ in
structure, not style. This applies
[exhaust-the-design-space](~/.agents/references/spellbook/principles/exhaust-the-design-space.md).
Give each one a reason to exist and a cost. Recommend one. When precedent or
their constraints already settle the shape, skip the comparison.

Be candid. If a direction is weak, say why. Push toward the smallest version
that still solves the real problem, and name the riskiest assumption in each
direction.

**Show when seeing beats reading.** For a screen, layout, flow, or side-by-side
options, offer a throwaway mockup. Use the **html-communication** skill or the
harness's preview tools when available.

**Spike to learn.** A quick throwaway build is often the cheapest way to learn
whether something feels right or works at all. Offer one when it would settle a
question. Keep it labeled throwaway: no tests, no polish, outside the main
branch. Bring what it taught you back into the conversation. Keeping the spike
is a new request that goes through the approval gate below.

## Settle the decisions

When the direction is chosen, the remaining work is decisions. Treat them as a
tree: each decision opens the ones that depend on it. The **frontier** is the
set of open decisions whose prerequisites are settled.

Ask a frontier round of at most four decisions. Number each one, give your
recommended answer, and word it so "yes" accepts the recommendation. Use the
harness's structured question tool when available. A decision that depends on
another open decision waits for a later round. Recompute the frontier after each
round.

## Play it back as you go

When you understand one part well enough to describe it, play that part back in
a short chunk of 200 words or fewer. Then return to questions. Mark every guess
as yours; only what they said goes in as theirs. End each chunk by asking what
is wrong or missing.

Questions are finished when two things hold:

- the frontier is empty, with nothing silently assumed
- you can predict their answer to the next three questions you would ask

If several rounds pass and your confidence is not rising, say so and ask
whether something foundational is missing.

## Restate in your own words

When no questions are left, restate in your own words what you think the user's
goals are and what problem they are trying to solve. Paraphrase rather than
quoting them back; your own phrasing exposes misunderstandings that their words
would hide. Cover the whole idea in one message:

- the problem, and who has it
- the goals, and what success looks like
- the chosen direction, in one or two sentences
- what is out of scope

Mark any part that rests on your guess. End by asking whether this matches what
they mean.

Move on only after an explicit yes. "Sounds good", "whatever you think", or
"sure, let's go" is not confirmation. Follow it with one concrete check, such
as "Anything you'd change about the out of scope list?" If they correct
anything, fold it in and restate the whole idea again. The confirmed restate
is the shared understanding every later step builds on.

## Size the work

Pick a size and say it in plain words. They can override it.

| Size | Written as | Then |
| --- | --- | --- |
| Small change | The confirmed restate in chat | Build it through the normal workflow |
| Project | A brief in a file | Builder check, approval, then handoff |
| Several projects | One brief per project | Agree on an order and brainstorm one at a time |

If it grows mid-conversation, stop, say so, and step up a size.

## Write the brief

Write the brief with [the brief template](references/brief-template.md). Write
for a capable builder who has never met the user and cannot ask them anything.

In a repository, propose `docs/ideas/YYYY-MM-DD-<slug>.md`. Elsewhere, ask where
it should go. The user's choice overrides both. Do not commit it unless asked.

### Builder check

Before handing over the brief, find the questions a cold reader would still
need answered. Tell the user a reviewer will read it first and you may come back
once with a few questions.

Spawn one subagent with [the builder check prompt](references/builder-check.md),
using the `brainstorm builder` role in
[model roles](~/.agents/references/spellbook/models/README.md). Without a
subagent tool, read the brief yourself as that builder.

Sort what comes back into three piles:

- **Answered already** by the conversation or project: add it to the brief.
- **Minor**: a sensible builder could settle it without changing what gets
  built. Settle it and mark it in the brief as your call.
- **Theirs**: only the user can answer it, and the answer changes what gets
  built.

Bring the "theirs" pile in one message, most important first. Update the brief
with their answers. Hand it over with a short list of the calls you made, so
they can check those while reading. The check produces only this one round of
questions.

## Approval gate

Nothing gets built until the user explicitly approves the full description: the
confirmed restate for a small change, or the brief for a project. Building includes
product code, scaffolding, installing dependencies, creating projects, and
starting an implementation skill. Reading and researching are fine.

The gate does not apply when they skipped the questions. An approved spike may
be built, but it stays throwaway.

## Hand off

After approval, offer the next steps and stop your turn. Do not start them in
the same turn. Useful next steps:

- the **architect** skill, when the types and module structure are the next
  open question
- the **interrogate** skill, for adversarial review of the brief before planning
- a fresh agent session that implements the brief's first slice
