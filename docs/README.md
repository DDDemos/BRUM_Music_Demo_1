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

- **Timeline fallback visibility:** the text list stays visible until successful rendering, then becomes an expandable native disclosure. Missing or malformed data leaves the original list available.
- **Timeline data assumptions:** field types and finite years are checked, and equal bounds are expanded by five years. Same-year markers within a band can overlap on desktop. Captions cycle through three levels; a larger discography may require further layout work.
- **Initialization:** timeline mounts are replaced on each valid render. The shared theme initializer still appends a new button and listeners if run repeatedly.
- **Navigation matching:** matching uses only the final pathname segment. Band detail filenames do not match the three top-level navigation links, so those pages have no current-page highlight.
- **Content duplication:** data edits do not synchronize the static list or album cards. Keep those representations consistent manually.

These are observations from source review, not a certification of accessibility conformance.

## Manual verification

1. Start the local server using the root README instructions. Open the homepage, timeline, about page, and all band pages; check local images, navigation, and browser-console errors.
2. Toggle Day/Night, reload, and navigate to another page. Confirm the chosen appearance persists when browser storage is available. The visible button text names the current mode; its accessible label names the action.
3. Remove the `brumsound-color-theme` local storage entry and reload before testing OS theme changes. With no explicit choice, the page should follow the system. With storage blocked, toggling should still work for the current page.
4. Check the current dataset produces eight portrait-led timeline lanes, 24 album links, four legend entries, and an axis from 1965 to 1990 at five-year intervals.
5. Navigate with the keyboard. Check the skip link, theme button, navigation, and timeline dots. Album labels should always be visible; focusing or hovering an album should highlight its label and marker. Check the Spotify destinations and band-page embeds with network access.
6. Disable JavaScript and reload the timeline. Verify the chronological list is visible and its links work. Separately block the timeline data/script while allowing `main.js` to run and confirm the chronological list remains visible. With successful rendering, check that its disclosure opens and closes.
7. Check narrow and wide viewports, the vertical mobile release layout, both color modes, and reduced-motion settings. Confirm credits and image alternative text remain appropriate after content edits.
