import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { ProductForm } from '../components/ProductForm';
import { Modal } from '../components/Modal';
import { EmptyState, IconCaja } from '../components/EmptyState';
import { CategoryManager } from '../components/CategoryManager';
import { SlideManager } from '../components/SlideManager';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { Product } from '../types';

export function Admin() {
  const { signOut } = useAuth();
  const { productos, loading, error, crear, actualizar, eliminar } = useProducts();
  const [toast, setToast] = useState<string | null>(null);
  const [editando, setEditando] = useState<Product | null>(null);

  function mostrarToast(mensaje: string) {
    setToast(mensaje);
    setTimeout(() => setToast(null), 2200);
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    await eliminar(id);
    mostrarToast('Producto eliminado.');
  }

  return (
    <>
      <nav className="sticky top-0 z-40 mb-9 -mx-6 flex min-h-[70px] flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur-md sm:mx-0 sm:px-8">
        <span className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
          <Settings size={18} className="text-brand-600" /> Admin
        </span>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-brand-600">
            <ArrowLeft size={16} /> Ver tienda
          </Link>
          <Button onClick={() => signOut()} variant="destructive" size="sm">
            Cerrar sesión
          </Button>
        </div>
      </nav>

      <h1 className="page-title">Panel de Administración</h1>
      <p className="mb-7 text-center text-sm text-slate-500">Gestioná todos tus productos desde acá</p>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-[380px_1fr]">
        <div className="flex h-fit flex-col gap-6 md:sticky md:top-24">
          <CategoryManager />
          <SlideManager />

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
            <h2 className="mb-6 border-b-2 border-slate-100 pb-3.5 text-lg font-bold text-slate-900">Nuevo Producto</h2>
            {toast && (
              <div className="mb-4.5 rounded-lg bg-green-600 px-4 py-2.5 text-center font-semibold text-white">
                {toast}
              </div>
            )}
            <ProductForm
              submitLabel="+ Agregar Producto"
              onSubmit={async (input) => {
                await crear(input);
                mostrarToast('¡Producto agregado con éxito!');
              }}
            />
          </div>
        </div>

        <div>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">Todos los productos</h2>
            <Badge>{productos.length}</Badge>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              No se pudieron cargar los productos: {error}
            </p>
          )}

          {loading ? (
            <p className="text-slate-500">Cargando productos...</p>
          ) : productos.length === 0 ? (
            <EmptyState icon={<IconCaja />}>No hay productos cargados.</EmptyState>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
              {productos.map((p) => (
                <div key={p.id} className="card">
                  {p.badge && <Badge className="absolute right-2.5 top-2.5">{p.badge}</Badge>}
                  <img
                    src={p.imagen || `https://picsum.photos/seed/${p.id}/400/300`}
                    alt={p.nombre}
                    className="aspect-4/3 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://picsum.photos/400/300';
                    }}
                  />
                  <div className="px-4 pb-4 pt-3.5">
                    <div className="mb-1 font-bold text-slate-800">{p.nombre}</div>
                    <div className="mb-1.5 font-bold text-brand-600">${p.precio.toLocaleString('es-AR')}</div>
                    <div
                      className={`mb-1.5 text-sm font-semibold ${
                        p.stock === 0 ? 'text-red-600' : p.stock !== null ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {p.stock === null ? 'Stock no controlado' : p.stock === 0 ? 'Sin stock' : `Stock: ${p.stock}`}
                    </div>
                    <div className="text-sm leading-relaxed text-slate-500">{p.descripcion}</div>
                    {p.talles && p.talles.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.talles.map((talle) => (
                          <span
                            key={talle}
                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-600"
                          >
                            {talle}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <Button onClick={() => setEditando(p)} variant="secondary" size="sm" className="flex-1">
                        Editar
                      </Button>
                      <Button onClick={() => handleEliminar(p.id)} variant="destructive" size="sm" className="flex-1">
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={editando !== null} title="Editar Producto" onClose={() => setEditando(null)}>
        {editando && (
          <ProductForm
            producto={editando}
            submitLabel="Guardar cambios"
            onSubmit={async (input) => {
              await actualizar(editando.id, input);
              setEditando(null);
              mostrarToast('¡Producto actualizado con éxito!');
            }}
          />
        )}
      </Modal>
    </>
  );
}
