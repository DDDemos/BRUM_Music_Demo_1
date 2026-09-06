# CSS classes and themes

[css/base.css](../css/base.css) defines the shared layout and components. [css/themes.css](../css/themes.css), loaded second, defines genre-specific overrides and timeline presentation. CSS classes are styling hooks, not JavaScript classes.

## Theme attributes and custom properties

`data-color-theme="light"` or `"dark"` belongs on the root `<html>` element and controls the global appearance. With the attribute absent, CSS follows `prefers-color-scheme: light`, defaulting to dark otherwise. `main.js` manages the attribute and saved preference.

`data-theme="metal|pop|reggae|cosmic"` identifies a genre. Band pages apply it to `<body>`; homepage cards apply it to `.band-card-body`. Custom properties inherit into descendants, so a card body's genre variables do not propagate upward to its parent `.band-card`.

Key custom properties are:

- `--bg`, `--bg-elevated`, `--bg-card`, `--text`, `--text-muted`, `--border`: shared surfaces and text colors.
- `--accent`, `--accent-2`: site-wide accents.
- `--accent-band`, `--accent-band-2`, `--band-tint`, `--shape-radius`: genre-specific values. `--accent-band-2` is defined but has no current `var()` consumer.
- `--font-display`, `--font-body`: Big Shoulders Display and Archivo, with local fallback fonts.
- `--container`: shared maximum content width, currently `72rem`.

Genre rules control band tints, accents, corners, and selected photo glows. Light-mode overrides change genre tints. The timeline uses explicit genre color classes because its page contains several genres and has no single body theme.

## Shared page classes

- `.container`: centered width constraint and horizontal padding.
- `.site-header`, `.site-logo`, `.site-nav`: sticky header, branding, and navigation. `.site-nav a[aria-current="page"]` highlights the link marked by JavaScript.
- `.theme-toggle`, `.theme-toggle-icon`: dynamically inserted appearance control and decorative icon. JavaScript requires `.site-header .container` as its insertion point.
- `.site-footer`: shared attribution/footer layout.
- `.skip-link`: initially off-screen link revealed on focus; page markup targets `#main`.
- `.visually-hidden`: utility for visually hiding content without `display: none`; available for accessible text.
- `.btn`, `.btn-outline`: anchor button styles; use the latter alongside `.btn` for the outlined variant.
- `.section`, `.section-tight`: section spacing; `.eyebrow` and `.lede` style introductory copy (`.lede` is styled under `.hero p`).

Global `:focus-visible` rules provide keyboard focus outlines. Reduced-motion media queries disable smooth scrolling and substantially shorten animations/transitions; the collage also suppresses hover scaling.

## Homepage classes

- `.hero`, `.hero-grid`: introductory region and two-column copy/image layout, stacking below `58rem`.
- `.hero-collage`, `.collage-tile`, `.ct-1` through `.ct-8`: image grid, duotone treatment, and per-image placement. `--tilt` controls rotation and `--tile-tint` the overlay. Below `30rem`, the collage uses four columns and hides selected decorative tiles.
- `.band-grid`: responsive directory grid with a `15.5rem` minimum card width.
- `.band-card`, `.band-card-media`, `.band-card-body`: linked profile card, fixed-ratio image wrapper, and text area.
- `.badge`, `.meta`: genre badge and formation summary; the `.meta` rule is scoped to `.band-card`.

## Band and about page classes

- `.band-hero`, `.band-hero-grid`: tinted profile introduction, with a two-column grid that stacks below `46rem`.
- `.band-photo`, `.photo-credit`: photograph frame and attribution caption.
- `.meta-list`: grid for definition-list metadata; `.members`: lineup list.
- `.discography`, `.album-card`, `.album-year`: responsive album grid, card shell, and release-year text. The grid uses a `17rem` minimum column width.
- `.spotify-embed`, `.spotify-link`: iframe wrapper and direct album link. The wrapper's iframe rule sets full width; each HTML iframe supplies its other attributes.
- `.credit-list`: styled list of image credits on the about page.

## Timeline classes and DOM contracts

The page provides `#timeline-diagram.timeline-diagram` inside `.timeline-wrap` and `#timeline-legend.timeline-legend`. JavaScript locates them by ID; CSS styles them by class.

- `.timeline-wrap`: horizontally scrollable viewport.
- `.timeline-diagram`: positioned diagram with a `64rem` minimum width.
- `.timeline-axis`, `.timeline-tick`: axis and absolutely positioned year marks. The script assigns the axis a `9rem` left margin.
- `.timeline-lane`, `.timeline-lane-label`, `.timeline-track`: band row, sticky `9rem` label, and remaining plotting area. Keep label width and the script's axis margin synchronized.
- `.timeline-node`: positioned Spotify anchor, enlarged on hover or keyboard focus. `.timeline-node--metal`, `--pop`, `--reggae`, and `--cosmic` provide colors (each suffix forms a complete class such as `.timeline-node--pop`).
- `.timeline-node-label`: hidden visual album caption, revealed by `.timeline-node:hover + .timeline-node-label` or the equivalent `:focus-visible` selector. It must immediately follow its corresponding node. JavaScript supplies the accessible name on the anchor and hides the caption from assistive technology.
- `.timeline-legend`, `.dot`, `.dot--metal`, `.dot--pop`, `.dot--reggae`, `.dot--cosmic`: legend layout and genre markers; dot styles are scoped beneath `.timeline-legend`.
- `.timeline-fallback`: static chronological list. `.js .timeline-fallback` hides it with `display: none`; see the [review notes](README.md#review-notes-and-current-limitations) for the implications of the root `.js` flag.
