# Attack the premise

## Rule

When fixes based on the same assumption repeatedly fail, test the assumption
before proposing another fix.

## When to use

Two or more attempts share a premise and fail to resolve the same observed
problem.

## How to apply

1. Write the shared premise and the failure each attempt left behind.
2. Before the next fix, choose and take an observation that could falsify the
   premise. Compare competing explanations against the evidence.
3. For skew across workers, queues, or resources, write a rerunnable census that
   counts the imbalance per actor. Identify which actors hold it, rather than
   reporting only the total. Do not start another fix before the census exists.
4. If the same actors hold most of the imbalance across runs, find what assigns
   their persistent role. Remove the asymmetry by rotating, randomizing, or
   moving the role when the evidence supports it. A return path, shared pool,
   batched hand-off, or periodic rebalance can add recurring work while leaving
   the causal assignment intact.
5. If the census is even, investigate other explanations for the skew and keep
   the census as evidence. Change the premise or design when observations
   support it.

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
