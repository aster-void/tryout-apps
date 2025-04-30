let
  rust-overlay = builtins.getFlake "github:oxalica/rust-overlay";
in
  {pkgs ? import <nixpkgs> {overlays = [(import rust-overlay)];}}:
    pkgs.mkShell {
      packages = with pkgs; [
        (rust-bin.fromRustupToolchainFile ../rust-toolchain.toml)
        trunk
        just
      ];
    }
