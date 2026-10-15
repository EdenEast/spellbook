# Upstream and local adjustments

Adopted Matt Pocock's `retro` skill from `mattpocock/skills`.
[SOURCE.toml](SOURCE.toml) records the exact upstream baseline and maps the
retained skill entry point plus the repository's MIT license.

Preserved the session-source review, environment improvement categories,
mechanical-check preference, implementation/review distinction, and presentation
of candidates in severity order. Retained explicit invocation through
`disable-model-invocation: true`.

## Local adjustments

- Replace the Claude-specific Skill tool call with a direct link to Spellbook's
  sibling `writing-for-agents` skill. This keeps the writing dependency available
  to Codex, Claude Code, and Pi without requiring a particular tool.

`SOURCE.toml` and this note are local maintenance files. `LICENSE` is an
unchanged upstream copy. The upstream skill has no scripts, assets, or other
dependencies. No upstream workflow guidance was declined.

## Declined

- Omit upstream's `agents/openai.yaml` and its containing directory at the user's
  request. Keep invocation guidance in `SKILL.md` without OpenAI-specific metadata.

## Validation

Checked frontmatter, source mappings, license, and the sibling
skill link directly. The bundled skill validator could not run because this
environment lacks PyYAML; metadata was inspected manually and compared with the
pinned upstream files. Manually walked through a current-session request, a specified-session
request, a mechanical-error finding with an existing check, and an unrelated
code-edit request. The instructions select session evidence, inspect existing
checks before proposing new ones, and present recommendations.
`SKILL.md` retains the upstream explicit-invocation setting.
Verified discovery and complete-tree installation for Codex, Claude Code, and Pi
in temporary homes. These checks establish packaging and instruction coverage;
they do not establish model effectiveness or live discovery in each harness.

After removing `agents/`, checked that the directory is absent and the source
mappings refer only to retained files. Earlier installation checks included the
upstream metadata; live harness discovery after its removal remains untested.
