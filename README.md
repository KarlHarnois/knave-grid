# knave-grid

A [Knave](https://github.com/knave-lang/knave) library for Swiss grids. From one spec, it generates the grid's CSS, a debug overlay, and a fit checker.

## Use

Add the library to your `project.knv`:

```lisp
(defproject my-site
  (libraries
    (knave-grid :git "https://github.com/KarlHarnois/knave-grid"
                :rev "<commit>")))
```

Define a grid with `defgrid` and write its stylesheet and fonts with `write-grid`:

```lisp
(use knave-grid defgrid write-grid)

(defgrid site-grid ()
  (fonts :from "fonts"
         (iosevka "Iosevka" (regular "iosevka-regular.woff2")))
  (body iosevka :size 18 :line-height 1.5)
  (type-areas (narrow :width 19 :column-count 1)
              (wide :width 39 :column-count 4 :margin 2)))

(deftask grid ()
  "Writes the grid's stylesheet and fonts into public/."
  (write-grid (try (site-grid)) "public/grid.css"))
```

## Develop

Run `direnv allow` once to load the [Nix](https://nixos.org/download/) dev shell, then use these commands:

```sh
knave test
knave fmt
knave task check-file-lengths
```

To see the grid, run `knave task demo` and serve `target/demo/` with any static file server. Press `g` on the page, or add `?grid` to its URL, to toggle the overlay.

The overlay's CSS and JavaScript live in `assets/`. After you edit them, run `knave task embed-assets` to copy them into `src/overlay.knv`.
