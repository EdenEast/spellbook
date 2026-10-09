# Maintain skills and references

## Add a skill

Put global skills in `skills/<name>/`. Put repository-only skills in
`.agents/skills/<name>/`, with `.claude/skills/<name>` linked to that directory.
Both global installers read only `skills/`.

For an imported skill, copy the complete directory, including references,
scripts, and required license notices. Add `SOURCE.toml` beside `SKILL.md`:

```toml
repository = "https://github.com/cursor/plugins"
path = "pstack/skills/architect"
commit = "60c641e4fad674784b30abcf9f8915dea39df38d"
```

Use the full upstream commit SHA. Set `path` relative to the upstream repository
root. The commit records the upstream version last integrated into the skill,
not the current Spellbook commit. Skills you write yourself need no source record.

Keep customized files directly in the skill directory. Update the
[skill catalog](../skills/README.md) when adding, removing, or changing a skill.
Include a relative link, description, and use cases in the appropriate invocation
group.

## Update an imported skill or reference

Follow [Updating external skills](../EXTERNAL_SKILLS.md) to reconstruct upstream
versions, merge local adaptations, validate the result, and advance provenance.
For adapted references, use the workflow's
[external reference guidance](../EXTERNAL_SKILLS.md#external-references).

Keep upstream snapshots and generated patches outside this repository.
The update workflow is manual; Spellbook has no automated upstream checker or
updater.

## Maintain shared references

Keep guidance used across workflows in `references/`. Keep supporting material
used by one skill in that skill's directory.

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
A skill can link to `~/.agents/references/spellbook/principles/<name>.md` at the
step that needs the guidance. In the checkout, the index is
`references/principles/README.md`.

If the installed library is missing, agents continue with available instructions
and report the gap when relevant. Agents explain a principle's effect on a
decision when that explanation helps assess the work.
