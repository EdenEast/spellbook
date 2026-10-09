# Skill mechanics

The skill-specific branch of [`writing-for-agents`](SKILL.md): what changes when the document is a skill (frontmatter, the invocation choice, and router skills). Everything else about writing it is the universal reference in `SKILL.md`.

## Invocation

Two choices, trading the two loads:

- A **model-invoked** skill allows the agent to select it when its description matches the task. Humans can request it too. Its discovery metadata spends context in harnesses that load the catalog, so make the description precise. Shared reference can live in a discoverable skill when several callers need it. Mechanics: omit `disable-model-invocation`, retain the default implicit-invocation policy, and write a model-facing description carrying the trigger branches (the pointer-writing rules in `SKILL.md` apply in full).
- A **user-invoked** skill is requested explicitly rather than selected automatically. It spends cognitive load: the human remembers when to reach for it. Preserve `name` and `description` in its manifest. In harnesses that support it, `disable-model-invocation: true` requests explicit invocation; Codex also has `agents/openai.yaml` with `policy.allow_implicit_invocation: false`. Discovery, context loading, and enforcement differ by harness, so inspect the target harness rather than promising zero context load or treating either field as a universal guarantee.

Keep ordinary automatic discovery unless the user chooses explicit-only use or
an imported skill already has that policy. Choose a precise description instead
of using invocation restrictions as a substitute for a clear trigger. A skill
can require a user request for a particular action even when discoverable.

For a required companion, name it and provide a relative file pointer as a
fallback when the harness has no Skill tool. Check that the companion is shipped
and that its invocation policy permits the intended use. Shared supporting
references can also be plain files loaded through explicit pointers.

## Splitting by invocation

The invocation cut of splitting (the sequence cut lives in `SKILL.md`): split off a model-invoked skill when you have a distinct leading word that should trigger it on its own (a trigger word you actually use in your prompts), or another skill must reach it. You pay context load for the new always-loaded description, so that independent reach has to be worth it.

## Router skills

When user-invoked skills multiply past what you can remember, a **router skill**
can name them and explain when to request each. Follow their invocation policies
and the harness's loading mechanism; routing does not grant authorization for
their actions.
