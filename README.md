# BrumSound

A static website celebrating Birmingham's musical heritage through eight band profiles, selected discographies, Spotify embeds, and an album-release timeline.

The featured acts are Black Sabbath, Judas Priest, Electric Light Orchestra, Traffic, UB40, Steel Pulse, Duran Duran, and Dexys Midnight Runners. The timeline contains 24 selected albums released between 1967 and 1990.

## Run locally

No package installation, build step, API keys, or environment variables are required. With Python 3 installed, run this command from the project root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://localhost:8000> in a browser. Stop the server with `Ctrl+C`. You can also open `index.html` directly, although a local HTTP server provides a consistent origin for testing saved theme preferences.

The site uses plain HTML, CSS, and browser JavaScript. Google Fonts and Spotify embeds require an internet connection; the page content and band photographs are stored locally. System font fallbacks are configured in CSS.

## Features

- Homepage with a cobalt record-sleeve composition and links to all eight band profiles.
- Band pages with formation details, lineups, credited photographs, and selected albums.
- Album timeline with one row per band and links to Spotify.
- Day/night theme toggle with a saved preference and operating-system preference support.
- Keyboard focus styles, skip links, reduced-motion styles, and a chronological list for visitors without JavaScript.

## Project layout

```text
index.html          Homepage and band directory
timeline.html       Timeline mounts and static chronological list
about.html          Image credits, attribution, and accessibility statement
bands/              Eight standalone band profile pages
css/base.css        Shared layout, components, and day/night colors
css/themes.css      Band-specific styles and timeline styling
data/bands.js       Album data used by the JavaScript timeline
js/main.js          Theme toggle and current-page navigation marking
js/timeline.js      Timeline and legend rendering
images/             Local band photographs
docs/               Developer documentation
```

## Documentation

Start with the [documentation index](docs/README.md). Detailed references cover [JavaScript functions](docs/javascript.md), [data and content maintenance](docs/data-and-content.md), and [CSS classes and themes](docs/styles.md).

There are no application classes, class methods, framework components, or exported module APIs. The implementation uses immediately invoked functions, nested helpers, browser event handlers, and CSS classes; the documentation describes those actual interfaces.

## Development and verification

Edit the HTML, CSS, JavaScript, and images directly, then refresh the browser. Shared page markup and album information are maintained in multiple files; updating `data/bands.js` updates only the visual timeline. Follow the [content maintenance guide](docs/data-and-content.md) when adding or changing albums or bands.

There is no automated test suite, package manifest, or CI configuration in this repository. Use the [manual verification checklist](docs/README.md#manual-verification) after making changes.

For hosting, serve the static files with `index.html` as the default document and preserve the directory structure. No application server is needed.

## Credits

Image sources and individual attribution details are recorded in [about.html](about.html) and the band-page captions. Album playback is supplied by Spotify. The site describes itself as an independent tribute with no artist, label, or Spotify affiliation. No project-wide license file is currently included.
