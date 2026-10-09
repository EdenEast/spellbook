# Separate before serializing shared state

## Rule

Eliminate unnecessary shared write targets before introducing coordination.

## When to use

Concurrent actors may write the same file, branch, key, or mutable object.

## How to apply

1. Identify writers, ownership, and the invariant that supposedly needs sharing.
2. If actors publish independent facts, give each an owned target and combine
   results at the read or reporting boundary.
3. For necessary sharing, enforce coordination through a transaction, single
   writer, lock, or compare-and-swap mechanism suited to the system.
4. Exercise competing writes and interruption recovery for the chosen design.

## Boundaries

Separation is not always cheaper or correct; real shared invariants require
coordination. Distinct fields in one rewritten file still share a write target.
This applies to ordinary software concurrency and does not require spawning
agents.

## Check

Can concurrent actors overwrite each other? What mechanism preserves shared
invariants without depending on instructions alone?

## Related references

- [Make operations idempotent](make-operations-idempotent.md)
- [Model the domain](model-the-domain.md)
