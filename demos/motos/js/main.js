// Moto Jeangon — JS común (menú, buscador, carrusel del hero)
document.getElementById('year').textContent = new Date().getFullYear();

(function () {
  var drawer = document.getElementById('drawer');
  var overlay = document.getElementById('drawerOverlay');
  var menuBtn = document.getElementById('menuToggle');
  var searchBtn = document.getElementById('searchToggle');
  var searchForm = document.getElementById('searchForm');

  function setMenu(open) {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    overlay.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  }
  menuBtn.addEventListener('click', function () { setMenu(true); });
  document.getElementById('menuClose').addEventListener('click', function () { setMenu(false); });
  overlay.addEventListener('click', function () { setMenu(false); });
  drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  searchBtn.addEventListener('click', function () {
    var open = searchForm.classList.toggle('is-open');
    searchBtn.setAttribute('aria-expanded', String(open));
    if (open) document.getElementById('q').focus();
  });

  // El buscador flotante se cierra al hacer clic fuera o con Esc
  function closeSearch() {
    searchForm.classList.remove('is-open');
    searchBtn.setAttribute('aria-expanded', 'false');
  }
  document.addEventListener('click', function (e) {
    if (!searchForm.contains(e.target) && !searchBtn.contains(e.target)) closeSearch();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSearch(); });
})();

// Carrusel del hero: pasa a la siguiente foto cada 6 segundos
(function () {
  var slides = document.querySelectorAll('.hero__slide');
  if (slides.length < 2) return;
  // Si el usuario pidió menos animaciones en su sistema, se queda en la primera foto
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var actual = 0;
  setInterval(function () {
    if (document.hidden) return;   // no cambia mientras la pestaña está oculta
    slides[actual].classList.remove('is-active');
    actual = (actual + 1) % slides.length;
    slides[actual].classList.add('is-active');
  }, 6000);
})();
