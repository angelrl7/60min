import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Category } from '../types';

export function useCategories() {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categories').select('*').order('nombre', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setError(null);
        setCategorias(data as Category[]);
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

  async function crear(nombre: string) {
    const { error } = await supabase.from('categories').insert({ nombre });
    if (error) throw new Error(error.message);
    await cargar();
  }

  async function eliminar(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await cargar();
  }

  return { categorias, loading, error, recargar: cargar, crear, eliminar };
}
