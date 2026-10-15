---
name: sdd-verify
description: Verify requirement coverage, regressions, code quality, and actual user-facing behavior of an SDD change using evidence tied to the current patch. Use before declaring implementation complete or preparing PR delivery.
---

# Verify

Read `~/.agents/references/spellbook/sdd/README.md` and its `artifacts.md`.
Read the shared principles index at
`~/.agents/references/spellbook/principles/README.md` and the matching verification
documents, including prove it works. Inspect the current diff and requirements;
task checkboxes and implementer reports are inputs, not proof.

Trace each in-scope requirement and scenario to the implementation and evidence.
Look for omitted behavior, unintended changes, inconsistent domain terms,
failure handling, regressions, and technical decisions that no longer fit the
project. Report concrete findings with their consequence and supporting evidence.
Independent review is useful when authorized and available; record whether the
review was independent or performed by the author.

Run the relevant repository checks and exercise the changed behavior at the
surface its consumer uses. Use a project verification skill when one is available
and relevant; otherwise record a reproducible procedure. For a UI, drive the
interaction; for a CLI, run representative commands; for documentation, inspect
the generated content and links. Static checks alone do not prove runtime behavior.
Match security, accessibility, performance, and migration checks to the change's
actual risks and requirements.

Record the tested revision or dirty patch identity, environment, commands or
steps, expected and observed results, retained evidence, and coverage gaps.
Classify each acceptance condition as passed, failed, or unverified. Do not turn
missing access, skipped checks, or stale receipts into passes.

In an implementation request, fix verified defects within scope and rerun the
affected checks. In a review-only request, report findings without editing the
product. Revisit requirements only for a real change of intent, and replan when
dependencies or design changed. Reassess evidence after any patch or base change;
rerun checks whose validity is uncertain rather than replaying every check blindly.

Report the coverage result, remaining findings, and limits. Read
[sdd-deliver](../sdd-deliver/SKILL.md) when PR delivery is authorized and supported
by current evidence. Otherwise stop at the requested verification result.
