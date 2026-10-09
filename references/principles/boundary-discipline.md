# Boundary discipline

## Rule

Validate external data where it enters the system and keep domain logic
independent of transport and framework wiring.

## When to use

Designing parsing, validation, error handling, storage adapters, or framework
integration.

## How to apply

1. Identify trust boundaries and the module responsible for each contract.
2. Parse incoming data into domain values and handle expected boundary failures.
3. Keep business decisions testable without recreating the framework. Keep
   adapter wiring small.
4. Reuse established invariants internally, with runtime checks for facts static
   types cannot guarantee.

## Boundaries

Internal data can be stale, concurrently modified, or produced by unchecked
dependencies. Types do not prove authorization or resource liveness. Revalidate
at a genuine new trust boundary rather than scattering identical guards through
callers.

## Check

Where is each invariant established? Can domain behavior be exercised
independently of the adapter?

## Related references

- [Model the domain](model-the-domain.md)
- [Type system discipline](type-system-discipline.md)
