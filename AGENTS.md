# Agent instructions

## External skills

When checking or updating an external skill, follow
[EXTERNAL_SKILLS.md](EXTERNAL_SKILLS.md) for upstream reconstruction, merging
local adaptations, validation, and advancing provenance.

Globally installed skills live in `skills/<name>/`, regardless of their origin.
Repository-only skills live in `.agents/skills/<name>/`, with
`.claude/skills/<name>` symlinked to that directory.

Keep `skills/README.md` updated when adding, removing, or changing a skill. List
each skill with a relative link, description, and use cases, grouped by its
invocation settings.

When adding or updating an external skill, update its `SOURCE.toml` with the
upstream `repository`, `path`, and full `commit` SHA. The commit is the last
integrated upstream version, not the current Spellbook commit.

Keep customized files directly in the skill directory. Upstream snapshots and
generated patches do not belong in this repository.

## Shared references

Keep guidance shared across workflows in `references/`. Maintain
`references/README.md` and each collection's index when changing its inventory
or loading triggers. Keep skill-specific supporting files with their skill.

For adapted external references, follow the reference guidance in
[EXTERNAL_SKILLS.md](EXTERNAL_SKILLS.md). Keep provenance and applicable license
notices beside the adapted documents.

## Pi extensions

Keep maintained extensions in `pi/extensions/`. Add dependencies only when an
extension requires them. Pi host packages belong in peer dependencies.

## Validation

Run `npm run check` and `npm test` after changing the TypeScript tooling.
Installer tests must use temporary homes; do not modify the user's harness
configuration to test installation.
