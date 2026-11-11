# knave-grid design

knave-grid is a Knave library that defines a Swiss grid for static sites. A grid spec holds a type area of columns and gutters, margins, rows of modules, a baseline grid, and type styles. From one spec, the library generates CSS, a debug overlay, and a fit checker. The knave-lang.org site is its first user.

knave-grid depends on no markdown library, and no markdown library depends on knave-grid. A site that uses both composes them.

## Terms

The library names its parts with the terms of the Swiss grid tradition, as Josef Müller-Brockmann and Emil Ruder use them.

- The **type area** (*Satzspiegel*) is the part of the page that holds text. It has a width, a column count, a gutter, and a margin.
- A **column** is a vertical division of the type area. A **row** is a horizontal division.
- A **gutter** is the space between two columns or two rows. A **margin** is the space between the type area and the edge of the page.
- A **baseline** is the line that the letters of a line of text sit on.
- The **leading** is the distance between the baselines of two consecutive lines of body text. The **line-height** is the CSS property that sets the leading of a type style, as a ratio of its font size or as a length.
- The **baseline grid** is the set of lines one leading apart that body text sits on.
- A **module** (Müller-Brockmann's *field*) is one cell where a column crosses a row. A row's height is a whole number of leadings.
- A **spatial zone** is a group of adjacent modules that one element fills.
- The **measure** is the length of a line of text.
- A **square** is the grid's unit: one leading tall and one leading wide.

## Spec

A site writes its grid with the `defgrid` macro, the one way into the library:

```lisp
(defgrid site ()
  (fonts :from "static/fonts"
    (iosevka "Iosevka" (regular "iosevka-regular.woff2") (bold "iosevka-bold.woff2")))
  (body iosevka :size 18 :line-height 1.5)
  (type-areas (narrow :width 19 :column-count 1)
              (wide :width 39 :column-count 4 :margin 2))
  (type-styles (headline :lines 3 :weight bold)))
```

`site` is a function that reads the fonts, builds the spec and checks it, and returns the checked grid, a font error or the check error, so a site cannot skip the check. A site passes the checked grid to `write-grid` with the path of the stylesheet to write, such as `(write-grid (ref grid) "public/grid.css")`, and `write-grid` copies each font file the grid uses into a `fonts` folder beside it. The stylesheet loads them by relative URL, so a site never states where its fonts are served and only has to publish the stylesheet's folder whole. Each font names its weights, `light`, `regular`, `medium` or `bold`, and their files, which the build reads from `:from`. Each clause in `type-areas` and `type-styles` starts with the part's name, and the rest are the struct's own fields, so the constructor reports a missing or unknown field. The `defgrid` function takes parameters, which its clauses can use, as the demo does to build the same grid with two body fonts. The library exports `defgrid`, `write-grid`, the overlay assets, the checked grid and the error and warning types, and nothing else.

Vertical spacing in type styles and placements takes only `lines`, so a spec cannot break the baseline grid by construction. A field for vertical spacing takes a count of lines, not a length, so an absolute unit there is a type error.

## Defaults

Root type is set in `rem` so the grid scales with the reader's font size. The defaults are 18px (112.5%) at a line-height of 1.5, which gives a 27px leading equal to `1rlh`. `grid-css` sets the root font size, so `1rem` is the body size and `1rlh` is the leading. A site that adopts the library rewrites its own `rem` values once.

`grid-css` writes custom properties of two kinds. `--leading`, `--columns`, `--column`, `--gutter` and `--measure` are the public ones a site uses in its own CSS, and a site sets `--field-lines` on a field. Every other property starts with `--_grid-` and belongs to the generated rules and the overlay, so it can change between versions.

The sub-unit is one third of the leading, 9px, because half the leading is not a whole pixel.

The grid's unit is the square: one leading tall and one leading wide, so the font size sets the leading and the leading sets every other measure. The type area's width, gutter, side margins, and head and foot margins are whole squares, and `grid-css` writes them in `rlh`. The measure is a whole number of columns, and only its target stays in ch, because it counts characters. When the body font is monospace, as its `post` table says, a square must also be a whole number of characters wide, so every column holds whole characters. The default gutter and side margin are one square, and the default head and foot margins are two. The square follows Karl Gerstner's unit for *Capital*, one line of body type used in both directions. It is not Müller-Brockmann's module, which is one field, a column wide and a whole number of lines tall.

Each type area sets its side margin in squares, and `grid-css` writes it as `--_grid-margin`. The generated `.type-area` rule makes an element as wide as the type area and centers it, with at least the margin on each side when the screen is narrower. A page puts its content in that element, and the overlay draws its layer with the same width, so the overlay's columns sit on the page's.

The page's top and bottom edges are baselines too. Each type area's head margin is the number of squares from the top edge to the first baseline, and its foot margin the number of squares from the last baseline to the bottom edge, both at least one, and each type area sets its own. The generated `.type-area` rule pads its content by those amounts less the space a line box keeps above and below its baseline, so a page built in it is a whole number of lines tall and ends flush on a baseline. The overlay counts its baselines from the top edge and marks the bottom edge.

A type area N squares wide with a gutter of g squares fits k equal columns when k divides N + g. The defaults use N + g = 40 squares on wide screens and N + g = 20 on medium screens.

Each type area sets its measure as a number of its columns, gutters included, with `:measure-columns`, so a paragraph ends on a column edge, as a picture or a heading does. When a type area leaves it out, the library picks the widest span that holds at most 66 characters, and at least one column. The target is fixed: a type area that needs another span names it. `grid-css` writes the span's width as `--measure` for each type area. The library warns, naming the screen width, when a span holds fewer than 45 or more than 75 characters, and a span wider than the type area's columns is an error. The library checks no column width, because a column can hold more than one line of text, such as a code pane or an image.

## Type styles

Phase 1 targets monospace type: body 18/27, display 36/54 and 54/81. Every line-height is a whole number of leadings.

A type style names how many grid lines tall it is. Its font size is that many times the body size unless the spec sets one, and its line-height is that many leadings. `grid-css` writes it as a `.type-<name>` class. The class shifts the text with `position: relative`, so its baseline lands on a body baseline in its block and the block keeps its height. That is the last line of the block unless the style names another with `:baseline-line`, so a heading sits closer to the text that follows it than to the text above. The check fails on a style with no lines, on a baseline line outside the style's lines, and on a style whose glyphs are taller than its lines.

A type style MAY name a font family, and then its class sets that family and every baseline calculation for it uses the family's metrics. Without one, it uses the body font.

Browsers round font metrics at the size they render, which depends on the reader's default font size. So the generated CSS computes the body baseline and each style's shift in the browser with `round()`, behind `@supports (top: round(1px, 1px))`, and keeps the values computed at the spec's size as the fallback.

Phase 2 adds proportional type: sizes on a 1.25 ratio scale, and line-height = ceil(size × 1.2 / sub-unit) × sub-unit.

A heading block adds up to a whole number of leadings: its lines plus the space above and below it.

The body names a font and a weight, `regular` unless it says otherwise, and the check fails when the font has no file of that weight, so the metrics that place the baseline come from the face the page renders. `grid-css` sets the body's family and weight on the root and writes an `@font-face` rule for each file of each font the spec uses. A type style can name its own font and weight. Font metrics never appear in the API. The library reads font metrics from the font files at build time to place each style's baseline on the grid. It reads TrueType, OpenType and WOFF2 files, and takes each font's `hhea` ascent and descent, which Safari reads on macOS and iOS whatever the font asks for.

A baseline sits half the leading left over by the ascent and descent, plus the ascent, below the top of its line. The library rounds the ascent and descent to whole pixels and the half leading down, as Chromium does, and `grid-css` writes the body text's offset as `--_grid-baseline-offset`.

Chromium and Firefox read a font's `OS/2` typo metrics instead when the font sets the `USE_TYPO_METRICS` flag. So `grid-css` writes each face's `@font-face` rule with `ascent-override`, `descent-override` and `line-gap-override: 0%` set from the `hhea` metrics, and every browser places the baseline the same way. Safari does not support these descriptors, which is why the library takes the metrics Safari reads. A site does not write its own `@font-face` rules for the grid's families.

A browser check in CI loads the built pages in WebKit on macOS and fails when the body text's baseline is not at `--_grid-baseline-offset`.

The generated CSS uses `text-box-trim` behind `@supports`, with margins computed from font metrics as the fallback.

## Placements and type areas

A placement matches elements with a CSS selector and gives them a spatial zone: `:span n` columns, a column range `:columns (first last)`, or a subgrid.

A spec lists its type areas from narrowest to widest. Each type area has a name, such as `narrow` or `wide`, that says which screens it is for, and the check names it in every message. The first applies on every screen, shrinking when the screen is narrower than it. Each later one takes over once the screen is as wide as the type area plus its margin on each side, so a spec never names a breakpoint: to start a type area later, give it wider margins. `grid-css` writes a media query per later type area that redefines `--gutter`, `--columns`, `--column`, `--_grid-grid-width`, `--_grid-margin` and `--measure`, so the `.grid` rule and the overlay follow without media queries of their own.

The check fails when a spec has no type area, when two type areas share a name, when a type area does not fit its columns, and when a later type area needs no more width than the one before it. It converts squares to em with the leading and the 16px default font size that media queries use, and counts a span's characters through the width of the font's "0" glyph, which is what `1ch` measures.

The `.grid` columns are `minmax(0, var(--column))`, so on a screen narrower than the first type area the columns shrink instead of overflowing.

A span wider than the column count of any type area is a build error.

The generated placement rules sit in a cascade layer, so a site's own unlayered CSS always overrides them.


## Picture fields

Pictures follow Müller-Brockmann's rule in *Grid Systems in Graphic Design* (1981, p. 65): a picture's top edge lines up with the tops of the capitals in the first line of its field, and its bottom edge with the descenders of the last line. A field is a whole number of lines, and fields are separated by whole empty lines, never half lines (pp. 58–59).

The library reads each font's cap height from its `OS/2` table and its descender from `hhea`, and `grid-css` writes `--_grid-cap-top` and `--_grid-descender-bottom`, the distances from the top of a line to its cap line and its descender line. The generated `.field` class spans `--field-lines` lines. Its padding puts its content box between the first line's cap line and the last line's descender line, and its border box stays a whole number of lines tall, so the content after it stays on the grid. The overlay can draw the cap and descender lines as guides, off by default.

## Outputs

`grid-css` generates the CSS from a spec.

The debug overlay draws columns, gutters, modules, and baselines with one `linear-gradient` tile per leading and per column, repeated. A single `repeating-linear-gradient` over the whole page drops lines at fractional device pixel ratios. It draws each baseline at `--_grid-baseline-offset` below the top of its line. Its cap and descender guides are a separate layer, off by default and independent of the grid: they show whenever the root element has the class `grid-guides`, which a `?guides` query parameter or a click on an element with `data-grid-guides-toggle` toggles. It is a layer over the whole body, so its lines scroll with the elements they measure. While the overlay is on, the body is `position: relative`. A key press, a `?grid` query parameter, or a click on an element with the `data-grid-toggle` attribute toggles the overlay, and each such element shows the overlay's state in `aria-pressed`. The overlay outlines every element that breaks the grid.

The fit checker has two parts. The first checks that every length the library generates is a whole number of grid units. The second loads built pages in a headless browser in CI and measures them.

The browser check fails the CI build on block edges off the grid and warns on text lines off the grid. An element with the `data-grid-exempt` attribute is left out of the grid measurements. The browser check also applies the WCAG 1.4.12 text spacing overrides and fails if any text clips.

The overlay and the browser check share one measurement script.

## Open questions

None yet.
