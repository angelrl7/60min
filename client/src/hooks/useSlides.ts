import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Slide, SlideInput } from '../types';

export function useSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('slides').select('*').order('orden', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setError(null);
        setSlides(data as Slide[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo conectar con Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function crear(input: Omit<SlideInput, 'orden'>) {
    const orden = slides.length ? Math.max(...slides.map((s) => s.orden)) + 1 : 0;
    const { error } = await supabase.from('slides').insert({ ...input, orden });
    if (error) throw new Error(error.message);
    await cargar();
  }

  async function eliminar(id: string) {
    const { error } = await supabase.from('slides').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await cargar();
  }

  async function reordenar(id: string, direccion: 'arriba' | 'abajo') {
    const idx = slides.findIndex((s) => s.id === id);
    const otroIdx = direccion === 'arriba' ? idx - 1 : idx + 1;
    if (idx === -1 || otroIdx < 0 || otroIdx >= slides.length) return;

    const actual = slides[idx];
    const otro = slides[otroIdx];
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from('slides').update({ orden: otro.orden }).eq('id', actual.id),
      supabase.from('slides').update({ orden: actual.orden }).eq('id', otro.id),
    ]);
    if (e1 || e2) throw new Error((e1 ?? e2)!.message);
    await cargar();
  }

  return { slides, loading, error, recargar: cargar, crear, eliminar, reordenar };
}

export async function subirImagenSlide(file: File): Promise<string> {
  const extension = file.name.split('.').pop();
  const nombreArchivo = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from('carousel-images').upload(nombreArchivo, file);
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('carousel-images').getPublicUrl(nombreArchivo);
  return data.publicUrl;
}
