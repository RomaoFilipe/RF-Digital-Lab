'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';

type GalleryItem = {
  src: string;
  alt: string;
};

type Props = {
  items: GalleryItem[];
};

export function ProjectGallery({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = useMemo(() => {
    if (activeIndex === null) return null;
    return items[activeIndex] ?? null;
  }, [activeIndex, items]);

  useEffect(() => {
    if (activeIndex === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowRight') {
        setActiveIndex((prev) => {
          if (prev === null) return prev;
          return prev >= items.length - 1 ? 0 : prev + 1;
        });
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) => {
          if (prev === null) return prev;
          return prev <= 0 ? items.length - 1 : prev - 1;
        });
      }
    }
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, items.length]);

  if (!items.length) return null;

  return (
    <section className="panel p-8">
      <h2 className="font-display text-2xl text-white">Gallery</h2>

      <button
        type="button"
        onClick={() => setActiveIndex(0)}
        className="mt-4 block w-full overflow-hidden rounded-2xl border border-white/10"
      >
        <img src={items[0].src} alt={items[0].alt} className="h-72 w-full object-cover md:h-96" />
      </button>

      {items.length > 1 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {items.slice(1).map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index + 1)}
              className="overflow-hidden rounded-xl border border-white/10"
            >
              <img src={item.src} alt={item.alt} className="h-36 w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {active ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveIndex(null)}
        >
          <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-[#070d19] p-4" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-slate">
                {activeIndex! + 1} / {items.length}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={() => setActiveIndex(null)}>
                Close
              </Button>
            </div>
            <img src={active.src} alt={active.alt} className="max-h-[75vh] w-full rounded-xl object-contain" />
            <div className="mt-3 flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setActiveIndex((prev) => (prev === null ? prev : prev <= 0 ? items.length - 1 : prev - 1))
                }
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setActiveIndex((prev) => (prev === null ? prev : prev >= items.length - 1 ? 0 : prev + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
