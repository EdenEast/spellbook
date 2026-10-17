# Upstream and local adjustments

Adopted Lauren Tan's pstack `technical-writing` skill from `cursor/plugins`.
[SOURCE.toml](SOURCE.toml) records the exact upstream baseline and maps the
skill entry point and plugin license. The complete upstream skill tree contains
only `SKILL.md`; it has no scripts, assets, or tool dependencies.

Preserved the four-layer workflow: Diátaxis, Google developer style, STE rules,
and Global English. Retained the rhythm guidance, worked example, scope for PR
descriptions and commit messages, and exclusion of product UI strings.
Preserved upstream's `disable-model-invocation: true` for explicit invocation.

## Local adjustments

- Shorten the description to state only when the skill should be used; keep
  the writing standards in the body.
- Link directly to the sibling `unslop` skill so the dependency can be read in
  any harness. Spellbook's locally owned `unslop` adaptation supplies the
  required prose checks.
- Point jargon proposals at `unslop`'s plain-language guidance. The local skill
  does not retain upstream's named abstract-metaphor rule. Preserve the proposal
  workflow and its instruction to leave that skill unchanged.

`SOURCE.toml` and this note are local maintenance files. The shared [pstack license](../../licenses/pstack.txt) covers this skill. No upstream workflow guidance was declined.

## Validation

Checked packaging, source mappings, notices, and the sibling dependency link.
Manually walked through routing for a how-to guide, a reference page, a PR
description, and product UI strings. Verified discovery and complete-tree
installation for Codex, Claude Code, and Pi in temporary homes. These checks
establish packaging and instruction coverage; they do not establish model
effectiveness or live discovery in each harness.
