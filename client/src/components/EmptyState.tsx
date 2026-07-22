import type { ReactNode } from 'react';
import { PackageOpen, Search, ShoppingCart, Clock, Tag } from 'lucide-react';

export function EmptyState({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="empty-state">
      <div className="text-slate-300">{icon}</div>
      <p className="text-base text-slate-500">{children}</p>
    </div>
  );
}

export function IconCaja() {
  return <PackageOpen size={52} strokeWidth={1.5} />;
}

export function IconLupa() {
  return <Search size={52} strokeWidth={1.5} />;
}

export function IconCarrito() {
  return <ShoppingCart size={48} strokeWidth={1.5} />;
}

export function IconReloj() {
  return <Clock size={56} strokeWidth={1.5} />;
}

export function IconEtiqueta() {
  return <Tag size={56} strokeWidth={1.5} />;
}
