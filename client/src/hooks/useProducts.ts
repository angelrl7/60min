import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Product, ProductInput } from '../types';

export function useProducts() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setError(null);
        setProductos(data as Product[]);
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

  async function crear(input: ProductInput) {
    const { error } = await supabase.from('products').insert(input);
    if (error) throw new Error(error.message);
    await cargar();
  }

  async function actualizar(id: string, input: Partial<ProductInput>) {
    const { error } = await supabase.from('products').update(input).eq('id', id);
    if (error) throw new Error(error.message);
    await cargar();
  }

  async function eliminar(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await cargar();
  }

  return { productos, loading, error, recargar: cargar, crear, actualizar, eliminar };
}

export async function descontarStock(items: { id: string; cantidad: number }[]) {
  await Promise.all(
    items.map(async ({ id, cantidad }) => {
      const { data } = await supabase.from('products').select('stock').eq('id', id).single();
      if (!data || data.stock === null) return;
      const nuevoStock = Math.max(0, data.stock - cantidad);
      await supabase.from('products').update({ stock: nuevoStock }).eq('id', id);
    })
  );
}

export async function subirImagen(file: File): Promise<string> {
  const extension = file.name.split('.').pop();
  const nombreArchivo = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from('product-images').upload(nombreArchivo, file);
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('product-images').getPublicUrl(nombreArchivo);
  return data.publicUrl;
}
