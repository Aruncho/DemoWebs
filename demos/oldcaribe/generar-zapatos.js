// ============================================================
//  OLD CARIBE — Generador de páginas de zapatos
//
//  Crea una página por zapato en la carpeta zapatos/ (ej: zapatos/nike-air-force-1.html)
//  para que, al compartir el link en WhatsApp o redes, salga la foto y el nombre del zapato.
//
//  Cuándo correrlo: cada vez que agregues, quites o cambies un zapato en js/productos.js
//  Cómo correrlo:   abre una terminal en esta carpeta y escribe   node generar-zapatos.js
//
//  Foto para compartir: si existe img/og/<id>.jpg (1200×630) se usa esa;
//  si no, la foto del zapato; y si no tiene foto, el logo de Old Caribe.
// ============================================================
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const raiz = __dirname;
const leer = (f) => fs.readFileSync(path.join(raiz, f), "utf8");

// Carga la lista de zapatos tal cual la usa la página
const contexto = {};
vm.createContext(contexto);
vm.runInContext(leer("js/productos.js") + "\n;this.CONFIG = CONFIG; this.PRODUCTOS = PRODUCTOS; this.DESCRIPCIONES = DESCRIPCIONES; this.slugZapato = slugZapato;", contexto);
const { CONFIG, PRODUCTOS, DESCRIPCIONES, slugZapato } = contexto;

const sitio = CONFIG.sitio.replace(/\/$/, "");
const plantilla = leer("producto.html");
const escapar = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const carpeta = path.join(raiz, "zapatos");
fs.mkdirSync(carpeta, { recursive: true });
// Borra las páginas viejas (por si se quitó o renombró un zapato)
for (const f of fs.readdirSync(carpeta)) if (f.endsWith(".html")) fs.unlinkSync(path.join(carpeta, f));

for (const p of PRODUCTOS) {
  const slug = slugZapato(p);
  const titulo = `${p.nombre} — Old Caribe`;
  const desc = `${CONFIG.moneda}${p.precio} · Tallas ${p.tallas[0]} a ${p.tallas[1]}. ` +
    (DESCRIPCIONES[p.id] || `${p.nombre} de la línea ${p.linea}. Pide por WhatsApp.`);

  let imagen = "img/og-image.jpg", ancho = 1200, alto = 630;
  if (fs.existsSync(path.join(raiz, `img/og/${p.id}.jpg`))) imagen = `img/og/${p.id}.jpg`;
  else if (p.imagen) { imagen = p.imagen.split("?")[0]; ancho = alto = null; }

  const meta = [
    `<base href="../">`,
    `<title>${escapar(titulo)}</title>`,
    `<meta name="description" content="${escapar(desc)}">`,
    `<link rel="canonical" href="${sitio}/zapatos/${slug}.html">`,
    `<meta property="og:type" content="product">`,
    `<meta property="og:site_name" content="Old Caribe">`,
    `<meta property="og:title" content="${escapar(`${p.nombre} — ${CONFIG.moneda}${p.precio}`)}">`,
    `<meta property="og:description" content="${escapar(desc)}">`,
    `<meta property="og:url" content="${sitio}/zapatos/${slug}.html">`,
    `<meta property="og:image" content="${sitio}/${imagen}">`,
    ancho ? `<meta property="og:image:width" content="${ancho}">\n  <meta property="og:image:height" content="${alto}">` : "",
    `<meta property="og:image:alt" content="${escapar(p.nombre)}">`,
    `<meta property="og:locale" content="es_VE">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="theme-color" content="#0e0e0e">`,
  ].filter(Boolean).join("\n  ");

  let html = plantilla
    // quita el título y las etiquetas de vista previa generales de producto.html
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/\s*<meta name="description"[^>]*>/, "")
    .replace(/\s*<!-- Vista previa al compartir[\s\S]*?-->/, "")
    .replace(/\s*<meta (property="og:|name="twitter:|name="theme-color")[^>]*>/g, "")
    .replace(/<meta name="viewport"[^>]*>/, (m) => `${m}\n  ${meta}`)
    // le dice a la página qué zapato mostrar
    .replace('<script src="js/productos.js"></script>', `<script>window.ZAPATO_ID = ${JSON.stringify(p.id)};</script>\n  <script src="js/productos.js"></script>`);

  html = html.replace("<!DOCTYPE html>", "<!DOCTYPE html>\n<!-- Página generada por generar-zapatos.js: no la edites a mano. Cambia producto.html o js/productos.js y vuelve a correr el generador -->");
  fs.writeFileSync(path.join(carpeta, `${slug}.html`), html);
  console.log(`✔ zapatos/${slug}.html`);
}

if (sitio.includes("TU-DOMINIO")) {
  console.log("\n⚠ Falta poner la dirección real de la página en CONFIG.sitio (js/productos.js)." +
    "\n  Sin eso, WhatsApp no puede mostrar la foto al compartir.");
}
