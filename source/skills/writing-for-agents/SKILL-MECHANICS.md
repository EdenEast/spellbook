# Skill mechanics

Use these checks when creating, reviewing, or updating a skill. The workflow and shared writing principles live in `SKILL.md`. Apply conditional checks only to resources the skill actually needs.

## Identity and discovery

Keep a valid YAML frontmatter block with `name` and a non-empty `description`. Use a descriptive name with lowercase letters, digits, and hyphens. Verify length limits, reserved names, and optional fields against the target host's schema or validator; preserve supported metadata during edits.

Write the description in third person, naming the capability and the situations that should select it. Test both intended triggers and plausible false matches. A shorter description is useful only if it preserves those distinctions.

Example pointer revision:

- Before: "This skill helps with PDF documents and PDF files. It can extract text from PDFs and fill in PDF forms."
- After: "Extracts PDF text and fills PDF forms. Use for PDF extraction or form completion."

Both capability branches survive. A request to design a PDF viewer should not match merely because it mentions PDF. Check the revision with real prompts before claiming improved discovery.

## Body and references

Keep the entrypoint below 500 lines as a review threshold, not a length target. Inspect dense paragraphs even in a short file. Keep shared actions and constraints visible; disclose branch-specific detail through a pointer that says when to read it.

Link supporting references directly from `SKILL.md` where practical. Check that each path resolves from its containing file and that partial reads reveal the material needed to choose a branch. Add a contents list to references longer than 100 lines. Use descriptive filenames and forward slashes.

Use one term for each concept. Prefer maintained sources for changing facts; isolate necessary historical guidance from current instructions. Apply the main skill's pruning rules before adding another rule or reference.

Include an input/output example when it resolves ambiguity that prose leaves open. Use an exact output template only when structure is part of correctness; otherwise provide an adaptable default. Examples must preserve the same constraints as the instructions.

For complex sequences, a short checklist can make progress visible. Give steps checkable completion criteria and recovery actions using the main skill's guidance. An instruction to verify needs to identify what evidence counts as a pass.

## Executable resources

Apply this section when the skill includes scripts, tools, or operations whose results need validation.

- Reuse a helper for repeated deterministic work when it improves reliability. Say whether the agent should run it or read it, with its inputs and expected output.
- Handle anticipated errors deliberately. Surface failures clearly; recovery must preserve task intent rather than silently substitute success. Explain configuration values whose rationale is not obvious.
- Verify dependencies in the intended runtime. Give installation or fallback instructions only where that environment permits them. Reference tools by the qualified names exposed by the host.
- For consequential batch changes, use a reviewable intermediate artifact that can be checked before application. Validate the result afterward, within the user's authorization.
- For layout-dependent work, inspect rendered output when available; text extraction alone cannot establish visual correctness.
- Run changed helpers against representative fixtures, including a relevant failure case. Distinguish script correctness from the agent's ability to discover and use the helper.

## Invocation and host scope

A **model-invoked** skill permits automatic selection and spends context on discovery. A **user-invoked** skill relies on the human remembering to request it. Preserve the existing invocation policy unless the user asks to change it; use the host's normal discovery default for a new skill.

Invocation settings, metadata loading, and cross-skill calls are host-specific. Verify them in the target host's documentation or configuration before prescribing a flag. A setting in one host's frontmatter may live in a separate policy file in another. Avoid inferring that disabled automatic selection makes the underlying files unreadable.

Shared reference can live in a plain file with explicit pointers from its consumers. It needs independent skill discovery only when agents should select it as a task in its own right.

Split off a skill when its distinct capability needs independent invocation. Keep a branch in a supporting reference when it only serves the existing skill. A router can help humans find a growing collection; whether it can invoke another skill or only suggest it depends on the host.
