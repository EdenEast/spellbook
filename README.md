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

## Manage external skill repositories

Use the included CLI to copy skills from external repositories into `./source/skills`:

```sh
just skills add vercel-labs/agent-skills   # prompts you to select skills
just skills add vercel-labs/agent-skills --skill web-design-guidelines
just skills list
just skills remove web-design-guidelines
just skills update
```

The interactive picker supports typing to search, arrow keys to move, space to toggle skills, enter to confirm, and escape to cancel.

The default storage directory is `source/skills`. Override it with `--dir` or `SPELLBOOK_SKILLS_DIR`:

```sh
just skills add ./my-skills-repo --dir ./source/skills
SPELLBOOK_SKILLS_DIR=./source/skills just skills add https://github.com/vercel-labs/agent-skills
```

Sources may be GitHub shorthands (`owner/repo`), GitHub/tree URLs, generic git URLs, or local paths. Use `--list` to inspect a source without installing, `--skill` multiple times to pick specific skills non-interactively, `--all` to install everything, and `--force` to replace an existing skill. Installed source metadata is tracked in `skills-lock.json` for updates, including source type, source skill path, destination path, and git revision. Override the lock path with `--lock-file` or `SPELLBOOK_SKILLS_LOCK`.

If a skill's `SKILL.md` frontmatter declares `dependencies`, the CLI installs those first. Dependency entries may be strings like `owner/repo@skill-name` or objects with `source` and `skill`/`skills`.

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
