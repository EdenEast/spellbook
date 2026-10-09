# Explain the number

## Rule

Establish what a measurement means before reporting it as evidence of
improvement or regression.

## When to use

Trusting, reporting, or acting on a measured performance or evaluation result.

## How to apply

1. Define the workload, metric, baseline, and success criteria. Confirm runs
   performed intended work and record errors or skipped work.
2. Repeat measurements enough to assess noise. Record run count, spread,
   conditions, and relevant tuning differences.
3. For performance, use profiles or counters to identify what limits the result.
   Check caching, the load generator, and other possible bottlenecks.
4. For evaluations, check scenario relevance, consistent scoring, and variation
   across trials. Compare like workloads and preserve reproducible evidence.

## Boundaries

An unexplained result can be reported as a limited observation. Avoid causal or
general speedup claims until evidence supports them. Resource limiters apply to
performance, not every metric. No external benchmark skill is required.

## Check

Could errors, omitted work, different conditions, or noise explain the gap? Is
the claimed gain plausible given the work changed?

## Related references

- [Prove it works](prove-it-works.md)
- [Build the lever](build-the-lever.md)
