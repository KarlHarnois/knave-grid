# knave-grid

A [Knave](https://github.com/knave-lang/knave) library that generates the CSS, a debug overlay, and a fit checker for a Swiss grid from one spec.

Run `direnv allow` once to load the [Nix](https://nixos.org/download/) dev shell, then use these commands:

```sh
knave test
knave fmt
knave task check-file-lengths
```

To see the grid, run `knave task demo` and serve `target/demo/` with any static file server. Press `g` on the page, or add `?grid` to its URL, to toggle the overlay.

The overlay's CSS and JavaScript live in `assets/`. After you edit them, run `knave task embed-assets` to copy them into `src/overlay.knv`.
