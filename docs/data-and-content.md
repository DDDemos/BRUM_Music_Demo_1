# Data and content maintenance

## `BAND_DATA`

[data/bands.js](../data/bands.js) declares a top-level `const BAND_DATA` array consumed by [js/timeline.js](../js/timeline.js). This is executable JavaScript, not a JSON file or module export. The binding is available to subsequent classic scripts on the same page; it is not explicitly assigned to `window`.

Each band is a plain object with these fields:

- `id` — string slug corresponding by convention to `bands/<id>.html`. The renderer does not currently use it.
- `name` — string displayed as the lane label and included in album-link accessible names.
- `theme` — string, one of `metal`, `pop`, `reggae`, or `cosmic`. Determines node color and genre legend membership.
- `albums` — array of album objects. Each contains `title` (display string), `year` (numeric release year), and `spotifyId` (Spotify album ID string, not a full URL).

Example using an existing entry:

```js
{
  id: 'black-sabbath',
  name: 'Black Sabbath',
  theme: 'metal',
  albums: [
    { title: 'Paranoid', year: 1970, spotifyId: '7LGVdC9fFwgWYaIrZwsSv6' }
  ]
}
```

The renderer uses array order for lanes and album insertion; it does not sort. Years determine horizontal position. Supply valid album arrays and finite numeric years, with at least one album overall and a positive range after rounding to five-year boundaries. There is no runtime schema validation.

The file's opening comment labels it generated data, but no generation script is checked in. Treat edits as manual unless a generator is introduced and documented.

## Where content lives

- [index.html](../index.html) stores homepage band cards and collage images.
- [bands/](../bands/) stores profile metadata, member lists, photo captions, and album cards with Spotify embeds.
- [data/bands.js](../data/bands.js) stores the visual timeline's band and album data only.
- [timeline.html](../timeline.html) separately stores the chronological fallback list and visible date-range copy.
- [about.html](../about.html) stores consolidated credits and the accessibility statement.

Updating one representation does not update the others. Shared headers and footers are also duplicated across pages.

## Change or add an album

1. Update the appropriate band's `albums` array in `data/bands.js`.
2. Update that band's HTML discography, including title, year, iframe source and title, and direct Spotify link. Existing album cards provide the markup pattern.
3. Update the chronological list in `timeline.html` and keep it ordered by release year.
4. If the date range changes, update the timeline page's introductory range and description, plus any counts or ranges in the README. The visual axis itself recalculates automatically.
5. Check the diagram, fallback list, and band page agree on title, year, and Spotify ID. Verify external album destinations in a browser.

## Add a band

1. Copy an existing page in `bands/` with the desired theme to a new slug filename. Replace its page title, description, heading, metadata, lineup, image details, credits, and albums. Keep `../` prefixes for shared assets and top-level navigation.
2. Add the band image under `images/`, preserving appropriate dimensions and alternative text in page markup.
3. Add a homepage `.band-card` linking to the new profile. If extending the decorative collage, add a placement class and responsive rules in `base.css`.
4. Add a band object to `BAND_DATA` and corresponding album entries to the static chronological list.
5. Update `about.html` credits and any copy that states band or album counts, including this project's README.
6. Follow the [manual verification checklist](README.md#manual-verification).

## Add a genre theme

Add a `[data-theme="<key>"]` rule in `css/themes.css`, including its band accent, tint, and corner-radius properties. Provide light-mode tint rules for both explicit light mode and system-selected light mode.

Add `.timeline-node--<key>` and `.timeline-legend .dot--<key>` color rules, then add its display label to `themeNames` inside `js/timeline.js`. Use the same key in the band's data, page body, and homepage card body. See the [style reference](styles.md) for scope and inheritance details.
