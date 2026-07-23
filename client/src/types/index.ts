export interface Product {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoria: string | null;
  imagen: string | null;
  badge: string | null;
  stock: number | null;
  oferta: boolean;
  precio_oferta: number | null;
  talles: string[] | null;
  created_at: string;
}

export type ProductInput = Omit<Product, 'id' | 'created_at'>;

export interface CartItem {
  id: string;
  productoId: string;
  nombre: string;
  precio: number;
  imagen: string | null;
  cantidad: number;
  stock: number | null;
  talle: string | null;
}

export interface Category {
  id: string;
  nombre: string;
  created_at: string;
}

export interface Slide {
  id: string;
  src: string;
  alt: string;
  orden: number;
  created_at: string;
}

export type SlideInput = Omit<Slide, 'id' | 'created_at'>;
