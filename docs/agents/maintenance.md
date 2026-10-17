# Maintain shared references

Keep guidance used across workflows in `references/`.

When changing a collection's inventory or loading triggers, update the
[reference catalog](../../references/README.md) and the collection's index.
For adapted documents, keep `SOURCE.toml` beside the collection and point its
`license` field to the source's file in `licenses/`. Map each adapted document to its upstream file.

For the user-facing explanation of loading and applying references, see
[Use shared references](../user/references.md).

For upstream updates, follow [external-source guidance](external-sources.md).
