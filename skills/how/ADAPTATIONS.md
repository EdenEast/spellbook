# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `how` from `cursor/plugins`. [SOURCE.toml](SOURCE.toml)
records the exact upstream baseline and every file mapping. Reviewed and retained
the complete upstream skill tree plus the unchanged `pstack/LICENSE`.
Preserved upstream's `disable-model-invocation: true` for explicit invocation.

## Local adjustments

Restored upstream's explorer fan-out and separate explainer for complex
questions. Spawns use the harness's agent tool and run read-only. Their model
and effort come from the `how explorer` and `how explainer` roles in the shared
[model roles](../../references/models/README.md), which replaces upstream's
`pstack-models.mdc` rule.

Preserved complexity assessment, exploration angles, reconciliation, architectural
explanation sections, read-only investigation, concrete file references, and
honest gaps. The explainer template names generic file reading and search tools
instead of Cursor's Read, Grep, and Glob.

### Declined

- Declined spawning an explainer on the simple path. A single module or narrow
  question is explained in one pass by the main agent, so a subagent would only
  repeat that work.
- Declined the Cursor Task API, poteto-mode dependency, Cursor model-slug
  defaults, and rejected-slug fallback rules. These assume Cursor's model
  roster; the shared model roles cover choice and fallback instead.

## Maintenance

`SOURCE.toml` and this note are local-only files. The shared [pstack license](../../licenses/pstack.txt) covers this skill. Retain these local
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
