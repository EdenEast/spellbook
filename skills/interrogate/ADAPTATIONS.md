# Upstream and local adjustments

## pstack

Adopted Lauren Tan's pstack `interrogate` from `cursor/plugins`. [SOURCE.toml](SOURCE.toml)
records the exact upstream baseline and every file mapping. Reviewed and retained
the complete upstream skill tree plus the unchanged `pstack/LICENSE`.
Preserved upstream's `disable-model-invocation: true` for explicit invocation.

## Local adjustments

Reviewers spawn through the harness's agent tool and run read-only. Each
reviewer's model and effort come from an `interrogate reviewer <label>` role in
the shared [model roles](../../references/models/README.md), which replaces
upstream's `pstack-models.mdc` line and default table. Reviewer A prefers Claude
and Reviewer B prefers OpenAI, at `high` effort.

When two reviewers resolve to the same model, the skill still runs and reports
the lost diversity. The Reviewers output line names effort as well as model, so
a fallback is visible.

The rubric names generic file reading and search tools instead of Cursor's Read,
Grep, and Glob.

Preserved scope and intent steps, the shared reviewer template, rubric,
code-quality lens, synthesis, lead-judgment buckets, output format, and the rule
not to apply changes.

### Declined

- Declined the Cursor Task API and its `generalPurpose` and `readonly`
  parameters. The harness's read-only agent type or instruction covers them.
- Declined upstream's Cursor and Grok model-slug defaults, model families, and
  rejected-slug fallback rules. The shared model roles set choice and fallback.
- Declined opening a separate PR to update the default table after a rejected
  slug. There is no default table here; the user edits the role lines instead.
- Declined the poteto-mode dependency for reasoning level and speed. Each role
  sets effort directly.

## Maintenance

`SOURCE.toml` and this note are local-only files. The shared [pstack license](../../licenses/pstack.txt) covers this skill. Retain these local
adjustments when integrating future upstream changes.

## Validation

Diffed every mapped file against the upstream baseline so that only the
adjustments recorded above remain. Checked local links and the unchanged
upstream license. Installed and uninstalled for Codex, Claude Code, and Pi in a
temporary home; `npm run check` and `npm test` passed. The active harness
configuration was not changed.

These are packaging and instruction checks. They do not evaluate a live review
or model selection in each harness.
