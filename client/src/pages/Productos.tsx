import { useMemo, useState } from 'react';
import { Nav } from '../components/Nav';
import { Toolbar } from '../components/Toolbar';
import { ProductCard } from '../components/ProductCard';
import { EmptyState, IconCaja, IconLupa } from '../components/EmptyState';
import { buttonVariants } from '../components/ui/Button';
import { cn } from '../lib/cn';
import { useProducts } from '../hooks/useProducts';

const WHATSAPP_NUMERO = import.meta.env.VITE_WHATSAPP_NUMERO;

export function Productos() {
  const { productos, loading, error } = useProducts();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter((p) => {
      const coincideTexto =
        !texto || p.nombre.toLowerCase().includes(texto) || (p.descripcion || '').toLowerCase().includes(texto);
      const coincideCat = !categoria || p.categoria === categoria;
      return coincideTexto && coincideCat;
    });
  }, [productos, busqueda, categoria]);

  const waHref = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Hola, quería hacer una consulta 🙂')}`;

  return (
    <>
      <Nav />
      <h1 className="page-title">Productos</h1>

      <Toolbar busqueda={busqueda} onBusquedaChange={setBusqueda} categoria={categoria} onCategoriaChange={setCategoria} />

      {error && (
        <p className="mx-auto mb-6 max-w-2xl rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
          No se pudieron cargar los productos: {error}
        </p>
      )}

      <div className="mx-auto grid max-w-5xl grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
        {loading ? (
          <p className="col-span-full text-center text-slate-500">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <EmptyState icon={<IconCaja />}>Todavía no hay productos cargados.</EmptyState>
        ) : visibles.length === 0 ? (
          <EmptyState icon={<IconLupa />}>No se encontraron productos con esos filtros.</EmptyState>
        ) : (
          visibles.map((producto) => <ProductCard key={producto.id} producto={producto} />)
        )}
      </div>

      <div className="mt-4 text-center">
        <a href={waHref} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: 'outline' }), 'mt-8')}>
          Contactar por WhatsApp
        </a>
      </div>
    </>
  );
}
