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

## Spec

The spec is Knave data. Plain structs come first. A `defgrid` macro that reads like a spec MAY come later, built on those structs.

Lengths are a closed set of units: `px`, `ch`, `rem`, `lines`, and `columns`. The library resolves `lines` to `rlh`, and `columns` to the width of its columns and the gutters between them, written with `--column` and `--gutter` so it follows the breakpoints.

Vertical spacing in type styles and placements takes only `lines`, so a spec cannot break the baseline grid by construction. A field for vertical spacing takes a count of lines, not a length, so an absolute unit there is a type error.

## Defaults

Root type is set in `rem` so the grid scales with the reader's font size. The defaults are 18px (112.5%) at a line-height of 1.5, which gives a 27px leading equal to `1rlh`. `grid-css` sets the root font size, so `1rem` is the body size and `1rlh` is the leading. A site that adopts the library rewrites its own `rem` values once.

The sub-unit is one third of the leading, 9px, because half the leading is not a whole pixel.

The horizontal unit is `1ch`. The default gutter is `3ch`, and the default margin is one gutter.

Each type area sets its margin in ch, and `grid-css` writes it as `--margin`. The generated `.type-area` rule makes an element as wide as the type area and centers it, with at least the margin on each side when the screen is narrower. A page puts its content in that element, and the overlay draws its layer with the same width, so the overlay's columns sit on the page's.

A type area N units wide with a gutter of g units fits k equal columns when k divides N + g. The defaults use N + g = 120 on wide screens and N + g = 60 on medium screens.

The measure defaults to `66ch`. The library warns when the measure is outside `45ch` to `75ch`, and a measure wider than the widest type area is an error. The library checks no column width, because a column can hold more than one line of text, such as a code pane or an image.

## Type styles

Phase 1 targets monospace type: body 18/27, display 36/54 and 54/81. Every line-height is a whole number of leadings.

Phase 2 adds proportional type: sizes on a 1.25 ratio scale, and line-height = ceil(size × 1.2 / sub-unit) × sub-unit.

A heading block adds up to a whole number of leadings: its lines plus the space above and below it.

The library reads font metrics from the font files at build time to place each style's baseline on the grid. It reads TrueType, OpenType and WOFF2 files, and takes each font's `hhea` ascent and descent, which Safari reads on macOS and iOS whatever the font asks for.

A baseline sits half the leading left over by the ascent and descent, plus the ascent, below the top of its line. The library rounds the ascent and descent to whole pixels and the half leading down, as Chromium does, and `grid-css` writes the body text's offset as `--baseline-offset`.

Chromium and Firefox read a font's `OS/2` typo metrics instead when the font sets the `USE_TYPO_METRICS` flag. So `font-face-css` writes each face's `@font-face` rule with `ascent-override`, `descent-override` and `line-gap-override: 0%` set from the `hhea` metrics, and every browser places the baseline the same way. Safari does not support these descriptors, which is why the library takes the metrics Safari reads. A site passes its faces to `font-face-css` instead of writing its own `@font-face` rules.

A browser check in CI loads the built pages in WebKit on macOS and fails when the body text's baseline is not at `--baseline-offset`.

The generated CSS uses `text-box-trim` behind `@supports`, with margins computed from font metrics as the fallback.

## Placements and breakpoints

A placement matches elements with a CSS selector and gives them a spatial zone: `:span n` columns, a column range `:columns (first last)`, or a subgrid.

Breakpoints are written in `em`, from narrowest to widest, and each one overrides the type area: its width, gutter, column count and margin. The spec's own type area applies below the first breakpoint. `grid-css` writes a media query per breakpoint that redefines `--gutter`, `--columns`, `--column`, `--grid-width` and `--margin`, so the `.grid` rule and the overlay follow without media queries of their own.

The check fails when a breakpoint's type area does not fit its columns, when breakpoints are out of order, and when a breakpoint is narrower than its type area plus its margin on each side. It converts ch to em with the width of the font's "0" glyph, which is what `1ch` measures, and with the 16px default font size that media queries use.

The `.grid` columns are `minmax(0, var(--column))`, so on a screen narrower than the first type area the columns shrink instead of overflowing.

A span wider than the column count at any breakpoint is a build error.

The generated placement rules sit in a cascade layer, so a site's own unlayered CSS always overrides them.

## Outputs

`grid-css` generates the CSS from a spec.

The debug overlay draws columns, gutters, modules, and baselines with `repeating-linear-gradient`. It draws each baseline at `--baseline-offset` below the top of its line. It is a layer over the whole body, so its lines scroll with the elements they measure. While the overlay is on, the body is `position: relative`. A key press, a `?grid` query parameter, or a click on an element with the `data-grid-toggle` attribute toggles the overlay, and each such element shows the overlay's state in `aria-pressed`. The overlay outlines every element that breaks the grid.

The fit checker has two parts. The first checks that every length the library generates is a whole number of grid units. The second loads built pages in a headless browser in CI and measures them.

The browser check fails the CI build on block edges off the grid and warns on text lines off the grid. An element with the `data-grid-exempt` attribute is left out of the grid measurements. The browser check also applies the WCAG 1.4.12 text spacing overrides and fails if any text clips.

The overlay and the browser check share one measurement script.

## Open questions

None yet.
