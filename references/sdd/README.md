# Brainstorming and spec-driven development

Read this contract when starting or resuming an SDD stage. For brainstorming,
read [artifact conventions](artifacts.md) only when a durable idea brief is useful.
These are first-draft Spellbook defaults; project instructions and the user's
chosen artifact system take precedence.

## Execution contract

Brainstorming explores possibilities outside SDD. Discovery starts SDD from a
direction the user wants to pursue. A brief can connect them, but brainstorming
is optional and can end without a build decision.

SDD connects discovery, observable requirements, implementation tasks, and
verification evidence through PR delivery. Each stage is independently usable.
Continue across stages when the request authorizes the broader work; a request
for one artifact ends with that artifact. Stage completion is a check of usable
inputs and outputs, not a mandatory human approval ceremony.

Resolve inspectable facts yourself. Ask focused questions when a missing product
decision, preference, or authorization materially affects dependent work and is
not already settled or delegated. Preserve authorization across stage boundaries;
do independent work while a question is pending. Never treat silence as approval.
Distinguish user decisions from recommendations and unresolved assumptions.

Use the current agent and native tools by default. Additional agents and model
roles are optional and follow the user's and harness's instructions. These skills
require neither multi-agent execution nor a model roster. Reading a stage skill
is enough when the harness has no skill invocation tool. Locate a stage by its
skill name in the harness catalog or read its linked entry point. Spellbook keeps
skill directory names unchanged on installation, so sibling stage links work
in both locations. If a required stage is unavailable, report the missing resource
rather than pretending to have loaded it.

## Artifacts and resumption

Read [artifact conventions](artifacts.md) before creating, updating, or reconciling
workflow artifacts. Reuse existing specs, trackers, and decisions rather than
creating competing records. Discover commands and conventions from the project.
The OpenSpec CLI is optional; this collection uses its artifact ideas without
claiming that a custom workflow is a standard OpenSpec schema.

Scale the record to the risk and handoff needs. A trivial, unambiguous edit can
use the request as its requirement and a short plan and verification note in
chat. A change crossing sessions or PRs needs durable scope, acceptance,
dependencies, progress, and evidence. Create only the documents those needs justify.

On resumption, locate the selected change, inspect the checkout and existing PR,
and compare requirements, task status, and evidence with reality. Record which
decisions remain open and what the next ready task is. File existence and checked
boxes do not establish that inputs are still valid. Repair stale context without
repeating settled discovery or silently overwriting another change.

When learning changes intent, update the requirement and record why; revise
affected tasks and evidence. When only the solution changes, revise design and
tasks. Do not rewrite acceptance conditions merely to make the patch pass.

## Delivery language

PR opened means the forge has a PR. Merge-ready means the current patch has the
required verification evidence, checks, approvals, and conflict clearance; merge
authorization can still be outstanding. Merged means the forge confirms that
the change landed in the intended base. Deployed means the release environment
has the change, supported by deployment evidence.

Avoid the ambiguous phrase “shipped PR” in status reports. If a request uses
“ship,” resolve merge or deployment intent from the conversation and project
policy before either action depends on it. A request to open a PR ends with an
open PR unless further delivery work is authorized. Report pending gates rather
than treating merge-ready, queued, or auto-merge enabled as merged.

## Collection maintenance

The eight skill entry points live under `skills/brainstorm` and `skills/sdd*`.
This index owns the execution contract; [artifacts.md](artifacts.md) owns storage,
traceability, and reconciliation. [SOURCE.toml](SOURCE.toml),
[ADAPTATIONS.md](ADAPTATIONS.md), and `licenses/` retain the source review and
notices. The skill directories retain their own relevant source records and
notices so their origins remain visible when distributed separately.
