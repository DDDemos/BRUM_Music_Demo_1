# Developer documentation

BrumSound is a collection of standalone HTML pages enhanced by two small JavaScript scripts. This documentation describes the checked-in implementation.

## Reference guides

- [JavaScript functions and event handlers](javascript.md): initialization, inputs, return values, DOM dependencies, and side effects.
- [Data and content maintenance](data-and-content.md): the `BAND_DATA` shape and steps for updating the site.
- [CSS classes and themes](styles.md): shared page components, theme attributes, and timeline styling contracts.
- [Project README](../README.md): overview, local setup, and directory layout.

## Page lifecycle

Every page loads `css/base.css` followed by `css/themes.css`. Static HTML supplies the navigation and content. Scripts appear at the end of the body, after the elements they operate on.

Every page loads `js/main.js`. It adds the `js` class to the root HTML element, initializes the theme toggle, and marks navigation links whose filename matches the current page.

The timeline page then loads `data/bands.js`, followed by `js/timeline.js`. The latter reads `BAND_DATA` and appends a year axis, band lanes, album links, and a genre legend. These are classic scripts, not ES modules; preserve their order and do not add `async` independently.

Band pages do not read `BAND_DATA`. Their album cards and Spotify iframes are written directly in HTML. The homepage cards and timeline's chronological list are also maintained directly in HTML. There is no checked-in generator, backend, database, or router.

## Review notes and current limitations

- **Timeline fallback visibility:** `main.js` adds `.js` immediately, and `.js .timeline-fallback` in `themes.css` uses `display: none`. The list remains in the DOM but is hidden visually and from the accessibility tree when that rule applies. If data or timeline rendering fails after `main.js` runs, the list remains hidden. The comment in `timeline.js` about the list remaining in the DOM does not mean it remains available to assistive technology.
- **Timeline data assumptions:** rendering assumes valid album arrays, numeric years, and a nonzero rounded year range. Empty or malformed data is not validated. Albums at the same year in one band overlap; there is no collision handling.
- **One-time initialization:** scripts append elements without checking for existing controls or clearing mounts. Running them again can duplicate buttons, listeners, or diagram content.
- **Navigation matching:** matching uses only the final pathname segment. Band detail filenames do not match the three top-level navigation links, so those pages have no current-page highlight.
- **Content duplication:** data edits do not synchronize the static list or album cards. Keep those representations consistent manually.

These are observations from source review; this documentation change does not alter runtime behavior or certify accessibility conformance.

## Manual verification

1. Start the local server using the root README instructions. Open the homepage, timeline, about page, and all band pages; check local images, navigation, and browser-console errors.
2. Toggle Day/Night, reload, and navigate to another page. Confirm the chosen appearance persists when browser storage is available. The visible button text names the current mode; its accessible label names the action.
3. Remove the `brumsound-color-theme` local storage entry and reload before testing OS theme changes. With no explicit choice, the page should follow the system. With storage blocked, toggling should still work for the current page.
4. Check the current dataset produces eight timeline lanes, 24 album links, four legend entries, and an axis from 1965 to 1990 at five-year intervals.
5. Navigate with the keyboard. Check the skip link, theme button, navigation, and timeline dots. Focusing or hovering a dot should reveal its album label. Check the Spotify destinations and band-page embeds with network access.
6. Disable JavaScript and reload the timeline. Verify the chronological list is visible and its links work. Separately block the timeline data/script while allowing `main.js` to run to observe the documented fallback limitation.
7. Check narrow and wide viewports, horizontal timeline scrolling, both color modes, and reduced-motion settings. Confirm credits and image alternative text remain appropriate after content edits.
