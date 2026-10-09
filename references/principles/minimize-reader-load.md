# Minimize reader load

## Rule

Reduce the indirection and hidden state a reader must track to understand
behavior.

## When to use

Reviewing code that is hard to trace or deciding whether a layer or mutable
field earns its cost.

## How to apply

1. Trace where a value originates and what can change it. Count both layers
   crossed and state a reader must remember.
2. Collapse layers that cost more than they save: one-caller wrappers, adapters
   with no second implementation, and speculative indirection. Adjacent layers
   should change the abstraction, not repeat the same methods and arguments.
3. Demand interface compression. Preserve interfaces that hide substantial work
   or meaningful decisions; a broad interface hiding little makes the reader
   learn both the interface and its implementation.
4. Shrink state scope. Prefer pure functions and return values over mutations,
   locals over fields, fields over module state, and module state over globals.
   Derive values instead of keeping copies synchronized.
5. Name invariants at the boundary or owning module so readers learn them once.
   Before adding a layer or state, check that it reduces reader effort elsewhere
   by at least as much as it adds.

## Boundaries

Fewer files or lines do not automatically improve readability. Retain domain
boundaries and abstractions that reduce what callers must know. Change state
scope only when behavior and ownership remain correct.

## Check

Can a new reader answer where a value comes from and what can change it in under
30 seconds? Use this as a practical diagnostic: cut layers or state when tracing
is slow, while preserving boundaries that reduce what callers must understand.

## Related references

- [Laziness protocol](laziness-protocol.md)
- [Model the domain](model-the-domain.md)
