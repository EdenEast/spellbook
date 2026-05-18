# Extensions

This directory contains pi extensions shipped by spellbook. When installed, they are linked under the `spellbook` extension namespace.

## Available extensions

- [`answer`](answer/) — `/answer` and `Ctrl+.` extract questions from the last assistant reply and present an interactive Q&A form.
- [`review`](review/) — `/review` starts structured code reviews for uncommitted changes, branches, commits, folders, or GitHub PRs; `/end-review` returns from review branches.
- [`todos`](todos/) — `/todos` and the `todo` tool manage file-backed tasks in `.pi/todos`.

## Installation

From the repository root:

```sh
just install
```

For project-local installs:

```sh
just install-local
```

With the Home Manager module, enable `programs.pi-spellbook.sources.extensions.enable`.

## Notes

These extensions are meant to be additive. They do not replace pi settings, keybindings, models, or system prompts.
