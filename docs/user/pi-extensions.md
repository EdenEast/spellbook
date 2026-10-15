# Create and load Pi extensions

## Ask the user a question

The maintained `request-user-input` extension adds a `request_user_input` tool
with Codex-style question IDs and an answer map. Try it without changing your
installed configuration:

```sh
npm ci
pi --extension ./pi/extensions/request-user-input/index.ts
```

The tool asks one to three questions, one at a time. Each question has an `id`,
`header`, and `question`. Optional `options` contain a `label` and `description`.
The first choice can be marked `(Recommended)`. A custom answer is available
unless `isOther` is false; omit options for a free-text question.

Answers have this shape:

```json
{
  "answers": { "scope": { "answers": ["Small (Recommended)"] } },
  "cancelled": false
}
```

Cancelling stops the batch and preserves answers already given. An empty string
is an answer, not a cancellation. Non-interactive runs return an error rather
than guessing an answer.

The extension uses standard Pi dialogs, which work in the terminal and over RPC.
T3 Code's Pi adapter turns these dialogs into user-question cards. Choices include
their descriptions in the displayed text because Pi's RPC select interface only
accepts strings. Unlike Codex's native batched card, questions appear sequentially.

This tool does not collect secrets or grant permission approvals. In T3, use
`request_secret` for secrets. Permission confirmations remain the host's job.

## Add an extension

Put a standalone `.ts` or `.js` extension in `pi/extensions/`. For a multi-file
extension, use `pi/extensions/<name>/index.ts` or `index.js`.
The installer ignores dotfiles and TypeScript declaration files.

Add runtime npm dependencies only when the extension requires them. Put Pi host
packages in `peerDependencies`, as described in the
[Pi package documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/packages.md).

## Test an extension

To try an extension without installing it globally, run Pi from the writable
checkout:

```sh
pi --extension ./pi/extensions/<name>.ts
```

Replace `<name>` with the extension's filename. On NixOS, keep experiments in
a writable checkout outside the Nix store. Commit the extension and dependency
lock changes when you want to keep them.

## Install the native Pi package

The repository root is also a native Pi package for extensions and skills. As an alternative
to the [checkout installer's extension links](install.md), run:

```sh
pi install /absolute/path/to/spellbook
```

Use one loading method per resource at a time; avoid loading the same skills
through both package installation and installer links. The package declares
`./skills` and `./pi/extensions`, with no prompts or themes. Package loading does
not install the shared reference library or global instructions; use the checkout
installer or Home Manager for those resources.

## Try an external Pi package

Use Pi's native `pi install` command with an exact npm version or Git commit.
External package declarations live in Pi's settings; Spellbook does not manage
them or install external Pi packages by default.

Reproducible adoption of external packages and Nix packaging of extension
dependencies are not implemented in Spellbook.
