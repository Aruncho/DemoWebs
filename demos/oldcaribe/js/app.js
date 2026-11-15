// ============================================================
//  OLD CARIBE — lógica de la tienda
// ============================================================

// ---------- Utilidades ----------
const $ = (sel) => document.querySelector(sel);

const BADGE_CLASE = {
  "Nuevo": "badge--nuevo",
  "Más vendido": "badge--vendido",
  "Últimos pares": "badge--ultimos",
  "Agotado": "badge--agotado",
};

// Sin texto abre el chat vacío; con texto lleva el mensaje del pedido
function linkWhatsApp(texto = "") {
  return `https://wa.me/${CONFIG.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}

// Zapato genérico (se usa mientras no tengas la foto real)
function zapatoSVG(p) {
  return `
  <svg viewBox="0 0 240 140" class="card__svg" aria-hidden="true">
    <ellipse cx="122" cy="128" rx="104" ry="6" fill="#000" opacity=".1"/>
    <path d="M16 104 C14 116 22 122 34 122 L212 122 C224 122 230 116 229 106 L227 98 L18 98 Z" fill="#f2f2f2" stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M18 112 L228 112" stroke="#1a1a1a" stroke-width="2" opacity=".35"/>
    <path d="M20 100 C18 80 28 62 50 58 L90 50 C102 36 118 28 138 31 L150 35 C158 52 178 62 202 69 C220 75 229 86 227 100 Z" fill="${p.c1}" stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M168 60 C186 65 204 70 214 77 C223 83 228 91 227 100 L172 100 C166 88 164 74 168 60 Z" fill="${p.c2}" stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M20 100 C18 80 28 62 50 58 L62 56 C68 72 68 88 64 100 Z" fill="${p.c2}" stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M78 100 C80 86 92 78 112 76 L150 72 C146 84 146 94 148 100 Z" fill="${p.c3}" stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M104 44 L112 54 M116 47 L124 57 M128 51 L136 61 M140 55 L148 65" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
    <path d="M92 50 C102 36 118 28 138 31" fill="none" stroke="#1a1a1a" stroke-width="5" stroke-linecap="round"/>
  </svg>`;
}

// Cada zapato tiene su propia página en zapatos/ (la crea generar-zapatos.js)
const urlProducto = (p) => `zapatos/${slugZapato(p)}.html`;

function tarjetaHTML(p) {
  const agotado = p.badge === "Agotado";
  const media = p.imagen
    ? `<img src="${p.imagen}" alt="${p.nombre}" class="card__img" loading="lazy">`
    : zapatoSVG(p);
  const badge = p.badge ? `<span class="badge ${BADGE_CLASE[p.badge] || ""}">${p.badge}</span>` : "";
  const accion = agotado
    ? `<span class="card__agotado">Agotado</span>`
    : `<button type="button" class="btn-carrito" data-id="${p.id}" aria-label="Agregar ${p.nombre} al carrito">
         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>
       </button>`;

  return `
  <article class="card">
    <a href="${urlProducto(p)}" class="card__media${p.foto ? " card__media--foto" : ""}" aria-label="Ver ${p.nombre}">${badge}${media}</a>
    <div class="card__body">
      <span class="card__linea">${p.linea}</span>
      <h3 class="card__nombre"><a href="${urlProducto(p)}">${p.nombre}</a></h3>
      <span class="card__tallas">Tallas ${p.tallas[0]}–${p.tallas[1]}</span>
      <div class="card__pie">
        <span class="card__precio">${CONFIG.moneda}${p.precio}</span>
        ${accion}
      </div>
    </div>
  </article>`;
}

function pintarGrilla(contenedor, lista) {
  contenedor.innerHTML = lista.map(tarjetaHTML).join("");
}

// ============================================================
//  CARRITO
//  Cada línea es { id, talla, cant }. Se guarda en el navegador.
//  - Al agregar un zapato se abre el menú de tallas.
//  - Dentro del carrito, el "+" de un zapato vuelve a abrir el menú de tallas
//    ofreciendo primero "Misma talla ya seleccionada" y las demás debajo.
// ============================================================
let carrito = [];
try {
  const guardado = JSON.parse(localStorage.getItem("oc_carrito")) || [];
  // Formato viejo (solo ids, sin talla): se descarta
  carrito = guardado.filter((l) => l && typeof l === "object" && l.id && l.talla);
} catch (e) { carrito = []; }

const producto = (id) => PRODUCTOS.find((x) => x.id === id);
const precio = (n) => `${CONFIG.moneda}${n}`;
const totalPares = () => carrito.reduce((s, l) => s + l.cant, 0);
const totalPrecio = () => carrito.reduce((s, l) => s + (producto(l.id)?.precio || 0) * l.cant, 0);

function miniatura(p) {
  return p.imagen ? `<img src="${p.imagen}" alt=""${p.foto ? ' class="mini__foto"' : ""}>` : zapatoSVG(p);
}

function guardarCarrito() {
  try { localStorage.setItem("oc_carrito", JSON.stringify(carrito)); } catch (e) {}
  const contador = $("#carrito-count");
  if (contador) contador.textContent = totalPares();
  pintarCarrito();
}

function agregarAlCarrito(id, talla) {
  const linea = carrito.find((l) => l.id === id && l.talla === talla);
  if (linea) linea.cant += 1;
  else carrito.push({ id, talla, cant: 1 });
  guardarCarrito();
  const c = $("#btn-carrito");
  c?.classList.remove("btn-icono--salto");
  void c?.offsetWidth;            // reinicia la animación del ícono
  c?.classList.add("btn-icono--salto");
}

// ---------- Piezas de la interfaz (se crean una sola vez, sirven en todas las páginas) ----------
document.body.insertAdjacentHTML("beforeend", `
  <div id="capa-fondo" class="capa-fondo" hidden></div>

  <div id="modal-talla" class="modal-talla" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="modal-talla-titulo" hidden>
    <div class="modal-talla__cab">
      <div class="modal-talla__producto"></div>
      <button type="button" class="panel-cerrar" data-cerrar aria-label="Cerrar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <h2 id="modal-talla-titulo" class="modal-talla__titulo">Elige tu talla</h2>
    <div class="modal-talla__misma"></div>
    <p class="modal-talla__sub"></p>
    <div class="modal-talla__tallas"></div>
    <a href="#" data-whatsapp class="modal-talla__ayuda">¿No sabes tu talla? Escríbenos y te ayudamos</a>
  </div>

  <aside id="panel-carrito" class="panel-carrito" role="dialog" aria-modal="true" aria-labelledby="panel-carrito-titulo" aria-hidden="true">
    <div class="panel-carrito__cab">
      <h2 id="panel-carrito-titulo">Tu pedido</h2>
      <button type="button" class="panel-cerrar" data-cerrar aria-label="Cerrar carrito">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="panel-carrito__lista"></div>
    <div class="panel-carrito__pie"></div>
  </aside>

  <div id="aviso" class="aviso" role="status" aria-live="polite"></div>
`);

const capaFondo = $("#capa-fondo");
const modalTalla = $("#modal-talla");
const panelCarrito = $("#panel-carrito");
let ultimoFoco = null;

function bloquearScroll() {
  const abierto = !modalTalla.hidden || panelCarrito.classList.contains("abierto");
  capaFondo.hidden = !abierto;
  document.body.classList.toggle("carrito-abierto", abierto);
}

// ---------- Menú de tallas ----------
// tallaActual: si viene del carrito, la talla que ya tenía ese zapato
function abrirTallas(id, tallaActual = null) {
  const p = producto(id);
  if (!p) return;
  ultimoFoco = document.activeElement;

  modalTalla.querySelector(".modal-talla__producto").innerHTML = `
    <span class="mini">${miniatura(p)}</span>
    <span><strong>${p.nombre}</strong><small>${precio(p.precio)}</small></span>`;

  const tallas = [];
  for (let t = p.tallas[0]; t <= p.tallas[1]; t++) tallas.push(t);

  const misma = modalTalla.querySelector(".modal-talla__misma");
  const sub = modalTalla.querySelector(".modal-talla__sub");
  if (tallaActual !== null) {
    misma.innerHTML = `
      <button type="button" class="talla-misma" data-talla="${tallaActual}">
        <span>Misma talla ya seleccionada</span>
        <b>${tallaActual}</b>
      </button>`;
    sub.textContent = "O elige otra talla";
    sub.hidden = false;
  } else {
    misma.innerHTML = "";
    sub.hidden = true;
  }
  modalTalla.querySelector(".modal-talla__tallas").innerHTML = tallas
    .filter((t) => t !== tallaActual)
    .map((t) => `<button type="button" class="talla-opcion" data-talla="${t}">${t}</button>`)
    .join("");

  modalTalla.dataset.id = id;
  modalTalla.hidden = false;
  panelCarrito.classList.toggle("tapado", panelCarrito.classList.contains("abierto"));
  bloquearScroll();
  (modalTalla.querySelector(".talla-misma") || modalTalla).focus();   // sin marcar ninguna talla de entrada
}

function cerrarTallas() {
  modalTalla.hidden = true;
  panelCarrito.classList.remove("tapado");
  bloquearScroll();
  if (!panelCarrito.classList.contains("abierto")) ultimoFoco?.focus?.();
}

modalTalla.addEventListener("click", (e) => {
  if (e.target.closest("[data-cerrar]")) return cerrarTallas();
  const b = e.target.closest("[data-talla]");
  if (!b) return;
  const id = modalTalla.dataset.id;
  const talla = Number(b.dataset.talla);
  agregarAlCarrito(id, talla);
  cerrarTallas();
  if (!panelCarrito.classList.contains("abierto")) avisar(`<b>Talla ${talla}</b> · ${producto(id).nombre}`);
});

// ---------- Panel del carrito ----------
function pintarCarrito() {
  const lista = panelCarrito.querySelector(".panel-carrito__lista");
  const pie = panelCarrito.querySelector(".panel-carrito__pie");
  $("#panel-carrito-titulo").innerHTML = `Tu pedido ${totalPares() ? `<small>${totalPares()} ${totalPares() === 1 ? "par" : "pares"}</small>` : ""}`;

  if (carrito.length === 0) {
    lista.innerHTML = `
      <div class="carrito-vacio">
        <strong>TU CARRITO ESTÁ VACÍO</strong>
        <span>Elige tus zapatos y aquí los verás con su talla.</span>
        <a href="catalogo.html" class="btn btn--negro">Ver catálogo</a>
      </div>`;
    pie.innerHTML = "";
    return;
  }

  lista.innerHTML = carrito.map((l, i) => {
    const p = producto(l.id);
    if (!p) return "";
    return `
      <article class="item">
        <span class="mini">${miniatura(p)}</span>
        <div class="item__info">
          <strong>${p.nombre}</strong>
          <span class="item__talla">Talla ${l.talla}</span>
          <span class="item__precio">${precio(p.precio * l.cant)}</span>
        </div>
        <div class="item__cant" aria-label="Cantidad">
          <button type="button" data-accion="menos" data-i="${i}" aria-label="${l.cant === 1 ? "Quitar" : "Uno menos"}">
            ${l.cant === 1
              ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>`
              : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>`}
          </button>
          <span>${l.cant}</span>
          <button type="button" data-accion="mas" data-i="${i}" aria-label="Agregar otro ${p.nombre}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </article>`;
  }).join("");

  pie.innerHTML = `
    <div class="panel-carrito__total"><span>Total</span><b>${precio(totalPrecio())}</b></div>
    <button type="button" class="btn btn-pedido" data-accion="pedir">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
      Pedir por WhatsApp
    </button>
    <button type="button" class="link-btn panel-carrito__seguir" data-cerrar>Seguir comprando</button>`;
}

function abrirCarrito(abrir) {
  if (abrir) ultimoFoco = document.activeElement;
  panelCarrito.classList.toggle("abierto", abrir);
  panelCarrito.setAttribute("aria-hidden", String(!abrir));
  bloquearScroll();
  if (abrir) panelCarrito.querySelector("[data-cerrar]").focus();
  else ultimoFoco?.focus?.();
}

panelCarrito.addEventListener("click", (e) => {
  if (e.target.closest("[data-cerrar]")) return abrirCarrito(false);
  const b = e.target.closest("[data-accion]");
  if (!b) return;
  const l = carrito[Number(b.dataset.i)];
  if (b.dataset.accion === "menos") {
    l.cant -= 1;
    if (l.cant <= 0) carrito.splice(Number(b.dataset.i), 1);
    guardarCarrito();
  }
  if (b.dataset.accion === "mas") abrirTallas(l.id, l.talla);
  if (b.dataset.accion === "pedir") enviarPedido();
});

// Mensaje de WhatsApp con el pedido completo (zapato, talla, cantidad y total)
function enviarPedido() {
  const lineas = carrito.map((l) => {
    const p = producto(l.id);
    return p ? `• ${p.nombre} — Talla ${l.talla}${l.cant > 1 ? ` — x${l.cant}` : ""} — ${precio(p.precio * l.cant)}` : "";
  });
  const texto = `Hola Old Caribe, quiero hacer este pedido:\n${lineas.join("\n")}\nTotal: ${precio(totalPrecio())}`;
  window.open(linkWhatsApp(texto), "_blank");
}

capaFondo.addEventListener("click", () => {
  if (!modalTalla.hidden) cerrarTallas();
  else abrirCarrito(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!modalTalla.hidden) cerrarTallas();
  else if (panelCarrito.classList.contains("abierto")) abrirCarrito(false);
});

// ---------- Aviso corto al agregar ----------
let avisoTimer;
function avisar(texto) {
  const a = $("#aviso");
  a.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2ec4c6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span>${texto}</span><button type="button" class="aviso__ver">Ver carrito</button>`;
  a.classList.add("visible");
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => a.classList.remove("visible"), 3200);
}
$("#aviso").addEventListener("click", (e) => {
  if (!e.target.closest(".aviso__ver")) return;
  $("#aviso").classList.remove("visible");
  abrirCarrito(true);
});

// Delegación de eventos: funciona para cualquier tarjeta, aunque se repinte
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-carrito");
  if (btn) abrirTallas(btn.dataset.id);
  if (e.target.closest("#btn-carrito")) abrirCarrito(true);
});

// Enlaces de WhatsApp genéricos
document.querySelectorAll("[data-whatsapp]").forEach((a) => {
  a.href = linkWhatsApp();
  a.target = "_blank";
  a.rel = "noopener";
});

guardarCarrito();
document.querySelectorAll(".anio").forEach((el) => (el.textContent = new Date().getFullYear()));

// ============================================================
//  HEADER: menú lateral y buscador
// ============================================================
const menu = $("#menu-lateral");
const menuFondo = $("#menu-fondo");
const btnMenu = $("#btn-menu");

function abrirMenu(abrir) {
  menu.classList.toggle("abierto", abrir);
  menu.setAttribute("aria-hidden", String(!abrir));
  menuFondo.hidden = !abrir;
  btnMenu.setAttribute("aria-expanded", String(abrir));
  document.body.classList.toggle("menu-abierto", abrir);
  if (abrir) $("#btn-menu-cerrar").focus();
  else btnMenu.focus();
}
btnMenu?.addEventListener("click", () => abrirMenu(true));
$("#btn-menu-cerrar")?.addEventListener("click", () => abrirMenu(false));
menuFondo?.addEventListener("click", () => abrirMenu(false));
menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => abrirMenu(false)));

const formBuscar = $("#form-buscar");
const btnBuscar = $("#btn-buscar");
const header = $(".header");
// Solo se usa en responsive: en PC el buscador siempre está visible
btnBuscar?.addEventListener("click", () => {
  const abrir = !header.classList.contains("buscando");
  header.classList.toggle("buscando", abrir);
  btnBuscar.setAttribute("aria-expanded", String(abrir));
  if (abrir) $("#buscar").focus();
});
// El buscador del header lleva al catálogo con la búsqueda
// En el catálogo filtra al momento (sin recargar); en las demás páginas lleva al catálogo
formBuscar?.addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("#grid-catalogo")) {
    if (header?.classList.contains("buscando")) btnBuscar.click();   // cierra el buscador flotante
    return;
  }
  const q = $("#buscar").value.trim();
  location.href = "catalogo.html" + (q ? "?q=" + encodeURIComponent(q) : "");
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (menu?.classList.contains("abierto")) abrirMenu(false);
  else if (header?.classList.contains("buscando")) btnBuscar.click();
});

// ============================================================
//  PÁGINA DE INICIO
// ============================================================
const gridDestacados = $("#grid-destacados");
if (gridDestacados) {
  pintarGrilla(gridDestacados, PRODUCTOS.filter((p) => p.destacado).slice(0, 4));
  pintarGrilla($("#grid-nuevo"), PRODUCTOS.filter((p) => !p.destacado).slice(0, 4));

}

// ============================================================
//  PÁGINA DE CATÁLOGO
// ============================================================
const gridCatalogo = $("#grid-catalogo");
if (gridCatalogo) {
  const params = new URLSearchParams(location.search);
  const estado = {
    linea: LINEAS.includes(params.get("linea")) ? params.get("linea") : "Todos",
    orden: "destacados",
    q: params.get("q") || "",
  };

  const inputQ = $("#buscar");   // el buscador de la nav
  inputQ.value = estado.q;

  // Chips de línea: están en el panel de filtros y, en responsive, también fuera (siempre sincronizados)
  const contsLineas = document.querySelectorAll("[data-chips-linea]");
  contsLineas.forEach((c) => {
    c.innerHTML = LINEAS.map((l) => `<button type="button" class="chip" data-linea="${l}">${l}</button>`).join("");
  });

  function aplicarFiltros() {
    const q = estado.q.trim().toLowerCase();
    let lista = PRODUCTOS.filter((p) => {
      if (estado.linea !== "Todos" && p.linea !== estado.linea) return false;
      if (q && !p.nombre.toLowerCase().includes(q) && !p.linea.toLowerCase().includes(q)) return false;
      return true;
    });
    if (estado.orden === "menor") lista = [...lista].sort((a, b) => a.precio - b.precio);
    if (estado.orden === "mayor") lista = [...lista].sort((a, b) => b.precio - a.precio);

    pintarGrilla(gridCatalogo, lista);
    $("#contador").textContent = lista.length === 1 ? "1 modelo" : `${lista.length} modelos`;
    $("#vacio").hidden = lista.length > 0;

    document.querySelectorAll("[data-chips-linea] .chip").forEach((b) => {
      const activo = b.dataset.linea === estado.linea;
      b.classList.toggle("activo", activo);
      b.setAttribute("aria-pressed", activo);
    });

    // Contador del botón "Filtros" (lo que no se ve fuera del panel) y texto de "Ver N modelos"
    const extra = Number(estado.orden !== "destacados");
    const count = $("#filtros-count");
    count.textContent = extra;
    count.hidden = extra === 0;
    $("#btn-ver-resultados").textContent = lista.length === 1 ? "Ver 1 modelo" : `Ver ${lista.length} modelos`;
  }

  contsLineas.forEach((c) => c.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    estado.linea = b.dataset.linea;
    aplicarFiltros();
  }));
  inputQ.addEventListener("input", (e) => { estado.q = e.target.value; aplicarFiltros(); });

  // ---- Menú "Ordenar por" (propio, para poder darle estilo) ----
  const orden = $("#orden");
  const ordenBtn = orden.querySelector(".orden__btn");
  const ordenMenu = orden.querySelector(".orden__menu");
  const ordenOps = [...ordenMenu.querySelectorAll("[role=option]")];
  let ordenFoco = 0;

  function marcarFoco(i) {
    ordenFoco = (i + ordenOps.length) % ordenOps.length;
    ordenOps.forEach((o, k) => o.classList.toggle("enfocada", k === ordenFoco));
  }
  function abrirOrden(abrir) {
    ordenMenu.hidden = !abrir;
    orden.classList.toggle("abierto", abrir);
    ordenBtn.setAttribute("aria-expanded", String(abrir));
    if (abrir) { marcarFoco(ordenOps.findIndex((o) => o.dataset.valor === estado.orden)); ordenMenu.focus(); }
  }
  function ponerOrden(valor) {
    estado.orden = valor;
    pintarOrden();
    aplicarFiltros();
  }
  function pintarOrden() {
    ordenOps.forEach((o) => o.setAttribute("aria-selected", String(o.dataset.valor === estado.orden)));
    $("#orden-texto").textContent = ordenOps.find((o) => o.dataset.valor === estado.orden).textContent;
    orden.dataset.valor = estado.orden;
  }
  ordenBtn.addEventListener("click", () => abrirOrden(ordenMenu.hidden));
  ordenMenu.addEventListener("click", (e) => {
    const o = e.target.closest("[role=option]");
    if (!o) return;
    ponerOrden(o.dataset.valor);
    abrirOrden(false);
    ordenBtn.focus();
  });
  ordenMenu.addEventListener("mousemove", (e) => {
    const o = e.target.closest("[role=option]");
    if (o) marcarFoco(ordenOps.indexOf(o));
  });
  ordenMenu.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); marcarFoco(ordenFoco + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); marcarFoco(ordenFoco - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ordenOps[ordenFoco].click(); }
    else if (e.key === "Escape" || e.key === "Tab") { e.stopPropagation(); abrirOrden(false); if (e.key === "Escape") ordenBtn.focus(); }
  });
  document.addEventListener("click", (e) => { if (!orden.contains(e.target) && !ordenMenu.hidden) abrirOrden(false); });

  function limpiar() {
    Object.assign(estado, { linea: "Todos", orden: "destacados", q: "" });
    inputQ.value = "";
    pintarOrden();
    aplicarFiltros();
  }
  document.querySelectorAll("[data-limpiar]").forEach((b) => b.addEventListener("click", limpiar));

  // Panel de filtros en responsive
  const panel = $("#panel-filtros");
  const fondoFiltros = $("#filtros-fondo");
  const btnFiltros = $("#btn-filtros");
  function abrirFiltros(abrir) {
    panel.classList.toggle("abierto", abrir);
    fondoFiltros.hidden = !abrir;
    btnFiltros.setAttribute("aria-expanded", String(abrir));
    document.body.classList.toggle("menu-abierto", abrir);
    if (!abrir) btnFiltros.focus();
  }
  btnFiltros.addEventListener("click", () => abrirFiltros(true));
  $("#btn-filtros-cerrar").addEventListener("click", () => abrirFiltros(false));
  $("#btn-ver-resultados").addEventListener("click", () => abrirFiltros(false));
  fondoFiltros.addEventListener("click", () => abrirFiltros(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("abierto")) abrirFiltros(false);
  });

  aplicarFiltros();
}

// ============================================================
//  PÁGINA DE DETALLE DEL ZAPATO (producto.html?id=...)
// ============================================================
const detalle = $("#detalle");
if (detalle) {
  const p = producto(window.ZAPATO_ID || new URLSearchParams(location.search).get("id"));

  if (!p) {
    $("#detalle-migas").innerHTML = `<a href="index.html">Inicio</a> / <a href="catalogo.html">Catálogo</a>`;
    detalle.innerHTML = `
      <div class="detalle__no">
        <strong>NO ENCONTRAMOS ESE ZAPATO</strong>
        <span>Puede que ya no esté disponible. Mira el catálogo completo.</span>
        <a href="catalogo.html" class="btn btn--negro">Ver catálogo</a>
      </div>`;
    $("#detalle-relacionados-seccion").hidden = true;
  } else {
    document.title = `${p.nombre} — Old Caribe`;
    const agotado = p.badge === "Agotado";
    const tallas = [];
    for (let t = p.tallas[0]; t <= p.tallas[1]; t++) tallas.push(t);
    const media = p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" class="card__img">` : zapatoSVG(p);
    const badge = p.badge ? `<span class="badge ${BADGE_CLASE[p.badge] || ""}">${p.badge}</span>` : "";
    const texto = (typeof DESCRIPCIONES !== "undefined" && DESCRIPCIONES[p.id]) ||
      `${p.nombre} de la línea ${p.linea}. Revisamos cada par antes de enviarlo para que te llegue en perfecto estado.`;
    const marca = (typeof MARCAS !== "undefined" && MARCAS[p.linea]) || p.linea;

    $("#detalle-migas").innerHTML = `
      <a href="index.html">Inicio</a> / <a href="catalogo.html">Catálogo</a> /
      <a href="catalogo.html?linea=${encodeURIComponent(p.linea)}">${p.linea}</a> / <span>${p.nombre}</span>`;

    detalle.innerHTML = `
      <div class="detalle__media${p.foto ? " detalle__media--foto" : ""}">${badge}${media}</div>
      <div class="detalle__info">
        <span class="detalle__marca">${marca}</span>
        <h1 class="detalle__nombre">${p.nombre}</h1>
        <span class="detalle__precio">${precio(p.precio)}</span>
        <p class="detalle__texto">${texto}</p>

        <div class="detalle__bloque">
          <div class="detalle__bloque-cab">
            <span>Talla</span>
            <small id="detalle-talla-texto">${agotado ? "Agotado por ahora" : "Elige tu talla"}</small>
          </div>
          <div class="detalle__tallas" role="radiogroup" aria-label="Talla">
            ${tallas.map((t) => `<button type="button" class="talla-opcion" role="radio" aria-checked="false" data-dtalla="${t}" ${agotado ? "disabled" : ""}>${t}</button>`).join("")}
          </div>
          <a href="#" data-whatsapp class="detalle__ayuda">¿No sabes tu talla? Escríbenos y te ayudamos</a>
        </div>

        <div class="detalle__acciones">
          <button type="button" id="detalle-agregar" class="btn btn--negro btn--grande" ${agotado ? "disabled" : ""}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>
            ${agotado ? "Agotado" : "Agregar al carrito"}
          </button>
          <button type="button" id="detalle-comprar" class="btn btn--whatsapp btn--grande">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.24-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43m8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.62l6.04-1.58a11.3 11.3 0 0 0 5.41 1.38h.01c6.25 0 11.33-5.08 11.34-11.33 0-3.03-1.18-5.88-3.32-8.02"/></svg>
            Comprar por WhatsApp
          </button>
        </div>

        <ul class="detalle__datos">
          <li><span>Marca</span><b>${marca}</b></li>
          <li><span>Línea</span><b>${p.linea}</b></li>
          <li><span>Tallas</span><b>${p.tallas[0]} a ${p.tallas[1]}</b></li>
          <li><span>Disponibilidad</span><b>${agotado ? "Agotado" : p.badge === "Últimos pares" ? "Últimos pares" : "Disponible"}</b></li>
        </ul>

        <div class="detalle__ventajas">
          <span><i style="--color:#d6342a"></i>Calidad garantizada</span>
          <span><i style="--color:#f08a24"></i>Respuesta rápida</span>
          <span><i style="--color:#2ec4c6"></i>Delivery</span>
        </div>
      </div>`;

    let tallaElegida = null;
    const textoTalla = $("#detalle-talla-texto");
    const contTallas = detalle.querySelector(".detalle__tallas");

    contTallas.addEventListener("click", (e) => {
      const b = e.target.closest("[data-dtalla]");
      if (!b) return;
      tallaElegida = Number(b.dataset.dtalla);
      contTallas.querySelectorAll("[data-dtalla]").forEach((x) => {
        const on = x === b;
        x.classList.toggle("activo", on);
        x.setAttribute("aria-checked", on);
      });
      textoTalla.textContent = `Talla ${tallaElegida} seleccionada`;
      contTallas.classList.remove("falta");
    });

    // Sin talla elegida: se marca el bloque de tallas para que el cliente la elija
    function pedirTalla() {
      textoTalla.textContent = "Primero elige tu talla";
      contTallas.classList.remove("falta");
      void contTallas.offsetWidth;
      contTallas.classList.add("falta");
      contTallas.querySelector("[data-dtalla]")?.focus();
    }

    $("#detalle-agregar").addEventListener("click", () => {
      if (tallaElegida === null) return pedirTalla();
      agregarAlCarrito(p.id, tallaElegida);
      avisar(`<b>Talla ${tallaElegida}</b> · ${p.nombre}`);
    });

    $("#detalle-comprar").addEventListener("click", () => {
      if (agotado) {
        window.open(linkWhatsApp(), "_blank");
        return;
      }
      if (tallaElegida === null) return pedirTalla();
      window.open(linkWhatsApp(`Hola Old Caribe, quiero comprar:\n• ${p.nombre} — Talla ${tallaElegida} — ${precio(p.precio)}`), "_blank");
    });

    // Relacionados: primero de la misma línea, luego el resto
    const otros = PRODUCTOS.filter((x) => x.id !== p.id);
    const relacionados = [...otros.filter((x) => x.linea === p.linea), ...otros.filter((x) => x.linea !== p.linea)].slice(0, 4);
    pintarGrilla($("#grid-relacionados"), relacionados);
  }
}
