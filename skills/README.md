# Skills

Active skills live in this directory. The installer discovers each `SKILL.md`
and makes the skill and its supporting files available together. These skills
allow model invocation by default; their task instructions still determine
when an action is authorized.

| Skill | Use when |
| --- | --- |
| [babysit-pr](babysit-pr/SKILL.md) | Monitoring a requested PR through review and CI. Includes a GitHub watcher requiring Node.js 24+ and authenticated `gh`. |
| [commit](commit/SKILL.md) | Creating a requested Git or Jujutsu commit, or drafting a commit message. |
| [file-pr](file-pr/SKILL.md) | Filing a requested PR with a concise title and description. |
| [html-communication](html-communication/SKILL.md) | Creating and publishing readable HTML communication documents through Postplan. |
| [postplan-read](postplan-read/SKILL.md) | Reading a supplied `postplan.dev` URL using `curl`. |
| [summarization](summarization/SKILL.md) | Summarizing documents, conversations, research, or technical content. |
| [unslop](unslop/SKILL.md) | Drafting or editing prose to remove AI writing patterns while preserving meaning and voice. |
| [writing-for-agents](writing-for-agents/SKILL.md) | Authoring or reviewing skills and other agent instructions. |

Locally authored skills do not need external source records.
Externally adapted or adopted skills retain their provenance beside the skill;
see [skill maintenance](../docs/agents/skills.md). Shared guidance lives in the
[reference catalog](../references/README.md).
