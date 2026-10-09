# Outcome-oriented execution

## Rule

Converge a planned migration on its verified target without preserving
unnecessary transitional designs.

## When to use

A scoped rewrite or migration has an agreed target and explicit phase
boundaries.

## How to apply

1. State the target behavior, compatibility obligations, and verification gates.
2. Identify necessary transitional code and how it will be removed. Avoid
   creating a second permanent implementation by accident.
3. Allow intermediate breakage only in an isolated, authorized work area with
   a recovery path and a declared verification boundary.
4. Restore required checks before handing off or publishing completed work.

## Boundaries

This does not authorize broken shared branches, deployed services, or changes to
release policy. Keep intermediate states working when independently delivered or
consumed. Respect repository requirements for commits and CI.

## Check

Does the result reach the target, pass required checks, and retire transitional
code no longer needed?

## Related references

- [Sequence work into verifiable units](sequence-verifiable-units.md)
- [Migrate callers then delete legacy APIs](migrate-callers-then-delete-legacy-apis.md)
