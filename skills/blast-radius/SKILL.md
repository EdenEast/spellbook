---
name: blast-radius
description: Find what a change could break beyond its diff and verify the conditions its safety depends on.
disable-model-invocation: true
---

# Blast radius

Use when asked what a change could break, to review its blast radius, or to check
a small diff with potentially wider effects. Follow the change beyond direct
callers into configuration, runtime behavior, and external consumers.

## Inspect the change and its boundaries

Read the diff and relevant source history using available Git or PR tools.
Identify changed behavior, not just edited symbols. Inspect the pinned version
and local patches of relevant dependencies. Trace contracts a symbol search can
miss: serialized values, database columns, wire formats, feature flags, lifecycle
timing, generated files, and consumers in other languages or services.

For infrastructure, include service units, ports, identities, secret recipients,
storage permissions, and generated configuration where the change touches them.
Read other repositories or hosts when the user has included them in scope. If a
necessary consumer is inaccessible, record the gap instead of inventing it.

The related `how` and `why` skills can help when installed and appropriate, but
are optional. Direct source and history inspection is sufficient. Multi-agent
review is optional and requires available, authorized delegation; no model
routing file or `arena` skill is required.

## Identify and prove the safety conditions

Find the few facts that decide whether the change is safe. Often there is one;
sometimes several independent conditions matter. For each, state the failure
if it is false and choose the strongest proportionate evidence:

1. A claim without supporting evidence remains unproven.
2. Source or configuration establishes the intended behavior at a cited location.
3. A traced failure path shows why a specific bad case can or cannot happen.
4. A bounded script, existing test, or configuration evaluation exercises the
   relevant real behavior and reports a result.
5. A check in the running system establishes that behavior in that environment.

Name what each check proves and where it stops. Configuration evaluation and a
successful build do not prove activation, connectivity, decryption, or recovery.
Use the repo's existing verification tools where possible. Exercise the specific
condition, not merely a command that exits successfully.

On live infrastructure, prefer bounded read-only checks. Run mutations,
deployments, stress tests, and failure injection only within the user's existing
authorization and an appropriate environment. Review alone does not authorize
deployment. If executing the necessary check is outside scope, describe it and
mark the condition unproven; continue the rest of the review.

## Report the result

Lead with what changed and the material risk. Include:

- The safety conditions, supporting source locations, checks performed, and
  observed results. Label assumptions and unproven conditions explicitly.
- Confirmed risks: how the failure occurs, who or what it affects, likely cost,
  and the cheapest useful check. Describe likelihood from evidence rather than
  inventing percentages.
- Risks checked and cleared, with the evidence that cleared them.
- Any remaining verification needed before shipping.

Load `unslop` for the wording, or read [../unslop/SKILL.md](../unslop/SKILL.md)
when the harness has no skill invocation tool. Cite real code or configuration
and redact private information before sharing evidence.
