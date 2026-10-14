{self}: {
  config,
  lib,
  ...
}: let
  cfg = config.programs.spellbook;
  enabled = target: builtins.elem target cfg.targets;
  extensionRoot = cfg.source + "/pi/extensions";
  instructionSource = cfg.source + "/instructions/AGENTS.md";
  referenceSource = cfg.source + "/references";
  referenceLinks = lib.optionalAttrs (builtins.pathExists referenceSource) {
    ".agents/references/spellbook".source = referenceSource;
  };
  instructionLinks = destination: lib.optionalAttrs (builtins.pathExists instructionSource) {
    "${destination}".source = instructionSource;
  };
  visible = name: !(lib.hasPrefix "." name);
  extensions = lib.filterAttrs (name: type:
    visible name && (
      (type == "regular" && (lib.hasSuffix ".ts" name || lib.hasSuffix ".js" name) && !(lib.hasSuffix ".d.ts" name))
      || (type == "directory" && (builtins.pathExists (extensionRoot + "/${name}/index.ts") || builtins.pathExists (extensionRoot + "/${name}/index.js")))
    )
  ) (builtins.readDir extensionRoot);
  extensionLinks = lib.mapAttrs' (name: _: {
    name = "${cfg.piDir}/extensions/spellbook-${name}";
    value.source = extensionRoot + "/${name}";
  }) extensions;
in {
  options.programs.spellbook = {
    enable = lib.mkEnableOption "Spellbook instructions, references, and Pi extensions";
    source = lib.mkOption {
      type = lib.types.path;
      default = self;
      description = "Spellbook source tree containing instructions/, references/, and pi/extensions/.";
    };
    targets = lib.mkOption {
      type = lib.types.listOf (lib.types.enum ["codex" "claude" "pi"]);
      default = ["codex" "claude" "pi"];
      description = "Harnesses to configure.";
    };
    claudeDir = lib.mkOption {
      type = lib.types.str;
      default = ".claude";
      description = "Claude configuration directory, relative to the home directory.";
    };
    codexDir = lib.mkOption {
      type = lib.types.str;
      default = ".codex";
      description = "Codex configuration directory, relative to the home directory.";
    };
    piDir = lib.mkOption {
      type = lib.types.str;
      default = ".pi/agent";
      description = "Pi agent directory, relative to the home directory.";
    };
  };

  config = lib.mkIf cfg.enable {
    home.file = lib.mkMerge [
      (lib.mkIf (cfg.targets != []) referenceLinks)
      (lib.mkIf (enabled "codex") (instructionLinks "${cfg.codexDir}/AGENTS.md"))
      (lib.mkIf (enabled "claude") (instructionLinks "${cfg.claudeDir}/CLAUDE.md"))
      (lib.mkIf (enabled "pi") (instructionLinks "${cfg.piDir}/AGENTS.md"))
      (lib.mkIf (enabled "pi") extensionLinks)
    ];
  };
}
