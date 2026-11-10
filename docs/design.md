# knave-grid design

knave-grid is a Knave library that defines a Swiss grid for static sites. A grid spec holds columns, gutters, margins, modules, a baseline, and type styles. From one spec, the library generates CSS, a debug overlay, and a fit checker. The knave-lang.org site is its first user.

A baseline is the distance between the baselines of two consecutive lines of body text. A module is a block of a whole number of baselines, spanning one or more columns.

knave-grid depends on no markdown library, and no markdown library depends on knave-grid. A site that uses both composes them.

## Spec

The spec is Knave data. Plain structs come first. A `defgrid` macro that reads like a spec MAY come later, built on those structs.

Lengths are a closed set of units: `px`, `ch`, `rem`, `lines`, and `columns`. The library resolves `lines` and `columns` to real lengths.

Vertical spacing in type styles and placements takes only `lines`, so a spec cannot break the baseline by construction.

## Defaults

Root type is set in `rem` so the grid scales with the reader's font size. The defaults are 18px (112.5%) at a leading of 1.5, which gives a 27px baseline equal to `1rlh`.

The sub-unit is one third of the baseline, 9px, because half the baseline is not a whole pixel.

The horizontal unit is `1ch`. The default gutter is `3ch`.

A column lattice of N units with a gutter of g units fits k equal columns when k divides N + g. The defaults use N + g = 120 on wide screens and N + g = 60 on medium screens.

The text measure targets `66ch`. The library warns outside `45ch` to `75ch`.

## Type styles

Phase 1 targets monospace type: body 18/27, display 36/54 and 54/81. Every line-height is a whole number of baselines.

Phase 2 adds proportional type: sizes on a 1.25 ratio scale, and line-height = ceil(size × 1.2 / sub-unit) × sub-unit.

A heading block adds up to a whole number of baselines: its lines plus the space above and below it.

The library reads font metrics from the font files at build time to place each style's baseline on the grid.

The generated CSS uses `text-box-trim` behind `@supports`, with margins computed from font metrics as the fallback.

## Placements and breakpoints

A placement matches an element and gives it `:span n` columns, a column range `:columns (first last)`, or a subgrid.

Breakpoints are written in `em` and override the column count.

A span wider than the column count at any breakpoint is a build error.

## Outputs

`grid-css` generates the CSS from a spec.

The debug overlay draws columns, gutters, modules, and baselines with `repeating-linear-gradient`. A key press or a `?grid` query parameter toggles the overlay. The overlay outlines every element that breaks the grid.

The fit checker has two parts. The first checks that every length the library generates is a whole number of grid units. The second loads built pages in a headless browser in CI and measures them.

The browser check fails on block edges off the grid and warns on text lines off the grid. The browser check also applies the WCAG 1.4.12 text spacing overrides and fails if any text clips.

The overlay and the browser check share one measurement script.

## Open questions

- Does a placement match CSS selectors, or class names that the library defines?
- Is an absolute unit where `lines` is expected a type error or a warning?
- Does a fit violation in CI fail the build or warn?
