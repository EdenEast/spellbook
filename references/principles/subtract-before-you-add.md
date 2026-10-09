# Subtract before you add

## Rule

Remove verified dead weight before building on an existing design.

## When to use

An addition or refactor encounters obsolete paths, redundant validation,
pass-through wrappers, or duplicated rules in the affected area.

## How to apply

1. Inventory the affected callers and contracts. Identify what is unused or
   redundant from source and observed behavior.
2. Remove what the task can safely retire. Check the retained behavior before
   extending it.
3. Add the smallest change that meets the requirement on the simpler base.

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
