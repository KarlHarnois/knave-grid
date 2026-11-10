# knave-grid design

knave-grid is a Knave library that defines a Swiss grid for static sites. A grid spec holds a type area of columns and gutters, margins, rows of modules, a baseline grid, and type styles. From one spec, the library generates CSS, a debug overlay, and a fit checker. The knave-lang.org site is its first user.

knave-grid depends on no markdown library, and no markdown library depends on knave-grid. A site that uses both composes them.

## Terms

The library names its parts with the terms of the Swiss grid tradition, as Josef Müller-Brockmann and Emil Ruder use them.

- The **type area** (*Satzspiegel*) is the part of the page that holds text. It has a width, a column count, and a gutter.
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

Lengths are a closed set of units: `px`, `ch`, `rem`, `lines`, and `columns`. The library resolves `lines` and `columns` to real lengths.

Vertical spacing in type styles and placements takes only `lines`, so a spec cannot break the baseline grid by construction. A field for vertical spacing takes a count of lines, not a length, so an absolute unit there is a type error.

## Defaults

Root type is set in `rem` so the grid scales with the reader's font size. The defaults are 18px (112.5%) at a line-height of 1.5, which gives a 27px leading equal to `1rlh`. `grid-css` sets the root font size, so `1rem` is the body size and `1rlh` is the leading. A site that adopts the library rewrites its own `rem` values once.

The sub-unit is one third of the leading, 9px, because half the leading is not a whole pixel.

The horizontal unit is `1ch`. The default gutter is `3ch`.

A type area N units wide with a gutter of g units fits k equal columns when k divides N + g. The defaults use N + g = 120 on wide screens and N + g = 60 on medium screens.

The measure defaults to `66ch`. The library warns when the measure is outside `45ch` to `75ch`, and a measure wider than the type area is an error. The library checks no column width, because a column can hold more than one line of text, such as a code pane or an image.

## Type styles

Phase 1 targets monospace type: body 18/27, display 36/54 and 54/81. Every line-height is a whole number of leadings.

Phase 2 adds proportional type: sizes on a 1.25 ratio scale, and line-height = ceil(size × 1.2 / sub-unit) × sub-unit.

A heading block adds up to a whole number of leadings: its lines plus the space above and below it.

The library reads font metrics from the font files at build time to place each style's baseline on the grid.

The generated CSS uses `text-box-trim` behind `@supports`, with margins computed from font metrics as the fallback.

## Placements and breakpoints

A placement matches elements with a CSS selector and gives them a spatial zone: `:span n` columns, a column range `:columns (first last)`, or a subgrid.

Breakpoints are written in `em` and override the column count.

A span wider than the column count at any breakpoint is a build error.

The generated placement rules sit in a cascade layer, so a site's own unlayered CSS always overrides them.

## Outputs

`grid-css` generates the CSS from a spec.

The debug overlay draws columns, gutters, modules, and baselines with `repeating-linear-gradient`. It is a layer over the whole body, so its lines scroll with the elements they measure. While the overlay is on, the body is `position: relative`. A key press or a `?grid` query parameter toggles the overlay. The overlay outlines every element that breaks the grid.

The fit checker has two parts. The first checks that every length the library generates is a whole number of grid units. The second loads built pages in a headless browser in CI and measures them.

The browser check fails the CI build on block edges off the grid and warns on text lines off the grid. An element with the `data-grid-exempt` attribute is left out of the grid measurements. The browser check also applies the WCAG 1.4.12 text spacing overrides and fails if any text clips.

The overlay and the browser check share one measurement script.

## Open questions

- Until font metrics land, does the overlay draw the edges of each line slot, or lines labeled as approximate baselines?
