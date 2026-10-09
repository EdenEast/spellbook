# Laziness protocol

## Rule

Get the required result with the least lasting code and complexity.

## When to use

Refactoring, evaluating diff size, considering an abstraction, or threading a
signal through several layers.

## How to apply

1. Prefer deletion. Look for removals and existing capabilities before additions.
2. Maintain a flat call hierarchy. If answering a question requires tracing
   through more than three files or layers, flatten the chain. An interface that
   hides substantial work earns its boundary.
3. Consolidate decisions at one source of truth. Pass the result as a simple
   flag or value instead of repeating the choice in several places.
4. Minimize the diff. Make the smallest change that solves the problem. Avoid
   boilerplate added only to make the design look elegant.
5. Question signal threading. Before passing a new signal through types,
   schemas, pipelines, or other layers, stop and look for a more direct path.
6. Remove small pass-throughs, representation leaks, and duplicated choices
   before they spread into recurring coordination costs.

## Boundaries

Optimize for correct behavior and maintenance effort, not line count alone. A
larger change can remove a recurring coordination cost. Preserve meaningful
boundaries even when they require more files.

## Check

Is this the smallest change that solves the problem? Would a developer find the
result exhausting to maintain? Can a reader answer a question without tracing a
deep call chain?

## Related references

- [Subtract before you add](subtract-before-you-add.md)
- [Minimize reader load](minimize-reader-load.md)
