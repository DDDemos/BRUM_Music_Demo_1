// Enhance the static chronological list only after a complete render.
(function () {
  if (typeof BAND_DATA === 'undefined' || !Array.isArray(BAND_DATA)) return;
  var mount = document.getElementById('timeline-diagram');
  var legendMount = document.getElementById('timeline-legend');
  if (!mount) return;

  var themeNames = { metal: 'Metal', pop: 'Pop / New Wave', reggae: 'Reggae', cosmic: 'Orchestral / Rock' };
  var years = [];
  var valid = BAND_DATA.every(function (band) {
    return band && typeof band.id === 'string' && typeof band.name === 'string' &&
      Object.prototype.hasOwnProperty.call(themeNames, band.theme) && Array.isArray(band.albums) &&
      band.albums.every(function (album) {
        if (!album || !Number.isFinite(album.year) || typeof album.title !== 'string' || typeof album.spotifyId !== 'string') return false;
        years.push(album.year);
        return true;
      });
  });
  if (!valid || !years.length) return;

  var minYear = Math.floor(Math.min.apply(null, years) / 5) * 5;
  var maxYear = Math.ceil(Math.max.apply(null, years) / 5) * 5;
  if (maxYear === minYear) maxYear += 5;
  var span = maxYear - minYear;
  function xPercent(year) { return ((year - minYear) / span) * 100; }
  function element(tag, className, text) {
    var node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  var diagram = document.createDocumentFragment();
  var axis = element('div', 'timeline-axis');
  axis.setAttribute('aria-hidden', 'true');
  for (var y = minYear; y <= maxYear; y += 5) {
    var tick = element('span', 'timeline-tick', y);
    tick.style.left = xPercent(y) + '%';
    axis.appendChild(tick);
  }
  diagram.appendChild(axis);
  var seenThemes = {};

  BAND_DATA.forEach(function (band, bandIndex) {
    var lane = element('section', 'timeline-lane');
    lane.setAttribute('data-theme', band.theme);
    lane.setAttribute('aria-labelledby', 'timeline-band-' + bandIndex);
    var label = element('a', 'timeline-lane-label');
    label.href = 'bands/' + encodeURIComponent(band.id) + '.html';
    var photo = element('img', 'timeline-band-photo');
    photo.src = 'images/' + encodeURIComponent(band.id) + (band.id === 'elo' ? '.png' : '.jpg');
    photo.alt = '';
    photo.width = 72;
    photo.height = 72;
    photo.loading = 'lazy';
    label.appendChild(photo);
    var identity = element('div', 'timeline-band-identity');
    var name = element('h3', '', band.name);
    name.id = 'timeline-band-' + bandIndex;
    identity.appendChild(name);
    identity.appendChild(element('span', 'timeline-band-genre', themeNames[band.theme]));
    label.appendChild(identity);
    lane.appendChild(label);

    var track = element('div', 'timeline-track');
    track.style.setProperty('--tick-step', (500 / span) + '%');
    var albums = band.albums.slice().sort(function (a, b) { return a.year - b.year; });
    if (albums.length) {
      var line = element('span', 'timeline-release-span');
      line.style.left = xPercent(albums[0].year) + '%';
      line.style.width = (xPercent(albums[albums.length - 1].year) - xPercent(albums[0].year)) + '%';
      line.setAttribute('aria-hidden', 'true');
      track.appendChild(line);
    }
    albums.forEach(function (album, index) {
      var node = element('a', 'timeline-node');
      node.style.setProperty('--position', xPercent(album.year) + '%');
      node.style.setProperty('--level', index % 3);
      node.href = 'https://open.spotify.com/album/' + encodeURIComponent(album.spotifyId);
      node.target = '_blank';
      node.rel = 'noopener';
      node.setAttribute('aria-label', band.name + ' — ' + album.title + ' (' + album.year + '), opens on Spotify in a new tab');
      var dot = element('span', 'timeline-node-dot');
      dot.setAttribute('aria-hidden', 'true');
      node.appendChild(dot);
      var caption = element('span', 'timeline-node-label');
      caption.appendChild(element('span', 'timeline-album-year', album.year));
      caption.appendChild(element('span', 'timeline-album-title', album.title));
      var arrow = element('span', 'timeline-album-arrow', '↗');
      arrow.setAttribute('aria-hidden', 'true');
      caption.appendChild(arrow);
      node.appendChild(caption);
      track.appendChild(node);
    });
    lane.appendChild(track);
    diagram.appendChild(lane);
    seenThemes[band.theme] = true;
  });

  mount.replaceChildren(diagram);
  if (legendMount) {
    var legend = document.createDocumentFragment();
    Object.keys(themeNames).forEach(function (theme) {
      if (!seenThemes[theme]) return;
      var li = element('li', '');
      var dot = element('span', 'dot dot--' + theme);
      dot.setAttribute('aria-hidden', 'true');
      li.appendChild(dot);
      li.appendChild(document.createTextNode(themeNames[theme]));
      legend.appendChild(li);
    });
    legendMount.replaceChildren(legend);
  }
  var wrap = mount.closest('.timeline-wrap');
  if (wrap) wrap.hidden = false;
  // Keep a visible, accessible text alternative available after enhancement.
  var fallback = document.querySelector('.timeline-fallback');
  if (fallback && fallback.tagName !== 'DETAILS') {
    var details = element('details', 'timeline-fallback');
    details.appendChild(element('summary', '', 'View the full chronological list'));
    var list = fallback.querySelector('ol');
    if (list) details.appendChild(list);
    fallback.replaceWith(details);
  }
})();
