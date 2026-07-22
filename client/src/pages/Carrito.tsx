import { Minus, Plus, Trash2 } from 'lucide-react';
import { Nav } from '../components/Nav';
import { EmptyState, IconCarrito } from '../components/EmptyState';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { descontarStock } from '../hooks/useProducts';

const WHATSAPP_NUMERO = import.meta.env.VITE_WHATSAPP_NUMERO;
const PLACEHOLDER = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`;

export function Carrito() {
  const { items, total, changeQty, removeItem, clear } = useCart();

  function vaciarCarrito() {
    if (!confirm('¿Vaciar todo el carrito?')) return;
    clear();
  }

  async function finalizarCompra() {
    if (items.length === 0) return;

    let mensaje = '🛒 *Nuevo pedido:*\n\n';
    let totalPedido = 0;

    items.forEach((item) => {
      const subtotal = item.precio * item.cantidad;
      totalPedido += subtotal;
      mensaje += `• ${item.nombre} x${item.cantidad} — $${subtotal.toLocaleString('es-AR')}\n`;
    });

    mensaje += `\n*Total: $${totalPedido.toLocaleString('es-AR')}*`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');

    try {
      await descontarStock(items.map((item) => ({ id: item.id, cantidad: item.cantidad })));
    } catch {
      // El pedido ya se envió por WhatsApp; si falla el descuento de stock no bloqueamos al cliente.
    }

    clear();
  }

  return (
    <>
      <Nav />

      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {items.length === 0 ? (
          <EmptyState icon={<IconCarrito />}>Tu carrito está vacío.</EmptyState>
        ) : (
          items.map((item) => {
            const subtotal = item.precio * item.cantidad;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4.5 py-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.06)]"
              >
                <img
                  src={item.imagen || PLACEHOLDER(item.id)}
                  alt={item.nombre}
                  className="h-[70px] w-[70px] shrink-0 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://picsum.photos/200/200';
                  }}
                />
                <div className="flex-1">
                  <p className="mb-1 font-bold text-slate-800">{item.nombre}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      aria-label="Restar"
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-md bg-orange-50 text-orange-600 transition hover:bg-orange-100 active:scale-95"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-6 text-center font-bold text-slate-800">{item.cantidad}</span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      disabled={item.stock !== null && item.cantidad >= item.stock}
                      aria-label="Sumar"
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-md bg-orange-50 text-orange-600 transition hover:bg-orange-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <p className="font-bold text-brand-600">${subtotal.toLocaleString('es-AR')}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={13} /> Quitar
                  </button>
                </div>
              </div>
            );
          })
        )}

        {items.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 border-t-[3px] border-t-brand-600 bg-white px-6 py-4.5 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
            <span className="text-lg font-bold text-slate-800">Total</span>
            <span className="text-2xl font-bold text-brand-600">${total.toLocaleString('es-AR')}</span>
            <Button onClick={vaciarCarrito} variant="destructive" className="w-full">
              Vaciar
            </Button>
            <button
              onClick={finalizarCompra}
              className="w-full cursor-pointer rounded-xl bg-[#25d366] px-6 py-3 font-bold text-white transition hover:bg-[#1ebe5d] active:scale-[0.98]"
            >
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}
