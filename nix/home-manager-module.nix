{self}: {
  config,
  lib,
  ...
}: let
  cfg = config.programs.spellbook;
  enabled = target: builtins.elem target cfg.targets;
  skillRoot = cfg.source + "/skills";
  extensionRoot = cfg.source + "/pi/extensions";
  instructionSource = cfg.source + "/instructions/AGENTS.md";
  instructionLinks = destination: lib.optionalAttrs (builtins.pathExists instructionSource) {
    "${destination}".source = instructionSource;
  };
  visible = name: !(lib.hasPrefix "." name);
  skills = lib.filterAttrs (name: type:
    visible name && type == "directory" && builtins.pathExists (skillRoot + "/${name}/SKILL.md")
  ) (builtins.readDir skillRoot);
  extensions = lib.filterAttrs (name: type:
    visible name && (
      (type == "regular" && (lib.hasSuffix ".ts" name || lib.hasSuffix ".js" name) && !(lib.hasSuffix ".d.ts" name))
      || (type == "directory" && (builtins.pathExists (extensionRoot + "/${name}/index.ts") || builtins.pathExists (extensionRoot + "/${name}/index.js")))
    )
  ) (builtins.readDir extensionRoot);
  skillLinks = destination: lib.mapAttrs' (name: _: {
    name = "${destination}/${name}";
    value.source = skillRoot + "/${name}";
  }) skills;
  extensionLinks = lib.mapAttrs' (name: _: {
    name = "${cfg.piDir}/extensions/spellbook-${name}";
    value.source = extensionRoot + "/${name}";
  }) extensions;
in {
  options.programs.spellbook = {
    enable = lib.mkEnableOption "Spellbook instructions, skills, and Pi extensions";
    source = lib.mkOption {
      type = lib.types.path;
      default = self;
      description = "Spellbook source tree containing instructions/, skills/, and pi/extensions/.";
    };
    targets = lib.mkOption {
      type = lib.types.listOf (lib.types.enum ["codex" "claude" "pi"]);
      default = ["codex" "claude" "pi"];
      description = "Harnesses to configure. Codex and Pi share the Agent Skills directory.";
    };
    agentSkillsDir = lib.mkOption {
      type = lib.types.str;
      default = ".agents/skills";
      description = "Shared Codex/Pi skill directory, relative to the home directory.";
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
      (lib.mkIf (enabled "codex") (instructionLinks "${cfg.codexDir}/AGENTS.md"))
      (lib.mkIf (enabled "claude") (instructionLinks "${cfg.claudeDir}/CLAUDE.md"))
      (lib.mkIf (enabled "pi") (instructionLinks "${cfg.piDir}/AGENTS.md"))
      (lib.mkIf (enabled "codex" || enabled "pi") (skillLinks cfg.agentSkillsDir))
      (lib.mkIf (enabled "claude") (skillLinks "${cfg.claudeDir}/skills"))
      (lib.mkIf (enabled "pi") extensionLinks)
    ];
  };
}
