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
              (wide :width 39 :column-count 4 :margin 2))
  (type-styles (title :lines 2 :selector ".prose h1")))

(deftask grid ()
  "Writes the grid's stylesheet and fonts into public/."
  (write-grid (try (site-grid)) "public/grid.css"))
```

Each type style writes a `.type-<name>` class. Give it a `:selector` to apply the same style to markup that has no class, such as rendered markdown.

## Develop

Run `direnv allow` once to load the [Nix](https://nixos.org/download/) dev shell, then use these commands:

```sh
knave test
knave fmt
knave task check-file-lengths
```

To see the grid, run `knave task serve-demo` and open http://127.0.0.1:8001. It rebuilds the demo when a file in `demo/` or `tasks/demo/` changes. Restart it after you change `src/` or the grid in `tasks/demo/grid.knv`. Press `g` on the page, or add `?grid` to its URL, to toggle the overlay.

The overlay's CSS and JavaScript live in `assets/`. After you edit them, run `knave task embed-assets` to copy them into `src/overlay.knv`.
