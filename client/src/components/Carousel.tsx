import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  src: string;
  alt: string;
}

export function Carousel({ slides }: { slides: Slide[] }) {
  const [indice, setIndice] = useState(0);
  const intervaloRef = useRef<number | undefined>(undefined);

  function iniciarAuto() {
    detenerAuto();
    intervaloRef.current = window.setInterval(() => {
      setIndice((i) => (i + 1) % slides.length);
    }, 3000);
  }

  function detenerAuto() {
    if (intervaloRef.current) window.clearInterval(intervaloRef.current);
  }

  useEffect(() => {
    iniciarAuto();
    return detenerAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  function irA(i: number) {
    setIndice((i + slides.length) % slides.length);
    iniciarAuto();
  }

  const slide = slides[indice];
  if (!slide) return null;

  return (
    <div>
      <div className="relative mx-auto w-fit max-w-full">
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className="mx-auto max-h-[480px] w-auto max-w-full rounded-2xl object-contain shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        />

        <button
          onClick={() => irA(indice - 1)}
          aria-label="Anterior"
          className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white transition hover:bg-black/70"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => irA(indice + 1)}
          aria-label="Siguiente"
          className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white transition hover:bg-black/70"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="mt-3.5 flex justify-center gap-2">
        {slides.map((s, i) => (
          <span
            key={s.src}
            onClick={() => irA(i)}
            className={`h-2.5 w-2.5 cursor-pointer rounded-full transition ${
              i === indice ? 'scale-125 bg-brand-600' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
