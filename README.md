# Spellbook

Personal agent instructions, skills, and shared references for Codex, Claude
Code, and Pi, plus Pi extensions.

See [working with skills](docs/user/skills.md).

Browse the [reference catalog](references/README.md) for shared guidance.

## Get started

Keep the checkout at a stable path. Install on the machine and account where
your agents run. Choose one of these options.

### Command line

With Node.js 24.2 or newer, register the command from this checkout:

```sh
npm link
spellbook install --dry-run
spellbook install
spellbook status
```

You can also run `./scripts/spellbook.ts` directly from the checkout.
The existing Just and npm shortcuts remain available.

To manage installation through Nix configuration, use the [Home Manager module](docs/user/home-manager.md) instead.

The installer links resources into your home directory for all three agents.
It refuses conflicting paths. To select one agent, add `--target codex`,
`--target claude`, or `--target pi`.

## Documentation

The [user documentation](docs/user/README.md) covers setup, usage, and development.
[Agent documentation](docs/agents/README.md) covers repository maintenance.
Start with the relevant guide:

- [Install from a checkout](docs/user/install.md), including uninstall and shared paths.
- [Install with Home Manager](docs/user/home-manager.md).
- [Develop Spellbook](docs/user/development.md).

## Credits

Spellbook includes adapted references from
[pstack](https://github.com/cursor/plugins) by Lauren Tan. Each adapted
collection records its upstream source in `SOURCE.toml`. [licenses/](licenses/README.md)
holds each source's license.
