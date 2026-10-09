# Type system discipline

## Rule

Use types to rule out invalid combinations and require callers to handle
meaningful cases.

## When to use

Designing types, function signatures, or variant handling in a typed language.

## How to apply

1. Represent mutually exclusive states with variants. Choose constructions that
   preserve invariants, such as a head plus a tail for a non-empty sequence.
2. Distinguish semantic identifiers when accidental interchange is plausible.
3. Parse external data at boundaries. Narrow or validate rather than asserting
   an unproved fact to the compiler.
4. Make variant handling exhaustive and derive types from authoritative schemas.
5. Strengthen types where operations otherwise have unhandled cases. Keep
   simple types for operations that already handle every valid input.

## Boundaries

Types do not replace runtime validation of external data or dynamic invariants.
Brands and elaborate types should prevent concrete mistakes, not add precision
without benefit. Isolate unavoidable unsafe assumptions and state their
justification.

## Check

Can contradictory states be constructed? Will adding a variant expose unhandled
cases? Which defect does each stronger type prevent?

## Related references

- [Boundary discipline](boundary-discipline.md)
- [Encode lessons in structure](encode-lessons-in-structure.md)
