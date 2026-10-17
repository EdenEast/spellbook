# Model roles

Read when a skill spawns a subagent for a named role. This file sets the model
and reasoning effort for each role. Edit a line to change a role's choice.

## Roles

```text
how explorer: openai/gpt-6-luna low, anthropic/claude-haiku-5-5 low
how explainer: anthropic/claude-opus-5-5 medium, openai/gpt-6.1-sol medium
why investigators: openai/gpt-6-luna low, anthropic/claude-haiku-5-5 low
why synthesizer: anthropic/claude-opus-5-5 medium, openai/gpt-6.1-sol medium
```

Each entry is `<vendor>/<model> <effort>`. Effort is one of `low`, `medium`,
`high`, `xhigh`, or `max`. A comma-separated list is in preference order: use
the first entry the harness can reach. The value `inherit` means the session
model at its current effort.

The defaults favor usage over depth. Workers that read many files run at `low`
on a small model. Roles that reconcile findings run at `medium`. The worker and
judgment roles prefer different vendors so their usage draws on separate
subscriptions.

## Choose a model for a role

1. A model the user names for the task overrides this file.
2. Otherwise take the role's first entry the harness can reach:
   - Use the harness's native subagent tool when it supports the vendor, model,
     and effort. Claude Code's agent tool takes a model alias, such as `opus`
     for `anthropic/claude-opus-5-5`.
   - Otherwise use T3 Code's `delegate_task` when it is available. Map `openai`
     to the `codex` provider instance and `anthropic` to `claudeAgent`, and
     confirm the model in `orchestrator_capabilities`.
3. If no entry is reachable, or the role is missing from this file, use the
   session model at the role's lowest listed effort.

State the model and effort each spawn used when it differs from the first
entry, so a fallback is visible. Never substitute a model that is not listed or
detected; report the gap instead.
