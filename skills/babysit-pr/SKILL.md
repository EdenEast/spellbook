---
name: babysit-pr
description: Monitor a pull request through review and CI. Use when the user asks to monitor, watch or babysit a PR.
---

# Babysit PR

## Watching the PR

Use the harness's native PR monitor; in T3 Code, use `watch_pull_request` when
available. Otherwise, read [the watcher reference](references/watch-pr.md) and
use the bundled GitHub script. Run only one monitor per PR. If neither is
available, poll with increasing waits while checks run.

Identify expected review bots from repository configuration and prior activity,
including bots not yet scheduled. After each push, wait for their results on the
latest head. Inspect feedback before acting on green CI; resume watching after
fixes. Stay quiet when nothing changes.

## Handling feedback

Verify findings against the source before changing code. Check feedback freshness
against the latest push; distinguish repository failures from infrastructure
flakes. Fix real findings and CI failures within the user's original scope.
Reply with a written reason and resolve bot comments you dismiss. Format replies
on the user's behalf as:

```md
[MODEL-SLUG] RESPONDING ON BEHALF OF @EdenEast
---

[actual reply]
```

Watch `main` and rebase when needed. If an overlapping PR makes this one
obsolete, stop and report it; ask before closing unless already authorized.

## Finishing

Stop when the latest head's required checks and expected review automation pass
or skip, feedback is handled, threads are resolved, and there are no conflicts
or requested changes. Missing check data does not establish completion. Human
approval, draft status, optional CI, and the human `Code Review Gate` do not
prolong babysitting; report remaining human merge gates separately.

End monitoring if the PR is merged or closed. Merge only on explicit request.
