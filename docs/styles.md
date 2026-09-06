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

Genre rules control band tints, accents, corners, and selected photo glows. Light-mode overrides change genre tints. Each timeline lane uses its own `data-theme`; legend dots use explicit genre color classes.

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

The page provides `#timeline-diagram.timeline-diagram` inside an initially hidden `.timeline-wrap` and `#timeline-legend.timeline-legend`. JavaScript locates the mounts by ID and reveals the wrapper after rendering.

- `.timeline-hero-grid`, `.timeline-photo-strip`, `.timeline-intro-meta`: introduction, decorative band photo triptych, and record/band/scene counts. Photography reuses the existing credited images.
- `.timeline-heading`: release section title and Spotify instruction.
- `.timeline-diagram`: defines `--label-width` and `--plot-inset`, shared by the axis and lanes to keep years aligned.
- `.timeline-axis`, `.timeline-tick`: five-year axis with absolute percentage positions.
- `.timeline-lane`, `.timeline-lane-label`, `.timeline-band-photo`, `.timeline-band-identity`, `.timeline-band-genre`: genre-themed band section and linked portrait/name. Images become full-color on hover.
- `.timeline-track`: plot area with grid spacing set by `--tick-step`. `.timeline-release-span` connects the first and last selected release.
- `.timeline-node`: Spotify anchor containing `.timeline-node-dot` and `.timeline-node-label`. `--position` controls exact marker position; `--level` staggers captions. Caption positions are clamped inside the plot. Both markers and captions accept pointer input; keyboard focus visibly highlights the caption.
- `.timeline-album-year`, `.timeline-album-title`, `.timeline-album-arrow`: always-visible caption contents. The arrow is decorative.
- `.timeline-legend`, `.dot`, `.dot--metal`, `.dot--pop`, `.dot--reggae`, `.dot--cosmic`: genre legend and its colored dots.
- `.timeline-fallback`: chronological text list, converted to a native `details` disclosure after successful enhancement. It is no longer hidden by the root `.js` class.

Below `46rem`, the hero stacks and band lanes become vertical lists with full-width album links, retaining colored markers and portraits. The horizontal axis is hidden, and dates remain visible on every album. Shared surface/text variables support explicit and system-selected day/night modes; existing reduced-motion rules cover transitions.
