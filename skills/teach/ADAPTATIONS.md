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
- Load the shared [agent usage policy](../../references/agent-usage.md) through
  its installed path. Investigate inline on the current model, reuse grounding,
  and report missing companion skills rather than inventing findings.
- Make the read-only teaching boundary explicit and clarify that prose editing
  must preserve evidence-based uncertainty.

### Declined

- Automatic parallel execution of `how` and `why`. Follow their adopted inline
  workflows; additional agents require an explicit request.
- Mandatory image generation for spatial explanations. Use available code,
  screenshots, or simple sketches; generated illustrations are opt-in to keep
  usage predictable and work in harnesses without image tools.
- A fixed number of diagram redraws for every multi-part explanation. Build
  diagrams progressively when useful, at the learner's pace; keep one-shot
  visuals proportional to the question.

## Maintenance

`SOURCE.toml` and this note are local-only files. `LICENSE` maps to
`pstack/LICENSE` outside the upstream skill directory. The sibling skills and
shared usage policy are maintained separately, not copied into this baseline.
Retain the local usage and portability decisions during upstream integration.

## Validation

Verified exact source mappings and baseline, unchanged license bytes, sibling
skill links, and the installed shared-reference link. Dry-run isolation,
complete-tree installation, companion-skill access, installed status, and
uninstall passed for Codex, Claude Code, and Pi in temporary homes. No active
harness configuration was changed.

The skill-creator validator does not support the preserved
`disable-model-invocation` field. Checked that field separately as boolean true;
a temporary copy with only that field removed passed the validator.

Manually checked instruction routing for a narrow change with existing findings,
a new subsystem requiring both companion workflows, uncertain historical
rationale, and a spatial explanation without image tools. The instructions
reuse findings, keep investigation inline, preserve confidence, and permit
simple visuals without generated images. These checks establish packaging and
instruction coverage, not live model effectiveness or harness discovery.
