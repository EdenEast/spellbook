# Maintain skills

Use the [domain glossary](../GLOSSARY.md) for shared terminology, including the
distinction between a reviewed version and an upstream baseline.

Keep active skills in `skills/<name>/`, with a `SKILL.md` entry point whose
frontmatter contains `name` and `description`. Use lowercase letters, digits,
and hyphens for directory names. Preserve an adopted skill's upstream name and
identity. Installed directories retain the skill name and contents. Link ownership is
identified by the source path rather than renaming the skill.

Choose the relationship before bringing in external material:

- **Adapt:** author a Spellbook skill from external ideas and your own decisions.
  Spellbook owns its behavior and future direction. Several sources can inform
  one skill.
- **Adopt:** preserve an external skill's identity and workflow, with intentional
  local adjustments. Upstream remains the basis for updates.
- **Reference:** retain reading material without registering a skill. Shared
  material belongs in `references/`; this is a resource type, not an ownership
  mode. The existing principles remain adapted references.

Keep optional scripts, assets, and skill-specific references beside `SKILL.md`.
Link shared references through `~/.agents/references/spellbook/` and give a
loading trigger. Keep source metadata alongside external material and its license in
`licenses/`, following [External sources](external-sources.md).

## Adapt a skill

1. Establish the desired task, loading trigger, behavior, and boundaries.
2. Read the selected sources and distinguish useful ideas from assumptions tied
   to an upstream environment. Author a coherent skill rather than combining
   instructions mechanically.
3. Record each source and its reviewed version in `SOURCE.toml`. Explain what
   was incorporated and the local design decisions in `ADAPTATIONS.md`, following
   the [adaptation note format](external-sources.md#adaptation-notes).
4. Check realistic requests against the skill, its links, and any executable
   helpers. Install only after the repository changes are ready.

When updating, compare each source's reviewed version with its new version.
Decide which changes serve the local skill and record incorporated, declined,
and deferred changes. Advance that source's reviewed version only after the
review is complete. Declining a change is a completed decision; deferring it is
unfinished work. Do not merge source text mechanically into an adapted skill.

## Adopt a skill

1. Select an exact upstream revision and skill path. Inspect the whole skill,
   companion files, dependencies, licensing, and environmental assumptions.
2. Copy the required tree, preserving identity, workflow, and notices. Record a
   reconstructible upstream baseline and any file mappings in `SOURCE.toml`.
3. Make local adjustments and explain their purpose in `ADAPTATIONS.md`. Prefer
   portable tool capabilities; use conditional harness instructions where needed.
   Retain scripts and assets the workflow uses.
4. Exercise the workflow in each supported environment. Document any remaining
   dependency or environment requirement instead of claiming untested support.

To find what changed, run `npm run upstream -- skills/<name>`. It lists
upstream files changed since the baseline, marks files with local edits, and
reports license changes. It keeps one cached clone per repository, so read
upstream files from that clone rather than cloning again.

To update, reconstruct the old upstream tree (**base**) and requested upstream
version (**target**) outside the checkout. Compare base to the local tree for
local changes, and base to target for upstream changes. Reconcile all three,
including additions, deletions, moves, companion files, and license changes.
For a text file with the same mapping in both versions, Git can prepare a merge:

```sh
git merge-file -p -- local-file base-file target-file > candidate-file
```

Exit status zero means a clean textual merge; positive statuses indicate
conflicts and negative/error statuses need investigation. A clean textual merge
still needs semantic review. Resolve conflicts with the skill's upstream purpose
and documented local adjustments in view. Do not silently choose one whole side.
For an upstream deletion with local edits, explicitly decide whether to retain,
replace, or remove the file. Treat renames and binary files separately.

Stage candidates in a temporary directory first. Preserve existing checkout
edits, inspect the complete proposed diff, then apply the reconciled result.
Run helpers and realistic workflow checks, check links and notices, and update
adaptation notes. Advance `base_revision` only after every upstream change in
scope is accounted for and conflicts are resolved. On a partial update, retain
the old baseline and document outstanding work.

## Install and verify

`spellbook install --dry-run` previews links; `spellbook install` installs all
active skills for selected targets. `spellbook status` reports link state, not
whether upstream versions are current; `spellbook upstream` reports that. Content updates are agent-assisted
repository work; installation never fetches or merges upstream material.

See [installation paths](../user/installation-reference.md) for targets, T3 Code,
conflicts, and Pi package alternatives. The [worked examples](skill-examples.md)
show both relationships without installing example skills.
