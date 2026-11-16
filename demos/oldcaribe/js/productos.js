// ============================================================
//  CONFIGURACIÓN DE LA TIENDA
//  Cambia aquí tu número de WhatsApp (formato internacional, sin + ni espacios)
// ============================================================
const CONFIG = {
  whatsapp: "584127740771", // +58 412-7740771
  moneda: "$",
  // Dirección donde está publicada la página (sin / al final).
  // Hace falta para que WhatsApp y las redes muestren la foto al compartir un link.
  sitio: "https://trolluncho.pythonanywhere.com/oldcaribe",
};

// ============================================================
//  PRODUCTOS
//  - imagen: ruta a la foto real (ej: "img/Shoes/jordan-4-white-cement-foto.webp"). Si la dejas vacía,
//    se dibuja un zapato genérico con los colores c1, c2, c3.
//  - badge: "Nuevo" | "Más vendido" | "Últimos pares" | "Agotado" | ""
//  - destacado: true = sale en "Productos destacados" del inicio
//  - tallas: [mínima, máxima]
// ============================================================
const PRODUCTOS = [
  { id: "af1",   nombre: "Nike Air Force 1",       linea: "Air Force", precio: 110, tallas: [36, 45], badge: "",              destacado: true,  imagen: "img/Shoes/air-force-1-foto.webp?v=2", foto: true },
  { id: "aj1bt", nombre: "Air Jordan Retro 1 High Black Toe", linea: "Jordan", precio: 190, tallas: [39, 45], badge: "Nuevo", destacado: true, imagen: "img/Shoes/jordan-1-black-toe-foto.webp", foto: true },
  { id: "dunkg", nombre: "Nike SB Dunk Low Green Bear", linea: "Dunk", precio: 180, tallas: [38, 44], badge: "Nuevo", destacado: true, imagen: "img/Shoes/dunk-green-bear-foto.webp", foto: true },
  { id: "yzy", nombre: "Adidas Yeezy Boost 350 V2 Zebra", linea: "Adidas", precio: 230, tallas: [38, 45], badge: "Nuevo", destacado: true, imagen: "img/Shoes/yeezy-350-zebra-foto.webp", foto: true },
  { id: "tn",    nombre: "Nike Air Max Plus TN Hyper Blue", linea: "Air Max", precio: 200, tallas: [38, 45], badge: "Nuevo", destacado: false, imagen: "img/Shoes/air-max-plus-tn-hyper-blue-foto.webp", foto: true },
  { id: "vans",  nombre: "Vans Hylane Negras", linea: "Vans", precio: 90, tallas: [36, 44], badge: "Nuevo", destacado: false, imagen: "img/Shoes/vans-hylane-negras-foto.webp?v=2", foto: true },
  { id: "aj1",   nombre: "Air Jordan Retro 1 High",      linea: "Jordan",    precio: 160, tallas: [39, 44], badge: "", destacado: false, imagen: "img/Shoes/jordan-1-chicago-foto.webp", foto: true },
  { id: "aj4",   nombre: "Air Jordan Retro 4 White Cement", linea: "Jordan", precio: 180, tallas: [38, 44], badge: "Nuevo", destacado: false, imagen: "img/Shoes/jordan-4-white-cement-foto.webp", foto: true },
  { id: "dunk",  nombre: "Nike Dunk Low",          linea: "Dunk",      precio: 120, tallas: [36, 44], badge: "",   destacado: false, imagen: "", c1: "#ffffff", c2: "#161616", c3: "#161616" },
  { id: "aj1l",  nombre: "Air Jordan Retro 1 Low",       linea: "Jordan",    precio: 140, tallas: [38, 44], badge: "",              destacado: false, imagen: "", c1: "#ffffff", c2: "#2459a8", c3: "#161616" },
  { id: "samba", nombre: "Adidas Samba OG",        linea: "Adidas",    precio: 130, tallas: [36, 44], badge: "",              destacado: false, imagen: "", c1: "#ffffff", c2: "#161616", c3: "#c9a46a" },
  { id: "aj11",  nombre: "Air Jordan 11",          linea: "Jordan",    precio: 210, tallas: [40, 44], badge: "",       destacado: false, imagen: "", c1: "#ffffff", c2: "#111111", c3: "#ffffff" },
  { id: "af1b",  nombre: "Nike Air Force 1 Negro", linea: "Air Force", precio: 110, tallas: [37, 45], badge: "",              destacado: false, imagen: "", c1: "#1b1b1b", c2: "#111111", c3: "#2a2a2a" },
  { id: "aj3",   nombre: "Air Jordan 3",           linea: "Jordan",    precio: 190, tallas: [40, 45], badge: "",              destacado: false, imagen: "", c1: "#ffffff", c2: "#8d8d8d", c3: "#d6342a" },
  { id: "dunko", nombre: "Nike Dunk Low Naranja",  linea: "Dunk",      precio: 125, tallas: [36, 42], badge: "",              destacado: false, imagen: "", c1: "#ffffff", c2: "#f08a24", c3: "#f08a24" },
  { id: "campus",nombre: "Adidas Campus 00s",      linea: "Adidas",    precio: 135, tallas: [38, 44], badge: "",              destacado: false, imagen: "", c1: "#3a3a3a", c2: "#ffffff", c3: "#e8e8e8" },
];

const LINEAS = ["Todos", "Jordan", "Dunk", "Air Force", "Air Max", "Adidas", "Vans"];
const TALLAS = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

// Marca de cada línea (se muestra en la página de detalle)
const MARCAS = { "Jordan": "Jordan · Nike", "Dunk": "Nike", "Air Force": "Nike", "Air Max": "Nike", "Adidas": "Adidas", "Vans": "Vans" };

// Descripciones opcionales por zapato (id → texto). Si un zapato no tiene,
// se usa un texto general.
const DESCRIPCIONES = {
  af1: "El clásico de Nike que combina con todo. Cuero blanco completo, suela Air y una silueta que nunca pasa de moda.",
  aj1bt: "La Air Jordan Retro 1 High en la combinación Black Toe: puntera negra, talón rojo y cuero blanco. Un ícono de la cancha a la calle.",
  dunkg: "Nike SB Dunk Low con el oso verde de peluche en los laterales y suela azul. Un par llamativo para quien quiere destacar.",
  yzy: "Adidas Yeezy Boost 350 V2 en el colorway Zebra: tejido Primeknit blanco y negro, letras rojas y suela Boost muy cómoda.",
  vans: "Vans Hylane en negro: cuero con la clásica franja lateral blanca, suela gruesa estilo skate y detalle en goma color miel.",
  tn: "Nike Air Max Plus TN en el colorway Hyper Blue: degradado azul con las líneas negras, Swoosh amarillo y cámaras Air visibles en la suela.",
  aj4: "La Air Jordan Retro 4 en el clásico White Cement: cuero blanco, detalles en gris moteado y unidad Air visible en el talón.",
  aj1: "La Air Jordan Retro 1 High en rojo, blanco y negro. El modelo que empezó todo, con cuero de calidad y caña alta.",
};

// Nombre de archivo de la página de cada zapato: "Air Jordan Retro 1 High" → "air-jordan-retro-1-high"
function slugZapato(p) {
  return p.nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
