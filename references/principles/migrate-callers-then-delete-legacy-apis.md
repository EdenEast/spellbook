# Migrate callers then delete legacy APIs

## Rule

When compatibility permits, migrate internal callers and retire the old API in
the same coordinated change.

## When to use

A replacement API is agreed and affected callers can move together.

## How to apply

1. Inventory callers, including tests, generated code, configuration, examples,
   and references in prose.
2. Move callers to the new contract in verifiable units. Internal callers still
   using the old API are work to migrate, not a reason to keep both paths.
3. Remove the old implementation and checks that only preserve obsolete internals.
   Update behavioral tests for the new contract and verify no required callers
   remain. Delete the old API in the same refactor wave.

## Boundaries

External consumers, independently deployed services, and staged rollouts may
require a compatibility period. Temporary adapters are exceptional and
time-boxed. Give each an owner, a removal deadline or rollout milestone, and
retirement criteria. Keep compatibility required by the agreed contract.

## Check

Do consumers use the intended contract? Can the old path be removed without
breaking required compatibility?

## Related references

- [Subtract before you add](subtract-before-you-add.md)
- [Sequence work into verifiable units](sequence-verifiable-units.md)
