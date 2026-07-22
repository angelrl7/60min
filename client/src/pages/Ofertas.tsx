import { useEffect, useState } from 'react';
import { Nav } from '../components/Nav';
import { ProductCard } from '../components/ProductCard';
import { EmptyState, IconEtiqueta, IconReloj } from '../components/EmptyState';
import { useProducts } from '../hooks/useProducts';

const HORA_INICIO = 20;
const HORA_FIN = 22;

function enVentanaOferta(fecha: Date) {
  const h = fecha.getHours();
  return h >= HORA_INICIO && h < HORA_FIN;
}

function formatoHora(fecha: Date) {
  const h = String(fecha.getHours()).padStart(2, '0');
  const m = String(fecha.getMinutes()).padStart(2, '0');
  const s = String(fecha.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function Ofertas() {
  const { productos, loading } = useProducts();
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    const id = window.setInterval(() => setAhora(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const disponible = enVentanaOferta(ahora);
  const ofertaProductos = productos.filter((p) => p.oferta === true);

  return (
    <>
      <Nav />
      <h1 className="page-title">Ofertas del día</h1>

      {loading ? (
        <p className="text-center text-slate-500">Cargando ofertas...</p>
      ) : !disponible ? (
        <div className="mx-auto mt-10 max-w-md rounded-[20px] border border-slate-200 bg-white p-10 px-9 text-center shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex justify-center text-amber-500">
            <IconReloj />
          </div>
          <h2 className="mb-3 text-xl font-bold text-slate-800">Las ofertas no están disponibles ahora</h2>
          <p className="mb-2 text-sm text-slate-500">
            Volvé entre las <strong>{HORA_INICIO}:00</strong> y las <strong>{HORA_FIN}:00</strong> para ver los productos en
            oferta.
          </p>
          <div className="my-5 font-mono text-4xl font-bold tabular-nums text-brand-600">{formatoHora(ahora)}</div>
          <span className="inline-block rounded-full bg-amber-100 px-4.5 py-1.5 text-sm font-bold text-amber-800">
            Horario de ofertas: {HORA_INICIO}:00 – {HORA_FIN}:00
          </span>
        </div>
      ) : ofertaProductos.length === 0 ? (
        <EmptyState icon={<IconEtiqueta />}>El administrador aún no marcó ningún producto como oferta.</EmptyState>
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {ofertaProductos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} modoOferta />
          ))}
        </div>
      )}
    </>
  );
}
