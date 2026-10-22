# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `automate-me` from `cursor/plugins`. [SOURCE.toml](SOURCE.toml)
records the exact upstream baseline and the file mapping. Reviewed and retained
the complete upstream skill tree, which is one `SKILL.md`, plus the unchanged
`pstack/LICENSE`. Preserved upstream's `disable-model-invocation: true` for
explicit invocation.

## Local adjustments

Transcript discovery names the stores for Claude Code, Codex, and Pi instead of
Cursor's `agent-transcripts/` directory. A workspace includes the repository's
worktrees, because T3 Code and Claude Code keep one transcript directory per
worktree. The workspace boundary stays the default; the user can name other
projects to widen it.

Miners take their model and effort from the `automate-me miners` role in the
shared [model roles](../../references/models/README.md). The role runs a small
model at `low` effort, like the other roles that read many files.

The **writing-for-agents** skill replaces Cursor's built-in `create-skill` for
authoring, prose review, and the "when not to use" route. The harness's
structured question tool replaces Cursor's `AskQuestion`, with numbered chat
options as the fallback.

Mode skills are placed in the user's skill source repository, such as
Spellbook's `skills/`, and follow its maintenance rules. The harness's personal
skill directory is the fallback. This replaces `.cursor/skills/` paths.
Destination and delivery are selected before drafting. Repository edits use a
prepared worktree from the intended base, carrying relevant existing edits;
commits and PRs require authorization. Personal-directory delivery does not
require Git infrastructure. Untracked skills without history use a known date
or a user-selected mining window rather than a fabricated last-edit date.

Mining reads the user's always-loaded instructions, and clustering sends
every-turn rules there. A mode skill is invoked explicitly, so it should add to
those instructions rather than repeat them.

The poteto-mode example links to upstream at the reviewed revision, because
Spellbook does not carry poteto-mode.

Preserved the flow from existence check to landing, update mode, the
cross-slice confidence rule, the question shape, the section list, the
guardrails, and the evaluation stance.

### Declined

- Declined the poteto-mode dependency for subagent reasoning level and speed.
  The model role sets both.
- Declined `create-skill`'s YAML rules as a separate reference. The single-scalar
  `description` rule stays inline.
- Declined the description of `create-skill`'s benchmark loop in Evaluation.
  The stance against benchmarking a mode skill stays.

## Maintenance

`SOURCE.toml` and this note are local-only files. The shared [pstack license](../../licenses/pstack.txt) covers this skill. Retain these local
adjustments when integrating future upstream changes.

## Validation

Diffed `SKILL.md` against the upstream baseline so that only the adjustments
recorded above remain. Checked the transcript path rules against this machine's
Claude Code, Codex, and Pi stores. Checked local links and the unchanged
upstream license.

These are packaging and instruction checks. They do not evaluate a live mining
run or the structured question tool in each harness.
