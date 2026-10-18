# Source and adaptations

## setup-pstack

Adapted the per-role model file that pstack's `setup-pstack` writes to
`~/.cursor/rules/pstack-models.mdc`. Kept its shape: one line per role, a model
with an effort level, and skill instructions that name the role they spawn.
Kept the role names `how explorer`, `how explainer`, `why investigators`, and
`why synthesizer` so they match the adopted `how` and `why` skills. Upstream's
single `interrogate reviewers` panel line became one `interrogate reviewer <label>`
role per reviewer, so each reviewer keeps the usual fallback order. The
`arena runners` and `architect runners` panels became `arena runner <label>` and
`architect runner <label>` roles the same way. The `arena cross-judge pool` became
the `arena cross-judge` role; arena picks its first entry from another vendor.

Local decisions:

- The role map is checked in and installed with the shared references. Editing
  `README.md` replaces re-running a setup skill.
- Entries name a vendor, a model, and an effort as separate parts, instead of
  Cursor slugs that fold effort into the name. That keeps one entry usable
  across Codex, Claude Code, Pi, and T3 Code.
- A comma-separated list is a fallback order. The first reachable entry wins,
  so one role can prefer a Codex model and fall back to a Claude model.
- Defaults run worker roles at `low` effort on small models and judgment roles
  at `medium`, to protect subscription usage. Workers and judgment roles prefer
  different vendors so their usage is spread across two subscriptions.

### Declined

- The setup skill itself, with model detection, budget questions, and
  confirmation prompts. One small file edited by hand does the same job.
- The budget ladder that rewrites every effort level at once. Effort is set per
  role; add a budget only if editing four lines becomes a burden.
- The `auto` alias. It is Cursor-specific; `inherit` covers the session model.
- Roles for pstack skills Spellbook does not carry, such as swarm and
  reflect. Add a role when a skill consumes it.
- Panel lists, where each entry spawns another subagent. Lists here mean
  fallback order; a panel such as interrogate or arena uses one role per member instead.
- The optional offer to create a verification skill at the end of setup.

## Validation

Checked that the roles match the role names in the `how`, `why`, `interrogate`,
`arena`, and `architect` skills,
that every default model appears in T3 Code's live provider catalog on
2026-10-17, and that the upstream license is unchanged. This does not prove each
harness's native subagent tool accepts every model or effort.
