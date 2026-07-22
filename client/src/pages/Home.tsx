import { Link } from 'react-router-dom';
import { Award, Truck, MessageCircle, Wallet } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Carousel } from '../components/Carousel';
import { buttonVariants } from '../components/ui/Button';
import { cn } from '../lib/cn';
import { useSlides } from '../hooks/useSlides';

const NOMBRE_TIENDA = '60min';

const SLIDES_POR_DEFECTO = [
  { src: 'https://picsum.photos/seed/tienda-1/800/400', alt: 'Producto destacado 1' },
  { src: 'https://picsum.photos/seed/tienda-2/800/400', alt: 'Producto destacado 2' },
  { src: 'https://picsum.photos/seed/tienda-3/800/400', alt: 'Producto destacado 3' },
];

const FEATURES = [
  { icon: Award, titulo: 'Calidad garantizada', texto: 'Productos seleccionados de las mejores marcas del mercado.' },
  { icon: Truck, titulo: 'Entrega rápida', texto: 'Recibí tu pedido en tiempo récord directamente en tu puerta.' },
  { icon: MessageCircle, titulo: 'Atención por WhatsApp', texto: 'Consultanos cualquier duda directo por mensaje. ¡Respondemos rápido!' },
  { icon: Wallet, titulo: 'Mejores precios', texto: 'Precios competitivos y ofertas exclusivas para nuestros clientes.' },
];

const TESTIMONIOS = [
  {
    estrellas: '★★★★★',
    texto: '"Excelente calidad, llegó todo en perfecto estado. Los voy a recomendar a todos mis amigos."',
    inicial: 'M',
    nombre: 'Martín G.',
    tipo: 'Cliente frecuente',
  },
  {
    estrellas: '★★★★★',
    texto: '"Atención impecable por WhatsApp, respondieron al instante. Los precios son muy buenos."',
    inicial: 'S',
    nombre: 'Sofía R.',
    tipo: 'Cliente nueva',
  },
  {
    estrellas: '★★★★☆',
    texto: '"Muy buen surtido de productos. Encontré todo lo que buscaba en un solo lugar."',
    inicial: 'L',
    nombre: 'Lucas P.',
    tipo: 'Cliente frecuente',
  },
];

export function Home() {
  const { slides } = useSlides();
  const slidesCarousel = slides.length > 0 ? slides : SLIDES_POR_DEFECTO;

  return (
    <>
      <Nav />

      <section className="relative mx-auto max-w-2xl overflow-hidden px-6 pb-16 pt-20 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-400/25 blur-3xl" />
        <h1 className="mb-4.5 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
         60 min 
          <br />
          Venta de ropa Deprotiva para toda la familia 
        </h1>
        <p className="mb-9 text-lg text-slate-600">Somos 60 min Ropa deportiva
        Tu tienda de ropa deportiva, Hacemos envios a San Juan y al resto del país</p>
        <Link to="/productos" className={buttonVariants({ size: 'lg' })}>
          Ver productos
        </Link>
      </section>

      <section className="mx-auto mb-18 max-w-3xl px-3 text-center">
        <h2 className="page-title text-3xl">Algunos de nuestros productos</h2>
        <Carousel slides={slidesCarousel} />
        <Link to="/productos" className={cn(buttonVariants({ size: 'lg' }), 'mt-7')}>
          Ver catálogo completo
        </Link>
      </section>

      <section className="mx-auto mb-18 max-w-4xl px-3">
        <h2 className="page-title text-3xl">¿Por qué elegirnos?</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.titulo}
              className="rounded-2xl border border-slate-200 bg-white p-7 px-5.5 text-center shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)]"
            >
              <div className="mb-3.5 flex justify-center text-brand-600">
                <f.icon size={34} strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 font-bold text-slate-900">{f.titulo}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{f.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-18 max-w-4xl px-3">
        <h2 className="page-title text-3xl">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
          {TESTIMONIOS.map((t) => (
            <div
              key={t.nombre}
              className="rounded-2xl border border-slate-200 bg-white p-6.5 shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
            >
              <div className="mb-3 tracking-widest text-amber-500">{t.estrellas}</div>
              <p className="mb-4.5 text-sm italic leading-relaxed text-slate-600">{t.texto}</p>
              <div className="flex items-center gap-3">
                <div className="grid h-9.5 w-9.5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 font-bold text-white">
                  {t.inicial}
                </div>
                <div>
                  <strong className="block text-sm text-slate-900">{t.nombre}</strong>
                  <span className="text-xs text-slate-500">{t.tipo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto mb-0 max-w-3xl px-3 text-center">
        <h2 className="page-title text-2xl">¿Dónde estamos?</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_6px_28px_rgba(15,23,42,0.1)]">
          <iframe
            title={`Ubicación de ${NOMBRE_TIENDA}`}
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1237.8506519728473!2d-68.57522704354369!3d-31.510455894175387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1784744584776!5m2!1ses-419!2sar"
            className="h-[380px] w-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>

      <section className="mx-auto max-w-xl px-6 pb-20 pt-14 text-center">
        <h2 className="mb-3 text-3xl font-bold text-slate-900">¿Listo para hacer tu pedido?</h2>
        <p className="mb-7 text-slate-600">Explorá todo nuestro catálogo y encontrá lo que buscás.</p>
        <Link to="/productos" className={buttonVariants({ size: 'lg' })}>
          Ver todos los productos
        </Link>
      </section>
    </>
  );
}
