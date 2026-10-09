# Encode lessons in structure

## Rule

Enforce recurring, stable rules with mechanisms when they do not require judgment.

## When to use

The same correction or instruction recurs, or a convention keeps drifting across
callers despite documented guidance.

## How to apply

1. Capture each error, human correction, and unexpected outcome. Decide whether
   it is a one-off or a recurring failure, and identify the rule that would
   prevent the pattern.
2. Prefer a representation that makes the error impossible. Otherwise choose a
   compiler check, lint rule, canonical helper, runtime check, or script that
   catches it at the appropriate boundary.
3. Verify the mechanism rejects a concrete violation and accepts a valid case.
4. Delete redundant instructions once the structural fix enforces the rule.
   Keep a loading pointer only when needed to find the mechanism. When judgment
   remains necessary, make the instruction prominent and add a failure example.
5. Route a one-off to a task note, a recurring correction to a skill or check,
   and a systemic issue to a principle. Apply the fix within scope or record a
   concrete follow-up. Acknowledgment without recording, recording without
   action, and fixing one instance while leaving the pattern do not close the loop.

For example, derive generated types from an authoritative schema instead of
repeatedly reminding authors to synchronize duplicate definitions.

## Boundaries

A single correction need not become a global rule. Avoid enforcing a preference
whose exceptions are central to its usefulness. Mechanisms and broad convention
changes must fit the task; record a concrete follow-up when they do not.

## Check

Does the recurring mistake now fail at the right boundary without relying on a
reader remembering the instruction? Is the rule maintained in one place?

## Related references

- [Model the domain](model-the-domain.md)
- [Build the lever](build-the-lever.md)
- [Type system discipline](type-system-discipline.md)
