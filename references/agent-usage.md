# Agent usage

Read when a skill links here for model selection, delegation, or investigation
scope. This policy supplies defaults for those workflows; it does not change
unrelated tasks or override an explicit user request.

- Use the current session model and settings. Do not automatically select a
  provider, change models, increase reasoning effort, or enable a faster mode.
- Work inline by default. Additional agents, model changes, and repeated
  independent passes require an explicit user request. A request to explain,
  investigate, or review is not by itself a request for delegation.
- If delegation is requested, keep assignments bounded and reuse findings.
  Inherit the parent model unless the user specifies another model. If the
  requested model is unavailable, report that limitation rather than silently
  choosing a provider or model.
- Start with relevant files and evidence. Expand when a concrete lead,
  contradiction, or material gap warrants it. Stop when the question is
  adequately supported or the remaining uncertainty can be stated honestly.
- Reuse context already established in the conversation. Load supporting
  references only when needed, keep intermediate findings compact, and match
  output length to the question.
- State uncertainty and search limits. Distinguish unavailable sources,
  available but unsearched sources, and searches that returned no evidence.

These are instruction defaults, not an enforced token budget or a guarantee of
subscription usage. Explicitly requested broader work can consume more usage.
If this shared reference is unavailable, continue inline on the current model,
without additional agents, and report the missing reference when relevant.
