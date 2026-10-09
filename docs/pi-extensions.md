# Create and load Pi extensions

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

The repository root is also a native Pi package for extensions. As an alternative
to the [checkout installer's extension links](install.md), run:

```sh
pi install /absolute/path/to/spellbook
```

Use one extension loading method at a time. The package declares no skills,
prompts, or themes. Install skills through the shared resource installer.

## Try an external Pi package

Use Pi's native `pi install` command with an exact npm version or Git commit.
External package declarations live in Pi's settings; Spellbook does not manage
them or install external Pi packages by default.

Reproducible adoption of external packages and Nix packaging of extension
dependencies are not implemented in Spellbook.
