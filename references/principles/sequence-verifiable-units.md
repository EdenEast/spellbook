# Sequence work into verifiable units

## Rule

Order work into small verifiable units and do not advance until the current
unit's check passes.

## When to use

Planning a migration, sweep, series of changes, or delivery with dependent
stages.

## How to apply

1. Establish a clean, relevant baseline and name the check for each unit. When
   branch maintenance is in scope, rebase onto current trunk before measuring
   changes. Preserve existing work and follow repository rebase policy.
2. Order units by dependencies and uncertainty. Capture a failure before its fix
   or a baseline before the change being measured.
3. In a sweep, bracket each change with a known-good state and a passing check
   before starting the next. Run per-unit checks even when a tool makes them
   cheap. Size units to localize failures; tightly coupled edits can be one unit.
4. When commits or PRs are in scope, order them so a reviewer can replay the
   proof: a regression test before its fix, subtraction before reshaping, a
   baseline before treatment, or setup before a feature. Keep delivered units
   independently reviewable and consistent with repository requirements.

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
