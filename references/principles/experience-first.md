# Experience first

## Rule

Choose the result for the people who use and maintain the work, accounting for
implementation cost.

## When to use

Product scope, interface design, or implementation convenience competes with
usability.

## How to apply

1. Identify the consumer and central task: an end user, API caller, operator,
   or future maintainer.
2. Compare observable outcomes, including feedback, error recovery,
   accessibility, and maintenance effort.
3. Prefer a smaller complete experience when extra features dilute the core task.
   Prototype uncertain interactions before costly implementation.

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
