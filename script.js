/* =======================================================
   SCRIPT.JS — Lógica de la página Baterías Store
   =======================================================
   Contiene:
   1. Datos de las baterías  ← EDITA AQUÍ para cambiar modelos
   2. Función que crea cada tarjeta
   3. Funciones del slider (flechas y puntos)
   4. Función del botón Garantía
   5. Código que renderiza todo al cargar la página
======================================================= */


/* -------------------------------------------------------
   1. DATOS DE LAS BATERÍAS
   Para agregar un modelo nuevo, copia uno de los bloques
   { capacidad, specs, fotos } y rellénalo con tus datos.
------------------------------------------------------- */
const baterias = {

  topmaq: [
    {
      capacidad: "35Ah",
      disponible: false, 
      specs: {
        "Largo":     "34 cm",
        "Ancho":     "22 cm",
        "Alto":      "18 cm",
        "Autonomía": "~80 km",
        "Año":       "2026"
      },
      fotos: ["img/top35.jpeg", "img/top35-1.jpg"]   // ← pon aquí las rutas de tus imágenes
    },
    {
      capacidad: "45Ah",
      disponible: true,
      specs: {
        "Largo":     " 38 cm",
        "Ancho":     " 23 cm",
        "Alto":      " 18 cm",
        "Autonomía": "~100 km",
        "Año":       "2026"
      },
      fotos: ["img/top45.png", "img/top45-1.jpg"]
    },
    {
      capacidad: "55Ah",
      disponible: true,
      specs: {
        "Largo":     " 38 cm",
        "Ancho":     " 23 cm",
        "Alto":      " 18 cm",
        "Autonomía": "~120 km",
        "Año":       "2026"
      },
      fotos: ["img/top55.jpeg", "img/top55-1.jpeg"]
    },
    {
      capacidad: "65Ah",
      disponible: true,
      specs: {
        "Largo":     " 52.5 cm",
        "Ancho":     " 23.5 cm",
        "Alto":      " 19 cm",
        "Autonomía": "~160 km",
        "Año":       "2026"
      },
      fotos: ["img/top65.jpeg", "img/top65-1.jpeg"]
    },
    {
      capacidad: "75Ah",
      disponible: false,
      specs: {
        "Largo":     " 52 cm",
        "Ancho":     " 23 cm",
        "Alto":      " 18 cm",
        "Autonomía": "~180 km",
        "Año":       "2026"
      },
      fotos: ["img/top75.jpeg", "img/top75-1.jpg"]
    }
  ],

  mishozuki: [
    {
      capacidad: "70Ah",
      disponible: true,
      specs: {
        "Largo":     " 38 cm",
        "Ancho":     " 22 cm",
        "Alto":      " 18 cm",
        "Autonomía": "~170 km",
        "Año":       "2026"
      },
      fotos: ["img/mis70.jpg", "img/mis70-1.jpg"]
    }
  ]

};


/* -------------------------------------------------------
   2. CREAR UNA TARJETA
   Recibe la marca ("topmaq" o "mishozuki") y los datos
   de la batería, y devuelve el HTML de la tarjeta.
------------------------------------------------------- */
function crearTarjeta(marca, bateria) {
  const { capacidad, specs, fotos,disponible } = bateria;
  const marcaNombre = marca === "topmaq" ? "TOPMAQ" : "MISHOZUKI";

  // Armar el enlace de WhatsApp con mensaje personalizado
  const textoWapp = encodeURIComponent(
    `Hola, estoy interesado en la batería ${marcaNombre} de ${capacidad} que vi en su sitio web`
  );
  const linkWapp = `https://wa.me/5358855420?text=${textoWapp}`;
  const botonHTML = disponible 
    ? `<a href="${linkWapp}" target="_blank" class="btn-wapp">Consultar por WhatsApp</a>`
    : `<div class="btn-agotado">Producto Agotado</div>`;
    const badgeAgotado = disponible ? '' : `<div class="badge-agotado">SIN STOCK</div>`;

  // Generar las diapositivas del slider
 const slidesHTML = fotos.map((foto, i) => `
    <div class="slide ${i === 0 ? 'active' : ''}">
      <img src="${foto}" alt="${marcaNombre} ${capacidad}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="slide-img-placeholder" style="display:none">
        🔋
        <span>${marcaNombre} ${capacidad}</span>
      </div>
    </div>
  `).join('');

  // Flechas (solo aparecen si hay más de 1 foto)
  const flechasHTML = fotos.length > 1 ? `
    <button class="slider-btn prev" onclick="cambiarSlide(this.closest('.card'), -1)">&#8249;</button>
    <button class="slider-btn next" onclick="cambiarSlide(this.closest('.card'),  1)">&#8250;</button>
  ` : '';

  // Puntos indicadores (solo si hay más de 1 foto)
  const dotsHTML = fotos.length > 1
    ? `<div class="slider-dots">
        ${fotos.map((_, i) => `
          <button class="dot ${i === 0 ? 'active' : ''}"
                  onclick="irSlide(this.closest('.card'), ${i})">
          </button>
        `).join('')}
       </div>`
    : '';

  // Especificaciones en lista
  const specsHTML = Object.entries(specs).map(([clave, valor]) => `
    <li>
      <span class="spec-label">${clave}</span>
      <span>${valor}</span>
    </li>
  `).join('');

  // Retornar el HTML completo de la tarjeta
 return `
    <div class="card ${disponible ? '' : 'card-disabled'}">
      <div class="slider-wrap">
        ${badgeAgotado}
        ${slidesHTML}
        ${flechasHTML}
        ${dotsHTML}
      </div>
      <div class="card-body">
        <div class="card-title">${marcaNombre} — ${capacidad}</div>
        <ul class="specs-list">${specsHTML}</ul>
        ${botonHTML} 
      </div>
    </div>
  `;
}


/* -------------------------------------------------------
   3A. CAMBIAR SLIDE CON FLECHAS
   Se llama al hacer clic en ← o →
   direccion = -1 (anterior) o +1 (siguiente)
------------------------------------------------------- */
function cambiarSlide(card, direccion) {
  const slides = card.querySelectorAll('.slide');
  const dots   = card.querySelectorAll('.dot');

  // Encontrar el slide activo actual
  let actual = [...slides].findIndex(s => s.classList.contains('active'));

  // Quitarle la clase activa
  slides[actual].classList.remove('active');
  if (dots[actual]) dots[actual].classList.remove('active');

  // Calcular el siguiente (con vuelta circular)
  actual = (actual + direccion + slides.length) % slides.length;

  // Activar el nuevo
  slides[actual].classList.add('active');
  if (dots[actual]) dots[actual].classList.add('active');
}


/* -------------------------------------------------------
   3B. IR A UN SLIDE POR ÍNDICE (puntos)
   Se llama al hacer clic en un punto indicador
------------------------------------------------------- */
function irSlide(card, indice) {
  const slides = card.querySelectorAll('.slide');
  const dots   = card.querySelectorAll('.dot');

  // Desactivar todos
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  // Activar el seleccionado
  slides[indice].classList.add('active');
  if (dots[indice]) dots[indice].classList.add('active');
}


/* -------------------------------------------------------
   4. MOSTRAR / OCULTAR INFORMACIÓN DE GARANTÍA
------------------------------------------------------- */
function toggleGarantia() {
  const caja   = document.getElementById('garantia-box');
  const flecha = document.getElementById('garantia-arrow');

  const abierto = caja.classList.toggle('visible');
  flecha.textContent = abierto ? '▲' : '▼';
}


/* -------------------------------------------------------
   5. RENDERIZAR LAS TARJETAS AL CARGAR LA PÁGINA
   Esto se ejecuta automáticamente cuando el navegador
   termina de cargar el HTML.
------------------------------------------------------- */
document.getElementById('grid-topmaq').innerHTML =
  baterias.topmaq.map(b => crearTarjeta('topmaq', b)).join('');

document.getElementById('grid-mishozuki').innerHTML =
  baterias.mishozuki.map(b => crearTarjeta('mishozuki', b)).join('');
