# Type system discipline

## Rule

Use types to rule out invalid combinations and require callers to handle
meaningful cases.

## When to use

Designing types, function signatures, or variant handling in a typed language.

## How to apply

1. Represent mutually exclusive states with variants, not contradictory bags
   of optional fields. Derive a completion flag from its timestamp or use open
   and completed variants when completion requires a timestamp.
2. Construct valid values instead of restricting a loose representation with
   checks. Use a head plus a tail for a non-empty sequence, a start plus a
   duration for an ordered time range, or pairs for an even-length collection.
3. Brand semantic identifiers such as `UserId` and `OrderId` when accidental
   interchange is plausible. Validate at construction and use the type downstream.
4. Treat RPC, JSON, IPC, CLI, configuration, environment, and database input as
   untyped until parsed. Narrow, validate, or refine the model rather than use
   casts or assertions to tell the compiler an unproved fact.
5. Make the compiler reject unhandled variants when a new case is added. Derive
   types from authoritative protocol, API, database, or design-system schemas.
6. Strengthen types where operations otherwise have unhandled cases or can
   panic. Prefer total functions: a sum can accept an empty list and return zero;
   taking its head needs a non-empty list. Stop strengthening once every valid
   input is handled.

## Boundaries

Types do not replace runtime validation of external data or dynamic invariants.
Brands and elaborate types should prevent concrete mistakes, not add precision
without benefit. Isolate unavoidable unsafe assumptions and state their
justification.

## Check

Can contradictory states be constructed? Do same-typed arguments mean different
things? Where did each `any`, cast, or non-null assertion originate? Will adding
a variant expose unhandled cases at compile time? Is a type duplicating a schema
another file owns? Which defect does each stronger type prevent?

## Related references

- [Boundary discipline](boundary-discipline.md)
- [Encode lessons in structure](encode-lessons-in-structure.md)
