// Renders the album-release swimlane diagram from data/bands.js (BAND_DATA).
// Progressive enhancement: the accessible chronological list in the page
// markup stays in the DOM either way; this just adds a visual layer on top.
(function () {
  if (typeof BAND_DATA === 'undefined') return;

  var mount = document.getElementById('timeline-diagram');
  var legendMount = document.getElementById('timeline-legend');
  if (!mount) return;

  var years = [];
  BAND_DATA.forEach(function (band) {
    band.albums.forEach(function (album) { years.push(album.year); });
  });

  var minYear = Math.floor(Math.min.apply(null, years) / 5) * 5;
  var maxYear = Math.ceil(Math.max.apply(null, years) / 5) * 5;
  var span = maxYear - minYear;

  function xPercent(year) {
    return ((year - minYear) / span) * 100;
  }

  // axis with 5-year ticks
  var axis = document.createElement('div');
  axis.className = 'timeline-axis';
  axis.style.marginLeft = '9rem';
  for (var y = minYear; y <= maxYear; y += 5) {
    var tick = document.createElement('span');
    tick.className = 'timeline-tick';
    tick.style.left = xPercent(y) + '%';
    tick.textContent = y;
    axis.appendChild(tick);
  }
  mount.appendChild(axis);

  var seenThemes = {};

  BAND_DATA.forEach(function (band) {
    var lane = document.createElement('div');
    lane.className = 'timeline-lane';

    var label = document.createElement('span');
    label.className = 'timeline-lane-label';
    label.textContent = band.name;
    lane.appendChild(label);

    var track = document.createElement('div');
    track.className = 'timeline-track';

    band.albums.forEach(function (album) {
      var node = document.createElement('a');
      node.className = 'timeline-node timeline-node--' + band.theme;
      node.style.left = xPercent(album.year) + '%';
      node.href = 'https://open.spotify.com/album/' + album.spotifyId;
      node.target = '_blank';
      node.rel = 'noopener';
      node.setAttribute('aria-label', band.name + ' — ' + album.title + ' (' + album.year + '), opens on Spotify');
      track.appendChild(node);

      var nodeLabel = document.createElement('span');
      nodeLabel.className = 'timeline-node-label';
      nodeLabel.style.left = xPercent(album.year) + '%';
      nodeLabel.setAttribute('aria-hidden', 'true');
      nodeLabel.textContent = album.title + ' ’' + String(album.year).slice(2);
      track.appendChild(nodeLabel);
    });

    lane.appendChild(track);
    mount.appendChild(lane);
    seenThemes[band.theme] = true;
  });

  if (legendMount) {
    var themeNames = { metal: 'Metal', pop: 'Pop / New Wave', reggae: 'Reggae', cosmic: 'Orchestral / Rock' };
    Object.keys(themeNames).forEach(function (theme) {
      if (!seenThemes[theme]) return;
      var li = document.createElement('li');
      var dot = document.createElement('span');
      dot.className = 'dot dot--' + theme;
      li.appendChild(dot);
      li.appendChild(document.createTextNode(themeNames[theme]));
      legendMount.appendChild(li);
    });
  }
})();
