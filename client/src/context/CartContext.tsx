import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';

const CART_KEY = 'carrito';

function leerCarrito(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (producto: Product, precioOverride?: number | null) => boolean;
  changeQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => leerCarrito());

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(producto: Product, precioOverride: number | null = null) {
    let agregado = false;
    setItems((actual) => {
      const existente = actual.find((i) => i.id === producto.id);
      const cantidadActual = existente ? existente.cantidad : 0;

      if (producto.stock !== null && producto.stock !== undefined && cantidadActual >= producto.stock) {
        return actual;
      }

      agregado = true;
      if (existente) {
        return actual.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [
        ...actual,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: precioOverride ?? producto.precio,
          imagen: producto.imagen,
          cantidad: 1,
          stock: producto.stock,
        },
      ];
    });
    return agregado;
  }

  function changeQty(id: string, delta: number) {
    setItems((actual) => {
      const item = actual.find((i) => i.id === id);
      if (!item) return actual;
      const nuevaCantidad = item.cantidad + delta;
      if (nuevaCantidad <= 0) return actual.filter((i) => i.id !== id);
      if (item.stock !== null && nuevaCantidad > item.stock) return actual;
      return actual.map((i) => (i.id === id ? { ...i, cantidad: nuevaCantidad } : i));
    });
  }

  function removeItem(id: string) {
    setItems((actual) => actual.filter((i) => i.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((acc, i) => acc + i.cantidad, 0);
  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, changeQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
