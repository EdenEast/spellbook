---
name: diagnosing-bugs
description: Diagnose bugs, performance regressions, and infrastructure failures with reproducible checks and falsifiable hypotheses. Use when behavior is broken, failing, or unexpectedly slow.
---

# Diagnosing Bugs

A discipline for hard bugs. Skip phases only when explicitly justified.

When exploring the codebase, read `GLOSSARY.md` (if it exists) to get a clear mental model of the relevant modules, and check ADRs in the area you're touching.

## Establish the environment

Before probing a failure, identify the executing host and user, working directory,
shell, and available runtimes. Check whether the failing process lives on this
host, another host, or inside a container. Confirm the endpoint, port, and
authentication method; a Tailscale SSH endpoint may differ from native SSH/SFTP.
Use local commands when already on the target host.

On NixOS, prefer the project's dev shell or declared tooling. Check availability
before choosing Python, Node, or browser automation. For browser work, use the
harness's attached browser tools when available. For headless or mobile work,
choose CLI/log evidence and human observations appropriate to the actual access.

For deployments, record which stage failed: evaluation, build, transfer,
activation, or live behavior. A successful build does not prove activation,
secret decryption, service health, or the user's end-to-end outcome.

## Redact

This skill has you show commands, outputs and captured artifacts. **Redact every secret first**: write `<REDACTED>` in its place. Build loops against env vars, so the credential stays in the environment rather than in what you show. Captured artifacts carry auth headers: quote only the lines that carry the signal.

If the redacted output is not enough to diagnose the bug, say so and ask the user.

## Phase 1: Build a feedback loop

**This is the skill.** Everything else is mechanical. If you have a **tight** pass/fail signal for the bug (one that goes red on _this_ bug), you will find the cause; bisection, hypothesis-testing, and instrumentation all just consume it. If you don't have one, no amount of staring at code will save you.

Spend disproportionate effort here. **Be aggressive. Be creative. Refuse to give up.**

### Ways to construct one, in roughly this order

1. **Failing test** at whatever seam reaches the bug: unit, integration, e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Browser automation** through the harness's browser tools or an existing project harness that drives the UI and checks DOM/console/network.
5. **Replay a captured trace.** Save a real network request / payload / event log to disk; replay it through the code path in isolation.
6. **Throwaway harness.** Spin up a minimal subset of the system (one service, mocked deps) that exercises the bug code path with a single function call.
7. **Property / fuzz loop.** If the bug is "sometimes wrong output", run 1000 random inputs and look for the failure mode.
8. **Bisection harness.** If the bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" so you can `git bisect run` it.
9. **Differential loop.** Run the same input through old-version vs new-version (or two configs) and diff outputs.
10. **Human observations.** When the agent cannot drive the failing environment, give the user one concrete action and name the result to capture. Use [scripts/hitl-loop.template.sh](scripts/hitl-loop.template.sh) only when they can interact with its terminal prompts; chat observations work for mobile or headless sessions too. Capture observations, never credentials.

Build the right feedback loop, and the bug is 90% fixed.

### Tighten the loop

Treat the loop as a product. Once you have _a_ loop, **tighten** it:

- Can I make it faster? (Cache setup, skip unrelated init, narrow the test scope.)
- Can I make the signal sharper? (Assert on the specific symptom, not "didn't crash".)
- Can I make it more deterministic? (Pin time, seed RNG, isolate filesystem, freeze network.)

A 30-second flaky loop is barely better than no loop; a 2-second deterministic one is tight, a debugging superpower.

### Non-deterministic bugs

The goal is a higher reproduction rate. In an isolated test environment, repeat
the trigger with a bounded run count, pin inputs, or narrow timing windows. On
live infrastructure, prefer bounded read-only probes; stress, fault injection,
service restarts, and repeated mutations must fit the user's authorized scope.
Record the attempt count and failure rate so a run without failures is not
mistaken for proof that an intermittent bug is fixed.

### When you genuinely cannot build a loop

State what prevents reproduction and what you tried. Continue read-only evidence
gathering from logs, configuration, or supplied observations, and mark hypotheses
as unverified. Ask for the missing access or observation only when needed.
Do not claim a diagnosis or fix is verified without an appropriate check. Add
production instrumentation only within the user's authorization.

### Completion criterion: a tight loop that goes red

Phase 1 is done when the loop is **tight** and **red-capable**: you can name **one command** (a script path, a test invocation, a curl) that you have **already run at least once** (show the invocation and its output, redacted), and that is:

- [ ] **Red-capable**: it drives the actual bug code path and asserts the **user's exact symptom**, so it can go red on this bug and green once fixed. Not "runs without erroring"; it must be able to _catch this specific bug_.
- [ ] **Repeatable**: same verdict every run, or a measured failure rate for intermittent bugs.
- [ ] **Bounded**: cheap enough to repeat, with an explicit timeout or run limit when needed. Boot/build/backup checks may take minutes.
- [ ] **Runnable with current access**: unattended where possible; otherwise a concrete human action and recorded result.

Prefer a symptom-specific check before theorising. Reading code or configuration
to construct that check is useful. If current access prevents reproduction,
use the evidence-only path above and keep that limitation visible.

## Phase 2: Reproduce + minimise

Run the loop. Watch it go red as the bug appears.

Confirm:

- [ ] The loop produces the failure mode the **user** described, not a different failure that happens to be nearby. Wrong bug = wrong fix.
- [ ] The failure is reproducible across multiple runs (or, for non-deterministic bugs, reproducible at a high enough rate to debug against).
- [ ] You have captured the exact symptom (error message, wrong output, slow timing) so later phases can verify the fix actually addresses it.

### Minimise

Once it's red, shrink the repro to the **smallest scenario that still goes red**. Cut inputs, callers, config, data, and steps **one at a time**, re-running the loop after each cut, and keep only what's load-bearing for the failure.

Why bother: a minimal repro shrinks the hypothesis space in Phase 3 (fewer moving parts left to suspect) and becomes the clean regression test in Phase 5.

Done when **every remaining element is load-bearing**: removing any one of them makes the loop go green.

Minimise where isolation permits it. On live infrastructure, preserve needed
state and narrow the diagnostic scope instead of dismantling the environment.

## Phase 3: Hypothesise

For an ambiguous failure, rank the plausible competing hypotheses before
testing them. Use the observed evidence to choose how many are worth pursuing.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

If you cannot state the prediction, the hypothesis is a vibe: discard or sharpen it.

**Show the ranked list to the user before testing.** They often have domain knowledge that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've already ruled out. Cheap checkpoint, big time saver. Don't block on it; proceed with your ranking if the user is AFK.

## Phase 4: Instrument

Each probe must map to a specific prediction from Phase 3. **Change one variable at a time.**

Tool preference:

1. **Debugger / REPL inspection** if the env supports it. One breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses.
3. Never "log everything and grep".

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end becomes a single grep. Untagged logs survive; tagged logs die.

**Perf branch.** For performance regressions, logs are usually wrong. Instead: establish a baseline measurement (timing harness, `performance.now()`, profiler, query plan), then bisect. Measure first, fix second.

## Phase 5: Fix + regression test

Write the regression test **before the fix**, but only if there is a **correct seam** for it.

A correct seam is one where the test exercises the **real bug pattern** as it occurs at the call site. If the only available seam is too shallow (single-caller test when the bug needs multiple callers, unit test that can't replicate the chain that triggered the bug), a regression test there gives false confidence.

If no correct seam exists, document the limitation and the strongest available
verification. Infrastructure may need a configuration check, bounded live probe,
or isolated restore instead of a unit test. Do not invent a shallow test to fill
the gap or assume that the missing seam proves an architecture problem.

If a correct seam exists:

1. Turn the minimised repro into a failing test at that seam.
2. Watch it fail. If you forced the red by mutating code or a fixture, `diff` against a pristine copy to prove the mutation landed before you trust it.
3. Apply the fix.
4. Watch it pass.
5. Re-run the Phase 1 feedback loop against the original (un-minimised) scenario.

## Phase 6: Cleanup

Required before declaring done:

- [ ] Original symptom check passes, or the remaining verification limit is stated
- [ ] Regression test passes (or absence of seam is documented)
- [ ] Temporary instrumentation created by this investigation is removed (`rg` the prefix)
- [ ] Scratch state created by this investigation is cleaned up; evidence needed for the handover is retained at a named path
- [ ] The supported cause and verification are stated in the handover, and in a commit / PR message if one was requested
