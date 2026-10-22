# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `arena` from `cursor/plugins`. [SOURCE.toml](SOURCE.toml)
records the exact upstream baseline and every file mapping. Reviewed and retained
the complete upstream skill tree plus the unchanged `pstack/LICENSE`.
Preserved upstream's `disable-model-invocation: true` for explicit invocation.

## Local adjustments

Runners and the cross-judge spawn through the harness's agent tool. Each runner
takes its model and effort from an `arena runner <label>` role in the shared
[model roles](../../references/models/README.md), the way interrogate uses one
role per reviewer. The judge uses the `arena cross-judge` role and prefers the
first entry from a different vendor than the session model. This replaces
upstream's `arena runners` and `arena cross-judge pool` lines and default slugs.
A calling skill can name its own runner roles, which is how architect keeps its
separate runner choice.

Runners spawn in the background where supported. Isolation must reproduce one
input snapshot, including relevant uncommitted and untracked source without
creating an unsolicited commit. Candidates verify that starting state and own
separate source/output paths. The judge remains read-only. The coordinator
applies synthesis at the caller's final destination and removes only owned,
fully preserved temporary resources after verification.

Principle references link to the shared [principles](../../references/principles/README.md)
instead of naming pstack principle skills.

Preserved the six phases, the rubric hidden from candidates, per-candidate
output locations, the dropout rule, rubric-based picking, hand-folded grafts,
the reframe-on-divergence rule, verification, and the synthesis note.

### Declined

- Declined Cursor's Task tool and its `run_in_background` and `readonly`
  parameters. The harness's agent tool and read-only agent type cover them.
- Declined upstream's Cursor and Grok model-slug defaults, model families, the
  `auto` and `inherit-parent` aliases, and rejected-slug fallback rules. The
  shared model roles set choice and fallback; `inherit` covers the parent model.
- Declined the poteto-mode dependency for reasoning level and speed. Each role
  sets effort directly.

## Maintenance

`SOURCE.toml` and this note are local-only files. The shared [pstack license](../../licenses/pstack.txt) covers this skill. Retain these local
adjustments when integrating future upstream changes.

## Validation

Diffed every mapped file against the upstream baseline so that only the
adjustments recorded above remain. Checked local links, including the shared
principle and model-role links, and the unchanged upstream license. Installed
and uninstalled for Codex, Claude Code, and Pi in a temporary home;
`npm run check` and `npm test` passed. The active harness configuration was not
changed.

These are packaging and instruction checks. They do not evaluate a live arena
run, worktree isolation, or model selection in each harness.
