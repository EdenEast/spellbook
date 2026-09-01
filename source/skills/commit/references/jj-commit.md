# Creating a Jujutsu commit

## Inspect and select changes

Jujutsu does not have a Git-style staging area. Running Jujutsu commands may snapshot working-copy changes, including
untracked files, so be deliberate about what you inspect and commit.

When only part of the working copy should be committed, use the repository's normal Jujutsu workflow to split or move
changes before finalizing the commit. Be careful with commands that modify changes, such as `jj split`, `jj squash`,
and `jj commit`; pass explicit file paths when that is the safest way to express the requested scope.

## Create the commit

Write the message using the structure from `../SKILL.md`.

For the entire current change, prefer describing the current change from standard input and then starting a new change:

```bash
printf '%s' "$MESSAGE" | jj describe --stdin && jj new
```

For operations that would normally open an editor, write the message to a temporary file and set `JJ_EDITOR` so Jujutsu
copies that message into its editor scratch file:

```bash
tmp=$(mktemp)
cat > "$tmp" <<'EOF'
feat: subject line

Body paragraph, wrapped to 72 columns.
EOF
JJ_EDITOR="cp $tmp" jj split path/to/file.txt
rm -f "$tmp"
```
