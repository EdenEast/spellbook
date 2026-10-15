# Skills

Active skills live in this directory. The installer discovers each `SKILL.md`
and makes the skill and its supporting files available together. These skills
allow model invocation by default; how, why, create-verification-skill,
maintain-verification-skill, retro, teach, and technical-writing require explicit
invocation. Their task instructions still determine when an action is authorized.

| Skill | Use when |
| --- | --- |
| [babysit-pr](babysit-pr/SKILL.md) | Monitoring a requested PR through review and CI using T3 Code or the bundled GitHub watcher. Script usage is in a separate reference; merging requires an explicit request. |
| [brainstorm](brainstorm/SKILL.md) | Exploring an idea independently, including deferral or deciding not to build. |
| [commit](commit/SKILL.md) | Creating a requested Git or Jujutsu commit, or drafting a commit message. |
| [create-verification-skill](create-verification-skill/SKILL.md) | Generating and proving a project-local app verification skill with a maintained feature map. |
| [file-pr](file-pr/SKILL.md) | Filing a requested PR with a concise title and description. |
| [how](how/SKILL.md) | Explaining runtime behavior, subsystem architecture, or ownership and layering; investigates inline by default. |
| [html-communication](html-communication/SKILL.md) | Creating and publishing readable HTML communication documents through Postplan. |
| [maintain-verification-skill](maintain-verification-skill/SKILL.md) | Auditing an existing verification skill and feature map against source and live app behavior. |
| [postplan-read](postplan-read/SKILL.md) | Reading a supplied `postplan.dev` URL using `curl`. |
| [retro](retro/SKILL.md) | Reviewing a requested coding session to suggest improvements to the agent environment, ordered by severity. |
| [sdd](sdd/SKILL.md) | Starting or resuming spec-driven development at the stage supported by existing artifacts and evidence. |
| [sdd-discover](sdd-discover/SKILL.md) | Grounding an intended change in the project before specifying it. |
| [sdd-specify](sdd-specify/SKILL.md) | Defining observable requirements and acceptance scenarios. |
| [sdd-plan](sdd-plan/SKILL.md) | Planning verifiable slices, technical decisions, dependencies, and checks. |
| [sdd-implement](sdd-implement/SKILL.md) | Implementing ready slices while maintaining tasks and evidence. |
| [sdd-verify](sdd-verify/SKILL.md) | Checking coverage, regressions, and real behavior against the current patch. |
| [sdd-deliver](sdd-deliver/SKILL.md) | Delivering a verified change through the requested PR and authorized merge actions. |
| [summarization](summarization/SKILL.md) | Summarizing documents, conversations, research, or technical content. |
| [teach](teach/SKILL.md) | Learning a change or subsystem through a plain explanation grounded in `how` and `why`, at the learner's pace. |
| [technical-writing](technical-writing/SKILL.md) | Writing or reviewing docs, RFCs, READMEs, PR descriptions, or commit messages using pstack's layered writing standard. Uses the included unslop skill. |
| [unslop](unslop/SKILL.md) | Drafting or editing prose to remove AI writing patterns while preserving meaning and voice. |
| [why](why/SKILL.md) | Investigating historical rationale and tradeoffs with cited evidence, calibrated confidence, and explicit search coverage; investigates inline by default. |
| [writing-for-agents](writing-for-agents/SKILL.md) | Authoring or reviewing skills and other agent instructions. |

Locally authored skills do not need external source records.
Externally adapted or adopted skills retain their provenance beside the skill;
see [skill maintenance](../docs/agents/skills.md). Shared guidance lives in the
[reference catalog](../references/README.md).
