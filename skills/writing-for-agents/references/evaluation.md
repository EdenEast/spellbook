# Evaluate agent-facing guidance

Use this reference for substantial behavioral changes, inconsistent application,
or constraints whose compliance matters. Choose evidence that can reveal the
failure the guidance is meant to address.

## Match validation to the change

| Change | Useful validation |
| --- | --- |
| Typo, link repair, or equivalent wording | Inspect the edit and relevant structure or links |
| Discovery or loading trigger | Applicable and nearby inapplicable requests; observe selection and reading |
| New workflow or substantial behavior | Realistic application, variation, and missing-information scenarios |
| Reference organization | Retrieval and application of the needed fact, including a conditional branch |
| Rule skipped under pressure | Realistic scenarios with relevant competing incentives |
| Supporting script | Execute representative inputs and relevant failure cases |

Define observable success before evaluating. For example, a deployment reference
is successfully disclosed if the agent reads it for deployment work and can
apply its required checks; merely mentioning the filename is insufficient.

## Compare behavior

1. Select representative requests and the minimum raw artifacts needed to do
   the work. Include a boundary case where the guidance should not apply.
2. For a new behavioral rule, observe work without it when practical. Record
   the specific failure or missing context. Existing traces can inform scenario
   selection, but label them separately from a controlled baseline.
3. Run the same task with the guidance under comparable conditions. Inspect
   the actual result, reading path, and verification evidence.
4. Classify any failure: discovery, retrieval, interpretation, omission,
   execution, or compliance. Change the relevant pointer, structure, or rule.
5. Recheck the changed behavior and affected boundaries. Preserve a record of
   the request, artifacts, expected behavior, observed result, and limitations.

Keep contexts independent when comparing variants. An agent that has already
seen the intended answer cannot provide an uncontaminated baseline. For subtle
wording effects, use repeated runs and inspect flagged results manually;
keyword counts can mistake quoted examples for actual behavior.

Evaluate consistency of the intended decisions, allowing legitimate variation
in outputs. A reference should be retrieved and applied correctly; a writing
workflow need not produce identical prose in every run.

## Pressure and failure-specific corrections

For a demonstrated compliance failure, introduce relevant pressures such as a
deadline or sunk effort. Observe whether the agent preserves the rule and
describe the permitted recovery. Add counters to demonstrated rationalizations
only where they improve compliance; avoid accumulating hypothetical loopholes.

For wrong-shaped output, try a positive recipe. For a missing required element,
try a structural slot. For incorrect branching, make the condition observable.
Increasing emphasis or adding prohibitions is not a universal remedy.

## Boundaries and reporting

Use evaluation tools available and authorized in the current environment.
Independent agent evaluation can add confidence when delegation is permitted;
otherwise use an available isolated evaluation mechanism or report the gap.
Keep generated artifacts in a temporary workspace and side effects within the
authorized scope. Source checklists do not authorize additional agents or live
external actions.

Report structural checks, manual walkthroughs, and executed behavioral trials
separately. A walkthrough can reveal an unclear branch but does not prove model
compliance. Name tested models or harnesses when relevant and limit support
claims to the evidence. A failing test first is useful evidence for behavioral
changes, not a mandatory ritual for every documentation edit.
