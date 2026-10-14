# Agent instructions

Keep repository maintenance guidance here and in `docs/agents/`, not in the global
agent instructions at `instructions/AGENTS.md`.

Read [the glossary](docs/GLOSSARY.md) when discussing or changing domain concepts.
Use its terms in documentation, code, tests, and proposals. Surface conflicting
meanings and record resolved terminology there; keep procedures and
implementation decisions in `docs/agents/`.

Use the [agent documentation index](docs/agents/README.md) to find maintenance
procedures. Keep user-facing setup and usage guides in `docs/user/`.

For principles in this checkout, use `references/principles/README.md` and read
the documents whose triggers match the task.

## Shared references

Keep guidance shared across workflows in `references/`. Maintain
`references/README.md` and each collection's index when changing its inventory
or loading triggers.

Keep active skills in `skills/`; follow [skill maintenance](docs/agents/skills.md) for
adapt/adopt ownership and updates. Keep installation separate from source updates.

For external skills and references, follow [external-source guidance](docs/agents/external-sources.md).
Keep provenance and applicable license notices beside the material.

## Pi extensions

Keep maintained extensions in `pi/extensions/`. Add dependencies only when an
extension requires them. Pi host packages belong in peer dependencies.

## Validation

Run `npm run check` and `npm test` after changing the TypeScript tooling.
Installer tests must use temporary homes; do not modify the user's harness
configuration to test installation.
