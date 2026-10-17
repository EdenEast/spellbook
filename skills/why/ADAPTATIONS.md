# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `why` from `cursor/plugins`. [SOURCE.toml](SOURCE.toml)
records the exact upstream baseline and every file mapping. Reviewed and retained
the complete upstream skill tree plus the unchanged `pstack/LICENSE`.
Preserved upstream's `disable-model-invocation: true` for explicit invocation.

## Local adjustments

Restored upstream's parallel investigators, one per available evidence category,
and the separate synthesizer. Spawns use the harness's agent tool and the session
model unless the user names another. They keep MCP access and write nothing.

Preserved code anchoring, historical investigation, all seven evidence categories,
source playbooks, five confidence tiers, citation checks, competing hypotheses,
coverage gaps, and Preserve / Change / Avoid / Risk constraints before changes.
The complete supporting tree is retained, including conditional service and
incident playbooks.

### Declined

- Declined the requirement to prove a category irrelevant before skipping it,
  and the full seven-category sweep as the default. Investigators are spawned
  for available categories that could bear on the question; skipped categories
  get a written scope reason in Sources Consulted.
- Declined confirming all seven searches are redundant before answering a
  trivial target inline. When the PR already answers a single-commit question,
  cite it and report the limited coverage.
- Declined Cursor-only MCP discovery, Task permission settings, poteto-mode,
  `pstack-models.mdc` model defaults, and slug fallback rules. Discover MCPs from
  the harness's tool descriptions; treat playbook tool names as examples.
- Declined assumptions that Git history and authenticated `gh` are always
  available. Report missing or shallow history and unavailable PR access.
- Kept the synthesizer's coverage wording, which separates searched, unavailable,
  and unsearched sources, so an unsearched source is never reported as empty.

## Maintenance

`SOURCE.toml` and this note are local-only files. `LICENSE` maps separately to the
plugin license outside the upstream skill directory. Retain these local
adjustments when integrating future upstream changes.

## Validation

Diffed every mapped file against the upstream baseline so that only the
adjustments recorded above remain. Checked local links (excluding the
illustrative citation URL placeholder). Installed and uninstalled for Codex,
Claude Code, and Pi in a temporary home; `npm run check` and `npm test` passed.
The active harness configuration was not changed.

The skill-creator validator rejects the preserved `disable-model-invocation`
field. Verified that field separately as boolean true, then validated temporary
copies with only that unsupported field removed; both passed. Repository skill
files retain the upstream invocation setting.

These are packaging and instruction checks. They do not evaluate live
subagent fan-out, model selection, or MCP discovery in each harness.
