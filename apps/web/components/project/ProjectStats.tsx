'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ShowcaseStat } from '../../lib/types';

type Props = {
  items?: ShowcaseStat[] | null;
};

function parseNumeric(value: string) {
  const normalized = value.replace(/[^0-9.]/g, '');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function AnimatedValue({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement | null>(null);

  const numeric = useMemo(() => parseNumeric(value), [value]);

  useEffect(() => {
    if (numeric === null || !ref.current) {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || started) return;
        started = true;
        const duration = 750;
        const from = 0;
        const to = numeric;
        const start = performance.now();

        const tick = (time: number) => {
          const progress = Math.min((time - start) / duration, 1);
          const current = Math.round(from + (to - from) * progress);
          setDisplay(String(current));
          if (progress < 1) frame = requestAnimationFrame(tick);
          else setDisplay(value);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [numeric, value]);

  return <span ref={ref}>{display}</span>;
}

export function ProjectStats({ items }: Props) {
  if (!items?.length) return null;

  return (
    <section className="panel p-8">
      <h2 className="font-display text-2xl text-white">Project stats</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              <AnimatedValue value={item.value} />
              {item.unit ? <span className="ml-1 text-base text-slate">{item.unit}</span> : null}
            </p>
            {item.source ? <p className="mt-1 text-xs text-slate">Source: {item.source}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
