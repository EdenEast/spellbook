# Foundational thinking

## Rule

Choose the data shape and establish prerequisites that make later work easier.

## When to use

Planning dependent phases, shared types, or infrastructure used by later steps.

## How to apply

1. Identify invariants and access patterns using [Model the domain](model-the-domain.md).
2. Order dependencies before consumers. Establish a verification path before a
   risky migration or fix.
3. Build the minimum prerequisite for the next useful increment. Keep each
   increment coherent and checkable.

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
