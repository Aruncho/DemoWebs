// Moto Jeangon — Catálogo: filtros y ordenación (demo, sin base de datos)
(function () {
  var grid = document.getElementById('productGrid');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.product'));
  var cats = document.querySelectorAll('.filter-cat');
  var checks = Array.prototype.slice.call(document.querySelectorAll('.shop__sidebar input[type="checkbox"]'));
  var countEl = document.getElementById('productCount');
  var sortSel = document.getElementById('productSort');
  var emptyEl = document.getElementById('productEmpty');
  var toggle = document.getElementById('filtersToggle');
  var more = document.getElementById('filtersMore');
  var badge = document.getElementById('filtersBadge');

  items.forEach(function (el, i) { el.dataset.order = i; });

  // Categoría inicial desde la URL (catalogo.html?cat=cascos), p. ej. desde las tarjetas de la portada
  var actual = 'todos';
  try {
    var param = new URLSearchParams(window.location.search).get('cat');
    if (param && document.querySelector('.filter-cat[data-filter="' + param + '"]')) actual = param;
  } catch (e) {}

  function marcados(nombre) {
    return checks.filter(function (c) { return c.name === nombre && c.checked; })
                 .map(function (c) { return c.value; });
  }

  function aplicar(animar) {
    var stock = marcados('stock');
    var tags = marcados('tag');
    var n = 0;

    items.forEach(function (el) {
      var visible =
        (actual === 'todos' || el.dataset.cat === actual) &&
        (!stock.length || stock.indexOf(el.dataset.stock) > -1) &&
        (!tags.length || tags.indexOf(el.dataset.tag) > -1);
      el.hidden = !visible;
      el.classList.remove('is-entering');
      if (visible) {
        if (animar) {
          void el.offsetWidth;   // reinicia la animación
          el.style.animationDelay = (n * 40) + 'ms';
          el.classList.add('is-entering');
        }
        n++;
      }
    });

    countEl.innerHTML = 'Mostrando <strong>' + n + '</strong> ' + (n === 1 ? 'producto' : 'productos');
    emptyEl.hidden = n > 0;

    cats.forEach(function (c) {
      var on = c.dataset.filter === actual;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });

    // Número de filtros extra activos (en el botón "Más filtros" del móvil)
    var extra = stock.length + tags.length;
    badge.hidden = !extra;
    badge.textContent = extra;

    // Mantiene la categoría en la URL sin recargar
    try {
      history.replaceState(null, '', actual === 'todos' ? window.location.pathname : '?cat=' + actual);
    } catch (e) {}
  }

  function ordenar() {
    var modo = sortSel.value;
    items.sort(function (a, b) {
      if (modo === 'destacados') return a.dataset.order - b.dataset.order;
      var na = a.querySelector('.product__name').textContent;
      var nb = b.querySelector('.product__name').textContent;
      return modo === 'az' ? na.localeCompare(nb, 'es') : nb.localeCompare(na, 'es');
    });
    items.forEach(function (el) { grid.appendChild(el); });
    aplicar(true);
  }

  // En móvil, la categoría elegida se centra en la fila deslizable
  function centrarChip(btn, suave) {
    var fila = btn.parentNode;
    if (fila.scrollWidth <= fila.clientWidth) return;
    var destino = btn.offsetLeft - (fila.clientWidth - btn.offsetWidth) / 2;
    fila.scrollTo({ left: destino, behavior: suave ? 'smooth' : 'auto' });
  }

  cats.forEach(function (c) {
    c.addEventListener('click', function () {
      actual = c.dataset.filter;
      aplicar(true);
      centrarChip(c, true);
    });
  });
  checks.forEach(function (c) { c.addEventListener('change', function () { aplicar(true); }); });
  sortSel.addEventListener('change', ordenar);

  document.querySelectorAll('[data-clear]').forEach(function (b) {
    b.addEventListener('click', function () {
      checks.forEach(function (c) { c.checked = false; });
      actual = 'todos';
      aplicar(true);
      centrarChip(cats[0], true);
    });
  });

  // Móvil: abrir / cerrar el panel "Más filtros"
  toggle.addEventListener('click', function () {
    var abierto = more.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(abierto));
  });

  aplicar(false);
  var activo = document.querySelector('.filter-cat.is-active');
  if (activo) centrarChip(activo, false);
})();
