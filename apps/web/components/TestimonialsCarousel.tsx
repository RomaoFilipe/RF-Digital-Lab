'use client';

import { useRef } from 'react';
import { Testimonial } from '../lib/content/types';
import { Button } from './ui/button';
import { Card } from './ui/card';

type Props = {
  items: Testimonial[];
};

export function TestimonialsCarousel({ items }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  function scrollByDir(dir: 'prev' | 'next') {
    if (!containerRef.current) return;
    const distance = containerRef.current.clientWidth * 0.85;
    containerRef.current.scrollBy({
      left: dir === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Testimonials</p>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => scrollByDir('prev')}>
            Prev
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => scrollByDir('next')}>
            Next
          </Button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory] scroll-smooth"
      >
        {items.map((item) => (
          <Card
            key={`${item.name}-${item.role}`}
            className="min-w-[85%] snap-start md:min-w-[420px]"
          >
            <p className="text-lg leading-8 text-sand-2">"{item.quote}"</p>
            <div className="mt-6 text-sm text-slate">
              <p className="font-medium text-white">{item.name}</p>
              <p>
                {item.role}
                {item.company ? `, ${item.company}` : ''}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
