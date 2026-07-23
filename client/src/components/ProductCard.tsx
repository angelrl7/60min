import { useState } from 'react';
import { Check, ShoppingCart, ZoomIn, X } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

const PLACEHOLDER = (seed: string) => `https://picsum.photos/seed/${seed}/400/300`;

export function ProductCard({ producto, modoOferta = false }: { producto: Product; modoOferta?: boolean }) {
  const { addItem } = useCart();
  const [estado, setEstado] = useState<'idle' | 'agregado'>('idle');
  const [talleElegido, setTalleElegido] = useState<string | null>(null);
  const [zoomAbierto, setZoomAbierto] = useState(false);
  const [faltaTalle, setFaltaTalle] = useState(false);

  const sinStock = producto.stock !== null && producto.stock !== undefined && producto.stock === 0;
  const precioMostrado = modoOferta && producto.precio_oferta != null ? producto.precio_oferta : producto.precio;
  const tieneTalles = !!producto.talles && producto.talles.length > 0;
  const srcImagen = producto.imagen || PLACEHOLDER(producto.id);

  function handleAgregar() {
    if (tieneTalles && !talleElegido) {
      setFaltaTalle(true);
      return;
    }
    const agregado = addItem(producto, modoOferta ? producto.precio_oferta : null, talleElegido);
    if (!agregado) return;
    setEstado('agregado');
    setTimeout(() => setEstado('idle'), 1200);
  }

  function elegirTalle(talle: string) {
    setTalleElegido(talle);
    setFaltaTalle(false);
  }

  return (
    <div className="card">
      {sinStock ? (
        <Badge variant="neutral" className="absolute right-2.5 top-2.5">
          Sin stock
        </Badge>
      ) : (
        <>
          {producto.badge && !modoOferta && <Badge className="absolute right-2.5 top-2.5">{producto.badge}</Badge>}
          {modoOferta && (
            <Badge variant="destructive" className="absolute right-2.5 top-2.5">
              OFERTA
            </Badge>
          )}
        </>
      )}

      <button
        type="button"
        onClick={() => setZoomAbierto(true)}
        className="group relative block w-full cursor-zoom-in overflow-hidden"
        aria-label={`Ver imagen de ${producto.nombre} más grande`}
      >
        <img
          src={srcImagen}
          alt={producto.nombre}
          className={`aspect-4/3 w-full object-cover transition group-hover:scale-105 ${sinStock ? 'grayscale opacity-50' : ''}`}
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/400/300';
          }}
        />
        <span className="pointer-events-none absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-slate-900/55 text-white opacity-0 transition group-hover:opacity-100">
          <ZoomIn size={16} />
        </span>
      </button>

      <p className="px-4 pt-3.5 text-base font-semibold text-slate-800">{producto.nombre}</p>

      {modoOferta && producto.precio_oferta != null ? (
        <>
          <p className="px-4 text-sm font-normal text-slate-400 line-through">
            ${producto.precio.toLocaleString('es-AR')}
          </p>
          <p className="px-4 text-lg font-bold text-red-500">${producto.precio_oferta.toLocaleString('es-AR')}</p>
        </>
      ) : (
        <p className="px-4 text-lg font-bold text-brand-600">${precioMostrado.toLocaleString('es-AR')}</p>
      )}

      <p className="px-4 text-sm text-slate-500">{producto.descripcion || ''}</p>

      {tieneTalles && !sinStock && (
        <div className="mt-2.5 px-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Talle</p>
          <div className="flex flex-wrap gap-1.5">
            {producto.talles!.map((talle) => (
              <button
                key={talle}
                type="button"
                onClick={() => elegirTalle(talle)}
                className={`rounded-md border-2 px-2.5 py-1 text-xs font-semibold transition ${
                  talleElegido === talle
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-orange-300'
                }`}
              >
                {talle}
              </button>
            ))}
          </div>
          {faltaTalle && <p className="mt-1 text-xs font-semibold text-red-500">Elegí un talle para continuar.</p>}
        </div>
      )}

      <Button
        disabled={sinStock}
        onClick={handleAgregar}
        variant={estado === 'agregado' ? 'primary' : 'secondary'}
        size="sm"
        className={`mx-4 mb-4 mt-3 ${
          sinStock
            ? 'bg-slate-100 text-slate-400 shadow-none hover:bg-slate-100 disabled:opacity-100'
            : estado === 'agregado'
              ? 'bg-green-600 shadow-green-600/30 hover:bg-green-600'
              : ''
        }`}
      >
        {sinStock ? (
          'Sin stock'
        ) : estado === 'agregado' ? (
          <>
            <Check size={16} /> ¡Agregado!
          </>
        ) : (
          <>
            <ShoppingCart size={16} /> Agregar
          </>
        )}
      </Button>

      {zoomAbierto && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/80 p-6"
          onClick={() => setZoomAbierto(false)}
        >
          <button
            onClick={() => setZoomAbierto(false)}
            aria-label="Cerrar"
            className="absolute right-5 top-5 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={22} />
          </button>
          <img
            src={srcImagen}
            alt={producto.nombre}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-[0_24px_64px_rgba(0,0,0,0.4)]"
          />
        </div>
      )}
    </div>
  );
}
