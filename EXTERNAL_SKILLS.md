# Updating external skills

Use this workflow when checking or updating a skill with a `SOURCE.toml`.
Spellbook has no automated upstream updater yet. Keep the editable skill in
`skills/<name>/` and reconstruct upstream versions in a temporary directory or
an external cache.

## External references

This workflow also applies to adapted external documents in `references/`.
Keep a collection's `SOURCE.toml` and license notices beside its documents.
Record `repository`, repository-relative `path`, and the full integrated
`commit`. For a collection adapted from selected upstream files, add a `[files]`
table mapping local filenames to repository-relative upstream files. Only those
mapped files are integrated; the containing upstream directory is not imported
in full. Authored indexes and other local-only documents have no upstream entry.

Reconstruct each mapped upstream file at base and target, including its original
frontmatter, supporting dependencies, and applicable license notices. Compare
the full sources before deciding which changes affect the adapted reference.
Account for format transformations separately: principles use ordinary Markdown
with triggers, application guidance, boundaries, checks, and related links.
Skill frontmatter and invocation metadata belong to upstream skill packaging;
they do not belong in the reference document. Resolve upstream companion links
to adopted references or incorporate the necessary guidance within scope.

Preserve intentional local changes, such as scoped authorization and exceptions
to broad upstream rules. Review semantic changes even when different formats
prevent a useful textual merge. Validate the mapped inventory, relative links,
loading pointers, and license notices before advancing the pin. Update
`references/README.md`, the collection's index, and installation documentation
when affected. The remaining sections describe the same process for skills.

## Establish the versions

1. Read the skill's `SOURCE.toml`, `SKILL.md`, supporting files, and catalog
   entry. Record the repository URL, repository-relative path, and full commit
   SHA. That SHA is the last integrated upstream version (the **base**).
2. Inspect `git status` and the local diff. Preserve existing work, including
   uncommitted and untracked files. The current skill directory is the **local**
   version; a clean Spellbook checkout can still contain upstream customizations.
3. Fetch the upstream repository outside this checkout. Resolve the requested
   branch, tag, or revision to a full commit SHA (the **target**). Record the
   resolved SHA so the review remains reproducible if a branch moves.
4. Extract the complete skill directory at both revisions. Include scripts,
   references, assets, and applicable license notices from the repository root
   or parent directories. If upstream moved the skill, find its new path and
   record both paths. If it was removed, report that change and decide whether
   to retain the local skill; do not infer a replacement from its name alone.

For example, after copying the values from `SOURCE.toml`, run these commands
from the Spellbook root. Replace `target_ref` with the intended revision:

```sh
repository='https://github.com/mattpocock/skills'
skill_path='skills/engineering/diagnosing-bugs'
base_commit='b0618bc436ad893b3c5e84e55fba86586d34a404'
target_ref='main'
update_dir=$(mktemp -d "${TMPDIR:-/tmp}/spellbook-update.XXXXXX")

git clone --no-checkout "$repository" "$update_dir/upstream"
git -C "$update_dir/upstream" rev-parse --verify "$base_commit^{commit}"
target_commit=$(git -C "$update_dir/upstream" rev-parse --verify "$target_ref^{commit}")
git -C "$update_dir/upstream" diff --stat "$base_commit" "$target_commit" -- "$skill_path"
mkdir "$update_dir/base" "$update_dir/target"
git -C "$update_dir/upstream" archive "$base_commit" "$skill_path" | tar -x -C "$update_dir/base"
git -C "$update_dir/upstream" archive "$target_commit" "$skill_path" | tar -x -C "$update_dir/target"
```

Verify each command succeeded before using its output. Fetch missing revisions
explicitly if needed. Adjust the target extraction path for a moved skill and
extract applicable license files separately. Reuse a cached clone if available.
`SOURCE.toml` and locally added files may have no upstream counterpart.

## Review and merge

Compare **base → target** to understand upstream changes, and **base → local**
to identify Spellbook adaptations. Review both across the entire directory.
An unchanged upstream skill needs no pin update merely because the repository
has newer commits.

Merge target changes into local using base as the common ancestor. For an
ordinary text file present in all three versions, Git can produce a candidate
outside the checkout:

```sh
git merge-file -p "$local_file" "$base_file" "$target_file" > "$candidate_file"
```

Set those variables to the corresponding file paths first. Exit zero means a
textually clean merge; a positive conflict count means the candidate contains
conflict markers, and an error must be investigated. Review the candidate
before copying it into `skills/<name>/`. A clean text merge still needs a review
of the resulting instructions and behavior.

Handle changes to the file inventory explicitly:

| Change | Action |
| --- | --- |
| Upstream adds a file | Import it after review; merge deliberately if a local file already uses that path. |
| Upstream deletes a file | Remove an unmodified copy; review local edits and callers before deciding whether to retain a customized file. |
| Upstream renames or moves a file | Match the old and new paths, carry local edits forward, and update references. |
| Local-only file | Keep it unless the update makes it obsolete; review any overlapping new upstream content. |
| Binary file or changed executable mode | Review and choose the intended version and permissions explicitly. |

Preserve the intent of local adaptations unless the requested update changes it.
Check especially:

- Codex, Claude Code, and Pi portability, including relative companion pointers.
- Explicit invocation rules, `disable-model-invocation`, and the matching
  `agents/openai.yaml` policy where present.
- User authorization requirements, delegation assumptions, fixed model names,
  external tools, and headless or remote execution handling.
- Required companion skills, supporting resources, and license notices.

Review new dependencies and instructions as part of the update. Importing a
workflow does not authorize executing it. Keep upstream snapshots, merge
candidates, and generated patches outside the repository.

## Validate and record

1. Read the final manifest and all changed supporting files. Check relative
   links, companion availability, invocation policy consistency, license notices,
   script syntax, and any behavior affected by the update. Resolve every merge
   conflict and check the final diff for unintended changes or conflict markers.
2. Run the checks appropriate to changed resources. If TypeScript tooling
   changed, run `npm run check` and `npm test`. Installer smoke tests must use
   temporary homes, leaving the user's harness configuration untouched. Report
   live invocation separately from static checks; one does not establish the
   other. If a validator rejects harness-specific metadata, check it separately
   and describe the validation limit rather than removing the policy to pass.
3. After integration and validation, update `SOURCE.toml` to the target's full
   SHA and current upstream path and repository. Advance the pin only after
   every upstream change in scope has been accounted for, including deliberate
   local deviations. For an incomplete or abandoned update, retain the old pin
   and report what remains; it must remain a usable merge base.
4. Update `skills/README.md` with the resulting description, use cases,
   invocation group, and dependencies. Update root documentation if the skill
   inventory or installation requirements changed.
5. Report the old and new upstream SHAs, upstream changes integrated, local
   adaptations retained or revised, checks run, and any unresolved limits.
   Create a commit or PR only when that work is requested.

Completion means the skill and its supporting files are coherent, checks have
passed or their limits are stated, provenance matches the integrated version,
and the catalog matches the resulting behavior.
