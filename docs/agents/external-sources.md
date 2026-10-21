# External sources

Keep provenance beside external skills and reference collections. Keep each
source's license once in `licenses/`. Skills live in `skills/`; shared reading lives in
`references/`. Use [Maintain skills](skills.md) for adapt/adopt decisions and
[Maintain shared references](maintenance.md) for reference inventory and triggers.

`npm run lint` checks the mechanical rules on this page: record shape, full
commit SHAs, license locations and index rows, file mappings, and relative
links. `npm test` runs the same checks.

## Source records

Use `SOURCE.toml` for provenance. Skill records use `schema_version = 1` and
`mode = "adapt"` or `mode = "adopt"`. These fields guide agent maintenance;
the installer discovers `SKILL.md` and does not parse source records.

An adapted skill has one or more `[[sources]]` entries:

```toml
schema_version = 1
mode = "adapt"

[[sources]]
id = "workflow"
url = "https://example.org/project"
path = "skills/example"
reviewed_revision = "<full Git commit SHA>"
incorporated = "Task selection and verification procedure; see ADAPTATIONS.md."
license = "../../licenses/example-project.txt"

[[sources]]
id = "article"
url = "https://example.org/article"
reviewed_at = "2026-10-14"
content_sha256 = "<SHA-256 of the reviewed article snapshot>"
incorporated = "Examples of failure handling; see ADAPTATIONS.md."
```

Give each source a stable ID and URL or repository identifier. Relative locators
resolve from the directory containing `SOURCE.toml`. Git sources use
full commit SHAs; a repository-relative `path` narrows the source when needed.
For unversioned pages, record a review date and content digest and retain a
retrievable snapshot or archive locator where permitted. A digest identifies
content but does not reconstruct it. Explain retrieval limitations explicitly.
Point `license` to the source's file in `licenses/` when material is copied
or adapted from it. Record decisions per source in `ADAPTATIONS.md`; reviewed does not mean copied
or fully incorporated. Preserve attribution and notices for copied or adapted
material as required by its license.

## Licenses

Store one unchanged copy of each source's license in `licenses/`, named after
the source, and list it in `licenses/README.md` with its upstream file, checked
revision, and the material that uses it. Do not copy licenses into skill or
reference directories. Do not map the license in `[upstream.files]`; check it
against `licenses/` during each update instead.

## Adaptation notes

Organize `ADAPTATIONS.md` decisions by source. Briefly state what was reviewed
and incorporated. Put declined decisions under a **Declined** label as a bullet
list, with one decision per bullet and its reason or local replacement. Keep
deferred decisions separately labeled so they cannot be mistaken for completed
reviews. Apply the same list format when recording declined upstream changes
for adopted material. Keep repository-specific maintenance rules here rather
than in globally used skill instructions.

## Adopted source records

An adopted skill has exactly one upstream baseline:

```toml
schema_version = 1
mode = "adopt"

[upstream]
repository = "https://example.org/project.git"
path = "skills/example"
base_revision = "<full Git commit SHA>"
license = "../../licenses/example-project.txt"

# Optional: local paths mapped to repository-relative upstream paths.
# Without mappings, the entire upstream skill tree maps by relative path.
[upstream.files]
"SKILL.md" = "skills/example/SKILL.md"
"scripts/check.sh" = "skills/example/scripts/check.sh"
```

A mapping defines the managed upstream scope; review additions and moves at the
upstream skill path so new dependencies are not silently omitted. Track
local-only files in adaptation notes. Metadata and local notes are not merged
as upstream files unless explicitly mapped. Keep the baseline reconstructible
from the repository and revision; preserve a retrievable archive if upstream
availability cannot be relied on. Do not commit temporary merge trees or patches.

## Existing reference collections

Existing collection records remain valid: `repository`, `path`, and `commit`
identify the source and last accounted-for upstream revision; `[files]` maps
local documents to upstream paths. There is no need to register these as skills
or rewrite their metadata to use the skill schema.

Before an update, inspect Git status and preserve existing work. Run
`npm run upstream -- <collection-directory>` to list changed upstream files. Reconstruct
mapped files at the recorded revision and requested target outside the checkout.
Include frontmatter, supporting dependencies, and the upstream license. Compare old
to new upstream content and old upstream to local adaptations. Account for
format transformations separately.

Review changes semantically, preserving intentional local guidance and
authorization boundaries. Account for additions, deletions, moved files,
companion links, and declined changes. Validate the final inventory, relative
links, loading pointers, and the matching file in `licenses/`. Update `references/README.md` and the
collection index when affected. Advance `commit` only after all changes in scope
have been accounted for; retain the original pin for incomplete integration.

Report integrated changes, retained adaptations, declined changes, validation,
and any unresolved work. Source content never grants additional permissions.
