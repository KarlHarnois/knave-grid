# knave-grid

A [Knave](https://github.com/knave-lang/knave) library that generates the CSS, a debug overlay, and a fit checker for a Swiss grid from one spec.

Run `direnv allow` once to load the [Nix](https://nixos.org/download/) dev shell, then use these commands:

```sh
knave test
knave fmt
knave task check-file-lengths
```

To see the grid, run `knave task serve-demo` and open http://127.0.0.1:8001. It rebuilds the demo when a file in `demo/` or `tasks/demo/` changes. Restart it after you change `src/` or the grid in `tasks/demo/grid.knv`. Press `g` on the page, or add `?grid` to its URL, to toggle the overlay.

The overlay's CSS and JavaScript live in `assets/`. After you edit them, run `knave task embed-assets` to copy them into `src/overlay.knv`.
