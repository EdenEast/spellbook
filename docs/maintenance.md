# Maintain shared references

Keep guidance used across workflows in `references/`.

When changing a collection's inventory or loading triggers, update the
[reference catalog](../references/README.md) and the collection's index.
For adapted documents, keep `SOURCE.toml` and applicable license notices beside
the collection. Map each adapted document to its upstream file.

## Shared reference use

The global instructions direct agents to read the
[principles index](../references/principles/README.md) before design,
implementation, debugging, or substantive review. Agents then read the full
documents whose triggers match the task. You can name a principle, such as
"prove it works" or "subtract before you add", to apply it to a task.

Each principle is ordinary Markdown with a rule, triggers, application guidance,
boundaries, a check, and related references. References have no skill invocation
entries. The collection adapts 24 pstack principles; its
[source record](../references/principles/SOURCE.toml) identifies the integrated
upstream commit and files.

Installed references use `~/.agents/references/spellbook/` for all three agents.
Workflows can link to `~/.agents/references/spellbook/principles/<name>.md` at the
step that needs the guidance. In the checkout, the index is
`references/principles/README.md`.

If the installed library is missing, agents continue with available instructions
and report the gap when relevant. Agents explain a principle's effect on a
decision when that explanation helps assess the work.

For upstream updates, follow [external-source guidance](external-sources.md).
