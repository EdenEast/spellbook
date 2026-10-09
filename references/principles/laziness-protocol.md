# Laziness protocol

## Rule

Get the required result with the least lasting code and complexity.

## When to use

Sizing a change, considering an abstraction, or threading a signal through
several layers.

## How to apply

1. Look for deletion, an existing capability, or a direct path before adding code.
2. Consolidate repeated decisions at their owner. Keep explicit local statements
   when abstracting them would add more indirection than it removes.
3. Compare maintenance cost, including hidden state, interfaces, and the files
   a reader must trace.

## Boundaries

Optimize for correct behavior and maintenance effort, not line count alone. A
larger change can remove a recurring coordination cost. Preserve meaningful
boundaries even when they require more files.

## Check

Why is the chosen change simpler to operate and maintain than the alternatives?

## Related references

- [Subtract before you add](subtract-before-you-add.md)
- [Minimize reader load](minimize-reader-load.md)
