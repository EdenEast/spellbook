# Make operations idempotent

## Rule

Make retries reconcile partial progress toward the same intended end state.

## When to use

Commands, startup routines, installers, or processing loops can run twice,
restart after failure, or encounter resources created by a prior attempt.

## How to apply

1. Define the intended end state and how to recognize resources this operation
   owns.
2. Inspect existing state before changing it. Reuse valid owned resources and
   repair or remove stale owned resources within the authorized scope.
3. Use atomic updates, transactions, or idempotency keys when a repeated write
   could duplicate an effect. Account for concurrent attempts when possible.
4. Verify both a second run and recovery from meaningful interruption points.

For example, an installer should recognize its own links, preserve unrelated
files, and converge after a source resource is removed.

## Boundaries

Payments, messages, and other external effects may require explicit deduplication
support. Reconciliation is not permission to delete unfamiliar state. When safe
recovery cannot be guaranteed, stop at a clear conflict rather than guessing.

## Check

Do a repeated run and a resumed partial run reach the intended state while
preserving unrelated resources?

## Related references

- [Model the domain](model-the-domain.md)
- [Test behavior, not implementation](test-behavior-not-implementation.md)
- [Separate before serializing shared state](separate-before-serializing-shared-state.md)
