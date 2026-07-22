import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Settings, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NOMBRE_TIENDA = '60min';

export function Nav() {
  const { count } = useCart();
  const [abierto, setAbierto] = useState(false);

  return (
    <nav className="sticky top-0 z-40 mb-9 -mx-6 border-b border-slate-200 bg-white/90 backdrop-blur-md sm:mx-0">
      <div className="flex min-h-[70px] items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setAbierto(false)}>
          <img src="/imagenes/logo.jpeg" alt={NOMBRE_TIENDA} className="h-9 w-9 rounded-lg object-cover" />
          <span className="text-lg font-bold text-slate-900">{NOMBRE_TIENDA}</span>
        </Link>

        <div className="hidden items-center gap-4 text-sm font-semibold sm:flex">
          <Link to="/productos" className="text-slate-600 transition hover:text-brand-600">
            Productos
          </Link>
          <Link to="/ofertas" className="text-slate-600 transition hover:text-brand-600">
            Ofertas
          </Link>
          <Link to="/carrito" className="relative inline-flex items-center gap-1.5 text-slate-600 transition hover:text-brand-600">
            <ShoppingCart size={18} />
            Carrito
            {count > 0 && (
              <span className="absolute -right-3 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600"
          >
            <Settings size={16} />
            Admin
          </Link>
        </div>

        <button
          onClick={() => setAbierto((a) => !a)}
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
          className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 sm:hidden"
        >
          {abierto ? <X size={22} /> : <Menu size={22} />}
          {!abierto && count > 0 && (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
          )}
        </button>
      </div>

      {abierto && (
        <div className="flex flex-col gap-1 border-t border-slate-200 px-5 pb-4 pt-2 text-sm font-semibold sm:hidden">
          <Link
            to="/productos"
            onClick={() => setAbierto(false)}
            className="rounded-lg px-3 py-2.5 text-slate-600 transition hover:bg-slate-50 hover:text-brand-600"
          >
            Productos
          </Link>
          <Link
            to="/ofertas"
            onClick={() => setAbierto(false)}
            className="rounded-lg px-3 py-2.5 text-slate-600 transition hover:bg-slate-50 hover:text-brand-600"
          >
            Ofertas
          </Link>
          <Link
            to="/carrito"
            onClick={() => setAbierto(false)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-slate-600 transition hover:bg-slate-50 hover:text-brand-600"
          >
            <ShoppingCart size={18} />
            Carrito
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/login"
            onClick={() => setAbierto(false)}
            className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2.5 font-semibold text-white transition hover:bg-orange-600"
          >
            <Settings size={16} />
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
