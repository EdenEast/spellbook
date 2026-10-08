# Skills

Skills are grouped by invocation settings. Human-only skills explicitly disable
model invocation with `disable-model-invocation: true`. Model-invokable skills
can be selected by the agent when their descriptions match the task, and can
also be requested by name. Invocation syntax depends on the harness.

Model invocation does not override a skill's requirement for a user request or
authorization to perform an action.

## Human-invokable only

These imported skills retain `disable-model-invocation: true` and Codex's
`policy.allow_implicit_invocation: false`. Enforcement depends on the harness;
their instructions require an explicit review or retrospective request.

| Skill | Description | Use cases |
| --- | --- | --- |
| [blast-radius](blast-radius/SKILL.md) | Review effects beyond a diff and verify the conditions a change's safety depends on. | When asked what a change could break, including cross-service contracts, ports, secret recipients, or generated configuration. |
| [retro](retro/SKILL.md) | Review a session and propose evidence-based improvements to agent instructions, tooling, and checks. | When asked for a retrospective or how to prevent recurring mistakes. Implementation requires that work to be in scope. |

## Model-invokable

All of these skills can also be invoked by a human.

| Skill | Description | Use cases |
| --- | --- | --- |
| [babysit-pr](babysit-pr/SKILL.md) | Monitor a pull request through review and CI, investigate feedback, and address verified issues. | When asked to watch a PR, fix failing checks, or handle review-bot feedback until the PR is ready. Merging requires an explicit request. |
| [commit](commit/SKILL.md) | Create Git or Jujutsu commits, or draft commit messages, using Conventional Commits and appropriate attribution. | When asked to commit changes, suggest a message, or describe a Jujutsu change. A request for a message alone does not create a commit. |
| [diagnosing-bugs](diagnosing-bugs/SKILL.md) | Diagnose bugs, regressions, and infrastructure failures with symptom-specific checks and competing hypotheses. | Broken behavior, slow operations, CI failures, SSH or backup issues, and deployment failures across evaluation, build, activation, and live behavior. |
| [file-pr](file-pr/SKILL.md) | Create a concise pull request with a problem-focused title and description, checking for an existing PR first. | When asked to open a PR or prepare completed work for review. |
| [html-communication](html-communication/SKILL.md) | Produce a self-contained, mobile-readable HTML document and publish it through Postplan. | When asked for an HTML plan, specification, findings report, comparison, or UI mock variants. Applies to communication documents, not product HTML. |
| [postplan-read](postplan-read/SKILL.md) | Fetch and read a Postplan document through its raw HTML endpoint. | When the user provides a `postplan.dev` URL to read, review, summarize, or use as context. |
| [summarization](summarization/SKILL.md) | Summarize content accurately for its audience and purpose, preserving important facts, uncertainty, and decisions. | When asked for a TL;DR, executive summary, technical overview, meeting recap, research summary, or changelog. |
| [unslop](unslop/SKILL.md) | Edit prose to remove filler, vague claims, AI writing patterns, and unnecessary jargon. | Drafting or revising documentation, explanations, commit messages, and PR descriptions; also loaded by companion skills. |
| [writing-for-agents](writing-for-agents/SKILL.md) | Write concise agent instructions with useful context pointers and checkable completion criteria. | Creating or editing skills, `AGENTS.md`, `CLAUDE.md`, and references consumed by agents. |

## Dependencies

- `commit`, `retro`, and `blast-radius` use the included `unslop` skill.
- `retro` uses the included `writing-for-agents` skill. Imported callers provide
  relative file pointers when the harness has no skill invocation tool.
- `diagnosing-bugs` includes a Bash template for observations in an interactive
  terminal; chat-based observations are supported for headless/mobile sessions.
- `html-communication` requires the Postplan CLI for publishing.
- `postplan-read` uses `curl` to retrieve documents.
