import { useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

const PLACEHOLDER = (seed: string) => `https://picsum.photos/seed/${seed}/400/300`;

export function ProductCard({ producto, modoOferta = false }: { producto: Product; modoOferta?: boolean }) {
  const { addItem } = useCart();
  const [estado, setEstado] = useState<'idle' | 'agregado'>('idle');

  const sinStock = producto.stock !== null && producto.stock !== undefined && producto.stock === 0;
  const precioMostrado = modoOferta && producto.precio_oferta != null ? producto.precio_oferta : producto.precio;

  function handleAgregar() {
    const agregado = addItem(producto, modoOferta ? producto.precio_oferta : null);
    if (!agregado) return;
    setEstado('agregado');
    setTimeout(() => setEstado('idle'), 1200);
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

      <img
        src={producto.imagen || PLACEHOLDER(producto.id)}
        alt={producto.nombre}
        className={`aspect-4/3 w-full object-cover ${sinStock ? 'grayscale opacity-50' : ''}`}
        onError={(e) => {
          e.currentTarget.src = 'https://picsum.photos/400/300';
        }}
      />

      <p className="px-4 pt-3.5 text-base font-semibold text-slate-800">{producto.nombre}</p>

      {modoOferta && producto.precio_oferta != null ? (
        <>
          <p className="px-4 text-sm font-normal text-slate-400 line-through">
            ${producto.precio.toLocaleString('es-AR')}
          </p>
          <p className="px-4 text-lg font-bold text-red-500">${producto.precio_oferta.toLocaleString('es-AR')}</p>
        </>
      ) : (
        <p className="px-4 pb-4 text-lg font-bold text-brand-600">${precioMostrado.toLocaleString('es-AR')}</p>
      )}

      <p className="px-4 text-sm text-slate-500">{producto.descripcion || ''}</p>

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
    </div>
  );
}
