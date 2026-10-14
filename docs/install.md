# Install from a checkout

Use Node.js 24.2 or newer. Run the installer from the checkout on the machine
and account where the agents execute. Keep the checkout at a stable path;
installed resources link to it.

## Register the command

From the checkout, run:

```sh
npm link
```

This exposes `spellbook` on your PATH. To run without registration, use
`./scripts/spellbook.ts` from the checkout.

## Install resources

1. Preview the links:

   ```sh
   spellbook install --dry-run
   ```

2. Resolve any conflicting paths listed in the preview. If you used the old
   `source/` layout, inspect existing links before replacing them.

3. Create the links:

   ```sh
   spellbook install
   ```

4. Inspect the result:

   ```sh
   spellbook status
   ```

   Resources linked to this checkout appear as `installed`.

Reload or restart existing agent sessions if they do not discover the resources.
See [Installation paths and behavior](installation-reference.md) for destinations
and conflict rules.

## Select agents

By default, the installer selects Codex, Claude Code, and Pi. Use repeatable
`--target` flags to select a subset:

```sh
spellbook install --target codex --target claude
```

Any selected agent also manages the shared reference link used by all three agents.

## Refresh or remove links

After deleting resources from the checkout, run `install` again to remove stale
links. Before moving the checkout, uninstall its links:

```sh
spellbook uninstall
```

Uninstall removes only resource links that point into this checkout, including
broken links. It preserves unrelated files and links.

## Use command shortcuts

If Just is available, use the equivalent commands:

```sh
just install --dry-run
just install
just status
just uninstall
```

The npm shortcuts are `npm run resources:install`, `npm run status`, and
`npm run resources:uninstall`. Pass installer flags after `--`:

```sh
npm run resources:install -- --target codex
```

`npm install` installs development dependencies. It does not install agent
resources. The installer has no npm runtime dependencies and needs no build step.
