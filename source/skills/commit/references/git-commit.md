# Creating a Git commit

Git has a staging area. Stage only the files or hunks that belong in the commit.  Do not stage private planning notes,
scratch files, or ignored local files unless the user explicitly asks for them. If unrelated changes are present, ask
the user how to split them.

## Create the commit

Write the message using the structure from `../SKILL.md`. Prefer passing the message through a file or standard input
instead of relying on fragile shell quoting for multi-line text.

```bash
git commit -F <message-file>
```
