# Agent instructions

## External skills

All skills live in `skills/<name>/`, regardless of their origin.

Keep `skills/README.md` updated when adding, removing, or changing a skill. List
each skill with a relative link, description, and use cases, grouped by its
invocation settings.

When adding or updating an external skill, update its `SOURCE.toml` with the
upstream `repository`, `path`, and full `commit` SHA. The commit is the last
integrated upstream version, not the current Spellbook commit.

Keep customized files directly in the skill directory. Upstream snapshots and
generated patches do not belong in this repository.

## Pi extensions

Keep maintained extensions in `pi/extensions/`. Add dependencies only when an
extension requires them. Pi host packages belong in peer dependencies.

## Validation

Run `npm run check` and `npm test` after changing the TypeScript tooling.
Installer tests must use temporary homes; do not modify the user's harness
configuration to test installation.
