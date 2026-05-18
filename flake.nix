{
  description = "Additive pi-coding-agent resources and Home Manager module";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    home-manager.url = "github:nix-community/home-manager";
  };

  outputs = {self, ...}: {
    homeManagerModules.default = import ./nix/home-manager-module.nix {inherit self;};
    homeManagerModules.pi-spellbook = self.homeManagerModules.default;
  };
}
