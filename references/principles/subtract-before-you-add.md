# Subtract before you add

## Rule

Remove verified dead weight before building on an existing design.

## When to use

Sequencing an addition, refactor, or rewrite, especially where the affected area
contains obsolete paths, redundant validation, pass-through wrappers, or
duplicated rules.

## How to apply

1. Inventory the affected callers and contracts. Identify what is unused or
   redundant from source and observed behavior.
2. Remove what the task can safely retire before construction or polishing.
   Check the retained behavior before extending it.
3. Design for observed usage. Do not add speculative validators, parsers, or
   guards beyond the required contract.
4. Simplify prompts by removing redundant instructions and excessive templates.
   Delete references with no novel content instead of retaining empty stubs;
   update their callers and loading pointers.
5. Add the smallest change that meets the requirement on the simpler base.
   Leave the design simpler and more capable with the same or fewer interfaces.

For example, migrate the callers of an obsolete adapter and remove it before
adding another adapter to the same chain.

## Boundaries

Keep compatibility required by external users or a staged rollout. Limit
cleanup to the authorized task. A small local change can be the best choice
when removal needs a separate migration.

## Check

Can you identify the removed complexity and show that required behavior still
works? An abstraction that only relocates the same branches is not subtraction.

## Related references

- [Model the domain](model-the-domain.md)
- [Prove it works](prove-it-works.md)
- [Laziness protocol](laziness-protocol.md)
- [Migrate callers then delete legacy APIs](migrate-callers-then-delete-legacy-apis.md)
