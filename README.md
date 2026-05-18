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

For project-local installation:

```sh
just install-local
just uninstall-local
```

Set `PI_BIN` to use a non-default pi executable, or `SPELLBOOK_PI_SOURCE` to install from another checkout path.

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
