# Redesign from first principles

## Rule

Consider the design as if the new requirement had been present from the start,
then deliver the justified change incrementally.

## When to use

Integrating a new requirement into an existing design, especially when it strains
an abstraction or would create another special path.

## How to apply

1. Read all affected files and contracts. Sketch the shape you would choose
   from scratch with the new requirement as an original constraint.
2. Compare that shape with a local extension, accounting for migration cost,
   compatibility, and authorized scope.
3. Think through the whole redesign, then deliver the smallest coherent route
   to the justified target incrementally. Propagate the change through every
   affected reference: callers, types, documentation, examples, and rationale.

## Boundaries

The thought experiment does not authorize a rewrite. Keep a local extension when
it serves the requirement without costly recurring exceptions. Broader
migrations need appropriate scope and compatibility decisions.

## Check

Does the design absorb the requirement coherently? Is its benefit worth the
migration cost?

## Related references

- [Subtract before you add](subtract-before-you-add.md)
- [Migrate callers then delete legacy APIs](migrate-callers-then-delete-legacy-apis.md)
