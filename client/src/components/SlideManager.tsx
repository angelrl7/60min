import { useState, type FormEvent } from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { useSlides, subirImagenSlide } from '../hooks/useSlides';
import { Button } from './ui/Button';

export function SlideManager() {
  const { slides, loading, error, crear, eliminar, reordenar } = useSlides();
  const [alt, setAlt] = useState('');
  const [imagen, setImagen] = useState('');
  const [tabImagen, setTabImagen] = useState<'url' | 'archivo'>('url');
  const [subiendo, setSubiendo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    setErrorMsg(null);
    try {
      setImagen(await subirImagenSlide(file));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo subir la imagen.');
    } finally {
      setSubiendo(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!imagen.trim()) return;
    setEnviando(true);
    setErrorMsg(null);
    try {
      await crear({ src: imagen.trim(), alt: alt.trim() || 'Producto destacado' });
      setImagen('');
      setAlt('');
      setTabImagen('url');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo agregar la imagen.');
    } finally {
      setEnviando(false);
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar esta imagen del carrusel?')) return;
    await eliminar(id);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
      <h2 className="mb-6 border-b-2 border-slate-100 pb-3.5 text-lg font-bold text-slate-900">Carrusel de inicio</h2>

      {errorMsg && (
        <div className="mb-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-5 flex flex-col gap-3">
        <div>
          <label className="label-field">
            Texto alternativo <span className="normal-case font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Ej: Remera oficial"
            className="input-field"
          />
        </div>

        <div>
          <label className="label-field">Imagen</label>
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
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
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

          {imagen && (
            <img
              src={imagen}
              alt="Vista previa"
              className="mt-2.5 aspect-video w-full rounded-[10px] border-[1.5px] border-slate-200 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>

        <Button type="submit" disabled={enviando || subiendo || !imagen.trim()}>
          {enviando ? 'Agregando...' : '+ Agregar imagen'}
        </Button>
      </form>

      {error && <p className="mb-2 text-sm text-red-600">No se pudo cargar el carrusel: {error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : slides.length === 0 ? (
        <p className="text-sm text-slate-400">Todavía no cargaste imágenes para el carrusel.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {slides.map((slide, i) => (
            <li key={slide.id} className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-2">
              <img src={slide.src} alt={slide.alt} className="h-12 w-16 shrink-0 rounded-md object-cover" />
              <span className="flex-1 truncate text-sm font-medium text-slate-700">{slide.alt}</span>
              <button
                onClick={() => reordenar(slide.id, 'arriba')}
                disabled={i === 0}
                aria-label="Mover arriba"
                className="cursor-pointer rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowUp size={15} />
              </button>
              <button
                onClick={() => reordenar(slide.id, 'abajo')}
                disabled={i === slides.length - 1}
                aria-label="Mover abajo"
                className="cursor-pointer rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowDown size={15} />
              </button>
              <button
                onClick={() => handleEliminar(slide.id)}
                aria-label={`Eliminar ${slide.alt}`}
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
