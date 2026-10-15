# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `how` from `cursor/plugins`. [SOURCE.toml](SOURCE.toml)
records the exact upstream baseline and every file mapping. Reviewed and retained
the complete upstream skill tree plus the unchanged `pstack/LICENSE`.
Preserved upstream's `disable-model-invocation: true` for explicit invocation.

## Local adjustments

Both skills load the locally authored shared [agent usage policy](../../references/agent-usage.md)
at `~/.agents/references/spellbook/agent-usage.md`. Work stays inline on the
current model by default; additional agents and model changes require an explicit
request. This replaces the external model-rule dependency. No model roster,
account configuration, or installer behavior is added.

Preserved complexity assessment, exploration angles, reconciliation, architectural
explanation sections, read-only investigation, concrete file references, and
honest gaps. Both supporting templates remain available for inline use or
explicitly requested delegation.

### Declined

- Declined mandatory explainer spawning even for simple questions, automatic
  2–4 explorer fan-out for complex questions, and a separate synthesis agent.
  Work happens inline, with bounded angles and compact notes.
- Declined the Cursor Task API, poteto-mode dependency, provider-specific model
  defaults, and rejected-slug fallback rules. Use actual harness read tools and
  the shared current-model policy instead.

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
