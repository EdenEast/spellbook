# Skills

Skills are grouped by invocation settings. Invocation syntax and enforcement
depend on the agent. Each skill's authorization requirements still apply.

Shared guidance is in the [reference catalog](../references/README.md).

## Human-invokable only

These skills require an explicit request. They set
`disable-model-invocation: true` and `policy.allow_implicit_invocation: false`.

| Skill | Description | Use cases |
| --- | --- | --- |
| [automate-me](../.agents/skills/automate-me/SKILL.md) | Draft or update a personal mode skill. | Capture preferences and working conventions. Repository-only. |
| [blast-radius](blast-radius/SKILL.md) | Check what a change could break beyond its diff. | Cross-service contracts, ports, secrets, and generated configuration. |
| [bro](bro/SKILL.md) | Restate the last assistant message in plain language. | Dense or jargon-heavy explanations. |
| [create-verification-skill](create-verification-skill/SKILL.md) | Create and validate a project-local verification skill and feature map. | App, CLI, service, library, or infrastructure verification. |
| [grill-me](grill-me/SKILL.md) | Interview you to test a plan or decision. | Clarify an idea without producing domain documentation. |
| [grill-with-docs](grill-with-docs/SKILL.md) | Interview you and record settled terminology and decisions. | Design discussions that produce a glossary and ADRs. |
| [how](how/SKILL.md) | Explain architecture and runtime behavior from source. | Code walkthroughs, ownership, and component placement. |
| [maintain-verification-skill](maintain-verification-skill/SKILL.md) | Audit and update a verification skill and feature map. | Check coverage against source and live behavior. |
| [retro](retro/SKILL.md) | Review a session and propose improvements. | Recurring mistakes, agent instructions, tooling, and checks. |
| [teach](teach/SKILL.md) | Explain behavior and design rationale at your requested depth. | Learn a change or subsystem. |
| [technical-writing](technical-writing/SKILL.md) | Structure technical documents and edit for clarity. | Guides, reference docs, RFCs, READMEs, PR descriptions, and commit messages. |
| [why](why/SKILL.md) | Investigate design rationale with cited evidence and explicit uncertainty. | Design history, constraints, and reasons for defensive code. |

## Model-invokable

Agents can select these skills when their descriptions match the task. You can
also request them by name.

| Skill | Description | Use cases |
| --- | --- | --- |
| [babysit-pr](babysit-pr/SKILL.md) | Monitor a PR and address verified review or CI issues. | Watch a PR until it is ready. Merging requires an explicit request. |
| [commit](commit/SKILL.md) | Create Git or Jujutsu commits, or draft commit messages. | Commit changes or suggest a message. |
| [diagnosing-bugs](diagnosing-bugs/SKILL.md) | Diagnose failures with reproducible checks and competing hypotheses. | Bugs, slow operations, CI, and infrastructure failures. |
| [domain-modeling](domain-modeling/SKILL.md) | Define domain terms and document design decisions. | Maintain `GLOSSARY.md` and ADRs. |
| [file-pr](file-pr/SKILL.md) | Create a PR with a concise title and description. | Submit completed work for review. |
| [grilling](grilling/SKILL.md) | Test a plan through rounds of questions. | Clarify designs; support `grill-me` and `grill-with-docs`. |
| [html-communication](html-communication/SKILL.md) | Create and publish HTML documents through Postplan. | Plans, specifications, reports, comparisons, and UI mock variants. |
| [postplan-read](postplan-read/SKILL.md) | Fetch and read a Postplan document. | Review or summarize a `postplan.dev` URL. |
| [summarization](summarization/SKILL.md) | Summarize content while preserving facts and uncertainty. | Technical overviews, meeting recaps, research summaries, and changelogs. |
| [unslop](unslop/SKILL.md) | Remove filler, vague claims, and unnecessary jargon. | Revise documentation, explanations, and PR or commit text. |
| [writing-for-agents](writing-for-agents/SKILL.md) | Write concise, verifiable agent instructions. | Skills, `AGENTS.md`, `CLAUDE.md`, and agent references. |

Global installers read `skills/`. Repository-only skills live in `.agents/skills/`
with Claude Code links in `.claude/skills/`. See the
[repository layout](../docs/layout.md) for paths.
