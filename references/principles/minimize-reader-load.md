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
2. Collapse pass-through layers that hide no meaningful decisions. Preserve
   interfaces that compress substantial complexity.
3. Prefer derived state and narrow ownership. Keep invariants with the boundary
   or module that establishes them.

## Boundaries

Fewer files or lines do not automatically improve readability. Retain domain
boundaries and abstractions that reduce what callers must know. Change state
scope only when behavior and ownership remain correct.

## Check

Can a reader locate the source, owner, and possible changes of a value without
reconstructing unrelated code?

## Related references

- [Laziness protocol](laziness-protocol.md)
- [Model the domain](model-the-domain.md)
