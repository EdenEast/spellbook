# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `architect` from `cursor/plugins`. [SOURCE.toml](SOURCE.toml)
records the exact upstream baseline and every file mapping. Reviewed and retained
the complete upstream skill tree plus the unchanged `pstack/LICENSE`.
Preserved upstream's `disable-model-invocation: true` for explicit invocation.

## Local adjustments

Phase B runners take their model and effort from `architect runner <label>`
roles in the shared [model roles](../../references/models/README.md), in place
of arena's runner roles. The cross-judge keeps arena's `arena cross-judge` role.
This replaces upstream's `architect runners` line, default slugs, and the
pointer to arena's rejected-slug rules.

Principle references in `SKILL.md` and `references/runner-prompt.md` link to the
shared [principles](../../references/principles/README.md) instead of naming
pstack principle skills. The `how`, `why`, `arena`, and `interrogate` skills it
runs are all carried in Spellbook.

Preserved grounding, the design-it-twice rule, the red-flag screen, interface
depth comparison, the opt-in checkpoint, implementing against the sketch, the
scrap signals and procedure, the runner prompt, and the rationale template.

### Declined

- Declined upstream's Cursor and Grok model-slug defaults and aliases. The
  shared model roles set choice and fallback.

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
