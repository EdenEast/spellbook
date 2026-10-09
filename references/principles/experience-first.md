# Experience first

## Rule

When implementation convenience conflicts with the consumer's experience,
prefer the experience within the agreed constraints.

## When to use

Product scope, interface design, or implementation convenience competes with
usability.

## How to apply

1. Identify the consumer and central task: an end user, API caller, operator,
   or future maintainer.
2. Justify every feature, control, and option by how it serves the central task.
   Prefer fewer polished features over a larger rough experience.
3. Prototype uncertain interactions before committing to production code.
   Compare outcomes from the consumer's perspective, including accessibility,
   error recovery, and maintenance effort.
4. Get the details right: transitions, alignment, spacing, feedback, and error
   states. Every feature should support the central workflow or get out of its way.
5. Give future maintainers and API callers the same consideration as end users.
   Foundations determine the sequence of work; the experience determines its
   target.

## Boundaries

The user owns product direction. Work within agreed scope, constraints, and
release goals. Polish should not displace correctness, accessibility, or
essential capabilities.

## Check

Can the consumer complete the central task and understand success or failure?
What tradeoff improved that result?

## Related references

- [Exhaust the design space](exhaust-the-design-space.md)
- [Minimize reader load](minimize-reader-load.md)
