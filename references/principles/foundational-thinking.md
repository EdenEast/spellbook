# Foundational thinking

## Rule

Choose structures that preserve future design choices, keep local code simple,
and establish prerequisites before their consumers.

## When to use

Before writing logic, choosing core types, planning dependent phases, or deciding
what concurrent actors share.

## How to apply

1. Remove dead code before laying foundations. Identify invariants, define core
   types early, and trace access patterns using [Model the domain](model-the-domain.md).
2. Consolidate types and data models without abstracting every repeated line.
   Three similar statements can be simpler than a premature abstraction.
   Prefer explicit code and test behavior and edge cases.
3. Before sharing state, ask what another actor's concurrent modification would
   change. Isolate actors when sharing is unnecessary.
4. Order prerequisites before consumers: setup before features, regression
   checks before fixes. Establish CI, linting, tests, or shared types first when
   every later phase benefits from them.
5. Build the minimum prerequisite for the next useful increment. Each increment
   should establish or deepen a coherent abstraction, rather than spread a
   capability across callers as special-case coordination. Keep commits small
   and single-purpose when commits are in scope.

## Boundaries

A foundation needs a concrete consumer. Avoid speculative infrastructure and
unnecessary setup for local changes. Isolate concurrent writers using [Separate
before serializing shared state](separate-before-serializing-shared-state.md).

## Check

Which later step benefits from each prerequisite? Can the next increment use and
verify it?

## Related references

- [Model the domain](model-the-domain.md)
- [Sequence work into verifiable units](sequence-verifiable-units.md)
