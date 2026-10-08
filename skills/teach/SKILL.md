---
name: teach
description: Explain a change or subsystem in plain language by combining how it works with the reasons behind it, at the reader's pace.
disable-model-invocation: true
---

# Teach

Explain what the thing is, how it works, and why it is built that way. The goal
is understanding. An explanation request alone does not authorize code changes.

1. Choose what the person needs to understand from their question and the
   conversation: reviewing, debugging, preparing a change, or learning the
   subsystem. Skip what they already know. Ask about their background only if
   it materially changes the explanation and cannot be inferred.
2. Load `how` for runtime behavior and `why` for rationale. Use the harness's
   skill mechanism or read [../how/SKILL.md](../how/SKILL.md) and
   [../why/SKILL.md](../why/SKILL.md) directly. Treat them as investigation
   procedures, not prerequisites for a particular tool or model. Reuse findings
   already established in this conversation. A narrow mechanics question may
   need only `how`; a subsystem explanation usually benefits from both. Keep
   `why` scoped to the decision being taught and relevant evidence sources.
   Independent investigations may run concurrently when supported and
   authorized; otherwise do them directly in the same session.
3. Start with a plain definition and tie it to the case in front of you. Trace
   the user action or request through the system when that makes the explanation
   concrete. Explain the problem each concept solves, rather than reciting
   functions and constants. Give the smallest complete answer that satisfies
   the question; add depth where the user asked for it.
4. Reword findings for teaching, but preserve `why`'s confidence and source
   citations. A plausible rationale stays an inference. Keep necessary command,
   file, and API names exact and explain unfamiliar terms once. Load `unslop`
   or read [../unslop/SKILL.md](../unslop/SKILL.md) for the final wording.

Keep it conversational. No quizzes, artificial pauses, or demands that the user
repeat the explanation. Follow their requested depth; do not withhold a complete
answer merely to force another turn. In a live conversation, leave room for
follow-up after satisfying the current question. For a one-shot request, deliver
a self-contained explanation.
