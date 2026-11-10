# knave-grid

A [Knave](https://github.com/knave-lang/knave) library that generates the CSS, a debug overlay, and a fit checker for a Swiss grid from one spec.

Run `direnv allow` once to load the [Nix](https://nixos.org/download/) dev shell, then use these commands:

```sh
knave test
knave fmt
```

The overlay's CSS and JavaScript live in `assets/`. After you edit them, run `knave task embed-assets` to copy them into `src/overlay.knv`.
