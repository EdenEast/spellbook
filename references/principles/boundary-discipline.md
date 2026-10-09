# Boundary discipline

## Rule

Validate external data where it enters the system. Use the established types
internally and keep business logic in pure functions with thin adapter wiring.

## When to use

Designing parsing, validation, error handling, storage adapters, or framework
integration.

## How to apply

1. Identify trust boundaries and the module responsible for each contract.
2. Parse incoming data into domain values and handle expected boundary failures.
   Validate configuration at parse time, not repeatedly in business logic.
3. Expose domain concepts through public interfaces. Do not re-export private
   transport, storage, framework, or wire representations. Keep general-purpose
   mechanisms inside and special-purpose policy at the edge.
4. Keep business decisions in pure functions independent of the framework.
   Parsing transforms bytes into typed state, prompt construction transforms
   structured state into a string, and scoring transforms state into results.
   The adapter should call these functions with minimal wiring.
5. Propagate internal errors and reuse established invariants without redundant
   nil checks or repeated validation. Add runtime checks for facts static types
   cannot guarantee at the boundary responsible for those facts.

## Boundaries

Internal data can be stale, concurrently modified, or produced by unchecked
dependencies. Types do not prove authorization or resource liveness. Revalidate
at a genuine new trust boundary rather than scattering identical guards through
callers.

## Check

Is data crossing a trust boundary here, or is the guard repeating an established
invariant? Can the behavior be a pure function that the adapter simply calls?
Where is each invariant established?

## Related references

- [Model the domain](model-the-domain.md)
- [Type system discipline](type-system-discipline.md)
