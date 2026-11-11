// ===== Datos de la tienda =====
// WhatsApp de la empresa (código de país + número, sin + ni espacios)
const WHATSAPP = '584123160820';
const WA_SALUDO = 'Hola D-Pinguis, quiero información sobre sus productos.';
const waLink = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

const normalize = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const escapeHtml = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Guardado local seguro (si el navegador lo bloquea, la página sigue funcionando)
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin almacenamiento */ } },
};

const ICONS = {
  screen: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
  camera: '<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5h2l1.5-2h6l1.5 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
  battery: '<rect x="2.5" y="7" width="17" height="10" rx="2.5"/><path d="M21.5 10.5v3"/><path d="M6 10v4M9.5 10v4M13 10v4"/>',
  bolt: '<path d="M13 2.5L4.5 14H11l-1 7.5L18.5 10H12z"/>',
  plug: '<path d="M8 2.5v5M16 2.5v5"/><path d="M5.5 7.5h13v3a6.5 6.5 0 0 1-13 0z"/><path d="M12 17v4.5"/>',
  sound: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/>',
  drop: '<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/>',
  devices: '<rect x="2.5" y="5" width="13" height="10" rx="1.5"/><path d="M6 19h6"/><rect x="17" y="8" width="4.5" height="11" rx="1.2"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/><path d="M7 12h2.5l1.5-2.5 2 5 1.5-2.5H17"/>',
  magnet: '<path d="M5 4h4v8a3 3 0 0 0 6 0V4h4v8a7 7 0 0 1-14 0z"/><path d="M5 8h4M15 8h4"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/>',
  check: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  store: '<path d="M3.5 9.5L5 4h14l1.5 5.5"/><path d="M3.5 9.5a2.8 2.8 0 0 0 5.6 0 2.9 2.9 0 0 0 5.8 0 2.8 2.8 0 0 0 5.6 0"/><path d="M5 12v8h14v-8"/><path d="M10 20v-4.5h4V20"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.2"/>',
  cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9.5v5M18 9.5v5"/>',
  phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/><path d="M12 7v6M9.5 10.5L12 13l2.5-2.5"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M8.5 8h7M12 8v8.5"/><path d="M8 11c1.2.8 2.5 1 4 1s2.8-.2 4-1"/>',
};
const icon = (name, cls = '') => `<svg class="${cls}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
const WA_SVG = '<svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';

// ===== Cartas de producto (se dibujan desde js/products.js) =====
const productUrl = p => `producto.html?id=${p.id}`;
const cardHtml = (p, order = 0) => `
  <article class="card" data-id="${p.id}" data-cat="${p.cat}" data-brand="${p.brand}" data-price="${p.price}" data-order="${order}">
    <a class="card__media" href="${productUrl(p)}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="" loading="lazy"></a>
    <span class="card__brand">${p.brand.toUpperCase()}</span>
    <h3 class="card__name"><a href="${productUrl(p)}">${escapeHtml(p.name)}</a></h3>
    <span class="card__price">${p.options?.values.length > 1 ? '<small>Desde</small> ' : ''}${formatPrice(p.price)}</span>
    <button type="button" class="buy" data-add="${p.id}">Comprar</button>
  </article>`;

document.querySelectorAll('[data-grid]').forEach(grid => {
  const [cat, limit] = grid.dataset.grid.split(':');
  const list = PRODUCTS.filter(p => cat === 'todos' || p.cat === cat).slice(0, limit ? Number(limit) : undefined);
  grid.innerHTML = list.map((p, i) => cardHtml(p, i)).join('');
});

// Enlaces de WhatsApp genéricos
document.querySelectorAll('[data-wa]').forEach(a => {
  a.href = waLink(WA_SALUDO);
  a.target = '_blank';
  a.rel = 'noopener';
});

// ===== Slider del hero (solo en inicio) =====
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
if (slides.length) {
  let current = 0;
  const showSlide = i => {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = i;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  };
  const next = () => showSlide((current + 1) % slides.length);
  let timer = setInterval(next, 6000);
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    showSlide(i);
    clearInterval(timer);
    timer = setInterval(next, 6000);
  }));
}

// =====================================================================
//  CARRITO
// =====================================================================
const CART_KEY = 'dpinguis_cart';
const PAY_KEY = 'dpinguis_pago';
let cart = store.get(CART_KEY, []).filter(item => findProduct(item.id));
let payment = store.get(PAY_KEY, '');

const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');

document.body.insertAdjacentHTML('beforeend', `
  <div class="cart-overlay" id="cartOverlay"></div>
  <aside class="cart" id="cart" role="dialog" aria-modal="true" aria-labelledby="cartTitle" aria-hidden="true">
    <header class="cart__head">
      <div>
        <h2 class="cart__title" id="cartTitle">Tu <span>Carrito</span></h2>
        <p class="cart__count" id="cartItemsCount"></p>
      </div>
      <button type="button" class="cart__close" id="cartClose" aria-label="Cerrar carrito">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </header>
    <div class="cart__body" id="cartBody"></div>
    <footer class="cart__foot" id="cartFoot">
      <fieldset class="pay">
        <legend class="pay__title">Método de pago</legend>
        <div class="pay__options">
          ${PAYMENT_METHODS.map(m => `
            <label class="pay__option">
              <input type="radio" name="pago" value="${m.id}">
              <span class="pay__box">
                ${icon(m.id === 'efectivo' ? 'cash' : m.id === 'pago-movil' ? 'phone' : 'coin', 'pay__icon')}
                <strong>${m.label}</strong>
                <small>${m.hint}</small>
              </span>
            </label>`).join('')}
        </div>
        <p class="pay__error" id="payError" role="alert" hidden>Elige un método de pago para continuar.</p>
      </fieldset>
      <div class="cart__total"><span>Total</span><strong id="cartTotal">$0</strong></div>
      <button type="button" class="btn-order" id="cartOrder">${WA_SVG}Hacer pedido por WhatsApp</button>
      <p class="cart__note">Te confirmamos disponibilidad y los datos de pago por WhatsApp.</p>
    </footer>
  </aside>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`);

const cartEl = document.getElementById('cart');
const cartOverlay = document.getElementById('cartOverlay');
const cartBody = document.getElementById('cartBody');
const cartFoot = document.getElementById('cartFoot');
const payError = document.getElementById('payError');

const variantText = item => [item.option, item.color].filter(Boolean).join(' · ');
const cartQty = () => cart.reduce((n, i) => n + i.qty, 0);
const cartTotal = () => cart.reduce((n, i) => n + findProduct(i.id).price * i.qty, 0);

function renderCart() {
  store.set(CART_KEY, cart);
  const qty = cartQty();
  cartCount.textContent = qty;
  document.getElementById('cartItemsCount').textContent = qty ? `${qty} ${qty === 1 ? 'producto' : 'productos'}` : '';
  document.getElementById('cartTotal').textContent = formatPrice(cartTotal());
  cartFoot.hidden = !cart.length;

  if (!cart.length) {
    cartBody.innerHTML = `
      <div class="cart__empty">
        <span class="cart__empty-icon">${icon('store')}</span>
        <strong>Tu carrito está vacío</strong>
        <p>Explora nuestros teléfonos y accesorios Apple y Samsung.</p>
        <a href="catalogo.html" class="btn-outline">Ver la tienda</a>
      </div>`;
    return;
  }
  cartBody.innerHTML = `<ul class="cart__list">${cart.map((item, i) => {
    const p = findProduct(item.id);
    return `
      <li class="cart-item">
        <a class="cart-item__img" href="${productUrl(p)}"><img src="${p.img}" alt=""></a>
        <div class="cart-item__info">
          <a class="cart-item__name" href="${productUrl(p)}">${escapeHtml(p.name)}</a>
          ${variantText(item) ? `<span class="cart-item__variant">${escapeHtml(variantText(item))}</span>` : ''}
          <div class="cart-item__row">
            <div class="qty" role="group" aria-label="Cantidad de ${escapeHtml(p.name)}">
              <button type="button" data-qty="${i}" data-step="-1" aria-label="Quitar uno">−</button>
              <span>${item.qty}</span>
              <button type="button" data-qty="${i}" data-step="1" aria-label="Añadir uno">+</button>
            </div>
            <strong class="cart-item__price">${formatPrice(p.price * item.qty)}</strong>
          </div>
        </div>
        <button type="button" class="cart-item__remove" data-remove="${i}" aria-label="Eliminar ${escapeHtml(p.name)}">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>
        </button>
      </li>`;
  }).join('')}</ul>`;
}

function setCartOpen(open) {
  cartEl.classList.toggle('is-open', open);
  cartOverlay.classList.toggle('is-open', open);
  cartEl.setAttribute('aria-hidden', !open);
  document.body.classList.toggle('cart-open', open);
  if (open) document.getElementById('cartClose').focus();
  else cartBtn.focus();
}

let toastTimer;
function showToast(html) {
  const toast = document.getElementById('toast');
  toast.innerHTML = html;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function addToCart(id, option = '', color = '') {
  const p = findProduct(id);
  if (!p) return;
  const existing = cart.find(i => i.id === id && i.option === option && i.color === color);
  if (existing) existing.qty++;
  else cart.push({ id, option, color, qty: 1 });
  renderCart();
  cartBtn.classList.remove('is-bump');
  void cartBtn.offsetWidth; // reinicia la animación
  cartBtn.classList.add('is-bump');
  showToast(`<span class="toast__msg">${icon('check')}<span class="toast__text">Añadido: <b>${escapeHtml(p.name)}</b></span></span><button type="button" data-open-cart>Ver carrito</button>`);
}

// Botones "Comprar" de las cartas (también los que se dibujan después)
document.addEventListener('click', e => {
  const buy = e.target.closest('[data-add]');
  if (buy) {
    const p = findProduct(buy.dataset.add);
    addToCart(p.id, p.options?.values[0] || '', p.colors?.[0] || '');
    buy.classList.add('is-added');
    buy.textContent = 'Añadido';
    setTimeout(() => { buy.classList.remove('is-added'); buy.textContent = 'Comprar'; }, 1600);
  }
  if (e.target.closest('[data-open-cart]')) {
    document.getElementById('toast').classList.remove('is-visible');
    setCartOpen(true);
  }
});

cartBtn.addEventListener('click', () => setCartOpen(true));
cartOverlay.addEventListener('click', () => setCartOpen(false));
document.getElementById('cartClose').addEventListener('click', () => setCartOpen(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && cartEl.classList.contains('is-open')) setCartOpen(false); });

cartBody.addEventListener('click', e => {
  const q = e.target.closest('[data-qty]');
  const r = e.target.closest('[data-remove]');
  if (q) {
    const item = cart[q.dataset.qty];
    item.qty += Number(q.dataset.step);
    if (item.qty < 1) cart.splice(q.dataset.qty, 1);
    renderCart();
  }
  if (r) {
    cart.splice(r.dataset.remove, 1);
    renderCart();
  }
});

const payInputs = cartFoot.querySelectorAll('input[name="pago"]');
payInputs.forEach(input => {
  input.checked = input.value === payment;
  input.addEventListener('change', () => {
    payment = input.value;
    store.set(PAY_KEY, payment);
    payError.hidden = true;
  });
});

document.getElementById('cartOrder').addEventListener('click', () => {
  if (!payment) {
    payError.hidden = false;
    cartFoot.querySelector('.pay').classList.remove('is-shake');
    void cartFoot.offsetWidth;
    cartFoot.querySelector('.pay').classList.add('is-shake');
    return;
  }
  const method = PAYMENT_METHODS.find(m => m.id === payment).label;
  const lines = cart.map(item => {
    const p = findProduct(item.id);
    const v = variantText(item);
    return `• ${item.qty} × ${p.name}${v ? ` (${v})` : ''} — ${formatPrice(p.price * item.qty)}`;
  });
  const text = `Hola D-Pinguis, quiero hacer este pedido:\n\n${lines.join('\n')}\n\nTotal: ${formatPrice(cartTotal())}\nMétodo de pago: ${method}\n\n¿Me confirman disponibilidad?`;
  window.open(waLink(text), '_blank', 'noopener');
});

renderCart();

// =====================================================================
//  FICHA DE PRODUCTO (producto.html)
// =====================================================================
const productRoot = document.getElementById('productPage');
if (productRoot) {
  const p = findProduct(new URLSearchParams(location.search).get('id'));
  if (!p) {
    productRoot.innerHTML = `
      <section class="container pd-missing">
        <h1 class="section-title">Producto no <span>encontrado</span></h1>
        <p>Puede que el enlace esté incompleto o que el producto ya no esté disponible.</p>
        <a href="catalogo.html" class="btn-outline">Ir a la tienda</a>
      </section>`;
  } else {
    document.title = `${p.name} — D-Pinguis Technology`;
    const multi = p.options?.values.length > 1;
    const chipGroup = (label, name, values) => `
      <div class="pd__group">
        <span class="pd__label">${label}: <b data-current="${name}">${escapeHtml(values[0])}</b></span>
        <div class="pd__chips" role="radiogroup" aria-label="${label}">
          ${values.map((v, i) => `<button type="button" class="pd__chip${i ? '' : ' is-active'}" role="radio" aria-checked="${!i}" data-group="${name}" data-value="${escapeHtml(v)}">${escapeHtml(v)}</button>`).join('')}
        </div>
      </div>`;
    const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id)
      .sort((a, b) => (b.brand === p.brand) - (a.brand === p.brand)).slice(0, 4);

    productRoot.innerHTML = `
      <section class="container pd">
        <nav class="breadcrumb" aria-label="Ruta">
          <a href="index.html">Inicio</a><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
          <a href="catalogo.html?cat=${p.cat}">${p.cat === 'telefonos' ? 'Teléfonos' : 'Accesorios'}</a><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
          <span aria-current="page">${escapeHtml(p.name)}</span>
        </nav>

        <div class="pd__grid">
          <div class="pd__media">
            <div class="pd__media-stripe" aria-hidden="true"></div>
            <img src="${p.img}" alt="${escapeHtml(p.name)}">
          </div>

          <div class="pd__info">
            <span class="pd__brand">${p.brand.toUpperCase()}</span>
            <h1 class="pd__name">${escapeHtml(p.name)}</h1>
            <p class="pd__tagline">${escapeHtml(p.tagline)}</p>
            <div class="pd__price">${multi ? '<small>Desde</small>' : ''}<strong>${formatPrice(p.price)}</strong></div>
            ${multi ? `<p class="pd__price-note">El precio varía según ${p.options.label === 'Tamaño' ? 'el tamaño' : 'la capacidad'}. Te lo confirmamos por WhatsApp.</p>` : ''}

            ${p.options ? chipGroup(p.options.label, 'option', p.options.values) : ''}
            ${p.colors ? chipGroup('Color', 'color', p.colors) : ''}

            <div class="pd__actions">
              <button type="button" class="btn-cart" id="pdAdd">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.8a1.5 1.5 0 0 0 1.5-1.1L21 7H6"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/></svg>
                Añadir al carrito
              </button>
              <a class="btn-ask" id="pdAsk" target="_blank" rel="noopener">${WA_SVG}Preguntar por WhatsApp</a>
            </div>

            <ul class="pd__perks">
              <li>${icon('check')}<span><b>Producto original</b> ${p.brand === 'apple' ? 'Apple' : 'Samsung'}</span></li>
              <li>${icon('store')}<span><b>Retira en tienda</b> City Market o Sabana Grande</span></li>
              <li>${icon('wallet')}<span><b>Paga como prefieras</b> Efectivo ($), Pago Móvil o USDT</span></li>
            </ul>
          </div>
        </div>

        <div class="pd__specs">
          <div class="pd__specs-head">
            <p class="eyebrow">ESPECIFICACIONES</p>
            <h2 class="section-title">Ficha <span>Técnica</span></h2>
          </div>
          <div class="pd__highlights">
            ${p.highlights.map(([ic, value, label]) => `
              <div class="hl">${icon(ic, 'hl__icon')}<strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join('')}
          </div>
          <dl class="spec-table">
            ${p.specs.map(([k, v]) => `<div class="spec-row"><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`).join('')}
          </dl>
        </div>
      </section>

      <section class="container catalog pd-related">
        <div class="catalog__head">
          <div>
            <p class="eyebrow">SIGUE EXPLORANDO</p>
            <h2 class="section-title">También te puede <span>Interesar</span></h2>
          </div>
          <a href="catalogo.html?cat=${p.cat}" class="btn-outline">Ver Todo
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
          </a>
        </div>
        <div class="grid">${related.map((x, i) => cardHtml(x, i)).join('')}</div>
      </section>`;

    const selected = { option: p.options?.values[0] || '', color: p.colors?.[0] || '' };
    const askLink = document.getElementById('pdAsk');
    const updateAsk = () => {
      const v = [selected.option, selected.color].filter(Boolean).join(', ');
      askLink.href = waLink(`Hola D-Pinguis, quiero información sobre el ${p.name}${v ? ` (${v})` : ''}. ¿Lo tienen disponible?`);
    };
    updateAsk();
    productRoot.querySelectorAll('.pd__chip').forEach(chip => chip.addEventListener('click', () => {
      const group = chip.dataset.group;
      productRoot.querySelectorAll(`.pd__chip[data-group="${group}"]`).forEach(c => {
        c.classList.toggle('is-active', c === chip);
        c.setAttribute('aria-checked', c === chip);
      });
      selected[group] = chip.dataset.value;
      productRoot.querySelector(`[data-current="${group}"]`).textContent = chip.dataset.value;
      updateAsk();
    }));
    document.getElementById('pdAdd').addEventListener('click', () => addToCart(p.id, selected.option, selected.color));
  }
}

// =====================================================================
//  FILTROS: búsqueda + filtros del catálogo
// =====================================================================
const cards = [...document.querySelectorAll('.card')];
const noResults = document.getElementById('noResults');
const resultCount = document.getElementById('resultCount');
const shopGrid = document.getElementById('shopGrid');
const sortSelect = document.getElementById('sortSelect');
const filters = { q: '', cat: 'todos', marca: 'todos' };

function applyFilters() {
  let visible = 0;
  cards.forEach(card => {
    const okQuery = !filters.q || normalize(card.textContent).includes(filters.q);
    const okCat = filters.cat === 'todos' || card.dataset.cat === filters.cat;
    const okBrand = filters.marca === 'todos' || card.dataset.brand === filters.marca;
    const show = okQuery && okCat && okBrand;
    card.classList.toggle('is-hidden', !show);
    if (show) visible++;
  });
  if (noResults) noResults.hidden = visible > 0;
  if (resultCount) resultCount.innerHTML = `<strong>${visible}</strong> ${visible === 1 ? 'producto' : 'productos'}`;
}

// ===== Búsqueda de la nav =====
const search = document.getElementById('search');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchTarget = document.querySelector('[data-search-target]');

function setSearchOpen(open) {
  search.classList.toggle('is-open', open);
  searchBtn.setAttribute('aria-expanded', open);
  searchBtn.setAttribute('aria-label', open ? 'Buscar' : 'Abrir búsqueda');
  searchInput.tabIndex = open ? 0 : -1;
  if (open) searchInput.focus();
}
searchBtn.addEventListener('click', () => {
  if (!search.classList.contains('is-open')) setSearchOpen(true);
  else if (searchInput.value.trim()) search.requestSubmit();
  else setSearchOpen(false);
});
searchInput.addEventListener('input', () => {
  filters.q = normalize(searchInput.value.trim());
  if (searchTarget) applyFilters();
});
search.addEventListener('submit', e => {
  e.preventDefault();
  const q = searchInput.value.trim();
  // En páginas sin listado (ficha de producto) la búsqueda lleva a la tienda
  if (!searchTarget) { if (q) location.href = `catalogo.html?q=${encodeURIComponent(q)}`; return; }
  applyFilters();
  searchTarget.scrollIntoView({ behavior: 'smooth' });
});
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchInput.value = '';
    filters.q = '';
    if (searchTarget) applyFilters();
    setSearchOpen(false);
    searchBtn.focus();
  }
});
document.addEventListener('click', e => {
  if (!search.contains(e.target) && !searchInput.value.trim()) setSearchOpen(false);
});

// ===== Catálogo: filtros por categoría y marca + orden =====
if (shopGrid) {
  const groups = document.querySelectorAll('.chips[data-filter]');
  const params = new URLSearchParams(location.search);

  const setChip = (group, value) => {
    group.querySelectorAll('.chip').forEach(chip => {
      const on = chip.dataset.value === value;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', on);
    });
    filters[group.dataset.filter] = value;
  };
  // Historial: el primer cambio de filtro crea UNA sola entrada; los siguientes la reemplazan.
  // Así, al pulsar "atrás" se vuelve al filtro con el que se entró a la tienda,
  // y un segundo "atrás" sale de la tienda (no hay que retroceder filtro por filtro).
  const syncUrl = () => {
    const p = new URLSearchParams();
    if (filters.cat !== 'todos') p.set('cat', filters.cat);
    if (filters.marca !== 'todos') p.set('marca', filters.marca);
    const url = p.toString() ? `?${p}` : location.pathname;
    const state = { dpFiltered: true, sort: sortSelect.value };
    if (history.state?.dpFiltered) history.replaceState(state, '', url);
    else history.pushState(state, '', url);
  };

  // Contador de productos en cada filtro
  groups.forEach(group => group.querySelectorAll('.chip').forEach(chip => {
    const key = group.dataset.filter === 'cat' ? 'cat' : 'brand';
    const v = chip.dataset.value;
    const n = v === 'todos' ? cards.length : cards.filter(c => c.dataset[key] === v).length;
    chip.insertAdjacentHTML('beforeend', `<span class="chip__count">${n}</span>`);
  }));

  groups.forEach(group => {
    group.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      setChip(group, chip.dataset.value);
      syncUrl();
      applyFilters();
    });
  });

  // Aplica los filtros que indica la dirección actual (al entrar y al pulsar atrás/adelante)
  const setSort = value => {
    sortSelect.value = value;
    sortSelect.dispatchEvent(new Event('change'));
  };
  const applyFromUrl = () => {
    const p = new URLSearchParams(location.search);
    groups.forEach(group => {
      const v = p.get(group.dataset.filter);
      setChip(group, v && group.querySelector(`[data-value="${v}"]`) ? v : 'todos');
    });
    setSort(history.state?.sort || 'destacados');
    applyFilters();
  };
  window.addEventListener('popstate', applyFromUrl);
  if (!history.state) history.replaceState({ dpFiltered: false }, '');

  // Búsqueda que llega desde otra página (?q=...)
  if (params.get('q')) {
    searchInput.value = params.get('q');
    filters.q = normalize(params.get('q'));
    setSearchOpen(true);
  }

  sortSelect.addEventListener('change', () => {
    const by = sortSelect.value;
    const sorted = [...cards].sort((a, b) => {
      if (by === 'menor') return a.dataset.price - b.dataset.price;
      if (by === 'mayor') return b.dataset.price - a.dataset.price;
      return a.dataset.order - b.dataset.order;
    });
    sorted.forEach(card => shopGrid.appendChild(card));
  });

  // Menú desplegable personalizado para "Ordenar por"
  const dd = document.getElementById('sortDropdown');
  const ddBtn = document.getElementById('sortBtn');
  const ddValue = dd.querySelector('.dropdown__value');
  const ddOptions = [...dd.querySelectorAll('.dropdown__option')];
  let focusIdx = 0;
  const focusOption = i => {
    focusIdx = (i + ddOptions.length) % ddOptions.length;
    ddOptions.forEach((o, j) => o.classList.toggle('is-focused', j === focusIdx));
  };
  const setDdOpen = open => {
    dd.classList.toggle('is-open', open);
    ddBtn.setAttribute('aria-expanded', open);
    if (open) focusOption(ddOptions.findIndex(o => o.classList.contains('is-selected')));
  };
  const chooseOption = opt => {
    setSort(opt.dataset.value);
    syncUrl();
    setDdOpen(false);
    ddBtn.focus();
  };
  sortSelect.addEventListener('change', () => {
    ddOptions.forEach(o => {
      const on = o.dataset.value === sortSelect.value;
      o.classList.toggle('is-selected', on);
      o.setAttribute('aria-selected', on);
      if (on) ddValue.textContent = o.textContent;
    });
  });
  ddBtn.addEventListener('click', () => setDdOpen(!dd.classList.contains('is-open')));
  ddOptions.forEach((o, i) => {
    o.addEventListener('click', () => chooseOption(o));
    o.addEventListener('mouseenter', () => focusOption(i));
  });
  ddBtn.addEventListener('keydown', e => {
    const open = dd.classList.contains('is-open');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) setDdOpen(true);
      else focusOption(focusIdx + (e.key === 'ArrowDown' ? 1 : -1));
    } else if ((e.key === 'Enter' || e.key === ' ') && open) {
      e.preventDefault();
      chooseOption(ddOptions[focusIdx]);
    } else if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setDdOpen(false);
    }
  });
  document.addEventListener('click', e => { if (!dd.contains(e.target)) setDdOpen(false); });

  document.getElementById('resetFilters').addEventListener('click', () => {
    groups.forEach(group => setChip(group, 'todos'));
    setSort('destacados');
    syncUrl();
    applyFilters();
  });

  applyFromUrl();
}

// ===== Menú hamburguesa =====
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('mainNav');
const navOverlay = document.getElementById('navOverlay');

function setMenuOpen(open) {
  nav.classList.toggle('is-open', open);
  navOverlay.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
menuBtn.addEventListener('click', () => setMenuOpen(!nav.classList.contains('is-open')));
navOverlay.addEventListener('click', () => setMenuOpen(false));
nav.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', () => {
  nav.querySelectorAll('.nav__link').forEach(l => l.classList.toggle('is-active', l === link));
  setMenuOpen(false);
}));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenuOpen(false);
    menuBtn.focus();
  }
});
// Si se agranda la pantalla con el menú abierto, se cierra solo
matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setMenuOpen(false); });

// ===== Resalta en la nav la sección que se está viendo (solo en inicio) =====
const spySections = [...document.querySelectorAll('[data-spy]')];
if (spySections.length) {
  const navLinks = document.querySelectorAll('.nav__link');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.toggle('is-active', l.dataset.section === entry.target.dataset.spy));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  spySections.forEach(s => spy.observe(s));
}
