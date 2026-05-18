# answer

Extract questions from the last assistant message and answer them in an interactive TUI.

## Commands

- `/answer` — scan the latest completed assistant response for questions, then open a Q&A form.
- `Ctrl+.` — shortcut for the same action.

## How it works

1. Finds the most recent completed assistant message on the current branch.
2. Uses a small extraction prompt to turn questions into structured JSON.
3. Shows each question in an interactive form.
4. Sends the compiled answers back as a follow-up message and triggers the next turn.

Model selection prefers `openai-codex/gpt-5.3` when available, then `anthropic/claude-haiku-4-5`, then the currently selected model.

## TUI controls

- `Tab` or `Enter` — next question.
- `Shift+Tab` — previous question.
- `Shift+Enter` — insert a newline in an answer.
- `Esc` or `Ctrl+C` — cancel.
- On the final question, `Enter`/`y` submits and `Esc`/`n` returns to editing.

## Source

Adapted from:

- <https://github.com/mitsuhiko/agent-stuff/blob/main/extensions/answer.ts>
