import { useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { Button } from './ui/Button';

export function CategoryManager() {
  const { categorias, loading, error, crear, eliminar } = useCategories();
  const [nombre, setNombre] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const valor = nombre.trim();
    if (!valor) return;
    setEnviando(true);
    setErrorMsg(null);
    try {
      await crear(valor);
      setNombre('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo crear la categoría.');
    } finally {
      setEnviando(false);
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    await eliminar(id);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
      <h2 className="mb-6 border-b-2 border-slate-100 pb-3.5 text-lg font-bold text-slate-900">Categorías</h2>

      {errorMsg && (
        <div className="mb-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Electrónica"
          className="input-field"
        />
        <Button type="submit" disabled={enviando} aria-label="Agregar categoría">
          <Plus size={16} />
        </Button>
      </form>

      {error && <p className="mb-2 text-sm text-red-600">No se pudieron cargar las categorías: {error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : categorias.length === 0 ? (
        <p className="text-sm text-slate-400">Todavía no cargaste categorías.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {categorias.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3.5 py-2">
              <span className="text-sm font-medium text-slate-700">{cat.nombre}</span>
              <button
                onClick={() => handleEliminar(cat.id)}
                aria-label={`Eliminar ${cat.nombre}`}
                className="cursor-pointer rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
