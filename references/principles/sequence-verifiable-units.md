# Sequence work into verifiable units

## Rule

Order dependent work so each meaningful increment ends in a checkable state.

## When to use

Planning a migration, sweep, series of changes, or delivery with dependent
stages.

## How to apply

1. Establish the relevant baseline and name the check for each unit.
2. Order units by dependencies and uncertainty. Capture a failure before its fix
   or a baseline before the change being measured.
3. Check each meaningful unit before building on it. Size units so checks
   localize failures without making progress needlessly expensive.
4. When commits or PRs are in scope, organize them so a reviewer can follow the
   same argument and each delivered unit meets repository requirements.

## Boundaries

A unit may include tightly coupled edits. This does not require running the full
suite after every line or creating failing commits. Automatic rebases, commits,
and PR creation are not implied. Planned isolated breakage needs the boundaries
in [Outcome-oriented execution](outcome-oriented-execution.md).

## Check

Can a failed check identify the responsible unit? Do delivered units establish
the result without later unpublished changes?

## Related references

- [Prove it works](prove-it-works.md)
- [Outcome-oriented execution](outcome-oriented-execution.md)
