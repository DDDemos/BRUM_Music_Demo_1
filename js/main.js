// Progressive enhancement flag + active nav link. No framework, no build step.
document.documentElement.classList.add('js');

(function markCurrentNavLink() {
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var target = link.getAttribute('href').split('/').pop();
    if (target === here) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
