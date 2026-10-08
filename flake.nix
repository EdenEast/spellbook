{
  description = "Personal agent skills and Pi extensions";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    home-manager.url = "github:nix-community/home-manager";
  };

  outputs = {self, nixpkgs, ...}: let
    systems = ["aarch64-darwin" "aarch64-linux" "x86_64-darwin" "x86_64-linux"];
    forAllSystems = nixpkgs.lib.genAttrs systems;
  in {
    devShells = forAllSystems (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      default = pkgs.mkShell {
        packages = [pkgs.nodejs_24 pkgs.git pkgs.just];
      };
    });

    checks = forAllSystems (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      installer = pkgs.runCommand "spellbook-installer-tests" {
        nativeBuildInputs = [pkgs.nodejs_24];
      } ''
        node --test ${self}/scripts/*.test.ts
        touch "$out"
      '';
    });

    homeManagerModules.default = import ./nix/home-manager-module.nix {inherit self;};
    homeManagerModules.spellbook = self.homeManagerModules.default;
  };
}
