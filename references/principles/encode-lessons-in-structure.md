# Encode lessons in structure

## Rule

Enforce recurring, stable rules with mechanisms when they do not require judgment.

## When to use

The same correction or instruction recurs, or a convention keeps drifting across
callers despite documented guidance.

## How to apply

1. Identify the recurring failure and the rule that would prevent it.
2. Prefer a representation that makes the error impossible. Otherwise choose a
   compiler check, lint rule, canonical helper, runtime check, or script that
   catches it at the appropriate boundary.
3. Verify the mechanism rejects a concrete violation and accepts a valid case.
4. Replace duplicated instructions with a pointer to the authoritative mechanism.
   When judgment remains necessary, document the trigger and a failure example.

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
