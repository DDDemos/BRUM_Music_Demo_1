# JavaScript reference

The project defines no JavaScript classes or object methods. Its behavior consists of immediately invoked function expressions (IIFEs), private nested functions, and anonymous callbacks. Names below match the source; descriptions of anonymous handlers are not callable API names.

## `js/main.js`

[Source](../js/main.js). Loaded once at the end of every page body. Uses the browser DOM, `location`, optionally `localStorage`, and optionally `window.matchMedia`.

Before either initializer runs, `document.documentElement.classList.add('js')` marks script execution. Timeline fallback visibility no longer depends on this flag.

### `setupThemeToggle()`

**Signature:** no arguments; returns `undefined`. A named IIFE that runs immediately and is not exposed to other scripts.

Reads `brumsound-color-theme` from local storage inside a `try/catch`. Only saved values `light` and `dark` are accepted and copied to the root element's `data-color-theme` attribute. It then locates `.site-header .container`; if absent, it returns without creating a button, although the saved theme may already have been applied.

Creates a `button.theme-toggle` with `type="button"`, installs click and system-preference listeners, initializes its text and ARIA attributes, and appends it to the header. Nested helpers close over the root element and button. Storage failures are ignored so the current page can still change appearance.

### `currentTheme()`

**Signature:** no arguments; returns a string. Private to `setupThemeToggle()`.

Returns a nonempty root `data-color-theme` value if one exists. Otherwise returns `light` if `matchMedia('(prefers-color-scheme: light)')` matches, or `dark` if it does not or `matchMedia` is unavailable. It reads state without changing it. It does not independently validate an attribute supplied by other code; keep explicit attribute values to `light` or `dark`.

### `updateButton()`

**Signature:** no arguments; returns `undefined`. Private to `setupThemeToggle()`.

Calls `currentTheme()` and replaces the button's contents with a decorative `.theme-toggle-icon` and current-mode text. Dark mode displays `Night`, sets `aria-label="Switch to day theme"`, and sets `aria-pressed="true"`. Light mode displays `Day`, offers switching to night, and uses `aria-pressed="false"`. The icon has `aria-hidden="true"`.

This function updates the control only; it does not write the theme attribute or storage.

### Theme button click handler

**Signature:** anonymous listener; does not read the event argument; returns `undefined`.

Chooses the opposite of `currentTheme()`, writes `data-color-theme` to the root, attempts to persist it under `brumsound-color-theme`, and calls `updateButton()`. If persistence fails, the chosen attribute still applies to this page. There is no UI option to clear an explicit choice and return to automatic system preference.

### System color-preference change handler

**Signature:** anonymous listener; does not read the event argument; returns `undefined`.

Registered on the light-preference media query only when `matchMedia` and its returned object's `addEventListener` are available. Calls `updateButton()` only if the root lacks `data-color-theme`. CSS handles the corresponding surface colors. An explicit choice therefore takes precedence over later system changes. No legacy `addListener` fallback or cross-tab storage listener is installed.

### `markCurrentNavLink()`

**Signature:** no arguments; returns `undefined`. A named IIFE that runs immediately.

Extracts the final segment of `location.pathname`, using `index.html` for an empty segment. Iterates over `.site-nav a`, extracts the final segment of each `href`, and sets `aria-current="page"` on matching links. CSS styles that attribute.

For `/timeline.html`, the timeline link matches; for `/`, the homepage link matches. For `/bands/ub40.html`, no existing top-level link matches. The function assumes each navigation anchor has an `href`, compares filenames rather than resolved URLs, and does not remove existing `aria-current` values.

## `js/timeline.js`

[Source](../js/timeline.js). Loaded after [the album data](../data/bands.js) on [the timeline page](../timeline.html).

### Anonymous timeline initializer

**Signature:** no arguments; returns `undefined`. Runs immediately; there is no exported render function.

Requires an array `BAND_DATA` and `#timeline-diagram`. Missing data or mount, malformed band/album fields, unknown themes, or no album years cause an early return, leaving the static list visible. Years must be finite numbers. `#timeline-legend` is optional.

1. Validate data and collect album years. Round bounds to five-year intervals; extend the maximum by five if both bounds are equal.
2. Build the diagram in a document fragment, with five-year ticks on `.timeline-axis`.
3. Create a labelled section for each band in data order. Apply `data-theme`, and add a linked profile name, genre, and local photograph. Image paths follow `images/<id>.jpg`, except ELO uses `.png`.
4. Sort a copy of each band's albums by year. Draw `.timeline-release-span` from the first to the last selected release; this is not the band's lifespan.
5. Create Spotify anchors with accessible names identifying band, title, year, and the new-tab destination. Each contains a marker and a visible caption with year, album title, and decorative arrow. The CSS `--position` property locates markers precisely on the axis; captions are clamped within the plot and staggered via `--level` (album index modulo three).
6. Replace the diagram and legend contents. The legend lists encountered themes in metal, pop, reggae, cosmic order. Reveal `.timeline-wrap` after rendering.
7. Convert the static fallback container into a native `details` disclosure with a `summary`, preserving its chronological list. Without successful enhancement, the original list remains expanded. Re-running valid rendering replaces the mounts without duplicating the disclosure.

User-visible strings are inserted through `textContent` or text nodes. IDs in generated URL paths are encoded. The small-screen layout presents sorted album links vertically, without a horizontal year axis.

### `xPercent(year)`

**Input:** numeric release year. **Return:** numeric percentage along the shared axis. Private to the initializer; closes over `minYear` and `span`.

```js
return ((year - minYear) / span) * 100;
```

For the current 1965–1990 axis, 1965 maps to 0, 1970 to 20, and 1990 to 100. Callers append `%` for CSS positions. The initializer validates years and handles equal bounds before calling this helper.

### `element(tag, className, text)`

**Inputs:** HTML tag string, CSS class string, and optional text. **Return:** a newly created DOM element.

Assigns `className` and, when supplied, `textContent`. This private helper does not insert the element into the document; callers add attributes, styles, and children before mounting it.
