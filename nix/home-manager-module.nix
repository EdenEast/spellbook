{self}: {
  config,
  lib,
  pkgs,
  ...
}: let
  cfg = config.programs.pi-spellbook;
  hasPiPackage = lib.hasAttrByPath ["pi-coding-agent"] pkgs;
  defaultPiPackage =
    if hasPiPackage
    then lib.getAttrFromPath ["pi-coding-agent"] pkgs
    else null;
  sourceRoot = "${self}/source";

  enabledResourceLinks = lib.filterAttrs (_: v: v.enable) cfg.sources;
  sourceLink = name: _cfg: {
    name = "${cfg.piDir}/${name}/spellbook";
    value = {
      source = "${sourceRoot}/${name}";
      recursive = false;
    };
  };
in {
  options.programs.pi-spellbook = {
    enable = lib.mkEnableOption "spellbook additive resources for pi-coding-agent";

    package = lib.mkOption {
      type = lib.types.nullOr lib.types.package;
      default = defaultPiPackage;
      defaultText = lib.literalExpression "pkgs.pi-coding-agent if available, otherwise null";
      description = ''
        pi-coding-agent package to install. Override this if your nixpkgs does not
        provide pkgs.pi-coding-agent or if you package pi separately.
      '';
    };

    installPackage = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Whether to install the configured pi-coding-agent package.";
    };

    piDir = lib.mkOption {
      type = lib.types.str;
      default = ".pi/agent";
      description = "Pi configuration directory relative to the user's home directory.";
    };

    sources = {
      extensions.enable = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = "Link spellbook extensions into the pi config directory.";
      };

      skills.enable = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = "Link spellbook skills into the pi config directory.";
      };

      prompts.enable = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = "Link spellbook prompt templates into the pi config directory.";
      };

      themes.enable = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = "Link spellbook themes into the pi config directory.";
      };
    };
  };

  config = lib.mkIf cfg.enable {
    assertions = [
      {
        assertion = !cfg.installPackage || cfg.package != null;
        message = ''
          programs.pi-spellbook.installPackage is true, but no default pi package
          was found. Set programs.pi-spellbook.package to your pi package, or set
          programs.pi-spellbook.installPackage = false.
        '';
      }
    ];

    home.packages = lib.mkIf cfg.installPackage [cfg.package];

    home.file = lib.mapAttrs' sourceLink enabledResourceLinks;
  };
}
