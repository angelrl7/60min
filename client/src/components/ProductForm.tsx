import { useState, type FormEvent } from 'react';
import type { Product, ProductInput } from '../types';
import { subirImagen } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { Button } from './ui/Button';

const TALLES_COMUNES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface FormState {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria: string;
  badge: string;
  imagen: string;
  oferta: boolean;
  precio_oferta: string;
  talles: string[];
}

function valoresIniciales(producto?: Product): FormState {
  return {
    nombre: producto?.nombre ?? '',
    descripcion: producto?.descripcion ?? '',
    precio: producto?.precio?.toString() ?? '',
    stock: producto?.stock != null ? producto.stock.toString() : '',
    categoria: producto?.categoria ?? '',
    badge: producto?.badge ?? '',
    imagen: producto?.imagen ?? '',
    oferta: producto?.oferta ?? false,
    precio_oferta: producto?.precio_oferta != null ? producto.precio_oferta.toString() : '',
    talles: producto?.talles ?? [],
  };
}

export function ProductForm({
  producto,
  submitLabel,
  onSubmit,
}: {
  producto?: Product;
  submitLabel: string;
  onSubmit: (input: ProductInput) => Promise<void>;
}) {
  const { categorias } = useCategories();
  const [form, setForm] = useState<FormState>(() => valoresIniciales(producto));
  const [tabImagen, setTabImagen] = useState<'url' | 'archivo'>(
    producto?.imagen?.startsWith('http') === false ? 'archivo' : 'url'
  );
  const [subiendo, setSubiendo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [talleCustom, setTalleCustom] = useState('');

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleTalle(talle: string) {
    setForm((f) =>
      f.talles.includes(talle) ? { ...f, talles: f.talles.filter((t) => t !== talle) } : { ...f, talles: [...f.talles, talle] }
    );
  }

  function agregarTalleCustom() {
    const talle = talleCustom.trim();
    if (!talle || form.talles.includes(talle)) return;
    setForm((f) => ({ ...f, talles: [...f.talles, talle] }));
    setTalleCustom('');
  }

  function quitarTalle(talle: string) {
    setForm((f) => ({ ...f, talles: f.talles.filter((t) => t !== talle) }));
  }

  async function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    setErrorMsg(null);
    try {
      const url = await subirImagen(file);
      set('imagen', url);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo subir la imagen.');
    } finally {
      setSubiendo(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const input: ProductInput = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      precio: parseFloat(form.precio),
      stock: form.stock !== '' ? parseInt(form.stock, 10) : null,
      categoria: form.categoria || null,
      badge: form.badge.trim() || null,
      imagen: form.imagen.trim() || null,
      oferta: form.oferta,
      precio_oferta: form.oferta && form.precio_oferta !== '' ? parseFloat(form.precio_oferta) : null,
      talles: form.talles.length > 0 ? form.talles : null,
    };

    setEnviando(true);
    try {
      await onSubmit(input);
      if (!producto) {
        setForm(valoresIniciales());
        setTabImagen('url');
        setTalleCustom('');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Ocurrió un error al guardar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errorMsg && <div className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">{errorMsg}</div>}

      <div>
        <label className="label-field">Nombre</label>
        <input
          type="text"
          required
          value={form.nombre}
          onChange={(e) => set('nombre', e.target.value)}
          placeholder="Ej: Auriculares Pro Max"
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field">Descripción</label>
        <textarea
          required
          value={form.descripcion}
          onChange={(e) => set('descripcion', e.target.value)}
          placeholder="Descripción del producto..."
          className="input-field min-h-20 resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-field">Precio ($)</label>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={form.precio}
            onChange={(e) => set('precio', e.target.value)}
            placeholder="99.99"
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">
            Stock <span className="normal-case font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => set('stock', e.target.value)}
            placeholder="Ej: 50"
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-field">
            Categoría <span className="normal-case font-normal text-slate-400">(opcional)</span>
          </label>
          <select value={form.categoria} onChange={(e) => set('categoria', e.target.value)} className="input-field">
            <option value="">Sin categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field">
            Badge <span className="normal-case font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.badge}
            onChange={(e) => set('badge', e.target.value)}
            placeholder="Oferta, Nuevo..."
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label-field">
          Imagen <span className="normal-case font-normal text-slate-400">(opcional)</span>
        </label>
        <div className="mb-2 flex gap-1">
          <button
            type="button"
            onClick={() => setTabImagen('url')}
            className={`rounded-lg border-2 px-4 py-1.5 text-sm font-semibold transition ${
              tabImagen === 'url'
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => setTabImagen('archivo')}
            className={`rounded-lg border-2 px-4 py-1.5 text-sm font-semibold transition ${
              tabImagen === 'archivo'
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            Archivo
          </button>
        </div>

        {tabImagen === 'url' ? (
          <input
            type="url"
            value={form.imagen}
            onChange={(e) => set('imagen', e.target.value)}
            placeholder="https://..."
            className="input-field"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleArchivo}
            className="w-full cursor-pointer rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-2.5 text-sm"
          />
        )}
        {subiendo && <p className="mt-1.5 text-xs text-slate-400">Subiendo imagen...</p>}

        {form.imagen && (
          <img
            src={form.imagen}
            alt="Vista previa"
            className="mt-2.5 aspect-4/3 w-full rounded-[10px] border-[1.5px] border-slate-200 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      <div>
        <label className="label-field">
          Talles <span className="normal-case font-normal text-slate-400">(opcional)</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TALLES_COMUNES.map((talle) => (
            <button
              key={talle}
              type="button"
              onClick={() => toggleTalle(talle)}
              className={`rounded-lg border-2 px-3 py-1.5 text-sm font-semibold transition ${
                form.talles.includes(talle)
                  ? 'border-orange-500 bg-orange-500 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              {talle}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-1.5">
          <input
            type="text"
            value={talleCustom}
            onChange={(e) => setTalleCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                agregarTalleCustom();
              }
            }}
            placeholder="Otro talle (ej: 38, Único)"
            className="input-field"
          />
          <Button type="button" variant="secondary" onClick={agregarTalleCustom}>
            Agregar
          </Button>
        </div>

        {form.talles.filter((t) => !TALLES_COMUNES.includes(t)).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {form.talles
              .filter((t) => !TALLES_COMUNES.includes(t))
              .map((talle) => (
                <span
                  key={talle}
                  className="inline-flex items-center gap-1.5 rounded-lg border-2 border-orange-500 bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  {talle}
                  <button
                    type="button"
                    onClick={() => quitarTalle(talle)}
                    aria-label={`Quitar talle ${talle}`}
                    className="text-white/80 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          id={`oferta-${producto?.id ?? 'nuevo'}`}
          checked={form.oferta}
          onChange={(e) => set('oferta', e.target.checked)}
          className="h-4 w-4 accent-red-500"
        />
        <label htmlFor={`oferta-${producto?.id ?? 'nuevo'}`} className="text-sm normal-case tracking-normal text-slate-700">
          Marcar como oferta <span className="text-slate-400">(visible 20–22 hs)</span>
        </label>
      </div>

      {form.oferta && (
        <div>
          <label className="label-field">
            Precio oferta ($) <span className="normal-case font-normal text-slate-400">(el que se muestra en Ofertas)</span>
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.precio_oferta}
            onChange={(e) => set('precio_oferta', e.target.value)}
            placeholder="Ej: 79.99"
            className="input-field"
          />
        </div>
      )}

      <Button type="submit" disabled={enviando || subiendo} className="mt-1">
        {enviando ? 'Guardando...' : submitLabel}
      </Button>
    </form>
  );
}
