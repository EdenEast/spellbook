# Attack the premise

## Rule

When fixes based on the same assumption repeatedly fail, test the assumption
before proposing another fix.

## When to use

Two or more attempts share a premise and fail to resolve the same observed
problem.

## How to apply

1. Write the shared premise and the failure each attempt left behind.
2. Choose an observation that could falsify the premise. Compare competing
   explanations against the evidence.
3. For skew across workers, queues, or resources, measure distribution per actor
   and investigate what assigns persistent roles or load.
4. Change the premise or design when the observation supports it.

## Boundaries

Repeated failure can also reflect a faulty check or multiple causes. An even
distribution does not prove an assumption correct. Use a census for distribution
problems; other problems need different discriminating observations.

## Check

What evidence supports or rejects the assumption? How does the next attempt
differ from the failed ones?

## Related references

- [Fix root causes](fix-root-causes.md)
- [Build the lever](build-the-lever.md)
