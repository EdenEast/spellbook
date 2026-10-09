# Fix root causes

## Rule

Reproduce a failure, test explanations, and fix the cause supported by evidence.

## When to use

A bug, regression, or recurring failure needs diagnosis, especially when earlier
fixes only moved or concealed the symptom.

## How to apply

1. Reproduce the symptom on the affected system or the closest available case.
2. Trace the input, state, and ownership that produce it. Write down competing
   explanations and choose an observation that distinguishes them.
3. Inspect persistent state for restart failures. Instrument when the cause is
   unclear rather than stacking speculative fixes.
4. Fix the verified cause and inspect related instances within scope. Keep a
   regression check that detects the original failure.

For example, if a restart reuses a stale lock, test ownership and recovery
instead of suppressing the error caused by the lock.

## Boundaries

Containment can be necessary before full diagnosis. Label a mitigation as such
and state the remaining uncertainty. A boundary guard can be the correct fix
when rejecting invalid input is part of the contract. Broader related fixes
still need to fit the user's task.

## Check

Did the check fail before the fix and pass after it? Does the causal explanation
account for the observed input and state, including relevant edge cases?

## Related references

- [Prove it works](prove-it-works.md)
- [Encode lessons in structure](encode-lessons-in-structure.md)
- [Attack the premise](attack-the-premise.md)
