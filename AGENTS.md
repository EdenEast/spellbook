# Agent instructions

Keep repository maintenance guidance here and in `docs/`, not in the global
agent instructions at `instructions/AGENTS.md`.

For principles in this checkout, use `references/principles/README.md` and read
the documents whose triggers match the task.

## Shared references

Keep guidance shared across workflows in `references/`. Maintain
`references/README.md` and each collection's index when changing its inventory
or loading triggers.

Keep active skills in `skills/`; follow [skill maintenance](docs/skills.md) for
adapt/adopt ownership and updates. Keep installation separate from source updates.

For external skills and references, follow [external-source guidance](docs/external-sources.md).
Keep provenance and applicable license notices beside the material.

## Pi extensions

Keep maintained extensions in `pi/extensions/`. Add dependencies only when an
extension requires them. Pi host packages belong in peer dependencies.

## Validation

Run `npm run check` and `npm test` after changing the TypeScript tooling.
Installer tests must use temporary homes; do not modify the user's harness
configuration to test installation.
