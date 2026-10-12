---
name: automate-me
description: "Use for \"automate me\", \"create/update/refresh my -mode skill\", \"turn/capture my preferences or working style into a skill\", or wanting agents to follow how the user works. Drafts or revises a personal -mode skill via skill-authoring guidance + unslop, optionally pulling fresh evidence from recent transcripts."
disable-model-invocation: true
---

# Automate me

A guided flow for turning the user's working conventions into a skill agents will follow. The output is one `-mode` skill tailored to them (e.g. `jay-mode`, `priya-mode`).

This skill sequences an inline mining pass (step 1), the active harness's skill-authoring guidance (`skill-creator` when available, otherwise [writing-for-agents](../../../skills/writing-for-agents/SKILL.md) and its linked mechanics), and [unslop](../../../skills/unslop/SKILL.md). It doesn't replace them.

This copy is repository-only in `.agents/skills/automate-me/`, with a `.claude/skills/automate-me` link. Resolve the loaded directory's symlink before following relative pointers. Importing it does not initiate history mining or mode creation.

## Flow

### 0. Check for an existing skill

Look recursively for `*-mode/SKILL.md` matching the user's handle in the repository's established skill locations, including nested personal categories. In Spellbook, inspect `.agents/skills/` and `skills/`, deduplicating `.claude/skills/` symlink targets. Inspect the active harness's personal skill directory only when an existing personal mode or personal placement is in scope. If one exists, confirm intent unless they already said "update my skill" or similar. Use the active harness's structured question tool, or concise chat questions when unavailable:

- Update the existing skill (default for repeat runs)
- Start fresh (rare, ask why before doing it)

Update mode changes the rest of the flow:
- Step 1 mines only history since the skill was last edited (`git log -1 --format=%cI <path>`).
- Step 2 asks what's changed or missing, not what to capture from zero.
- Step 4 edits the existing file in place. Preserve sections the user hasn't contradicted. Revise ones with new evidence. Add new sections only for genuinely new rules.

### 1. Mine their history

Locate the active workspace's transcripts before fanning out. Use a supplied transcript directory or discover the active harness's project-scoped history from configuration and metadata. For T3, read [the history guide](../../../skills/why/references/sources/t3-history.md), open databases read-only, and filter project/thread metadata before messages. Keep raw exports outside the repository. Use only the active workspace's records within the requested time window; unrelated projects' private chats are outside scope. Missing history is a coverage limit; draft from available evidence without inventing preferences.

Survey recent agent conversations within that scope for recurring patterns. When delegation is supported and permitted, run multiple parallel subagents across slices of history (e.g. last 2-4 weeks, split into 3 slices so each has enough material). Each slice mining subagent reads transcripts from the workspace-scoped path the parent provides, looks for the signals below, and returns a short structured list of patterns it saw with evidence pointers. Default signals worth hunting:

- Response preferences (length, tone, format, "dumb it down" corrections)
- Delegation habits (subagents, models, specialized workflows, parallelism)
- Verification posture (what "done" means, unit tests vs live repro, reviewers)
- Code and prose discipline (style, principles cited, lint/format tools)
- Process conventions (worktrees, commits, PRs, review/merge tooling)
- Meta preferences (fixing skills mid-task, proposing new ones)

Without delegation, mine the same slices directly and keep their findings separate. Cross-check across slices before elevating a signal. Patterns seen in 2+ independent slices are high-confidence. Deduplicate continuing tasks and copies of the same session before counting confirmations. Lone signals are weak and usually get dropped.

### 2. Ask the user directly

Mining misses intent that hasn't come up yet. Use the active harness's structured question tool for multi-choice questions when available. Otherwise ask concise chat questions with suggested choices.

Shape: one or two questions with relevant choices. Use multiple selection for category questions when supported; respect the tool's option limits. Start broad ("Which areas matter most?"), then follow up on selected areas with specific options. After the structured rounds, one free-form chat question catches anything the options missed.

Don't dump 20 questions.

### 3. Cluster findings

Group the combined signals into sections. Common ones (use only what applies):

- **Response style**: length, tone, format.
- **Autonomy**: how much to do without asking, MCP tool use.
- **Understand first**: which skills to reach for when scoping or investigating a change.
- **Subagents**: default, parallelism, model-to-task, specialized workflows.
- **Prose / code discipline**: principles, lint tools, style guides.
- **Review and verify**: repro posture, verification skills, live-testing tools.
- **Process**: git worktrees, commits, PRs, review/merge tooling.
- **Skills**: skill-authoring habits, fix-the-skill-first, proposing new skills.

If an example personal mode is available, read it for granularity, not rules to copy. No external mode is required. Use only the sections supported by the user's conventions.

### 4. Draft the skill

Use the active harness's skill-authoring guidance named above to author the skill. Placement:

- Path: preserve the existing mode skill's location and category. In Spellbook, default new modes to `.agents/skills/<handle>-mode/SKILL.md`, with `.claude/skills/<handle>-mode` linking to that directory. Use `skills/<handle>-mode/` for global installation only when requested. In other repositories, follow their established project skill layout. Use the harness's personal directory only when the user prefers personal placement.
- Handle: the user's first name or chosen identifier.
- Frontmatter `description`: trigger on their name + `/<handle>-mode` + "work in their style", not on generic keywords like "write code" or "review PR".
- Frontmatter formatting: follow the authoring guidance's YAML rules. Keep `description` as one YAML scalar. Quote it or use `description: >-` with indented continuation lines when punctuation or wrapping requires it.
- Frontmatter `disable-model-invocation: true` by default. For Codex, also set `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. Preserve an existing invocation policy. Enable implicit invocation only if explicitly requested; enforcement differs by harness.

### 5. Iterate on prose

Apply **unslop** and the authoring guidance's writing guidelines to every line.

Show the draft to the user and take feedback. Expect multiple iterations. Cut ruthlessly. A mode skill is not a manual.

### 6. Land it

Validate frontmatter, relative references, invocation policy, placement, and repository discovery. Update the repository's skill catalog. In Spellbook, confirm repository-only modes remain excluded from global installers. When the user requests landing through Git, work in a worktree off main, commit and open a PR. Don't push to main directly. Mode creation or refresh alone does not request a commit, push, or PR.

## Guardrails

- **Don't overfit to one conversation.** A preference stated once and contradicted another time is noise. Require multiple independent instances before codifying an inferred habit. A current explicit user instruction can stand on its own; check contradictions before proposing a rule.
- **Don't be clever.** Restating other skills' contents, inventing metaphors, or writing "poetic" prose for an agent reader is cost without benefit. Keep it operational.
- **Reference, don't inline.** Other skills the user relies on should appear as path references, not pasted excerpts. Same for any principle docs they maintain elsewhere.
- **Keep sections minimal.** Only add a section if the user has a specific, non-default rule there. "Communicate clearly" is not a section. "Short paragraphs. Tables when comparing options. Bullets only when items are genuinely parallel." is.
- **Name conventions generic.** Use "the user" or "the human" in imperatives, not the author's first name.
- **Don't force symmetry.** If a user has no process rules worth writing down, skip the Process section entirely.

## Evaluation

A `-mode` skill is subjective output. A skill-authoring test/iterate benchmark loop isn't useful here. Vibe-check with the user: does it read like them? Did it miss anything? Then ship.

Run a description-optimization loop only if the skill's trigger accuracy turns out to be a problem in practice.

## When not to use

- User wants a task-specific skill (not working conventions): skill-authoring guidance alone, no mining required.
- User wants to capture one narrow workflow (e.g. "how I write commit messages"). That's a regular skill, not a mode skill.
