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
   premise. Make the check rerunnable and compare competing explanations against
   the evidence.
3. Look at how failures are distributed, not only how large they are. For skew
   across workers, queues, or resources, a per-actor census is the usual check
   when it distinguishes the explanations. Identify which actors hold the
   imbalance across runs. Choose another discriminating observation when a
   census cannot test the premise.
4. If the same actors hold most of the imbalance across runs, find what assigns
   their persistent role. Remove the asymmetry by rotating, randomizing, or
   moving the role when the evidence supports it. A return path, shared pool,
   batched hand-off, or periodic rebalance can add recurring work while leaving
   the causal assignment intact.
5. If evidence contradicts the premise, look for what the failures share that
   the premise did not predict. If evidence supports it, ask the next why:
   earlier fixes may have treated a consequence rather than the cause. Change
   the premise or design when observations support it.

## Boundaries

Repeated failure can also reflect a faulty check or multiple causes. An even
distribution does not by itself rule out a premise or prove it correct. Choose
the observation for the premise; a census is one tool for distribution problems.

## Check

Was the premise written down and tested before the next fix? What evidence
supports or rejects it? How does the next attempt differ from the failed ones?

## Related references

- [Fix root causes](fix-root-causes.md)
- [Build the lever](build-the-lever.md)
