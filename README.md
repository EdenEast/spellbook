# Spellbook

Personal agent instructions, skills, and shared references for Codex, Claude
Code, and Pi, plus Pi extensions.

Browse the [skill catalog](skills/README.md) for available workflows and the
[reference catalog](references/README.md) for shared guidance.

## Get started

Keep the checkout at a stable path. Install on the machine and account where
your agents run. Choose one of these options.

### Just

With Just and Node.js 24.2 or newer installed, run:

```sh
just install --dry-run
just install
just status
```

### Node.js

With Node.js 24.2 or newer, run these commands from the checkout:

```sh
node scripts/install.ts install --dry-run
node scripts/install.ts install
node scripts/install.ts status
```

To manage installation through Nix configuration, use the [Home Manager module](docs/home-manager.md) instead.

The installer links resources into your home directory for all three agents.
It refuses conflicting paths. To select one agent, add `--target codex`,
`--target claude`, or `--target pi`.

## Documentation

The [documentation index](docs/README.md) links installation details,
maintenance guides, and reference pages. Start with the relevant guide:

- [Install from a checkout](docs/install.md), including uninstall and shared paths.
- [Install with Home Manager](docs/home-manager.md).
- [Develop Spellbook](docs/development.md).
- [Migrate from the previous layout](docs/migration.md).
