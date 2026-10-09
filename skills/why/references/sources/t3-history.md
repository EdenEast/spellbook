# T3 agent session history

Use this source when a prior agent session may explain a decision. Start with
the current conversation or a supplied handoff; mine stored history only when
needed and within the user's project, topic, host, and time-window scope.

## Discover and read

Locate the T3 backend's data on the environment where it runs. A common path is
`~/.t3/userdata/state.sqlite`, but it is not guaranteed; custom data directories
and remote backends differ. Inspect the executing host/user and available
runtimes before choosing Python, Node, SQLite CLI, or declared Nix tooling. Use
SSH only for a host included in scope, and avoid SSH to the host already running
the commands. If access is unavailable, report that source gap.

Open the database read-only. Python supports SQLite URI mode with `mode=ro`;
Node supports `DatabaseSync(path, { readOnly: true })` when its runtime exposes
`node:sqlite`. Inspect `sqlite_master` and `PRAGMA table_info` before relying on
a schema. Common tables include `projection_projects`, `projection_threads`,
`projection_thread_messages`, and `projection_thread_sessions`.

Query project/thread metadata first, then only relevant messages. Record the
actual UTC window and coverage. Exclude the current conversation when looking
for independent historical evidence. Deduplicate shared thread/message IDs and
recognize that related sessions may describe the same continuing task. Avoid
credential/authentication tables and raw exports in the repository. If an export
is needed, use a proper online SQLite backup; copying only a live database file
can miss WAL changes.

## Interpret and cite

Distinguish user decisions and corrections from assistant claims. A projected
message saying a deployment passed is a claim about prior work, not a new live
verification. Projection messages may omit tool calls and outputs; if the answer
hinges on exact agent actions, seek the relevant full transcript or underlying
artifact within scope, or report the limitation.

Cite environment/host, project, thread ID, message ID, role, and timestamp for
the evidence used. Recheck named files, commits, and runtime state when current
state matters. Keep private session content out of public reports and include
only the minimum excerpt needed to support the finding.
