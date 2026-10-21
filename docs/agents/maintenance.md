# Maintain shared references

Keep guidance used across workflows in `references/`.

When changing a collection's inventory or loading triggers, update the
[reference catalog](../../references/README.md) and the collection's index.
For adapted documents, keep `SOURCE.toml` beside the collection and point its
`license` field to the source's file in `licenses/`. Map each adapted document to its upstream file.

The principle triggers in `instructions/AGENTS.md` are generated from the
principles index. After changing a principle's trigger or the inventory, run
`npm run principles:sync`; `npm test` fails while the list is stale.

For the user-facing explanation of loading and applying references, see
[Use shared references](../user/references.md).

For upstream updates, follow [external-source guidance](external-sources.md).
