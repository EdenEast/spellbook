# Prove it works

## Rule

Support a completion claim with direct evidence of the output or behavior claimed.

## When to use

Before reporting a change, task, diagnosis, or generated artifact as successful.

## How to apply

1. State the observable result that would satisfy the task.
2. Choose a check that observes that result. Run a feature to establish runtime
   behavior, inspect the generated file to establish its contents, or evaluate
   configuration to establish the resulting resource mapping.
3. Use existing repeatable checks where they fit. Report what you observed and
   the limits of the check.
4. If the result fails, investigate the check and system before claiming success.

For example, type checking an installer establishes static consistency. Installing
into a temporary home and reading its links establishes installation behavior.

## Boundaries

Match verification to the claim and risk. Static inspection can establish a
small document edit; it cannot establish live application behavior. Respect
access and authorization boundaries. When a required environment is unavailable,
report the gap and the evidence you do have.

## Check

Could the claimed result still be false even if your check passed? If so, narrow
the claim or check the missing behavior directly.

## Related references

- [Test behavior, not implementation](test-behavior-not-implementation.md)
- [Build the lever](build-the-lever.md)
- [Sequence work into verifiable units](sequence-verifiable-units.md)
- [Explain the number](explain-the-number.md)
