# Agent instructions

## Shared references

Keep guidance shared across workflows in `references/`. Maintain
`references/README.md` and each collection's index when changing its inventory
or loading triggers.

For adapted external references, follow the reference guidance in
[EXTERNAL_REFERENCES.md](EXTERNAL_REFERENCES.md). Keep provenance and applicable license
notices beside the adapted documents.

## Pi extensions

Keep maintained extensions in `pi/extensions/`. Add dependencies only when an
extension requires them. Pi host packages belong in peer dependencies.

## Validation

Run `npm run check` and `npm test` after changing the TypeScript tooling.
Installer tests must use temporary homes; do not modify the user's harness
configuration to test installation.
