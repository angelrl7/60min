
const WHATSAPP_NUMERO = '542645579914';

const CATEGORIAS = ['Electrónica', 'Accesorios', 'Hogar', 'Deporte', 'Otro'];


const productosBase = [

];

const productosExtra     = JSON.parse(localStorage.getItem('productos_extra')      || '[]');
const productosBaseEdits = JSON.parse(localStorage.getItem('productos_base_edits') || '{}');
const productos = [
  ...productosBase.map(p => productosBaseEdits[p.id] ? { ...p, ...productosBaseEdits[p.id] } : p),
  ...productosExtra
];

/* =========================================================
   HELPERS DE CARRITO (compartidos por todas las pantallas)
========================================================= */
function getCarrito() {
  return JSON.parse(localStorage.getItem('carrito') || '[]');
}
function setCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}
function cantidadTotalCarrito() {
  return getCarrito().reduce((acc, item) => acc + item.cantidad, 0);
}

/* Actualiza el globito con la cantidad de ítems en el nav (si existe) */
function actualizarContadorCarrito() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const total = cantidadTotalCarrito();
  badge.textContent = total;
  badge.style.display = total > 0 ? 'inline-flex' : 'none';
}

document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

/* =========================================================
   INDEX - Catálogo principal
========================================================= */
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const carrito = getCarrito();
  const existente = carrito.find(item => item.id === id);
  const cantidadActual = existente ? existente.cantidad : 0;

  if (producto.stock !== undefined && producto.stock !== null) {
    if (cantidadActual >= producto.stock) return;
  }

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen, cantidad: 1 });
  }

  setCarrito(carrito);

  const btn = document.querySelector(`[data-id="${id}"]`);
  if (btn) {
    btn.textContent = '¡Agregado!';
    btn.classList.add('btn-agregado');
    setTimeout(() => {
      btn.textContent = 'Agregar';
      btn.classList.remove('btn-agregado');
    }, 1200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('productos');
  if (!contenedor) return;

  const buscador  = document.getElementById('buscador');
  const filtroCat = document.getElementById('filtroCategoria');

  CATEGORIAS.forEach(cat => {
    const op = document.createElement('option');
    op.value = cat;
    op.textContent = cat;
    filtroCat.appendChild(op);
  });

  const waLink = document.getElementById('waLink');
  if (waLink) {
    waLink.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Hola, quería hacer una consulta 🙂')}`;
  }

  function obtenerVisibles() {
    const texto = buscador.value.trim().toLowerCase();
    const cat   = filtroCat.value;

    return productos.filter(p => {
      const coincideTexto = !texto ||
        p.nombre.toLowerCase().includes(texto) ||
        (p.descripcion || '').toLowerCase().includes(texto);
      const coincideCat = !cat || p.categoria === cat;
      return coincideTexto && coincideCat;
    });
  }

  function render() {
    const lista = obtenerVisibles();

    if (productos.length === 0) {
      contenedor.innerHTML = `
        <div class="empty-state">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
          </svg>
          <p>Todavía no hay productos cargados.</p>
        </div>`;
      return;
    }
    if (lista.length === 0) {
      contenedor.innerHTML = `
        <div class="empty-state">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <p>No se encontraron productos con esos filtros.</p>
        </div>`;
      return;
    }

    contenedor.innerHTML = lista.map(producto => {
      const sinStock = producto.stock !== undefined && producto.stock !== null && producto.stock === 0;
      const img = producto.imagen || `https://picsum.photos/seed/${producto.id}/400/300`;
      return `
        <div class="card">
          <img src="${img}" alt="${producto.nombre}" onerror="this.src='https://picsum.photos/400/300'" />
          <p>${producto.nombre}</p>
          <p>$${producto.precio.toLocaleString('es-AR')}</p>
          <p>${producto.descripcion || ''}</p>
          <button
            class="btn-agregar${sinStock ? ' btn-sin-stock' : ''}"
            data-id="${producto.id}"
            onclick="agregarAlCarrito(${producto.id})"
            ${sinStock ? 'disabled' : ''}
          >${sinStock ? 'Sin stock' : 'Agregar'}</button>
        </div>`;
    }).join('');
  }

  buscador.addEventListener('input', render);
  filtroCat.addEventListener('change', render);

  render();
});

/* =========================================================
   CARRUSEL (index)
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const pista   = document.getElementById('carrusel-pista');
  if (!pista) return;

  const fotos   = pista.querySelectorAll('img');
  const dots    = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('carrusel-prev');
  const nextBtn = document.getElementById('carrusel-next');
  let indice    = 0;
  let intervalo;

  function irA(i) {
    indice = (i + fotos.length) % fotos.length;
    pista.style.transform = `translateX(-${indice * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === indice));
  }

  function iniciarAuto() {
    intervalo = setInterval(() => irA(indice + 1), 3000);
  }

  function detenerAuto() { clearInterval(intervalo); }

  if (prevBtn) prevBtn.addEventListener('click', () => { detenerAuto(); irA(indice - 1); iniciarAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { detenerAuto(); irA(indice + 1); iniciarAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { detenerAuto(); irA(i); iniciarAuto(); }));

  iniciarAuto();
});
