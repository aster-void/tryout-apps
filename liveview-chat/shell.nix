{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  packages = with pkgs; [
    elixir
    elixir-ls
    bun
    nodejs-slim
  ];
}
