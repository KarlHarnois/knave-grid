{
  description = "knave-grid, a Swiss grid library for static sites";

  inputs = {
    knave.url = "github:knave-lang/knave/v0.13.0";
    nixpkgs.follows = "knave/nixpkgs";
  };

  outputs =
    { knave, nixpkgs, ... }:
    {
      devShells = nixpkgs.lib.genAttrs [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" ] (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            packages = [ knave.packages.${system}.default ];
          };
        }
      );
    };
}
