import { Link } from 'react-router-dom';
import { ShoppingCart, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NOMBRE_TIENDA = '60min';

export function Nav() {
  const { count } = useCart();

  return (
    <nav className="sticky top-0 z-40 mb-9 -mx-6 flex min-h-[70px] items-center justify-between border-b border-slate-200 bg-white/90 px-8 py-4 backdrop-blur-md sm:mx-0 sm:rounded-none">
      <Link to="/" className="flex items-center gap-2.5">
        <img src="/imagenes/logo.jpeg" alt={NOMBRE_TIENDA} className="h-9 w-9 rounded-lg object-cover" />
        <span className="text-lg font-bold text-slate-900">{NOMBRE_TIENDA}</span>
      </Link>

      <div className="flex items-center gap-4 text-sm font-semibold">
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
    </nav>
  );
}
