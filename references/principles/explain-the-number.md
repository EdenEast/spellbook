# Explain the number

## Rule

Establish what a measurement means before reporting it as evidence of
improvement or regression.

## When to use

Trusting, reporting, or acting on a measured performance or evaluation result.

## How to apply

1. Write the claim, workload, metric, baseline, and success criteria before
   measuring. Read the measurement script to establish what it times, counts,
   and ignores. Check machine load and available resources.
2. Confirm intended work ran inside the timed region and produced correct
   results. Count errors, non-success responses, retries, skipped work, and
   cache hits. Unconsumed generators, unawaited promises, and discarded results
   can measure work that never happened.
3. For performance, ask why the number is not twice as good. Identify the
   resource or code path that limits it using profiles or counters from a
   separate diagnostic run, then map the bottleneck to source. Inspect the load
   generator too. Reading code and guessing is not limiter evidence.
4. Tune both sides comparably: production builds and settings, matching versions
   and data, and realistic batching, pools, and cache conditions. If one side is
   untuned, tune and remeasure before choosing a winner.
5. Check physical limits and the changed component's share of total time. A
   change removing 10% of a run cannot save more than 10% of its elapsed time.
   Measure the end-to-end path alongside microbenchmarks, with realistic data
   sizes and concurrency.
6. Run each performance side at least five times, alternating sides to reduce
   warmup and drift bias. Report the median and range. Treat a gap smaller than
   run-to-run variation as no measurable difference; use statistical analysis
   when a close decision requires it.
7. For evaluations, confirm each trial did the task, check consistent scoring
   and scenario relevance, and compare variation across trials and models when
   the claim spans models.
8. Keep run count, spread, conditions, and limiter evidence with the number in
   notes or a linked artifact. State whether the result is faster, slower, has
   no measurable difference, or is inconclusive.

## Boundaries

For an explicitly requested ballpark, one run can suffice if you verify errors
and actual work and label it as one run. Choosing between options needs the full
comparison. Call performance comparisons inconclusive when a limiter is unknown,
a side is untuned, or errors and actual work cannot be checked. Resource limiters
apply to performance, not every metric. The procedure above incorporates the
needed benchmark guidance without requiring pstack's companion skill.

## Check

Could errors, omitted work, different conditions, or noise explain the gap?
Where are the run count, spread, and observed limiter? Does the claimed time
saved exceed the time the changed component took?

## Related references

- [Prove it works](prove-it-works.md)
- [Build the lever](build-the-lever.md)
