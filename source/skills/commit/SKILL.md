---
name: commit
description: Create a commit, or draft a commit message, when the user asks to commit changes.
disable-model-invocation: true
---

# Create a commit or draft a commit message

Use this skill when the user asks you to create a commit, commit current changes, or suggest a commit message.

## Determine repository type

This skill supports both `git` and `jujutsu` repositories. If the repositories root contains `.jj` then use
`./references/jj-commit.md` else default to `./references/git-commit.md`.

If the user only asks for a commit message, you can draft the message from the diff or change summary without choosing a commit command.

## Before writing the message

1. Inspect the pending changes with the appropriate repository tooling.
2. Confirm that the changes belong together. If unrelated changes are present, ask the user how to split them.
3. Do not include local planning notes, scratch files, or other private working files unless the user explicitly asks for them.
4. If the user only asked for a message, draft the message without creating a commit.

## Commit message structure

Write the message in this form:

```text
type(scope): imperative subject

Body explaining the motivation and implementation details. Wrap prose at
72 characters. Use basic Markdown when it helps readability.

Co-Authored-By: Model Name <noreply@provider.example>
```

### Subject

- Keep the subject to 72 characters or fewer.
- Use Conventional Commits format: `type: subject` or `type(scope): subject`.
- Start the subject statement with an imperative verb, such as `add`, `fix`, `remove`, `rename`, `document`, or `simplify`.
- Describe what the commit does, not how it was prepared.
- Do not end the subject with a period.
- Match project convention for capitalization after the colon

### Body

- Leave a blank line between the subject and body.
- Explain why the change was made and why this approach was chosen.
- Mention important behavior changes, tradeoffs, migrations, or compatibility concerns.
- Note relevant alternatives that were considered but not implemented.
- Reference relevant issues, documents, prior commits, or pull requests when useful.
- Wrap paragraphs at 72 characters.
- Write message through the **unslop** skill.

### Co-author trailer

If an AI assistant helped prepare the changes, add a `Co-Authored-By:` trailer. Derive the author name from the active
model name and version, and use the provider's standard noreply address when known, for example:

- `Claude Opus 4.7 <noreply@anthropic.com>`
- `GPT-5.5 <noreply@openai.com>`
- `Gemini 3.1 Pro <noreply@google.com>`

If the model or provider is unknown, use:

```text
Co-Authored-By: AI Assistant <noreply@example.com>
```

## Conventional Commit types

| Type     | Use for                                                                   |
| -------- | ------------------------------------------------------------------------- |
| `fix`    | Bug fixes                                                                 |
| `feat`   | New user-facing or API functionality                                      |
| `chore`  | Maintenance, tooling, dependency, or repository housekeeping changes       |
| `refactor` | Code improvements that do not intentionally change behavior             |
| `docs`   | Documentation changes, including comments                                 |
| `test`   | Adding, removing, or changing tests                                       |
| `perf`   | Performance improvements                                                  |
| `style`  | Formatting-only changes or automated lint fixes                           |

## Example

```text
refactor: remove unused `recurse` setting

The setting was never exposed to users. It was always enabled in production
code, with only benchmarks providing an override through the environment.

Removing it simplifies the call path and avoids carrying an option that has no
supported runtime effect. If the need returns later, we can add it back with a
clear user-facing contract.

Co-Authored-By: AI Assistant <noreply@example.com>
```
## Auto-Clarity

Always include body for: breaking changes, security fixes, data migrations, anything reverting a prior commit. Never
compress these into subject-only as future debuggers need the context.
