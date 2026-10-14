# Updating external references

Keep adapted collections in `references/`, with `SOURCE.toml` and applicable
license notices beside the documents. Record the upstream repository,
repository-relative path, and full commit SHA of the last integrated version.
For selected files, use a `[files]` table mapping local filenames to upstream paths.

Before updating, inspect Git status and preserve existing work. Reconstruct the
mapped upstream files at the recorded base and requested target commits outside
this checkout. Include frontmatter, supporting dependencies, and license notices.
Compare base to target for upstream changes and base to local for adaptations.

Merge changes while preserving intentional local guidance and authorization
boundaries. Account for format transformations separately. Review semantic
changes, companion links, additions, deletions, and moved files explicitly.
Keep upstream snapshots and generated patches outside this repository.

Validate the final inventory, relative links, loading pointers, and license
notices. Update the reference catalog and collection index when affected.
Advance provenance to the full target SHA only after all changes in scope have
been accounted for. If integration is incomplete, retain the original pin.
Report integrated changes, retained adaptations, validation, and any limits.
