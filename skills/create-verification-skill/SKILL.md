---
name: create-verification-skill
description: "Generate a project-local verification skill that drives your app the way a user does — any language, framework, or platform. Use when explicitly asked to create a verification skill or make a control skill for this repository."
disable-model-invocation: true
---

# Create a verification skill

Every serious project needs a scripted way to drive the real app and prove behavior: launch it, exercise a feature the way a user would, and capture evidence. This skill generates that as a project-local skill (`.agents/skills/verify-<app>/`) tailored to the repo. You write the generator's output for the next agent, not for a human: it will be read cold, mid-task, by an agent that has never seen the app.

Use this workflow only on an explicit request. Importing this generator does not
request generating a verifier. Follow the repository's existing skill layout;
otherwise keep the canonical directory in `.agents/skills/verify-<app>/` and
link `.claude/skills/verify-<app>` to it for Claude Code. Keep generated verifiers
project-local unless the user requests another scope. Invocation syntax depends
on the harness.

Use the active harness's skill-authoring guidance when available, or read
[writing-for-agents](../writing-for-agents/SKILL.md) and its companion mechanics.
Apply [unslop](../unslop/SKILL.md) to the generated prose through the harness's
skill mechanism or read it directly.

## 1. Interview the repo, not the user

Answer these from the codebase and only ask the user what you cannot observe:

- **Environment:** establish the executing host, user, available runtimes, and process/container boundary. Use remote access only for a host included in scope.
- **Surface:** what does a user actually touch? A web UI, a CLI/TUI, a desktop app, an API, a mobile app, a library? A repo can have several; pick the primary one and note the rest.
- **Run:** how does the app start locally? Prefer the repo's own documented dev command (package scripts, Makefile, README quickstart). Note ports, env vars, seed data, auth.
- **Drive:** how can an agent interact with it programmatically? Use the active harness's browser tools and existing project harnesses first: Playwright/Cypress specs, expect scripts, PTY helpers, curl-able endpoints, or a debug port. When T3 preview tools are available, check `preview_status`, then `preview_open` if no automation-capable preview is attached; use its snapshots and focused interactions. Choose another browser system only when those tools are absent, explicitly unavailable, or the user requests it. Only then pick a generic recipe: browser/CDP for web and Electron, a tmux/PTY harness for CLI/TUI, plain HTTP for services.
- **Observe:** what evidence can be captured? Screenshots, terminal transcripts, response bodies, logs, exit codes, DB state.
- **Isolate:** can two instances run side by side (ports, data dirs, profiles)? If not, say so in the generated skill: refusing to double-drive a shared instance beats corrupting the user's session.

If the checkout doesn't build or start as-is, fix it only when product changes are already in scope; otherwise report the blocker before generating; a skill written against a broken base teaches wrong steps. When an irrelevant missing asset blocks startup (a static dir the API never serves, a sample config), the generated skill may create it, clearly marked as verification scaffolding, and remove it in cleanup.

For infrastructure, distinguish configuration evaluation, build, activation, and
live behavior. A build or healthy service alone does not prove a scheduled job,
backup, restore, or other user-visible outcome. Prefer read-only probes and
isolated disposable state; a verification request does not authorize deployment,
production mutations, or sending messages. Run consequential actions only when
they are within the user's existing authorization, and otherwise report the
blocked proof or use an authorized isolated environment.

## 2. Generate the skill

Write `.agents/skills/verify-<app>/SKILL.md` (or the repository's established local location) with YAML frontmatter (`name: verify-<app>` and a `description` that names the app, the surface, and when to reach for it — without frontmatter the skill never registers) and these sections, each grounded in what the interview actually found (no placeholders left):

- **Launch:** the exact command that starts the app for verification, and how to tell it's ready (a log line, a port answering, a prompt). Include teardown. For a short-lived CLI or TUI there is no server to keep alive: launch means build the binary (or install deps) once, then start each drive in its own isolated PTY or tmux session.
- **Doctor:** one read-only check that answers "is this instance worth driving?" — process up, right version/build, port owned by us, auth valid. An agent runs this first whenever anything looks off.
- **Drive:** the harness recipe with real selectors/commands from this repo, not examples. Prefer stable handles (ARIA labels, data attributes, prompt strings, route paths) over coordinates and tab order.
- **Evidence:** what to capture for a proof and where it goes. State the proof standards: exercise the real user path, not internal setters or test-only endpoints; capture the action and the resulting state, not just the final screen; verify side effects (files written, rows inserted, messages sent) alongside what's visible; mocks only where a production boundary already isolates the external system. When the safe path is a dry-run or test mode, verify what it actually skips by observing (files, network, git refs) rather than trusting its name: some dry-runs still touch the network or open a browser.
- **Cleanup:** how to tear down instances the run created. Never kill by process name; kill what you started. Cleanup removes instances and scratch state, never the evidence: proof artifacts survive the teardown, in a location the skill names.
- **Helpers:** any script the skill ships is executable and its invocation is shown in the skill body. A helper the reader has to reverse-engineer is not a helper.

Choose the generated verifier's invocation policy explicitly. Follow existing
repository conventions; otherwise retain normal model invocation with a
specific description. Any explicitly invoked verifier needs
`disable-model-invocation: true` and, for Codex, matching
`agents/openai.yaml` with `policy.allow_implicit_invocation: false`. Invocation
policy does not grant permission for the actions the verifier describes.

## 3. Seed the feature map

Create `features/README.md` inside the generated skill directory plus one file per user-facing feature you can identify (aim for the top 3-5 to start, from routes, commands, menus, or docs). Follow the shape in [the feature-map example](references/feature-map-example/README.md), with a README index and one file per feature. Each file answers, from the user's point of view: what the feature is, how to reach it, how to drive it with the harness, and what observable end state proves it works. The four H2s are `Sub-features`, `How to get to it (user POV)`, `Driving it with <harness>`, and `Gotchas`. The map is the repo's maintained verification source; a proof that drives one convenient entry point is incomplete when the map lists others.

The Notes example illustrates the format; its commands, selectors, ports, and
seed data are illustrative. Replace them with facts verified in the target
repository.

## 4. Prove the generated skill before handing it over

Run its own instructions end to end once: launch, doctor, drive ONE mapped feature (one is enough; the map exists so later runs can cover the rest), capture evidence, clean up. After cleanup, confirm the evidence still exists at the named location — a cleanup that eats the proof fails this step. Fix what fails, and run the generated cleanup after every failed iteration too, so broken attempts don't strand processes and ports. A generated skill that was never executed is a draft, not a verified deliverable. If tools, credentials, prerequisites, or authorization prevent the live run, leave a clearly labeled draft and report exactly what remains unproven; do not invent a passing result.

## 5. Offer the maintenance loop

Point the user at [maintain-verification-skill](../maintain-verification-skill/SKILL.md) for keeping the map honest as the app changes. Suggest a cadence only if they ask.

Update the repository's skill catalog when it has one. Create commits, pushes,
or pull requests only when requested.
