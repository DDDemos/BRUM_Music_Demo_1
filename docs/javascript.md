# JavaScript reference

The project defines no JavaScript classes or object methods. Its behavior consists of immediately invoked function expressions (IIFEs), private nested functions, and anonymous callbacks. Names below match the source; descriptions of anonymous handlers are not callable API names.

## `js/main.js`

[Source](../js/main.js). Loaded once at the end of every page body. Uses the browser DOM, `location`, optionally `localStorage`, and optionally `window.matchMedia`.

Before either initializer runs, `document.documentElement.classList.add('js')` enables the CSS rule that hides the timeline fallback. This flag indicates script execution, not successful timeline rendering.

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

Requires the global lexical binding `BAND_DATA` and `#timeline-diagram`. It returns without rendering if the binding is undefined or the diagram mount is missing. `#timeline-legend` is optional; without it the diagram still renders.

Rendering proceeds as follows:

1. Collect every album year. Round the minimum down and maximum up to multiples of five, then compute `span = maxYear - minYear`.
2. Append `.timeline-axis` with a `9rem` left margin and `.timeline-tick` spans every five years, including both endpoints.
3. Iterate bands in data order. For each, append a `.timeline-lane` containing its name in `.timeline-lane-label` and a `.timeline-track`.
4. Iterate that band's albums in data order. Append an anchor with `.timeline-node` and `.timeline-node--<theme>`, positioned by year. Its destination is `https://open.spotify.com/album/<spotifyId>`, with `target="_blank"` and `rel="noopener"`. Its accessible label includes band, title, year, and Spotify destination.
5. Immediately after each anchor, append an `aria-hidden` `.timeline-node-label` containing the album title and two-digit year. CSS uses this sibling order to reveal the label on hover or keyboard focus.
6. Track encountered theme keys and append legend entries for known themes in this fixed order: `metal` (Metal), `pop` (Pop / New Wave), `reggae` (Reggae), `cosmic` (Orchestral / Rock). Unused themes are omitted.

Band names and album titles are inserted with `textContent`; legend captions use text nodes. The initializer appends to existing mounts without clearing them and does not change the static chronological list. Unknown theme keys still produce node classes but have no built-in color or legend entry.

### `xPercent(year)`

**Input:** numeric release year. **Return:** numeric percentage along the shared year axis. Private to the timeline initializer; closes over `minYear` and `span`.

```js
return ((year - minYear) / span) * 100;
```

With the current data, the axis is 1965–1990: `xPercent(1965)` is `0`, `xPercent(1970)` is `20`, and `xPercent(1990)` is `100`. Callers append `%` when setting `style.left` on ticks, nodes, and labels.

The helper neither clamps values nor handles invalid numbers or a zero span. Empty data yields invalid bounds; a dataset entirely at the same five-year boundary yields a zero span. Data maintenance must preserve a usable range unless rendering is updated to handle these cases.
