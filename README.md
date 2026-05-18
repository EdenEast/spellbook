# spellbook

Additive resources for [`pi-coding-agent`](https://github.com/Plato-solutions/pi), packaged for reproducible installs and local iteration.

## Install with pi

Use the included `justfile` helpers:

```sh
just install        # install this repo as a pi local-path package
just uninstall      # remove it
just list           # list pi packages
just config         # open pi package config UI
```

Set `PI_BIN` to use a non-default pi executable, or `SPELLBOOK_PI_SOURCE` to install from another checkout path.

## Install skills with Claude Code

For now, Claude Code installation only uses `source/skills`.

```sh
just install-claude          # link skills into ~/.claude/skills
just uninstall-claude        # remove those links
```

The installer links each skill directory directly because Claude Code discovers skills as immediate children of its `skills` directory. It refuses conflicts by default. Use the script directly for extra options:

```sh
scripts/claude-skills.sh install --dry-run
scripts/claude-skills.sh install --backup
scripts/claude-skills.sh install --force
```

Set `CLAUDE_CODE_DIR` to use a non-default Claude Code config directory, or `SPELLBOOK_SKILLS_SOURCE` to install skills from another checkout path.

## Home Manager

This flake exposes a Home Manager module as both `default` and `pi-spellbook`.

Example flake usage:

```nix
{
  inputs.spellbook.url = "github:YOUR_USER/spellbook";

  outputs = { home-manager, spellbook, ... }: {
    homeConfigurations.YOUR_USER = home-manager.lib.homeManagerConfiguration {
      modules = [
        spellbook.homeManagerModules.pi-spellbook
        {
          programs.pi-spellbook.enable = true;
        }
      ];
    };
  };
}
```

Available options:

```nix
{
  programs.pi-spellbook = {
    enable = true;

    # Install pi-coding-agent via Home Manager when available.
    installPackage = true;

    # Override if your nixpkgs does not provide pkgs.pi-coding-agent,
    # or set installPackage = false if pi is installed another way.
    package = pkgs.pi-coding-agent;

    # Pi config directory, relative to $HOME.
    piDir = ".pi/agent";

    # Resource groups can be enabled or disabled independently.
    sources.extensions.enable = true;
    sources.skills.enable = true;
    sources.prompts.enable = true;
    sources.themes.enable = true;
  };
}
```

The module creates Home Manager file links from this repository's `source/` tree into pi's normal additive resource directories, under a `spellbook` namespace. For example, with the default `piDir`, resources are linked to:

```text
~/.pi/agent/extensions/spellbook
~/.pi/agent/skills/spellbook
~/.pi/agent/prompts/spellbook
~/.pi/agent/themes/spellbook
```

It does not manage `settings.json`, `keybindings.json`, `models.json`, `AGENTS.md`, `SYSTEM.md`, or `APPEND_SYSTEM.md`.

## Design notes

- Resources are additive and namespaced under `spellbook`.
- Existing pi settings, keybindings, models, and agent/system files are not managed.
- Installs should be conservative and avoid overwriting user configuration.
