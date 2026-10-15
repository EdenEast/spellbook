# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `create-verification-skill` from `cursor/plugins`.
[SOURCE.toml](SOURCE.toml) records the exact upstream baseline and maps the
complete skill tree plus `pstack/LICENSE`. Reviewed the entry point, all three
feature-map example files, and the MIT license. No scripts or assets are shipped;
application-specific build and interaction tools are discovered in the target
repository rather than installed by this skill.

Preserved the repository interview, launch/doctor/drive/evidence/cleanup/helper
contract, feature-map shape, end-to-end proof of one mapped feature, evidence
survival check, failed-iteration cleanup, stand-in limitations, and maintenance
handoff. Retained upstream's explicit invocation setting.

### Local adjustments

- Choose the existing project-local skill directory for the active harness
  instead of always writing to `.cursor/skills/`. Use `<skill-dir>` consistently
  for generated files.
- Prefer existing harness-native interaction tools alongside repository harnesses.
- Keep startup repairs and live mutations within the authorized scope, using
  disposable test state. Generation does not authorize production changes,
  external messages, or publishing.
- Link to the sibling maintenance skill and use the active harness's invocation
  syntax instead of assuming Cursor slash commands.

The feature-map example and license are unchanged. `SOURCE.toml` and this note
are local maintenance files. No upstream guidance was declined or deferred.

## Validation

Checked upstream inventory, source mappings, frontmatter, links, unchanged example
files and license, and complete-tree installation for Codex, Claude Code, and Pi
in temporary homes. Manually walked the instructions for a web app with an
existing browser harness, a short-lived CLI with an isolated session per drive,
and a checkout that cannot start. The workflow requires real execution before
calling a generated skill complete; a broken base must be fixed within scope or
reported. These checks establish packaging and instruction coverage, not model
effectiveness, live harness discovery, or execution against a real target app.
