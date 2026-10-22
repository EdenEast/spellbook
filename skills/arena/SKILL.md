---
name: arena
description: "Spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers into it. Use for /arena, 'arena this', 'throw it in the arena', or when one attempt at a non-trivial artifact would lock in the wrong shape."
disable-model-invocation: true
---

# Arena

Open a todolist with one entry per phase (Frame, Fan out, Cross-judge, Pick, Graft, Verify) before launching anything.

## Phase A: Frame

Every candidate gets the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive the rubric, 3-6 concrete gradeable criteria for what success looks like on *this* task. It is the picker's tool in Phase D. Candidates only see the task.
3. Pick the runners. Run one candidate per `arena runner` role in [model roles](~/.agents/references/spellbook/models/README.md), labeled Candidate A, B, and so on to match the roles. Each role sets its runner's model, effort, and fallbacks. A calling skill, such as architect, can name its own runner roles instead. Spawn more runners when the arena covers multiple design directions. Use the same model N times when the work is generation-bound rather than judgment-sensitive.
4. Establish one input snapshot before fan-out. Inspect the base commit, staged and unstaged changes, and untracked files relevant to the task. Preserve the user's work; creating a snapshot does not authorize a commit. Worktree isolation may copy only committed files. When relevant edits are uncommitted, transfer their exact contents and relevant untracked files into each candidate's isolated source tree, or use private source copies. Exclude secrets, unrelated private files, and generated bulk. Verify every candidate starts from the same relevant source contents before it writes. If that cannot be done safely, stop and report the gap.
5. Give each candidate its own output location (a git worktree where possible, otherwise a unique temporary directory), per [separate-before-serializing-shared-state](~/.agents/references/spellbook/principles/separate-before-serializing-shared-state.md). Use the harness's worktree isolation when it can reproduce the input snapshot. Name the final destination in the caller's checkout, or another location the user requested. Record which temporary resources this run owns.

## Phase B: Fan out

Spawn all N subagents in one message through the harness's agent tool, in the background where the harness supports it, each with the task, the shared grounding and input snapshot, its own source and output paths, and instructions to verify its starting source before producing the artifact and a short rationale naming the alternatives it considered and what it rejected. No candidate writes to the caller's checkout or another candidate's files.

If a candidate produces no output, proceed with N-1 and note the dropout.

## Phase C: Cross-judge

After all Phase B candidates complete, spawn one read-only judge subagent for the `arena cross-judge` role in model roles. Take the first reachable entry whose vendor differs from the session model's, and otherwise the role's usual choice. Use a read-only agent type when the harness offers one; otherwise instruct the judge not to write. It sees the rubric and the candidates by path label, scores each criterion, and recommends a base with rationale. It runs in parallel with your reading in Phase D. Don't spawn it while candidates are still writing.

## Phase D: Pick a base

Read every candidate end to end before picking. Score each against the rubric criterion by criterion, not on holistic feel, and compare with the cross-judge. Agreement on the base confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base a future maintainer can extend most easily without breaking invariants. When two feel tied, prefer the cleaner boundary or smaller API, per the [laziness protocol](~/.agents/references/spellbook/principles/laziness-protocol.md).

## Phase E: Graft

Apply the chosen base to the final destination, preserving unrelated caller edits. Walk each losing candidate once more for what is worth porting into that result, usually one or two things per candidate, not most of it. Fold each graft in by hand, per [redesign-from-first-principles](~/.agents/references/spellbook/principles/redesign-from-first-principles.md), so the result stays coherent under one mental model. Don't paste mechanically.

If the candidates converge on one shape, that is strong agreement. Note it and ship the consensus shape. No graft is needed. If they wildly diverge, Phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## Phase F: Verify

Verify the synthesized artifact at its final destination, per [prove-it-works](~/.agents/references/spellbook/principles/prove-it-works.md). If verification finds a problem the arena missed, either Phase A was wrong (re-frame and re-run) or a candidate caught it and you missed the graft (go back to Phase E). Don't paper over it.

After verification, remove only temporary worktrees, branches, and directories this run owns, once their useful contents and synthesis evidence are preserved. Do not force-remove worktrees containing unpreserved work. On failure, stop candidate writers and report any retained resources and recovery steps. Cleanup must preserve the final artifact, the caller's pre-existing work, and the synthesis note.

## Outputs

One synthesized artifact, with a short synthesis note alongside naming the base and why, the cross-judge's verdict, each graft with its source candidate, what was rejected and why, any convergence or dropouts, and the verification result.
