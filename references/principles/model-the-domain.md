# Model the domain

## Rule

Encode domain rules in a structure that makes valid states and ownership clear.

## When to use

Stateful logic admits contradictory field combinations, repeats the same rule
across callers, or adds branches to represent each new case.

## How to apply

1. Name the states, invariants, and access patterns before writing logic.
2. Choose the simplest structure that represents them. Consider state machines
   for lifecycle transitions; typed objects for repeated shape assumptions;
   maps, registries, tables, or discriminated unions for branching; reducers or
   command/event models for mutations; and queues, caches, indexes, graphs,
   trees, or normalized collections for the access pattern.
3. Parse untrusted input at the boundary. Let internal code use the validated
   model, with runtime checks where the language or dependencies leave gaps.
4. Organize modules around a body of domain knowledge and its invariants.
   Execution order is not ownership: modules named load, validate, transform,
   and save can scatter the same domain rule across phases.
5. Watch for a feature extending an if/else chain, a second boolean that must
   stay synchronized, or phase-named modules repeating the same rules. Encode
   the shared assumption in the model when that removes the coordination.

For example, use `{ kind: 'pending' } | { kind: 'done'; result: Result }` when
completion requires a result, rather than a boolean and an optional result.

## Boundaries

Keep clear, local code when a new abstraction would only add indirection.
Static types do not validate external data or guarantee freshness, permissions,
or concurrency invariants. Model only distinctions the task needs.

## Check

Does the structure remove invalid states, repeated decisions, or ambiguous
ownership? Can a reader identify where each invariant is established?

## Related references

- [Subtract before you add](subtract-before-you-add.md)
- [Make operations idempotent](make-operations-idempotent.md)
- [Boundary discipline](boundary-discipline.md)
- [Type system discipline](type-system-discipline.md)
