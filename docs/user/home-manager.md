# Install with Home Manager

Add Spellbook as an input in your flake, then import its module in your Home
Manager configuration:

```nix
{
  imports = [ inputs.spellbook.homeManagerModules.default ];

  programs.spellbook = {
    enable = true;
    targets = [ "codex" "claude" "pi" ];
    # Defaults, relative to your home directory:
    # codexDir = ".codex";
    # claudeDir = ".claude";
    # piDir = ".pi/agent";
  };
}
```

Use either Home Manager or the [checkout installer](install.md) to manage a
destination. Do not assign the same destination to both.

For T3 remote development, configure the remote execution account. Ensure that
the T3 backend can find the required executables. A local development shell
does not configure the remote service environment.

## Module options

The module exports are `homeManagerModules.default` and
`homeManagerModules.spellbook`; both refer to the same module.
These options live under `programs.spellbook`:

| Option | Default | Meaning |
| --- | --- | --- |
| `enable` | `false` | Enable resource links. |
| `source` | Spellbook flake source | Source tree containing the resources. |
| `targets` | `[ "codex" "claude" "pi" ]` | Agents to configure. |
| `codexDir` | `".codex"` | Codex configuration directory. |
| `claudeDir` | `".claude"` | Claude Code configuration directory. |
| `piDir` | `".pi/agent"` | Pi agent directory. |

Directory options are relative to your home directory. Shared references always
use `.agents/references/spellbook` when at least one target is selected.

Skills use the same discovery rules and names as the checkout installer.
Codex and Pi share `.agents/skills/`; Claude uses `${claudeDir}/skills/`.
The shared skill directory is fixed, like the shared reference location.

The module links individual resources from the pinned source. It does not install
agent executables or manage their settings. Extensions that require npm
dependencies need packaging before deployment through Nix.

The implementation is in [home-manager-module.nix](../../nix/home-manager-module.nix).
