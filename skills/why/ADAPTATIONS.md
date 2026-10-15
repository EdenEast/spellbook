# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `why` from `cursor/plugins`. [SOURCE.toml](SOURCE.toml)
records the exact upstream baseline and every file mapping. Reviewed and retained
the complete upstream skill tree plus the unchanged `pstack/LICENSE`.
Preserved upstream's `disable-model-invocation: true` for explicit invocation.

## Local adjustments

Both skills load the locally authored shared [agent usage policy](../../references/agent-usage.md)
at `~/.agents/references/spellbook/agent-usage.md`. Work stays inline on the
current model by default; additional agents and model changes require an explicit
request. This replaces the external model-rule dependency. No model roster,
account configuration, or installer behavior is added.

Preserved code anchoring, historical investigation, all seven evidence categories,
source playbooks, five confidence tiers, citation checks, competing hypotheses,
coverage gaps, and Preserve / Change / Avoid / Risk constraints before changes.
The complete supporting tree is retained, including conditional service and
incident playbooks.

### Declined

- Declined exhaustive searches across every available evidence category and
  the requirement to prove a source irrelevant before skipping it. Follow
  relevant evidence leads and state actual coverage and stopping reasons.
- Declined automatic investigator fan-out and a separate synthesizer. Investigate
  and synthesize inline; templates support explicit delegation as an option.
- Declined Cursor-only MCP discovery, Task permission settings, poteto-mode,
  provider defaults, and slug fallback rules. Inspect available read tool schemas;
  treat playbook tool names as examples and record missing access.
- Declined assumptions that Git history and authenticated `gh` are always
  available. Report missing or shallow history and unavailable PR access.
- Adjusted template search breadth, cross-source lead handling, coverage wording,
  and warehouse lineage guidance to support targeted inline investigation.

## Maintenance

`SOURCE.toml` and this note are local-only files. `LICENSE` maps separately to the
plugin license outside the upstream skill directory. The shared usage policy is
locally authored and is not part of either upstream mapping. Retain these local
adjustments when integrating future upstream changes, including new references
that might reintroduce automatic delegation or exhaustive searches.

## Validation

Checked complete upstream file mappings, the exact baseline, unchanged license
bytes, and all local links (excluding the illustrative citation URL placeholder).
Verified dry-run isolation, complete-tree installation, shared-policy access,
installed status, and uninstall for Codex, Claude Code, and Pi in temporary homes.
The active harness configuration was not changed.

The skill-creator validator rejects the preserved `disable-model-invocation`
field. Verified that field separately as boolean true, then validated temporary
copies with only that unsupported field removed; both passed. Repository skill
files retain the upstream invocation setting.

Manually walked through simple and cross-file explanations, a narrow rationale
already answered by a PR, defensive code with unavailable incident evidence,
and available sources left unsearched. Confirmed the instructions route these
to inline work, conditional reference loading, and explicit coverage gaps.
These are packaging and instruction checks, not independent model evaluations
or proof of live discovery and service access in every harness.
