# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `teach` from `cursor/plugins`.
[SOURCE.toml](SOURCE.toml) records the exact upstream baseline and maps the
complete upstream skill tree (`SKILL.md`) plus the unchanged plugin license.
There are no upstream scripts, assets, or supporting references.
Preserved `disable-model-invocation: true` for explicit invocation.

Preserved the teaching workflow: infer the learner's goal from the conversation,
ground the explanation through `how` and `why`, blend mechanics with rationale,
start with the smallest complete explanation, and deepen it at the learner's
pace without quizzes. Retained concrete mechanisms, visual teaching, `unslop`,
and the requirement to preserve `why`'s confidence language.

## Local adjustments

- Link directly to the sibling `how`, `why`, and `unslop` entry points so the
  dependencies can be read when a harness has no explicit invocation tool.
- Run `how` and `why` in parallel as upstream does, but fall back to running
  them in sequence when the harness cannot nest subagents.
- Make the read-only teaching boundary explicit and clarify that prose editing
  must preserve evidence-based uncertainty.

### Declined

- Mandatory image generation for spatial explanations. Use available code,
  screenshots, or simple sketches; generated illustrations are opt-in so the
  skill works in harnesses without image tools.
- A fixed number of diagram redraws for every multi-part explanation. Build
  diagrams progressively when useful, at the learner's pace; keep one-shot
  visuals proportional to the question.

## Maintenance

`SOURCE.toml` and this note are local-only files. The shared [pstack license](../../licenses/pstack.txt) covers this skill. The sibling skills are
maintained separately, not copied into this baseline. Retain the local
portability decisions during upstream integration.

## Validation

Diffed every mapped file against the upstream baseline so that only the
adjustments recorded above remain. Checked local links (excluding the
illustrative citation URL placeholder). Installed and uninstalled for Codex,
Claude Code, and Pi in a temporary home; `npm run check` and `npm test` passed.
The active harness configuration was not changed.

The skill-creator validator does not support the preserved
`disable-model-invocation` field. Checked that field separately as boolean true;
a temporary copy with only that field removed passed the validator.

These are packaging and instruction checks. They do not evaluate live
subagent fan-out, model selection, or MCP discovery in each harness.
