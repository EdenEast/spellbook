# review

Structured code-review workflow for pi.

The extension can review local changes, compare a branch against a base branch, inspect a commit, review a folder snapshot, or check out and review a GitHub pull request.

## Commands

```text
/review
/review uncommitted
/review branch main
/review commit abc123
/review folder src docs
/review pr 123
/review pr https://github.com/owner/repo/pull/123
/review --extra "focus on performance regressions"
/end-review
```

Running `/review` without arguments opens an interactive selector. If the current conversation already has messages, the extension asks whether to start the review in an empty branch or the current session.

## Review modes

- **Uncommitted changes** — reviews staged, unstaged, and untracked files.
- **Base branch** — reviews the current branch against a selected branch using the merge base when available.
- **Commit** — reviews changes introduced by a selected commit.
- **Folder** — reviews specific files or folders as a snapshot, not a diff.
- **Pull request** — uses `gh pr view` and `gh pr checkout`, then reviews against the PR base branch.

## Custom instructions

The selector includes options to add or remove shared custom review instructions. These are persisted in the pi session tree and applied to all review modes.

You can also pass one-off instructions with `--extra`:

```text
/review uncommitted --extra "focus on migrations and permissions"
```

If a `REVIEW_GUIDELINES.md` file exists next to the project `.pi` directory, its contents are appended to the review prompt.

## Loop fixing

The selector can enable **Loop Fixing** for compatible targets. In loop mode, pi repeatedly:

1. Runs a review.
2. If blocking findings are detected, asks the agent to fix them.
3. Reviews again until the verdict is clean or the safety limit is reached.

Loop fixing is not supported for commit reviews.

## Ending a review

Use `/end-review` when a review was started in an empty branch. You can:

- return only,
- return and summarize findings into the original branch,
- return, summarize, and queue a follow-up to fix findings.

## Requirements and cautions

- Must run inside a git repository.
- PR review requires the GitHub CLI (`gh`) and a clean tracked working tree before checkout.
- The extension keeps only one active review session at a time.

## Source

Adapted from:

- <https://github.com/mitsuhiko/agent-stuff/blob/main/extensions/review.ts>
