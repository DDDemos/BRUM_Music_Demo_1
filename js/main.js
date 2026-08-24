// Progressive enhancement flag + active nav link. No framework, no build step.
document.documentElement.classList.add('js');

(function setupThemeToggle() {
  var root = document.documentElement;
  var storageKey = 'brumsound-color-theme';
  var savedTheme = null;

  try { savedTheme = localStorage.getItem(storageKey); } catch (error) { /* storage may be blocked */ }
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.setAttribute('data-color-theme', savedTheme);
  }

  var header = document.querySelector('.site-header .container');
  if (!header) return;

  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';

  function currentTheme() {
    var chosen = root.getAttribute('data-color-theme');
    if (chosen) return chosen;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function updateButton() {
    var isDark = currentTheme() === 'dark';
    button.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true">' + (isDark ? '&#9790;' : '&#9728;') + '</span><span>' + (isDark ? 'Night' : 'Day') + '</span>';
    button.setAttribute('aria-label', 'Switch to ' + (isDark ? 'day' : 'night') + ' theme');
    button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  }

  button.addEventListener('click', function () {
    var nextTheme = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-color-theme', nextTheme);
    try { localStorage.setItem(storageKey, nextTheme); } catch (error) { /* preference lasts for this page */ }
    updateButton();
  });

  var systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
  if (systemTheme && systemTheme.addEventListener) {
    systemTheme.addEventListener('change', function () {
      if (!root.hasAttribute('data-color-theme')) updateButton();
    });
  }

  updateButton();
  header.appendChild(button);
})();

(function markCurrentNavLink() {
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var target = link.getAttribute('href').split('/').pop();
    if (target === here) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
