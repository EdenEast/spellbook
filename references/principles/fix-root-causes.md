# Fix root causes

## Rule

Reproduce a failure, test explanations, and fix the cause supported by evidence.

## When to use

A bug, regression, or recurring failure needs diagnosis, especially when earlier
fixes only moved or concealed the symptom.

## How to apply

1. Reproduce the symptom on the affected system or the closest available case.
2. Ask why until the explanation reaches the cause. Trace the input, state, and
   ownership that produce it. Write down competing explanations and choose an
   observation that distinguishes them. The cause is the first incorrect decision
   or failure to handle a state the system must support, not a consequence of
   an earlier fault.
3. For restart failures, suspect persistent state before code: configuration,
   caches, lock files, and serialized state. If clearing state restores behavior,
   investigate validation and recovery. Instrument when the cause is unclear.
4. Ask whether the triggering state is legitimate. If the system must support
   it, handling it where the code fails can be the fix. If it violates an
   established invariant, trace what produced it rather than hiding the fault
   with a guard, retry, swallowed error, clamped value, or discarded state.
   A workaround needing a long justification is a reason to revisit the design.
5. Search for the pattern and fix related instances within scope. Keep a
   regression check that detects the original failure.
6. If the deciding fact took a deep investigation to find, propose a cheap,
   always-on signal that would have exposed it earlier, such as a counter,
   status field, or structured diagnostic. Implement it only within task scope
   and operating constraints; otherwise record a concrete follow-up.

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
