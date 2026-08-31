# spellbook

Additive agent resources for pi, Claude Code, and Codex, packaged for reproducible installs and local iteration.

## Install with pi

Use the included `justfile` helpers:

```sh
just install        # install deps and this repo as a pi local-path package
just uninstall      # remove it
just list           # list pi packages
just config         # open pi package config UI
```

Installing spellbook also enables [`@tintinweb/pi-subagents`](https://github.com/tintinweb/pi-subagents), which adds the `Agent`, `get_subagent_result`, and `steer_subagent` tools plus the `/agents` command. Define project-specific agents in `.pi/agents/*.md` or `.agents/agents/*.md`.

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

## Install with Codex

Codex installation links the shared global guidance and skills into Codex's user locations:

```sh
just install-codex          # link source/AGENTS.md and source/skills for Codex
just uninstall-codex        # remove those links
```

The installer links:

```text
${CODEX_HOME:-$HOME/.codex}/AGENTS.md -> source/AGENTS.md
${CODEX_SKILLS_DIR:-${CODEX_HOME:-$HOME/.codex}/skills} -> source/skills
```

The skills link points at the whole `source/skills` directory, so skill additions and removals in this repo are reflected without reinstalling. It refuses conflicts by default. Use the script directly for extra options:

```sh
scripts/codex.sh install --dry-run
scripts/codex.sh install --backup
scripts/codex.sh install --force
```

Set `CODEX_HOME` to use a non-default Codex config directory, `CODEX_SKILLS_DIR` to use a non-default user skills directory, `SPELLBOOK_CODEX_SOURCE` to install from another checkout path, or `SPELLBOOK_SKILLS_SOURCE` to install skills from another source directory.

## Skill provenance

External skills are copied into `source/skills` manually. When adding a copied skill, add a `SOURCE.toml` file beside its `SKILL.md` with:

- source repository URL
- source path inside that repository
- original commit SHA
- original URL to that exact commit and path

Example:

```text
source/skills/example-skill/
  SKILL.md
  SOURCE.toml
```

Example `SOURCE.toml`:

```toml
kind = "copied-skill"
source_name = "pstack"
source_repository = "https://github.com/cursor/plugins"
source_path = "pstack/skills/example-skill"
original_commit = "60c641e4fad674784b30abcf9f8915dea39df38d"
original_url = "https://github.com/cursor/plugins/tree/60c641e4fad674784b30abcf9f8915dea39df38d/pstack/skills/example-skill"
```

`SOURCE.toml` is the provenance record. It replaces the old external-skill manager and `skills-lock.json` workflow.

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
