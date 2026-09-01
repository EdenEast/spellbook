# spellbook

Additive agent resources for pi, Claude Code, and Codex, packaged for reproducible installs and local iteration.

## Install

Use one installer for Pi, Claude Code, and Codex. It detects which CLIs are on your `PATH` and links spellbook into only those harnesses' own configuration directories. It never uses `~/.agents`.

```sh
just install                         # link every detected harness
just install pi                      # link only Pi
just uninstall codex                 # remove only Codex links
scripts/install.sh status            # inspect managed links
scripts/install.sh install --target pi
scripts/install.sh install --dry-run
scripts/install.sh install --backup
scripts/install.sh install --force
```

By default, a missing CLI is reported and skipped. Use `--target pi`, `--target claude`, or `--target codex` to configure a specific harness, including one that is not currently on your `PATH`. The installer refuses conflicts unless you choose `--backup` or `--force`.

Pi gets its shared `AGENTS.md` plus additive, namespaced links for extensions, skills, prompts, and themes. In particular, its extensions link is:

```text
${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/extensions/spellbook -> source/extensions
```

This exposes the Pi-specific extensions in this repository without registering a global Pi package. Run `npm install` separately when those extensions need this repository's Node dependencies. `just shim-node-modules` remains available for Pi installations that need local module shims.

Claude Code receives one link per skill because it discovers immediate children of its `skills` directory. Codex retains its existing `AGENTS.md` and whole-skills-directory links:

```text
${CODEX_HOME:-$HOME/.codex}/AGENTS.md -> source/AGENTS.md
${CODEX_SKILLS_DIR:-${CODEX_HOME:-$HOME/.codex}/skills} -> source/skills
```

Set `PI_BIN`, `CLAUDE_BIN`, or `CODEX_BIN` to use a non-default executable for detection. Set `PI_CODING_AGENT_DIR`, `CLAUDE_CODE_DIR`, `CODEX_HOME`, or `CODEX_SKILLS_DIR` to choose a non-default configuration directory. `SPELLBOOK_SOURCE` sets a common source checkout; the existing `SPELLBOOK_PI_SOURCE`, `SPELLBOOK_CODEX_SOURCE`, and `SPELLBOOK_SKILLS_SOURCE` overrides still work.

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
