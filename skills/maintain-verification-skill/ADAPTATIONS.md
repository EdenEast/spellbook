# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `maintain-verification-skill` from `cursor/plugins`.
[SOURCE.toml](SOURCE.toml) records the exact upstream baseline and maps the
complete skill tree plus `pstack/LICENSE`. Reviewed the entry point and MIT
license. Upstream ships no companion files, scripts, assets, or fixed tool
dependencies. A target verification skill with a feature map and working app
interaction tools is required; the sibling creation skill supplies the workflow
when no target exists.

Preserved index hygiene, source coverage for every feature, recipe reconciliation,
coordinator-owned live driving, health checks and reset rules, evidence retention,
failed-iteration cleanup, one retry for doctor drift, unreachable-path evidence,
and live re-proof of harness fixes. Product code remains outside edit scope.
Retained upstream's explicit invocation setting.

### Local adjustments

- Locate verification skills in the repository's project-local skill directories
  rather than assuming Cursor. Link directly to the sibling creation skill and
  use the active harness's invocation syntax.
- Keep concurrent read-only source readers when delegation is available and
  authorized, within harness capacity. Otherwise perform the same per-feature
  review serially; source and live coverage requirements remain unchanged.
- Describe the capability without assuming parallel readers or PR publication
  in every environment.
- Keep live driving, delegation, and publishing within the authorized scope,
  with disposable test state for mutations.
- Allow the `changed` outcome to deliver proven corrections ready for review
  when publishing is not authorized. Report publication as pending; publish at
  most one PR when authorized. `blocked` still reports incomplete coverage or
  inability to prepare a safe correction.

The shared [pstack license](../../licenses/pstack.txt) covers this skill. `SOURCE.toml` and this note are local maintenance files.
No upstream guidance was declined or deferred.

## Validation

Checked upstream inventory, source mappings, frontmatter, links, unchanged license,
and complete-tree installation for Codex, Claude Code, and Pi in temporary homes.
Manually walked no-target routing, multiple-target ambiguity, clean coverage,
doctor drift with one retry, product regression reporting, and corrections
prepared without publishing authorization. Checked that serial review still
requires every feature and that source-only coverage cannot yield `clean`.
These checks establish packaging and instruction coverage, not model
effectiveness, live harness discovery, or execution against a real target app.
