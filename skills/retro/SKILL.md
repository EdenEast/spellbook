---
name: retro
description: "Conduct a retrospective on a coding session."
disable-model-invocation: true
---

The user has asked for a **retrospective**. You are suggesting improvements to the coding agent's **environment** to improve future runs.

## Steps

1. Load `writing-for-agents` for the writing guide. Use the harness's skill
   mechanism when available; otherwise read [../writing-for-agents/SKILL.md](../writing-for-agents/SKILL.md).

2. Read the primary sources for the session the user specifies. Default to the
   current conversation. For history, keep the topic, time window, and hosts
   within the user's scope; discover the actual storage and available runtime.
   Read databases in read-only mode and keep raw exports outside the repository.
   Separate user corrections, agent claims, and observed tool evidence.

3. Look for candidates for improvement in these categories.

- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**: could an existing or proposed check catch the observed mistake? Read the repo's commands and CI first. Distinguish a missing check from one that exists but was not run, is unwired, or checks the wrong stage. Prefer a proportionate deterministic check for mechanical errors over another prose rule. _Use when_ a concrete failure could have been caught automatically.
- **Coding standards**: is the mistake mechanical or a judgement call? Propose an existing linter/check integration for mechanical patterns. Reserve prose standards for decisions that require context, such as cross-file consistency. Follow the repository's current review workflow; a separate reviewer agent is optional.
- **Global AGENTS.md**: are there any steering instructions that should be moved to coding standards (or automated checks) instead? _Use when_ the AGENTS.md file is particularly large - in the repo OR the user's global scope.
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLI's, MCP's) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **No-ops**: look for instructions in steering files that don't modify the agent's behavior. _Use when_ the steering files are large and unwieldy.
- **Information access**: look for opportunities to increase the agent's access to information. Teeing dev server logs, readonly access to third-party services. _Use when_ a crucial piece of information was not available to the agent.
- **Environment discovery**: did the agent confuse hosts, container/host users, available runtimes, headless access, or deployment stages? Prefer a cheap discovery command or a concise project-specific pointer over a global rule about one machine.

4. Present candidates in order of impact. Tie each to session evidence, explain
   how it would prevent the observed problem, and give the smallest useful
   change. Separate recurring problems from one-off incidents. This retrospective
   proposes improvements; implement them only when the user's request includes
   that work. Load `unslop` for the final wording, or read [../unslop/SKILL.md](../unslop/SKILL.md).

## Reference

### Implementation vs Review

Implementation and review may happen in one session or with separate agents.
Place deterministic checks in the tooling that actually runs; place contextual
standards where the repository's implementation or review workflow will read
them. Recommend delegation only when it is available, authorized, and useful.

### Files

You have access to several files in the repo:

- `CLAUDE.md`/`AGENTS.md`: these files are pushed to the context window of any agent working in this repo. They should be used incredibly sparingly, usually only for **navigation pointers** to other files.
- `CODING_STANDARDS.md`, if present: follow its existing audience and loading conventions. Disclose longer references through navigation pointers when appropriate.
- Docs: use docs as references files, pointed to by other files. Look for existing docs before writing new ones.
- Skills: use skills for docs (since their description goes into the agent's context window), or for user-invoked commands. Follow the advice in the `writing-for-agents` skill.
