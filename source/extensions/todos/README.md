# todos

File-backed todo management for pi sessions.

Todos are stored as markdown files in `.pi/todos` by default, with JSON front matter and optional markdown body text. Set `PI_TODO_PATH` to use another directory.

## Command

```text
/todos
/todos search terms
```

In interactive mode, `/todos` opens a searchable TUI. In non-interactive mode it prints the todo list.

Argument autocomplete suggests todo extension actions (for recall) and matching todo titles.

TUI actions include viewing details, working on a todo, refining a todo, closing/reopening, releasing assignment, copying the file path/text, and deleting.

Useful shortcuts in the selector:

- Type to search.
- `↑`/`↓` — select.
- `Enter` — open actions.
- `Ctrl+Shift+W` — fill the editor with a "work on todo" prompt.
- `Ctrl+Shift+R` — fill the editor with a refinement prompt.
- `Esc` — close.

## Tool

The extension registers a `todo` tool for agents:

```text
list, list-all, get, create, update, append, delete, claim, release
```

Examples:

```json
{ "action": "create", "title": "Add parser tests", "tags": ["qa"], "body": "Cover malformed inputs." }
{ "action": "claim", "id": "TODO-deadbeef" }
{ "action": "append", "id": "deadbeef", "body": "Implemented happy-path tests." }
{ "action": "update", "id": "deadbeef", "status": "closed" }
```

Agents should claim a todo before working on it, append useful progress notes, release it if abandoning the task, and close it when complete.

## Storage format

Each todo is stored as `<id>.md`:

```markdown
{
  "id": "deadbeef",
  "title": "Add tests",
  "tags": ["qa"],
  "status": "open",
  "created_at": "2026-01-25T17:00:00.000Z",
  "assigned_to_session": "session.json"
}

Notes about the work go here.
```

Todo ids are displayed as `TODO-<hex>`, but tool calls accept either `TODO-<hex>` or the raw hex id.

The extension may also create:

- `<id>.lock` — transient edit lock.
- `settings.json` — todo storage settings.

Default settings:

```json
{
  "gc": true,
  "gcDays": 7
}
```

Closed todos older than `gcDays` are garbage-collected on session start when `gc` is enabled.

## Source

Adapted from:

- <https://github.com/mitsuhiko/agent-stuff/blob/main/extensions/todos.ts>
