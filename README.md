# Spellbook

Personal agent instructions, skills, and shared references for Codex, Claude
Code, and Pi, plus Pi extensions.

Browse the [skill catalog](skills/README.md) for available workflows and the
[reference catalog](references/README.md) for shared guidance.

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

To choose skills from a checklist, run:

```sh
spellbook install --select
```

Only checked skills are synced in that run. Unchecked skills stay untouched.
Instructions, references, and Pi extensions still follow the selected targets.

You can also run `./scripts/spellbook.ts` directly from the checkout.
The existing Just and npm shortcuts remain available.

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

## Credits

Spellbook includes adapted skills and references from
[pstack](https://github.com/cursor/plugins) by Lauren Tan and
[Matt Pocock's skills](https://github.com/mattpocock/skills). Each adapted
item records its upstream source in `SOURCE.toml` and includes its license.
