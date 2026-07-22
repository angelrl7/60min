import { Search } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

interface ToolbarProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  categoria: string;
  onCategoriaChange: (valor: string) => void;
}

export function Toolbar({ busqueda, onBusquedaChange, categoria, onCategoriaChange }: ToolbarProps) {
  const { categorias } = useCategories();

  return (
    <div className="mx-auto mb-9 flex max-w-3xl flex-wrap items-center gap-2.5 rounded-[20px] border border-slate-200 bg-white p-3 px-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
      <div className="relative flex min-w-[200px] flex-1 items-center">
        <Search className="pointer-events-none absolute left-3 text-slate-400" size={18} />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar producto..."
          autoComplete="off"
          className="w-full rounded-xl border-[1.5px] border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-brand-600 focus:bg-white"
        />
      </div>
      <select
        value={categoria}
        onChange={(e) => onCategoriaChange(e.target.value)}
        className="cursor-pointer rounded-xl border-[1.5px] border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-brand-600 focus:bg-white"
      >
        <option value="">Todas las categorías</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.nombre}>
            {cat.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
